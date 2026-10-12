import { useState } from 'react';
import { ArrowRight, CircleAlert, FolderSearch, Github, LoaderCircle, RefreshCw, Search, SlidersHorizontal, X } from 'lucide-react';
import ProfileCard from '../components/ProfileCard.jsx';
import RepositoryCard from '../components/RepositoryCard.jsx';
import { validateUsername } from '../services/github.js';
import { selectRepositories } from '../utils/repositories.js';

export default function Repositories({ username, onUsernameChange, data }) {
  const [profileInput, setProfileInput] = useState(username);
  const [inputError, setInputError] = useState('');
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('all');
  const [sort, setSort] = useState('recent');
  const { profile, repositories, status, error, nextPage, loadingMore, moreError, loadMore, refresh } = data;
  const languages = [...new Set(repositories.map(repo => repo.language).filter(Boolean))].sort();
  const visible = selectRepositories(repositories, { query, language, sort });
  const busy = status === 'loading';
  const hasFilters = !!query || language !== 'all';

  function changeProfile(event) {
    event.preventDefault();
    try {
      const valid = validateUsername(profileInput);
      setInputError('');
      if (valid.toLowerCase() === username.toLowerCase()) refresh();
      else onUsernameChange(valid);
    } catch (failure) { setInputError(failure.message); }
  }

  function clearFilters() { setQuery(''); setLanguage('all'); }

  return <main id="main-content">
    <section className="hero container" aria-labelledby="hero-title">
      <div className="hero-copy"><div className="eyebrow"><span />IDEIAS QUE GANHAM VIDA EM CÓDIGO</div><h1 id="hero-title">Explore ideias.<br /><em>Descubra projetos.</em></h1><p>Um espaço para conhecer repositórios, explorar tecnologias e encontrar inspiração para o próximo passo.</p><a className="hero-about" href="#sobre">Conheça o desenvolvedor<ArrowRight size={17} aria-hidden="true" /></a></div>
      <ProfileCard profile={profile} username={username} loading={busy} />
    </section>
    <section className="repository-section container" aria-labelledby="repositories-heading">
      <div className="section-heading"><div><div className="eyebrow">CÓDIGO, APRENDIZADO E POSSIBILIDADES</div><h2 id="repositories-heading">Repositórios públicos<span className="heading-dot">.</span></h2></div><button className="refresh-button" type="button" onClick={refresh} disabled={busy || loadingMore}><RefreshCw size={16} className={busy ? 'spin' : ''} aria-hidden="true" />Atualizar</button></div>
      <div className="explorer-toolbar">
        <form className="profile-form" onSubmit={changeProfile}><label htmlFor="github-username">Perfil do GitHub</label><div className="profile-form-row"><span className="input-icon"><Github size={17} aria-hidden="true" /></span><input id="github-username" value={profileInput} onChange={event => { setProfileInput(event.target.value); setInputError(''); }} required maxLength={40} autoCapitalize="none" autoComplete="off" spellCheck="false" aria-invalid={!!inputError} aria-describedby={inputError ? 'username-error' : undefined} /><button className="button button-primary" disabled={busy} type="submit">Explorar<ArrowRight size={16} aria-hidden="true" /></button></div>{inputError && <p className="form-error" id="username-error" role="alert">{inputError}</p>}</form>
        <div className="toolbar-note"><span className="note-symbol"><SlidersHorizontal size={18} aria-hidden="true" /></span><p>Explore um perfil público.<br /><strong>Encontre o projeto que procura.</strong></p></div>
      </div>
      <div className="filters-row"><div className="search-field"><label className="sr-only" htmlFor="repo-search">Buscar nos repositórios carregados</label><Search size={18} aria-hidden="true" /><input id="repo-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar por nome ou descrição..." disabled={status !== 'success'} />{query && <button type="button" onClick={() => setQuery('')} aria-label="Limpar busca"><X size={16} aria-hidden="true" /></button>}</div><div className="select-field"><label htmlFor="language-filter">Linguagem</label><select id="language-filter" value={language} onChange={event => setLanguage(event.target.value)} disabled={status !== 'success'}><option value="all">Todas</option>{languages.map(item => <option key={item} value={item}>{item}</option>)}{repositories.some(repo => !repo.language) && <option value="none">Não definida</option>}</select></div><div className="select-field"><label htmlFor="sort-order">Ordenar por</label><select id="sort-order" value={sort} onChange={event => setSort(event.target.value)} disabled={status !== 'success'}><option value="recent">Mais recentes</option><option value="name">Nome: A–Z</option><option value="stars">Mais estrelas</option></select></div></div>
      {username.toLowerCase() === 'octocat' && <p className="example-profile-note">Você está explorando um perfil público de exemplo. Para ver seus projetos, informe seu usuário do GitHub acima.</p>}
      <div className="results-caption" role="status"><span>{busy ? 'Carregando repositórios…' : status === 'error' ? 'Consulta indisponível no momento' : `${visible.length} ${visible.length === 1 ? 'repositório exibido' : 'repositórios exibidos'} de ${repositories.length} carregados`}</span><span>{nextPage ? 'Busca nos itens carregados' : 'Dados públicos do GitHub'}</span></div>
      <div aria-busy={busy}>
        {busy && <div className="repo-grid skeleton-grid" aria-hidden="true">{Array.from({ length: 6 }, (_, index) => <div className="repo-skeleton" key={index}><span className="skeleton-icon" /><span className="skeleton-line long" /><span className="skeleton-line" /><span className="skeleton-line short" /></div>)}</div>}
        {status === 'error' && <div className="empty-state"><CircleAlert size={32} aria-hidden="true" /><h3>Não conseguimos carregar esse perfil.</h3><p role="alert">{error}</p><button type="button" className="button button-primary" onClick={refresh}>Tentar novamente<RefreshCw size={16} aria-hidden="true" /></button></div>}
        {status === 'success' && visible.length > 0 && <div className="repo-grid">{visible.map(repo => <RepositoryCard repository={repo} key={repo.id} />)}</div>}
        {status === 'success' && visible.length === 0 && <div className="empty-state"><FolderSearch size={34} aria-hidden="true" /><h3>{repositories.length === 0 ? 'Nenhum repositório público por aqui.' : 'Nenhum projeto encontrado.'}</h3><p>{repositories.length === 0 ? 'Este perfil ainda não possui repositórios públicos para mostrar.' : 'Experimente outra busca ou remova o filtro de linguagem.'}</p>{hasFilters && <button className="button button-secondary" type="button" onClick={clearFilters}>Limpar filtros</button>}</div>}
      </div>
      {moreError && <p className="pagination-error" role="alert">{moreError}</p>}
      {status === 'success' && nextPage && <div className="load-more"><button className="button button-secondary" type="button" onClick={loadMore} disabled={loadingMore}>{loadingMore ? <LoaderCircle size={17} className="spin" aria-hidden="true" /> : <ArrowRight size={17} aria-hidden="true" />}{loadingMore ? 'Carregando…' : moreError ? 'Tentar carregar mais' : 'Carregar mais repositórios'}</button></div>}
    </section>
    <section className="bottom-callout container"><div><span className="small-eyebrow">POR TRÁS DO CÓDIGO</span><h2>Cada projeto, um novo aprendizado.</h2></div><a href="#sobre">Conheça minha trajetória<ArrowUpRightIcon /></a></section>
  </main>;
}

function ArrowUpRightIcon() { return <ArrowRight size={18} aria-hidden="true" />; }
