import { generalInfo } from '../data/general'
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { researchData } from '../data/research';
import { publicationList } from '../data/publications';
import { splitCitation } from '../utils/citation';
import Recruitment from './Recruitment';
export default function Home() {
    const methods = researchData.highlights;
    return <div className="home-editorial">
    <section className="home-hero">
      <div className="hero-copy"><p className="eyebrow">UDMS Lab.</p><h1 className="original-lab-title">{generalInfo.labName}</h1><p className="hero-description">{generalInfo.affiliation}</p><Link className="primary-link" to="/research">Research <ArrowUpRight size={18}/></Link></div>
      <figure className="hero-image"><img src="/img/redesign/laser-hero-selected.png" alt={"보라색 레이저와 렌즈가 배치된 광학 실험 장치"} width="1536" height="1024" fetchPriority="high"/></figure>
    </section>
    <div className="site-container"><Recruitment /></div>
    <section className="original-highlights site-container"><div className="section-heading"><h2>Research Highlights</h2></div><div className="original-highlights-grid">{methods.map((item,i)=><Link key={item.slug} to={`/research#${item.slug}`} className="method-preview"><span className="method-number">0{i+1}</span><h3>{item.title}</h3><p>{item.desc}</p><ArrowUpRight size={19}/></Link>)}</div></section>
    <section className="latest-section site-container"><div className="section-heading"><h2>{"최근 연구 성과"}</h2><Link className="text-link" to="/publications">{"전체 논문" + " "}<ArrowRight size={17}/></Link></div><div className="latest-grid">{publicationList.slice(0, 2).map(pub => { const citation = splitCitation(pub.text); return <article key={pub.slug} className="latest-paper"><p className="eyebrow">{pub.year}{"/ 연구 논문"}</p><h3>{citation.title}</h3><p className="publication-details">{citation.details}</p><a className="text-link" href={`https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer">{"논문 읽기" + " "}<ArrowUpRight size={16}/></a></article>; })}</div></section>
  </div>;
}
