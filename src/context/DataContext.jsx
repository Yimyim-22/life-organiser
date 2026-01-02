import { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { v4 as uuidv4 } from 'uuid'; // UUID generation helper if needed, or simple Date.now()

const DataContext = createContext();

export function DataProvider({ children }) {
    const [tasks, setTasks] = useLocalStorage('life-organizer-tasks', []);
    const [habits, setHabits] = useLocalStorage('life-organizer-habits', []);
    const [goals, setGoals] = useLocalStorage('life-organizer-goals', []);
    const [finance, setFinance] = useLocalStorage('life-organizer-finance', {
        transactions: [],
        budget: {},
    });
    const [notes, setNotes] = useLocalStorage('life-organizer-notes', []);

    // Student Specific Data
    const [classes, setClasses] = useLocalStorage('life-organizer-classes', []);
    const [assignments, setAssignments] = useLocalStorage('life-organizer-assignments', []);
    const [exams, setExams] = useLocalStorage('life-organizer-exams', []);


    // --- Task Operations ---
    const addTask = (task) => {
        const newTask = { ...task, id: Date.now().toString(), createdAt: new Date().toISOString(), completed: false };
        setTasks([...tasks, newTask]);
    };

    const updateTask = (id, updates) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, ...updates } : t));
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter(t => t.id !== id));
    };

    const toggleTaskCompletion = (id) => {
        setTasks(tasks.map(t => {
            if (t.id === id) {
                const now = new Date();
                const isCompleted = !t.completed;
                let isOnTime = false;

                if (isCompleted) {
                    const dueString = `${t.date}T${t.time}`;
                    const due = new Date(dueString);
                    // If due date is valid and now is before due, it's on time
                    if (!isNaN(due.getTime()) && now <= due) {
                        isOnTime = true;
                    }
                    // If no time specified, assume end of day? Or just date comparison.
                    // For simplicity, we stick to the combined string comparison.
                }

                return {
                    ...t,
                    completed: isCompleted,
                    completedAt: isCompleted ? now.toISOString() : null,
                    isOnTime: isCompleted ? isOnTime : false
                };
            }
            return t;
        }));
    };

    // --- Habit Operations ---
    const addHabit = (habit) => {
        setHabits([...habits, { ...habit, id: Date.now().toString(), streaks: 0, history: [] }]);
    };

    // ... (Other operations can be added as we implement features)

    return (
        <DataContext.Provider value={{
            tasks, addTask, updateTask, deleteTask, toggleTaskCompletion,
            habits, setHabits, addHabit,
            goals, setGoals,
            finance, setFinance,
            notes, setNotes,
            classes, setClasses,
            assignments, setAssignments,
            exams, setExams
        }}>
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    return useContext(DataContext);
}
