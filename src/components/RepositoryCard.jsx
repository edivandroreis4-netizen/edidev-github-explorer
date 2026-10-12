import { ArrowUpRight, FolderGit2, GitFork, Star } from 'lucide-react';
import { formatDate } from '../utils/repositories.js';

export default function RepositoryCard({ repository }) {
  return <article className="repo-card">
    <div className="repo-top"><span className="repo-icon"><FolderGit2 size={22} aria-hidden="true" /></span><span className="repo-visibility">{repository.archived ? 'Arquivado' : repository.fork ? 'Fork público' : 'Público'}</span></div>
    <h3><a href={repository.url} target="_blank" rel="noopener noreferrer">{repository.name}</a></h3>
    <p className="repo-description">{repository.description || 'Este repositório ainda não possui uma descrição no GitHub.'}</p>
    <div className="repo-metadata"><span className="language-label"><span className="language-dot" aria-hidden="true" />{repository.language || 'Sem linguagem definida'}</span><span aria-label={`${repository.stars} estrelas`}><Star size={14} aria-hidden="true" />{repository.stars}</span><span aria-label={`${repository.forks} forks`}><GitFork size={14} aria-hidden="true" />{repository.forks}</span></div>
    <div className="repo-bottom"><span>Atualizado em {formatDate(repository.updatedAt)}</span><a href={repository.url} target="_blank" rel="noopener noreferrer" aria-label={`Abrir ${repository.name} no GitHub em nova aba`}><ArrowUpRight size={18} aria-hidden="true" /></a></div>
  </article>;
}
