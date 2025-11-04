import React from 'react';
import {
  Building2,
  Wallet,
  CreditCard,
  Landmark,
  PiggyBank,
  Banknote,
  TrendingUp,
  Package
} from 'lucide-react';
import { LucideProps } from 'lucide-react';

interface BankIconProps {
  accountName?: string;
  accountType?: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

// Map bank names to modern icons
const bankNameMap: Record<string, React.ComponentType<LucideProps>> = {
  // Popular Indian Banks
  'hdfc': Landmark,
  'sbi': Landmark,
  'icici': Building2,
  'axis': Building2,
  'pnb': Landmark,
  'bob': Landmark,
  'union': Landmark,
  'kotak': Landmark,
  'yes': Building2,
  'indian': Landmark,
  'central': Landmark,
  'canara': Landmark,
  'baroda': Landmark,
  'idbi': Building2,
  'federal': Landmark,
  
  // Account Types
  'savings': PiggyBank,
  'checking': Wallet,
  'credit': CreditCard,
  'cash': Banknote,
  'investment': TrendingUp,
  'other': Package,
};

// Default icon based on account type
const getDefaultIcon = (accountType?: string): React.ComponentType<LucideProps> => {
  if (!accountType) return Wallet;
  
  const typeLower = accountType.toLowerCase().replace(/[_-]/g, '');
  
  if (typeLower.includes('saving')) return PiggyBank;
  if (typeLower.includes('checking') || typeLower.includes('current')) return Wallet;
  if (typeLower.includes('credit')) return CreditCard;
  if (typeLower.includes('cash')) return Banknote;
  if (typeLower.includes('investment')) return TrendingUp;
  
  return Wallet;
};

const BankIcon: React.FC<BankIconProps> = ({ 
  accountName, 
  accountType,
  size = 20, 
  className = '', 
  style 
}) => {
  // Try to detect bank from name
  let IconComponent: React.ComponentType<LucideProps> | null = null;
  
  if (accountName) {
    const nameLower = accountName.toLowerCase();
    // Check for bank name matches
    for (const [key, Icon] of Object.entries(bankNameMap)) {
      if (nameLower.includes(key)) {
        IconComponent = Icon;
        break;
      }
    }
  }
  
  // Fallback to account type icon
  if (!IconComponent) {
    IconComponent = getDefaultIcon(accountType);
  }
  
  // If legacy emoji icon exists and is not a default emoji, we can still show it
  // But for now, we'll use the modern icon always
  
  return <IconComponent size={size} className={className} style={style} />;
};

export default BankIcon;

