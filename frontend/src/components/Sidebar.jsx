import React from 'react';
import { BookOpen, FileText, Coffee, Lock, X } from 'lucide-react'; // 1. Tambah icon X

// 2. Tambahkan prop 'onClose' di sini
const Sidebar = ({ activePage, setActivePage, onClose }) => {
    return (
        <div className="w-full md:w-64 bg-slate-900/95 backdrop-blur-xl border-r border-slate-700/50 flex flex-col h-screen sticky top-0 z-50">
            {/* Bagian Header Sidebar */}
            <div className="p-6 flex items-start justify-between">
                <div>
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                        Cari Jurusan AI 🤖
                    </h1>
                    <p className="text-slate-400 text-xs mt-2">
                        Temukan jurusan kuliah yang paling cocok untukmu.
                    </p>
                </div>

                {/* 3. TOMBOL TUTUP (Hanya muncul di Mobile / md:hidden) */}
                <button 
                    onClick={onClose}
                    className="md:hidden p-1 bg-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-red-500/20 transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                <button
                    onClick={() => {
                        setActivePage('questionnaire');
                        if (onClose) onClose(); // Tutup sidebar pas klik menu (di mobile)
                    }}
                    className={`w-full flex items-center p-3 rounded-xl transition-all ${activePage === 'questionnaire'
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                            : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
                        }`}
                >
                    <BookOpen className="w-5 h-5 mr-3" />
                    <span className="text-start font-medium">Test Minat & Kemampuan</span>
                </button>

                <button
                    onClick={() => {
                        setActivePage('rapor');
                        if (onClose) onClose(); // Tutup sidebar pas klik menu
                    }}
                    className={`w-full flex items-center p-3 rounded-xl transition-all ${activePage === 'rapor'
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                            : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
                        }`}
                >
                    <FileText className="w-5 h-5 mr-3" />
                    <span className="font-medium">Analisis Rapor</span>
                </button>
            </nav>

            <div className="p-4">
                <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 rounded-xl p-4 border border-purple-500/20 mb-4">
                    <div className="flex items-center mb-2">
                        <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">Promo Launching</span>
                    </div>
                    <p className="text-sm text-slate-300 mb-2">
                        Coba Fitur 'Analisis Rapor' Premium hanya <span className="text-white font-bold">Rp 19.000!</span>
                    </p>
                </div>

                <div className="bg-slate-800 rounded-xl p-4 border border-slate-700/50 text-center">
                    <h3 className="text-sm font-semibold text-slate-300 mb-3">Dukung Proyek Ini</h3>
                    <a
                        href="https://saweria.co/aldifrasetiya"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold py-2 px-4 rounded-lg text-sm transition-colors mb-3 flex items-center justify-center"
                    >
                        <Coffee className="w-4 h-4 mr-2" />
                        Donasi via Saweria
                    </a>
                    <div className="bg-white p-2 rounded-lg inline-block">
                        <img src="/img/barcode_saweria.png" alt="Saweria QR" className="w-24 h-24 object-contain" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;