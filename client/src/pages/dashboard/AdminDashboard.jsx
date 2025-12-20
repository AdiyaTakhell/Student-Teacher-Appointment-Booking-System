import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "../../api/services";
import {
  Trash2,
  CheckCircle,
  ShieldAlert,
  Settings,
  LayoutDashboard,
  Users,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

export const AdminDashboard = () => {
  const { logout, user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");

  // State for Desktop (Collapsed/Expanded)
  const [isDesktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  // State for Mobile (Hidden/Visible Overlay)
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Close mobile sidebar automatically when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- DATA FETCHING ---
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => (await adminService.getStats()).data,
  });

  const { data: teachers = [] } = useQuery({
    queryKey: ["admin-teachers"],
    queryFn: async () => (await adminService.getAllTeachers()).data,
  });

  // --- CHART DATA ---
  const pieData = [
    { name: "Students", value: stats?.users?.students || 0, color: "#4ade80" },
    { name: "Teachers", value: stats?.users?.teachers || 0, color: "#a78bfa" },
    {
      name: "Pending",
      value: stats?.users?.pendingTeachers || 0,
      color: "#fde047",
    },
  ];

  const deptCounts = teachers.reduce((acc, t) => {
    const dept = t.department || "General";
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});
  const barData = Object.keys(deptCounts).map((dept) => ({
    name: dept,
    count: deptCounts[dept],
  }));

  // --- MUTATIONS ---
  const approveMutation = useMutation({
    mutationFn: adminService.approveTeacher,
    onSuccess: () => {
      toast.success("Teacher Authorized");
      queryClient.invalidateQueries(["admin-teachers"]);
      queryClient.invalidateQueries(["admin-stats"]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: adminService.deleteTeacher,
    onSuccess: () => {
      toast.success("User Deleted");
      queryClient.invalidateQueries(["admin-teachers"]);
      queryClient.invalidateQueries(["admin-stats"]);
    },
  });

  // --- HANDLERS ---
  const toggleSidebar = () => {
    if (window.innerWidth < 768) {
      setMobileSidebarOpen(!isMobileSidebarOpen);
    } else {
      setDesktopSidebarOpen(!isDesktopSidebarOpen);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans text-black relative">
      {/* 1. MOBILE BACKDROP (Only visible on mobile when menu is open) */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* 2. RESPONSIVE SIDEBAR */}
      <aside
        className={`
          fixed md:relative z-30 h-full bg-white border-r-2 border-black flex flex-col shadow-2xl md:shadow-none transition-all duration-300 ease-in-out
          ${
            isMobileSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }
          ${isDesktopSidebarOpen ? "md:w-64" : "md:w-20"}
          w-64
        `}
      >
        {/* Brand */}
        <div className="h-16 flex items-center justify-center border-b-2 border-black bg-neo-main shrink-0">
          {isDesktopSidebarOpen || window.innerWidth < 768 ? (
            <h1 className="font-display font-black text-2xl tracking-tighter">
              ADMIN<span className="text-white drop-shadow-md">PANEL</span>
            </h1>
          ) : (
            <ShieldAlert className="text-black" size={28} />
          )}
        </div>

        {/* Menu */}
        <nav className="flex-1 py-6 px-2 space-y-2 overflow-y-auto">
          <SidebarItem
            icon={<LayoutDashboard size={20} />}
            label="Overview"
            active={activeTab === "overview"}
            onClick={() => {
              setActiveTab("overview");
              setMobileSidebarOpen(false);
            }}
            isOpen={isDesktopSidebarOpen}
          />
          <SidebarItem
            icon={<Users size={20} />}
            label="Users & Access"
            active={activeTab === "users"}
            onClick={() => {
              setActiveTab("users");
              setMobileSidebarOpen(false);
            }}
            isOpen={isDesktopSidebarOpen}
          />
          <SidebarItem
            icon={<Settings size={20} />}
            label="Settings"
            active={activeTab === "settings"}
            onClick={() => {
              setActiveTab("settings");
              setMobileSidebarOpen(false);
            }}
            isOpen={isDesktopSidebarOpen}
          />
        </nav>

        {/* User & Logout */}
        <div className="p-4 border-t-2 border-black bg-gray-50 shrink-0">
          {(isDesktopSidebarOpen || window.innerWidth < 768) && (
            <div className="mb-4 px-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Logged In As
              </p>
              <p className="font-display font-bold text-lg truncate">
                {user?.name || "Super Admin"}
              </p>
            </div>
          )}
          <button
            onClick={logout}
            className="flex items-center justify-center gap-3 bg-black text-white hover:bg-red-500 hover:border-black font-bold transition-all w-full p-3 border-2 border-transparent hover:shadow-neo-sm"
          >
            <LogOut size={18} />
            {(isDesktopSidebarOpen || window.innerWidth < 768) && (
              <span>LOGOUT</span>
            )}
          </button>
        </div>
      </aside>

      {/* 3. MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-neo-bg relative w-full">
        {/* Header */}
        <header className="h-16 bg-white border-b-2 border-black flex items-center justify-between px-4 md:px-6 shrink-0 z-10 shadow-sm">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-200 rounded-md transition active:scale-95"
          >
            {isMobileSidebarOpen ||
            (isDesktopSidebarOpen && window.innerWidth >= 768) ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500 hidden sm:inline">
              System Online
            </span>
            <span className="sm:hidden text-xs font-bold text-gray-500">
              ONLINE
            </span>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10 pb-20">
          <div className="max-w-7xl mx-auto">
            {/* VIEW: OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-display font-black uppercase mb-1">
                      Overview
                    </h2>
                    <p className="text-sm md:text-base text-gray-600 font-medium">
                      Real-time metrics.
                    </p>
                  </div>
                </div>

                {/* Stats Grid - Responsive Columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard
                    title="TOTAL USERS"
                    value={
                      (stats?.users?.students || 0) +
                      (stats?.users?.teachers || 0)
                    }
                    icon={<Users className="opacity-20" size={40} />}
                  />
                  <StatCard
                    title="STUDENTS"
                    value={stats?.users?.students || 0}
                    color="bg-green-300"
                  />
                  <StatCard
                    title="TEACHERS"
                    value={stats?.users?.teachers || 0}
                    color="bg-purple-300"
                  />
                  <StatCard
                    title="PENDING"
                    value={stats?.users?.pendingTeachers || 0}
                    color="bg-yellow-300"
                    isAlert={stats?.users?.pendingTeachers > 0}
                  />
                </div>

                {/* Charts Section - Stacks on Mobile */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <ChartCard title="User Distribution">
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.color}
                              stroke="black"
                              strokeWidth={2}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            border: "2px solid black",
                            fontWeight: "bold",
                            boxShadow: "4px 4px 0px 0px black",
                          }}
                        />
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartCard>

                  <ChartCard title="Faculty by Dept">
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={barData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 10, fontWeight: "bold" }}
                          axisLine={false}
                          interval={0}
                        />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip
                          cursor={{ fill: "#f3f4f6" }}
                          contentStyle={{
                            border: "2px solid black",
                            fontWeight: "bold",
                            boxShadow: "4px 4px 0px 0px black",
                          }}
                        />
                        <Bar
                          dataKey="count"
                          fill="#3b82f6"
                          radius={[4, 4, 0, 0]}
                          barSize={40}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartCard>
                </div>
              </div>
            )}

            {/* VIEW: USERS MANAGEMENT */}
            {activeTab === "users" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-display font-black uppercase mb-1">
                      Users
                    </h2>
                    <p className="text-sm md:text-base text-gray-600 font-medium">
                      Manage permissions.
                    </p>
                  </div>
                  {stats?.users?.pendingTeachers > 0 && (
                    <div className="bg-yellow-300 border-2 border-black px-4 py-2 font-bold text-sm shadow-neo-sm animate-bounce">
                      ⚠ {stats.users.pendingTeachers} Actions Needed
                    </div>
                  )}
                </div>

                {/* Responsive Table Container */}
                <div className="bg-white border-2 border-black shadow-neo rounded-sm w-full overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-150">
                      <thead>
                        <tr className="bg-black text-white text-xs uppercase tracking-wider">
                          <th className="p-4 font-bold">Faculty Member</th>
                          <th className="p-4 font-bold">Department</th>
                          <th className="p-4 font-bold">Status</th>
                          <th className="p-4 text-right font-bold">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {teachers.map((t) => (
                          <tr
                            key={t._id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="p-4">
                              <div className="font-bold text-gray-900">
                                {t.name}
                              </div>
                              <div className="text-xs text-gray-500 font-mono">
                                {t.email}
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="inline-block bg-gray-100 px-2 py-1 text-xs font-bold border border-gray-300 rounded whitespace-nowrap">
                                {t.department || "General"}
                              </span>
                            </td>
                            <td className="p-4">
                              {t.isApproved ? (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-black">
                                  <CheckCircle size={12} /> ACTIVE
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-black border border-yellow-300">
                                  ⚠ PENDING
                                </span>
                              )}
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex justify-end gap-2">
                                {!t.isApproved && (
                                  <button
                                    onClick={() =>
                                      approveMutation.mutate(t._id)
                                    }
                                    className="bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-3 py-1.5 border-2 border-black shadow-sm active:translate-y-0.5 transition-all"
                                  >
                                    APPROVE
                                  </button>
                                )}
                                <button
                                  onClick={() => {
                                    if (confirm("Delete user?"))
                                      deleteMutation.mutate(t._id);
                                  }}
                                  className="bg-white hover:bg-red-50 text-red-500 p-1.5 border-2 border-transparent hover:border-red-200 rounded transition-all"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {teachers.length === 0 && (
                    <div className="p-8 text-center text-gray-400 font-bold">
                      No Teachers Found.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* VIEW: SETTINGS */}
            {activeTab === "settings" && (
              <div className="flex items-center justify-center min-h-[50vh] text-center p-4">
                <div className="bg-white p-6 md:p-10 border-2 border-black shadow-neo w-full max-w-md">
                  <Settings className="mx-auto mb-4 w-12 h-12 text-gray-300" />
                  <h3 className="text-xl font-bold mb-2">
                    System Configuration
                  </h3>
                  <p className="text-gray-500 mb-6 text-sm">
                    Global settings are locked for security.
                  </p>
                  <button className="bg-gray-100 text-gray-400 font-bold py-2 px-6 border-2 border-gray-200 cursor-not-allowed w-full">
                    Advanced Settings Locked
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

// --- UI COMPONENTS ---

const SidebarItem = ({ icon, label, active, onClick, isOpen }) => {
  // Logic: On mobile, always show label. On Desktop, show only if isOpen is true.
  const showLabel = isOpen || window.innerWidth < 768;

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-3 mb-1 rounded-md transition-all duration-200 group ${
        active
          ? "bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] translate-x-1"
          : "text-gray-600 hover:bg-gray-100 hover:text-black"
      }`}
    >
      <div
        className={`${
          active ? "text-neo-main" : "text-gray-400 group-hover:text-black"
        }`}
      >
        {icon}
      </div>
      <span
        className={`font-bold text-sm tracking-wide ${
          active ? "opacity-100" : "opacity-80"
        } ${!showLabel && "hidden md:hidden"}`}
      >
        {label}
      </span>
    </button>
  );
};

const StatCard = ({ title, value, color = "bg-white", icon, isAlert }) => (
  <div
    className={`${color} border-2 border-black p-5 shadow-neo relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300`}
  >
    <div className="relative z-10">
      <h3 className="text-xs font-black uppercase tracking-widest opacity-60 mb-2">
        {title}
      </h3>
      <p
        className="text-3xl md:text-4xl font-display font-black text-gray-900 truncate"
        title={value}
      >
        {value}
      </p>
    </div>
    {icon && (
      <div className="absolute right-4 bottom-4 opacity-10 group-hover:scale-110 transition-transform">
        {icon}
      </div>
    )}
    {isAlert && (
      <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
    )}
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="bg-white border-2 border-black shadow-neo p-4 md:p-6 rounded-sm w-full">
    <div className="flex items-center justify-between mb-4 md:mb-6">
      <h3 className="font-bold text-base md:text-lg border-l-4 border-neo-main pl-3 uppercase tracking-wide">
        {title}
      </h3>
    </div>
    <div className="w-full h-62.5">{children}</div>
  </div>
);
