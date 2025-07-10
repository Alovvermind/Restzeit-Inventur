import React from 'react';

interface InventoryFormProps {
  inventoryText: string;
  setInventoryText: (text: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

export const InventoryForm: React.FC<InventoryFormProps> = ({ inventoryText, setInventoryText, onAnalyze, isLoading }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze();
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-slate-200">
        <h2 className="text-xl font-semibold text-slate-700 mb-2">Schritt 1: Deine Tagesreflexion</h2>
        <p className="text-slate-500 mb-4">Reflektiere ehrlich über deinen Tag. Wo warst du nachtragend, unehrlich, egoistisch oder ängstlich? Beschreibe die Situationen, ohne dich selbst zu verurteilen. Was hättest du anders machen können?</p>
        <form onSubmit={handleSubmit}>
        <textarea
            value={inventoryText}
            onChange={(e) => setInventoryText(e.target.value)}
            placeholder="Schreibe hier deine Gedanken zum vergangenen Tag auf..."
            className="w-full h-64 p-4 border border-slate-700 bg-slate-900 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 resize-y placeholder:text-slate-400 disabled:bg-slate-800 disabled:text-slate-400 disabled:cursor-not-allowed"
            disabled={isLoading}
        />
        <button
            type="submit"
            disabled={isLoading || inventoryText.trim().length < 20}
            className="mt-4 w-full bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors duration-300"
        >
            {isLoading ? 'Analysiere...' : 'Inventur analysieren'}
        </button>
        {inventoryText.trim().length < 20 && (
             <p className="text-xs text-center text-slate-400 mt-2">Bitte schreibe etwas mehr, damit die Analyse aussagekräftig ist.</p>
        )}
        </form>
    </div>
  );
};