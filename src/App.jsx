import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import { DataProvider } from './context/DataContext';
import Layout from './components/layout/Layout';
import OnboardingFlow from './components/onboarding/OnboardingFlow'; // We will create this next
import Dashboard from './components/dashboard/Dashboard'; // Create placeholder
// Import other pages...
import TaskList from './components/tasks/TaskList';
import StudentSection from './components/student/StudentSection';
import CalendarView from './components/calendar/CalendarView';
import GoalsTracker from './components/goals/GoalsTracker';
import WellnessTracker from './components/wellness/WellnessTracker';
import FinanceTracker from './components/finance/FinanceTracker';
import Notes from './components/notes/Notes';
import ShoppingList from './components/shopping/ShoppingList';
import Settings from './components/settings/Settings';
import HabitTracker from './components/habits/HabitTracker';

// Protective Wrapper
function AppRoutes() {
  const { user } = useUser();

  if (!user) {
    return <OnboardingFlow />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tasks" element={<TaskList />} />
        <Route path="/habits" element={<HabitTracker />} />
        <Route path="/calendar" element={<CalendarView />} />
        <Route path="/goals" element={<GoalsTracker />} />
        <Route path="/wellness" element={<WellnessTracker />} />
        <Route path="/finance" element={<FinanceTracker />} />
        <Route path="/shopping" element={<ShoppingList />} />
        <Route path="/notes" element={<Notes />} />
        {user.occupation === 'Student' && (
          <Route path="/student/*" element={<StudentSection />} />
        )}
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <UserProvider>
      <DataProvider>
        <Router>
          <AppRoutes />
        </Router>
      </DataProvider>
    </UserProvider>
  );
}

export default App;
