import React, { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import { Moon, Sun, Monitor, Type, Zap, Layout, Palette, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Settings() {
    const { settings, updateSettings, logout } = useUser();

    // Local state for color pickers to avoid laggy inputs
    const [colors, setColors] = useState(settings.customColors || {
        accent: '#6366f1',
        text: '#000000',
        background: '#ffffff',
        card: '#ffffff'
    });

    useEffect(() => {
        if (settings.customColors) {
            setColors(prev => ({ ...prev, ...settings.customColors }));
        }
    }, [settings.customColors]);

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
