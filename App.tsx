
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { InventoryForm } from './components/InventoryForm';
import { AnalysisDisplay } from './components/AnalysisDisplay';
import { Loader } from './components/Loader';
import { analyzeInventory } from './services/geminiService';
import type { Analysis } from './types';

const App: React.FC = () => {
  const [inventoryText, setInventoryText] = useState<string>('');
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (!inventoryText.trim()) {
        setError("Bitte gib einen Text ein, um die Analyse zu starten.");
        return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await analyzeInventory(inventoryText);
      setAnalysis(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ein unbekannter Fehler ist aufgetreten.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [inventoryText]);

  const handleReset = () => {
    setInventoryText('');
    setAnalysis(null);
    setError(null);
    setIsLoading(false);
  };
  
  const renderContent = () => {
    if (isLoading) {
        return <Loader />;
    }
    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative text-center" role="alert">
                <strong className="font-bold">Fehler!</strong>
                <span className="block sm:inline ml-2">{error}</span>
                <button
                    onClick={handleReset}
                    className="mt-4 bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700"
                >
                    Erneut versuchen
                </button>
            </div>
        );
    }
    if (analysis) {
        return <AnalysisDisplay analysis={analysis} onReset={handleReset} />;
    }
    return (
        <InventoryForm 
            inventoryText={inventoryText}
            setInventoryText={setInventoryText}
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
        />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 w-full max-w-2xl">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

export default App;
