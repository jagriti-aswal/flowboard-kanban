import { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Zap,
  ArrowRight,
  Loader2,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { signup } from "../services/authService";

interface SignupPageProps {
  onSwitchToLogin: () => void;
}

export default function SignupPage({
  onSwitchToLogin,
}: SignupPageProps) {
  const { loginUser } = useAuth();
const [rememberMe, setRememberMe] =
  useState(false);
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] =
  useState("");

const [showPassword, setShowPassword] =
  useState(false);

const [isLoading, setIsLoading] =
  useState(false);

const [error, setError] =
  useState("");

const [mounted, setMounted] =
  useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

 const handleSubmit = async (
    e: React.FormEvent
    ) => {

    e.preventDefault();

    setError("");

    if (
        !name ||
        !email ||
        !password ||
        !confirmPassword
    ) {

        setError(
        "Please fill in all fields."
        );

        return;
    }

    if (
        password !== confirmPassword
    ) {

        setError(
        "Passwords do not match."
        );

        return;
    }

    setIsLoading(true);

    try {

        const data =
        await signup(
            name,
            email,
            password
        );

        loginUser(
        data.token,
        data.user
        );

    } catch {

        setError(
        "Signup failed."
        );

    } finally {

        setIsLoading(false);

    }

    };

  return (
    <div className="min-h-screen bg-[#080B14] flex items-center justify-center p-4 overflow-hidden relative">
      {/* Ambient background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-blue-600/5 blur-[80px]" />
      </div>

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      {/* Card */}
      <div
        className={`relative w-full max-w-md transition-all duration-700 ease-out ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div
          className="relative rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl shadow-2xl shadow-black/60 p-8"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
          }}
        >
          {/* Top accent line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent rounded-full" />

          {/* Logo & Branding */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Zap className="w-6 h-6 text-white fill-white" />
              </div>
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-600/20 blur-md -z-10" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              FlowBoard
            </h1>
            <p className="mt-1.5 text-sm text-slate-400">
              Create your FlowBoard account
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1 duration-300">
              <span className="mt-0.5 w-4 h-4 shrink-0 rounded-full border border-red-400/50 flex items-center justify-center text-xs font-bold">!</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300 tracking-wide uppercase">
                    Full Name
                </label>

                <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                    setName(e.target.value)
                    }
                    placeholder="Jagriti Aswal"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-indigo-500/60"
                />
            </div>
            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300 tracking-wide uppercase">
                Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors duration-200" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-indigo-500/60 focus:bg-white/[0.07] focus:ring-1 focus:ring-indigo-500/30 transition-all duration-200 hover:border-white/[0.14]"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-slate-300 tracking-wide uppercase">
                  Password
                </label>
                
              </div>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors duration-200" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-12 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-indigo-500/60 focus:bg-white/[0.07] focus:ring-1 focus:ring-indigo-500/30 transition-all duration-200 hover:border-white/[0.14]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors duration-150 focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300 tracking-wide uppercase">
                    Confirm Password
                </label>

                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) =>
                    setConfirmPassword(
                        e.target.value
                    )
                    }
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-indigo-500/60"
                />
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2.5 pt-0.5">
              <button
                type="button"
                role="checkbox"
                aria-checked={rememberMe}
                onClick={() => setRememberMe(!rememberMe)}
                className={`w-4.5 h-4.5 w-[18px] h-[18px] rounded-md border flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/40 ${
                  rememberMe
                    ? "bg-indigo-500 border-indigo-500 shadow-sm shadow-indigo-500/40"
                    : "bg-white/[0.04] border-white/[0.12] hover:border-white/[0.25]"
                }`}
              >
                {rememberMe && (
                  <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
              <span className="text-sm text-slate-400 select-none cursor-pointer" onClick={() => setRememberMe(!rememberMe)}>
                Remember me for 30 days
              </span>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full relative py-3 px-4 rounded-xl text-sm font-medium text-white flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-70 disabled:cursor-not-allowed group overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)",
                  boxShadow: isLoading ? "none" : "0 4px 24px rgba(99,102,241,0.35)",
                }}
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/[0.07]" />
            <span className="text-xs text-slate-600 tracking-widest uppercase">or</span>
            <div className="flex-1 h-px bg-white/[0.07]" />
          </div>

          {/* Sign up link */}
          <p className="text-center text-sm text-slate-500">
            Already have an account?{" "}
            <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors duration-150"
                >
                Sign In
            </button>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-700 mt-5">
          By signing in, you agree to our{" "}
          <span className="text-slate-600 hover:text-slate-500 cursor-pointer transition-colors">Terms</span>{" "}
          and{" "}
          <span className="text-slate-600 hover:text-slate-500 cursor-pointer transition-colors">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}