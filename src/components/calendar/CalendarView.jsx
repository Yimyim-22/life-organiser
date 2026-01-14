import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
        <div className="container" style={{ position: 'relative', overflow: 'hidden' }}> {/* Ensure relative positioning for absolute panel */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 className="text-gradient">Calendar</h1>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <button onClick={prevMonth} style={{ background: 'transparent', padding: '8px' }}><ChevronLeft size={24} /></button>
                    <span style={{ fontSize: '1.2rem', fontWeight: '600' }}>{format(currentMonth, 'MMMM yyyy')}</span>
                    <button onClick={nextMonth} style={{ background: 'transparent', padding: '8px' }}><ChevronRight size={24} /></button>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '24px', alignItems: 'start' }}>
                <div className="card" style={{ padding: '0', overflow: 'hidden', flex: 1 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', background: 'var(--bg-app)', borderBottom: '1px solid var(--border-light)' }}>
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: 'var(--text-muted)' }}>{day}</div>
                        ))}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
                        {days.map((day, idx) => {
                            const dayTasks = tasks.filter(t => isSameDay(new Date(t.date), day));
                            const dayAssignments = assignments ? assignments.filter(a => a.due && isSameDay(new Date(a.due), day)) : [];
                            const dayExams = exams ? exams.filter(e => e.date && isSameDay(new Date(e.date), day)) : [];

                            const isCurrentMonth = isSameMonth(day, currentMonth);
                            const isToday = isSameDay(day, new Date());
                            const isSelected = selectedDate && isSameDay(day, selectedDate);

                            return (
                                <div
                                    key={day.toISOString()}
                                    onClick={() => setSelectedDate(day)}
                                    style={{
                                        minHeight: '100px',
                                        padding: '8px',
                                        borderRight: (idx + 1) % 7 === 0 ? 'none' : '1px solid var(--border-light)',
                                        borderBottom: '1px solid var(--border-light)',
                                        background: isSelected ? 'rgba(99, 102, 241, 0.05)' : (isCurrentMonth ? 'var(--bg-card)' : 'rgba(0,0,0,0.02)'),
                                        opacity: isCurrentMonth ? 1 : 0.6,
                                        cursor: 'pointer',
                                        transition: 'background 0.2s',
                                        boxShadow: isSelected ? 'inset 0 0 0 2px var(--color-primary)' : 'none'
                                    }}
                                >
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        marginBottom: '4px'
                                    }}>
                                        <span style={{
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            background: isToday ? 'var(--color-primary)' : 'transparent',
                                            color: isToday ? 'white' : 'inherit',
                                            fontWeight: isToday ? 'bold' : 'normal',
                                            fontSize: '0.9rem'
                                        }}>
                                            {format(day, 'd')}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        {/* Summarized Dots for cleaner view on small cells, or list if space permits. Keeping list for now but simplified. */}
                                        {dayTasks.slice(0, 3).map(t => (
                                            <div key={t.id} style={{
                                                width: '6px',
                                                height: '6px',
                                                borderRadius: '50%',
                                                background: t.priority === 'high' ? '#ef4444' : 'var(--color-primary)',
                                                display: 'inline-block',
                                                marginRight: '2px'
                                            }} title={t.title} />
                                        ))}
                                        {dayTasks.length > 3 && <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>+</span>}

                                        {/* Text labels for desktop users mostly, or if just a few items */}
                                        {dayTasks.length <= 2 && dayTasks.map(t => (
                                            <div key={t.id} style={{
                                                fontSize: '0.7rem',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                color: 'var(--text-muted)'
                                            }}>
                                                {t.title}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Side Panel for Selected Date Tasks */}
                {selectedDate && (
                    <div className="card" style={{
                        width: '300px',
                        flexShrink: 0,
                        borderLeft: '4px solid var(--color-primary)',
                        height: 'fit-content',
                        animation: 'slideIn 0.3s ease'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ margin: 0 }}>{format(selectedDate, 'MMMM d, yyyy')}</h3>
                            <button onClick={() => setSelectedDate(null)} style={{ background: 'transparent', color: 'var(--text-muted)', fontSize: '1.2rem' }}>&times;</button>
                        </div>

                        {selectedDateTasks.length === 0 && selectedDateAssignments.length === 0 && selectedDateExams.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>No tasks for this day.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {selectedDateExams.map(e => (
                                    <div key={e.id} style={{ padding: '8px', background: 'rgba(236, 72, 153, 0.1)', borderRadius: '6px', color: '#ec4899', fontSize: '0.9rem' }}>
                                        <strong>🎓 Exam:</strong> {e.subject}
                                    </div>
                                ))}
                                {selectedDateAssignments.map(a => (
                                    <div key={a.id} style={{ padding: '8px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '6px', color: '#3b82f6', fontSize: '0.9rem' }}>
                                        <strong>📝 Assignment:</strong> {a.title}
                                    </div>
                                ))}
                                {selectedDateTasks.map(t => (
                                    <div key={t.id} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        opacity: t.completed ? 0.6 : 1
                                    }}>
                                        <div style={{
                                            color: t.completed ? 'var(--color-primary)' : 'var(--border-light)',
                                            fontSize: '1.2rem'
                                        }}>
                                            {t.completed ? '✓' : '○'}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{
                                                textDecoration: t.completed ? 'line-through' : 'none',
                                                fontWeight: '500',
                                                color: 'var(--text-main)'
                                            }}>
                                                {t.title}
                                            </div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                {t.time} • {t.priority}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(20px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
