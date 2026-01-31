import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowLeft, FileCheck2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { AuditChecklist } from '@/components/audit/AuditChecklist';
import { PdfGenerator } from '@/components/pdf/PdfGenerator';
import { ScoreRing } from '@/components/dashboard/ScoreRing';
import { useAppStore } from '@/stores/appStore';
import { Button } from '@/components/ui/button';
import '@/lib/i18n';

const AuditPage = () => {
  const { t } = useTranslation();
  const { theme, getCurrentProject, currentProjectId, calculateGlobalScore } = useAppStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const project = getCurrentProject();
  const globalScore = currentProjectId ? calculateGlobalScore(currentProjectId) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-radial from-primary/5 via-transparent to-transparent" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-radial from-accent/5 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Header />
        <main className="container mx-auto max-w-7xl p-6">
          {/* Back button */}
          <Link to="/">
            <Button variant="ghost" size="sm" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('nav.dashboard')}
            </Button>
          </Link>

          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <FileCheck2 className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{t('audit.title')}</h1>
                <p className="text-muted-foreground">{project?.name}</p>
              </div>
            </div>
            <ScoreRing score={globalScore} size={100} strokeWidth={8} />
          </motion.div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Checklist */}
            <div className="lg:col-span-2">
              <AuditChecklist />
            </div>

            {/* PDF Generator */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <PdfGenerator />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AuditPage;
