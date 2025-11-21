import { useState } from 'react';
import Layout from './components/Layout';
import Home from './components/Home';
import PIProfile from './components/PIProfile';
import Members from './components/Members';
import Research from './components/Research';
import Publications from './components/Publications';
import Gallery from './components/Gallery';
import News from './components/News';

function App() {
    const [activeTab, setActiveTab] = useState('Home');

    const renderContent = () => {
        switch(activeTab) {
            case 'Home': return <Home />;
            case 'Jeongho Kim': return <PIProfile />;
            case 'Group Members': return <Members />;
            case 'Research': return <Research />;
            case 'Publications': return <Publications />;
            case 'Gallery': return <Gallery />;
            case 'News': return <News />;
            default: return <Home />;
        }
    };

    return (
        <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
            {renderContent()}
        </Layout>
    );
}

export default App;