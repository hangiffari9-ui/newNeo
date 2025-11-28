import React, { createContext, useContext, useState, useEffect } from 'react';

export type Transaction = {
  id: string;
  name: string;
  category: string;
  amount: number;
  date: string;
  type: 'expense';
};

export type Income = {
  id: string;
  name: string;
  amount: number;
  date: string;
};

export type Investment = {
  id: string;
  type: 'stock' | 'mutual_fund' | 'gold';
  name: string;
  amount: number;
  date: string;
  currentValue: number; // Simulated current value
};

export type SavingsRecord = {
  id: string;
  amount: number;
  date: string;
};

interface FinanceContextType {
  salary: number;
  setSalary: (amount: number) => void;
  expenses: Transaction[];
  addExpense: (expense: Omit<Transaction, 'id' | 'date' | 'type'>) => void;
  incomes: Income[];
  addIncome: (income: Omit<Income, 'id' | 'date'>) => void;
  investments: Investment[];
  addInvestment: (inv: Omit<Investment, 'id' | 'date' | 'currentValue'>) => void;
  removeInvestment: (id: string) => void;
  savings: SavingsRecord[];
  addSavings: (amount: number) => void;
  savingsTarget: number;
  setSavingsTarget: (amount: number) => void;

  resetData: (type: 'expenses' | 'investments' | 'savings' | 'incomes' | 'all') => void;
  hasInstallment: boolean;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from local storage or default
  const [salary, setSalary] = useState(() => Number(localStorage.getItem('salary')) || 0);
  const [expenses, setExpenses] = useState<Transaction[]>(() => JSON.parse(localStorage.getItem('expenses') || '[]'));
  const [incomes, setIncomes] = useState<Income[]>(() => JSON.parse(localStorage.getItem('incomes') || '[]'));
  const [investments, setInvestments] = useState<Investment[]>(() => JSON.parse(localStorage.getItem('investments') || '[]'));
  const [savings, setSavings] = useState<SavingsRecord[]>(() => JSON.parse(localStorage.getItem('savings') || '[]'));
  const [savingsTarget, setSavingsTarget] = useState(() => Number(localStorage.getItem('savingsTarget')) || 10000000);


  useEffect(() => { localStorage.setItem('salary', salary.toString()); }, [salary]);
  useEffect(() => { localStorage.setItem('expenses', JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem('incomes', JSON.stringify(incomes)); }, [incomes]);
  useEffect(() => { localStorage.setItem('investments', JSON.stringify(investments)); }, [investments]);
  useEffect(() => { localStorage.setItem('savings', JSON.stringify(savings)); }, [savings]);
  useEffect(() => { localStorage.setItem('savingsTarget', savingsTarget.toString()); }, [savingsTarget]);


  const addExpense = (data: Omit<Transaction, 'id' | 'date' | 'type'>) => {
    const newExpense: Transaction = {
      ...data,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      type: 'expense',
    };
    setExpenses(prev => [newExpense, ...prev]);
  };

  const addIncome = (data: Omit<Income, 'id' | 'date'>) => {
    const newIncome: Income = {
      ...data,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    };
    setIncomes(prev => [newIncome, ...prev]);
  };

  const addInvestment = (data: Omit<Investment, 'id' | 'date' | 'currentValue'>) => {
    const newInv: Investment = {
      ...data,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      currentValue: data.amount, // Initial value same as invested
    };
    setInvestments(prev => [newInv, ...prev]);
  };

  const removeInvestment = (id: string) => {
    setInvestments(prev => prev.filter(inv => inv.id !== id));
  };

  const addSavings = (amount: number) => {
    const newSave: SavingsRecord = {
      id: crypto.randomUUID(),
      amount,
      date: new Date().toISOString(),
    };
    setSavings(prev => [newSave, ...prev]);
  };

  const resetData = (type: 'expenses' | 'investments' | 'savings' | 'incomes' | 'all') => {
    if (type === 'expenses' || type === 'all') setExpenses([]);
    if (type === 'incomes' || type === 'all') setIncomes([]);
    if (type === 'investments' || type === 'all') setInvestments([]);
    if (type === 'savings' || type === 'all') setSavings([]);
    if (type === 'all') setSalary(0);
  };

  const hasInstallment = expenses.some(e =>
    e.category.toLowerCase().includes('cicilan') ||
    e.name.toLowerCase().includes('cicilan')
  );

  return (
    <FinanceContext.Provider value={{
      salary, setSalary,
      expenses, addExpense,
      incomes, addIncome,
      investments, addInvestment, removeInvestment,
      savings, addSavings,
      savingsTarget, setSavingsTarget,
      resetData,
      hasInstallment
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance must be used within a FinanceProvider');
  return context;
};
