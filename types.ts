export interface ConceptNode {
  id: string;
  group: number;
}

export interface ConceptLink {
  source: string;
  target: string;
  value: number;
}

export interface ConceptGraph {
  nodes: ConceptNode[];
  links: ConceptLink[];
}

export interface ExplanationStep {
  title: string;
  description: string;
  icon: string; // An emoji or simple icon name
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctOptionIndex: number;
}

export interface SearchResult {
  title: string;
  url: string;
}

export interface ExplanationData {
  topic: string;
  summary: string;
  steps: ExplanationStep[];
  svgDiagram: string; // Raw SVG code
  conceptGraph: ConceptGraph; // For D3 visualization
  quiz: QuizQuestion[];
  relatedStats: {
    label: string;
    value: number;
  }[];
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}
