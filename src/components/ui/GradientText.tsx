import React from 'react';

export default function GradientText({ children }:{children:React.ReactNode}) {
  return (
    <span className="bg-gradient-to-r from-brand-500 via-emerald-400 to-sky-400 bg-clip-text text-transparent">
      {children}
    </span>
  );
}

