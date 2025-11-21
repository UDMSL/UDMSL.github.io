import { DATA } from '../data/db';
import { Mail } from 'lucide-react';

const Members = () => {
    return (
        <div className="max-w-6xl mx-auto py-12 px-6">
            <h2 className="text-3xl font-bold text-primary mb-8">Current Members</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
                {DATA.members.current.map((member, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex items-center gap-4 hover:bg-blue-50 transition-colors">
                        <img src={member.img} alt={member.name} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm" />
                        <div className="min-w-0">
                            <h3 className="font-bold text-gray-800 truncate">{member.name}</h3>
                            <p className="text-primary font-medium text-sm truncate">{member.role}</p>
                            <p className="text-gray-500 text-xs flex items-center gap-1 mt-1 truncate">
                                <Mail size={12} /> <span className="truncate">{member.email}</span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <h2 className="text-3xl font-bold text-gray-600 mb-8">Alumni</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                 {DATA.members.alumni.map((member, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex items-center gap-4 opacity-80">
                        <img src={member.img} alt={member.name} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm grayscale" />
                        <div>
                            <h3 className="font-bold text-gray-800">{member.name}</h3>
                            <p className="text-gray-600 text-sm">{member.degree}</p>
                            {member.currentPos && <p className="text-gray-500 text-xs mt-1">Current: {member.currentPos}</p>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Members;