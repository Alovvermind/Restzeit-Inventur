import React from 'react';
import type { Analysis, AnalysisPattern } from '../types';

interface AnalysisDisplayProps {
  analysis: Analysis;
  onReset: () => void;
}

const InfoCard: React.FC<{ title: string; children: React.ReactNode; icon: React.ReactNode }> = ({ title, children, icon }) => (
    <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
        <div className="flex items-center mb-3">
            <div className="mr-3 text-cyan-600">{icon}</div>
            <h3 className="text-lg font-semibold text-slate-700">{title}</h3>
        </div>
        <div className="text-slate-600 space-y-2">{children}</div>
    </div>
);

const SummaryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" /></svg>;
const PatternIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
const QuestionIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ResolutionIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>;

export const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ analysis, onReset }) => {
  return (
    <div className="bg-slate-100 p-6 md:p-8 rounded-xl shadow-inner border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Schritt 2: Deine Analyse</h2>
        
        <div className="space-y-6">
            <InfoCard title="Zusammenfassung" icon={<SummaryIcon/>}>
                <p>{analysis.zusammenfassung}</p>
            </InfoCard>

            <InfoCard title="Erkannte Muster" icon={<PatternIcon />}>
                {analysis.muster.length > 0 ? (
                    <ul className="space-y-4">
                        {analysis.muster.map((p, index) => (
                            <li key={index}>
                                <p><strong className="font-semibold text-slate-700">{p.titel}:</strong> {p.beschreibung}</p>
                                {p.beispiele && p.beispiele.length > 0 && (
                                    <div className="mt-2 pl-5">
                                        <ul className="list-disc list-outside space-y-1">
                                            {p.beispiele.map((beispiel, i) => (
                                                <li key={i} className="text-sm text-slate-600">
                                                   <span className="italic">"{beispiel}"</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : <p>Keine spezifischen Muster erkannt. Das ist auch ein gutes Zeichen!</p>}
            </InfoCard>

            <InfoCard title="Fragen zur Reflexion" icon={<QuestionIcon />}>
                <ul className="list-disc list-inside space-y-2">
                    {analysis.reflexionsfragen.map((q, index) => <li key={index}>{q}</li>)}
                </ul>
            </InfoCard>

            <div className="bg-cyan-50 border-l-4 border-cyan-500 text-cyan-800 p-5 rounded-r-lg shadow-sm">
                 <div className="flex items-center mb-3">
                    <div className="mr-3 text-cyan-600"><ResolutionIcon /></div>
                    <h3 className="text-lg font-semibold text-cyan-900">Dein Vorsatz für morgen</h3>
                </div>
                <p className="font-semibold text-lg">"{analysis.tagesvorsatz}"</p>
            </div>

        </div>

        <button
            onClick={onReset}
            className="mt-8 w-full bg-slate-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors duration-300"
        >
            Neue Inventur starten
        </button>
    </div>
  );
};
