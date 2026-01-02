import React from 'react';
import { useUser } from '../../context/UserContext';
import { useData } from '../../context/DataContext';
import { isSameDay, parseISO } from 'date-fns';
import { CheckCircle, Clock, Wallet, Heart, Target, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useUser();
  const { tasks, habits, finance, goals, assignments } = useData();
  const firstName = user?.name.split(' ')[0];

  const today = new Date();

  // Tasks Logic
  const todaysTasks = tasks.filter(t => isSameDay(parseISO(t.date), today)).sort((a, b) => a.time.localeCompare(b.time));
  const completedToday = todaysTasks.filter(t => t.completed).length;
  const onTimeStreak = tasks.filter(t => t.isOnTime).length;

  // Finance Logic
  const balance = finance.transactions.reduce((acc, curr) =>
    curr.type === 'income' ? acc + parseFloat(curr.amount) : acc - parseFloat(curr.amount), 0
  );

  // Assignments Logic (Student)
  const pendingAssignments = assignments ? assignments.filter(a => new Date(a.dueDate) >= today).length : 0;

  const Widget = ({ title, icon: Icon, color, children, link }) => (
    <Link to={link || '#'} className="card" style={{
      textDecoration: 'none',
      color: 'inherit',
      borderTop: `4px solid ${color}`,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      transition: 'transform 0.2s, box-shadow 0.2s'
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <div style={{ padding: '8px', borderRadius: '50%', background: `${color}20`, color: color }}>
          <Icon size={20} />
        </div>
        <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{title}</h3>
      </div>
      <div style={{ flex: 1 }}>
        {children}
      </div>
    </Link>
  );

  return (
    <div className="container">
      <header style={{ marginBottom: '32px', background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))', padding: '40px', borderRadius: 'var(--radius-md)', color: 'white', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Hello, {firstName}! 👋</h1>
        <p style={{ opacity: 0.9, fontSize: '1.1rem' }}>Ready to organize your life today?</p>
      </header>

      {/* Quick Access Grid */}
      <h3 style={{ marginBottom: '16px', fontSize: '1.2rem' }}>Quick Access</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {[
          { title: 'Tasks', icon: CheckCircle, color: '#6366f1', link: '/tasks' },
          { title: 'Calendar', icon: Clock, color: '#8b5cf6', link: '/calendar' },
          ...(user.occupation === 'Student' ? [{ title: 'Student', icon: GraduationCap, color: '#3b82f6', link: '/student' }] : []),
          { title: 'Goals', icon: Target, color: '#f59e0b', link: '/goals' },
          { title: 'Finance', icon: Wallet, color: '#10b981', link: '/finance' },
          { title: 'Wellness', icon: Heart, color: '#ec4899', link: '/wellness' },
        ].map((item) => (
          <Link
            key={item.title}
            to={item.link}
            className="card"
            style={{
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              textDecoration: 'none',
              color: 'var(--text-main)',
              transition: 'transform 0.2s',
              textAlign: 'center'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ padding: '12px', borderRadius: '50%', background: `${item.color}20`, color: item.color }}>
              <item.icon size={24} />
            </div>
            <span style={{ fontWeight: '500' }}>{item.title}</span>
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>

        {/* Today's Focus */}
        <div className="card" style={{ gridColumn: 'span 1', borderLeft: '4px solid var(--color-primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={20} color="var(--color-primary)" /> Today's Focus
            </h3>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{completedToday}/{todaysTasks.length}</span>
          </div>
          {todaysTasks.length === 0 ? (
            <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--text-muted)' }}>No tasks for today.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {todaysTasks.slice(0, 3).map(task => (
                <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: task.completed ? 0.6 : 1 }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: task.completed ? 'var(--color-primary)' : 'var(--border-light)' }} />
                  <span style={{ textDecoration: task.completed ? 'line-through' : 'none', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{task.title}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{task.time}</span>
                </div>
              ))}
            </div>
          )}
          <div style={{ marginTop: '16px', textAlign: 'right' }}>
            <Link to="/tasks" style={{ fontSize: '0.9rem', color: 'var(--color-primary)', fontWeight: '500' }}>View All &rarr;</Link>
          </div>
        </div>

        {/* Streak Widget */}
        <Widget title='"Ön-time" Streak' icon={Clock} color="#F59E0B">
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <span style={{ fontSize: '3rem', fontWeight: 'bold', color: '#F59E0B' }}>{onTimeStreak}</span>
            <p style={{ color: 'var(--text-muted)' }}>Tasks completed on time</p>
          </div>
        </Widget>

        {/* Finance Widget */}
        <Widget title="Finance Balance" icon={Wallet} color="#10B981" link="/finance">
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: balance >= 0 ? '#10B981' : '#EF4444' }}>
              ₦{balance.toFixed(2)}
            </span>
            <p style={{ color: 'var(--text-muted)' }}>Current Balance</p>
          </div>
        </Widget>

        {/* Goals / Wellness */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Widget title="Active Goals" icon={Target} color="#8B5CF6" link="/goals">
            <p style={{ fontSize: '1.2rem', fontWeight: '500' }}>{goals.length} Goals in progress</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Keep pushing forward!</p>
          </Widget>

          <Widget title="Wellness Check" icon={Heart} color="#EC4899" link="/wellness">
            <p style={{ color: 'var(--text-muted)' }}>Remember to log your mood and gratitude today.</p>
          </Widget>
        </div>

        {user.occupation === 'Student' && (
          <Widget title="Assignments" icon={GraduationCap} color="#3B82F6" link="/student/assignments">
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#3B82F6' }}>{pendingAssignments}</span>
              <p style={{ color: 'var(--text-muted)' }}>Upcoming Assignments</p>
            </div>
          </Widget>
        )}

      </div>
    </div>
  );
}
