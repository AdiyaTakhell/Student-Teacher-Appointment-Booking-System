import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import toast from "react-hot-toast";

export const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "student", department: "" });
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      toast.success("Account created!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-neo-bg flex items-center justify-center p-4">
      <div className="bg-white border-4 border-black shadow-neo w-full max-w-md p-8">
        <h1 className="text-4xl font-display font-bold mb-6 text-center">REGISTER</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          <Input label="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
          <Input label="Password" type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
          
          <div>
            <label className="font-bold text-sm uppercase">Role</label>
            <select 
              className="w-full p-3 border-2 border-black shadow-neo-sm focus:outline-none bg-white font-medium mt-1"
              value={formData.role}
              onChange={e => setFormData({...formData, role: e.target.value})}
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          {formData.role === 'teacher' && (
            <Input label="Department" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} required />
          )}

          <Button type="submit" className="w-full mt-2">CREATE ACCOUNT</Button>
        </form>
        <p className="mt-4 text-center font-bold">
          Already have an account? <Link to="/login" className="text-neo-main hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};