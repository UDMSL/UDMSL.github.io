import { newsPosts } from '../data/news'
import WebpImage from './WebpImage'

// Use a stable placeholder to avoid broken thumbnails
const placeholderImg = 'https://placehold.co/96x96?text=News'

const News = () => {
  return (
    <div className="max-w-5xl mx-auto py-12 px-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">Lab News</h2>
      </div>
      <div className="space-y-6">
        {newsPosts.map((item) => (
          <div
            key={item.slug}
            className="glass-panel p-6 rounded-2xl shadow-lg border border-white/70 transition-transform duration-200 hover:scale-[1.01] hover:shadow-xl"
          >
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="text-sm text-primary font-bold mb-2">{item.date}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-700 whitespace-pre-line">{item.content}</p>
              </div>
              <WebpImage
                src={item.image || placeholderImg}
                fallbackSrc={placeholderImg}
                alt={`${item.title} thumbnail`}
                className="w-20 h-20 rounded-full object-cover border border-gray-100 shadow-sm flex-shrink-0"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default News
