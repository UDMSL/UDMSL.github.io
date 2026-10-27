import { ArrowUpRight } from 'lucide-react';
import { membersData } from '../data/members';
import PageIntro from './PageIntro';
import WebpImage from './WebpImage';
export default function Members() {
    return <div className="site-container editorial-page"><PageIntro label="" title="Group Members"/>{(['current', 'alumni'] as const).map(group => <section key={group} className="people-section"><h2>{group === 'current' ? "Current Members" : "Alumni"} <span>{String(membersData[group].length).padStart(2, '0')}</span></h2><div className="people-grid">{membersData[group].map((member, i) => <article className="person" key={member.name}><span className="method-number">{String(i + 1).padStart(2, '0')}</span>{member.img && !member.img.includes('placehold.co') && <WebpImage src={member.img} alt={member.name} className="member-photo"/>}<h3>{member.name}</h3><p>{member.degree}</p>{member.email && <a className="text-link" href={`mailto:${member.email}`}>{member.email}<ArrowUpRight size={15}/></a>}{member.currentPos && <p>{member.currentPos}</p>}</article>)}</div></section>)}</div>;
}
