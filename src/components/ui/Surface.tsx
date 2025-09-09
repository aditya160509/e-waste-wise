import React from 'react';

export function Surface({ children, className = '' }:{children:React.ReactNode; className?:string}) {
  return (
    <div className={`rounded-2xl border shadow-card backdrop-blur-md ${className}
      bg-white/70 dark:bg-slate-900/50`}>
      {children}
    </div>
  );
}

