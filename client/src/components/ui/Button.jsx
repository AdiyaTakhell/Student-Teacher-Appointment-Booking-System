export const Button = ({ children, onClick, type = "button", className = "", disabled }) => (
  <button 
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`bg-neo-main hover:bg-violet-400 text-black font-bold px-6 py-3 border-2 border-black shadow-neo transition-all active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
  >
    {children}
  </button>
);