import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, CheckCircle, Plus, Flame } from 'lucide-react';

export default function GoalsTracker() {
    const { goals, setGoals, habits, setHabits } = useData();
    const [activeTab, setActiveTab] = useState('habits'); // habits, goals
    const [isAdding, setIsAdding] = useState(false);
    const [newItem, setNewItem] = useState({ title: '', target: '' });

    const handleAdd = (e) => {
        e.preventDefault();
        if (activeTab === 'habits') {
            setHabits([...habits, { id: Date.now().toString(), title: newItem.title, streak: 0, completedToday: false }]);
        } else {
            setGoals([...goals, { id: Date.now().toString(), title: newItem.title, target: newItem.target, progress: 0 }]);
        }
        setNewItem({ title: '', target: '' });
        setIsAdding(false);
    };

    const toggleHabit = (id) => {
        setHabits(habits.map(h => {
            if (h.id === id) {
                const completed = !h.completedToday;
                return {
                    ...h,
                    completedToday: completed,
                    streak: completed ? h.streak + 1 : h.streak > 0 ? h.streak - 1 : 0
                };
            }
            return h;
        }));
    };

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 className="text-gradient">Goals & Habits</h1>
                <button onClick={() => setIsAdding(true)} className="btn-primary" style={{ background: 'var(--color-primary)', color: 'white', padding: '10px 20px', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer' }}>
                    <Plus size={20} style={{ verticalAlign: 'middle', marginRight: '5px' }} /> Add {activeTab === 'habits' ? 'Habit' : 'Goal'}
                </button>
            </div>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '24px', borderBottom: '1px solid var(--border-light)' }}>
                {['habits', 'goals'].map(t => (
                    <button
                        key={t}
                        onClick={() => setActiveTab(t)}
                        style={{
                            padding: '10px 20px',
                            background: 'transparent',
                            border: 'none',
                            borderBottom: activeTab === t ? '2px solid var(--color-primary)' : '2px solid transparent',
                            color: activeTab === t ? 'var(--color-primary)' : 'var(--text-muted)',
                            fontWeight: activeTab === t ? '600' : 'normal',
                            cursor: 'pointer',
                            textTransform: 'capitalize'
                        }}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {isAdding && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="card" style={{ marginBottom: '20px' }}>
                    <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <input placeholder="Title" value={newItem.title} onChange={e => setNewItem({ ...newItem, title: e.target.value })} style={{ padding: '10px', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)' }} required />
                        {activeTab === 'goals' && (
                            <input placeholder="Target description (e.g. Save $500)" value={newItem.target} onChange={e => setNewItem({ ...newItem, target: e.target.value })} style={{ padding: '10px', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)' }} />
                        )}
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button type="button" onClick={() => setIsAdding(false)} style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid var(--border-light)' }}>Cancel</button>
                            <button type="submit" style={{ flex: 1, padding: '10px', background: 'var(--color-primary)', color: 'white', border: 'none' }}>Save</button>
                        </div>
                    </form>
                </motion.div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                {activeTab === 'habits' ? habits.map(h => (
                    <motion.div layout key={h.id} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <button onClick={() => toggleHabit(h.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                                {h.completedToday ? <CheckCircle size={28} color="var(--color-primary)" /> : <div style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid var(--border-light)' }} />}
                            </button>
                            <div>
                                <h3 style={{ fontSize: '1.1rem' }}>{h.title}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                    <Flame size={14} color="#f59e0b" /> {h.streak} day streak
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )) : goals.map(g => (
                    <div key={g.id} className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <h3 style={{ fontSize: '1.1rem' }}>{g.title}</h3>
                            <Target size={20} color="var(--color-primary)" />
                        </div>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '15px' }}>{g.target}</p>
                        <div style={{ width: '100%', height: '8px', background: 'var(--border-light)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${g.progress}%`, height: '100%', background: 'var(--color-primary)' }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
