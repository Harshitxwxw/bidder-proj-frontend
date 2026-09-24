import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, Mail, Lock, UserCog, AlertCircle, ChevronDown } from "lucide-react";
import { authService } from "../../services/authService";
import { CustomDropdown } from "../../components/CustomDropdown";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);



  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authService.login(formData);
      // Route based on role response or the redirect mapping
      if (response.redirect_to) {
        let route = response.redirect_to;
        if (route === "/bidder/dashboard") route = "/bidder";
        if (route === "/officer/dashboard") route = "/officer";
        if (route === "/creator/dashboard") route = "/tender";
        navigate(route, { replace: true });
      } else {
        // Fallback routing based on user role from response
        const userRole = response.user?.role;
        if (userRole === "BIDDER") navigate("/bidder", { replace: true });
        else if (userRole === "PROCUREMENT_OFFICER") navigate("/officer/tenders", { replace: true });
        else if (userRole === "TENDER_CREATOR") navigate("/tender", { replace: true });
        else navigate("/", { replace: true });
      }
    } catch (err) {
      setError(typeof err === "string" ? err : "Invalid credentials or role mismatch.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#ebf3fc] via-[#e2edfa] to-[#d6e5f7] p-4">
      <div className="w-full max-w-xl rounded-3xl border border-white/50 bg-white/70 p-8 shadow-xl backdrop-blur-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/30">
            <LogIn size={28} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome Back</h1>
          <p className="mt-2 text-sm text-slate-500">Sign in to your Tender Platform account</p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100">
            <AlertCircle size={18} className="shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Email Address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="w-full rounded-xl border border-slate-200/80 bg-white/50 py-3 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100/50"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200/80 bg-white/50 py-3 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100/50"
                />
              </div>
            </div>


          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-700 active:scale-[0.98] disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            Create one
          </button>
        </p>
      </div>
    </div>
  );
};

export { Login };
