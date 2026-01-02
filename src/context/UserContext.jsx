import { createContext, useContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useLocalStorage('life-organizer-user', null);
    const [settings, setSettings] = useLocalStorage('life-organizer-settings', {
        theme: 'light', // light, dark
        accentColor: '#6366f1',
        fontSize: 'medium', // small, medium, large
        animationsEnabled: true,
    });

    // Apply theme and settings to document
    useEffect(() => {
        const root = window.document.documentElement;

        // Theme
        if (settings.theme === 'dark') {
            root.setAttribute('data-theme', 'dark');
        } else {
            root.removeAttribute('data-theme');
        }

        // Accent Color (Updating the HSL variable if possible, or HEX)
        // For simplicity, we can set --color-primary directly if passing HEX
        // But our CSS uses HSL. Let's try to set --color-primary to the hex value, 
        // though HSL is better. For now, assuming standard pre-defined themes or just hex.
        // If user provides Hex, we might need a converter. 
        // Start with just Font Size for simplicity and reliability.

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
        setUser({ ...user, ...userData });
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
        <UserContext.Provider value={{ user, settings, updateUser, updateSettings, logout }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}
