import { ArrowRight, ArrowUpRight, Code2, Github, GraduationCap, MapPin, Sprout } from 'lucide-react';
import { DEVELOPER } from '../config.js';

const technologies = ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Node.js', 'Git e GitHub'];

export default function About() {
  return <main id="main-content" className="container about-main">
    <div className="eyebrow"><span />UM POUCO SOBRE MIM</div>
    <div className="about-layout">
      <div className="about-story"><h1>Curiosidade que vira<br /><em>aprendizado.</em></h1><p className="about-lead">Olá, sou Edivandro Lima.<br />Estudante de ADS e apaixonado por tecnologia.</p><p>Estou construindo minha trajetória no desenvolvimento de sistemas, unindo estudo e prática para transformar ideias em aplicações úteis.</p><p>Estudo interfaces web, APIs e bancos de dados. A cada projeto, procuro entender não apenas como fazer, mas por que cada decisão ajuda a construir uma experiência melhor.</p><div className="about-actions"><a className="button button-primary" href="#repositorios">Explorar repositórios<ArrowRight size={17} aria-hidden="true" /></a>{DEVELOPER.github && <a className="text-link" href={DEVELOPER.github} target="_blank" rel="noopener noreferrer">Meu GitHub<ArrowUpRight size={16} aria-hidden="true" /></a>}</div></div>
      <aside className="developer-card"><div className="developer-art" aria-hidden="true"><span className="art-grid" /><span className="art-mark"><Code2 size={72} strokeWidth={1.5} /></span><span className="art-label">sempre aprendendo.</span></div><div className="developer-info"><span className="small-eyebrow">DESENVOLVEDOR EM FORMAÇÃO</span><h2>{DEVELOPER.name}</h2><p><MapPin size={16} aria-hidden="true" />{DEVELOPER.location}</p><p><GraduationCap size={18} aria-hidden="true" />{DEVELOPER.education}</p>{DEVELOPER.github && <a href={DEVELOPER.github} target="_blank" rel="noopener noreferrer"><Github size={17} aria-hidden="true" />Meu perfil no GitHub<ArrowUpRight size={15} aria-hidden="true" /></a>}</div></aside>
    </div>
    <section className="learning-section" aria-labelledby="learning-heading"><div><div className="eyebrow"><Sprout size={15} aria-hidden="true" />EM CONSTANTE EVOLUÇÃO</div><h2 id="learning-heading">Minha trilha de estudos</h2><p>Tecnologias que fazem parte do meu aprendizado.</p></div><div className="technology-list">{technologies.map(technology => <span key={technology}>{technology}</span>)}</div></section>
    <section className="about-project" aria-labelledby="about-project-heading"><span className="about-project-icon"><Code2 size={23} aria-hidden="true" /></span><div><h2 id="about-project-heading">Um projeto para aprender fazendo.</h2><p>Este GitHub Explorer foi desenvolvido para o checkpoint “Criando uma SPA com React”, colocando em prática componentes, estados, navegação entre telas e consumo de API pública.</p></div></section>
  </main>;
}
