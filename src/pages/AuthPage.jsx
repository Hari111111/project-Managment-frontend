import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ShieldCheck, Zap } from "lucide-react";

import PasswordInput from "../components/common/PasswordInput";
import { useAppDispatch, useAppSelector } from "../hooks/useAppHooks";
import { loginUser, setupAdmin } from "../features/auth/authSlice";

const initialLogin = { email: "", password: "" };
const initialSetup = { name: "", email: "", password: "" };

function AuthPage() {
  const [tab, setTab] = useState("login");
  const [loginForm, setLoginForm] = useState(initialLogin);
  const [setupForm, setSetupForm] = useState(initialSetup);
  const [isSetupCompleted, setIsSetupCompleted] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const checkSetupStatus = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"}/auth/setup-status`);
        const data = await response.json();
        if (data && data.success) {
          setIsSetupCompleted(data.isSetupCompleted);
          if (data.isSetupCompleted) {
            setTab("login");
          }
        }
      } catch (err) {
        console.error("Failed to fetch setup status:", err);
      }
    };
    checkSetupStatus();
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    const result = await dispatch(loginUser(loginForm));
    if (!result.error) navigate("/dashboard");
  };

  const handleSetup = async (event) => {
    event.preventDefault();
    const result = await dispatch(setupAdmin(setupForm));
    if (!result.error) navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-100/50 via-slate-50 to-white dark:from-brand-900/20 dark:via-slate-950 dark:to-slate-950 px-4 py-10 flex items-center justify-center">
      <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-[2.5rem] bg-white/60 backdrop-blur-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] dark:bg-slate-900/60 dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] md:grid-cols-[0.95fr_1.05fr] border border-white/50 dark:border-white/5 animate-fade-in">
        <div className="relative bg-gradient-to-br from-brand-600 to-brand-800 p-10 text-white md:p-14 overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-brand-400/20 blur-3xl" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-50 backdrop-blur-md shadow-sm border border-white/10">
              <Sparkles size={14} /> HAR Workspace
            </div>
            <h1 className="mt-8 text-4xl font-extrabold leading-[1.1] tracking-tight">
              Elevate your team's workflow.
            </h1>
            <p className="mt-6 text-brand-100/90 text-lg leading-relaxed font-medium">
              Real-time synchronization, role-based access control, and dynamic analytics.
            </p>
            <div className="mt-12 space-y-6">
              <div className="flex gap-4 items-start">
                <div className="mt-1 rounded-xl bg-white/10 p-2.5 backdrop-blur-md shadow-inner border border-white/10">
                  <ShieldCheck size={20} className="text-brand-50" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Secure Admin Controls</h3>
                  <p className="mt-1 text-sm text-brand-200">Manage users, orchestrate projects, and monitor organizational risks.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="mt-1 rounded-xl bg-white/10 p-2.5 backdrop-blur-md shadow-inner border border-white/10">
                  <Zap size={20} className="text-brand-50" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Streamlined Delivery</h3>
                  <p className="mt-1 text-sm text-brand-200">Focus on assigned work and execution status with zero friction.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center p-8 md:p-14 relative">
          <div className="w-full max-w-md mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Welcome back</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                Use login for existing users, or run one-time admin setup for a fresh database.
              </p>
            </div>

            <div className="mb-8 inline-flex rounded-2xl bg-slate-200/50 p-1 dark:bg-slate-800/50 backdrop-blur-md">
              <button
                className={`rounded-xl px-6 py-2.5 text-sm font-semibold transition-all ${tab === "login" ? "bg-white text-brand-700 shadow-sm dark:bg-slate-700 dark:text-white" : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"}`}
                onClick={() => setTab("login")}
                type="button"
              >
                Login
              </button>
              {!isSetupCompleted && (
                <button
                  className={`rounded-xl px-6 py-2.5 text-sm font-semibold transition-all ${tab === "setup" ? "bg-white text-brand-700 shadow-sm dark:bg-slate-700 dark:text-white" : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"}`}
                  onClick={() => setTab("setup")}
                  type="button"
                >
                  Setup Admin
                </button>
              )}
            </div>

            {error ? (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50/50 backdrop-blur-md px-4 py-3 text-sm font-medium text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300 animate-slide-up">
                {error}
              </div>
            ) : null}

            {tab === "login" ? (
              <form className="space-y-5 animate-slide-up" onSubmit={handleLogin}>
                <div>
                  <label className="label">Email Address</label>
                  <input
                    className="input"
                    type="email"
                    value={loginForm.email}
                    onChange={(event) => setLoginForm({ ...loginForm, email: event.target.value })}
                  />
                </div>
                <PasswordInput
                  label="Password"
                  value={loginForm.password}
                  onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })}
                />
                <div className="pt-2">
                  <button className="btn-primary w-full" disabled={loading} type="submit">
                    {loading ? "Authenticating..." : "Sign In"}
                  </button>
                </div>
              </form>
            ) : (
              <form className="space-y-5 animate-slide-up" onSubmit={handleSetup}>
                <div>
                  <label className="label">Full Name</label>
                  <input
                    className="input"
                    value={setupForm.name}
                    onChange={(event) => setSetupForm({ ...setupForm, name: event.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Email Address</label>
                  <input
                    className="input"
                    type="email"
                    value={setupForm.email}
                    onChange={(event) => setSetupForm({ ...setupForm, email: event.target.value })}
                  />
                </div>
                <PasswordInput
                  label="Password"
                  value={setupForm.password}
                  onChange={(event) => setSetupForm({ ...setupForm, password: event.target.value })}
                />
                <div className="pt-2">
                  <button className="btn-primary w-full" disabled={loading} type="submit">
                    {loading ? "Creating..." : "Create Administrator"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
