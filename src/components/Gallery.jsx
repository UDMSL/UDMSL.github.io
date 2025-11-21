import { DATA } from '../data/db';

const Gallery = () => {
    return (
        <div className="max-w-6xl mx-auto py-12 px-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">Gallery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {DATA.gallery.map((item, idx) => (
                    <div key={idx} className="group relative overflow-hidden rounded-lg shadow-md aspect-[4/3]">
                        <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                            <span className="text-white font-medium text-lg">{item.title}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Gallery;