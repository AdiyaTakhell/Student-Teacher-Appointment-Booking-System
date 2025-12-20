import { X } from "lucide-react";

export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white border-4 border-black shadow-neo w-full max-w-md relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b-4 border-black p-4 bg-neo-accent sticky top-0 z-10">
          <h2 className="font-display font-bold text-xl uppercase">{title}</h2>
          <button onClick={onClose} className="hover:rotate-90 transition-transform">
            <X size={24} strokeWidth={3} />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};