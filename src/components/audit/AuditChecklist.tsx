import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Check, X, Minus, Lightbulb } from 'lucide-react';
import { useAppStore, AuditStatus, AuditCriterion } from '@/stores/appStore';
import { ScoreRing } from '@/components/dashboard/ScoreRing';

interface AuditChecklistProps {
  compact?: boolean;
}

const statusConfig: Record<AuditStatus, { icon: typeof Check; className: string; label: string }> = {
  validated: { icon: Check, className: 'status-validated', label: 'validated' },
  'not-validated': { icon: X, className: 'status-not-validated', label: 'notValidated' },
  'not-checked': { icon: Minus, className: 'status-not-checked', label: 'notChecked' },
};

const groupColors: Record<string, string> = {
  diffusion: 'bg-info/10 text-info border-info/30',
  codification: 'bg-accent/10 text-accent border-accent/30',
  references: 'bg-success/10 text-success border-success/30',
  modeling: 'bg-warning/10 text-warning border-warning/30',
  information: 'bg-primary/10 text-primary border-primary/30',
};

export function AuditChecklist({ compact = false }: AuditChecklistProps) {
  const { t } = useTranslation();
  const { language, getCurrentProject, currentProjectId, calculateGroupScore, updateCriterionStatus } = useAppStore();

  const project = getCurrentProject();
  if (!project) return null;

  const groups = ['diffusion', 'codification', 'references', 'modeling', 'information'] as const;
  const groupedCriteria = groups.map(group => ({
    group,
    criteria: project.auditCriteria.filter(c => c.group === group),
    score: currentProjectId ? calculateGroupScore(currentProjectId, group) : 0,
  }));

  const handleStatusChange = (criterionId: string, status: AuditStatus) => {
    if (currentProjectId) {
      updateCriterionStatus(currentProjectId, criterionId, status);
    }
  };

  const getCriterionName = (criterion: AuditCriterion) => {
    return language === 'en' ? criterion.nameEn : criterion.nameFr;
  };

  const getRecommendation = (criterion: AuditCriterion) => {
    return language === 'en' ? criterion.aiRecommendationEn : criterion.aiRecommendation;
  };

  if (compact) {
    return (
      <div className="space-y-3 flex-1 overflow-auto">
        {groupedCriteria.map(({ group, score }, index) => (
          <motion.div
            key={group}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"
          >
            <div className="flex items-center gap-3">
              <div className={`px-2 py-1 rounded text-xs font-medium border ${groupColors[group]}`}>
                {t(`audit.groups.${group}`)}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${
                    score >= 80 ? 'bg-success' : score >= 60 ? 'bg-warning' : 'bg-destructive'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                />
              </div>
              <span className={`text-sm font-semibold ${
                score >= 80 ? 'text-success' : score >= 60 ? 'text-warning' : 'text-destructive'
              }`}>
                {score}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {groupedCriteria.map(({ group, criteria, score }, groupIndex) => (
        <motion.div
          key={group}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: groupIndex * 0.1 }}
          className="glass-card p-4"
        >
          {/* Group Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`px-3 py-1.5 rounded-lg text-sm font-semibold border ${groupColors[group]}`}>
                {t(`audit.groups.${group}`)}
              </div>
              <span className="text-sm text-muted-foreground">
                {criteria.filter(c => c.status === 'validated').length}/{criteria.length}
              </span>
            </div>
            <ScoreRing score={score} size={48} strokeWidth={4} showLabel={false} />
          </div>

          {/* Criteria List */}
          <div className="space-y-2">
            {criteria.map((criterion, index) => {
              const config = statusConfig[criterion.status];
              const Icon = config.icon;
              const recommendation = getRecommendation(criterion);

              return (
                <motion.div
                  key={criterion.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: groupIndex * 0.1 + index * 0.05 }}
                  className="group"
                >
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/30 transition-colors">
                    {/* Status Buttons */}
                    <div className="flex gap-1">
                      {(['validated', 'not-validated', 'not-checked'] as AuditStatus[]).map((status) => {
                        const s = statusConfig[status];
                        const StatusIcon = s.icon;
                        const isActive = criterion.status === status;
                        return (
                          <button
                            key={status}
                            onClick={() => handleStatusChange(criterion.id, status)}
                            className={`p-1.5 rounded-md transition-all ${
                              isActive ? s.className : 'text-muted-foreground/50 hover:text-muted-foreground'
                            }`}
                          >
                            <StatusIcon className="h-4 w-4" />
                          </button>
                        );
                      })}
                    </div>

                    {/* Criterion Name */}
                    <span className="flex-1 text-sm text-foreground">
                      {getCriterionName(criterion)}
                    </span>

                    {/* Status Badge */}
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${config.className}`}>
                      {t(`audit.status.${config.label}`)}
                    </span>
                  </div>

                  {/* AI Recommendation */}
                  {recommendation && criterion.status === 'not-validated' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="ml-12 mr-4 mb-2 p-3 rounded-lg bg-warning/5 border border-warning/20"
                    >
                      <div className="flex items-start gap-2">
                        <Lightbulb className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-muted-foreground">{recommendation}</p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
