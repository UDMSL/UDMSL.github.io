import { professorProfile } from '../data/professor'
import { Mail, Phone, MapPin, FileText } from 'lucide-react'

const placeholderImg = 'https://placehold.co/400x500/1e3a8a/FFF?text=Prof.+Jeongho+Kim'

const Professor = () => {
  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-8">
      <div className="relative overflow-hidden rounded-2xl border border-gray/70 bg-white text-gray-900 shadow-xl p-6 md:p-7">
        <div className="absolute inset-0 pointer-events-none opacity-50">
          <div className="absolute -left-10 -top-10 w-32 h-32 bg-gray-100 blur-3xl" />
          <div className="absolute right-[-14%] bottom-[-14%] w-40 h-40 bg-gray-50 blur-3xl" />
        </div>
        <div className="relative space-y-2">
          <h2 className="text-4xl font-bold text-gray-900">{professorProfile.name}</h2>
          <p className="text-xl text-primary font-medium">
            {professorProfile.title} / {professorProfile.affiliation}
          </p>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row gap-10 items-start border border-gray/70">
        <div className="w-full md:w-1/3">
          <div className="rounded-xl overflow-hidden shadow-lg border border-white/60 bg-white/80 relative transition-transform duration-500 hover:scale-[1.02]">
            <img
              src={professorProfile.img}
              onError={(e) => {
                e.currentTarget.onerror = null
                e.currentTarget.src = placeholderImg
              }}
              alt="Jeongho Kim"
              className="w-full h-auto object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
          <div className="mt-6 space-y-3 text-gray-700 bg-white/70 border border-white/80 p-4 rounded-xl">
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
            className="mt-4 w-full block text-center bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-semibold py-3 rounded-full transition-colors flex items-center justify-center gap-2 shadow-lg"
          >
            <FileText size={18} /> Download CV
          </a>
        </div>

        <div className="w-full md:w-2/3 space-y-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">Biography</h3>
            {professorProfile.bio.map((line) => (
              <p key={line} className="text-gray-700 mb-2 leading-relaxed">
                {line}
              </p>
            ))}
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">Education</h3>
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
            <h3 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">Career</h3>
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
