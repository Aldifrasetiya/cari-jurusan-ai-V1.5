import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Brain, Sparkles, ChevronRight, Loader2, CheckCircle2 } from 'lucide-react';
import { QUESTION_BANK, OPTIONS } from '../data/questions';

const Questionnaire = () => {
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Initialize answers if empty
    if (Object.keys(answers).length === 0) {
        const initialAnswers = {};
        Object.keys(QUESTION_BANK).forEach(category => {
            QUESTION_BANK[category].forEach((_, index) => {
                initialAnswers[`${category}_${index}`] = 3;
            });
        });
        setAnswers(initialAnswers);
    }

    const handleAnswerChange = (key, value) => {
        setAnswers(prev => ({
            ...prev,
            [key]: parseInt(value)
        }));
    };

    const calculateScores = () => {
        const scores = {};
        Object.keys(QUESTION_BANK).forEach(category => {
            let totalScore = 0;
            const questions = QUESTION_BANK[category];
            const maxScore = questions.length * 5;

            questions.forEach((_, index) => {
                totalScore += answers[`${category}_${index}`] || 3;
            });

            scores[category] = totalScore / maxScore;
        });
        return scores;
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        const scores = calculateScores();

        try {
            const response = await axios.post('https://aldifrasetiya-api-cari-jurusan-v1-5.hf.space/predict', scores);
            setResult({ ...response.data, input_scores: scores });
            localStorage.setItem('minatResult', JSON.stringify({ ...response.data, input_scores: scores }));
        } catch (err) {
            setError('Gagal mendapatkan rekomendasi. Pastikan server backend berjalan.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-10"
            >
                <div className="inline-flex items-center justify-center p-3 bg-indigo-500/10 rounded-full mb-4 ring-1 ring-indigo-500/30">
                    <Sparkles className="w-6 h-6 text-indigo-400 mr-2" />
                    <span className="text-indigo-300 font-medium tracking-wide text-sm">TEST MINAT & KEMAMPUAN</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                    Temukan Jurusan Impianmu
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                    Jawablah pertanyaan berikut sejujur mungkin berdasarkan dirimu.
                </p>
            </motion.header>

            {!result ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-8"
                >
                    {Object.entries(QUESTION_BANK).map(([category, questions], catIdx) => (
                        <div key={category} className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 md:p-8">
                            <h2 className="text-xl font-bold text-white mb-6 capitalize flex items-center">
                                <span className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center mr-3 text-sm">
                                    {catIdx + 1}
                                </span>
                                Bidang: {category}
                            </h2>

                            <div className="space-y-8">
                                {questions.map((q, qIdx) => {
                                    const key = `${category}_${qIdx}`;
                                    return (
                                        <div key={key} className="space-y-3">
                                            <p className="text-slate-300 font-medium">{qIdx + 1}. {q}</p>
                                            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                                                {OPTIONS.map((opt) => (
                                                    <button
                                                        key={opt.value}
                                                        onClick={() => handleAnswerChange(key, opt.value)}
                                                        className={`px-3 py-2 rounded-lg text-sm transition-all border ${answers[key] === opt.value
                                                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                                                            : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                                                            }`}
                                                    >
                                                        {opt.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    <div className="sticky bottom-6 bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-700/50 shadow-2xl">
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg transform transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Menganalisis Jawaban...
                                </>
                            ) : (
                                <>
                                    Lihat Hasil & Rekomendasi
                                    <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 backdrop-blur-xl border border-indigo-500/30 rounded-3xl p-8 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                        <h3 className="text-slate-400 text-sm uppercase tracking-wider font-semibold mb-2">Rekomendasi Utama</h3>
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
                            {result.prediction}
                        </h2>

                        <div className="bg-slate-900/30 rounded-xl p-4 max-w-2xl mx-auto border border-white/5">
                            <p className="text-slate-300 text-sm">
                                Ingat, ini hanya rekomendasi berdasarkan minat dan kemampuan yang kamu isi.
                                Pertimbangkan juga faktor lain seperti passion, peluang karir, dan saran dari orang tua/guru.
                            </p>
                        </div>

                        <button
                            onClick={() => setResult(null)}
                            className="mt-8 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-medium transition-colors"
                        >
                            Ulangi Tes
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6">
                            <h3 className="text-lg font-semibold mb-4 text-white">Profil Minat Kamu</h3>
                            <div className="space-y-4">
                                {Object.entries(result.input_scores).map(([category, score]) => (
                                    <div key={category}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="capitalize text-slate-300">{category}</span>
                                            <span className="text-indigo-400 font-mono">{(score * 100).toFixed(0)}%</span>
                                        </div>
                                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${score * 100}%` }}
                                                transition={{ duration: 1 }}
                                                className="h-full bg-indigo-500 rounded-full"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6">
                            <h3 className="text-lg font-semibold mb-4 text-white">Detail Kecocokan Jurusan</h3>
                            <div className="space-y-4">
                                {Object.entries(result.probabilities).slice(0, 5).map(([jurusan, prob], idx) => (
                                    <div key={jurusan} className="relative">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-slate-300">{jurusan}</span>
                                            <span className="text-emerald-400 font-mono">{(prob * 100).toFixed(1)}%</span>
                                        </div>
                                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${prob * 100}%` }}
                                                transition={{ duration: 1, delay: idx * 0.1 }}
                                                className="h-full bg-emerald-500 rounded-full"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default Questionnaire;
