import {
    HashRouter as Router,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import PIProfile from './components/PIProfile';
import Members from './components/Members';
import Research from './components/Research';
import Publications from './components/Publications';
import Gallery from './components/Gallery';
import News from './components/News';

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/pi" element={<PIProfile />} />
                    <Route path="/members" element={<Members />} />
                    <Route path="/research" element={<Research />} />
                    <Route path="/publications" element={<Publications />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/news" element={<News />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
