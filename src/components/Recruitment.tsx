import { professorProfile } from '../data/professor'
import Reveal from './Reveal'
export default function Recruitment() { return <>      {/* Recruitment Notice */}
      <Reveal as="section" className="original-notice">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-2xl font-bold text-gray-900">공지사항 / Notice</h2>
          </div>
          {/* Keep KOR/ENG cards in sync when content updates */}
          <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
            <Reveal
              variant="slide-left"
              className="glass-panel rounded-2xl p-6 border border-gray/70 shadow-xl space-y-3 transition-transform"
              delay={25}
            >
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
                    href="https://www.researchgate.net/profile/Jeongho_Kim/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary font-semibold hover:underline mx-1"
                  >
                    ResearchGate
                  </a>
                  ,
                  <a
                    href="https://scholar.google.com/citations?user=Frtw8W4AAAAJ"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary font-semibold hover:underline mx-1"
                  >
                    Google Scholar
                  </a>
                  ,
                  <a
                    href="https://orcid.org/0000-0003-4085-293X"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary font-semibold hover:underline mx-1"
                  >
                    ORCiD
                  </a>
                  에 나와 있는 연구 실적들을 살펴봐 주시기 바랍니다. 저희 연구실의 문은 언제나 활짝 열려 있습니다!!
                </p>
              </div>
            </Reveal>

            <Reveal
              variant="slide-right"
              className="glass-panel rounded-2xl p-6 border border-gray/70 shadow-xl space-y-3 transition-transform"
              delay={55}
            >
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
                    href="https://www.researchgate.net/profile/Jeongho_Kim/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary font-semibold hover:underline mx-1"
                  >
                    ResearchGate
                  </a>
                  ,
                  <a
                    href="https://scholar.google.com/citations?user=Frtw8W4AAAAJ"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary font-semibold hover:underline mx-1"
                  >
                    Google Scholar
                  </a>
                  , and
                  <a
                    href="https://orcid.org/0000-0003-4085-293X"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary font-semibold hover:underline mx-1"
                  >
                    ORCiD
                  </a>
                  . Our research group always welcomes you!!
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </Reveal>

</> }
