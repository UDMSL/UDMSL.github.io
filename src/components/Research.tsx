import { researchData } from '../data/research'
import PageIntro from './PageIntro'
export default function Research() {
 return <div className="site-container editorial-page">
  <PageIntro label="" title="Research" />
  <div className="original-research-intro">
   <section lang="ko"><h2>연구 개요 <span>KOR</span></h2>{researchData.intro.ko.map(p=><p key={p}>{p}</p>)}</section>
   <section lang="en"><h2>Research Overview <span>ENG</span></h2>{researchData.intro.en.map(p=><p key={p}>{p}</p>)}</section>
  </div>
  <section className="method-list"><h2 className="original-methods-title">Key Methodologies</h2>
   {researchData.highlights.map((item,i)=><article key={item.slug} id={item.slug} tabIndex={-1} className="method-row"><span className="method-number">0{i+1}</span><h2>{item.title}</h2><div><p>{item.desc}</p><p>{item.detail}</p></div></article>)}
  </section>
 </div>
}
