import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Book, Calendar, GraduationCap, Clock, MapPin, Trash2, ArrowRight } from 'lucide-react';

export default function StudentSection() {
    const { classes, setClasses, assignments, setAssignments, exams, setExams } = useData();
    const [activeTab, setActiveTab] = useState('classes');
    const [isAdding, setIsAdding] = useState(false);
    const [newItem, setNewItem] = useState({});

    const tabs = [
        { id: 'classes', label: 'Classes', icon: Book, color: 'blue' },
        { id: 'assignments', label: 'Assignments', icon: Calendar, color: 'purple' },
        { id: 'exams', label: 'Exams', icon: GraduationCap, color: 'pink' },
    ];

    const handleAddItem = (e) => {
        e.preventDefault();
        const id = Date.now().toString();
        if (activeTab === 'classes') {
            setClasses([...classes, { ...newItem, id }]);
        } else if (activeTab === 'assignments') {
            setAssignments([...assignments, { ...newItem, id, status: 'pending' }]);
        } else {
            setExams([...exams, { ...newItem, id }]);
        }
        setNewItem({});
        setIsAdding(false);
    };

    const deleteItem = (id, type) => {
        if (type === 'classes') setClasses(classes.filter(i => i.id !== id));
        if (type === 'assignments') setAssignments(assignments.filter(i => i.id !== id));
        if (type === 'exams') setExams(exams.filter(i => i.id !== id));
    };

    const renderForm = () => (
        <form onSubmit={handleAddItem} className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-500 ml-1">Subject / Title</label>
                <input
                    placeholder="e.g. Mathematics"
                    required
                    value={newItem.subject || newItem.title || ''}
                    onChange={e => {
                        const val = e.target.value;
                        if (activeTab === 'assignments') setNewItem({ ...newItem, title: val });
                        else setNewItem({ ...newItem, subject: val });
                    }}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
            </div>

            {activeTab === 'classes' && (
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-500 ml-1">Location</label>
                        <input
                            placeholder="Room 101"
                            value={newItem.location || ''}
                            onChange={e => setNewItem({ ...newItem, location: e.target.value })}
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-500 ml-1">Time</label>
                        <input
                            type="datetime-local"
                            required
                            value={newItem.date || ''}
                            onChange={e => setNewItem({ ...newItem, date: e.target.value })}
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                        />
                    </div>
                </div>
            )}

            {activeTab === 'assignments' && (
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-500 ml-1">Due Date</label>
                    <input
                        type="datetime-local"
                        required
                        value={newItem.due || ''}
                        onChange={e => setNewItem({ ...newItem, due: e.target.value })}
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    />
                </div>
            )}

            {activeTab === 'exams' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-500 ml-1">Exam Date</label>
                        <input
                            type="datetime-local"
                            required
                            value={newItem.date || ''}
                            onChange={e => setNewItem({ ...newItem, date: e.target.value })}
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-500 ml-1">Notes</label>
                        <input
                            placeholder="Chapters 1-5"
                            value={newItem.notes || ''}
                            onChange={e => setNewItem({ ...newItem, notes: e.target.value })}
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                        />
                    </div>
                </div>
            )}

            <div className="flex gap-3 pt-4">
                <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="flex-1 py-3 text-slate-500 font-semibold hover:bg-slate-100 rounded-xl transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:shadow-blue-300 transform hover:scale-[1.02] transition-all"
                >
                    Add Item
                </button>
            </div>
        </form>
    );

    const renderList = () => {
        const list = activeTab === 'classes' ? classes : activeTab === 'assignments' ? assignments : exams;

        if (list.length === 0) return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-white/50 border-2 border-dashed border-slate-200 rounded-3xl"
            >
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                    {activeTab === 'classes' && <Book size={32} />}
                    {activeTab === 'assignments' && <Calendar size={32} />}
                    {activeTab === 'exams' && <GraduationCap size={32} />}
                </div>
                <p className="text-slate-400 font-medium tracking-wide">No {activeTab} added yet.</p>
            </motion.div>
        );

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {list.map((item, index) => (
                    <motion.div
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: index * 0.05 }}
                        key={item.id}
                        className="group relative bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-white/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                        {/* Decorative Gradient Background */}
                        <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl
                            ${activeTab === 'classes' ? 'from-blue-500 to-cyan-500' : ''}
                            ${activeTab === 'assignments' ? 'from-purple-500 to-pink-500' : ''}
                            ${activeTab === 'exams' ? 'from-pink-500 to-rose-500' : ''}
                        `} />

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl bg-gradient-to-br text-white shadow-md
                                    ${activeTab === 'classes' ? 'from-blue-500 to-cyan-500 shadow-blue-200' : ''}
                                    ${activeTab === 'assignments' ? 'from-purple-500 to-pink-500 shadow-purple-200' : ''}
                                    ${activeTab === 'exams' ? 'from-pink-500 to-rose-500 shadow-pink-200' : ''}
                                `}>
                                    {activeTab === 'classes' && <Book size={20} />}
                                    {activeTab === 'assignments' && <Calendar size={20} />}
                                    {activeTab === 'exams' && <GraduationCap size={20} />}
                                </div>
                                <button
                                    onClick={() => deleteItem(item.id, activeTab)}
                                    className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <h3 className="text-xl font-bold text-slate-800 mb-1">{item.subject || item.title}</h3>

                            <div className="space-y-2 mt-4">
                                {(item.date || item.due) && (
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <Clock size={16} className="text-slate-400" />
                                        <span>
                                            {new Date(item.date || item.due).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                )}
                                {item.location && (
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <MapPin size={16} className="text-slate-400" />
                                        <span>{item.location}</span>
                                    </div>
                                )}
                                {item.notes && (
                                    <p className="text-sm text-slate-400 italic bg-slate-50 p-2 rounded-lg border border-slate-100 mt-2">
                                        "{item.notes}"
                                    </p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        );
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Student Hub
                    </h1>
                    <p className="text-slate-500 mt-2 text-lg">Manage your academic life effortlessly.</p>
                </div>

                <div className="flex bg-white/60 p-1.5 rounded-2xl border border-white/50 shadow-sm backdrop-blur-sm">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id); setIsAdding(false); }}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 relative overflow-hidden
                                ${activeTab === tab.id
                                    ? 'text-white shadow-md'
                                    : 'text-slate-500 hover:bg-white/50 hover:text-slate-700'
                                }
                            `}
                        >
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="tab-bg"
                                    className={`absolute inset-0 bg-gradient-to-r 
                                        ${tab.id === 'classes' ? 'from-blue-500 to-cyan-500' : ''}
                                        ${tab.id === 'assignments' ? 'from-purple-500 to-pink-500' : ''}
                                        ${tab.id === 'exams' ? 'from-pink-500 to-rose-500' : ''}
                                    `}
                                    initial={false}
                                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10 flex items-center gap-2">
                                <tab.icon size={18} /> {tab.label}
                            </span>
                        </button>
                    ))}
                </div>
            </header>

            <div className="flex justify-end">
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className={`
                        flex items-center gap-2 px-6 py-3 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 transition-all active:scale-95
                        ${activeTab === 'classes' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : ''}
                        ${activeTab === 'assignments' ? 'bg-gradient-to-r from-purple-500 to-pink-500' : ''}
                        ${activeTab === 'exams' ? 'bg-gradient-to-r from-pink-500 to-rose-500' : ''}
                    `}
                >
                    <Plus size={20} />
                    {isAdding ? 'Close Form' : `Add ${tabs.find(t => t.id === activeTab).label.slice(0, -1)}`}
                </button>
            </div>

            <AnimatePresence mode="wait">
                {isAdding ? (
                    <motion.div
                        initial={{ opacity: 0, y: -20, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -20, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/60 max-w-2xl mx-auto">
                            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                                <div className={`p-2 rounded-lg text-white
                                     ${activeTab === 'classes' ? 'bg-blue-500' : ''}
                                     ${activeTab === 'assignments' ? 'bg-purple-500' : ''}
                                     ${activeTab === 'exams' ? 'bg-pink-500' : ''}
                                `}>
                                    <Plus size={20} />
                                </div>
                                New {activeTab.slice(0, -1)}
                            </h2>
                            {renderForm()}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                    >
                        {renderList()}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
