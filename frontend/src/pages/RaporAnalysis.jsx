import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, FileText, CheckCircle2, MessageCircle, ArrowRight, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Download } from 'lucide-react';
import { generatePDFResult } from '../utils/pdfGenerator';

const MAPEL_INTI = {
    matematika: 'Matematika (Wajib/Umum)',
    bahasa_indonesia: 'Bahasa Indonesia',
    bahasa_inggris: 'Bahasa Inggris',
    fisika: 'Fisika',
    kimia: 'Kimia',
    biologi: 'Biologi',
    ekonomi: 'Ekonomi',
    sosiologi: 'Sosiologi',
    geografi: 'Geografi'
};

const WA_NUMBER = "6288290449738";
const WA_MESSAGE = "Halo Kak, saya mau beli kode akses Premium Analisis Rapor Cari Jurusan AI.";
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`;
const REAL_ACCESS_CODE = import.meta.env.VITE_ACCESS_CODE;

const RaporAnalysis = () => {
    const [unlocked, setUnlocked] = useState(false);
    const [accessCode, setAccessCode] = useState('');
    const [error, setError] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [scores, setScores] = useState(
        Object.keys(MAPEL_INTI).reduce((acc, key) => ({ ...acc, [key]: 0 }), {})
    );
    const [insights, setInsights] = useState([]);

    const triggerCelebration = () => {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    };

    const handleUnlock = (e) => {
        e.preventDefault();
        if (accessCode === REAL_ACCESS_CODE) {
            triggerCelebration();
            setShowSuccessModal(true);
            setError('');
            setTimeout(() => {
                setShowSuccessModal(false);
                setUnlocked(true);
            }, 2500);

        } else {
            setError('Kode akses salah. Pastikan sudah melakukan pembayaran.');
        }
    };

    const handleScoreChange = (key, value) => {
        setScores(prev => ({
            ...prev,
            [key]: parseFloat(value) || 0
        }));
    };

    const generateInsights = () => {
        const newInsights = [];

        const mapelSaintek = ['matematika', 'fisika', 'kimia', 'biologi'];
        const skorSaintek = mapelSaintek.map(m => scores[m]).filter(s => s > 0);
        const avgSaintek = skorSaintek.length > 0 ? skorSaintek.reduce((a, b) => a + b, 0) / skorSaintek.length : 0;

        const mapelSoshum = ['ekonomi', 'sosiologi', 'geografi'];
        const skorSoshum = mapelSoshum.map(m => scores[m]).filter(s => s > 0);
        const avgSoshum = skorSoshum.length > 0 ? skorSoshum.reduce((a, b) => a + b, 0) / skorSoshum.length : 0;

        const THRESHOLD_BAGUS = 80;

        if (avgSaintek > 0 && avgSoshum > 0) {
            if (avgSaintek >= THRESHOLD_BAGUS && avgSoshum >= THRESHOLD_BAGUS) {
                newInsights.push(`Kamu punya bakat seimbang! Nilai Saintek (${avgSaintek.toFixed(2)}) dan Soshum (${avgSoshum.toFixed(2)}) sama-sama kuat. Ini membuka banyak pilihan, dari Manajemen, Arsitektur, hingga Psikologi Industri.`);
            } else if (avgSaintek >= THRESHOLD_BAGUS && avgSaintek > (avgSoshum + 5)) {
                newInsights.push(`Profilmu adalah **Spesialis Saintek**. Rata-rata Saintek-mu (${avgSaintek.toFixed(2)}) jelas lebih menonjol daripada Soshum (${avgSoshum.toFixed(2)}). Fokus pada jurusan rumpun Teknik & Sains Murni.`);
            } else if (avgSoshum >= THRESHOLD_BAGUS && avgSoshum > (avgSaintek + 5)) {
                newInsights.push(`Profilmu adalah **Spesialis Soshum**. Rata-rata Soshum-mu (${avgSoshum.toFixed(2)}) jelas lebih menonjol daripada Saintek (${avgSaintek.toFixed(2)}). Jurusan rumpun Ekonomi, Bisnis, dan Hukum sangat cocok.`);
            } else {
                newInsights.push(`Nilaimu cukup merata (Saintek: ${avgSaintek.toFixed(2)}, Soshum: ${avgSoshum.toFixed(2)}). Ini artinya pilihanmu sangat terbuka dan sebaiknya didasarkan pada tes minat & bakat.`);
            }
        } else if (avgSaintek > 0 && avgSoshum === 0) {
            if (avgSaintek >= THRESHOLD_BAGUS) {
                newInsights.push(`Nilai Saintek-mu (${avgSaintek.toFixed(2)}) sangat kuat dan kompetitif. Ini modal besar untuk jurusan teknik atau kedokteran.`);
            } else {
                newInsights.push(`Nilai Saintek-mu (${avgSaintek.toFixed(2)}) cukup baik. Terus tingkatkan untuk bersaing di jurusan favoritmu.`);
            }
        }

        if (scores.bahasa_inggris > 90) {
            newInsights.push(`**Bakat Unik:** Nilai Bahasa Inggris-mu (${scores.bahasa_inggris}) luar biasa! Apapun jurusanmu, ini adalah 'senjata rahasia'. Pertimbangkan jurusan yang butuh banyak literatur Inggris.`);
        }
        if (scores.matematika > 95) {
            newInsights.push(`**Bakat Unik:** Nilai Matematika-mu (${scores.matematika}) sangat istimewa. Ini adalah indikator kuat untuk jurusan yang sangat analitis seperti Statistika, Matematika Murni, atau Aktuaria.`);
        }

        if (newInsights.length === 0) {
            newInsights.push("Masukkan nilai dari beberapa mata pelajaran untuk melihat insight.");
        }

        setInsights(newInsights);
    };

    if (!unlocked) {
        return (
            <div className="max-w-4xl mx-auto pt-10 px-4 relative">
                <AnimatePresence>
                    {showSuccessModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                        >
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                className="bg-slate-800 border border-indigo-500/50 rounded-3xl p-8 text-center shadow-2xl max-w-sm w-full relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-indigo-500/10 animate-pulse"></div>
                                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/50">
                                    <CheckCircle2 className="w-10 h-10 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">Akses Terbuka!</h2>
                                <p className="text-slate-300">Selamat datang di fitur Premium.</p>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <motion.div 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="space-y-6"
                    >
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium">
                            <Lock className="w-4 h-4 mr-2" />
                            Fitur Premium
                        </div>
                        <h1 className="text-4xl font-bold text-white leading-tight">
                            Validasi Pilihanmu dengan <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Data Akademis</span>
                        </h1>
                        <p className="text-slate-400 text-lg">
                            Jangan hanya menebak. Gunakan AI kami untuk mencocokkan nilai rapormu dengan standar jurusan impian. 
                        </p>
                        
                        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 space-y-4">
                            <h3 className="text-white font-semibold">Cara Mendapatkan Akses:</h3>
                            <ul className="space-y-3">
                                <li className="flex items-center text-slate-300 text-sm">
                                    <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center mr-3 text-xs font-bold">1</div>
                                    Klik tombol WhatsApp di bawah
                                </li>
                                <li className="flex items-center text-slate-300 text-sm">
                                    <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center mr-3 text-xs font-bold">2</div>
                                    Lakukan pembayaran (Rp 19.000)
                                </li>
                                <li className="flex items-center text-slate-300 text-sm">
                                    <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center mr-3 text-xs font-bold">3</div>
                                    Admin akan memberikan Kode Akses
                                </li>
                            </ul>
                            
                            <a 
                                href={WA_LINK}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-[#25D366]/20 flex items-center justify-center group"
                            >
                                <MessageCircle className="w-5 h-5 mr-2" />
                                Beli Akses via WhatsApp
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </a>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="bg-slate-900/50 backdrop-blur-xl border border-slate-700 rounded-3xl p-8 shadow-2xl"
                    >
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-700 shadow-inner">
                                <Unlock className="w-8 h-8 text-indigo-400" />
                            </div>
                            <h2 className="text-xl font-bold text-white">Masukkan Kode Akses</h2>
                            <p className="text-slate-400 text-sm mt-2">Sudah dapat kode dari Admin?</p>
                        </div>

                        <form onSubmit={handleUnlock} className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    value={accessCode}
                                    onChange={(e) => setAccessCode(e.target.value)}
                                    placeholder="Masukkan Kode Akses"
                                    className="w-full px-4 py-4 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center font-mono uppercase tracking-widest transition-all"
                                />
                                {error && (
                                    <motion.p 
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-red-400 text-xs mt-2 text-center bg-red-500/10 py-2 rounded-lg"
                                    >
                                        {error}
                                    </motion.p>
                                )}
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-indigo-500/25 active:scale-[0.98]"
                            >
                                Buka Fitur Sekarang
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
             <header className="text-center mb-8">
                <div className="inline-flex items-center justify-center p-3 bg-emerald-500/10 rounded-full mb-4 ring-1 ring-emerald-500/30">
                    <FileText className="w-6 h-6 text-emerald-400 mr-2" />
                    <span className="text-emerald-300 font-medium tracking-wide text-sm">ANALISIS RAPOR</span>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Input Nilai Rapor</h1>
                <p className="text-slate-400">Masukkan nilai rapor terakhirmu (0-100)</p>
            </header>

            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                        <h3 className="text-lg font-semibold text-indigo-300 mb-4 border-b border-slate-700 pb-2">Rumpun Saintek & Umum</h3>
                        <div className="space-y-4">
                            {['matematika', 'fisika', 'kimia', 'biologi'].map(key => (
                                <div key={key} className="flex items-center justify-between">
                                    <label className="text-slate-300 text-sm">{MAPEL_INTI[key]}</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={scores[key] || ''}
                                        onChange={(e) => handleScoreChange(key, e.target.value)}
                                        className="w-20 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-center focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-pink-300 mb-4 border-b border-slate-700 pb-2">Rumpun Soshum & Bahasa</h3>
                        <div className="space-y-4">
                            {['ekonomi', 'sosiologi', 'geografi', 'bahasa_indonesia', 'bahasa_inggris'].map(key => (
                                <div key={key} className="flex items-center justify-between">
                                    <label className="text-slate-300 text-sm">{MAPEL_INTI[key]}</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={scores[key] || ''}
                                        onChange={(e) => handleScoreChange(key, e.target.value)}
                                        className="w-20 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-center focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <button
                    onClick={generateInsights}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                    Analisis Nilaiku Sekarang
                </button>
            </div>

            {insights.length > 0 && (
                <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-3xl p-8 shadow-2xl mt-8"
                    >
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                        <CheckCircle2 className="w-6 h-6 text-emerald-400 mr-3" />
                        Hasil Analisis Kecenderungan
                    </h3>
                    <div className="space-y-4">
                        {insights.map((insight, idx) => (
                            <div key={idx} className="flex items-start bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                                <div className="w-2 h-2 mt-2 rounded-full bg-indigo-400 mr-3 flex-shrink-0" />
                                <p className="text-slate-300 leading-relaxed" dangerouslySetInnerHTML={{
                                    __html: insight.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
                                }} />
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 pt-6 border-t border-slate-700 flex justify-center">
                        <button
                            onClick={() => {
                                const savedMinat = JSON.parse(localStorage.getItem('minatResult'));
                                generatePDFResult(savedMinat, scores, insights);
                            }}
                            className="flex items-center bg-white text-slate-900 hover:bg-slate-200 font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105"
                        >
                            <Download className="w-5 h-5 mr-2" />
                            Unduh Laporan Lengkap (PDF)
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default RaporAnalysis;