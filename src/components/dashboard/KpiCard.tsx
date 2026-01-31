import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  color?: 'primary' | 'success' | 'warning' | 'destructive' | 'info';
  delay?: number;
}

export function KpiCard({
  title,
  value,
  change,
  icon: Icon,
  color = 'primary',
  delay = 0,
}: KpiCardProps) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    destructive: 'bg-destructive/10 text-destructive',
    info: 'bg-info/10 text-info',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: delay * 0.1, duration: 0.4 }}
      className="glass-card-hover p-5"
    >
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
        {change !== undefined && (
          <div
            className={`flex items-center gap-1 text-sm font-medium ${
              change >= 0 ? 'text-success' : 'text-destructive'
            }`}
          >
            {change >= 0 ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            {Math.abs(change)}%
          </div>
        )}
      </div>

      <div className="mt-4">
        <motion.p
          className="text-3xl font-bold text-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay * 0.1 + 0.2 }}
        >
          {value}
        </motion.p>
        <p className="text-sm text-muted-foreground mt-1">{title}</p>
      </div>
    </motion.div>
  );
}
