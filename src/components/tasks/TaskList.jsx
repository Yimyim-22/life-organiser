import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Calendar as CalendarIcon, Clock, CheckCircle, Circle, Tag, Zap } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import confetti from 'canvas-confetti';

export default function TaskList() {
    const { tasks, addTask, deleteTask, toggleTaskCompletion } = useData();
    const [filter, setFilter] = useState('all');
    const [isAdding, setIsAdding] = useState(false);
    const [newTask, setNewTask] = useState({
        title: '',
        priority: 'medium',
        date: format(new Date(), 'yyyy-MM-dd'),
        time: '12:00',
        frequency: 'once'
    });

    const handleAdd = (e) => {
        e.preventDefault();
        if (!newTask.title) return;
        addTask({ ...newTask, isOnTime: true });
        setNewTask({ ...newTask, title: '' });
        setIsAdding(false);
        confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 }
        });
    };

    const handleToggle = (id) => {
        const task = tasks.find(t => t.id === id);
        if (task && !task.completed) {
            confetti({
                particleCount: 30,
                spread: 50,
                origin: { y: 0.6 },
                colors: ['#10b981', '#34d399']
            });
        }
        toggleTaskCompletion(id);
    };

    const filteredTasks = tasks.filter(t => {
        if (filter === 'active') return !t.completed;
        if (filter === 'completed') return t.completed;
        return true;
    }).sort((a, b) => {
        const dateA = new Date((a.date || '') + 'T' + (a.time || ''));
        const dateB = new Date((b.date || '') + 'T' + (b.time || ''));
        if (isNaN(dateA.getTime())) return 1;
        if (isNaN(dateB.getTime())) return -1;
        return dateA - dateB;
    });

    const priorityConfig = {
        low: { color: 'bg-emerald-100 text-emerald-600', border: 'border-emerald-200' },
        medium: { color: 'bg-amber-100 text-amber-600', border: 'border-amber-200' },
        high: { color: 'bg-rose-100 text-rose-600', border: 'border-rose-200' }
    };

    // --- Statistics Logic ---
    const totalMidTasks = tasks.length;
    const completedTasksCount = tasks.filter(t => t.completed).length;
    const completionPercentage = totalMidTasks === 0 ? 0 : Math.round((completedTasksCount / totalMidTasks) * 100);

    // Simple Streak Logic: Consecutive days with at least one completed task ending today or yesterday
    const calculateStreak = () => {
        if (tasks.filter(t => t.completed).length === 0) return 0;

        const sortedCompletedDates = [...new Set(tasks
            .filter(t => t.completed && t.date) // Ensure date exists
            .map(t => t.date)
        )].sort((a, b) => new Date(b) - new Date(a)); // Descending

        if (sortedCompletedDates.length === 0) return 0;

        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        // If no task done today or yesterday, streak is broken
        if (sortedCompletedDates[0] !== today && sortedCompletedDates[0] !== yesterday) return 0;

        let streak = 0;
        let currentDate = new Date(sortedCompletedDates[0]);

        for (let i = 0; i < sortedCompletedDates.length; i++) {
            const dateToCheck = new Date(sortedCompletedDates[i]);
            // Check if this date is consecutive to the current tracker
            const diffTime = Math.abs(currentDate - dateToCheck);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (i === 0) {
                streak = 1;
            } else {
                const prevDate = new Date(sortedCompletedDates[i - 1]);
                const diff = (prevDate - dateToCheck) / (1000 * 60 * 60 * 24);
                if (diff === 1) streak++;
                else break;
            }
        }
        return streak;
    };

    const currentStreak = calculateStreak();

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        My Tasks
                    </h1>
                    <p className="text-slate-500 mt-1">Stay organized and get things done.</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:scale-105 transition-all active:scale-95"
                >
                    <Plus size={20} /> New Task
                </button>
            </div>

            {/* Statistics Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Completion Box */}
                <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Completion Rate</p>
                        <h3 className="text-3xl font-bold text-slate-800 mt-1">{completionPercentage}%</h3>
                    </div>
                    <div className="w-16 h-16 relative flex items-center justify-center">
                        <svg className="transform -rotate-90 w-full h-full">
                            <circle cx="32" cy="32" r="28" stroke="#e2e8f0" strokeWidth="6" fill="transparent" />
                            <circle cx="32" cy="32" r="28" stroke="#3b82f6" strokeWidth="6" fill="transparent"
                                strokeDasharray={2 * Math.PI * 28}
                                strokeDashoffset={2 * Math.PI * 28 * (1 - completionPercentage / 100)}
                                className="transition-all duration-1000 ease-out"
                            />
                        </svg>
                        <span className="absolute text-xs font-bold text-slate-600">{completedTasksCount}/{totalMidTasks}</span>
                    </div>
                </div>

                {/* Streak Box */}
                <div className="bg-gradient-to-br from-orange-400 to-pink-500 p-6 rounded-2xl shadow-lg shadow-orange-200 text-white flex items-center justify-between">
                    <div>
                        <p className="text-white/80 text-sm font-semibold uppercase tracking-wider">Current Streak</p>
                        <h3 className="text-3xl font-bold mt-1 flex items-center gap-2">
                            {currentStreak} Days <span className="text-2xl">🔥</span>
                        </h3>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <Zap size={24} className="text-white" fill="white" />
                    </div>
                </div>
            </div>

            {/* Add Task Form */}
            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, y: -20 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -20 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-slate-200 mb-6">
                            <form onSubmit={handleAdd} className="space-y-4">
                                <input
                                    autoFocus
                                    placeholder="What do you need to do?"
                                    value={newTask.title}
                                    onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                                    className="w-full text-lg font-medium bg-transparent border-b-2 border-slate-200 focus:border-blue-500 outline-none pb-2 placeholder:text-slate-400"
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                            <CalendarIcon size={18} className="text-slate-400" />
                                            <input
                                                type="date"
                                                value={newTask.date}
                                                onChange={e => setNewTask({ ...newTask, date: e.target.value })}
                                                className="bg-transparent outline-none text-slate-600 flex-1"
                                            />
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                            <Clock size={18} className="text-slate-400" />
                                            <input
                                                type="time"
                                                value={newTask.time}
                                                onChange={e => setNewTask({ ...newTask, time: e.target.value })}
                                                className="bg-transparent outline-none text-slate-600 flex-1"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 px-3 py-3 bg-slate-50 rounded-xl border border-slate-100">
                                            <Tag size={18} className="text-slate-400" />
                                            <select
                                                value={newTask.priority}
                                                onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
                                                className="bg-transparent outline-none text-slate-600 flex-1"
                                            >
                                                <option value="low">Low Priority</option>
                                                <option value="medium">Medium Priority</option>
                                                <option value="high">High Priority</option>
                                            </select>
                                        </div>
                                        <div className="flex items-center gap-3 px-3 py-3 bg-slate-50 rounded-xl border border-slate-100">
                                            <Zap size={18} className="text-slate-400" />
                                            <select
                                                value={newTask.frequency}
                                                onChange={e => setNewTask({ ...newTask, frequency: e.target.value })}
                                                className="bg-transparent outline-none text-slate-600 flex-1"
                                            >
                                                <option value="once">One-time</option>
                                                <option value="daily">Daily</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsAdding(false)}
                                        className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                                    >
                                        Save Task
                                    </button>
                                </div>
                            </form>

                            {/* Recommended Chips */}
                            <div className="mt-4 pt-4 border-t border-slate-100 overflow-x-auto">
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Quick Add</p>
                                <div className="flex gap-2 pb-2">
                                    {[
                                        "Tidy room", "Laundry", "Study", "Exercise", "Read"
                                    ].map(rec => (
                                        <button
                                            key={rec}
                                            onClick={() => setNewTask({ ...newTask, title: rec })}
                                            className="px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 text-slate-600 rounded-full hover:border-blue-300 hover:text-blue-600 transition-all whitespace-nowrap"
                                        >
                                            + {rec}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Filters */}
            <div className="flex gap-2 p-1 bg-slate-100/50 rounded-xl w-fit">
                {['all', 'active', 'completed'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === f
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            {/* Task List */}
            <motion.div layout className="space-y-3">
                <AnimatePresence mode="popLayout">
                    {filteredTasks.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12 rounded-3xl border-2 border-dashed border-slate-200/60"
                        >
                            <p className="text-slate-400">No tasks found. Enjoy your day!</p>
                        </motion.div>
                    ) : (
                        filteredTasks.map(task => (
                            <motion.div
                                key={task.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={`group p-4 rounded-2xl border transition-all duration-200 flex items-center gap-4
                                    ${task.completed
                                        ? 'bg-slate-50 border-slate-100 opacity-75'
                                        : 'bg-white border-transparent hover:border-blue-100 shadow-sm hover:shadow-md'
                                    }
                                `}
                            >
                                <button
                                    onClick={() => handleToggle(task.id)}
                                    className="flex-shrink-0 transition-transform active:scale-90"
                                >
                                    {task.completed ? (
                                        <CheckCircle size={24} className="text-blue-500" />
                                    ) : (
                                        <Circle size={24} className="text-slate-300 group-hover:text-blue-400" />
                                    )}
                                </button>

                                <div className="flex-1 min-w-0">
                                    <h3 className={`text-lg font-medium truncate transition-colors ${task.completed ? 'text-slate-400 line-through' : 'text-slate-700'
                                        }`}>
                                        {task.title}
                                    </h3>
                                    <div className="flex items-center gap-3 mt-1 text-sm text-slate-400">
                                        <span className="flex items-center gap-1">
                                            <CalendarIcon size={14} />
                                            {format(parseISO(task.date), 'MMM d')}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock size={14} />
                                            {task.time}
                                        </span>
                                        {task.frequency === 'daily' && (
                                            <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-xs">Daily</span>
                                        )}
                                    </div>
                                </div>

                                <div className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize border ${priorityConfig[task.priority].color} ${priorityConfig[task.priority].border}`}>
                                    {task.priority}
                                </div>

                                <button
                                    onClick={() => deleteTask(task.id)}
                                    className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
