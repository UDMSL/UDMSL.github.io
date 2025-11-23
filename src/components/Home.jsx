import { generalInfo } from '../data/general';
import { professorProfile } from '../data/professor';
import { researchData } from '../data/research';

const Home = () => {
    return (
        <div className="animate-fade-in">
            <div className="relative bg-primary text-white py-20 px-6 text-center">
                <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">{generalInfo.labName}</h1>
                <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                    {generalInfo.affiliation}
                </p>
            </div>

            {/* Recruitment Notice */}
            <div className="bg-blue-50 py-12 px-6">
                <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-8 border-l-4 border-primary">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">{generalInfo.recruitingTitle}</h2>
                    <div className="space-y-8 text-gray-700 leading-relaxed">
                        <div>
                            <p>
                                현재 석사 및 박사 과정 학생을 모집 중입니다. 저희 연구실에서 진행 중인 연구에 함께 참여하고 싶은 학생들은 저에게 이메일(
                                    <a href={`mailto:${professorProfile.email}`} className="text-secondary font-semibold hover:underline">{professorProfile.email}</a>
                                    ) 주시기 바랍니다 (사무실: {professorProfile.office[0]}, 실험실: {professorProfile.office[1]}, 전화: {professorProfile.phone}).
                            </p>
                            <p className="mt-2">
                                    저희 연구실에서 수행 중인 연구들에 대하여 자세히 알고 싶으시면 
                                    <a href="http://www.google.com/url?q=http%3A%2F%2Fwww.researchgate.net%2Fprofile%2FJeongho_Kim%2F&sa=D&sntz=1&usg=AOvVaw1TKZIaOajKwuws6qkSurB-" target="_blank" rel="noopener noreferrer" className="text-secondary font-semibold hover:underline mx-1">ResearchGate</a>, 
                                    <a href="http://scholar.google.com/citations?user=Frtw8W4AAAAJ" target="_blank" rel="noopener noreferrer" className="text-secondary font-semibold hover:underline mx-1">Google Scholar</a>, 
                                    <a href="http://www.google.com/url?q=http%3A%2F%2Forcid.org%2F0000-0003-4085-293X&sa=D&sntz=1&usg=AOvVaw3w29BCv3bGnrPatpU--ZfE" target="_blank" rel="noopener noreferrer" className="text-secondary font-semibold hover:underline mx-1">ORCiD</a>
                                    에 나와 있는 연구 실적들을 살펴봐 주시기 바랍니다. 저희 연구실의 문은 언제나 활짝 열려 있습니다!!
                            </p>
                        </div>
                        <div>
                            <p>
                                    We are looking for M.S. and Ph.D. students who are interested in working in our research group. Please feel free to contact me at 
                                    <a href={`mailto:${professorProfile.email}`} className="text-secondary font-semibold hover:underline mx-1">{professorProfile.email}</a> 
                                    (Office: {professorProfile.office[0]}, Lab: {professorProfile.office[1]}, Tel: {professorProfile.phone}).
                                </p>
                            <p className="mt-2">
                                    For details of the research projects in our group, please check my research profile at 
                                    <a href="http://www.google.com/url?q=http%3A%2F%2Fwww.researchgate.net%2Fprofile%2FJeongho_Kim%2F&sa=D&sntz=1&usg=AOvVaw1TKZIaOajKwuws6qkSurB-" target="_blank" rel="noopener noreferrer" className="text-secondary font-semibold hover:underline mx-1">ResearchGate</a>, 
                                    <a href="http://scholar.google.com/citations?user=Frtw8W4AAAAJ" target="_blank" rel="noopener noreferrer" className="text-secondary font-semibold hover:underline mx-1">Google Scholar</a>, and 
                                    <a href="http://www.google.com/url?q=http%3A%2F%2Forcid.org%2F0000-0003-4085-293X&sa=D&sntz=1&usg=AOvVaw3w29BCv3bGnrPatpU--ZfE" target="_blank" rel="noopener noreferrer" className="text-secondary font-semibold hover:underline mx-1">ORCiD</a>.
                                    Our research group always welcomes you!!
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Research Highlights */}
            <div className="max-w-7xl mx-auto py-12 px-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Research Highlights</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {researchData.highlights.map((item, idx) => (
                        <div key={idx} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
                            <img src={item.img} alt={item.title} className="w-full h-48 object-cover" />
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-primary mb-2">{item.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
