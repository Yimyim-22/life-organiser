import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CalendarView() {
    const { tasks, assignments, exams } = useData();
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const days = eachDayOfInterval({
        start: startOfWeek(startOfMonth(currentMonth)),
        end: endOfWeek(endOfMonth(currentMonth))
    });

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 className="text-gradient">Calendar</h1>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <button onClick={prevMonth} style={{ background: 'transparent', padding: '8px' }}><ChevronLeft size={24} /></button>
                    <span style={{ fontSize: '1.2rem', fontWeight: '600' }}>{format(currentMonth, 'MMMM yyyy')}</span>
                    <button onClick={nextMonth} style={{ background: 'transparent', padding: '8px' }}><ChevronRight size={24} /></button>
                </div>
            </div>

            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', background: 'var(--bg-app)', borderBottom: '1px solid var(--border-light)' }}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: 'var(--text-muted)' }}>{day}</div>
                    ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
                    {days.map((day, idx) => {
                        const dayTasks = tasks.filter(t => isSameDay(new Date(t.date), day));

                        // Filter Assignments (by due date)
                        const dayAssignments = assignments ? assignments.filter(a => a.due && isSameDay(new Date(a.due), day)) : [];

                        // Filter Exams
                        const dayExams = exams ? exams.filter(e => e.date && isSameDay(new Date(e.date), day)) : [];

                        const isCurrentMonth = isSameMonth(day, currentMonth);
                        const isToday = isSameDay(day, new Date());

                        return (
                            <div
                                key={day.toISOString()}
                                style={{
                                    minHeight: '100px',
                                    padding: '8px',
                                    borderRight: (idx + 1) % 7 === 0 ? 'none' : '1px solid var(--border-light)',
                                    borderBottom: '1px solid var(--border-light)',
                                    background: isCurrentMonth ? 'var(--bg-card)' : 'rgba(0,0,0,0.02)',
                                    opacity: isCurrentMonth ? 1 : 0.6
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
                                    {/* Tasks */}
                                    {dayTasks.map(t => (
                                        <div key={t.id} style={{
                                            fontSize: '0.75rem',
                                            padding: '2px 6px',
                                            borderRadius: '4px',
                                            background: t.priority === 'high' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                                            color: t.priority === 'high' ? '#ef4444' : 'var(--color-primary)',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            textDecoration: t.completed ? 'line-through' : 'none'
                                        }}>
                                            {t.time} {t.title}
                                        </div>
                                    ))}

                                    {/* Assignments */}
                                    {dayAssignments.map(a => (
                                        <div key={a.id} style={{
                                            fontSize: '0.75rem',
                                            padding: '2px 6px',
                                            borderRadius: '4px',
                                            background: 'rgba(59, 130, 246, 0.1)',
                                            color: '#3b82f6',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}>
                                            📝 {a.title}
                                        </div>
                                    ))}

                                    {/* Exams */}
                                    {dayExams.map(e => (
                                        <div key={e.id} style={{
                                            fontSize: '0.75rem',
                                            padding: '2px 6px',
                                            borderRadius: '4px',
                                            background: 'rgba(236, 72, 153, 0.1)',
                                            color: '#ec4899',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            fontWeight: 'bold'
                                        }}>
                                            🎓 {e.subject} Exam
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
