import { professorProfile } from '../data/professor'
import { Mail, Phone, MapPin, FileText } from 'lucide-react'

const placeholderImg = 'https://placehold.co/400x500/1e3a8a/FFF?text=Prof.+Jeongho+Kim'

const Professor = () => {
  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <div className="flex flex-col md:flex-row gap-10 items-start">
        <div className="w-full md:w-1/3">
          <div className="rounded-lg overflow-hidden shadow-lg border-4 border-white bg-white">
            <img
              src={professorProfile.img}
              onError={(e) => {
                e.currentTarget.onerror = null
                e.currentTarget.src = placeholderImg
              }}
              alt="Jeongho Kim"
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="mt-6 space-y-3 text-gray-700 bg-gray-50 p-4 rounded-lg">
            {professorProfile.email && (
              <a href={`mailto:${professorProfile.email}`} className="flex items-center gap-2 text-secondary hover:underline">
                <Mail size={16} /> <span>{professorProfile.email}</span>
              </a>
            )}
            <div className="flex items-center gap-2">
              <Phone size={16} /> <span>{professorProfile.phone}</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin size={16} className="shrink-0 mt-1" />
              <div className="flex flex-col">
                {professorProfile.office.map((loc) => (
                  <span key={loc}>{loc}</span>
                ))}
              </div>
            </div>
          </div>
          <a
            href={professorProfile.cvLink}
            className="mt-4 w-full block text-center bg-primary hover:bg-blue-800 text-white font-semibold py-3 rounded transition-colors flex items-center justify-center gap-2"
          >
            <FileText size={18} /> Download CV
          </a>
        </div>

        <div className="w-full md:w-2/3">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">{professorProfile.name}</h2>
          <p className="text-xl text-primary font-medium mb-6">
            {professorProfile.title} / {professorProfile.affiliation}
          </p>

          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 border-b border-gray-200 pb-2 mb-4">Biography</h3>
            {professorProfile.bio.map((line) => (
              <p key={line} className="text-gray-700 mb-2 leading-relaxed">
                {line}
              </p>
            ))}
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 border-b border-gray-200 pb-2 mb-4">Education</h3>
            <ul className="space-y-3">
              {professorProfile.education.map((edu) => (
                <li key={`${edu.year}-${edu.desc}`} className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="font-bold text-primary min-w-[100px]">{edu.year}</span>
                  <span className="text-gray-700">{edu.desc}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 border-b border-gray-200 pb-2 mb-4">Career</h3>
            <ul className="space-y-3">
              {professorProfile.career.map((job) => (
                <li key={`${job.year}-${job.desc}`} className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="font-bold text-primary min-w-[140px]">{job.year}</span>
                  <span className="text-gray-700">{job.desc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Professor
