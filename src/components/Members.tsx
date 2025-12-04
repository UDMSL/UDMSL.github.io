import { Mail } from 'lucide-react'
import { membersData } from '../data/members'
import WebpImage from './WebpImage'

// Keep current and alumni lists separate to avoid mixing statuses

const Members = () => {
  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <div className="space-y-3 mb-8">
        <h2 className="text-3xl font-bold text-primary">Current Members</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
        {membersData.current.map((member) => (
          <div
            key={member.name}
            className="glass-panel rounded-xl p-4 border border-gray-200/80 flex items-center gap-4 hover:-translate-y-1 transition transform shadow-md"
          >
            <WebpImage src={member.img} alt={member.name} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm" />
            <div className="min-w-0">
              <h3 className="font-bold text-gray-800 truncate">{member.name}</h3>
              <p className="text-primary font-medium text-sm truncate">{member.degree}</p>
              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  className="text-gray-500 text-xs flex items-center gap-1 mt-1 truncate hover:text-primary"
                >
                  <Mail size={12} /> <span className="truncate">{member.email}</span>
                </a>
              )}
              {member.currentPos && <p className="text-gray-500 text-xs mt-1 truncate">Current: {member.currentPos}</p>}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2 mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Alumni</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {membersData.alumni.map((member) => (
          <div
            key={`${member.name}-${member.currentPos}`}
            className="glass-panel rounded-xl p-4 border border-gray-200/70 flex items-center gap-4 opacity-95 shadow-sm"
          >
            <WebpImage
              src={member.img}
              alt={member.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm grayscale"
            />
            <div>
              <h3 className="font-bold text-gray-800">{member.name}</h3>
              <p className="text-gray-600 text-sm">{member.degree}</p>
              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  className="text-gray-500 text-xs flex items-center gap-1 mt-1 hover:text-primary"
                >
                  <Mail size={12} /> <span className="truncate">{member.email}</span>
                </a>
              )}
              {member.currentPos && <p className="text-gray-500 text-xs mt-1">Current: {member.currentPos}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Members
