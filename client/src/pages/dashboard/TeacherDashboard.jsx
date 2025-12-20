import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentService, authService } from "../../api/services";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/Button";
import { ChatBox } from "../../components/ui/ChatBox";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { Check, X, MessageSquare, Settings, Filter, Calendar } from "lucide-react";
import toast from "react-hot-toast";

export const TeacherDashboard = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeChat, setActiveChat] = useState(null);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [passwords, setPasswords] = useState({ old: "", new: "" });
  const [filter, setFilter] = useState("all"); // 'all' | 'pending' | 'approved'

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ["teacher-appointments"],
    queryFn: async () => (await appointmentService.getAll()).data?.data || [],
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }) => await appointmentService.updateStatus(id, status),
    onSuccess: () => {
      toast.success("Status Updated!");
      queryClient.invalidateQueries(["teacher-appointments"]);
    },
    onError: () => toast.error("Failed to update status"),
  });

  const passwordMutation = useMutation({
    mutationFn: async () => authService.changePassword({ oldPassword: passwords.old, newPassword: passwords.new }),
    onSuccess: () => {
      toast.success("Password Updated Successfully!");
      setSettingsOpen(false);
      setPasswords({ old: "", new: "" });
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to update password"),
  });

  // Filter Logic
  const filteredAppointments = appointments.filter(apt => 
    filter === "all" ? true : apt.status === filter
  );

  if (isLoading) return <div className="min-h-[60vh] flex items-center justify-center font-display font-bold text-xl animate-pulse">LOADING REQUESTS...</div>;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto font-sans">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4 border-b-2 border-black pb-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-black tracking-tighter uppercase mb-2">Faculty Panel</h1>
          <p className="text-gray-600 font-medium">Manage student requests and appointments.</p>
        </div>
        <div className="flex gap-3">
           <button 
            onClick={() => setSettingsOpen(true)} 
            className="h-12 w-12 flex items-center justify-center border-2 border-black bg-white hover:bg-gray-100 shadow-neo-sm transition-all"
            title="Settings"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {['all', 'pending', 'approved'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-6 py-2 font-bold text-sm uppercase border-2 border-black transition-all ${
              filter === status 
              ? "bg-black text-white shadow-neo-sm" 
              : "bg-white text-gray-500 hover:bg-gray-100"
            }`}
          >
            {status} ({appointments.filter(a => status === 'all' ? true : a.status === status).length})
          </button>
        ))}
      </div>

      {/* REQUESTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAppointments.length === 0 ? (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-300 rounded-sm bg-gray-50">
            <Filter className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-400">NO REQUESTS FOUND</h3>
          </div>
        ) : (
          filteredAppointments.map((apt) => (
            <div key={apt._id} className="bg-white border-2 border-black shadow-neo flex flex-col justify-between h-full hover:-translate-y-1 transition-transform relative">
              
              {/* Status Banner */}
              <div className={`absolute top-4 right-4 px-2 py-1 text-[10px] font-black uppercase border border-black tracking-wide ${
                  apt.status === "approved" ? "bg-neo-accent text-black" : 
                  apt.status === "pending" ? "bg-yellow-300 text-black" : "bg-red-500 text-white"
                }`}>
                  {apt.status}
              </div>

              <div className="p-6">
                 <div className="mb-4">
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Student</p>
                   <h3 className="font-display font-bold text-xl leading-tight mb-1">{apt.studentId?.name || "Unknown"}</h3>
                   <p className="text-xs font-medium text-gray-500 font-mono">{apt.studentId?.email}</p>
                 </div>

                 <div className="mb-4">
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Details</p>
                   <div className="font-bold text-sm mb-2">
                      {new Date(apt.startTime).toLocaleDateString()} • {new Date(apt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                   </div>
                   <div className="p-3 bg-gray-50 border-l-2 border-black text-sm text-gray-700 italic">
                     "{apt.purpose}"
                   </div>
                 </div>
              </div>

              <div className="p-4 bg-gray-50 border-t-2 border-gray-100">
                {apt.status === "pending" && (
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      className="bg-green-500 hover:bg-green-600 border-green-700 text-white text-xs h-10 flex items-center justify-center gap-2 shadow-sm" 
                      onClick={() => statusMutation.mutate({ id: apt._id, status: "approved" })}
                    >
                      <Check size={16} strokeWidth={3} /> APPROVE
                    </Button>
                    <Button 
                      className="bg-white hover:bg-red-50 text-red-500 border-red-200 text-xs h-10 flex items-center justify-center gap-2" 
                      onClick={() => statusMutation.mutate({ id: apt._id, status: "cancelled" })}
                    >
                      <X size={16} /> REJECT
                    </Button>
                  </div>
                )}

                {apt.status === "approved" && (
                  <Button 
                    onClick={() => setActiveChat(apt._id)} 
                    variant="secondary" 
                    className="w-full text-xs h-10 flex items-center justify-center gap-2 bg-neo-main border-black hover:bg-black hover:text-white transition-colors"
                  >
                    <MessageSquare size={16} /> OPEN LIVE CHAT
                  </Button>
                )}
                
                {apt.status === "cancelled" && (
                   <div className="text-center text-xs font-bold text-gray-400 py-2">REQUEST REJECTED</div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={isSettingsOpen} onClose={() => setSettingsOpen(false)} title="Security Settings">
        <div className="space-y-4">
          <Input label="Current Password" type="password" value={passwords.old} onChange={e => setPasswords({...passwords, old: e.target.value})} />
          <Input label="New Password" type="password" value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})} />
          <Button className="w-full mt-2" onClick={() => passwordMutation.mutate()} disabled={!passwords.old || !passwords.new || passwordMutation.isPending}>
            {passwordMutation.isPending ? "UPDATING..." : "UPDATE PASSWORD"}
          </Button>
        </div>
      </Modal>

      {activeChat && <ChatBox appointmentId={activeChat} user={user} onClose={() => setActiveChat(null)} />}
    </div>
  );
};