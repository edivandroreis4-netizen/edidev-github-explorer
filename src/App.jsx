import { useEffect, useState } from 'react';
import { ArrowUpRight, Code2, Github } from 'lucide-react';
import Header from './components/Header.jsx';
import About from './pages/About.jsx';
import Repositories from './pages/Repositories.jsx';
import useGithub from './hooks/useGithub.js';
import { DEFAULT_USERNAME, DEVELOPER } from './config.js';

function currentScreen() { return window.location.hash === '#sobre' ? 'sobre' : 'repositorios'; }

export default function App() {
  const [screen, setScreen] = useState(currentScreen);
  const [username, setUsername] = useState(DEFAULT_USERNAME);
  const data = useGithub(username);

  useEffect(() => {
    function handleNavigation() {
      if (!['', '#', '#repositorios', '#sobre'].includes(window.location.hash)) return;
      setScreen(currentScreen());
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
    window.addEventListener('hashchange', handleNavigation);
    return () => window.removeEventListener('hashchange', handleNavigation);
  }, []);

  useEffect(() => {
    document.title = `${screen === 'sobre' ? 'Sobre mim' : 'Repositórios'} — EdiDev`;
  }, [screen]);

  return <><a className="skip-link" href="#main-content">Pular para o conteúdo</a><Header screen={screen} />
    {screen === 'sobre' ? <About /> : <Repositories key={username} username={username} onUsernameChange={setUsername} data={data} />}
    <footer className="site-footer"><div className="container footer-inner"><div><span className="footer-brand"><Code2 size={17} aria-hidden="true" />EdiDev.</span><p>Feito com curiosidade e vontade de aprender.</p></div><div className="footer-links"><span>React · GitHub API</span><a href={DEVELOPER.github || 'https://github.com'} target="_blank" rel="noopener noreferrer"><Github size={16} aria-hidden="true" />GitHub<ArrowUpRight size={13} aria-hidden="true" /></a></div></div></footer>
  </>;
}
