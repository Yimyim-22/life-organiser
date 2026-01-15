import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile, Meh, Frown, Sun, Battery, Heart, BookOpen, CloudRain, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function WellnessTracker() {
    const { notes, setNotes } = useData();
    const [selectedMood, setSelectedMood] = useState(null);
    const [energyLevel, setEnergyLevel] = useState(5);
    const [journalEntry, setJournalEntry] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    const moods = [
        { label: 'Awesome', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-100', border: 'border-amber-400', gradient: 'from-amber-50 to-orange-50' },
        { label: 'Good', icon: Smile, color: 'text-emerald-500', bg: 'bg-emerald-100', border: 'border-emerald-400', gradient: 'from-emerald-50 to-teal-50' },
        { label: 'Okay', icon: Meh, color: 'text-blue-500', bg: 'bg-blue-100', border: 'border-blue-400', gradient: 'from-blue-50 to-indigo-50' },
        { label: 'Down', icon: Frown, color: 'text-indigo-500', bg: 'bg-indigo-100', border: 'border-indigo-400', gradient: 'from-indigo-50 to-purple-50' },
        { label: 'Awful', icon: CloudRain, color: 'text-slate-500', bg: 'bg-slate-100', border: 'border-slate-400', gradient: 'from-slate-50 to-gray-50' }
    ];

    const currentMoodConfig = moods.find(m => m.label === selectedMood);

    const handleSave = () => {
        if (!selectedMood) return;

        // Save to data context (mocking persistent mood storage for now via notes)
        const newEntry = {
            id: Date.now(),
            type: 'mood_log',
            mood: selectedMood,
            energy: energyLevel,
            text: journalEntry,
            date: new Date().toISOString()
        };
        setNotes([newEntry, ...notes]);

        // Success Feedback
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#6366f1', '#ec4899', '#f59e0b']
        });

        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
            setSelectedMood(null);
            setJournalEntry('');
            setEnergyLevel(5);
        }, 2000);
    };

    return (
        <div className={`min-h-screen transition-colors duration-700 ease-in-out -m-8 p-8 ${currentMoodConfig ? `bg-gradient-to-br ${currentMoodConfig.gradient}` : 'bg-slate-50'}`}>
            <div className="max-w-3xl mx-auto space-y-8">

                <header className="text-center space-y-2">
                    <h1 className="text-4xl font-black bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
                        How are you feeling?
                    </h1>
                    <p className="text-slate-500 text-lg">Check in with yourself. It only takes a moment.</p>
                </header>

                {/* Mood Selection */}
                <div className="grid grid-cols-5 gap-4">
                    {moods.map((mood) => (
                        <motion.button
                            key={mood.label}
                            whileHover={{ y: -5, scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedMood(mood.label)}
                            className={`
                                relative flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-300
                                ${selectedMood === mood.label
                                    ? `bg-white ${mood.border} shadow-xl scale-110 z-10`
                                    : 'bg-white/50 border-transparent hover:bg-white hover:shadow-lg'
                                }
                            `}
                        >
                            <div className={`p-4 rounded-full ${mood.bg} ${mood.color}`}>
                                <mood.icon size={32} />
                            </div>
                            <span className="font-bold text-slate-600 text-sm">{mood.label}</span>

                            {selectedMood === mood.label && (
                                <motion.div
                                    layoutId="outline"
                                    className={`absolute inset-0 border-4 ${mood.border} rounded-2xl opacity-50`}
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                        </motion.button>
                    ))}
                </div>

                {/* Additional Inputs (Energy & Note) */}
                <AnimatePresence>
                    {selectedMood && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/50 space-y-6"
                        >
                            {/* Energy Level */}
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <label className="flex items-center gap-2 font-bold text-slate-700">
                                        <Battery className="text-violet-500" /> Energy Level
                                    </label>
                                    <span className="text-violet-600 font-bold bg-violet-50 px-3 py-1 rounded-lg">{energyLevel}/10</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    value={energyLevel}
                                    onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
                                    className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-500"
                                />
                                <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
                                    <span>Exhausted</span>
                                    <span>Unstoppable</span>
                                </div>
                            </div>

                            {/* Journal Area */}
                            <div>
                                <label className="flex items-center gap-2 font-bold text-slate-700 mb-2">
                                    <BookOpen className="text-pink-500" /> Quick Note <span className="text-slate-400 font-normal text-sm">(optional)</span>
                                </label>
                                <textarea
                                    value={journalEntry}
                                    onChange={(e) => setJournalEntry(e.target.value)}
                                    placeholder="What's on your mind?"
                                    className="w-full h-32 p-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-pink-400 focus:bg-white focus:ring-4 focus:ring-pink-500/10 transition-all resize-none outline-none"
                                />
                            </div>

                            <button
                                onClick={handleSave}
                                className="w-full py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold rounded-xl shadow-lg shadow-fuchsia-200 hover:shadow-fuchsia-300 transform transition-all hover:-translate-y-1 active:scale-[0.98]"
                            >
                                Log Mood
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* History (Brief) */}
                <div className="space-y-4">
                    <h3 className="font-bold text-slate-500 text-sm uppercase tracking-wider pl-2">Recent Logs</h3>
                    <div className="space-y-3">
                        {notes.filter(n => n.type === 'mood_log').slice(0, 3).map(log => (
                            <div key={log.id} className="bg-white/60 p-4 rounded-2xl border border-white/40 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-xl ${moods.find(m => m.label === log.mood)?.bg || 'bg-slate-100'}`}>
                                        {React.createElement(moods.find(m => m.label === log.mood)?.icon || Smile, { size: 20, className: moods.find(m => m.label === log.mood)?.color })}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-700">{log.mood}</p>
                                        <p className="text-xs text-slate-400">{new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Energy: {log.energy}/10</p>
                                    </div>
                                </div>
                                {log.text && <p className="text-sm text-slate-500 italic max-w-xs truncate">"{log.text}"</p>}
                            </div>
                        ))}
                        {notes.filter(n => n.type === 'mood_log').length === 0 && (
                            <p className="text-center text-slate-400 text-sm py-4">No daily logs yet.</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
