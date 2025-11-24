import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FinanceProvider } from './context/FinanceContext';
import { BottomNav } from './components/layout/BottomNav';
import { Home } from './pages/Home';
import { Expenses } from './pages/Expenses';
import { Investment } from './pages/Investment';
import { Savings } from './pages/Savings';

function App() {
  return (
    <FinanceProvider>
      <Router>
        <div className="min-h-screen bg-background text-text-main font-sans selection:bg-primary selection:text-black flex justify-center">
          {/* Mobile Container - Changed to w-full for better mobile responsiveness while keeping max-width for desktop */}
          <div className="w-full md:max-w-md min-h-screen relative bg-background shadow-2xl overflow-hidden flex flex-col">
            {/* Ambient Background Effects */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
               <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
               <div className="absolute top-1/3 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[80px]" />
               <div className="absolute bottom-0 left-10 w-56 h-56 bg-secondary/10 rounded-full blur-[90px]" />
            </div>

            {/* Main Content */}
            <main className="relative z-10 p-4 md:p-6 flex-1 overflow-y-auto scrollbar-hide">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/expenses" element={<Expenses />} />
                <Route path="/investment" element={<Investment />} />
                <Route path="/savings" element={<Savings />} />
              </Routes>
            </main>

            <BottomNav />
          </div>
        </div>
      </Router>
    </FinanceProvider>
  );
}

export default App;
" " 
