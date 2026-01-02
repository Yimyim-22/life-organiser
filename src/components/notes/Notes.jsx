import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, X, Search } from 'lucide-react';

export default function Notes() {
    const { notes, setNotes } = useData();
    const [isAdding, setIsAdding] = useState(false);
    const [newNote, setNewNote] = useState({ title: '', content: '' });
    const [searchTerm, setSearchTerm] = useState('');

    const generalNotes = notes.filter(n => n.type !== 'journal'); // Exclude wellness journals

    const handleAdd = (e) => {
        e.preventDefault();
        if (!newNote.title && !newNote.content) return;
        setNotes([{ id: Date.now(), ...newNote, date: new Date().toISOString(), type: 'general' }, ...notes]);
        setNewNote({ title: '', content: '' });
        setIsAdding(false);
    };

    const deleteNote = (id) => {
        setNotes(notes.filter(n => n.id !== id));
    };

    const filteredNotes = generalNotes.filter(n =>
        n.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.content?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 className="text-gradient">Notes & Ideas</h1>
                <button onClick={() => setIsAdding(true)} className="btn-primary" style={{ background: 'var(--color-primary)', color: 'white', padding: '10px 20px', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Plus size={20} /> New Note
                </button>
            </div>

            <div style={{ marginBottom: '24px', position: 'relative' }}>
                <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                    placeholder="Search notes..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', fontSize: '1rem' }}
                />
            </div>

            {isAdding && (
                <div className="card" style={{ marginBottom: '24px' }}>
                    <form onSubmit={handleAdd}>
                        <input
                            placeholder="Title"
                            value={newNote.title}
                            onChange={e => setNewNote({ ...newNote, title: e.target.value })}
                            style={{ width: '100%', padding: '10px', marginBottom: '10px', fontSize: '1.2rem', fontWeight: 'bold', border: 'none', borderBottom: '1px solid var(--border-light)', outline: 'none', background: 'transparent' }}
                        />
                        <textarea
                            placeholder="Type your note here..."
                            value={newNote.content}
                            onChange={e => setNewNote({ ...newNote, content: e.target.value })}
                            style={{ width: '100%', minHeight: '150px', padding: '10px', border: 'none', resize: 'vertical', fontSize: '1rem', background: 'transparent', outline: 'none' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                            <button type="button" onClick={() => setIsAdding(false)} style={{ padding: '8px 16px', background: 'transparent', color: 'var(--text-muted)' }}>Cancel</button>
                            <button type="submit" style={{ padding: '8px 24px', background: 'var(--color-primary)', color: 'white', borderRadius: 'var(--radius-sm)' }}>Save</button>
                        </div>
                    </form>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                {filteredNotes.map(note => (
                    <div key={note.id} className="card" style={{ position: 'relative' }}>
                        <button onClick={() => deleteNote(note.id)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={18} /></button>
                        <h3 style={{ marginBottom: '8px', paddingRight: '20px' }}>{note.title || 'Untitled'}</h3>
                        <p style={{ whiteSpace: 'pre-wrap', color: 'var(--text-muted)', fontSize: '0.95rem', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', display: '-webkit-box', overflow: 'hidden' }}>{note.content}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--border-light)', marginTop: '12px' }} className="text-muted-foreground">{new Date(note.date).toLocaleDateString()}</p>
                    </div>
                ))}
                {filteredNotes.length === 0 && !isAdding && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>
                        No notes found.
                    </div>
                )}
            </div>
        </div>
    );
}
