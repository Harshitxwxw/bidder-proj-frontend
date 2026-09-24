import { useEffect, useState } from "react";
import { authService } from "../../services/authService";
import { User, Building, MapPin, Briefcase, Mail, Loader2, KeyRound, CheckCircle2, ShieldCheck, ArrowLeft, Edit3, Save, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import WishlistPage from "../../Bidder/pages/WishlistPage";
import ApplicationsPage from "../../Bidder/pages/ApplicationsPage";
import AllottedPage from "../../Bidder/pages/AllottedPage";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      try {
        const data = await authService.getProfile();
        if (isMounted) {
          setProfileData(data);
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setError(err.message || "Failed to load profile");
          setLoading(false);
        }
      }
    };
    fetchProfile();
    return () => { isMounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center rounded-2xl bg-white p-8 shadow-sm border border-red-100 max-w-md w-full">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500 mb-4">
            <KeyRound size={28} />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Authentication Error</h2>
          <p className="mt-2 text-sm text-slate-500">{error || "Could not load profile data"}</p>
          <button 
            onClick={() => navigate(-1)} 
            className="mt-6 w-full rounded-xl bg-slate-100 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const { user, profile } = profileData;
  const isBidder = user.role === "BIDDER";
  const isCreator = user.role === "TENDER_CREATOR";
  const isOfficer = user.role === "PROCUREMENT_OFFICER";

  const handleEditClick = () => {
    setEditData({
      company_name: profile.company_name || "",
      gstin: profile.gstin || "",
      pan: profile.pan || "",
      udyam_number: profile.udyam_number || "",
      registered_address: profile.registered_address || "",
      department: profile.department || "",
      designation: profile.designation || "",
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedResponse = await authService.updateProfile(editData);
      setProfileData(updatedResponse);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert(err || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    setEditData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans">
      <div className="mx-auto max-w-4xl">
        <button 
          onClick={() => navigate(-1)} 
          className="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        {isBidder && (
          <div className="mb-6 flex space-x-1 rounded-xl bg-slate-200/50 p-1">
            {["profile", "wishlist", "applications", "allotted"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full rounded-lg py-2.5 text-sm font-semibold capitalize transition-all ${
                  activeTab === tab
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900"
                }`}
              >
                {tab === "profile" ? "My Profile" : tab === "applications" ? "My Applications" : tab}
              </button>
            ))}
          </div>
        )}

        {activeTab === "profile" && (
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600" />
          <div className="px-8 pb-8">
            <div className="relative -mt-16 mb-6 flex items-end justify-between">
              <div className="flex items-end gap-5">
                <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-slate-100 shadow-md">
                  <User size={48} className="text-slate-400" />
                </div>
                <div className="mb-2 w-full">
                  {isEditing && isBidder ? (
                    <input 
                      type="text" 
                      name="company_name" 
                      value={editData.company_name} 
                      onChange={handleChange} 
                      className="text-2xl font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-2 py-1 w-full max-w-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100" 
                    />
                  ) : (
                    <h1 className="text-2xl font-bold text-slate-900">
                      {isBidder ? profile.company_name : user.email.split('@')[0]}
                    </h1>
                  )}
                  <p className="text-sm font-medium text-slate-500 capitalize flex items-center gap-2">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    {user.role.replace('_', ' ').toLowerCase()}
                  </p>
                </div>
              </div>
              <div className="mb-2 hidden sm:flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600 border border-emerald-100 shadow-sm">
                  <CheckCircle2 size={14} /> Active Account
                </span>
                {!isEditing ? (
                  <button 
                    onClick={handleEditClick}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors"
                  >
                    <Edit3 size={14} /> Edit Profile
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setIsEditing(false)}
                      disabled={saving}
                      className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 border border-slate-200 shadow-sm hover:bg-slate-200 transition-colors"
                    >
                      <X size={14} /> Cancel
                    </button>
                    <button 
                      onClick={handleSave}
                      disabled={saving}
                      className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-1 text-xs font-bold text-white border border-blue-700 shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-70"
                    >
                      {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Core Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Account Details */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-6">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">Account Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm border border-slate-100 text-blue-500">
                      <Mail size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-400">Email Address</p>
                      <p className="text-sm font-semibold text-slate-700">{user.email}</p>
                    </div>
                  </div>
                  
                  {isBidder && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm border border-slate-100 text-indigo-500">
                        <MapPin size={18} />
                      </div>
                      <div className="w-full pr-4">
                        <p className="text-xs font-medium text-slate-400">Registered Address</p>
                        {isEditing ? (
                          <input type="text" name="registered_address" value={editData.registered_address} onChange={handleChange} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                        ) : (
                          <p className="text-sm font-semibold text-slate-700">{profile.registered_address || "Not provided"}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {(isCreator || isOfficer) && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm border border-slate-100 text-purple-500">
                        <Building size={18} />
                      </div>
                      <div className="w-full pr-4">
                        <p className="text-xs font-medium text-slate-400">Department</p>
                        {isEditing ? (
                          <input type="text" name="department" value={editData.department} onChange={handleChange} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                        ) : (
                          <p className="text-sm font-semibold text-slate-700">{profile.department}</p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {isOfficer && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm border border-slate-100 text-emerald-500">
                        <Briefcase size={18} />
                      </div>
                      <div className="w-full pr-4">
                        <p className="text-xs font-medium text-slate-400">Designation</p>
                        {isEditing ? (
                          <input type="text" name="designation" value={editData.designation} onChange={handleChange} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                        ) : (
                          <p className="text-sm font-semibold text-slate-700">{profile.designation}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Identity & Verification */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-6">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">Identity & Verification</h3>
                <div className="space-y-4">
                  {isBidder ? (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500">GSTIN</span>
                        {isEditing ? (
                          <input type="text" name="gstin" value={editData.gstin} onChange={handleChange} className="w-1/2 rounded-lg border border-slate-200 px-3 py-1 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-right" />
                        ) : (
                          <span className="text-sm font-bold text-slate-800">{profile.gstin || "N/A"}</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500">PAN</span>
                        {isEditing ? (
                          <input type="text" name="pan" value={editData.pan} onChange={handleChange} className="w-1/2 rounded-lg border border-slate-200 px-3 py-1 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-right" />
                        ) : (
                          <span className="text-sm font-bold text-slate-800">{profile.pan || "N/A"}</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500">Udyam Number</span>
                        {isEditing ? (
                          <input type="text" name="udyam_number" value={editData.udyam_number} onChange={handleChange} className="w-1/2 rounded-lg border border-slate-200 px-3 py-1 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-right" />
                        ) : (
                          <span className="text-sm font-bold text-slate-800">{profile.udyam_number || "N/A"}</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500">Bidder ID</span>
                        <span className="text-sm font-mono text-slate-800 bg-slate-200/50 px-2 py-0.5 rounded">{profile.bidder_id}</span>
                      </div>
                    </>
                  ) : isCreator ? (
                    <>
                       <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500">Creator ID</span>
                        <span className="text-sm font-mono text-slate-800 bg-slate-200/50 px-2 py-0.5 rounded">{profile.creator_id}</span>
                      </div>
                    </>
                  ) : (
                    <>
                       <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500">Officer ID</span>
                        <span className="text-sm font-mono text-slate-800 bg-slate-200/50 px-2 py-0.5 rounded">{profile.officer_id}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
        )}
        
        {isBidder && activeTab === "wishlist" && <WishlistPage hideTopbar={true} />}
        {isBidder && activeTab === "applications" && <ApplicationsPage hideTopbar={true} />}
        {isBidder && activeTab === "allotted" && <AllottedPage hideTopbar={true} />}
      </div>
    </div>
  );
}
