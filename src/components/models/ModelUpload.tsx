import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Upload, FileBox, X, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore, BimModel } from '@/stores/appStore';

export function ModelUpload() {
  const { t } = useTranslation();
  const { currentProjectId, addModel } = useAppStore();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<{ name: string; progress: number; status: 'uploading' | 'success' | 'error' }[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const simulateUpload = (file: File) => {
    const fileName = file.name;
    const isValid = fileName.endsWith('.rvt') || fileName.endsWith('.ifc') || 
                    fileName.endsWith('.RVT') || fileName.endsWith('.IFC');

    if (!isValid) {
      setUploadingFiles(prev => [...prev, { name: fileName, progress: 0, status: 'error' }]);
      return;
    }

    setUploadingFiles(prev => [...prev, { name: fileName, progress: 0, status: 'uploading' }]);

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Create model entry
        const newModel: BimModel = {
          id: `model-${Date.now()}`,
          name: fileName.replace(/\.(rvt|ifc)$/i, ''),
          fileName,
          fileType: fileName.toLowerCase().endsWith('.rvt') ? 'RVT' : 'IFC',
          size: file.size,
          uploadedAt: new Date(),
          metadata: {},
        };

        if (currentProjectId) {
          addModel(currentProjectId, newModel);
        }

        setUploadingFiles(prev =>
          prev.map(f => f.name === fileName ? { ...f, progress: 100, status: 'success' } : f)
        );

        // Remove from list after animation
        setTimeout(() => {
          setUploadingFiles(prev => prev.filter(f => f.name !== fileName));
        }, 2000);
      } else {
        setUploadingFiles(prev =>
          prev.map(f => f.name === fileName ? { ...f, progress } : f)
        );
      }
    }, 200);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    files.forEach(simulateUpload);
  }, [currentProjectId]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(simulateUpload);
    }
  };

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        animate={{
          scale: isDragging ? 1.02 : 1,
          borderColor: isDragging ? 'hsl(var(--primary))' : 'hsl(var(--border))',
        }}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          isDragging ? 'bg-primary/5 border-primary' : 'border-border hover:border-primary/50'
        }`}
      >
        <input
          type="file"
          accept=".rvt,.ifc,.RVT,.IFC"
          multiple
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <motion.div
          animate={{ y: isDragging ? -5 : 0 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="p-4 rounded-full bg-primary/10">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">{t('models.upload')}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {t('models.uploadDescription')}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {t('models.supportedFormats')}
            </p>
          </div>
          <Button variant="outline" className="mt-2">
            {t('common.upload')}
          </Button>
        </motion.div>
      </motion.div>

      {/* Upload Progress */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          {uploadingFiles.map((file) => (
            <motion.div
              key={file.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30"
            >
              <div className={`p-2 rounded-lg ${
                file.status === 'error' ? 'bg-destructive/10 text-destructive' :
                file.status === 'success' ? 'bg-success/10 text-success' :
                'bg-primary/10 text-primary'
              }`}>
                {file.status === 'error' ? <AlertCircle className="h-4 w-4" /> :
                 file.status === 'success' ? <Check className="h-4 w-4" /> :
                 <FileBox className="h-4 w-4" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                {file.status === 'uploading' && (
                  <div className="w-full h-1.5 rounded-full bg-muted mt-1 overflow-hidden">
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${file.progress}%` }}
                    />
                  </div>
                )}
                {file.status === 'error' && (
                  <p className="text-xs text-destructive mt-1">Format non supporté</p>
                )}
              </div>
              {file.status === 'uploading' && (
                <span className="text-xs text-muted-foreground">{Math.round(file.progress)}%</span>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
