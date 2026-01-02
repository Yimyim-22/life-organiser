import React from 'react';
import { useUser } from '../../context/UserContext';
import { useData } from '../../context/DataContext';
import { isSameDay, parseISO } from 'date-fns';
import { CheckCircle, Clock } from 'lucide-react';

export default function Dashboard() {
  const { user } = useUser();
  const { tasks, habits } = useData();
  const firstName = user?.name.split(' ')[0];

  const today = new Date();
  const todaysTasks = tasks.filter(t => isSameDay(parseISO(t.date), today)).sort((a, b) => a.time.localeCompare(b.time));
  const completedToday = todaysTasks.filter(t => t.completed).length;

  // Simple streak logic: Tasks completed 'on time'.
  const onTimeStreak = tasks.filter(t => t.isOnTime).length;

  return (
    <div className="container">
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem' }}>Hello, {firstName} 👋</h1>
        <p style={{ color: 'var(--text-muted)' }}>Here's what's happening today.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3>Today's Focus</h3>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{completedToday}/{todaysTasks.length} Completed</span>
          </div>

          {todaysTasks.length === 0 ? (
            <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
              No tasks scheduled for today.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {todaysTasks.slice(0, 3).map(task => (
                <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', background: 'var(--bg-app)', borderRadius: '8px', opacity: task.completed ? 0.6 : 1 }}>
                  {task.completed ? <CheckCircle size={18} color="var(--color-primary)" /> : <Clock size={18} color="var(--text-muted)" />}
                  <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>{task.title}</span>
                </div>
              ))}
              {todaysTasks.length > 3 && <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>+ {todaysTasks.length - 3} more</p>}
            </div>
          )}
        </div>

        <div className="card">
          <h3>Streak</h3>
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <span style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>{onTimeStreak}</span>
            <p className="text-gradient" style={{ fontWeight: '500' }}>Tasks Completed Ön-time 🎉</p>
          </div>
        </div>
      </div>
    </div>
  );
}
