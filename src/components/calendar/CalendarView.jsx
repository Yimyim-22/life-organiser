import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, X, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CalendarView() {
    const { tasks, assignments, exams } = useData();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);

    const days = eachDayOfInterval({
        start: startOfWeek(startOfMonth(currentMonth)),
        end: endOfWeek(endOfMonth(currentMonth))
    });

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    // Get data for selected date
    const selectedDateTasks = selectedDate ? tasks.filter(t => isSameDay(new Date(t.date), selectedDate)) : [];
    const selectedDateAssignments = selectedDate && assignments ? assignments.filter(a => a.due && isSameDay(new Date(a.due), selectedDate)) : [];
    const selectedDateExams = selectedDate && exams ? exams.filter(e => e.date && isSameDay(new Date(e.date), selectedDate)) : [];

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                        Calendar
                    </h1>
                    <p className="text-slate-500 mt-1">Plan your month ahead.</p>
                </div>
                <div className="flex items-center gap-4 bg-white/60 backdrop-blur-md p-2 rounded-2xl shadow-sm border border-white/50">
                    <button onClick={prevMonth} className="p-2 hover:bg-white rounded-xl transition-colors text-slate-600">
                        <ChevronLeft size={20} />
                    </button>
                    <span className="text-lg font-bold text-slate-700 w-32 text-center select-none">
                        {format(currentMonth, 'MMMM yyyy')}
                    </span>
                    <button onClick={nextMonth} className="p-2 hover:bg-white rounded-xl transition-colors text-slate-600">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 items-start relative">
                {/* Calendar Grid */}
                <div className="flex-1 bg-white/70 backdrop-blur-md rounded-3xl shadow-xl shadow-indigo-100/50 border border-white/60 overflow-hidden">
                    <div className="grid grid-cols-7 bg-indigo-50/50 border-b border-indigo-100">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="py-4 text-center text-sm font-semibold text-indigo-400 uppercase tracking-wider">
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7">
                        {days.map((day, idx) => {
                            const dayTasks = tasks.filter(t => isSameDay(new Date(t.date), day));
                            const dayAssignments = assignments ? assignments.filter(a => a.due && isSameDay(new Date(a.due), day)) : [];
                            const dayExams = exams ? exams.filter(e => e.date && isSameDay(new Date(e.date), day)) : [];
                            const totalEvents = dayTasks.length + dayAssignments.length + dayExams.length;

                            const isCurrentMonth = isSameMonth(day, currentMonth);
                            const isToday = isSameDay(day, new Date());
                            const isSelected = selectedDate && isSameDay(day, selectedDate);

                            return (
                                <motion.div
                                    key={day.toISOString()}
                                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.8)' }}
                                    onClick={() => setSelectedDate(day)}
                                    className={`
                                        min-h-[120px] p-3 border-b border-r border-indigo-50/50 cursor-pointer transition-colors relative group
                                        ${!isCurrentMonth && 'bg-slate-50/30'}
                                        ${idx % 7 === 6 && 'border-r-0'}
                                        ${isSelected ? 'bg-indigo-50/80 ring-2 ring-inset ring-indigo-400 z-10' : ''}
                                    `}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`
                                            w-8 h-8 flex items-center justify-center rounded-xl text-sm font-bold transition-all
                                            ${isToday
                                                ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-200'
                                                : 'text-slate-600 group-hover:bg-white group-hover:shadow-sm'
                                            }
                                        `}>
                                            {format(day, 'd')}
                                        </span>
                                        {totalEvents > 0 && (
                                            <span className="text-xs font-bold text-slate-400 bg-white px-2 py-0.5 rounded-full shadow-sm border border-slate-100">
                                                {totalEvents}
                                            </span>
                                        )}
                                    </div>

                                    <div className="space-y-1.5">
                                        {dayExams.map((e, i) => (
                                            <div key={e.id} className="text-xs truncate px-2 py-1 bg-pink-100 text-pink-600 rounded-md font-medium border border-pink-200/50">
                                                🎓 {e.subject}
                                            </div>
                                        ))}
                                        {dayAssignments.map((a, i) => (
                                            <div key={a.id} className="text-xs truncate px-2 py-1 bg-blue-100 text-blue-600 rounded-md font-medium border border-blue-200/50">
                                                📝 {a.title}
                                            </div>
                                        ))}
                                        {dayTasks.slice(0, 2).map(t => (
                                            <div key={t.id} className="flex items-center gap-1 text-xs text-slate-500 truncate px-1">
                                                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${t.priority === 'high' ? 'bg-red-400' : 'bg-indigo-400'}`} />
                                                <span className={t.completed ? 'line-through opacity-50' : ''}>{t.title}</span>
                                            </div>
                                        ))}
                                        {dayTasks.length > 2 && (
                                            <div className="text-[10px] text-slate-400 pl-3">
                                                +{dayTasks.length - 2} more tasks
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Side Panel */}
                <AnimatePresence>
                    {selectedDate && (
                        <motion.div
                            initial={{ opacity: 0, x: 20, width: 0 }}
                            animate={{ opacity: 1, x: 0, width: 320 }}
                            exit={{ opacity: 0, x: 20, width: 0 }}
                            className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden sticky top-4 h-[calc(100vh-140px)] flex flex-col"
                        >
                            <div className="p-6 border-b border-indigo-50 flex justify-between items-center bg-indigo-50/30">
                                <h3 className="font-bold text-slate-700 text-lg">
                                    {format(selectedDate, 'MMMM d, yyyy')}
                                </h3>
                                <button
                                    onClick={() => setSelectedDate(null)}
                                    className="p-1.5 hover:bg-white rounded-full text-slate-400 hover:text-red-500 transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-4 overflow-y-auto flex-1 space-y-4">
                                {selectedDateTasks.length === 0 && selectedDateAssignments.length === 0 && selectedDateExams.length === 0 ? (
                                    <div className="text-center py-10">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300">
                                            <CalendarIcon size={32} />
                                        </div>
                                        <p className="text-slate-400">Nothing scheduled for today.<br />Enjoy your free time!</p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Exams */}
                                        {selectedDateExams.length > 0 && (
                                            <div className="space-y-2">
                                                <h4 className="text-xs font-bold text-pink-400 uppercase tracking-wider pl-1">Exams</h4>
                                                {selectedDateExams.map(e => (
                                                    <div key={e.id} className="p-3 bg-pink-50 rounded-xl border border-pink-100/50">
                                                        <p className="font-bold text-pink-700">{e.subject}</p>
                                                        {e.notes && <p className="text-xs text-pink-500 mt-1">{e.notes}</p>}
                                                        <div className="flex items-center gap-1 mt-2 text-xs text-pink-400">
                                                            <Clock size={12} /> {format(new Date(e.date), 'h:mm a')}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Assignments */}
                                        {selectedDateAssignments.length > 0 && (
                                            <div className="space-y-2">
                                                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider pl-1">Assignments</h4>
                                                {selectedDateAssignments.map(a => (
                                                    <div key={a.id} className="p-3 bg-blue-50 rounded-xl border border-blue-100/50">
                                                        <p className="font-bold text-blue-700">{a.title}</p>
                                                        <div className="flex items-center gap-1 mt-2 text-xs text-blue-400">
                                                            <Clock size={12} /> Due {format(new Date(a.due), 'h:mm a')}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Tasks */}
                                        {selectedDateTasks.length > 0 && (
                                            <div className="space-y-2">
                                                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider pl-1">Tasks</h4>
                                                {selectedDateTasks.map(t => (
                                                    <div key={t.id} className={`p-3 rounded-xl border flex items-center gap-3 ${t.completed ? 'bg-slate-50 border-transparent opacity-60' : 'bg-white border-indigo-50 shadow-sm'
                                                        }`}>
                                                        <div className={`w-3 h-3 rounded-full border-2 ${t.completed ? 'bg-indigo-400 border-indigo-400' : 'border-indigo-200'
                                                            }`} />
                                                        <div className="flex-1 min-w-0">
                                                            <p className={`font-medium text-sm truncate ${t.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                                                                {t.title}
                                                            </p>
                                                            <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                                                                <Clock size={12} /> {t.time}
                                                                <span className={`px-1.5 py-0.5 rounded-md text-[10px] uppercase font-bold ${t.priority === 'high' ? 'bg-red-100 text-red-500' : 'bg-slate-100 text-slate-400'
                                                                    }`}>{t.priority}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
