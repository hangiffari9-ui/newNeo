import React from 'react';
//import * as XLSX from 'xlsx';
//import { saveAs } from 'file-saver';
import { useFinance } from '../context/FinanceContext';
import { GlassCard } from '../components/ui/GlassCard';
import { formatCurrency, formatDate } from '../utils/format';
import { ArrowUpRight, ArrowDownRight, Wallet, PieChart, Download, Sparkles, PiggyBank, TrendingUp } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import { NeonButton } from '../components/ui/NeonButton';

export const Home = () => {
  const { salary, expenses, investments, savings, incomes } = useFinance();

  const totalIncomes = incomes.reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const totalInvestment = investments.reduce((acc, curr) => acc + curr.amount, 0);
  const totalSavings = savings.reduce((acc, curr) => acc + curr.amount, 0);
  const remaining = salary + totalIncomes - totalExpenses - totalInvestment - totalSavings;

  // Chart Data
  const chartOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' },
    legend: {
      data: ['Income', 'Expense', 'Savings'],
      textStyle: { color: '#94a3b8' },
      bottom: 0
    },
    grid: { left: '3%', right: '4%', bottom: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'],
      axisLine: { lineStyle: { color: '#94a3b8' } },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#ffffff10' } },
      axisLine: { lineStyle: { color: '#94a3b8' } },
      axisLabel: { formatter: (value: number) => value >= 1000000 ? `${value / 1000000}M` : `${value / 1000}k` }
    },
    series: [
      {
        name: 'Income',
        type: 'line',
        smooth: true,
        data: expenses.length > 0 || salary > 0 ? [salary + totalIncomes, salary + totalIncomes, salary + totalIncomes, salary + totalIncomes] : [], 
        itemStyle: { color: '#b8ff3b' }, // Neon Green
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: 'rgba(184, 255, 59, 0.3)' }, { offset: 1, color: 'rgba(184, 255, 59, 0)' }]
          }
        }
      },
      {
        name: 'Expense',
        type: 'line',
        smooth: true,
        data: expenses.length > 0 ? [totalExpenses * 0.2, totalExpenses * 0.5, totalExpenses * 0.8, totalExpenses] : [],
        itemStyle: { color: '#ff5a5a' }, // Red
      },
      {
        name: 'Savings',
        type: 'line',
        smooth: true,
        data: savings.length > 0 ? [totalSavings * 0.1, totalSavings * 0.4, totalSavings * 0.7, totalSavings] : [],
        itemStyle: { color: '#3b82f6' }, // Blue
        lineStyle: { type: 'dashed' }
      }
    ]
  };

  const handleExport = (type: 'csv') => {
    const wb = XLSX.utils.book_new();

    // Data Laporan Keuangan
    const reportData = [
      ['Laporan Keuangan'],
      [''],
      ['Total Gaji', formatCurrency(salary)],
      ['Total Pemasukan Tambahan', formatCurrency(totalIncomes)],
      ['Total Pengeluaran', formatCurrency(totalExpenses)],
      ['Total Investasi', formatCurrency(totalInvestment)],
      ['Total Tabungan', formatCurrency(totalSavings)],
      ['Sisa Uang', formatCurrency(remaining)],
    ];
    const reportSheet = XLSX.utils.aoa_to_sheet(reportData);
    XLSX.utils.book_append_sheet(wb, reportSheet, 'Laporan Keuangan');

    // Data Investasi
    if (investments.length > 0) {
      const investmentData = [
        ['Investasi Terbaru'],
        ['Aset', 'Nilai'],
        ...investments.map(inv => [inv.name, formatCurrency(inv.amount)])
      ];
      const investmentSheet = XLSX.utils.aoa_to_sheet(investmentData);
      XLSX.utils.book_append_sheet(wb, investmentSheet, 'Investasi');
    }

    // Data Pengeluaran
    if (expenses.length > 0) {
      const expenseData = [
        ['Pengeluaran Terakhir'],
        ['Keterangan', 'Jumlah'],
        ...expenses.map(exp => [exp.category, formatCurrency(exp.amount)])
      ];
      const expenseSheet = XLSX.utils.aoa_to_sheet(expenseData);
      XLSX.utils.book_append_sheet(wb, expenseSheet, 'Pengeluaran');
    }

    const fileName = `Laporan_Keuangan_${new Date().toISOString().split('T')[0]}`;

    // Untuk CSV, kita akan ekspor sheet pertama saja (Laporan Keuangan)
    const csvOutput = XLSX.utils.sheet_to_csv(wb.Sheets[wb.SheetNames[0]]);
    saveAs(new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' }), `${fileName}.csv`);
  };

  return (
    <div className="pb-32 space-y-5 md:space-y-6">
      {/* Header Card */}
      <GlassCard className="bg-gradient-to-br from-surface via-[#1a2520] to-primary/20 border-primary/20 relative overflow-hidden min-h-[140px] flex flex-col justify-center">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/5 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none" />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center relative z-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={14} className="text-primary animate-pulse" />
              <h1 className="text-text-muted text-xs font-medium tracking-wider uppercase">Financial Manager</h1>
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">NeoFinance</h2>
          </div>
          <div className="text-left sm:text-right w-full sm:w-auto">
            <p className="text-text-muted text-xs mb-1">Total Saldo</p>
            <p className="text-3xl sm:text-4xl font-bold text-primary drop-shadow-neon truncate max-w-[250px] sm:max-w-full">
              {formatCurrency(remaining)}
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Summary Grid */}
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <GlassCard className="space-y-1 p-3 md:p-5">
          <div className="flex items-center gap-2 text-text-muted text-[10px] md:text-xs">
            <ArrowUpRight size={12} className="text-primary" /> Pemasukan
          </div>
          <p className="text-base md:text-lg font-semibold text-white truncate">{formatCurrency(salary + totalIncomes)}</p>
        </GlassCard>
        <GlassCard className="space-y-1 p-3 md:p-5">
          <div className="flex items-center gap-2 text-text-muted text-[10px] md:text-xs">
            <ArrowDownRight size={12} className="text-red-400" /> Pengeluaran
          </div>
          <p className="text-base md:text-lg font-semibold text-white truncate">{formatCurrency(totalExpenses)}</p>
        </GlassCard>
        <GlassCard className="space-y-1 p-3 md:p-5">
          <div className="flex items-center gap-2 text-text-muted text-[10px] md:text-xs">
            <PieChart size={12} className="text-blue-400" /> Investasi
          </div>
          <p className="text-base md:text-lg font-semibold text-white truncate">{formatCurrency(totalInvestment)}</p>
        </GlassCard>
        <GlassCard className="space-y-1 p-3 md:p-5">
          <div className="flex items-center gap-2 text-text-muted text-[10px] md:text-xs">
            <Wallet size={12} className="text-yellow-400" /> Sisa Uang
          </div>
          <p className="text-base md:text-lg font-semibold text-white truncate">{formatCurrency(remaining)}</p>
        </GlassCard>
      </div>

      {/* Chart */}
      <GlassCard>
        <h3 className="text-white font-semibold mb-4">Arus Keuangan Bulanan</h3>
        {expenses.length === 0 && salary === 0 && savings.length === 0 ? (
           <div className="h-[200px] flex items-center justify-center text-text-muted text-sm italic border border-dashed border-white/10 rounded-xl">
             Belum ada data
           </div>
        ) : (
          <ReactECharts option={chartOption} style={{ height: '280px' }} />
        )}
      </GlassCard>



      {/* Tables Grid */}
      <div className="grid md:grid-cols-2 gap-4 md:gap-6">
        {/* Investment Table */}
        <GlassCard>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-primary" size={18} />
              <h3 className="text-white font-semibold text-sm md:text-base">Investasi Terbaru</h3>
            </div>
            <span className="text-[10px] md:text-xs text-primary">+12.5% Profit</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-text-muted whitespace-nowrap">
              <thead className="text-xs uppercase bg-white/5 text-white">
                <tr>
                  <th className="px-3 py-2 rounded-l-lg">Aset</th>
                  <th className="px-3 py-2 text-right rounded-r-lg">Nilai</th>
                </tr>
              </thead>
              <tbody>
                {investments.slice(0, 3).map((inv) => (
                  <tr key={inv.id} className="border-b border-white/5 last:border-0">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-primary/10 text-primary shrink-0">
                          <TrendingUp size={16} />
                        </div>
                        <span className="font-medium text-white truncate">{inv.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right">{formatCurrency(inv.amount)}</td>
                  </tr>
                ))}
                {investments.length === 0 && (
                  <tr><td colSpan={2} className="text-center py-4">Belum ada investasi</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>

        {/* Expense Table */}
        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <ArrowDownRight className="text-red-400" size={18} />
            <h3 className="text-white font-semibold text-sm md:text-base">Pengeluaran Terakhir</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-text-muted whitespace-nowrap">
              <thead className="text-xs uppercase bg-white/5 text-white">
                <tr>
                  <th className="px-3 py-2 rounded-l-lg">Ket</th>
                  <th className="px-3 py-2 text-right rounded-r-lg">Jml</th>
                </tr>
              </thead>
              <tbody>
                {expenses.slice(0, 3).map((exp) => (
                  <tr key={exp.id} className="border-b border-white/5 last:border-0">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-red-500/10 text-red-400 shrink-0">
                          <ArrowDownRight size={16} />
                        </div>
                        <div>
                          <div className="text-white font-medium truncate max-w-[100px] md:max-w-[120px]">{exp.name}</div>
                          <div className="text-[10px] text-text-muted">{formatDate(exp.date)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right text-red-400">{formatCurrency(exp.amount)}</td>
                  </tr>
                ))}
                {expenses.length === 0 && (
                  <tr><td colSpan={2} className="text-center py-4">Belum ada pengeluaran</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>

        {/* Savings Table */}
        <GlassCard className="md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <PiggyBank size={18} className="text-blue-400" />
            <h3 className="text-white font-semibold text-sm md:text-base">Tabungan Terbaru</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-text-muted whitespace-nowrap">
              <thead className="text-xs uppercase bg-white/5 text-white">
                <tr>
                  <th className="px-3 py-2 rounded-l-lg">Tanggal</th>
                  <th className="px-3 py-2 text-right rounded-r-lg">Jumlah Disimpan</th>
                </tr>
              </thead>
              <tbody>
                {savings.slice(0, 3).map((save) => (
                  <tr key={save.id} className="border-b border-white/5 last:border-0">
                    <td className="px-3 py-3">
                      <div className="text-white font-medium">{formatDate(save.date)}</div>
                    </td>
                    <td className="px-3 py-3 text-right text-blue-400 font-mono">{formatCurrency(save.amount)}</td>
                  </tr>
                ))}
                {savings.length === 0 && (
                  <tr><td colSpan={2} className="text-center py-4">Belum ada data tabungan</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>

        {/* Export Buttons */}
        <GlassCard className="md:col-span-2">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-3 sm:mb-0">
              <Download size={16} className="text-primary" />
              <h3 className="text-white font-semibold">Ekspor Laporan</h3>
            </div>
            <div className="flex items-center gap-3">
              <NeonButton onClick={() => handleExport('csv')} className="text-xs">Export CSV</NeonButton>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
