import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, X, Trophy, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useUser } from '../../context/UserContext'; // Assuming we might store habits here later, using local state for now as per plan focus on UI

// Helper for circular progress
const CircularProgress = ({ value, max, size = 60, strokeWidth = 6, color = "#6366f1" }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / max) * circumference;

    return (
        <div style={{ width: size, height: size }} className="relative flex items-center justify-center">
            <svg width={size} height={size} className="transform -rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#e2e8f0"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                />
            </svg>
            <span className="absolute text-xs font-bold text-slate-600">{Math.round((value / max) * 100)}%</span>
        </div>
    );
};

export default function HabitTracker() {
    // Mock Data for now, ideally this goes into DataContext
    const [habits, setHabits] = useState([
        { id: 1, name: "Morning Meditation", streak: 12, completedToday: false, frequency: "Daily" },
        { id: 2, name: "Drink 2L Water", streak: 5, completedToday: true, frequency: "Daily" },
        { id: 3, name: "Read 30 Mins", streak: 0, completedToday: false, frequency: "Daily" },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newHabit, setNewHabit] = useState({ name: '', frequency: 'Daily' });

    const toggleHabit = (id) => {
        setHabits(prev => prev.map(h => {
            if (h.id === id) {
                const isNowCompleted = !h.completedToday;
                if (isNowCompleted) {
                    confetti({
                        particleCount: 50,
                        spread: 60,
                        origin: { y: 0.7 },
                        colors: ['#6366f1', '#8b5cf6', '#ec4899']
                    });
                }
                return {
                    ...h,
                    completedToday: isNowCompleted,
                    streak: isNowCompleted ? h.streak + 1 : Math.max(0, h.streak - 1)
                };
            }
            return h;
        }));
    };

    const addHabit = (e) => {
        e.preventDefault();
        if (!newHabit.name) return;
        setHabits([...habits, { id: Date.now(), name: newHabit.name, streak: 0, completedToday: false, frequency: newHabit.frequency }]);
        setNewHabit({ name: '', frequency: 'Daily' });
        setIsModalOpen(false);
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    const completedCount = habits.filter(h => h.completedToday).length;
    const completionRate = habits.length > 0 ? (completedCount / habits.length) * 100 : 0;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                        Habit Tracker
                    </h1>
                    <p className="text-slate-500 mt-1">Build better routines, one day at a time.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg shadow-purple-200 hover:shadow-purple-300 hover:scale-105 transition-all active:scale-95"
                >
                    <Plus size={20} /> New Habit
                </button>
            </header>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-white/50 flex items-center justify-between"
                >
                    <div>
                        <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Completion</p>
                        <h3 className="text-2xl font-bold text-slate-700 mt-1">{Math.round(completionRate)}%</h3>
                    </div>
                    <CircularProgress value={completedCount} max={habits.length} />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-white/50 flex items-center justify-between"
                >
                    <div>
                        <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Longest Streak</p>
                        <h3 className="text-2xl font-bold text-slate-700 mt-1">12 Days</h3>
                    </div>
                    <div className="p-3 bg-orange-100 text-orange-500 rounded-full animate-float">
                        <Flame size={24} />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-white/50 flex items-center justify-between"
                >
                    <div>
                        <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Total Active</p>
                        <h3 className="text-2xl font-bold text-slate-700 mt-1">{habits.length} Habits</h3>
                    </div>
                    <div className="p-3 bg-purple-100 text-purple-500 rounded-full">
                        <Trophy size={24} />
                    </div>
                </motion.div>
            </div>

            {/* Habits Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 gap-4"
            >
                {habits.map(habit => (
                    <motion.div
                        key={habit.id}
                        variants={itemVariants}
                        className={`group p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between
                            ${habit.completedToday
                                ? 'bg-purple-50 border-purple-200 shadow-md shadow-purple-100'
                                : 'bg-white border-transparent hover:border-slate-200 shadow-sm hover:shadow-md'
                            }
                        `}
                    >
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => toggleHabit(habit.id)}
                                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
                                    ${habit.completedToday
                                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white scale-110 rotate-3'
                                        : 'bg-slate-100 text-slate-300 group-hover:bg-slate-200'
                                    }
                                `}
                            >
                                <Check size={24} strokeWidth={3} />
                            </button>
                            <div>
                                <h3 className={`text-lg font-bold transition-colors ${habit.completedToday ? 'text-purple-700 decoration-purple-300' : 'text-slate-700'}`}>
                                    {habit.name}
                                </h3>
                                <p className="text-slate-400 text-sm flex items-center gap-1">
                                    <Flame size={14} className={habit.streak > 3 ? "text-orange-500" : ""} />
                                    {habit.streak} day streak
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-bold px-2 py-1 rounded-lg bg-slate-100 text-slate-500 uppercase tracking-wide">
                                {habit.frequency}
                            </span>
                        </div>
                    </motion.div>
                ))}

                {habits.length === 0 && (
                    <div className="text-center py-12 bg-white/50 rounded-3xl border-2 border-dashed border-slate-200">
                        <p className="text-slate-400">No habits yet. Start small!</p>
                    </div>
                )}
            </motion.div>

            {/* Add Habit Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                                onClick={e => e.stopPropagation()}
                                className="bg-white w-full max-w-md p-8 rounded-3xl shadow-2xl relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-pink-500" />
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </button>

                                <h2 className="text-2xl font-bold text-slate-800 mb-6">New Habit</h2>

                                <form onSubmit={addHabit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-500 mb-2">Habit Name</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Read 10 mins"
                                            value={newHabit.name}
                                            onChange={e => setNewHabit({ ...newHabit, name: e.target.value })}
                                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                                            autoFocus
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-500 mb-2">Frequency</label>
                                        <select
                                            value={newHabit.frequency}
                                            onChange={e => setNewHabit({ ...newHabit, frequency: e.target.value })}
                                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all appearance-none"
                                        >
                                            <option>Daily</option>
                                            <option>Weekly</option>
                                            <option>Weekdays</option>
                                        </select>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-4 mt-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-bold shadow-lg shadow-purple-200 hover:shadow-purple-300 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                    >
                                        Create Habit
                                    </button>
                                </form>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
