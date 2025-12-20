import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Changed to useNavigate
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import toast from "react-hot-toast";

export const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      toast.success("Welcome back!");
      navigate("/"); // Redirect to home after login
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-neo-bg flex items-center justify-center p-4">
      <div className="bg-white border-4 border-black shadow-neo w-full max-w-md p-8">
        <h1 className="text-4xl font-display font-bold mb-6 text-center">LOGIN</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input 
            label="Email" 
            value={formData.email} 
            onChange={e => setFormData({...formData, email: e.target.value})} 
            required
          />
          <Input 
            label="Password" 
            type="password" 
            value={formData.password} 
            onChange={e => setFormData({...formData, password: e.target.value})} 
            required
          />
          <Button type="submit" className="w-full">ENTER SYSTEM</Button>
        </form>
        <p className="mt-4 text-center font-bold">
          New here? <Link to="/register" className="text-neo-main hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
};