import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import {
    LayoutDashboard, CheckSquare, Calendar, Target,
    Wallet, BookOpen, Settings, LogOut, GraduationCap, X, Menu, Heart, ShoppingCart, Repeat
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout({ children }) {
    const { user, logout } = useUser();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const navItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/tasks', label: 'Tasks', icon: CheckSquare },
        { path: '/habits', label: 'Habits', icon: Repeat }, // New
        { path: '/calendar', label: 'Calendar', icon: Calendar },
        ...(user?.occupation === 'Student' ? [
            { path: '/student', label: 'Student', icon: GraduationCap }
        ] : []),
        { path: '/goals', label: 'Goals', icon: Target },
        { path: '/wellness', label: 'Wellness', icon: Heart },
        { path: '/finance', label: 'Finances', icon: Wallet },
        { path: '/shopping', label: 'Shopping', icon: ShoppingCart },
        { path: '/notes', label: 'Notes', icon: BookOpen },
        { path: '/settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="flex min-h-screen bg-slate-50 relative overflow-hidden">
            {/* Mobile Header */}
            <header className="md:hidden flex items-center justify-between p-4 bg-white/80 backdrop-blur-md border-b border-slate-200 fixed top-0 left-0 right-0 z-50">
                <div className="flex items-center gap-3">
                    <button onClick={toggleMenu} className="p-1 hover:bg-slate-100 rounded-md transition-colors">
                        <Menu size={24} className="text-slate-700" />
                    </button>
                    <h2 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                        Life Organizer
                    </h2>
                </div>
            </header>

            {/* Mobile Sidebar Backdrop */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/60 backdrop-blur-xl border-r border-white/40 shadow-xl md:static md:shadow-none md:translate-x-0 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="p-6 mb-2">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                        Life Organizer
                    </h1>
                </div>

                <nav className="flex-1 flex flex-col gap-1 px-4 overflow-y-auto max-h-[calc(100vh-140px)] scrollbar-hide">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={({ isActive }) => `
                                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                                ${isActive
                                    ? 'bg-white shadow-[0_4px_12px_rgba(99,102,241,0.15)] text-indigo-600 font-semibold scale-[1.02]'
                                    : 'text-slate-500 hover:bg-white/50 hover:text-indigo-500'
                                }
                            `}
                        >
                            <item.icon size={20} className="transition-transform group-hover:scale-110" />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 mt-auto border-t border-slate-100">
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
                    >
                        <LogOut size={20} />
                        Sign Out
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8 overflow-x-hidden w-full max-w-[1600px] mx-auto">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
