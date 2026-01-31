import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  fr: {
    translation: {
      // Navigation
      nav: {
        dashboard: 'Tableau de bord',
        projects: 'Projets',
        audits: 'Audits',
        models: 'Maquettes',
        reports: 'Rapports',
        settings: 'Paramètres',
      },
      // Common
      common: {
        save: 'Enregistrer',
        cancel: 'Annuler',
        delete: 'Supprimer',
        edit: 'Modifier',
        add: 'Ajouter',
        search: 'Rechercher',
        filter: 'Filtrer',
        export: 'Exporter',
        import: 'Importer',
        upload: 'Téléverser',
        download: 'Télécharger',
        loading: 'Chargement...',
        noData: 'Aucune donnée',
        validate: 'Valider',
        reject: 'Rejeter',
      },
      // Dashboard
      dashboard: {
        title: 'Tableau de bord',
        welcome: 'Bienvenue sur BIM Audit Intelligence',
        subtitle: 'Plateforme d\'audit intelligent pour maquettes BIM',
        averageScore: 'Score moyen',
        totalAudits: 'Audits totaux',
        pendingAudits: 'En attente',
        completedAudits: 'Terminés',
        recentModels: 'Maquettes récentes',
        auditProgress: 'Progression des audits',
        projectsOverview: 'Vue d\'ensemble des projets',
      },
      // Audit
      audit: {
        title: 'Audit de maquette',
        checklist: 'Checklist d\'audit',
        groups: {
          diffusion: 'Diffusion',
          codification: 'Codification',
          references: 'Références',
          modeling: 'Modélisation',
          information: 'Informations',
        },
        status: {
          validated: 'Validé',
          notValidated: 'Non validé',
          notChecked: 'Non contrôlé',
        },
        score: 'Score',
        globalScore: 'Score global',
        recommendations: 'Recommandations IA',
        generatePdf: 'Générer PDF',
      },
      // Models
      models: {
        title: 'Maquettes',
        upload: 'Téléverser une maquette',
        uploadDescription: 'Glissez-déposez vos fichiers RVT ou IFC ici',
        supportedFormats: 'Formats supportés: RVT, IFC',
        metadata: 'Métadonnées',
        name: 'Nom',
        family: 'Famille',
        layer: 'Calque',
        phase: 'Phase',
        lastModified: 'Dernière modification',
        size: 'Taille',
      },
      // Anomalies
      anomalies: {
        title: 'Anomalies & Conflits',
        detected: 'Anomalies détectées',
        description: 'Description',
        severity: 'Sévérité',
        location: 'Localisation',
        addImage: 'Ajouter une image',
      },
      // PDF
      pdf: {
        generating: 'Génération du rapport PDF...',
        ready: 'Rapport prêt',
        download: 'Télécharger le rapport',
        synthesis: 'Synthèse',
        recommendations: 'Recommandations',
        preview: 'Aperçu PDF',
        previewDescription: 'Prévisualisez et personnalisez votre rapport avant téléchargement',
        sections: 'Sections du rapport',
        selectSections: 'Sélectionnez les sections à inclure',
        page: 'Page',
        generatingPreview: 'Génération de l\'aperçu...',
        errorGenerating: 'Erreur lors de la génération',
      },
      // Project
      project: {
        title: 'Projet',
        name: 'Gare de Val de Fontenay',
        client: 'SNCF Gares & Connexions',
        status: 'En cours',
        dueDate: 'Échéance',
      },
    },
  },
  en: {
    translation: {
      // Navigation
      nav: {
        dashboard: 'Dashboard',
        projects: 'Projects',
        audits: 'Audits',
        models: 'Models',
        reports: 'Reports',
        settings: 'Settings',
      },
      // Common
      common: {
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        add: 'Add',
        search: 'Search',
        filter: 'Filter',
        export: 'Export',
        import: 'Import',
        upload: 'Upload',
        download: 'Download',
        loading: 'Loading...',
        noData: 'No data',
        validate: 'Validate',
        reject: 'Reject',
      },
      // Dashboard
      dashboard: {
        title: 'Dashboard',
        welcome: 'Welcome to BIM Audit Intelligence',
        subtitle: 'Intelligent audit platform for BIM models',
        averageScore: 'Average Score',
        totalAudits: 'Total Audits',
        pendingAudits: 'Pending',
        completedAudits: 'Completed',
        recentModels: 'Recent Models',
        auditProgress: 'Audit Progress',
        projectsOverview: 'Projects Overview',
      },
      // Audit
      audit: {
        title: 'Model Audit',
        checklist: 'Audit Checklist',
        groups: {
          diffusion: 'Distribution',
          codification: 'Codification',
          references: 'References',
          modeling: 'Modeling',
          information: 'Information',
        },
        status: {
          validated: 'Validated',
          notValidated: 'Not Validated',
          notChecked: 'Not Checked',
        },
        score: 'Score',
        globalScore: 'Global Score',
        recommendations: 'AI Recommendations',
        generatePdf: 'Generate PDF',
      },
      // Models
      models: {
        title: 'Models',
        upload: 'Upload a model',
        uploadDescription: 'Drag and drop your RVT or IFC files here',
        supportedFormats: 'Supported formats: RVT, IFC',
        metadata: 'Metadata',
        name: 'Name',
        family: 'Family',
        layer: 'Layer',
        phase: 'Phase',
        lastModified: 'Last Modified',
        size: 'Size',
      },
      // Anomalies
      anomalies: {
        title: 'Anomalies & Conflicts',
        detected: 'Detected Anomalies',
        description: 'Description',
        severity: 'Severity',
        location: 'Location',
        addImage: 'Add Image',
      },
      // PDF
      pdf: {
        generating: 'Generating PDF report...',
        ready: 'Report ready',
        download: 'Download report',
        synthesis: 'Synthesis',
        recommendations: 'Recommendations',
        preview: 'PDF Preview',
        previewDescription: 'Preview and customize your report before downloading',
        sections: 'Report Sections',
        selectSections: 'Select sections to include',
        page: 'Page',
        generatingPreview: 'Generating preview...',
        errorGenerating: 'Error generating PDF',
      },
      // Project
      project: {
        title: 'Project',
        name: 'Val de Fontenay Station',
        client: 'SNCF Gares & Connexions',
        status: 'In Progress',
        dueDate: 'Due Date',
      },
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr',
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
