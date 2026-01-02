import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Book, Calendar, GraduationCap, Clock, MapPin, Trash2 } from 'lucide-react';

export default function StudentSection() {
    const { classes, setClasses, assignments, setAssignments, exams, setExams } = useData();
    const [activeTab, setActiveTab] = useState('classes'); // classes, assignments, exams
    const [isAdding, setIsAdding] = useState(false);

    // Generic form state - would be better split but keeping simple for now
    const [newItem, setNewItem] = useState({});

    const tabs = [
        { id: 'classes', label: 'Classes', icon: Book },
        { id: 'assignments', label: 'Assignments', icon: Calendar },
        { id: 'exams', label: 'Exams', icon: GraduationCap },
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

    const renderForm = () => {
        return (
            <form onSubmit={handleAddItem} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input
                    placeholder="Subject / specific name"
                    required
                    value={newItem.subject || ''}
                    onChange={e => setNewItem({ ...newItem, subject: e.target.value })}
                    className="input-field"
                    style={{ padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}
                />

                {activeTab === 'classes' && (
                    <>
                        <input placeholder="Location / Link" value={newItem.location || ''} onChange={e => setNewItem({ ...newItem, location: e.target.value })} style={{ padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }} />
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input type="text" placeholder="Days (e.g. Mon, Wed)" value={newItem.days || ''} onChange={e => setNewItem({ ...newItem, days: e.target.value })} style={{ flex: 1, padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }} />
                            <input type="time" value={newItem.time || ''} onChange={e => setNewItem({ ...newItem, time: e.target.value })} style={{ padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }} />
                        </div>
                    </>
                )}

                {activeTab === 'assignments' && (
                    <>
                        <input placeholder="Title / Details" value={newItem.title || ''} onChange={e => setNewItem({ ...newItem, title: e.target.value })} style={{ padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }} />
                        <input type="datetime-local" required value={newItem.due || ''} onChange={e => setNewItem({ ...newItem, due: e.target.value })} style={{ padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }} />
                    </>
                )}

                {activeTab === 'exams' && (
                    <>
                        <input type="datetime-local" required value={newItem.date || ''} onChange={e => setNewItem({ ...newItem, date: e.target.value })} style={{ padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }} />
                        <input placeholder="Syllabus / Notes" value={newItem.notes || ''} onChange={e => setNewItem({ ...newItem, notes: e.target.value })} style={{ padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }} />
                    </>
                )}

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button type="button" onClick={() => setIsAdding(false)} style={{ flex: 1, padding: '10px', background: 'transparent', color: 'var(--text-muted)' }}>Cancel</button>
                    <button type="submit" style={{ flex: 1, padding: '10px', background: 'var(--color-primary)', color: 'white', borderRadius: 'var(--radius-sm)' }}>Add</button>
                </div>
            </form>
        );
    };

    const renderList = () => {
        const list = activeTab === 'classes' ? classes : activeTab === 'assignments' ? assignments : exams;

        if (list.length === 0) return <p style={{ color: 'var(--text-muted)', textAlign: 'center', margin: '40px 0' }}>No {activeTab} added yet.</p>;

        return (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                {list.map(item => (
                    <motion.div
                        layout
                        key={item.id}
                        className="card"
                        style={{ position: 'relative' }}
                    >
                        <h3 style={{ fontSize: '1.1rem' }}>{item.subject}</h3>

                        {activeTab === 'classes' && (
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} /> {item.days} @ {item.time}</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} /> {item.location}</span>
                            </div>
                        )}

                        {activeTab === 'assignments' && (
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px' }}>
                                <p style={{ fontWeight: '500', color: 'var(--text-main)' }}>{item.title}</p>
                                <p>Due: {new Date(item.due).toLocaleString()}</p>
                            </div>
                        )}

                        {activeTab === 'exams' && (
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px' }}>
                                <p>Date: {new Date(item.date).toLocaleString()}</p>
                                <p style={{ fontStyle: 'italic' }}>{item.notes}</p>
                            </div>
                        )}

                        <button
                            onClick={() => deleteItem(item.id, activeTab)}
                            style={{ position: 'absolute', top: '16px', right: '16px', color: 'var(--text-muted)', background: 'transparent' }}
                        >
                            <Trash2 size={16} />
                        </button>
                    </motion.div>
                ))}
            </div>
        );
    };

    return (
        <div className="container">
            <header style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 className="text-gradient">Student Tracker</h1>
                <button
                    onClick={() => setIsAdding(true)}
                    style={{
                        background: 'var(--color-primary)',
                        color: 'white',
                        padding: '10px 20px',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontWeight: '600'
                    }}
                >
                    <Plus size={20} /> Add {tabs.find(t => t.id === activeTab).label.slice(0, -1)}
                </button>
            </header>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', borderBottom: '1px solid var(--border-light)', paddingBottom: '1px' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 20px',
                            background: 'transparent',
                            borderBottom: activeTab === tab.id ? '2px solid var(--color-primary)' : '2px solid transparent',
                            color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--text-muted)',
                            fontWeight: activeTab === tab.id ? '600' : '500',
                            marginBottom: '-1px'
                        }}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {isAdding ? (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="card"
                        style={{ maxWidth: '500px', margin: '0 auto' }}
                    >
                        <h3 style={{ marginBottom: '16px' }}>Add {activeTab.slice(0, -1)}</h3>
                        {renderForm()}
                    </motion.div>
                ) : (
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {renderList()}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
