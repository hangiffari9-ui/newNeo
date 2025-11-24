import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { GlassCard } from '../components/ui/GlassCard';
import { NeonButton } from '../components/ui/NeonButton';
import { formatCurrency, parseCurrency, formatDate } from '../utils/format';
import { Trash2, PlusCircle, DollarSign, Wallet, Sparkles } from 'lucide-react';

export const Expenses = () => {
  const { salary, setSalary, addExpense, expenses, resetData, addIncome, incomes } = useFinance();
  
  const [salaryInput, setSalaryInput] = useState('');
  const [isSalarySet, setIsSalarySet] = useState(salary > 0);
  const [incomeInput, setIncomeInput] = useState({ name: '', amount: '' });

  const [form, setForm] = useState({
    name: '',
    category: '',
    amount: '',
  });

  const totalExpenses = useMemo(() => 
    expenses.reduce((acc, exp) => acc + exp.amount, 0), 
    [expenses]
  );

  const totalIncomes = useMemo(() =>
    incomes.reduce((acc, inc) => acc + inc.amount, 0),
    [incomes]
  );

  const remainingBalance = salary + totalIncomes - totalExpenses;

  const handleSalaryUpdate = () => {
    const val = parseCurrency(salaryInput);
    if (val > 0) {
      setSalary(val);
      setSalaryInput('');
      setIsSalarySet(true);
    }
  };

  const handleAddIncome = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incomeInput.name || !incomeInput.amount) return;
    addIncome({
      name: incomeInput.name,
      amount: parseCurrency(incomeInput.amount),
    });
    setIncomeInput({ name: '', amount: '' });
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.category || !form.amount) return;

    addExpense({
      name: form.name,
      category: form.category,
      amount: parseCurrency(form.amount),
    });

    setForm({ name: '', category: '', amount: '' });
  };

  const formatInputCurrency = (val: string) => {
    if (!val) return '';
    const num = parseCurrency(val);
    return new Intl.NumberFormat('id-ID').format(num);
  };

  return (
    <div className="pb-32 space-y-6">
      <GlassCard className="!p-0 overflow-hidden">
        <div className="p-6 bg-gradient-to-br from-primary/20 to-transparent">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Wallet size={28} className="text-primary"/>
              Manajemen Keuangan
            </h2>
            <div className="w-16 h-16 bg-primary/30 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Sparkles size={32} className="text-primary animate-pulse"/>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-white">
            <div>
              <p className="text-sm text-text-muted">Gaji Utama</p>
              <p className="text-2xl font-bold">{formatCurrency(salary)}</p>
            </div>
            <div>
              <p className="text-sm text-text-muted">Total Pengeluaran</p>
              <p className="text-2xl font-bold text-red-400">{formatCurrency(totalExpenses)}</p>
            </div>
            <div>
              <p className="text-sm text-text-muted">Sisa Saldo</p>
              <p className="text-2xl font-bold text-green-400">{formatCurrency(remainingBalance)}</p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Salary & Income Input */}
      <GlassCard>
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <DollarSign className="text-primary" size={20} /> Update Gaji & Pemasukan
        </h3>
        
        {/* Salary Input */}
        <div className="space-y-3 mb-6 pb-6 border-b border-white/10">
          <label className="block text-sm text-text-muted">Gaji Utama</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">Rp</span>
              <input
                type="text"
                value={salaryInput ? formatInputCurrency(salaryInput) : ''}
                onChange={(e) => setSalaryInput(e.target.value)}
                placeholder={isSalarySet ? formatCurrency(salary) : "Masukkan gaji utama"}
                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-primary/50 transition-all disabled:bg-black/30 disabled:cursor-not-allowed"
                disabled={isSalarySet}
              />
            </div>
            <NeonButton onClick={handleSalaryUpdate} className="px-6 w-full sm:w-auto" disabled={isSalarySet}>
              {isSalarySet ? 'Gaji Sudah Diatur' : 'Update Gaji'}
            </NeonButton>
          </div>
          {isSalarySet && <p className="text-xs text-text-muted mt-2">Gaji utama hanya dapat diatur sekali. Reset data untuk mengubah.</p>}
        </div>

        {/* Other Income Input */}
        <form onSubmit={handleAddIncome} className="space-y-4">
          <label className="block text-sm text-text-muted">Pemasukan Tambahan</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              value={incomeInput.name}
              onChange={(e) => setIncomeInput({ ...incomeInput, name: e.target.value })}
              className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary/50"
              placeholder="Nama Pemasukan (e.g., Freelance)"
            />
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">Rp</span>
              <input
                type="text"
                value={incomeInput.amount ? formatInputCurrency(incomeInput.amount) : ''}
                onChange={(e) => setIncomeInput({ ...incomeInput, amount: e.target.value })}
                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50"
                placeholder="0"
              />
            </div>
          </div>
          <NeonButton type="submit" className="w-full sm:w-auto px-8">Tambah Pemasukan</NeonButton>
        </form>
      </GlassCard>

      {/* Expense Form */}
      <GlassCard>
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <PlusCircle className="text-red-400" size={20} /> Tambah Pengeluaran
        </h3>
        <form onSubmit={handleAddExpense} className="space-y-5">
          <div>
            <label className="block text-xs text-text-muted mb-2">Nama Pengeluaran</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary/50"
              placeholder="Contoh: Makan Siang"
            />
          </div>
          
          <div>
             <label className="block text-xs text-text-muted mb-2">Kategori</label>
             <input
              type="text"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary/50"
              placeholder="Contoh: Makanan, Transportasi, Cicilan..."
            />
            <p className="text-[10px] text-text-muted mt-2">*Ketik "Cicilan" jika ini pembayaran hutang/kredit.</p>
          </div>

          <div>
            <label className="block text-xs text-text-muted mb-2">Nominal</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">Rp</span>
              <input
                type="text"
                value={form.amount ? formatInputCurrency(form.amount) : ''}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50"
                placeholder="0"
              />
            </div>
          </div>

          <NeonButton type="submit" className="w-full mt-2">Simpan Pengeluaran</NeonButton>
        </form>
      </GlassCard>

      {/* Expense List */}
      <GlassCard>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-semibold">Riwayat Pengeluaran</h3>
          <button onClick={() => resetData('expenses')} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1">
            <Trash2 size={12} /> Reset
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-text-muted whitespace-nowrap">
            <thead className="text-xs uppercase bg-white/5 text-white">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">Detail</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3 text-right rounded-r-lg">Jumlah</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr key={exp.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-white truncate max-w-[150px]">{exp.name}</div>
                    <div className="text-[10px]">{formatDate(exp.date)}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-[10px] ${exp.category.toLowerCase().includes('cicilan') ? 'bg-red-500/20 text-red-300' : 'bg-white/10'}`}>
                      {exp.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-white font-mono">
                    {formatCurrency(exp.amount)}
                  </td>
                </tr>
              ))}
              {expenses.length === 0 && (
                <tr><td colSpan={3} className="text-center py-6 italic">Belum ada data</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};
