import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut,
  FileText,
  Eye,
  EyeOff,
  Loader2,
  Check
} from 'lucide-react';
import { pdf, BlobProvider } from '@react-pdf/renderer';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PdfDocument } from './PdfDocument';
import { useAppStore, Project } from '@/stores/appStore';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  globalScore: number;
}

interface PdfSections {
  summary: boolean;
  scores: boolean;
  criteria: boolean;
  anomalies: boolean;
  recommendations: boolean;
}

export function PdfPreviewModal({ isOpen, onClose, project, globalScore }: PdfPreviewModalProps) {
  const { t, i18n } = useTranslation();
  const { theme, language } = useAppStore();
  
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [sections, setSections] = useState<PdfSections>({
    summary: true,
    scores: true,
    criteria: true,
    anomalies: true,
    recommendations: true,
  });

  const toggleSection = (section: keyof PdfSections) => {
    setSections(prev => ({ ...prev, [section]: !prev[section] }));
    setPdfUrl(null); // Reset to regenerate
  };

  const sectionLabels = {
    summary: i18n.language === 'fr' ? 'Synthèse' : 'Summary',
    scores: i18n.language === 'fr' ? 'Scores par groupe' : 'Scores by group',
    criteria: i18n.language === 'fr' ? 'Critères détaillés' : 'Detailed criteria',
    anomalies: i18n.language === 'fr' ? 'Anomalies' : 'Anomalies',
    recommendations: i18n.language === 'fr' ? 'Recommandations IA' : 'AI Recommendations',
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const goToPrevPage = () => setPageNumber(prev => Math.max(prev - 1, 1));
  const goToNextPage = () => setPageNumber(prev => Math.min(prev + 1, numPages));

  const zoomIn = () => setScale(prev => Math.min(prev + 0.2, 2));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const blob = await pdf(
        <PdfDocument 
          project={project} 
          globalScore={globalScore} 
          language={language} 
          theme={theme}
          sections={sections}
        />
      ).toBlob();
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `rapport-audit-${project.name.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setIsGenerating(false);
    }
  };

  const pdfDocument = useMemo(() => (
    <PdfDocument 
      project={project} 
      globalScore={globalScore} 
      language={language} 
      theme={theme}
      sections={sections}
    />
  ), [project, globalScore, language, theme, sections]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-7xl h-[90vh] bg-card rounded-2xl shadow-2xl border border-border overflow-hidden flex"
        >
          {/* Sidebar - Section Toggles */}
          <div className="w-72 border-r border-border bg-secondary/30 p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  {i18n.language === 'fr' ? 'Sections du rapport' : 'Report sections'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {i18n.language === 'fr' ? 'Sélectionnez les sections' : 'Select sections to include'}
                </p>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="space-y-4">
                {(Object.keys(sections) as Array<keyof PdfSections>).map((section) => (
                  <div
                    key={section}
                    className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50"
                  >
                    <div className="flex items-center gap-3">
                      {sections[section] ? (
                        <Eye className="h-4 w-4 text-primary" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      )}
                      <Label 
                        htmlFor={section}
                        className={sections[section] ? 'text-foreground' : 'text-muted-foreground'}
                      >
                        {sectionLabels[section]}
                      </Label>
                    </div>
                    <Switch
                      id={section}
                      checked={sections[section]}
                      onCheckedChange={() => toggleSection(section)}
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="pt-4 mt-4 border-t border-border space-y-3">
              <Button 
                onClick={handleDownload} 
                disabled={isGenerating}
                className="w-full gradient-button"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t('pdf.generating')}
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    {t('pdf.download')}
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Main Preview Area */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-background/50">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-foreground">
                  {i18n.language === 'fr' ? 'Aperçu du rapport' : 'Report Preview'}
                </h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>
                    {i18n.language === 'fr' ? 'Page' : 'Page'} {pageNumber} / {numPages || '...'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Zoom Controls */}
                <div className="flex items-center gap-1 mr-4">
                  <Button variant="ghost" size="icon" onClick={zoomOut} disabled={scale <= 0.5}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground w-12 text-center">
                    {Math.round(scale * 100)}%
                  </span>
                  <Button variant="ghost" size="icon" onClick={zoomIn} disabled={scale >= 2}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>

                {/* Page Navigation */}
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={goToPrevPage} disabled={pageNumber <= 1}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={goToNextPage} disabled={pageNumber >= numPages}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                {/* Close Button */}
                <Button variant="ghost" size="icon" onClick={onClose} className="ml-2">
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* PDF Viewer */}
            <div className="flex-1 overflow-auto bg-muted/30 flex items-center justify-center p-8">
              <BlobProvider document={pdfDocument}>
                {({ blob, url, loading, error }) => {
                  if (loading) {
                    return (
                      <div className="flex flex-col items-center justify-center gap-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-muted-foreground">
                          {i18n.language === 'fr' ? 'Génération de l\'aperçu...' : 'Generating preview...'}
                        </p>
                      </div>
                    );
                  }

                  if (error) {
                    return (
                      <div className="text-destructive">
                        {i18n.language === 'fr' ? 'Erreur lors de la génération' : 'Error generating PDF'}
                      </div>
                    );
                  }

                  if (url) {
                    return (
                      <motion.div
                        key={pageNumber}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                        className="shadow-2xl rounded-lg overflow-hidden"
                        style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
                      >
                        <Document
                          file={url}
                          onLoadSuccess={onDocumentLoadSuccess}
                          loading={
                            <div className="flex items-center justify-center w-[595px] h-[842px] bg-card">
                              <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                          }
                        >
                          <Page 
                            pageNumber={pageNumber} 
                            renderTextLayer={true}
                            renderAnnotationLayer={true}
                            className="rounded-lg"
                          />
                        </Document>
                      </motion.div>
                    );
                  }

                  return null;
                }}
              </BlobProvider>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
