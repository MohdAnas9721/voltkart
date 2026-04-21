import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage({ admin = false }) {
  const [email, setEmail] = useState(admin ? 'admin@voltkart.com' : 'customer@voltkart.com');
  const [password, setPassword] = useState(admin ? 'Admin123' : 'Customer123');
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const submit = async (event) => {
    event.preventDefault();
    try {
      const user = await login(email, password);
      if (admin && user.role !== 'admin') return toast.error('Admin role required');
      navigate(location.state?.from?.pathname || (admin ? '/admin' : '/'));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <main className="container-page mt-10">
      <div className="card mx-auto max-w-md p-6">
        <h1 className="text-2xl font-black text-slate-950">{admin ? 'Admin Login' : 'Customer Login'}</h1>
        <p className="mt-1 text-sm text-slate-500">Use the seeded credentials after running the seed script.</p>
        <form onSubmit={submit} className="mt-6 grid gap-4">
          <label className="text-sm font-semibold">Email<input className="input mt-1" type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
          <label className="text-sm font-semibold">Password<input className="input mt-1" type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
          <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Signing in...' : 'Login'}</button>
        </form>
        {!admin && (
          <div className="mt-4 text-sm text-slate-600">
            <button type="button" className="font-semibold text-primary-700">Forgot password?</button>
            <p className="mt-2">New customer? <Link to="/register" className="font-semibold text-primary-700">Create an account</Link></p>
          </div>
        )}
      </div>
    </main>
  );
}
