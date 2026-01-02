import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Calendar as CalendarIcon, Clock, CheckCircle, Circle } from 'lucide-react';
import { format, isBefore, parseISO } from 'date-fns';

export default function TaskList() {
    const { tasks, addTask, deleteTask, toggleTaskCompletion } = useData();
    const [filter, setFilter] = useState('all'); // all, active, completed
    const [isAdding, setIsAdding] = useState(false);
    const [newTask, setNewTask] = useState({
        title: '',
        priority: 'medium', // low, medium, high
        date: format(new Date(), 'yyyy-MM-dd'),
        time: '12:00',
        frequency: 'once' // once, daily
    });

    const handleAdd = (e) => {
        e.preventDefault();
        if (!newTask.title) return;

        addTask({
            ...newTask,
            isOnTime: true // Default assumption, calculated on completion
        });
        setNewTask({ ...newTask, title: '' });
        setIsAdding(false);
    };

    const filteredTasks = tasks.filter(t => {
        if (filter === 'active') return !t.completed;
        if (filter === 'completed') return t.completed;
        return true;
    }).sort((a, b) => {
        const dateA = new Date((a.date || '') + 'T' + (a.time || ''));
        const dateB = new Date((b.date || '') + 'T' + (b.time || ''));
        // Handle invalid dates safely
        if (isNaN(dateA.getTime())) return 1;
        if (isNaN(dateB.getTime())) return -1;
        return dateA - dateB;
    });

    const priorityColors = {
        low: '#10b981',
        medium: '#f59e0b',
        high: '#ef4444'
    };

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '10px' }}>
                <h1 className="text-gradient">Tasks</h1>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    style={{
                        background: 'var(--color-primary)',
                        color: 'white',
                        padding: '10px 20px',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontWeight: '600',
                        fontSize: '0.9rem'
                    }}
                >
                    <Plus size={20} /> Add Task
                </button>
            </div>

            {isAdding && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="card"
                    style={{ marginBottom: '24px', padding: '20px' }}
                >
                    <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
                        <input
                            autoFocus
                            placeholder="What do you need to do?"
                            value={newTask.title}
                            onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                            style={{
                                width: '100%',
                                maxWidth: '100%',
                                minWidth: 0,
                                boxSizing: 'border-box',
                                padding: '12px 0',
                                fontSize: '1.1rem',
                                border: 'none',
                                background: 'transparent',
                                outline: 'none',
                                borderBottom: '2px solid var(--border-light)'
                            }}
                        />
                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 auto', minWidth: '120px' }}>
                                <CalendarIcon size={18} color="var(--text-muted)" />
                                <input
                                    type="date"
                                    value={newTask.date}
                                    onChange={e => setNewTask({ ...newTask, date: e.target.value })}
                                    style={{ border: 'none', background: 'transparent', color: 'var(--text-main)', maxWidth: '100%', minWidth: 0, flex: 1 }}
                                />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 auto', minWidth: '100px' }}>
                                <Clock size={18} color="var(--text-muted)" />
                                <input
                                    type="time"
                                    value={newTask.time}
                                    onChange={e => setNewTask({ ...newTask, time: e.target.value })}
                                    style={{ border: 'none', background: 'transparent', color: 'var(--text-main)', maxWidth: '100%', minWidth: 0, flex: 1 }}
                                />
                            </div>
                            <select
                                value={newTask.priority}
                                onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
                                style={{
                                    padding: '8px',
                                    borderRadius: 'var(--radius-sm)',
                                    border: '1px solid var(--border-light)',
                                    background: 'var(--bg-app)',
                                    color: 'var(--text-main)',
                                    maxWidth: '100%'
                                }}
                            >
                                <option value="low">Low Priority</option>
                                <option value="medium">Medium Priority</option>
                                <option value="high">High Priority</option>
                            </select>
                            <select
                                value={newTask.frequency}
                                onChange={e => setNewTask({ ...newTask, frequency: e.target.value })}
                                style={{
                                    padding: '8px',
                                    borderRadius: 'var(--radius-sm)',
                                    border: '1px solid var(--border-light)',
                                    background: 'var(--bg-app)',
                                    color: 'var(--text-main)',
                                    maxWidth: '100%'
                                }}
                            >
                                <option value="once">Once</option>
                                <option value="daily">Everyday</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button type="button" onClick={() => setIsAdding(false)} style={{ background: 'transparent', color: 'var(--text-muted)' }}>Cancel</button>
                            <button type="submit" style={{ background: 'var(--color-primary)', color: 'white', padding: '8px 24px', borderRadius: 'var(--radius-sm)' }}>Save Task</button>
                        </div>
                    </form>
                </motion.div>
            )}


            {/* Recommended Tasks */}
            {isAdding && (
                <div style={{ marginBottom: '24px', overflowX: 'auto', paddingBottom: '10px', width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Recommended for you:</p>
                    <div style={{ display: 'flex', gap: '10px', width: 'max-content' }}>
                        {[
                            "Tidy your room",
                            "Do laundry / fold clothes",
                            "Creative time (Draw, Code, Read)",
                            "Prepare school bag for tomorrow",
                            "Review yesterday's notes",
                            "Complete homework"
                        ].map(rec => (
                            <button
                                key={rec}
                                onClick={() => setNewTask({ ...newTask, title: rec })}
                                style={{
                                    padding: '6px 12px',
                                    borderRadius: '20px',
                                    background: 'var(--bg-card)',
                                    border: '1px solid var(--border-light)',
                                    color: 'var(--text-main)',
                                    fontSize: '0.85rem',
                                    whiteSpace: 'nowrap',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-light)'}
                            >
                                + {rec}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Filters */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                {['all', 'active', 'completed'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        style={{
                            padding: '6px 16px',
                            borderRadius: '20px',
                            border: `1px solid ${filter === f ? 'var(--color-primary)' : 'var(--border-light)'}`,
                            background: filter === f ? 'var(--color-primary)' : 'transparent',
                            color: filter === f ? 'white' : 'var(--text-muted)',
                            textTransform: 'capitalize',
                            fontSize: '0.9rem'
                        }}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <AnimatePresence>
                    {filteredTasks.length === 0 ? (
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px' }}>No tasks found. Take a breather!</p>
                    ) : (
                        filteredTasks.map(task => (
                            <motion.div
                                key={task.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="card"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    padding: '16px',
                                    opacity: task.completed ? 0.6 : 1
                                }}
                            >
                                <button onClick={() => toggleTaskCompletion(task.id)} style={{ background: 'transparent' }}>
                                    {task.completed ? (
                                        <CheckCircle size={24} color="var(--color-primary)" />
                                    ) : (
                                        <Circle size={24} color="var(--border-light)" />
                                    )}
                                </button>

                                <div style={{ flex: 1 }}>
                                    <h3 style={{
                                        fontSize: '1.1rem',
                                        textDecoration: task.completed ? 'line-through' : 'none',
                                        fontWeight: '500',
                                        wordBreak: 'break-word'
                                    }}>
                                        {task.title}
                                    </h3>
                                    <div style={{ display: 'flex', gap: '12px', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <CalendarIcon size={14} />
                                            {task.date ? (
                                                (() => {
                                                    try {
                                                        return format(parseISO(task.date), 'MMM d');
                                                    } catch (e) {
                                                        return task.date;
                                                    }
                                                })()
                                            ) : 'No Date'}
                                            {task.frequency === 'daily' && <span style={{ fontSize: '0.8em', marginLeft: '4px', background: 'var(--bg-app)', padding: '2px 6px', borderRadius: '10px', border: '1px solid var(--border-light)' }}>daily</span>}
                                        </span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Clock size={14} /> {task.time}
                                        </span>
                                        {task.completed && (
                                            <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>
                                                {/* This is a placeholder for Ön-time check visual */}
                                                On-time!
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div style={{
                                    width: '10px',
                                    height: '10px',
                                    borderRadius: '50%',
                                    background: priorityColors[task.priority]
                                }} title={`${task.priority} priority`} />

                                <button
                                    onClick={() => deleteTask(task.id)}
                                    style={{ color: 'var(--text-muted)', opacity: 0.5, background: 'transparent' }}
                                    className="hover:opacity-100" // Requires tailwind or css helper, but inline style opacity handles base
                                >
                                    <Trash2 size={18} />
                                </button>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
