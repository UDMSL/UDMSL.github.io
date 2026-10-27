import { useState } from 'react';
import { ArrowUpRight, Search } from 'lucide-react';
import { publicationList } from '../data/publications';
import { splitCitation } from '../utils/citation';
import PageIntro from './PageIntro';
export default function Publications() {
    const [query, setQuery] = useState('');
    const [year, setYear] = useState('all');
    const years = [...new Set(publicationList.map(p => p.year))];
    const filtered = publicationList.filter(p => (year === 'all' || String(p.year) === year) && `${p.text} ${p.doi}`.toLowerCase().includes(query.trim().toLowerCase()));
    return <div className="site-container editorial-page"><PageIntro label="" title="Publications"/><div className="publication-controls"><label className="search-field"><Search size={18}/><input aria-label={"논문 검색"} placeholder={"제목, 학술지 또는 DOI 검색"} value={query} onChange={e => setQuery(e.target.value)}/></label><label className="year-field"><span>{"연도"}</span><select aria-label={"출판 연도"} value={year} onChange={e => setYear(e.target.value)}><option value="all">{"전체 연도"}</option>{years.map(y => <option key={y} value={y}>{y}</option>)}</select></label><span role="status">{"논문" + " "}{filtered.length}{"편"}</span>{(query || year !== 'all') && <button className="text-link" onClick={() => { setQuery(''); setYear('all'); }}>{"필터 초기화"}</button>}</div><div className="publication-list">{filtered.map((pub, i) => { const c = splitCitation(pub.text); return <article className="publication-row" key={pub.slug}><p className="publication-year">{i === 0 || filtered[i - 1].year !== pub.year ? pub.year : ''}</p><div><h2>{c.title}</h2>{c.details && <p className="publication-details">{c.details}</p>}</div><a className="text-link" aria-label={`${'논문 열기'}: ${c.title}`} href={pub.doi ? `https://doi.org/${pub.doi}` : `https://scholar.google.com/scholar?q=${encodeURIComponent(pub.text)}`} target="_blank" rel="noopener noreferrer">{pub.doi ? 'DOI' : 'Scholar'}<ArrowUpRight size={17}/></a></article>; })}{!filtered.length && <div className="empty-results"><h2>{"검색 결과가 없습니다"}</h2><p>{"다른 제목, 학술지 또는 연도로 검색해 보세요."}</p></div>}</div></div>;
}
