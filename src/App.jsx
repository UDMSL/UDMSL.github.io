import {
    HashRouter as Router,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import Professor from './components/Professor';
import Members from './components/Members';
import Research from './components/Research';
import Publications from './components/Publications';
import Gallery from './components/Gallery';
import News from './components/News';

function App() {
    return (
        <>
            {/* GitHub Pages 환경을 고려해 hash 기반 라우터 사용 */}
            <Router>
                <Layout>
                    <Routes>
                        {/* 기본 섹션: 탭과 경로를 1:1로 매핑 */}
                        <Route path="/" element={<Home />} />
                        <Route path="/professor" element={<Professor />} />
                        <Route path="/members" element={<Members />} />
                        <Route path="/research" element={<Research />} />
                        <Route path="/publications" element={<Publications />} />
                        <Route path="/gallery" element={<Gallery />} />
                        <Route path="/news" element={<News />} />
                        {/* 정의되지 않은 경로는 홈으로 리다이렉트 */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Layout>
            </Router>
        </>
    );
}

export default App;
