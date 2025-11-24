import React from 'react';
import { Home, Wallet, TrendingUp, PiggyBank } from 'lucide-react';
import { clsx } from 'clsx';
import { Link, useLocation } from 'react-router-dom';

export const BottomNav = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Wallet, label: 'Pengeluaran', path: '/expenses' },
    { icon: TrendingUp, label: 'Investasi', path: '/investment' },
    { icon: PiggyBank, label: 'Tabungan', path: '/savings' },
  ];

  return (
    <div className="fixed bottom-6 left-0 right-0 px-4 z-50 flex justify-center">
      <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-full px-6 py-4 shadow-2xl flex items-center gap-8 md:gap-12">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link key={item.path} to={item.path} className="relative flex flex-col items-center justify-center group">
              {isActive && (
                <div className="absolute -top-10 w-8 h-8 bg-primary/50 rounded-full blur-xl" />
              )}
              <item.icon 
                size={24} 
                className={clsx(
                  "transition-all duration-300",
                  isActive ? "text-primary drop-shadow-[0_0_8px_rgba(184,255,59,0.8)]" : "text-gray-400 group-hover:text-white"
                )} 
              />
              {isActive && <div className="absolute -bottom-2 w-1 h-1 bg-primary rounded-full" />}
            </Link>
          );
        })}
      </div>
    </div>
  );
};
