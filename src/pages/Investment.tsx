import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { GlassCard } from '../components/ui/GlassCard';
import { NeonButton } from '../components/ui/NeonButton';
import { formatCurrency, parseCurrency } from '../utils/format';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts/core';
import {
  LineChart
} from 'echarts/charts';
import {
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  GraphicComponent
} from 'echarts/components';
import {
  CanvasRenderer
} from 'echarts/renderers';
import { TrendingUp, AlertCircle, Trash2, Sparkles, ArrowUpRight, BarChart3 } from 'lucide-react';
import { clsx } from 'clsx';

echarts.use([
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  LineChart,
  CanvasRenderer,
  GraphicComponent
]);

// Data Mockup for Recommendations (Updated with Realtime Data)
const ASSET_DATA = {
  saham: [
    { id: 'BBCA', name: 'Bank Central Asia', code: 'BBCA', growth: 12.5, risk: 'Medium', price: 8300, dailyChange: -0.30 },
    { id: 'TLKM', name: 'Telkom Indonesia', code: 'TLKM', growth: 8.2, risk: 'Low', price: 3590, dailyChange: 0.56 },
    { id: 'BBRI', name: 'Bank Rakyat Ind', code: 'BBRI', growth: 15.1, risk: 'High', price: 3700, dailyChange: -1.70 },
    { id: 'ASII', name: 'Astra Int', code: 'ASII', growth: 5.4, risk: 'Medium', price: 6575, dailyChange: 0.0 },
  ],
  reksadana: [
    { id: 'RDPU1', name: 'Sucorinvest Money', code: 'RDPU', growth: 4.5, risk: 'Low', price: 1927, dailyChange: 0.01 },
    { id: 'RDPT1', name: 'Manulife Obligasi', code: 'RDPT', growth: 6.8, risk: 'Low-Med', price: 3250, dailyChange: 0.05 },
    { id: 'RDS1', name: 'Schroder 90', code: 'RDS', growth: 10.2, risk: 'High', price: 1540, dailyChange: -0.5 },
  ],
  emas: [
    { id: 'ANTM', name: 'Emas Antam', code: 'ANTM', growth: 3.2, risk: 'Low', price: 1130000, dailyChange: 0.2 },
    { id: 'UBS', name: 'Emas UBS', code: 'UBS', growth: 3.1, risk: 'Low', price: 1125000, dailyChange: 0.1 },
  ]
};

export const Investment = () => {
  const { hasInstallment, investments, addInvestment, removeInvestment, resetData, incomes } = useFinance();
  const [activeTab, setActiveTab] = useState<'saham' | 'reksadana' | 'emas'>('saham');
  const [selectedAsset, setSelectedAsset] = useState(ASSET_DATA.saham[0]);
  const [amountInput, setAmountInput] = useState('');
  const [chartData, setChartData] = useState<{ dates: string[], prices: number[] }>({ dates: [], prices: [] });
  const [isChartLoading, setIsChartLoading] = useState(false);
  const [chartError, setChartError] = useState<string | null>(null);
  const [chartTimeRange, setChartTimeRange] = useState('1M');
  const [projectionMode, setProjectionMode] = useState<'monthly' | 'lump_sum'>('monthly');
  const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);

  const calculateRecommendation = (income: number) => {
    const percentage = hasInstallment ? 0.1 : 0.2; // 10% jika ada cicilan, 20% jika tidak
    return income * percentage;
  };

  useEffect(() => {
    const newAsset = ASSET_DATA[activeTab][0];
    setSelectedAsset(newAsset);
  }, [activeTab]);

  useEffect(() => {
    if (selectedAsset) {
      fetchStockData(selectedAsset);
    }
  }, [selectedAsset, chartTimeRange]);

  const fetchStockData = async (asset: any) => {
    setIsChartLoading(true);
    setChartError(null);
    try {
      // Mock API call - replace with a real one (e.g., Finnhub, Marketstack)
      await new Promise(resolve => setTimeout(resolve, 800));

      const generateData = (days: number, targetPrice: number) => {
        const prices = [];
        const dates = [];

        // Base price and parameters based on asset type
        let volatility = 0.015; // Default volatility (Stocks)
        let trend = 0.0005; // Default daily trend

        // Adjust based on active tab and asset code
        if (activeTab === 'reksadana') {
          if (asset.code.includes('RDPU')) {
            // Pasar Uang: Very stable, almost linear growth (Bibit style)
            volatility = 0.0002;
            trend = 0.00015; // Steady small growth
          } else if (asset.code.includes('RDPT')) {
            // Obligasi: Low volatility
            volatility = 0.003;
            trend = 0.0002;
          }
        } else if (activeTab === 'emas') {
          volatility = 0.008;
          trend = 0.0003;
        }

        // Generate reverse: start from targetPrice and go backwards
        let currentSimulatedPrice = targetPrice;

        for (let i = 0; i < days; i++) {
          const date = new Date();
          date.setDate(date.getDate() - i); // Go backwards in time
          dates.unshift(date.toISOString().split('T')[0]); // Prepend date

          prices.unshift(currentSimulatedPrice); // Prepend price

          // Calculate previous price based on volatility
          // next = prev * (1 + change)  => prev = next / (1 + change)
          let change = (Math.random() - 0.5) * volatility;
          let dailyReturn = change + trend;

          // Special logic for Money Market (RDPU) - Never goes down, smooth line
          if (activeTab === 'reksadana' && asset.code.includes('RDPU')) {
            dailyReturn = (Math.random() * 0.0001) + trend; // Always positive, very smooth
          }

          // Reverse calculation to find "yesterday's" price
          currentSimulatedPrice = currentSimulatedPrice / (1 + dailyReturn);
        }
        return { dates, prices };
      };

      let days = 30;
      if (chartTimeRange === '7D') days = 7;
      if (chartTimeRange === '1Y') days = 365;
      if (chartTimeRange === '5Y') days = 365 * 5;

      const data = generateData(days, asset.price);
      setChartData(data);

    } catch (error: any) {
      setChartError(error.message || 'Tidak dapat memuat data grafik. Silakan periksa koneksi Anda.');
      setChartData({ dates: [], prices: [] });
    } finally {
      setIsChartLoading(false);
    }
  };



  const handleInvest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amountInput) return;
    addInvestment({
      type: activeTab === 'saham' ? 'stock' : activeTab === 'reksadana' ? 'mutual_fund' : 'gold',
      name: selectedAsset.name,
      amount: parseCurrency(amountInput),
    });
    setAmountInput('');
  };

  const formatInputCurrency = (val: string) => {
    if (!val) return '';
    const num = parseCurrency(val);
    return new Intl.NumberFormat('id-ID').format(num);
  };

  const totalPortfolio = investments.reduce((acc, curr) => acc + curr.amount, 0);
  const inputVal = parseCurrency(amountInput || '0');
  // Use input value for projection if available, otherwise use total portfolio
  const projectionBase = inputVal > 0 ? inputVal : totalPortfolio;
  const isSimulation = inputVal > 0;
  const growthRate = selectedAsset.growth / 100;

  const stockChartOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
      backgroundColor: 'rgba(20, 20, 20, 0.8)',
      borderColor: '#555',
      textStyle: { color: '#fff' },
      formatter: (params: any) => {
        const data = params[0];
        return `${data.axisValue}<br/>Harga: <strong>${formatCurrency(data.value)}</strong>`;
      }
    },
    grid: { left: '2%', right: '2%', top: '5%', bottom: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: chartData.dates,
      axisLine: { lineStyle: { color: '#444' } },
      axisLabel: { color: '#888', fontSize: 10 },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      min: 'dataMin',
      max: 'dataMax',
      axisLine: { show: false },
      axisLabel: {
        color: '#888',
        fontSize: 10,
        formatter: (value: number) => `${(value / 1000).toFixed(1)}k`
      },
      splitLine: { lineStyle: { color: '#2a2a2a', type: 'dashed' } },
    },
    series: [
      {
        data: chartData.prices,
        type: 'line',
        smooth: true,
        showSymbol: false,
        lineStyle: {
          color: '#b8ff3b',
          width: 2,
          shadowColor: 'rgba(184, 255, 59, 0.5)',
          shadowBlur: 10,
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(184, 255, 59, 0.3)' },
            { offset: 1, color: 'rgba(184, 255, 59, 0)' },
          ]),
        },
      },
    ],
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 100
      },
    ],
  };

  return (
    <div className="pb-32 space-y-6">
      {/* Header Card with Integrated Projections */}
      <GlassCard className="bg-gradient-to-br from-surface via-[#1a2520] to-primary/20 border-primary/20 relative overflow-hidden flex flex-col justify-center gap-6">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/5 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none" />

        {/* Top Section: Total Asset */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center relative z-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={14} className="text-primary animate-pulse" />
              <h1 className="text-text-muted text-xs font-medium tracking-wider uppercase">Investment Portfolio</h1>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">NeoInvest</h2>
          </div>
          <div className="text-left sm:text-right w-full sm:w-auto">
            <p className="text-text-muted text-xs mb-1">Total Aset Investasi</p>
            <p className="text-3xl sm:text-4xl font-bold text-primary drop-shadow-neon truncate">
              {formatCurrency(totalPortfolio)}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-white/10 relative z-10" />

        {/* Bottom Section: Projections */}
        <div className="relative z-10">
          <div className="flex items-start gap-4">
            {/* Graph Icon */}
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-primary shrink-0 mt-1">
              <BarChart3 size={24} />
            </div>

            {/* Projection Data */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">
                    Proyeksi
                  </p>
                  <div className="flex bg-black/20 rounded-lg p-0.5 border border-white/5">
                    <button
                      onClick={() => setProjectionMode('monthly')}
                      className={clsx(
                        "px-2 py-0.5 text-[10px] rounded-md transition-all",
                        projectionMode === 'monthly' ? "bg-primary/20 text-primary font-medium" : "text-text-muted hover:text-white"
                      )}
                    >
                      Bulanan
                    </button>
                    <button
                      onClick={() => setProjectionMode('lump_sum')}
                      className={clsx(
                        "px-2 py-0.5 text-[10px] rounded-md transition-all",
                        projectionMode === 'lump_sum' ? "bg-primary/20 text-primary font-medium" : "text-text-muted hover:text-white"
                      )}
                    >
                      Sekali
                    </button>
                  </div>
                </div>
                <p className="text-[10px] text-primary flex items-center gap-1">
                  <TrendingUp size={12} /> +{selectedAsset.growth}% / thn
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[1, 3, 5].map((year) => {
                  let projected = 0;
                  let totalInvested = 0;
                  // Use input value if available, otherwise use total portfolio. 
                  // If both are 0, use 0.
                  const baseAmount = inputVal > 0 ? inputVal : totalPortfolio;

                  if (projectionMode === 'monthly') {
                    // Monthly Investment Simulation (Future Value of Annuity)
                    const monthlyRate = growthRate / 12;
                    const months = year * 12;
                    // FV = P * ((1+r)^n - 1) / r
                    if (monthlyRate > 0) {
                      projected = baseAmount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
                    } else {
                      projected = baseAmount * months;
                    }
                    totalInvested = baseAmount * months;
                  } else {
                    // Lump Sum Projection (Compound Interest)
                    projected = baseAmount * Math.pow(1 + growthRate, year);
                    totalInvested = baseAmount;
                  }

                  const profit = projected - totalInvested;

                  return (
                    <div key={year} className="bg-white/5 rounded-lg p-2 border border-white/5">
                      <p className="text-[10px] text-text-muted mb-0.5">{year} Thn</p>
                      <p className="text-xs font-bold text-white truncate">{formatCurrency(projected)}</p>
                      <div className="flex justify-between items-center text-[9px]">
                        <span className="text-text-muted">Modal: {formatCurrency(totalInvested)}</span>
                      </div>
                      <p className="text-[9px] text-secondary truncate">+{formatCurrency(profit)}</p>
                    </div>
                  );
                })}
              </div>
              {inputVal === 0 && totalPortfolio === 0 && (
                <p className="text-[10px] text-text-muted italic mt-2">
                  Masukkan nominal atau miliki aset untuk melihat proyeksi
                </p>
              )}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Recommendation Section */}
      <GlassCard className="p-6 border-l-4 border-l-primary bg-primary/5">
        <div className="flex flex-col gap-2">
          <h4 className="text-white font-semibold">Rekomendasi Investasi Bulanan</h4>
          <p className="text-text-muted text-xs max-w-2xl">
            {hasInstallment
              ? "Terdeteksi adanya cicilan. Disarankan investasi konservatif untuk menjaga cashflow tetap aman."
              : "Keuangan stabil. Disarankan alokasi dana lebih besar untuk pertumbuhan aset yang optimal."}
          </p>
          {totalIncome > 0 && (
            <p className="text-primary font-bold text-lg mt-1">
              Saran: {formatCurrency(calculateRecommendation(totalIncome))}
            </p>
          )}
        </div>
      </GlassCard>

      {/* Asset Type Tabs */}
      <div className="flex p-1 bg-white/5 rounded-xl backdrop-blur-md border border-white/5">
        {['saham', 'reksadana', 'emas'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={clsx(
              "flex-1 py-2.5 text-sm font-medium rounded-lg transition-all capitalize relative overflow-hidden",
              activeTab === tab ? "text-black shadow-neon" : "text-text-muted hover:text-white"
            )}
          >
            {activeTab === tab && (
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-100" />
            )}
            <span className="relative z-10">{tab}</span>
          </button>
        ))}
      </div>

      {/* AI Recommendation Alert */}
      <GlassCard className="border-l-4 border-l-primary bg-primary/5">
        <div className="flex gap-3">
          <AlertCircle className="text-primary shrink-0 mt-0.5" size={18} />
          <div>
            <h4 className="text-white font-semibold mb-1">Rekomendasi Aset</h4>
            <p className="text-xs text-text-muted">
              Berdasarkan profil risiko Anda, kami merekomendasikan aset berikut untuk diversifikasi portofolio.
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Asset Details & Action */}
      <GlassCard className="grid md:grid-cols-2 gap-6 items-center">
        {/* Left Side: Asset Info & Graph */}
        <div>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-white">{selectedAsset.name}</h3>
              <p className="text-sm text-text-muted">Kode: {selectedAsset.code}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-text-muted">Harga Unit</p>
              <p className="font-bold text-white text-lg">
                {chartData.prices.length > 0
                  ? formatCurrency(chartData.prices[chartData.prices.length - 1])
                  : <span className="animate-pulse">...</span>}
              </p>
              <div className="flex items-center justify-end gap-1">
                <p className={clsx(
                  "text-[10px] font-medium",
                  (selectedAsset as any).dailyChange >= 0 ? "text-primary" : "text-red-500"
                )}>
                  {(selectedAsset as any).dailyChange >= 0 ? '+' : ''}{(selectedAsset as any).dailyChange}% (1H)
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3 flex gap-2">
            {ASSET_DATA[activeTab].map(asset => (
              <button
                key={asset.id}
                onClick={() => setSelectedAsset(asset)}
                className={clsx(
                  'px-2 py-1 text-xs rounded-md border transition-all',
                  selectedAsset.id === asset.id
                    ? 'bg-primary/20 border-primary text-primary font-semibold'
                    : 'bg-white/5 border-white/10 text-text-muted hover:border-white/30'
                )}
              >
                {asset.code}
              </button>
            ))}
          </div>

          <>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex gap-1.5">
                {['7D', '1M', '1Y', '5Y'].map(range => (
                  <button
                    key={range}
                    onClick={() => setChartTimeRange(range)}
                    className={clsx(
                      'px-2 py-0.5 text-[10px] rounded-md border transition-all',
                      chartTimeRange === range
                        ? 'bg-primary/20 border-primary text-primary font-semibold'
                        : 'bg-white/5 border-white/10 text-text-muted hover:border-white/30'
                    )}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-48 -mx-6 -mb-6 mt-4">
              {isChartLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-text-muted animate-pulse">Memuat grafik...</p>
                </div>
              ) : chartError ? (
                <div className="flex items-center justify-center h-full text-center px-4">
                  <p className="text-red-400 text-xs">{chartError}</p>
                </div>
              ) : (
                <ReactECharts option={stockChartOption} style={{ height: '100%' }} notMerge={true} lazyUpdate={true} />
              )}
            </div>
          </>
        </div>

        {/* Right Side: Action Form */}
        <form onSubmit={handleInvest} className="bg-white/5 p-4 rounded-xl border border-white/10">
          <h4 className="font-semibold text-white mb-3">Beli Aset</h4>
          <div className="relative mb-3">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">Rp</span>
            <input
              type="text"
              value={formatInputCurrency(amountInput)}
              onChange={(e) => setAmountInput(e.target.value)}
              placeholder="0"
              className="w-full bg-black/20 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-white focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
          <NeonButton type="submit" className="w-full">Investasi Sekarang</NeonButton>
        </form>
      </GlassCard>

      {/* Investment List */}
      <GlassCard>
        <h3 className="text-white font-semibold mb-4">Aset yang Dimiliki</h3>
        {investments.length > 0 ? (
          <div className="space-y-3">
            {investments.map(inv => (
              <div key={inv.id} className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 text-primary rounded-lg"><TrendingUp size={16} /></div>
                  <div>
                    <p className="font-semibold text-white text-sm">{inv.name}</p>
                    <p className="text-xs text-text-muted capitalize">{inv.type.replace('_', ' ')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-white text-sm">{formatCurrency(inv.amount)}</p>
                  <button onClick={() => { if (confirm('Yakin hapus?')) removeInvestment(inv.id) }} className="text-red-500/70 hover:text-red-500 transition-colors text-xs inline-flex items-center gap-1">
                    <Trash2 size={12} /> Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-text-muted italic text-center py-4">Belum ada investasi.</p>
        )}
      </GlassCard>

    </div>
  );
};
