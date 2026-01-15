import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, Trophy, Flag, Calendar as CalendarIcon, ArrowRight } from 'lucide-react';

export default function GoalsTracker() {
    const { goals, setGoals } = useData();
    const [isAdding, setIsAdding] = useState(false);
    const [newGoal, setNewGoal] = useState({ title: '', target: '', date: '', progress: 0 });

    const handleAdd = (e) => {
        e.preventDefault();
        setGoals([...goals, {
            id: Date.now().toString(),
            ...newGoal,
            progress: 0
        }]);
        setNewGoal({ title: '', target: '', date: '', progress: 0 });
        setIsAdding(false);
    };

    const deleteGoal = (id) => {
        setGoals(goals.filter(g => g.id !== id));
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 20 } }
    };

    const totalGoals = goals.length;
    const completedGoals = goals.filter(g => g.progress === 100).length;
    const activeGoals = totalGoals - completedGoals;

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                        Goals Dashboard
                    </h1>
                    <p className="text-slate-500 mt-1">Dream big, achieve bigger.</p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:scale-[1.05] transition-all active:scale-95"
                >
                    <Plus size={20} /> New Goal
                </button>
            </header>

            {/* Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Goals', value: totalGoals, icon: Flag, color: 'text-blue-500', bg: 'bg-blue-50' },
                    { label: 'Active', value: activeGoals, icon: Target, color: 'text-indigo-500', bg: 'bg-indigo-50' },
                    { label: 'Completed', value: completedGoals, icon: Trophy, color: 'text-emerald-500', bg: 'bg-emerald-50' }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white/60 backdrop-blur-xl border border-white/40 p-6 rounded-2xl shadow-sm flex items-center justify-between group hover:shadow-md transition-shadow"
                    >
                        <div>
                            <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">{stat.label}</p>
                            <h3 className="text-3xl font-bold text-slate-700 mt-1">{stat.value}</h3>
                        </div>
                        <div className={`p-4 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                            <stat.icon size={28} />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Goals Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                {goals.map(goal => (
                    <motion.div
                        key={goal.id}
                        variants={itemVariants}
                        whileHover={{ y: -8, transition: { duration: 0.2 } }}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-indigo-500/10 transition-all cursor-pointer relative group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-indigo-50 text-indigo-500 rounded-xl">
                                <Target size={24} />
                            </div>
                            <span className="text-xs font-bold px-2 py-1 rounded-lg bg-slate-100 text-slate-500">
                                {goal.date ? new Date(goal.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'No Date'}
                            </span>
                        </div>

                        <h3 className="text-lg font-bold text-slate-800 mb-2">{goal.title}</h3>
                        <p className="text-slate-500 text-sm mb-6 line-clamp-2">{goal.target}</p>

                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-semibold text-slate-400">
                                <span>Progress</span>
                                <span>{goal.progress}%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${goal.progress}%` }}
                                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                                />
                            </div>
                        </div>

                        {/* Hover Overlay Actions (optional enhancement) */}
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            {/* Placeholder for Edit/Delete */}
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Empty State */}
            {goals.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <motion.div
                        animate={{ y: [0, -15, 0] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        className="mb-8 relative"
                    >
                        <div className="absolute inset-0 bg-blue-400 blur-2xl opacity-20 rounded-full" />
                        <Target size={80} className="text-blue-500 relative z-10" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-slate-700 mb-2">No Goals Yet</h3>
                    <p className="text-slate-400 max-w-sm mx-auto mb-8">Start your journey by setting your first goal. Whether big or small, every step counts!</p>
                    <button
                        onClick={() => setIsAdding(true)}
                        className="px-8 py-3 bg-white text-blue-600 font-bold rounded-xl border border-blue-100 shadow-sm hover:shadow-md hover:bg-blue-50 transition-all"
                    >
                        Create First Goal
                    </button>
                </div>
            )}

            {/* Add Goal Modal */}
            <AnimatePresence>
                {isAdding && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white w-full max-w-lg p-8 rounded-3xl shadow-2xl overflow-hidden relative"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-500" />
                            <h2 className="text-2xl font-bold mb-6 text-slate-800">New Goal</h2>
                            <form onSubmit={handleAdd} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-500 mb-2">Goal Title</label>
                                    <input
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                        placeholder="e.g. Save $5,000"
                                        value={newGoal.title}
                                        onChange={e => setNewGoal({ ...newGoal, title: e.target.value })}
                                        required
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-500 mb-2">Description / Target</label>
                                    <textarea
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none h-24"
                                        placeholder="Platform for financial freedom..."
                                        value={newGoal.target}
                                        onChange={e => setNewGoal({ ...newGoal, target: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-500 mb-2">Target Date</label>
                                    <input
                                        type="date"
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                        value={newGoal.date}
                                        onChange={e => setNewGoal({ ...newGoal, date: e.target.value })}
                                    />
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsAdding(false)}
                                        className="flex-1 py-3 text-slate-500 font-semibold hover:bg-slate-50 rounded-xl transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                    >
                                        Create Goal
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
