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

    // Shopping Data
    const [shoppingList, setShoppingList] = useLocalStorage('life-organizer-shopping-list', []); // Active items
    const [shoppingBudget, setShoppingBudget] = useLocalStorage('life-organizer-shopping-budget', { amount: 0, currency: '₦' });
    const [shoppingRecommendations, setShoppingRecommendations] = useLocalStorage('life-organizer-shopping-recommendations', []);


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
        setTasks(prevTasks => {
            const taskIndex = prevTasks.findIndex(t => t.id === id);
            if (taskIndex === -1) return prevTasks;

            const task = prevTasks[taskIndex];
            const now = new Date();
            const isCompleted = !task.completed;
            let isOnTime = false;

            if (isCompleted) {
                const dueString = `${task.date}T${task.time}`;
                const due = new Date(dueString);
                if (!isNaN(due.getTime()) && now <= due) {
                    isOnTime = true;
                }

                // Handle Recurring Tasks
                if (task.frequency === 'daily') {
                    // Check if we already created a task for tomorrow to avoid duplicates (basic check)
                    // Or simpler: just create it. Most users won't spam click toggle.
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    const nextDateStr = tomorrow.toISOString().split('T')[0];

                    // Optional: check if duplicate already exists for that date?
                    // For now, let's just create it to ensure reliability.
                    const newDailyTask = {
                        ...task,
                        id: Date.now().toString(), // New ID
                        date: nextDateStr,
                        completed: false,
                        completedAt: null,
                        isOnTime: true // Reset for new task
                    };

                    // We need to return the new list including the new task
                    // But we can't update state inside the map cleanly if we are mapping.
                    // So we changed setTasks(tasks.map(...)) to setTasks(prevTasks => ...) and use logic here.
                }
            }

            const updatedTask = {
                ...task,
                completed: isCompleted,
                completedAt: isCompleted ? now.toISOString() : null,
                isOnTime: isCompleted ? isOnTime : false
            };

            const newTasks = [...prevTasks];
            newTasks[taskIndex] = updatedTask;

            // If it was a daily task and we just finished it, add the new one
            if (isCompleted && task.frequency === 'daily') {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                const nextDateStr = tomorrow.toISOString().split('T')[0];

                const newDailyTask = {
                    ...task,
                    id: (Date.now() + 1).toString(), // Ensure different ID
                    date: nextDateStr,
                    completed: false,
                    completedAt: null,
                    isOnTime: true,
                    // Keep frequency daily so it propagates
                };
                newTasks.push(newDailyTask);
            }

            return newTasks;
        });
    };

    // --- Habit Operations ---
    const addHabit = (habit) => {
        setHabits([...habits, { ...habit, id: Date.now().toString(), streaks: 0, history: [] }]);
    };

    // --- Shopping Operations ---
    const addShoppingItem = (item) => {
        setShoppingList([...shoppingList, { ...item, id: Date.now().toString(), purchased: false }]);
    };

    const updateShoppingItem = (id, updates) => {
        setShoppingList(shoppingList.map(item => item.id === id ? { ...item, ...updates } : item));
    };

    const deleteShoppingItem = (id) => {
        setShoppingList(shoppingList.filter(item => item.id !== id));
    };

    const markItemPurchased = (id) => {
        const item = shoppingList.find(i => i.id === id);
        if (!item) return;

        // Remove from active list
        const newShoppingList = shoppingList.filter(i => i.id !== id);
        setShoppingList(newShoppingList);

        // If frequent, add to recommendations (check for duplicates)
        if (item.frequency === 'Frequent') {
            const alreadyRecommended = shoppingRecommendations.some(r => r.name.toLowerCase() === item.name.toLowerCase());
            if (!alreadyRecommended) {
                // Remove specific properties that reset per purchase
                const { id, purchased, ...recommendationData } = item;
                setShoppingRecommendations([...shoppingRecommendations, { ...recommendationData, id: Date.now().toString() }]);
            }
        }
    };

    const moveRecommendationToActive = (recommendationId) => {
        const item = shoppingRecommendations.find(r => r.id === recommendationId);
        if (!item) return;

        // Add to active list
        const { id, ...itemData } = item;
        addShoppingItem({ ...itemData, frequency: 'Frequent' }); // Ensure it stays marked as Frequent
    };

    const deleteRecommendation = (id) => {
        setShoppingRecommendations(shoppingRecommendations.filter(r => r.id !== id));
    };

    const updateGeneralBudget = (amount, currency) => {
        setShoppingBudget({ amount, currency });
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
            exams, setExams,
            shoppingList, addShoppingItem, updateShoppingItem, deleteShoppingItem, markItemPurchased,
            shoppingBudget, updateGeneralBudget,
            shoppingRecommendations, moveRecommendationToActive, deleteRecommendation
        }}>
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    return useContext(DataContext);
}
