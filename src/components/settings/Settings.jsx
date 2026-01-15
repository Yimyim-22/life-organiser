import React, { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import { Moon, Sun, Monitor, Type, Zap, Layout, Palette, RotateCcw, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Settings() {
    const { user, updateUser, settings, updateSettings, logout } = useUser();

    // Local state for color pickers to avoid laggy inputs
    const [colors, setColors] = useState(settings.customColors || {
        accent: '#6366f1',
        text: '#000000',
        background: '#ffffff',
        card: '#ffffff'
    });

    // Local state for profile form
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        password: user?.password || '',
        occupation: user?.occupation || 'Student'
    });

    useEffect(() => {
        if (settings.customColors) {
            setColors(prev => ({ ...prev, ...settings.customColors }));
        }
    }, [settings.customColors]);

    // Sync profile data when user changes (e.g. external update or context load)
    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                email: user.email || '',
                password: user.password || '',
                occupation: user.occupation || 'Student'
            });
        }
    }, [user]);

    const handleColorChange = (key, value) => {
        const newColors = { ...colors, [key]: value };
        setColors(newColors);
        updateSettings({
            customColors: newColors,
            accentColor: key === 'accent' ? value : settings.accentColor
        });
    };

    const resetColors = () => {
        const defaultColors = {
            accent: '#6366f1',
            text: '',
            background: '',
            card: ''
        };
        updateSettings({ customColors: defaultColors, accentColor: '#6366f1' });
        setColors(defaultColors);
    };

    const handleThemeChange = (theme) => {
        updateSettings({ theme });
    };

    const handleProfileSave = (e) => {
        e.preventDefault();
        updateUser(profileData);
        alert('Profile updated successfully!');
    };

    const Section = ({ title, icon: Icon, children }) => (
        <div className="card" style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
                <Icon size={20} color="var(--color-primary)" />
                <h3 style={{ fontSize: '1.2rem' }}>{title}</h3>
            </div>
            {children}
        </div>
    );

    return (
        <div className="container" style={{ maxWidth: '800px' }}>
            <h1 className="text-gradient" style={{ marginBottom: '32px' }}>Settings</h1>

            <Section title="Profile Information" icon={User}>
                <form onSubmit={handleProfileSave} style={{ display: 'grid', gap: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Full Name</label>
                            <input
                                type="text"
                                required
                                value={profileData.name}
                                onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--bg-app)', color: 'var(--text-main)' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Occupation</label>
                            <select
                                value={profileData.occupation}
                                onChange={e => setProfileData({ ...profileData, occupation: e.target.value })}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--bg-app)', color: 'var(--text-main)' }}
                            >
                                <option value="Student">Student</option>
                                <option value="Office Worker">Office Worker</option>
                                <option value="Freelancer">Freelancer</option>
                                <option value="Homemaker">Homemaker</option>
                                <option value="None">None / Other</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Email Address</label>
                        <input
                            type="email"
                            required
                            value={profileData.email}
                            onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--bg-app)', color: 'var(--text-main)' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Password</label>
                        <input
                            type="password"
                            required
                            value={profileData.password}
                            onChange={e => setProfileData({ ...profileData, password: e.target.value })}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--bg-app)', color: 'var(--text-main)' }}
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            justifySelf: 'start',
                            padding: '10px 24px',
                            background: 'var(--color-primary)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            marginTop: '8px'
                        }}
                    >
                        Save Profile
                    </button>
                </form>
            </Section>

            <Section title="Color Customization" icon={Palette}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                    {[
                        { key: 'accent', label: 'Accent Color' },
                        { key: 'text', label: 'Text Color' },
                        { key: 'background', label: 'Background' },
                        { key: 'card', label: 'Table / Card' }
                    ].map(({ key, label }) => (
                        <div key={key}>
                            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px', color: 'var(--text-muted)' }}>{label}</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input
                                    type="color"
                                    value={colors[key] || '#000000'}
                                    onChange={(e) => handleColorChange(key, e.target.value)}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        padding: '0',
                                        border: 'none',
                                        borderRadius: '50%',
                                        overflow: 'hidden',
                                        cursor: 'pointer'
                                    }}
                                />
                                <span style={{ fontSize: '0.85rem', fontFamily: 'monospace' }}>{colors[key] || 'Default'}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <button
                    onClick={resetColors}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        background: 'transparent',
                        border: '1px solid var(--border-light)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--text-muted)',
                        fontSize: '0.9rem'
                    }}
                >
                    <RotateCcw size={14} /> Reset Colors
                </button>
            </Section>

            <Section title="Appearance" icon={Monitor}>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    {['light', 'dark'].map((t) => (
                        <button
                            key={t}
                            onClick={() => handleThemeChange(t)}
                            style={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '24px',
                                borderRadius: 'var(--radius-md)',
                                border: `2px solid ${settings.theme === t ? 'var(--color-primary)' : 'var(--border-light)'}`,
                                background: settings.theme === t ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
                                color: 'var(--text-main)',
                                minWidth: '120px'
                            }}
                        >
                            {t === 'light' ? <Sun size={32} /> : <Moon size={32} />}
                            <span style={{ textTransform: 'capitalize' }}>{t} Mode</span>
                        </button>
                    ))}
                </div>
            </Section>

            <Section title="Typography" icon={Type}>
                <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Text Size</label>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        {['small', 'medium', 'large'].map((s) => (
                            <button
                                key={s}
                                onClick={() => updateSettings({ fontSize: s })}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '8px',
                                    border: `1px solid ${settings.fontSize === s ? 'var(--color-primary)' : 'var(--border-light)'}`,
                                    background: settings.fontSize === s ? 'var(--color-primary)' : 'transparent',
                                    color: settings.fontSize === s ? 'white' : 'var(--text-main)',
                                    fontSize: s === 'small' ? '0.9rem' : s === 'large' ? '1.1rem' : '1rem'
                                }}
                            >
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </Section>

            <Section title="Experience" icon={Zap}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <p style={{ fontWeight: '500' }}>Enable Animations</p>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Smooth transitions between pages</p>
                    </div>
                    <button
                        onClick={() => updateSettings({ animationsEnabled: !settings.animationsEnabled })}
                        style={{
                            width: '50px',
                            height: '28px',
                            borderRadius: '14px',
                            background: settings.animationsEnabled ? 'var(--color-primary)' : 'var(--border-light)',
                            position: 'relative',
                            transition: 'background 0.2s'
                        }}
                    >
                        <motion.div
                            layout
                            style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                background: 'white',
                                position: 'absolute',
                                top: '2px',
                                left: settings.animationsEnabled ? '24px' : '2px'
                            }}
                        />
                    </button>
                </div>
            </Section>

            <button
                onClick={logout}
                style={{
                    width: '100%',
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid #ef4444',
                    background: 'transparent',
                    color: '#ef4444',
                    fontWeight: '600',
                    marginTop: '20px'
                }}
            >
                Sign Out
            </button>
        </div>
    );
}
