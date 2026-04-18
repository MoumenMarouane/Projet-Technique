import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';

export default function Login() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', form);
      const token = res.data.access_token;
      const payload = JSON.parse(atob(token.split('.')[1]));
      setAuth({ id: payload.sub, email: form.email, role: payload.role }, token);
      navigate('/dashboard');
    } catch {
      setError('Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center">
      <div className="bg-[#161b27] border border-[#2d3348] rounded-xl p-8 w-full max-w-md">
        <h1 className="text-white text-2xl font-medium mb-2">
          <span className="text-indigo-400">Gestion</span>Pro
        </h1>
        <p className="text-slate-400 text-sm mb-8">Connectez-vous à votre compte</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-slate-400 text-xs mb-1 block">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full bg-[#0f1117] border border-[#2d3348] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
              placeholder="votre@email.com"
              required
            />
          </div>
          <div>
            <label className="text-slate-400 text-xs mb-1 block">Mot de passe</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full bg-[#0f1117] border border-[#2d3348] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p className="text-slate-500 text-xs text-center mt-6">
          Pas de compte ?{' '}
          <span
            className="text-indigo-400 cursor-pointer hover:underline"
            onClick={() => navigate('/register')}
          >
            S'inscrire
          </span>
        </p>
      </div>
    </div>
  );
}