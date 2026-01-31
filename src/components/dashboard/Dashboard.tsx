import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  BarChart3,
  FileCheck2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileBox,
  Building2,
} from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import { BentoCard } from './BentoCard';
import { KpiCard } from './KpiCard';
import { ScoreRing } from './ScoreRing';
import { AuditChecklist } from '../audit/AuditChecklist';
import { RecentModels } from './RecentModels';
import { AnomaliesList } from '../anomalies/AnomaliesList';

export function Dashboard() {
  const { t } = useTranslation();
  const { getCurrentProject, calculateGlobalScore, currentProjectId } = useAppStore();

  const project = getCurrentProject();
  const globalScore = currentProjectId ? calculateGlobalScore(currentProjectId) : 0;

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground">{t('common.noData')}</p>
      </div>
    );
  }

  const completedAudits = project.auditCriteria.filter(c => c.status !== 'not-checked').length;
  const pendingAudits = project.auditCriteria.filter(c => c.status === 'not-checked').length;

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-foreground">
          {t('dashboard.welcome')}
        </h1>
        <p className="text-muted-foreground mt-1">{t('dashboard.subtitle')}</p>
      </motion.div>

      {/* Project Info Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 animated-border"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{project.name}</h2>
              <p className="text-muted-foreground">{project.client}</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">{t('project.status')}</p>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-info/10 text-info text-sm font-medium">
                <span className="h-2 w-2 rounded-full bg-info animate-pulse" />
                {t('project.status')}
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">{t('project.dueDate')}</p>
              <p className="font-semibold text-foreground">
                {project.dueDate.toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title={t('dashboard.averageScore')}
          value={`${globalScore}%`}
          change={5}
          icon={BarChart3}
          color="primary"
          delay={1}
        />
        <KpiCard
          title={t('dashboard.totalAudits')}
          value={project.auditCriteria.length}
          icon={FileCheck2}
          color="info"
          delay={2}
        />
        <KpiCard
          title={t('dashboard.pendingAudits')}
          value={pendingAudits}
          icon={Clock}
          color="warning"
          delay={3}
        />
        <KpiCard
          title={t('dashboard.completedAudits')}
          value={completedAudits}
          change={12}
          icon={CheckCircle2}
          color="success"
          delay={4}
        />
      </div>

      {/* Bento Grid */}
      <div className="bento-grid">
        {/* Global Score */}
        <BentoCard
          title={t('audit.globalScore')}
          subtitle={t('dashboard.auditProgress')}
          icon={BarChart3}
          delay={5}
        >
          <div className="flex-1 flex items-center justify-center">
            <ScoreRing score={globalScore} size={160} strokeWidth={12} />
          </div>
        </BentoCard>

        {/* Audit Checklist */}
        <BentoCard
          title={t('audit.checklist')}
          subtitle={t('audit.recommendations')}
          icon={FileCheck2}
          variant="large"
          delay={6}
        >
          <AuditChecklist compact />
        </BentoCard>

        {/* Recent Models */}
        <BentoCard
          title={t('dashboard.recentModels')}
          icon={FileBox}
          variant="tall"
          delay={7}
        >
          <RecentModels models={project.models} />
        </BentoCard>

        {/* Anomalies */}
        <BentoCard
          title={t('anomalies.title')}
          subtitle={`${project.anomalies.length} ${t('anomalies.detected')}`}
          icon={AlertTriangle}
          variant="wide"
          delay={8}
        >
          <AnomaliesList anomalies={project.anomalies.slice(0, 3)} compact />
        </BentoCard>
      </div>
    </div>
  );
}
