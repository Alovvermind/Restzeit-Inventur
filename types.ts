export interface AnalysisPattern {
  titel: string;
  beschreibung: string;
  beispiele: string[];
}

export interface Analysis {
  zusammenfassung: string;
  muster: AnalysisPattern[];
  reflexionsfragen: string[];
  tagesvorsatz: string;
}
