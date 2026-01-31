import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FileCheck2, Download, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/stores/appStore';
import { ScoreRing } from '@/components/dashboard/ScoreRing';

export function PdfGenerator() {
  const { t, i18n } = useTranslation();
  const { getCurrentProject, currentProjectId, calculateGlobalScore } = useAppStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const project = getCurrentProject();
  const globalScore = currentProjectId ? calculateGlobalScore(currentProjectId) : 0;

  const handleGenerate = async () => {
    setIsGenerating(true);
    setIsReady(false);

    // Simulate PDF generation
    await new Promise(resolve => setTimeout(resolve, 3000));

    setIsGenerating(false);
    setIsReady(true);
  };

  const handleDownload = () => {
    // In a real implementation, this would download the actual PDF
    const link = document.createElement('a');
    link.href = '#';
    link.download = `rapport-audit-${project?.name || 'bim'}-${new Date().toISOString().split('T')[0]}.pdf`;
    // In production, this would point to the actual file
    alert(t('pdf.download') + ' (Demo - PDF would be downloaded here)');
  };

  if (!project) return null;

  return (
    <div className="glass-card p-6">
      <div className="flex items-start gap-4 mb-6">
        <div className="p-3 rounded-xl bg-primary/10">
          <FileCheck2 className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">{t('audit.generatePdf')}</h3>
          <p className="text-sm text-muted-foreground">
            {i18n.language === 'fr' 
              ? 'Générez un rapport PDF complet avec synthèse et recommandations IA'
              : 'Generate a complete PDF report with AI synthesis and recommendations'}
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
      <div className="flex gap-3">
        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="flex-1 gradient-button"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {t('pdf.generating')}
            </>
          ) : (
            <>
              <FileCheck2 className="h-4 w-4 mr-2" />
              {t('audit.generatePdf')}
            </>
          )}
        </Button>

        {isReady && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Button onClick={handleDownload} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              {t('pdf.download')}
            </Button>
          </motion.div>
        )}
      </div>

      {isReady && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-success text-center mt-4"
        >
          ✓ {t('pdf.ready')}
        </motion.p>
      )}
    </div>
  );
}
