import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    try {
      await register(form);
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <main className="container-page mt-10">
      <div className="card mx-auto max-w-md p-6">
        <h1 className="text-2xl font-black text-slate-950">Create Account</h1>
        <form onSubmit={submit} className="mt-6 grid gap-4">
          {[
            ['name', 'Name', 'text'],
            ['email', 'Email', 'email'],
            ['phone', 'Phone', 'tel'],
            ['password', 'Password', 'password']
          ].map(([key, label, type]) => (
            <label key={key} className="text-sm font-semibold">{label}<input className="input mt-1" type={type} value={form[key]} onChange={(event) => setForm((state) => ({ ...state, [key]: event.target.value }))} /></label>
          ))}
          <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Creating...' : 'Register'}</button>
        </form>
        <p className="mt-4 text-sm text-slate-600">Already registered? <Link to="/login" className="font-semibold text-primary-700">Login</Link></p>
      </div>
    </main>
  );
}
