import React from 'react';
import { Plus } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="
        fixed bottom-32 right-4 md:bottom-6 md:right-6
        w-14 h-14
        bg-primary-600 hover:bg-primary-700
        text-white rounded-full
        shadow-lg hover:shadow-xl
        flex items-center justify-center
        transition-all duration-200
        z-50
        hover:scale-105
        active:scale-95
        mb-safe
      "
      aria-label="Add expense"
    >
      <Plus className="w-6 h-6" />
    </button>
  );
};

export default FloatingActionButton;
