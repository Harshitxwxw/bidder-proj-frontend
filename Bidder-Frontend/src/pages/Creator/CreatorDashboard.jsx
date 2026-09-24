import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";

const CreatorDashboard = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Tender Creator Dashboard</h1>
            <p className="text-sm text-slate-500">Welcome back, {user?.email || "Creator"}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

        <div className="rounded-xl bg-blue-50 p-6 border border-blue-100 text-center">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">Tender Creation Portal</h2>
          <p className="text-blue-600 text-sm">
            This module is currently under development. You will soon be able to draft, publish, and manage tenders here.
          </p>
        </div>
      </div>
    </div>
  );
};

export { CreatorDashboard };
