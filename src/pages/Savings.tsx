import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { GlassCard } from '../components/ui/GlassCard';
import { NeonButton } from '../components/ui/NeonButton';
import { formatCurrency, parseCurrency, formatDate } from '../utils/format';
import { Target, Bell, CheckCircle2, Trash2, Sparkles } from 'lucide-react';

export const Savings = () => {
  const { 
    savings, addSavings, 
    savingsTarget, setSavingsTarget, 
    hasInstallment, resetData
  } = useFinance();

  const [targetInput, setTargetInput] = useState('');
  const [consecutiveDays, setConsecutiveDays] = useState(0);

  const totalSaved = savings.reduce((acc, curr) => acc + curr.amount, 0);
  const progress = Math.min((totalSaved / savingsTarget) * 100, 100);
  
  const today = new Date().toDateString();
  const hasSavedToday = savings.some(s => new Date(s.date).toDateString() === today);

  const handleUpdateTarget = () => {
    if (targetInput) {
      setSavingsTarget(parseCurrency(targetInput));
      setTargetInput('');
    }
  };

  const handleDailySave = () => {
    let amountToSave = 10000; // Default daily saving
    if (consecutiveDays + 1 >= 7) {
      amountToSave = 50000;
      setConsecutiveDays(0); // Reset after hitting the target
    } else {
      setConsecutiveDays(prev => prev + 1);
    }
    addSavings(amountToSave);
  };

  const formatInputCurrency = (val: string) => {
    if (!val) return '';
    const num = parseCurrency(val);
    return new Intl.NumberFormat('id-ID').format(num);
  };

  return (
    <div className="pb-32 space-y-6">
      {/* Header Card */}
      <GlassCard className="bg-gradient-to-br from-surface via-[#1a2520] to-primary/20 border-primary/20 relative overflow-hidden min-h-[140px] flex flex-col justify-center">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/5 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none" />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center relative z-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={14} className="text-primary animate-pulse" />
              <h1 className="text-text-muted text-xs font-medium tracking-wider uppercase">Savings Goals</h1>
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">NeoSave</h2>
          </div>
          <div className="text-left sm:text-right w-full sm:w-auto">
            <p className="text-text-muted text-xs mb-1">Terkumpul</p>
            <p className="text-3xl sm:text-4xl font-bold text-primary drop-shadow-neon truncate max-w-[250px] sm:max-w-full">
              {formatCurrency(totalSaved)}
            </p>
            <p className="text-xs text-text-muted mt-1">Target: {formatCurrency(savingsTarget)}</p>
          </div>
        </div>
      </GlassCard>

      {/* Notification Card */}
      {!hasSavedToday && (
        <GlassCard className="bg-gradient-to-r from-primary/20 to-transparent border-primary/30">
          <div className="flex gap-4 items-center">
            <div className="p-3 bg-primary/20 rounded-full">
              <Bell className="text-primary animate-pulse" />
            </div>
            <div>
              <h4 className="text-white font-bold">Waktunya Menabung!</h4>
              <p className="text-xs text-text-muted mt-1">
                Sisihkan <span className="text-primary font-bold">{formatCurrency(10000)}</span> hari ini untuk goals kamu.
              </p>
            </div>
          </div>
        </GlassCard>
      )}



      {/* Action Area */}
      <GlassCard>
        <h3 className="text-white font-semibold mb-4">Aksi Hari Ini</h3>
        {hasSavedToday ? (
          <div className="flex flex-col items-center py-6 text-center">
            <CheckCircle2 size={48} className="text-primary mb-2" />
            <p className="text-white font-medium">Hebat! Kamu sudah menabung hari ini.</p>
            <p className="text-xs text-text-muted">Hari menabung beruntun: {consecutiveDays}</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-text-muted">
              Tabungan harian minimal adalah <strong>{formatCurrency(10000)}</strong>. Jika menabung 7 hari berturut-turut, nominal akan menjadi <strong>{formatCurrency(50000)}</strong>.
            </p>
            <NeonButton onClick={handleDailySave} className="w-full flex justify-between items-center">
              <span>Simpan Hari Ini</span>
              <Target size={18} />
            </NeonButton>
          </div>
        )}
      </GlassCard>

      {/* Settings Form */}
      <GlassCard>
        <h3 className="text-white font-semibold mb-4">Atur Target Tabungan</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-text-muted mb-1">Nominal Target Akhir</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">Rp</span>
              <input
                type="text"
                value={targetInput ? formatInputCurrency(targetInput) : ''}
                onChange={(e) => setTargetInput(e.target.value)}
                placeholder={formatInputCurrency(savingsTarget.toString())}
                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50"
              />
            </div>
          </div>
          <NeonButton variant="secondary" onClick={handleUpdateTarget} className="w-full">Update Target</NeonButton>
        </div>
      </GlassCard>

       {/* History Table */}
       <GlassCard>
        <div className="flex justify-between items-center mb-4">
           <h3 className="text-white font-semibold">Riwayat Tabungan</h3>
           <button onClick={() => resetData('savings')} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1">
            <Trash2 size={12} /> Reset
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-text-muted">
            <thead className="text-xs uppercase bg-white/5 text-white">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">Tanggal</th>
                <th className="px-4 py-3 text-right rounded-r-lg">Jumlah</th>
              </tr>
            </thead>
            <tbody>
              {savings.map((save) => (
                <tr key={save.id} className="border-b border-white/5 last:border-0">
                  <td className="px-4 py-3">{formatDate(save.date)}</td>
                  <td className="px-4 py-3 text-right text-primary">{formatCurrency(save.amount)}</td>
                </tr>
              ))}
               {savings.length === 0 && (
                <tr><td colSpan={2} className="text-center py-6 italic">Belum ada tabungan</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};
