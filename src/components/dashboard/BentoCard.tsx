import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface BentoCardProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'large' | 'wide' | 'tall';
  delay?: number;
}

export function BentoCard({
  title,
  subtitle,
  icon: Icon,
  children,
  className = '',
  variant = 'default',
  delay = 0,
}: BentoCardProps) {
  const variantClasses = {
    default: '',
    large: 'bento-item-large',
    wide: 'bento-item-wide',
    tall: 'bento-item-tall',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1, duration: 0.5 }}
      className={`glass-card-hover p-5 flex flex-col ${variantClasses[variant]} ${className}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-foreground">{title}</h3>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">{children}</div>
    </motion.div>
  );
}
