import { ArrowUpRight } from 'lucide-react';
import { professorProfile as profile } from '../data/professor';
import WebpImage from './WebpImage';
import PageIntro from './PageIntro';
export default function Professor() {
    return <div className="site-container editorial-page"><PageIntro label="" title={profile.name} description={`${profile.title} / ${profile.affiliation}`}/><div className="professor-grid"><aside><WebpImage src={profile.img} alt={profile.name} className="professor-photo"/><h2>{profile.name}</h2><a className="text-link" href={`mailto:${profile.email}`}>{profile.email}<ArrowUpRight size={16}/></a><p>{profile.phone}</p>{profile.office.map(loc => <p key={loc}>{loc}</p>)}{profile.cvLink && profile.cvLink !== '#' && <a className="text-link" href={profile.cvLink}>{"이력서 내려받기" + " "}<ArrowUpRight size={16}/></a>}</aside><div className="professor-body"><section><h2>{"Biography"}</h2>{profile.bio.map(p => <p key={p}>{p}</p>)}</section>{(['education', 'career'] as const).map(section => <section key={section}><h2>{section === 'education' ? "Education" : "Career"}</h2>{profile[section].map(item => <div className="timeline-row" key={`${item.year}-${item.desc}`}><span>{item.year}</span><p>{item.desc}</p></div>)}</section>)}</div></div></div>;
}
