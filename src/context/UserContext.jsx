import { createContext, useContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useLocalStorage('life-organizer-user', null);
    const [accounts, setAccounts] = useLocalStorage('life-organizer-accounts', []); // Store registered accounts
    const [settings, setSettings] = useLocalStorage('life-organizer-settings', {
        theme: 'light', // light, dark
        accentColor: '#6366f1',
        customColors: {
            text: '',
            background: '',
            card: '',
            accent: '#6366f1'
        },
        fontSize: 'medium', // small, medium, large
        animationsEnabled: true,
    });

    // Apply theme and settings to document
    useEffect(() => {
        const root = window.document.documentElement;

        // Theme (Base)
        if (settings.theme === 'dark') {
            root.setAttribute('data-theme', 'dark');
        } else {
            root.removeAttribute('data-theme');
        }

        // Apply Custom Colors if present
        // We override the variables directly. If empty, we remove the inline style to fallback to CSS class.
        const setOrRemove = (varName, value) => {
            if (value) root.style.setProperty(varName, value);
            else root.style.removeProperty(varName);
        };

        const colors = settings.customColors || {};
        setOrRemove('--color-primary', colors.accent || settings.accentColor);
        // Also update the hue-based vars if possible, but overriding the final color is safer for Hex inputs
        // Note: text-gradient uses vars, so we might need to ensure --color-primary is enough.

        setOrRemove('--bg-app', colors.background);
        setOrRemove('--bg-card', colors.card);
        setOrRemove('--bg-sidebar', colors.card); // Sync sidebar with card/table
        setOrRemove('--text-main', colors.text);

        // Font Size
        const fontSizes = { small: '14px', medium: '16px', large: '18px' };
        root.style.setProperty('--font-size-base', fontSizes[settings.fontSize] || '16px');
        document.body.style.fontSize = fontSizes[settings.fontSize] || '16px';

        // Animations
        if (!settings.animationsEnabled) {
            root.style.setProperty('--transition-fast', '0s');
            root.style.setProperty('--transition-normal', '0s');
        } else {
            root.style.setProperty('--transition-fast', '0.2s ease');
            root.style.setProperty('--transition-normal', '0.3s ease');
        }

    }, [settings]);

    const updateUser = (userData) => {
        const updatedUser = { ...user, ...userData };
        setUser(updatedUser);
        // Also update in accounts
        setAccounts(accounts.map(acc => acc.email === user.email ? updatedUser : acc));
    };

    const register = (userData) => {
        // Check if user already exists
        const existing = accounts.find(acc => acc.email === userData.email);
        if (existing) {
            alert("Account with this email already exists. Please Sign In.");
            return false;
        }
        setAccounts([...accounts, userData]);
        setUser(userData);
        return true;
    };

    const login = (email, password) => {
        const account = accounts.find(acc => acc.email === email && acc.password === password);
        if (account) {
            setUser(account);
            return true;
        }
        return false;
    };

    const updateSettings = (newSettings) => {
        setSettings({ ...settings, ...newSettings });
    };

    const logout = () => {
        setUser(null);
        // Optional: Keep settings or reset? detailed spec says 'Sign Out' but not reset settings.
        // Keeping settings for UX.
    };

    return (
        <UserContext.Provider value={{ user, settings, updateUser, updateSettings, logout, login, register }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}
