import { ArrowUpRight, Github, MapPin } from 'lucide-react';

export default function ProfileCard({ profile, username, loading }) {
  const name = profile?.name || username;
  const initials = name.split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase();
  return <aside className="profile-card" aria-label="Perfil em exploração">
    <div className="profile-card-heading"><Github size={20} aria-hidden="true" /><span>DO GITHUB PARA SUAS IDEIAS</span><span className="profile-decoration" aria-hidden="true" /></div>
    <div className="profile-identity">
      <div className="profile-avatar"><span>{initials}</span>{profile?.avatar && <img key={profile.avatar} src={profile.avatar} alt="" width="76" height="76" onError={event => { event.currentTarget.style.display = 'none'; }} />}</div>
      <div><h2>{name}</h2><span>@{profile?.login || username}</span></div>
    </div>
    <p>{loading ? 'Carregando informações públicas do perfil…' : profile?.bio || 'Explore os projetos públicos, descubra ideias e acompanhe o aprendizado através do código.'}</p>
    <div className="profile-card-footer">{profile?.location ? <span><MapPin size={14} aria-hidden="true" />{profile.location}</span> : <span>Projetos de código aberto</span>}<a href={profile?.url || `https://github.com/${encodeURIComponent(username)}`} target="_blank" rel="noopener noreferrer">Ver perfil<ArrowUpRight size={15} aria-hidden="true" /></a></div>
  </aside>;
}
