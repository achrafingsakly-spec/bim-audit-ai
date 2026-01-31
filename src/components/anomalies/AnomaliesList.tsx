import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { AlertTriangle, AlertCircle, AlertOctagon, Info, MapPin } from 'lucide-react';
import { Anomaly } from '@/stores/appStore';

interface AnomaliesListProps {
  anomalies: Anomaly[];
  compact?: boolean;
}

const severityConfig = {
  low: { icon: Info, className: 'bg-info/10 text-info border-info/30', label: 'Faible' },
  medium: { icon: AlertTriangle, className: 'bg-warning/10 text-warning border-warning/30', label: 'Moyenne' },
  high: { icon: AlertCircle, className: 'bg-destructive/10 text-destructive border-destructive/30', label: 'Élevée' },
  critical: { icon: AlertOctagon, className: 'bg-destructive/20 text-destructive border-destructive/50', label: 'Critique' },
};

export function AnomaliesList({ anomalies, compact = false }: AnomaliesListProps) {
  const { i18n } = useTranslation();
  const language = i18n.language as 'fr' | 'en';

  const getDescription = (anomaly: Anomaly) => {
    return language === 'en' ? anomaly.descriptionEn : anomaly.descriptionFr;
  };

  if (compact) {
    return (
      <div className="space-y-2 flex-1 overflow-auto">
        {anomalies.map((anomaly, index) => {
          const config = severityConfig[anomaly.severity];
          const Icon = config.icon;
          
          return (
            <motion.div
              key={anomaly.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
            >
              <div className={`p-1.5 rounded-lg ${config.className}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground line-clamp-2">
                  {getDescription(anomaly)}
                </p>
                {anomaly.location && (
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {anomaly.location}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {anomalies.map((anomaly, index) => {
        const config = severityConfig[anomaly.severity];
        const Icon = config.icon;
        
        return (
          <motion.div
            key={anomaly.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-4"
          >
            <div className="flex items-start gap-4">
              <div className={`p-2 rounded-xl ${config.className}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium border ${config.className}`}>
                    {config.label}
                  </span>
                  {anomaly.location && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {anomaly.location}
                    </span>
                  )}
                </div>
                <p className="text-foreground">{getDescription(anomaly)}</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
