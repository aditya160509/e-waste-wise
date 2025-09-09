import React from 'react';

export default function Section({ title, subtitle, id, className = '', children }:{
  title?: string; subtitle?: string; id?: string; className?: string; children: React.ReactNode;
}) {
  return (
    <section id={id} className={`py-12 md:py-16 ${className}`}>
      <div className="container mx-auto px-4 max-w-6xl">
        {title && (
          <header className="mb-8 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold">{title}</h2>
            {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}

