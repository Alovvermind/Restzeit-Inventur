
import React from 'react';

const FeatherIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.929V10.5C3 9.438 3.42 8.423 4.154 7.69C4.887 6.956 5.903 6.536 6.964 6.536H12.036C13.097 6.536 14.113 6.956 14.846 7.69C15.58 8.423 16 9.438 16 10.5V13.929C16.819 14.137 17.581 14.493 18.25 14.975C19.349 15.768 20.151 16.92 20.536 18.253L21 20H3L3.464 18.253C3.849 16.92 4.651 15.768 5.75 14.975C6.419 14.493 7.181 14.137 8 13.929" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 13.929C8.327 15.933 9.997 17.5 12 17.5C14.003 17.5 15.673 15.933 16 13.929" />
    </svg>
);


export const Header: React.FC = () => {
  return (
    <header className="w-full max-w-4xl mx-auto py-6 px-4">
      <div className="flex items-center justify-center space-x-3">
        <FeatherIcon />
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 text-center">
          Tägliche Inventur
        </h1>
      </div>
      <p className="text-center text-slate-500 mt-2">Ein Werkzeug für Reflexion und Wachstum im Sinne der 12 Schritte.</p>
    </header>
  );
};
