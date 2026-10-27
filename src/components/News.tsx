import type { NewsPost } from '../types/content'
import { newsPosts } from '../data/news';
import WebpImage from './WebpImage';
import PageIntro from './PageIntro';
export default function News({ items = newsPosts }: { items?: NewsPost[] }) {
    return <div className="site-container editorial-page"><PageIntro label="" title="Lab News"/><div>{items.map(item => <article key={item.slug} className="news-row"><time dateTime={item.date}>{item.date}</time><div><h2>{item.title}</h2><p>{item.content}</p></div>{item.image && !item.image.includes('placehold.co') && <WebpImage src={item.image} alt={item.title}/>}</article>)}</div></div>;
}
