import React from 'react';
import {
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Zap,
  HeartPulse,
  Film,
  GraduationCap,
  Sparkles,
  Wallet,
  Briefcase,
  Building2,
  TrendingUp,
  Home,
  Gift,
  Package,
  DollarSign
} from 'lucide-react';
import { LucideProps } from 'lucide-react';
import { Category } from '@/types';

interface CategoryIconProps {
  category: Category | { id?: string; name?: string; icon?: string; color?: string } | null | undefined;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

// Map category IDs to modern Lucide icons
const categoryIconMap: Record<string, React.ComponentType<LucideProps>> = {
  // Expense categories
  'food': UtensilsCrossed,
  'transport': Car,
  'shopping': ShoppingBag,
  'bills': Zap,
  'health': HeartPulse,
  'entertainment': Film,
  'education': GraduationCap,
  'personal': Sparkles,
  'others': Package,
  
  // Income categories
  'salary': Wallet,
  'freelance': Briefcase,
  'business': Building2,
  'investment': TrendingUp,
  'rental': Home,
  'gift': Gift,
  
  // Default
  'default': DollarSign,
};

const CategoryIcon: React.FC<CategoryIconProps> = ({ category, size = 20, className = '', style }) => {
  if (!category) {
    const DefaultIcon = categoryIconMap['default'] || Package;
    return <DefaultIcon size={size} className={className} style={style} />;
  }

  // Get icon component from map, fallback to default
  const categoryId = category.id || 'default';
  const IconComponent = categoryIconMap[categoryId] || categoryIconMap['default'] || Package;
  
  return <IconComponent size={size} className={className} style={style} />;
};

export default CategoryIcon;

