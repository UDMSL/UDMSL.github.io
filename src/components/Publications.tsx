import { publicationList } from '../data/publications'
import { ExternalLink } from 'lucide-react'

const Publications = () => {
  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Selected Publications</h2>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {publicationList.map((pub, idx) => {
          const hasDoi = Boolean(pub.doi)
          const scholarUrl = `https://scholar.google.com/scholar?q=${encodeURIComponent(pub.text)}`
          const doiUrl = hasDoi ? `https://doi.org/${pub.doi}` : ''

          return (
            <div
              key={pub.slug}
              className={`p-6 ${idx !== publicationList.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-blue-50 transition-colors`}
            >
              <div className="flex gap-4 items-start">
                <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded mt-1 shrink-0">{pub.year}</span>
                <div className="flex-grow">
                  <p className="text-gray-800 leading-relaxed font-medium">{pub.text}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {!hasDoi && (
                      <a
                        href={scholarUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200 inline-flex items-center gap-1"
                      >
                        Google Scholar <ExternalLink size={10} />
                      </a>
                    )}
                    {hasDoi && (
                      <a
                        href={doiUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs bg-blue-100 text-primary px-2 py-1 rounded hover:bg-blue-200 inline-flex items-center gap-1"
                      >
                        DOI Link <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Publications
