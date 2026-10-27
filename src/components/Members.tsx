import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { membersData } from '../data/members'
import PageIntro from './PageIntro'
import WebpImage from './WebpImage'
import type { MemberProfile } from '../types/content'

function MemberPhoto({ src, name }: { src: string; name: string }) {
  const [failed, setFailed] = useState(false)
  const initials = name.trim().split(/\s+/).map(part => Array.from(part)[0]).slice(0, 2).join('')
  return <div className="member-photo-frame">
    {src && !failed ? <WebpImage src={src} alt={`${name} 프로필 사진`} className="member-photo" onError={() => setFailed(true)} /> :
      <div className="member-photo-fallback" role="img" aria-label={`${name} 프로필 사진 준비 중`}><span aria-hidden="true">{initials}</span><small>사진 준비 중</small></div>}
  </div>
}

export default function Members({ data = membersData }: { data?: { current: MemberProfile[]; alumni: MemberProfile[] } }) {
  return <div className="site-container editorial-page">
    <PageIntro label="" title="Group Members" />
    {(['current', 'alumni'] as const).map(group => <section key={group} className="people-section">
      <h2>{group === 'current' ? 'Current Members' : 'Alumni'} <span>{String(data[group].length).padStart(2, '0')}</span></h2>
      <div className="people-grid">{data[group].map((member, i) => <article className="person" key={member.name}>
        <span className="method-number">{String(i + 1).padStart(2, '0')}</span>
        <div className="member-name-row"><h3>{member.name}</h3><MemberPhoto key={member.img} src={member.img} name={member.name} /></div><p>{member.degree}</p>
        {member.email && <a className="text-link" href={`mailto:${member.email}`}>{member.email}<ArrowUpRight size={15} /></a>}
        {member.currentPos && <p>{member.currentPos}</p>}
      </article>)}</div>
    </section>)}
  </div>
}
