import { newsPosts } from '../data/news'

const News = () => {
  const placeholderImg = 'https://placehold.co/96x96?text=News'

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">Lab News</h2>
      <div className="space-y-6">
        {newsPosts.map((item) => (
          <div key={item.slug} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="text-sm text-primary font-bold mb-2">{item.date}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-700 whitespace-pre-line">{item.content}</p>
              </div>
              <img
                src={item.image || placeholderImg}
                alt={`${item.title} thumbnail`}
                className="w-20 h-20 rounded-full object-cover border border-gray-200 shadow-sm flex-shrink-0"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default News
