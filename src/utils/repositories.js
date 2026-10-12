export function selectRepositories(repositories, { query = '', language = 'all', sort = 'recent' } = {}) {
  const term = query.trim().toLocaleLowerCase('pt-BR');
  const selected = repositories.filter(repo => {
    const text = `${repo.name} ${repo.description}`.toLocaleLowerCase('pt-BR');
    return text.includes(term) && (language === 'all' || (language === 'none' ? !repo.language : repo.language === language));
  });
  return selected.sort((a, b) => {
    if (sort === 'name') return a.name.localeCompare(b.name, 'pt-BR');
    if (sort === 'stars') return b.stars - a.stars || a.name.localeCompare(b.name, 'pt-BR');
    return (Date.parse(b.updatedAt) || 0) - (Date.parse(a.updatedAt) || 0);
  });
}

export function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Data não informada';
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
}
