import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, Mail, Lock, UserCog, AlertCircle, Building, FileText, CreditCard, ChevronDown } from "lucide-react";
import { authService } from "../../services/authService";
import { CustomDropdown } from "../../components/CustomDropdown";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "BIDDER", // Default role
    company_name: "",
    department: "",
    designation: "",
    gstin: "",
    pan: "",
    udyam_number: "",
    registered_address: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const roles = [
    { value: "BIDDER", label: "Bidder" },
    { value: "PROCUREMENT_OFFICER", label: "Procurement Officer" },
    { value: "TENDER_CREATOR", label: "Tender Creator" },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await authService.signup(formData);
      // Auto-redirect to login after successful signup
      navigate("/login", { replace: true, state: { message: "Account created successfully. Please login." } });
    } catch (err) {
      setError(typeof err === "string" ? err : "Failed to create account. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  const isBidder = formData.role === "BIDDER";
  const isOfficerOrCreator = formData.role === "PROCUREMENT_OFFICER" || formData.role === "TENDER_CREATOR";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#ebf3fc] via-[#e2edfa] to-[#d6e5f7] p-4 py-12">
      <div className="w-full max-w-xl rounded-3xl border border-white/50 bg-white/70 p-8 shadow-xl backdrop-blur-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/30">
            <UserPlus size={28} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create Account</h1>
          <p className="mt-2 text-sm text-slate-500">Join the Tender Verification Platform</p>
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
                Email Address <span className="text-red-500">*</span>
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
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  name="password"
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full rounded-xl border border-slate-200/80 bg-white/50 py-3 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100/50"
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Role
              </label>
              <CustomDropdown
                name="role"
                value={formData.role}
                onChange={handleChange}
                options={roles}
                icon={UserCog}
                placeholder="Select Role"
              />
            </div>

            {/* Bidder Specific Fields */}
            {isBidder && (
              <>
                <div className="space-y-1.5 mt-2">
                  <div className="h-px w-full bg-slate-200/60 mb-4" />
                  <label className="text-xs font-semibold uppercase tracking-wide text-blue-600 mb-2 block">
                    Company Details
                  </label>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Company Name</label>
                  <div className="relative">
                    <Building size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleChange}
                      placeholder="Company Name"
                      className="w-full rounded-xl border border-slate-200/80 bg-white/50 py-3 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition-all focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">GSTIN</label>
                  <div className="relative">
                    <FileText size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="gstin"
                      value={formData.gstin}
                      onChange={handleChange}
                      placeholder="22AAAAA0000A1Z5"
                      className="w-full rounded-xl border border-slate-200/80 bg-white/50 py-3 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition-all focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">PAN</label>
                  <div className="relative">
                    <CreditCard size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="pan"
                      value={formData.pan}
                      onChange={handleChange}
                      placeholder="ABCDE1234F"
                      className="w-full rounded-xl border border-slate-200/80 bg-white/50 py-3 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition-all focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Udyam Number</label>
                  <div className="relative">
                    <FileText size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="udyam_number"
                      value={formData.udyam_number}
                      onChange={handleChange}
                      placeholder="UDYAM-XX-00-0000000"
                      className="w-full rounded-xl border border-slate-200/80 bg-white/50 py-3 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition-all focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Registered Address</label>
                  <textarea
                    name="registered_address"
                    value={formData.registered_address}
                    onChange={handleChange}
                    placeholder="Enter full company address"
                    rows={2}
                    className="w-full rounded-xl border border-slate-200/80 bg-white/50 py-3 px-4 text-sm font-medium text-slate-800 outline-none transition-all focus:border-blue-500 resize-none"
                  />
                </div>
              </>
            )}

            {/* Officer Specific Fields */}
            {isOfficerOrCreator && (
              <>
                <div className="space-y-1.5 mt-2">
                  <div className="h-px w-full bg-slate-200/60 mb-4" />
                  <label className="text-xs font-semibold uppercase tracking-wide text-blue-600 mb-2 block">
                    Department Details
                  </label>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="e.g. Ministry of IT"
                    className="w-full rounded-xl border border-slate-200/80 bg-white/50 py-3 px-4 text-sm font-medium text-slate-800 outline-none transition-all focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Designation</label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    placeholder="e.g. Chief Procurement Officer"
                    className="w-full rounded-xl border border-slate-200/80 bg-white/50 py-3 px-4 text-sm font-medium text-slate-800 outline-none transition-all focus:border-blue-500"
                  />
                </div>
              </>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-700 active:scale-[0.98] disabled:opacity-70"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export { Signup };
