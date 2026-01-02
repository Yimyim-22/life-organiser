import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { motion } from 'framer-motion';
import { ChevronRight, Check } from 'lucide-react';

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
        return (
            <div className="flex-center" style={{ height: '100vh', background: 'var(--bg-app)' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="container"
                    style={{ textAlign: 'center', maxWidth: '600px' }}
                >
                    <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }} className="text-gradient">Life Organizer</h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
                        Plan, organize, track, and reflect on your day-to-day life.
                        Balance productivity with wellness without the pressure.
                    </p>
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                        <button
                            onClick={() => { setIsSignIn(false); setStep(1); }}
                            style={{
                                padding: '12px 32px',
                                fontSize: '1.1rem',
                                background: 'var(--color-primary)',
                                color: 'white',
                                borderRadius: 'var(--radius-lg)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            Get Started <ChevronRight size={20} />
                        </button>
                        <button
                            onClick={() => { setIsSignIn(true); setStep(1); }}
                            style={{
                                padding: '12px 32px',
                                fontSize: '1.1rem',
                                background: 'transparent',
                                color: 'var(--color-primary)',
                                border: '2px solid var(--color-primary)',
                                borderRadius: 'var(--radius-lg)',
                                fontWeight: '600'
                            }}
                        >
                            Sign In
                        </button>
                    </div>
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
