import { motion } from 'framer-motion';
import { FileBox, Calendar } from 'lucide-react';
import { BimModel } from '@/stores/appStore';

interface RecentModelsProps {
  models: BimModel[];
}

export function RecentModels({ models }: RecentModelsProps) {
  const formatSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(0)} MB`;
  };

  return (
    <div className="space-y-3 flex-1 overflow-auto">
      {models.map((model, index) => (
        <motion.div
          key={model.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
        >
          <div className={`p-2 rounded-lg ${
            model.fileType === 'RVT' ? 'bg-info/10 text-info' : 'bg-accent/10 text-accent'
          }`}>
            <FileBox className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground truncate text-sm">
              {model.name}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-mono uppercase">{model.fileType}</span>
              <span>•</span>
              <span>{formatSize(model.size)}</span>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-sm font-semibold ${
              (model.auditScore || 0) >= 80 ? 'text-success' :
              (model.auditScore || 0) >= 60 ? 'text-warning' : 'text-destructive'
            }`}>
              {model.auditScore}%
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {model.uploadedAt.toLocaleDateString()}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
