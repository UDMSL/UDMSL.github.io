import { researchData } from '../data/research'
import WebpImage from './WebpImage'
import Reveal from './Reveal'

const Research = () => {
  return (
    <div className="max-w-7xl mx-auto py-12 px-6 space-y-8">
      <div className="text-center space-y-3">
      </div>
      <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
        <Reveal className="glass-panel rounded-2xl overflow-hidden shadow-xl border border-gray/70 transition-transform" variant="slide-left">
          <div className="p-6 md:p-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">연구 개요</h3>
              <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-primary font-semibold">KOR</span>
            </div>
            <div className="space-y-4 text-gray-700 leading-relaxed text-justify">
              {researchData.intro.ko.map((para) => (
                <p key={para}>{para}</p>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal
          className="glass-panel rounded-2xl overflow-hidden shadow-xl border border-gray/70 transition-transform"
          delay={40}
          variant="slide-right"
        >
          <div className="p-6 md:p-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Research Overview</h3>
              <span className="text-xs px-3 py-1 rounded-full bg-indigo-100 text-primary font-semibold">ENG</span>
            </div>
            <div className="space-y-4 text-gray-700 leading-relaxed text-justify">
              {researchData.intro.en.map((para) => (
                <p key={para}>{para}</p>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      <div className="space-y-10">
        <h3 className="text-2xl font-bold text-center text-gray-900">Key Methodologies</h3>
        {/* Alternate alignment per index to avoid repetitive visual rhythm */}
        {researchData.highlights.map((res, idx) => {
          const imageRounded =
            idx % 2 === 0 ? 'md:rounded-l-2xl md:rounded-r-none' : 'md:rounded-r-2xl md:rounded-l-none'

          return (
            <Reveal
              key={res.slug}
              delay={idx * 45}
              className={`glass-panel group rounded-2xl overflow-hidden shadow-xl border border-gray/70 flex flex-col transition-transform ${
                idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              <div className={`w-full md:w-1/2 min-h-[280px] md:min-h-[340px] overflow-hidden ${imageRounded}`}>
                <WebpImage
                  src={res.img}
                  alt={res.title}
                  className="w-full h-full object-cover scale-110 rounded-2xl transition-transform duration-700"
                />
              </div>
              <div className="w-full md:w-1/2 p-8 space-y-4">
                <h3 className="text-2xl font-bold text-primary">{res.title}</h3>
                <p className="text-gray-800 leading-relaxed text-lg font-semibold">{res.desc}</p>
                <p className="text-gray-600 text-sm leading-relaxed bg-blue-50/80 p-4 rounded-xl border border-blue-100">
                  {res.detail}
                </p>
              </div>
            </Reveal>
          )
        })}
      </div>
    </div>
  )
}

export default Research
