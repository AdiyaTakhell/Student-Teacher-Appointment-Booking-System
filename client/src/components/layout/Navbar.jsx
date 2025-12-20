import { useAuth } from "../../context/AuthContext";
import { LogOut } from "lucide-react";

export const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="border-b-4 border-black bg-white px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <div className="text-xl font-display font-bold tracking-tighter">
        CLASS CONNECT
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex flex-col items-end">
          <span className="font-bold text-sm uppercase">{user?.name}</span>
          <span className="text-[10px] bg-neo-accent px-1 border border-black font-bold">
            {user?.role}
          </span>
        </div>
        
        <button 
          onClick={logout}
          className="bg-red-500 text-white p-2 border-2 border-black shadow-neo-sm hover:translate-y-0.5 hover:shadow-none transition-all"
        >
          <LogOut size={20} />
        </button>
      </div>
    </nav>
  );
};