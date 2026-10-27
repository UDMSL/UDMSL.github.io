import { galleryImages } from '../data/gallery';
import WebpImage from './WebpImage';
import PageIntro from './PageIntro';
export default function Gallery() {
    return <div className="site-container editorial-page"><PageIntro label="" title="Gallery"/><div className="gallery-grid">{galleryImages.map(item => <figure key={item.slug}><a href={item.img} target="_blank" rel="noopener noreferrer" aria-label={`${'사진 크게 보기'}: ${item.title}`}><WebpImage src={item.img} alt={item.title}/></a><figcaption><h2>{item.title}</h2><time dateTime={item.date}>{item.date}</time></figcaption></figure>)}</div></div>;
}
