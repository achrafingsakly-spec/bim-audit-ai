import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AuditStatus = 'validated' | 'not-validated' | 'not-checked';

export interface AuditCriterion {
  id: string;
  name: string;
  nameFr: string;
  nameEn: string;
  group: 'diffusion' | 'codification' | 'references' | 'modeling' | 'information';
  status: AuditStatus;
  aiRecommendation?: string;
  aiRecommendationEn?: string;
}

export interface BimModel {
  id: string;
  name: string;
  fileName: string;
  fileType: 'RVT' | 'IFC';
  size: number;
  uploadedAt: Date;
  metadata: {
    family?: string;
    layer?: string;
    phase?: string;
  };
  auditScore?: number;
}

export interface Anomaly {
  id: string;
  modelId: string;
  descriptionFr: string;
  descriptionEn: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location?: string;
  imageUrl?: string;
  criterionId?: string;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: Date;
  models: BimModel[];
  anomalies: Anomaly[];
  auditCriteria: AuditCriterion[];
}

interface AppState {
  // Theme
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;

  // Language
  language: 'fr' | 'en';
  setLanguage: (language: 'fr' | 'en') => void;

  // Projects
  projects: Project[];
  currentProjectId: string | null;
  setCurrentProject: (projectId: string | null) => void;
  getCurrentProject: () => Project | undefined;

  // Models
  addModel: (projectId: string, model: BimModel) => void;
  removeModel: (projectId: string, modelId: string) => void;

  // Audit
  updateCriterionStatus: (projectId: string, criterionId: string, status: AuditStatus) => void;
  calculateGroupScore: (projectId: string, group: string) => number;
  calculateGlobalScore: (projectId: string) => number;

  // Anomalies
  addAnomaly: (projectId: string, anomaly: Anomaly) => void;
  removeAnomaly: (projectId: string, anomalyId: string) => void;
}

// Mock data for demo
const mockAuditCriteria: AuditCriterion[] = [
  // Diffusion
  { id: 'd1', name: 'Format de diffusion correct', nameFr: 'Format de diffusion correct', nameEn: 'Correct distribution format', group: 'diffusion', status: 'validated' },
  { id: 'd2', name: 'Destinataires identifiés', nameFr: 'Destinataires identifiés', nameEn: 'Recipients identified', group: 'diffusion', status: 'validated' },
  { id: 'd3', name: 'Version de fichier à jour', nameFr: 'Version de fichier à jour', nameEn: 'Up-to-date file version', group: 'diffusion', status: 'not-validated', aiRecommendation: 'La version du fichier est obsolète. Veuillez mettre à jour vers la version 2024.1', aiRecommendationEn: 'File version is outdated. Please update to version 2024.1' },
  
  // Codification
  { id: 'c1', name: 'Nomenclature des fichiers conforme', nameFr: 'Nomenclature des fichiers conforme', nameEn: 'File naming convention compliant', group: 'codification', status: 'validated' },
  { id: 'c2', name: 'Codification des éléments BIM', nameFr: 'Codification des éléments BIM', nameEn: 'BIM elements codification', group: 'codification', status: 'not-validated', aiRecommendation: '15 éléments ne respectent pas la convention de codification SNCF-GC.', aiRecommendationEn: '15 elements do not comply with SNCF-GC coding convention.' },
  { id: 'c3', name: 'Identifiants uniques attribués', nameFr: 'Identifiants uniques attribués', nameEn: 'Unique identifiers assigned', group: 'codification', status: 'validated' },
  { id: 'c4', name: 'Classification Uniformat/Omniclass', nameFr: 'Classification Uniformat/Omniclass', nameEn: 'Uniformat/Omniclass classification', group: 'codification', status: 'not-checked' },
  
  // References
  { id: 'r1', name: 'Géoréférencement correct', nameFr: 'Géoréférencement correct', nameEn: 'Correct georeferencing', group: 'references', status: 'validated' },
  { id: 'r2', name: 'Unités de mesure conformes', nameFr: 'Unités de mesure conformes', nameEn: 'Compliant measurement units', group: 'references', status: 'validated' },
  { id: 'r3', name: 'Niveaux de référence définis', nameFr: 'Niveaux de référence définis', nameEn: 'Reference levels defined', group: 'references', status: 'validated' },
  
  // Modeling
  { id: 'm1', name: 'LOD respecté (LOD 300)', nameFr: 'LOD respecté (LOD 300)', nameEn: 'LOD compliance (LOD 300)', group: 'modeling', status: 'validated' },
  { id: 'm2', name: 'Pas de géométrie dupliquée', nameFr: 'Pas de géométrie dupliquée', nameEn: 'No duplicate geometry', group: 'modeling', status: 'not-validated', aiRecommendation: '23 éléments de géométrie dupliqués détectés dans la zone Quais.', aiRecommendationEn: '23 duplicate geometry elements detected in the Platforms zone.' },
  { id: 'm3', name: 'Connexions entre éléments', nameFr: 'Connexions entre éléments', nameEn: 'Element connections', group: 'modeling', status: 'validated' },
  { id: 'm4', name: 'Pas de conflits spatiaux', nameFr: 'Pas de conflits spatiaux', nameEn: 'No spatial conflicts', group: 'modeling', status: 'not-validated', aiRecommendation: '8 conflits détectés entre structure et MEP. Voir rapport détaillé.', aiRecommendationEn: '8 conflicts detected between structure and MEP. See detailed report.' },
  
  // Information
  { id: 'i1', name: 'Attributs obligatoires renseignés', nameFr: 'Attributs obligatoires renseignés', nameEn: 'Mandatory attributes filled', group: 'information', status: 'not-validated', aiRecommendation: '45 éléments manquent des attributs obligatoires (Matériau, Fournisseur).', aiRecommendationEn: '45 elements missing mandatory attributes (Material, Supplier).' },
  { id: 'i2', name: 'Données de maintenance présentes', nameFr: 'Données de maintenance présentes', nameEn: 'Maintenance data present', group: 'information', status: 'not-checked' },
  { id: 'i3', name: 'Informations de coût intégrées', nameFr: 'Informations de coût intégrées', nameEn: 'Cost information integrated', group: 'information', status: 'not-checked' },
  { id: 'i4', name: 'Documentation liée aux éléments', nameFr: 'Documentation liée aux éléments', nameEn: 'Element-linked documentation', group: 'information', status: 'validated' },
];

const mockModels: BimModel[] = [
  {
    id: 'model-1',
    name: 'Structure principale - Hall',
    fileName: 'SNCF-GC-VDF-STR-MOD-001.rvt',
    fileType: 'RVT',
    size: 256000000,
    uploadedAt: new Date('2024-01-15'),
    metadata: {
      family: 'Structure',
      layer: 'Niveau 0',
      phase: 'AVP',
    },
    auditScore: 72,
  },
  {
    id: 'model-2',
    name: 'Architecture - Façades',
    fileName: 'SNCF-GC-VDF-ARC-MOD-002.ifc',
    fileType: 'IFC',
    size: 184000000,
    uploadedAt: new Date('2024-01-18'),
    metadata: {
      family: 'Architecture',
      layer: 'Tous niveaux',
      phase: 'PRO',
    },
    auditScore: 85,
  },
  {
    id: 'model-3',
    name: 'MEP - CVC',
    fileName: 'SNCF-GC-VDF-MEP-MOD-003.rvt',
    fileType: 'RVT',
    size: 128000000,
    uploadedAt: new Date('2024-01-20'),
    metadata: {
      family: 'MEP',
      layer: 'Technique',
      phase: 'PRO',
    },
    auditScore: 68,
  },
];

const mockAnomalies: Anomaly[] = [
  {
    id: 'anom-1',
    modelId: 'model-1',
    descriptionFr: 'Conflit entre poutre métallique et gaine de ventilation au niveau +4.50m',
    descriptionEn: 'Conflict between steel beam and ventilation duct at level +4.50m',
    severity: 'high',
    location: 'Zone Quais - Travée 12',
  },
  {
    id: 'anom-2',
    modelId: 'model-2',
    descriptionFr: 'Éléments de façade sans attribut de performance thermique',
    descriptionEn: 'Facade elements missing thermal performance attribute',
    severity: 'medium',
    location: 'Façade Nord',
  },
  {
    id: 'anom-3',
    modelId: 'model-3',
    descriptionFr: 'Chevauchement de réseaux CVC et électricité',
    descriptionEn: 'HVAC and electrical network overlap',
    severity: 'critical',
    location: 'Local technique N1',
  },
];

const mockProject: Project = {
  id: 'project-1',
  name: 'Gare de Val de Fontenay',
  client: 'SNCF Gares & Connexions',
  status: 'in-progress',
  dueDate: new Date('2024-06-30'),
  models: mockModels,
  anomalies: mockAnomalies,
  auditCriteria: mockAuditCriteria,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Theme
      theme: 'light',
      setTheme: (theme) => {
        set({ theme });
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        get().setTheme(newTheme);
      },

      // Language
      language: 'fr',
      setLanguage: (language) => set({ language }),

      // Projects
      projects: [mockProject],
      currentProjectId: 'project-1',
      setCurrentProject: (projectId) => set({ currentProjectId: projectId }),
      getCurrentProject: () => {
        const state = get();
        return state.projects.find(p => p.id === state.currentProjectId);
      },

      // Models
      addModel: (projectId, model) => set((state) => ({
        projects: state.projects.map(p =>
          p.id === projectId
            ? { ...p, models: [...p.models, model] }
            : p
        ),
      })),
      removeModel: (projectId, modelId) => set((state) => ({
        projects: state.projects.map(p =>
          p.id === projectId
            ? { ...p, models: p.models.filter(m => m.id !== modelId) }
            : p
        ),
      })),

      // Audit
      updateCriterionStatus: (projectId, criterionId, status) => set((state) => ({
        projects: state.projects.map(p =>
          p.id === projectId
            ? {
                ...p,
                auditCriteria: p.auditCriteria.map(c =>
                  c.id === criterionId ? { ...c, status } : c
                ),
              }
            : p
        ),
      })),
      calculateGroupScore: (projectId, group) => {
        const project = get().projects.find(p => p.id === projectId);
        if (!project) return 0;
        
        const groupCriteria = project.auditCriteria.filter(c => c.group === group);
        const validatedCount = groupCriteria.filter(c => c.status === 'validated').length;
        
        return Math.round((validatedCount / groupCriteria.length) * 100);
      },
      calculateGlobalScore: (projectId) => {
        const project = get().projects.find(p => p.id === projectId);
        if (!project) return 0;
        
        const validatedCount = project.auditCriteria.filter(c => c.status === 'validated').length;
        
        return Math.round((validatedCount / project.auditCriteria.length) * 100);
      },

      // Anomalies
      addAnomaly: (projectId, anomaly) => set((state) => ({
        projects: state.projects.map(p =>
          p.id === projectId
            ? { ...p, anomalies: [...p.anomalies, anomaly] }
            : p
        ),
      })),
      removeAnomaly: (projectId, anomalyId) => set((state) => ({
        projects: state.projects.map(p =>
          p.id === projectId
            ? { ...p, anomalies: p.anomalies.filter(a => a.id !== anomalyId) }
            : p
        ),
      })),
    }),
    {
      name: 'bim-audit-storage',
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
      }),
    }
  )
);
