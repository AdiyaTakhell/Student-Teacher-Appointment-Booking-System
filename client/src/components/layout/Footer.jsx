import { Github, Twitter, Linkedin, Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-black text-white border-t-4 border-neo-main mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-10">
        
        {/* Top Section: Brand & Links */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          
          {/* Brand */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-display font-black tracking-tighter">
              CLASS<span className="text-neo-main">CONNECT</span>
            </h2>
            <p className="text-gray-400 text-sm font-bold mt-1">
              Streamlining Academic Appointments.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex gap-4">
            <SocialLink href="https://github.com/AdiyaTakhell" icon={<Github size={20} />} />
            <SocialLink href="https://x.com/Adiyatakhell" icon={<Twitter size={20} />} />
            <SocialLink href="https://www.linkedin.com/in/takhellambam-adiya-singh/" icon={<Linkedin size={20} />} />
          </div>
        </div>

        {/* Divider */}
        <div className="h-0.5 bg-gray-800 w-full mb-8"></div>

        {/* Bottom Section: Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm font-bold text-gray-500 gap-4">
          <p>&copy; {new Date().getFullYear()} ClassConnect. All rights reserved.</p>
          
          <p className="flex items-center gap-1">
            Made  by 
            <span className="text-white">Takhellambam Adiya Singh</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

// Helper Component for Social Icons
const SocialLink = ({ href, icon }) => (
  <a 
    href={href} target="_blank"
    className="bg-gray-900 p-2 rounded border-2 border-transparent hover:border-neo-main hover:text-neo-main transition-all hover:-translate-y-1"
  >
    {icon}
  </a>
);