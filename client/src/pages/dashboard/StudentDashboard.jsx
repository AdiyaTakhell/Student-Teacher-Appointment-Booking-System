import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentService, authService } from "../../api/services";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { ChatBox } from "../../components/ui/ChatBox";
import { Input } from "../../components/ui/Input";
import { 
  Plus, Clock, MessageCircle, Settings, Calendar, User, Search
} from "lucide-react";
import toast from "react-hot-toast";

export const StudentDashboard = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // State
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [passwords, setPasswords] = useState({ old: "", new: "" });
  
  // Form State
  const [teacherId, setTeacherId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [purpose, setPurpose] = useState("");

  // Data Fetching
  const { data: appointments = [], isLoading, isError } = useQuery({
    queryKey: ["my-appointments"],
    queryFn: async () => (await appointmentService.getAll()).data?.data || [],
  });

  const { data: teachers = [] } = useQuery({
    queryKey: ["teachers-list"],
    queryFn: async () => (await authService.getTeachers()).data,
  });

  // Mutations
  const bookMutation = useMutation({
    mutationFn: async () => {
      if (!date || !time) throw new Error("Please select date and time");
      const startDateTime = new Date(`${date}T${time}`);
      const endDateTime = new Date(startDateTime.getTime() + 30 * 60000); 
      return await appointmentService.create({ teacherId, startTime: startDateTime.toISOString(), endTime: endDateTime.toISOString(), purpose });
    },
    onSuccess: () => {
      toast.success("Request Sent Successfully!");
      setModalOpen(false);
      setTeacherId(""); setDate(""); setTime(""); setPurpose(""); 
      queryClient.invalidateQueries(["my-appointments"]); 
    },
    onError: (err) => toast.error(err.response?.data?.message || "Booking Failed")
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

  const handleBook = (e) => { e.preventDefault(); bookMutation.mutate(); };

  if (isLoading) return <div className="min-h-[60vh] flex items-center justify-center font-display font-bold text-xl animate-pulse">LOADING DASHBOARD...</div>;
  if (isError) return <div className="min-h-[60vh] flex items-center justify-center font-bold text-red-500">SYSTEM ERROR: COULD NOT LOAD DATA</div>;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto font-sans">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4 border-b-2 border-black pb-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-black tracking-tighter uppercase mb-2">My Schedule</h1>
          <p className="text-gray-600 font-medium">Manage your upcoming academic appointments.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setSettingsOpen(true)} 
            className="h-12 w-12 flex items-center justify-center border-2 border-black bg-white hover:bg-gray-100 shadow-neo-sm transition-all"
            title="Settings"
          >
            <Settings size={20} />
          </button>
          <Button onClick={() => setModalOpen(true)} className="h-12 flex items-center gap-2 px-6">
            <Plus size={20} strokeWidth={3} /> BOOK SLOT
          </Button>
        </div>
      </div>

      {/* APPOINTMENTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {appointments.length === 0 ? (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-300 rounded-sm bg-gray-50">
            <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-400">NO UPCOMING APPOINTMENTS</h3>
            <p className="text-gray-400">Click "Book Slot" to schedule a meeting.</p>
          </div>
        ) : (
          appointments.map((apt) => (
            <div key={apt._id} className="group bg-white border-2 border-black shadow-neo hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between h-full relative overflow-hidden">
              
              {/* Status Banner */}
              <div className={`h-2 w-full ${
                apt.status === "approved" ? "bg-neo-accent" : 
                apt.status === "pending" ? "bg-yellow-300" : "bg-red-400"
              }`} />

              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1 block">
                      {new Date(apt.startTime).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                    <h3 className="font-display font-bold text-xl leading-tight">{apt.teacherId?.name || "Unknown"}</h3>
                    <span className="text-xs font-bold bg-gray-100 px-2 py-0.5 border border-gray-200 rounded mt-1 inline-block">
                      {apt.teacherId?.department || "General"}
                    </span>
                  </div>
                  {/* Status Badge */}
                  <div className={`px-2 py-1 text-[10px] font-black uppercase border border-black tracking-wide ${
                    apt.status === "approved" ? "bg-neo-accent text-black" : 
                    apt.status === "pending" ? "bg-yellow-300 text-black" : "bg-red-500 text-white"
                  }`}>
                    {apt.status}
                  </div>
                </div>
                
                {/* Content */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                    <Clock size={16} />
                    {new Date(apt.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                  <div className="p-3 bg-gray-50 border-l-2 border-gray-300 text-sm text-gray-600 italic">
                    "{apt.purpose}"
                  </div>
                </div>
              </div>
              
              {/* Footer Actions */}
              {apt.status === "approved" && (
                <div className="p-4 border-t-2 border-gray-100 bg-gray-50 group-hover:bg-white transition-colors">
                  <Button 
                    onClick={() => setActiveChat(apt._id)} 
                    className="w-full text-xs h-10 flex items-center justify-center gap-2 bg-black text-white hover:bg-neo-main hover:text-black hover:border-black"
                  >
                    <MessageCircle size={16}/> OPEN CHAT
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* MODALS */}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="New Appointment">
        <form onSubmit={handleBook} className="space-y-5">
          <div>
            <label className="font-bold text-xs uppercase tracking-wider mb-2 block text-gray-500">Select Professor</label>
            <div className="relative">
              <select className="w-full p-3 pl-10 border-2 border-black shadow-sm focus:outline-none focus:shadow-neo-sm bg-white font-bold appearance-none" value={teacherId} onChange={(e) => setTeacherId(e.target.value)} required>
                <option value="">-- Select Faculty --</option>
                {teachers.map((t) => <option key={t._id} value={t._id}>{t.name} ({t.department})</option>)}
              </select>
              <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input type="date" label="Date" value={date} onChange={(e) => setDate(e.target.value)} required />
            <Input type="time" label="Time" value={time} onChange={(e) => setTime(e.target.value)} required />
          </div>
          <Input label="Purpose of Meeting" placeholder="e.g. Final Project Review" value={purpose} onChange={(e) => setPurpose(e.target.value)} required />
          <Button type="submit" className="w-full mt-4 h-12" disabled={bookMutation.isPending}>
            {bookMutation.isPending ? "SENDING REQUEST..." : "CONFIRM BOOKING"}
          </Button>
        </form>
      </Modal>

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