import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { Project, AuditCriterion } from '@/stores/appStore';

// Register fonts for better typography
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiA.woff2', fontWeight: 600 },
    { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiA.woff2', fontWeight: 700 },
  ],
});

interface PdfDocumentProps {
  project: Project;
  globalScore: number;
  language: 'fr' | 'en';
  theme: 'light' | 'dark';
  sections: {
    summary: boolean;
    scores: boolean;
    criteria: boolean;
    anomalies: boolean;
    recommendations: boolean;
  };
}

const createStyles = (theme: 'light' | 'dark') => {
  const isDark = theme === 'dark';
  
  return StyleSheet.create({
    page: {
      padding: 40,
      fontFamily: 'Inter',
      backgroundColor: isDark ? '#0f172a' : '#ffffff',
      color: isDark ? '#e2e8f0' : '#1e293b',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 30,
      paddingBottom: 20,
      borderBottomWidth: 2,
      borderBottomColor: isDark ? '#334155' : '#e2e8f0',
    },
    logoContainer: {
      width: 120,
      height: 50,
      backgroundColor: '#ffffff',
      borderRadius: 8,
      padding: 8,
    },
    title: {
      fontSize: 24,
      fontWeight: 700,
      color: isDark ? '#f1f5f9' : '#0f172a',
    },
    subtitle: {
      fontSize: 12,
      color: isDark ? '#94a3b8' : '#64748b',
      marginTop: 4,
    },
    date: {
      fontSize: 10,
      color: isDark ? '#94a3b8' : '#64748b',
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 600,
      color: isDark ? '#38bdf8' : '#0284c7',
      marginTop: 20,
      marginBottom: 12,
    },
    card: {
      backgroundColor: isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(248, 250, 252, 0.9)',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(71, 85, 105, 0.5)' : 'rgba(226, 232, 240, 0.8)',
    },
    glassCard: {
      backgroundColor: isDark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(255, 255, 255, 0.8)',
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(71, 85, 105, 0.4)' : 'rgba(226, 232, 240, 0.6)',
    },
    scoreContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 20,
    },
    scoreCircle: {
      width: 120,
      height: 120,
      borderRadius: 60,
      borderWidth: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    scoreText: {
      fontSize: 32,
      fontWeight: 700,
    },
    scoreLabel: {
      fontSize: 10,
      color: isDark ? '#94a3b8' : '#64748b',
      marginTop: 4,
    },
    table: {
      marginTop: 12,
    },
    tableHeader: {
      flexDirection: 'row',
      backgroundColor: isDark ? 'rgba(51, 65, 85, 0.8)' : 'rgba(241, 245, 249, 0.9)',
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 8,
      marginBottom: 4,
    },
    tableHeaderText: {
      fontSize: 10,
      fontWeight: 600,
      color: isDark ? '#e2e8f0' : '#475569',
    },
    tableRow: {
      flexDirection: 'row',
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(226, 232, 240, 0.5)',
    },
    tableRowAlt: {
      backgroundColor: isDark ? 'rgba(30, 41, 59, 0.4)' : 'rgba(248, 250, 252, 0.6)',
    },
    tableCell: {
      fontSize: 9,
      color: isDark ? '#cbd5e1' : '#334155',
    },
    statusBadge: {
      paddingVertical: 3,
      paddingHorizontal: 8,
      borderRadius: 4,
      fontSize: 8,
      fontWeight: 600,
    },
    statusValidated: {
      backgroundColor: isDark ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.15)',
      color: '#22c55e',
    },
    statusNotValidated: {
      backgroundColor: isDark ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.15)',
      color: '#ef4444',
    },
    statusNotChecked: {
      backgroundColor: isDark ? 'rgba(251, 191, 36, 0.2)' : 'rgba(251, 191, 36, 0.15)',
      color: '#f59e0b',
    },
    anomalyCard: {
      backgroundColor: isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(254, 226, 226, 0.8)',
      borderRadius: 8,
      padding: 12,
      marginBottom: 8,
      borderLeftWidth: 4,
      borderLeftColor: '#ef4444',
    },
    severityHigh: { borderLeftColor: '#ef4444' },
    severityMedium: { borderLeftColor: '#f59e0b' },
    severityCritical: { borderLeftColor: '#dc2626' },
    severityLow: { borderLeftColor: '#22c55e' },
    anomalyTitle: {
      fontSize: 11,
      fontWeight: 600,
      color: isDark ? '#fca5a5' : '#dc2626',
      marginBottom: 4,
    },
    anomalyText: {
      fontSize: 9,
      color: isDark ? '#cbd5e1' : '#475569',
    },
    recommendationCard: {
      backgroundColor: isDark ? 'rgba(56, 189, 248, 0.1)' : 'rgba(224, 242, 254, 0.8)',
      borderRadius: 8,
      padding: 12,
      marginBottom: 8,
      borderLeftWidth: 4,
      borderLeftColor: '#0ea5e9',
    },
    recommendationText: {
      fontSize: 9,
      color: isDark ? '#7dd3fc' : '#0369a1',
    },
    footer: {
      position: 'absolute',
      bottom: 30,
      left: 40,
      right: 40,
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderTopWidth: 1,
      borderTopColor: isDark ? '#334155' : '#e2e8f0',
      paddingTop: 10,
    },
    footerText: {
      fontSize: 8,
      color: isDark ? '#64748b' : '#94a3b8',
    },
    pageNumber: {
      fontSize: 8,
      color: isDark ? '#64748b' : '#94a3b8',
    },
    summaryGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
    },
    summaryItem: {
      flex: 1,
      backgroundColor: isDark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(248, 250, 252, 0.9)',
      borderRadius: 10,
      padding: 14,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: isDark ? 'rgba(71, 85, 105, 0.4)' : 'rgba(226, 232, 240, 0.6)',
    },
    summaryValue: {
      fontSize: 20,
      fontWeight: 700,
      color: isDark ? '#f1f5f9' : '#0f172a',
    },
    summaryLabel: {
      fontSize: 9,
      color: isDark ? '#94a3b8' : '#64748b',
      marginTop: 4,
      textAlign: 'center',
    },
    groupScoreRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(226, 232, 240, 0.5)',
    },
    groupName: {
      fontSize: 11,
      fontWeight: 500,
      color: isDark ? '#e2e8f0' : '#334155',
    },
    progressBar: {
      height: 8,
      backgroundColor: isDark ? 'rgba(51, 65, 85, 0.5)' : 'rgba(226, 232, 240, 0.8)',
      borderRadius: 4,
      width: 150,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: 4,
    },
  });
};

const translations = {
  fr: {
    auditReport: 'Rapport d\'Audit BIM',
    generatedOn: 'Généré le',
    summary: 'Synthèse',
    globalScore: 'Score Global',
    models: 'Maquettes',
    criteria: 'Critères',
    anomalies: 'Anomalies',
    scoresByGroup: 'Scores par Groupe',
    detailedCriteria: 'Critères Détaillés',
    criterion: 'Critère',
    group: 'Groupe',
    status: 'Statut',
    validated: 'Validé',
    notValidated: 'Non validé',
    notChecked: 'Non contrôlé',
    anomaliesConflicts: 'Anomalies & Conflits',
    severity: 'Sévérité',
    location: 'Localisation',
    aiRecommendations: 'Recommandations IA',
    page: 'Page',
    of: 'sur',
    groups: {
      diffusion: 'Diffusion',
      codification: 'Codification',
      references: 'Références',
      modeling: 'Modélisation',
      information: 'Informations',
    },
  },
  en: {
    auditReport: 'BIM Audit Report',
    generatedOn: 'Generated on',
    summary: 'Summary',
    globalScore: 'Global Score',
    models: 'Models',
    criteria: 'Criteria',
    anomalies: 'Anomalies',
    scoresByGroup: 'Scores by Group',
    detailedCriteria: 'Detailed Criteria',
    criterion: 'Criterion',
    group: 'Group',
    status: 'Status',
    validated: 'Validated',
    notValidated: 'Not Validated',
    notChecked: 'Not Checked',
    anomaliesConflicts: 'Anomalies & Conflicts',
    severity: 'Severity',
    location: 'Location',
    aiRecommendations: 'AI Recommendations',
    page: 'Page',
    of: 'of',
    groups: {
      diffusion: 'Distribution',
      codification: 'Codification',
      references: 'References',
      modeling: 'Modeling',
      information: 'Information',
    },
  },
};

const getScoreColor = (score: number) => {
  if (score >= 80) return '#22c55e';
  if (score >= 60) return '#f59e0b';
  return '#ef4444';
};

const calculateGroupScore = (criteria: AuditCriterion[], group: string): number => {
  const groupCriteria = criteria.filter(c => c.group === group);
  const validatedCount = groupCriteria.filter(c => c.status === 'validated').length;
  return Math.round((validatedCount / groupCriteria.length) * 100);
};

export function PdfDocument({ project, globalScore, language, theme, sections }: PdfDocumentProps) {
  const styles = createStyles(theme);
  const t = translations[language];
  const groups = ['diffusion', 'codification', 'references', 'modeling', 'information'] as const;

  const getStatusText = (status: string) => {
    switch (status) {
      case 'validated': return t.validated;
      case 'not-validated': return t.notValidated;
      default: return t.notChecked;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'validated': return styles.statusValidated;
      case 'not-validated': return styles.statusNotValidated;
      default: return styles.statusNotChecked;
    }
  };

  const recommendations = project.auditCriteria
    .filter(c => c.status === 'not-validated' && (language === 'fr' ? c.aiRecommendation : c.aiRecommendationEn))
    .map(c => ({
      criterion: language === 'fr' ? c.nameFr : c.nameEn,
      recommendation: language === 'fr' ? c.aiRecommendation : c.aiRecommendationEn,
    }));

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={{ fontSize: 10, color: '#0284c7', fontWeight: 700 }}>BIM AUDIT</Text>
            <Text style={{ fontSize: 8, color: '#64748b' }}>INTELLIGENCE</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.date}>{t.generatedOn} {new Date().toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}</Text>
          </View>
        </View>

        <View style={{ alignItems: 'center', marginVertical: 40 }}>
          <Text style={styles.title}>{t.auditReport}</Text>
          <Text style={styles.subtitle}>{project.name}</Text>
          <Text style={{ ...styles.subtitle, marginTop: 8 }}>{project.client}</Text>
        </View>

        {sections.summary && (
          <>
            <Text style={styles.sectionTitle}>{t.summary}</Text>
            <View style={styles.glassCard}>
              <View style={styles.scoreContainer}>
                <View style={[styles.scoreCircle, { borderColor: getScoreColor(globalScore) }]}>
                  <Text style={[styles.scoreText, { color: getScoreColor(globalScore) }]}>{globalScore}%</Text>
                  <Text style={styles.scoreLabel}>{t.globalScore}</Text>
                </View>
              </View>
              <View style={styles.summaryGrid}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>{project.models.length}</Text>
                  <Text style={styles.summaryLabel}>{t.models}</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>{project.auditCriteria.length}</Text>
                  <Text style={styles.summaryLabel}>{t.criteria}</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>{project.anomalies.length}</Text>
                  <Text style={styles.summaryLabel}>{t.anomalies}</Text>
                </View>
              </View>
            </View>
          </>
        )}

        {sections.scores && (
          <>
            <Text style={styles.sectionTitle}>{t.scoresByGroup}</Text>
            <View style={styles.card}>
              {groups.map((group) => {
                const score = calculateGroupScore(project.auditCriteria, group);
                return (
                  <View key={group} style={styles.groupScoreRow}>
                    <Text style={styles.groupName}>{t.groups[group]}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${score}%`, backgroundColor: getScoreColor(score) }]} />
                      </View>
                      <Text style={[styles.tableCell, { width: 35, textAlign: 'right', fontWeight: 600, color: getScoreColor(score) }]}>{score}%</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>BIM Audit Intelligence - SNCF Gares & Connexions</Text>
          <Text style={styles.pageNumber}>{t.page} 1</Text>
        </View>
      </Page>

      {/* Criteria Page */}
      {sections.criteria && (
        <Page size="A4" style={styles.page}>
          <Text style={styles.sectionTitle}>{t.detailedCriteria}</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, { flex: 3 }]}>{t.criterion}</Text>
              <Text style={[styles.tableHeaderText, { flex: 1 }]}>{t.group}</Text>
              <Text style={[styles.tableHeaderText, { flex: 1 }]}>{t.status}</Text>
            </View>
            {project.auditCriteria.map((criterion, index) => (
              <View key={criterion.id} style={[styles.tableRow, index % 2 === 0 ? styles.tableRowAlt : {}]}>
                <Text style={[styles.tableCell, { flex: 3 }]}>
                  {language === 'fr' ? criterion.nameFr : criterion.nameEn}
                </Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>
                  {t.groups[criterion.group as keyof typeof t.groups]}
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.statusBadge, getStatusStyle(criterion.status)]}>
                    {getStatusText(criterion.status)}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>BIM Audit Intelligence - SNCF Gares & Connexions</Text>
            <Text style={styles.pageNumber}>{t.page} 2</Text>
          </View>
        </Page>
      )}

      {/* Anomalies Page */}
      {sections.anomalies && project.anomalies.length > 0 && (
        <Page size="A4" style={styles.page}>
          <Text style={styles.sectionTitle}>{t.anomaliesConflicts}</Text>
          {project.anomalies.map((anomaly) => (
            <View 
              key={anomaly.id} 
              style={[
                styles.anomalyCard,
                anomaly.severity === 'critical' ? styles.severityCritical :
                anomaly.severity === 'high' ? styles.severityHigh :
                anomaly.severity === 'medium' ? styles.severityMedium :
                styles.severityLow
              ]}
            >
              <Text style={styles.anomalyTitle}>
                {t.severity}: {anomaly.severity.toUpperCase()}
              </Text>
              <Text style={styles.anomalyText}>
                {language === 'fr' ? anomaly.descriptionFr : anomaly.descriptionEn}
              </Text>
              {anomaly.location && (
                <Text style={[styles.anomalyText, { marginTop: 4 }]}>
                  {t.location}: {anomaly.location}
                </Text>
              )}
            </View>
          ))}

          <View style={styles.footer}>
            <Text style={styles.footerText}>BIM Audit Intelligence - SNCF Gares & Connexions</Text>
            <Text style={styles.pageNumber}>{t.page} 3</Text>
          </View>
        </Page>
      )}

      {/* Recommendations Page */}
      {sections.recommendations && recommendations.length > 0 && (
        <Page size="A4" style={styles.page}>
          <Text style={styles.sectionTitle}>{t.aiRecommendations}</Text>
          {recommendations.map((rec, index) => (
            <View key={index} style={styles.recommendationCard}>
              <Text style={[styles.anomalyTitle, { color: theme === 'dark' ? '#7dd3fc' : '#0369a1' }]}>
                {rec.criterion}
              </Text>
              <Text style={styles.recommendationText}>{rec.recommendation}</Text>
            </View>
          ))}

          <View style={styles.footer}>
            <Text style={styles.footerText}>BIM Audit Intelligence - SNCF Gares & Connexions</Text>
            <Text style={styles.pageNumber}>{t.page} {sections.anomalies && project.anomalies.length > 0 ? 4 : 3}</Text>
          </View>
        </Page>
      )}
    </Document>
  );
}
