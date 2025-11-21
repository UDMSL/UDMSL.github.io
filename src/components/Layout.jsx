import { useState } from 'react';
import { DATA } from '../data/db';
import { Menu, X, Mail, Phone } from 'lucide-react';

const Layout = ({ activeTab, setActiveTab, children }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const tabs = [
        { id: 'Home', label: 'Home' },
        { id: 'Jeongho Kim', label: 'Jeongho Kim' },
        { id: 'Group Members', label: 'Group Members' },
        { id: 'Research', label: 'Research' },
        { id: 'Publications', label: 'Publications' },
        { id: 'Gallery', label: 'Gallery' },
        { id: 'News', label: 'News' }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-white font-sans text-gray-900">
            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center cursor-pointer" onClick={() => setActiveTab('Home')}>
                            <div className="flex flex-col">
                                <span className="font-bold text-2xl text-primary leading-none">{DATA.labShortName}</span>
                                <span className="text-xs text-gray-500 hidden md:block">{DATA.labName}</span>
                            </div>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex space-x-1 h-full items-center">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                        activeTab === tab.id 
                                        ? 'text-primary bg-blue-50' 
                                        : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="flex items-center md:hidden">
                            <button 
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="text-gray-600 hover:text-primary p-2"
                            >
                                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Dropdown */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        setActiveTab(tab.id);
                                        setMobileMenuOpen(false);
                                    }}
                                    className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                                        activeTab === tab.id
                                        ? 'bg-blue-50 text-primary'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <main className="flex-grow">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-dark text-gray-300 py-8 mt-12">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8">
                    <div>
                        <h4 className="text-white font-bold text-lg mb-4">{DATA.labName}</h4>
                        <p className="text-sm mb-2 font-semibold">Department of Chemistry, Inha University</p>
                        <p className="text-sm text-gray-400 mb-1">22212 인천광역시 미추홀구 인하로 100 인하대학교</p>
                        <div className="flex flex-col sm:flex-row sm:gap-4 text-sm text-gray-400">
                            <span>Office: {DATA.pi.office[0]}</span>
                            <span className="hidden sm:inline">|</span>
                            <span>Lab: {DATA.pi.office[1]}</span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1 flex items-center gap-2">
                            <Phone size={14}/> {DATA.pi.phone}
                        </p>
                    </div>
                    <div className="md:text-right">
                        <p className="text-sm mb-2 flex items-center justify-end gap-2">
                            <Mail size={14}/> {DATA.pi.email}
                        </p>
                        <p className="text-sm text-gray-500">© 2024 UDMS Lab. All Rights Reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;