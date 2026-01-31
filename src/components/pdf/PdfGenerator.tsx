import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FileCheck2, Eye, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/stores/appStore';
import { ScoreRing } from '@/components/dashboard/ScoreRing';
import { PdfPreviewModal } from './PdfPreviewModal';

export function PdfGenerator() {
  const { t, i18n } = useTranslation();
  const { getCurrentProject, currentProjectId, calculateGlobalScore } = useAppStore();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const project = getCurrentProject();
  const globalScore = currentProjectId ? calculateGlobalScore(currentProjectId) : 0;

  if (!project) return null;

  return (
    <>
      <div className="glass-card p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 rounded-xl bg-primary/10">
            <FileCheck2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{t('pdf.preview')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('pdf.previewDescription')}
            </p>
          </div>
        </div>

        {/* Preview Card */}
        <motion.div
          className="border border-border rounded-xl p-6 mb-6 bg-secondary/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-semibold text-foreground">{project.name}</h4>
              <p className="text-sm text-muted-foreground">{project.client}</p>
            </div>
            <ScoreRing score={globalScore} size={80} strokeWidth={6} />
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 rounded-lg bg-background/50">
              <p className="text-2xl font-bold text-foreground">{project.models.length}</p>
              <p className="text-xs text-muted-foreground">{t('models.title')}</p>
            </div>
            <div className="p-3 rounded-lg bg-background/50">
              <p className="text-2xl font-bold text-foreground">{project.auditCriteria.length}</p>
              <p className="text-xs text-muted-foreground">{t('audit.checklist')}</p>
            </div>
            <div className="p-3 rounded-lg bg-background/50">
              <p className="text-2xl font-bold text-foreground">{project.anomalies.length}</p>
              <p className="text-xs text-muted-foreground">{t('anomalies.title')}</p>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <Button
          onClick={() => setIsPreviewOpen(true)}
          className="w-full gradient-button"
        >
          <Eye className="h-4 w-4 mr-2" />
          {i18n.language === 'fr' ? 'Prévisualiser et télécharger' : 'Preview and download'}
        </Button>
      </div>

      {/* PDF Preview Modal */}
      <PdfPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        project={project}
        globalScore={globalScore}
      />
    </>
  );
}
