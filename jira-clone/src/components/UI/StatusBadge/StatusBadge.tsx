// components/UI/StatusBadge.tsx
import type { LucideIcon } from 'lucide-react';
import React from 'react';

interface StatusBadgeProps {
  status: string;
  icon?: LucideIcon;
  color?: string;
  variant?: 'default' | 'outlined' | 'filled';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  icon: Icon,
  color,
  variant = 'default'
}) => (
  <div 
    className={`status-badge status-badge-${variant}`}
    style={color ? { backgroundColor: color } : undefined}
  >
    {Icon && <Icon size={14} />}
    <span>{status}</span>
  </div>
);