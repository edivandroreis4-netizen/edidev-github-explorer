const API_URL = 'https://api.github.com';
const HEADERS = { Accept: 'application/vnd.github+json' };

export class GithubError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = 'GithubError';
    this.status = status;
  }
}

export function validateUsername(value) {
  const username = value.trim().replace(/^@/, '');
  if (!/^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i.test(username) || username.includes('--')) {
    throw new GithubError('Informe um usuário válido do GitHub, usando letras, números e hífens.');
  }
  return username;
}

async function request(path, signal, fetcher) {
  let response;
  try {
    response = await fetcher(`${API_URL}${path}`, { headers: HEADERS, signal });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new GithubError('Não foi possível conectar ao GitHub. Confira sua conexão e tente novamente.');
  }

  if (!response.ok) {
    if (response.status === 404) throw new GithubError('Este perfil não foi encontrado no GitHub. Confira o nome do usuário.', 404);
    if (response.status === 403 || response.status === 429) {
      throw new GithubError('O GitHub limitou temporariamente as consultas. Aguarde alguns minutos e tente novamente.', response.status);
    }
    throw new GithubError('O GitHub não conseguiu responder agora. Tente novamente em instantes.', response.status);
  }

  try {
    return { data: await response.json(), headers: response.headers };
  } catch {
    throw new GithubError('O GitHub retornou uma resposta inesperada. Tente novamente.');
  }
}

function publicGithubUrl(value, fallback) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname === 'github.com' ? url.href : fallback;
  } catch {
    return fallback;
  }
}

export function normalizeRepository(repo, username) {
  if (!repo || typeof repo.id !== 'number' || typeof repo.name !== 'string') return null;
  return {
    id: repo.id,
    name: repo.name,
    description: typeof repo.description === 'string' ? repo.description : '',
    language: typeof repo.language === 'string' ? repo.language : null,
    stars: Number.isFinite(repo.stargazers_count) ? repo.stargazers_count : 0,
    forks: Number.isFinite(repo.forks_count) ? repo.forks_count : 0,
    updatedAt: typeof repo.pushed_at === 'string' ? repo.pushed_at : repo.updated_at,
    url: publicGithubUrl(repo.html_url, `https://github.com/${username}/${encodeURIComponent(repo.name)}`),
    archived: repo.archived === true,
    fork: repo.fork === true,
  };
}

export async function fetchProfile(value, { signal, fetcher = fetch } = {}) {
  const username = validateUsername(value);
  const { data } = await request(`/users/${encodeURIComponent(username)}`, signal, fetcher);
  if (!data || typeof data.login !== 'string') throw new GithubError('O GitHub retornou um perfil inválido. Tente novamente.');
  let avatar = '';
  try {
    const url = new URL(data.avatar_url);
    if (url.protocol === 'https:' && url.hostname === 'avatars.githubusercontent.com') avatar = url.href;
  } catch { /* Um perfil sem imagem utiliza as iniciais. */ }
  return {
    login: data.login,
    name: typeof data.name === 'string' && data.name ? data.name : data.login,
    bio: typeof data.bio === 'string' ? data.bio : '',
    location: typeof data.location === 'string' ? data.location : '',
    avatar,
    url: publicGithubUrl(data.html_url, `https://github.com/${username}`),
    publicRepos: Number.isFinite(data.public_repos) ? data.public_repos : 0,
  };
}

export async function fetchRepositories(value, { page = 1, signal, fetcher = fetch } = {}) {
  const username = validateUsername(value);
  if (!Number.isInteger(page) || page < 1) throw new GithubError('Página inválida.');
  const { data, headers } = await request(`/users/${encodeURIComponent(username)}/repos?per_page=100&sort=pushed&direction=desc&page=${page}`, signal, fetcher);
  if (!Array.isArray(data)) throw new GithubError('O GitHub retornou uma lista inválida. Tente novamente.');
  const repositories = data.filter(repo => repo && !repo.private).map(repo => normalizeRepository(repo, username)).filter(Boolean);
  const hasNextPage = /<[^>]+>;\s*rel="next"/.test(headers.get('link') || '');
  return { repositories, nextPage: hasNextPage ? page + 1 : null };
}
