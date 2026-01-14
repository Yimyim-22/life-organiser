import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { motion } from 'framer-motion';
import { ChevronRight, Check, CheckCircle, Calendar, Target, Heart, Wallet, ShoppingCart } from 'lucide-react';

export default function OnboardingFlow() {
    const { register, login } = useUser();
    const [step, setStep] = useState(0); // 0: Welcome, 1: Form
    const [isSignIn, setIsSignIn] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        occupation: 'Student'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (isSignIn) {
            const success = login(formData.email, formData.password);
            if (!success) {
                setError('Invalid email or password.');
            }
        } else {
            if (formData.name && formData.email && formData.password) {
                const success = register(formData);
                if (!success) {
                    // Could handle "account exists" error here if we returned it, but alert is in context for now.
                }
            }
        }
    };

    if (step === 0) {
        const features = [
            { icon: CheckCircle, title: 'Smart Tasks', desc: 'Manage daily to-dos with priority & recurring options.', color: '#6366f1' },
            { icon: Calendar, title: 'Calendar', desc: 'Visualize your schedule with an integrated monthly view.', color: '#8b5cf6' },
            { icon: Target, title: 'Goal Tracking', desc: 'Set ambitions and track your progress over time.', color: '#f59e0b' },
            { icon: Heart, title: 'Wellness', desc: 'Log your mood and gratitude to stay grounded.', color: '#ec4899' },
            { icon: Wallet, title: 'Finance', desc: 'Track bespoke budgets and monitor your spending.', color: '#10b981' },
            { icon: ShoppingCart, title: 'Shopping', desc: 'Smart lists with budget warnings and favorites.', color: '#3b82f6' },
        ];

        const containerVariants = {
            hidden: { opacity: 0 },
            show: {
                opacity: 1,
                transition: {
                    staggerChildren: 0.1
                }
            }
        };

        const itemVariants = {
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 50 } }
        };

        return (
            <div style={{ minHeight: '100vh', background: 'var(--bg-app)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="container"
                    style={{ textAlign: 'center', maxWidth: '800px', marginBottom: '60px' }}
                >
                    <h1 style={{ fontSize: '3.5rem', marginBottom: '1.2rem', lineHeight: 1.1 }} className="text-gradient">Life Organizer</h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem auto' }}>
                        Plan, organize, track, and reflect on your day-to-day life.
                        Balance productivity with wellness without the pressure.
                    </p>
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => { setIsSignIn(false); setStep(1); }}
                            style={{
                                padding: '14px 36px',
                                fontSize: '1.1rem',
                                background: 'var(--color-primary)',
                                color: 'white',
                                borderRadius: 'var(--radius-lg)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                whiteSpace: 'nowrap',
                                border: 'none',
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                                transition: 'transform 0.2s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            Get Started <ChevronRight size={20} />
                        </button>
                        <button
                            onClick={() => { setIsSignIn(true); setStep(1); }}
                            style={{
                                padding: '14px 36px',
                                fontSize: '1.1rem',
                                background: 'transparent',
                                color: 'var(--color-primary)',
                                border: '2px solid var(--color-primary)',
                                borderRadius: 'var(--radius-lg)',
                                fontWeight: '600',
                                whiteSpace: 'nowrap',
                                cursor: 'pointer',
                                transition: 'background 0.2s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.05)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                            Sign In
                        </button>
                    </div>
                </motion.div>

                {/* Animated Feature Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '24px',
                        width: '100%',
                        maxWidth: '1200px',
                        padding: '0 10px'
                    }}
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            whileHover={{ y: -8, boxShadow: '0 12px 24px rgba(0,0,0,0.08)' }}
                            style={{
                                background: 'white',
                                padding: '24px',
                                borderRadius: '16px',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.03)',
                                border: '1px solid rgba(0,0,0,0.03)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                gap: '12px',
                                cursor: 'pointer',
                                transition: 'box-shadow 0.3s'
                            }}
                            onClick={() => { setIsSignIn(false); setStep(1); }} // Clicking card also leads to sign up
                        >
                            <div style={{
                                padding: '12px',
                                borderRadius: '12px',
                                background: `${feature.color}15`,
                                color: feature.color,
                                marginBottom: '4px'
                            }}>
                                <feature.icon size={28} />
                            </div>
                            <h3 style={{ fontSize: '1.2rem', margin: 0, color: '#1e293b' }}>{feature.title}</h3>
                            <p style={{ margin: 0, color: '#64748b', lineHeight: 1.5 }}>
                                {feature.desc}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        );
    }

    return (
        <div className="flex-center" style={{ minHeight: '100vh', background: 'var(--bg-app)', padding: '20px' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card"
                style={{ width: '100%', maxWidth: '450px' }}
            >
                <h2 style={{ marginBottom: '1.5rem' }}>{isSignIn ? 'Welcome Back' : 'Tell us about yourself'}</h2>
                {error && <p style={{ color: '#ef4444', marginBottom: '16px', background: 'rgba(239, 68, 68, 0.1)', padding: '8px', borderRadius: '4px' }}>{error}</p>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {!isSignIn && (
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Full Name</label>
                            <input
                                type="text"
                                required={!isSignIn}
                                placeholder="Jane Doe"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: 'var(--radius-sm)',
                                    border: '1px solid var(--border-light)',
                                    background: 'var(--bg-app)',
                                    color: 'var(--text-main)',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>
                    )}

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Email</label>
                        <input
                            type="email"
                            required
                            placeholder="jane@example.com"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--border-light)',
                                background: 'var(--bg-app)',
                                color: 'var(--text-main)',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Password</label>
                        <input
                            type="password"
                            required
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--border-light)',
                                background: 'var(--bg-app)',
                                color: 'var(--text-main)',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    {!isSignIn && (
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Occupation</label>
                            <select
                                value={formData.occupation}
                                onChange={e => setFormData({ ...formData, occupation: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: 'var(--radius-sm)',
                                    border: '1px solid var(--border-light)',
                                    background: 'var(--bg-app)',
                                    color: 'var(--text-main)',
                                    fontSize: '1rem'
                                }}
                            >
                                <option value="Student">Student</option>
                                <option value="Office Worker">Office Worker</option>
                                <option value="Freelancer">Freelancer</option>
                                <option value="Homemaker">Homemaker</option>
                                <option value="None">None / Other</option>
                            </select>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                We'll customize your experience based on this.
                            </p>
                        </div>
                    )}

                    <button
                        type="submit"
                        style={{
                            padding: '12px',
                            marginTop: '10px',
                            background: 'var(--color-primary)',
                            color: 'white',
                            borderRadius: 'var(--radius-sm)',
                            fontWeight: '600',
                            fontSize: '1rem'
                        }}
                    >
                        {isSignIn ? 'Sign In' : 'Start Organizing'}
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '16px' }}>
                        <button
                            type="button"
                            onClick={() => { setIsSignIn(!isSignIn); setError(''); }}
                            style={{ background: 'transparent', color: 'var(--color-primary)', fontWeight: '500', textDecoration: 'underline' }}
                        >
                            {isSignIn ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
