import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, FileText, Calendar, DollarSign, MapPin, Building, ArrowLeft, Loader2, Info, ChevronDown } from "lucide-react";
import { tenderService } from "./services/tenderService";
import { authService } from "../services/authService";
import { CustomDropdown } from "../components/CustomDropdown";

const CATEGORIES = [
  "Information Technology",
  "Construction & Infrastructure",
  "Healthcare & Medical",
  "Manufacturing",
  "Energy & Utilities",
  "Education",
  "Agriculture",
  "General Services"
];

const LOCATIONS = [
  "Delhi, NCR",
  "Mumbai, MH",
  "Bangalore, KA",
  "Chennai, TN",
  "Hyderabad, TS",
  "Kolkata, WB",
  "Pune, MH",
  "Ahmedabad, GJ",
  "Pan India"
];

const STANDARD_DOCUMENTS = [
  { value: "CUSTOM", label: "Custom Document" },
  { value: "GST_CERTIFICATE", label: "GST Certificate" },
  { value: "PAN_CARD", label: "PAN Card" },
  { value: "UDYAM_REGISTRATION", label: "Udyam Registration" },
  { value: "AUDITED_FINANCIALS", label: "Audited Financials" },
  { value: "ISO_CERTIFICATE", label: "ISO Certificate" },
  { value: "ITR_RETURN", label: "ITR Return" },
];

const CreateTender = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    estimated_value: "",
    bid_deadline: "",
    requirements: [
      {
        requirement_name: "GST Certificate",
        standard_document_type: "GST_CERTIFICATE",
        mandatory: true,
        evidence_type: "DOCUMENT",
        accepted_formats: "pdf",
      }
    ]
  });

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddRequirement = () => {
    setFormData((prev) => ({
      ...prev,
      requirements: [
        ...prev.requirements,
        {
          requirement_name: "",
          standard_document_type: "CUSTOM",
          mandatory: true,
          evidence_type: "DOCUMENT",
          accepted_formats: "pdf",
        }
      ]
    }));
  };

  const handleRemoveRequirement = (index) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const handleRequirementChange = (index, field, value) => {
    const updatedReqs = [...formData.requirements];
    updatedReqs[index][field] = value;

    // Auto-fill name if standard document is selected
    if (field === "standard_document_type" && value !== "CUSTOM") {
      const docLabel = STANDARD_DOCUMENTS.find(d => d.value === value)?.label;
      if (docLabel) {
        updatedReqs[index].requirement_name = docLabel;
      }
    }

    setFormData((prev) => ({ ...prev, requirements: updatedReqs }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...formData,
        estimated_value: formData.estimated_value ? parseFloat(formData.estimated_value) : null,
        bid_deadline: formData.bid_deadline ? new Date(formData.bid_deadline).toISOString() : null,
        application_capacity: 100, // default
      };

      await tenderService.createTender(payload);
      setSuccess(true);
      setTimeout(() => {
        navigate("/tender");
      }, 2000);
    } catch (err) {
      setError(typeof err === "string" ? err : "Failed to publish tender. Make sure you are logged in as Tender Creator.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center rounded-2xl bg-white p-12 shadow-sm border border-slate-200">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
            <FileText size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Tender Published!</h2>
          <p className="mt-2 text-slate-500">Your tender is now live.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate("/tender")}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Create New Tender</h1>
              <p className="text-sm text-slate-500">Define tender details and document requirements</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100 flex items-start gap-3">
            <Info className="shrink-0 mt-0.5" size={16} />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Information */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FileText className="text-blue-500" size={20} />
              General Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold uppercase text-slate-500">Tender Title <span className="text-red-500">*</span></label>
                <input
                  required
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Supply of Industrial Lubricants"
                  className="w-full rounded-xl border border-slate-200 py-2.5 px-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold uppercase text-slate-500">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Provide detailed description..."
                  className="w-full rounded-xl border border-slate-200 py-2.5 px-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-slate-500">Category / Sector</label>
                <CustomDropdown
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  options={CATEGORIES.map(c => ({ value: c, label: c }))}
                  icon={Building}
                  placeholder="Select a sector"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-slate-500">Location</label>
                <CustomDropdown
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  options={LOCATIONS.map(l => ({ value: l, label: l }))}
                  icon={MapPin}
                  placeholder="Select a location"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-slate-500">Estimated Value (₹)</label>
                <div className="relative">
                  <DollarSign size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    name="estimated_value"
                    value={formData.estimated_value}
                    onChange={handleChange}
                    placeholder="e.g. 1500000"
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-slate-500">Bid Deadline</label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="date"
                    name="bid_deadline"
                    value={formData.bid_deadline}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Document Requirements */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <FileText className="text-indigo-500" size={20} />
                Required Documents
              </h2>
              <button
                type="button"
                onClick={handleAddRequirement}
                className="flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-100"
              >
                <Plus size={14} />
                Add Document
              </button>
            </div>

            <div className="space-y-4">
              {formData.requirements.map((req, index) => (
                <div key={index} className="group relative rounded-xl border border-slate-200 p-4 bg-slate-50/50">
                  {formData.requirements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveRequirement(index)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-4 space-y-1.5">
                      <label className="text-xs font-semibold uppercase text-slate-500">Document Type</label>
                      <div className="relative">
                        <CustomDropdown
                          value={req.standard_document_type}
                          onChange={(val) => handleRequirementChange(index, "standard_document_type", val)}
                          options={STANDARD_DOCUMENTS}
                          icon={FileText}
                          placeholder="Select Document Type"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-5 space-y-1.5">
                      <label className="text-xs font-semibold uppercase text-slate-500">Requirement Name</label>
                      <input
                        required
                        value={req.requirement_name}
                        onChange={(e) => handleRequirementChange(index, "requirement_name", e.target.value)}
                        placeholder="Name shown to bidder"
                        className="w-full rounded-lg border border-slate-200 py-2 px-3 text-sm outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="md:col-span-3 space-y-1.5 flex flex-col justify-end">
                      <label className="flex items-center gap-2 cursor-pointer h-9 px-2">
                        <input
                          type="checkbox"
                          checked={req.mandatory}
                          onChange={(e) => handleRequirementChange(index, "mandatory", e.target.checked)}
                          className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                        <span className="text-sm font-medium text-slate-700">Mandatory</span>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-700 disabled:opacity-70"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              Publish Tender
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTender;
