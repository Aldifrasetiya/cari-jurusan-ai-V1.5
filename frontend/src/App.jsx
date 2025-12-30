import { useState, useEffect } from 'react';
import ReactGA from 'react-ga4';
import Sidebar from './components/Sidebar';
import Questionnaire from './pages/Questionnaire';
import RaporAnalysis from './pages/RaporAnalysis';
import { Menu, X } from 'lucide-react';

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_ID

function App() {
  const [activePage, setActivePage] = useState('questionnaire');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    ReactGA.initialize(GA_MEASUREMENT_ID);
    ReactGA.send({
      hitType: "pageview",
      page: window.location.pathname,
      title: "Home Load"
    });
  }, []);

  useEffect(() => {
    const pageName = activePage === 'questionnaire' ? '/test-minat' : '/analisis-rapor';
    ReactGA.send({
      hitType: "pageview",
      page: pageName,
      title: activePage === 'questionnaire' ? 'Test Minat & Kemampuan' : 'Analisis Rapor'
    });
  }, [activePage]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-indigo-500 selection:text-white flex overflow-hidden">

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <Sidebar
          activePage={activePage}
          setActivePage={setActivePage}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden p-4 flex items-center justify-between bg-slate-800/50 border-b border-slate-700/50 backdrop-blur-md sticky top-0 z-30">
          <span className="font-bold text-indigo-400">Cari Jurusan AI</span>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          {activePage === 'questionnaire' ? <Questionnaire /> : <RaporAnalysis />}
        </main>
      </div>
    </div>
  );
}

export default App;
