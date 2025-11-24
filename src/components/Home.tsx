import { useEffect, useRef } from 'react'
import { generalInfo } from '../data/general'
import { professorProfile } from '../data/professor'
import { researchData } from '../data/research'

const Home = () => {

  return (
    <div className="animate-rise">
      <section className="relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0b1535] via-[#10235a] to-[#0b173c]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(59,130,246,0.24),transparent_25%),radial-gradient(circle_at_85%_20%,rgba(14,165,233,0.18),transparent_24%)]" />
        <div className="max-w-6xl mx-auto px-6 py-20 relative z-10 text-center space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">{generalInfo.labName}</h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto">{generalInfo.affiliation}</p>
        </div>
      </section>

      {/* Recruitment Notice */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-2xl font-bold text-gray-900">공지사항 / Notice</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
            <div className="glass-panel rounded-2xl p-6 border border-gray/70 shadow-xl space-y-3 transition-transform">
              <div className="flex items-center justify-between">
                <span className="text-xl font-semibold text-primary">모집 안내</span>
                <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-primary font-semibold">KOR</span>
              </div>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>
                  현재 석사 및 박사 과정 학생을 모집 중입니다. 저희 연구실에서 진행 중인 연구에 함께 참여하고 싶은 학생들은 저에게 이메일(
                  <a href={`mailto:${professorProfile.email}`} className="text-secondary font-semibold hover:underline">
                    {professorProfile.email}
                  </a>
                  ) 주시기 바랍니다 (사무실: {professorProfile.office[0]}, 실험실: {professorProfile.office[1]}, 전화: {professorProfile.phone}).
                </p>
                <p>
                  저희 연구실에서 수행 중인 연구들에 대하여 자세히 알고 싶으시면
                  <a
                    href="http://www.google.com/url?q=http%3A%2F%2Fwww.researchgate.net%2Fprofile%2FJeongho_Kim%2F&sa=D&sntz=1&usg=AOvVaw1TKZIaOajKwuws6qkSurB-"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary font-semibold hover:underline mx-1"
                  >
                    ResearchGate
                  </a>
                  ,
                  <a
                    href="http://scholar.google.com/citations?user=Frtw8W4AAAAJ"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary font-semibold hover:underline mx-1"
                  >
                    Google Scholar
                  </a>
                  ,
                  <a
                    href="http://www.google.com/url?q=http%3A%2F%2Forcid.org%2F0000-0003-4085-293X&sa=D&sntz=1&usg=AOvVaw3w29BCv3bGnrPatpU--ZfE"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary font-semibold hover:underline mx-1"
                  >
                    ORCiD
                  </a>
                  에 나와 있는 연구 실적들을 살펴봐 주시기 바랍니다. 저희 연구실의 문은 언제나 활짝 열려 있습니다!!
                </p>
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-6 border border-gray/70 shadow-xl space-y-3 transition-transform">
              <div className="flex items-center justify-between">
                <span className="text-xl font-semibold text-primary">Recruiting</span>
                <span className="text-xs px-3 py-1 rounded-full bg-indigo-100 text-primary font-semibold">ENG</span>
              </div>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>
                  We are looking for M.S. and Ph.D. students who are interested in working in our research group. Please feel free to
                  contact me at
                  <a href={`mailto:${professorProfile.email}`} className="text-secondary font-semibold hover:underline mx-1">
                    {professorProfile.email}
                  </a>
                  (Office: {professorProfile.office[0]}, Lab: {professorProfile.office[1]}, Tel: {professorProfile.phone}).
                </p>
                <p>
                  For details of the research projects in our group, please check my research profile at
                  <a
                    href="http://www.google.com/url?q=http%3A%2F%2Fwww.researchgate.net%2Fprofile%2FJeongho_Kim%2F&sa=D&sntz=1&usg=AOvVaw1TKZIaOajKwuws6qkSurB-"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary font-semibold hover:underline mx-1"
                  >
                    ResearchGate
                  </a>
                  ,
                  <a
                    href="http://scholar.google.com/citations?user=Frtw8W4AAAAJ"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary font-semibold hover:underline mx-1"
                  >
                    Google Scholar
                  </a>
                  , and
                  <a
                    href="http://www.google.com/url?q=http%3A%2F%2Forcid.org%2F0000-0003-4085-293X&sa=D&sntz=1&usg=AOvVaw3w29BCv3bGnrPatpU--ZfE"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary font-semibold hover:underline mx-1"
                  >
                    ORCiD
                  </a>
                  . Our research group always welcomes you!!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Research Highlights */}
      <section className="max-w-7xl mx-auto py-12 px-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mt-3">Research Highlights</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {researchData.highlights.map((item, idx) => (
            <div
              key={idx}
              className="glass-panel rounded-2xl overflow-hidden hover:-translate-y-1 transition transform shadow-lg border border-gray/70 flex flex-col hover:shadow-2xl"
            >
              <div className="relative w-full h-48 md:h-56 overflow-hidden">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover transition duration-500 hover:scale-105"
                />
              </div>
              <div className="p-5 space-y-2">
                <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
