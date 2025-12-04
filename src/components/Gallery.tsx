import { galleryImages } from '../data/gallery'
import WebpImage from './WebpImage'

// Simple grid, no pagination because dataset is small

const Gallery = () => {
  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-gray-900">Gallery</h2>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {galleryImages.map((item) => (
          <div key={item.slug} className="group relative overflow-hidden rounded-2xl shadow-lg aspect-[4/3] glass-panel">
            <WebpImage
              src={item.img}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <span className="text-white font-medium text-lg">{item.title}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Gallery
