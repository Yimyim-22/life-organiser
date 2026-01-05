import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import {
    LayoutDashboard, CheckSquare, Calendar, Target,
    Wallet, BookOpen, Settings, LogOut, GraduationCap, X, Menu, Heart, ShoppingCart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout({ children }) {
    const { user, logout } = useUser();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const navItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/tasks', label: 'Tasks', icon: CheckSquare },
        { path: '/calendar', label: 'Calendar', icon: Calendar },
        ...(user?.occupation === 'Student' ? [
            { path: '/student', label: 'Student', icon: GraduationCap }
        ] : []),
        { path: '/goals', label: 'Goals', icon: Target },
        { path: '/wellness', label: 'Wellness', icon: Heart }, // Added Wellness
        { path: '/finance', label: 'Finances', icon: Wallet },
        { path: '/shopping', label: 'Shopping', icon: ShoppingCart },
        { path: '/notes', label: 'Notes', icon: BookOpen },
        { path: '/settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-app)' }}>
            {/* Mobile Header */}
            {/* Mobile Header */}
            <div
                style={{
                    display: 'none',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 20px',
                    background: 'var(--bg-card)',
                    borderBottom: '1px solid var(--border-light)',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 90
                }}
                className="mobile-header"
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button onClick={toggleMenu} style={{ background: 'transparent', padding: '4px' }}>
                        <Menu size={24} color="var(--text-main)" />
                    </button>
                    <h2 className="text-gradient" style={{ fontSize: '1.2rem', margin: 0 }}>Life Organizer</h2>
                </div>
            </div>

            {/* Mobile Backdrop */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(0,0,0,0.5)',
                            zIndex: 95,
                            display: 'none' // Hidden by default, shown via CSS for mobile
                        }}
                        className="mobile-backdrop"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside
                style={{
                    width: '260px',
                    background: 'var(--bg-sidebar)',
                    borderRight: '1px solid var(--border-light)',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'fixed',
                    height: '100vh',
                    zIndex: 100,
                    left: 0,
                    top: 0,
                    transition: 'transform 0.3s ease'
                }}
                className={`desktop-sidebar ${isMobileMenuOpen ? 'open' : ''}`}
            >
                <div style={{ marginBottom: '40px', paddingLeft: '12px' }}>
                    <h2 className="text-gradient" style={{ fontSize: '1.5rem' }}>Life Organizer</h2>
                </div>

                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', minHeight: 0, paddingRight: '4px' }}>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px',
                                borderRadius: 'var(--radius-sm)',
                                color: isActive ? 'var(--color-primary)' : 'var(--text-muted)',
                                background: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                fontWeight: isActive ? 600 : 500,
                                transition: 'all 0.2s',
                                flexShrink: 0 // Prevent shrinking
                            })}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <button
                    onClick={logout}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px',
                        color: 'var(--text-muted)',
                        marginTop: 'auto',
                        background: 'transparent',
                        textAlign: 'left'
                    }}
                >
                    <LogOut size={20} />
                    Sign Out
                </button>
            </aside>

            {/* Main Content */}
            <main
                style={{
                    flex: 1,
                    marginLeft: '260px',
                    padding: '40px',
                    minWidth: 0 // Prevent flex child specific overflow issues
                }}
            >
                {children}
            </main>

            {/* Setup media query via style tag for mobile sidebar hiding */}
            <style>{`
        @media (max-width: 768px) {
          .mobile-header {
             display: flex !important;
          }
          .mobile-backdrop {
             display: block !important;
          }
          .desktop-sidebar {
            transform: translateX(-100%);
          }
          .desktop-sidebar.open {
            transform: translateX(0);
          }
          main {
            margin-left: 0 !important;
            padding: 20px !important;
            padding-top: 80px !important;
          }
        }
      `}</style>
        </div>
    );
}
