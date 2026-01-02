import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Smile, Meh, Frown, BookOpen } from 'lucide-react';

export default function WellnessTracker() {
    const { notes, setNotes } = useData(); // Using notes for journal for simplicity
    const [entry, setEntry] = useState('');
    const [recommendation, setRecommendation] = useState('');

    const handleMood = (label) => {
        if (label === 'Great') {
            setRecommendation("That's wonderful! Keep up the momentum and maybe share your positive energy with someone today. 🌟");
        } else if (label === 'Okay') {
            setRecommendation("Just okay? That's fine. Maybe take a short walk, drink some water, or listen to your favorite song to boost your mood. 🎵");
        } else if (label === 'Down') {
            setRecommendation("It's okay not to be okay. Be kind to yourself. Consider talking to a friend, doing a breathing exercise, or writing down your thoughts below. 💙");
        }
    };

    const handleAdd = (e) => {
        e.preventDefault();
        if (!entry) return;
        setNotes([{ id: Date.now(), text: entry, date: new Date().toISOString(), type: 'journal' }, ...notes]);
        setEntry('');
    };

    return (
        <div className="container">
            <h1 className="text-gradient" style={{ marginBottom: '24px' }}>Wellness & Reflection</h1>

            <div className="card" style={{ marginBottom: '24px' }}>
                <h3 style={{ marginBottom: '15px' }}>How are you feeling today?</h3>
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', padding: '20px' }}>
                    {[
                        { icon: Smile, color: '#10b981', label: 'Great' },
                        { icon: Meh, color: '#f59e0b', label: 'Okay' },
                        { icon: Frown, color: '#ef4444', label: 'Down' }
                    ].map((m) => (
                        <button
                            key={m.label}
                            onClick={() => handleMood(m.label)}
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', background: 'transparent', border: 'none', cursor: 'pointer', transition: 'transform 0.1s' }}
                            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
                            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <m.icon size={40} color={m.color} />
                            <span style={{ fontSize: '0.9rem' }}>{m.label}</span>
                        </button>
                    ))}
                </div>
                {recommendation && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ textAlign: 'center', marginTop: '16px', padding: '12px', background: 'var(--bg-app)', borderRadius: 'var(--radius-sm)', color: 'var(--color-primary)', fontStyle: 'italic' }}
                    >
                        {recommendation}
                    </motion.div>
                )}
            </div>

            <div className="card">
                <h3 style={{ marginBottom: '15px' }}>Gratitude Journal</h3>
                <form onSubmit={handleAdd} style={{ marginBottom: '20px' }}>
                    <textarea
                        value={entry}
                        onChange={e => setEntry(e.target.value)}
                        placeholder="What are you grateful for today?"
                        style={{ width: '100%', minHeight: '100px', padding: '15px', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', marginBottom: '10px', resize: 'vertical', fontFamily: 'inherit' }}
                    />
                    <button type="submit" style={{ padding: '10px 20px', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)' }}>Save Entry</button>
                </form>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {notes.filter(n => n.type === 'journal').map(n => (
                        <div key={n.id} style={{ padding: '15px', background: 'var(--bg-app)', borderRadius: 'var(--radius-sm)' }}>
                            <p style={{ whiteSpace: 'pre-wrap' }}>{n.text}</p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '5px' }}>{new Date(n.date).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
