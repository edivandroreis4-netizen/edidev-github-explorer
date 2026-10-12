import { ArrowUpRight, Code2, Github } from 'lucide-react';
import { DEVELOPER } from '../config.js';

export default function Header({ screen }) {
  return <header className="site-header">
    <div className="container header-inner">
      <a className="brand" href="#repositorios" aria-label="EdiDev — Início">
        <span className="brand-symbol"><Code2 size={23} strokeWidth={2} aria-hidden="true" /></span>
        <span>EdiDev<span className="brand-dot">.</span><small>GITHUB EXPLORER</small></span>
      </a>
      <nav className="main-nav" aria-label="Navegação principal">
        <a href="#repositorios" aria-current={screen === 'repositorios' ? 'page' : undefined}>Repositórios</a>
        <a href="#sobre" aria-current={screen === 'sobre' ? 'page' : undefined}>Sobre mim</a>
      </nav>
      <a className="header-github" href={DEVELOPER.github || 'https://github.com'} target="_blank" rel="noopener noreferrer"><Github size={17} aria-hidden="true" /><span>{DEVELOPER.github ? 'Meu GitHub' : 'GitHub'}</span><ArrowUpRight size={15} aria-hidden="true" /></a>
    </div>
  </header>;
}
