import { DATA } from '../data/db';

const Research = () => {
    return (
        <div className="max-w-6xl mx-auto py-12 px-6">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Research Areas</h2>
            </div>

            <div className="mb-16 bg-gray-50 p-8 rounded-xl border border-gray-100">
                <h3 className="text-2xl font-bold text-primary mb-6 text-center">Research Overview</h3>
                <div className="grid lg:grid-cols-2 gap-12 text-gray-700 leading-relaxed text-justify">
                    <div>
                        <h4 className="font-bold text-lg mb-4 text-gray-900 border-b-2 border-gray-200 inline-block pb-1">[Korean]</h4>
                        <div className="space-y-4">
                            {DATA.researchIntro.ko.map((para, idx) => <p key={idx}>{para}</p>)}
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg mb-4 text-gray-900 border-b-2 border-gray-200 inline-block pb-1">[English]</h4>
                        <div className="space-y-4">
                            {DATA.researchIntro.en.map((para, idx) => <p key={idx}>{para}</p>)}
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="space-y-12">
                <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">Key Methodologies</h3>
                {DATA.researchHighlights.map((res, idx) => (
                    <div key={idx} className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center`}>
                        <div className="w-full md:w-1/2">
                            <img src={res.img} alt={res.title} className="rounded-lg shadow-md w-full h-72 object-cover" />
                        </div>
                        <div className="w-full md:w-1/2">
                            <h3 className="text-2xl font-bold text-primary mb-4">{res.title}</h3>
                            <p className="text-gray-700 leading-relaxed text-lg font-medium mb-4">{res.desc}</p>
                            <p className="text-gray-600 text-sm leading-relaxed bg-blue-50 p-4 rounded-lg border-l-4 border-secondary">
                                {res.detail}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Research;