import test from 'node:test';
import assert from 'node:assert/strict';
import { fetchProfile, fetchRepositories, normalizeRepository, validateUsername } from '../src/services/github.js';
import { formatDate, selectRepositories } from '../src/utils/repositories.js';

function response(data, { status = 200, link = '' } = {}) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', Link: link } });
}

const repository = { id: 1, name: 'react-labs', description: 'Estudos React', language: 'JavaScript', stargazers_count: 3, forks_count: 1, pushed_at: '2026-10-01T12:00:00Z', html_url: 'https://github.com/edi/react-labs', private: false };

test('valida usuário e bloqueia caminhos ou nomes inválidos antes de consultar', () => {
  assert.equal(validateUsername(' @edi-dev '), 'edi-dev');
  for (const value of ['', '../edi', '-edi', 'edi-', 'edi--dev', 'edi/dev', 'a'.repeat(40)]) assert.throws(() => validateUsername(value));
});

test('consulta repositórios com paginação, ignora privados e informa a próxima página', async () => {
  let actualUrl;
  const result = await fetchRepositories('edi', { fetcher: async url => {
    actualUrl = url;
    return response([repository, { ...repository, id: 2, private: true }], { link: '<https://api.github.com/users/edi/repos?page=2>; rel="next"' });
  } });
  assert.match(actualUrl, /\/users\/edi\/repos\?per_page=100&sort=pushed&direction=desc&page=1$/);
  assert.equal(result.repositories.length, 1);
  assert.equal(result.nextPage, 2);
});

test('última página não gera paginação e dados malformados não viram cards', async () => {
  const result = await fetchRepositories('edi', { fetcher: async () => response([null, {}, repository]) });
  assert.equal(result.repositories.length, 1);
  assert.equal(result.nextPage, null);
  await assert.rejects(fetchRepositories('edi', { fetcher: async () => response({ unexpected: true }) }), /lista inválida/);
});

test('perfil ausente, limite da API e falha de rede têm mensagens distintas', async () => {
  await assert.rejects(fetchProfile('edi', { fetcher: async () => response({}, { status: 404 }) }), /não foi encontrado/);
  await assert.rejects(fetchProfile('edi', { fetcher: async () => response({}, { status: 429 }) }), /limitou temporariamente/);
  await assert.rejects(fetchRepositories('edi', { fetcher: async () => { throw new TypeError('Failed to fetch'); } }), /conectar ao GitHub/);
});

test('cancelamento de requisição é preservado para evitar atualização obsoleta', async () => {
  const failure = new DOMException('Canceled', 'AbortError');
  await assert.rejects(fetchRepositories('edi', { fetcher: async () => { throw failure; } }), error => error.name === 'AbortError');
});

test('URLs externas inesperadas não são expostas como links ou imagens de perfil', async () => {
  const result = normalizeRepository({ ...repository, html_url: 'javascript:alert(1)' }, 'edi');
  assert.equal(result.url, 'https://github.com/edi/react-labs');
  const profile = await fetchProfile('edi', { fetcher: async () => response({ login: 'edi', avatar_url: 'https://example.com/tracking.png', html_url: 'https://github.com.evil.test/edi' }) });
  assert.equal(profile.avatar, '');
  assert.equal(profile.url, 'https://github.com/edi');
});

test('busca e linguagem funcionam juntas, ordenação não altera a lista de origem', () => {
  const repos = [normalizeRepository(repository, 'edi'), normalizeRepository({ ...repository, id: 2, name: 'api-cep', language: 'TypeScript', description: null, stargazers_count: 7 }, 'edi')];
  const copy = [...repos];
  assert.deepEqual(selectRepositories(repos, { query: ' REACT ', language: 'TypeScript' }), []);
  assert.equal(selectRepositories(repos, { query: 'Estudos', language: 'JavaScript' }).length, 1);
  assert.equal(selectRepositories(repos, { sort: 'stars' })[0].name, 'api-cep');
  assert.equal(selectRepositories(repos, { sort: 'name' })[0].name, 'api-cep');
  assert.deepEqual(repos, copy);
  assert.equal(formatDate('not-a-date'), 'Data não informada');
});
