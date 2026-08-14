import { useState } from "react";
import { Briefcase, Check, MapPin, Sparkles, User, X, Zap } from "lucide-react";
import { getUserJobProfile, saveUserJobProfile, type UserJobProfile } from "@/utils/jobMatcher";

interface JobProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated: (profile: UserJobProfile) => void;
}

const POPULAR_ROLES = [
  "Software Engineer",
  "Data Analyst",
  "Bank PO",
  "SSC CGL Officer",
  "Graphic Designer",
  "Digital Marketer",
  "Accountant",
  "HR Specialist",
  "Civil Engineer",
  "Teacher / Educator",
];

const LOCATIONS = ["Bangalore", "Delhi NCR", "Mumbai", "Hyderabad", "Pune", "Remote", "All India"];

export function JobProfileModal({ isOpen, onClose, onProfileUpdated }: JobProfileModalProps): JSX.Element | null {
  const currentProfile = getUserJobProfile();
  const [profile, setProfile] = useState<UserJobProfile>(currentProfile);
  const [customSkill, setCustomSkill] = useState("");

  if (!isOpen) return null;

  const handleSave = () => {
    saveUserJobProfile(profile);
    onProfileUpdated(profile);
    onClose();
  };

  const handleAddSkill = (skill: string) => {
    if (!skill.trim()) return;
    if (!profile.skills.includes(skill.trim())) {
      setProfile({ ...profile, skills: [...profile.skills, skill.trim()] });
    }
    setCustomSkill("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter(s => s !== skillToRemove),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="card w-full max-w-lg overflow-hidden p-6 shadow-2xl dark:bg-[#111322]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-900/50 dark:text-violet-300">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Your Job Profile &amp; Preferences</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Personalise matching jobs &amp; recommendations</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="mt-4 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {/* Target Role */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5 text-violet-500" /> Target Job Profile / Role
            </label>
            <input
              type="text"
              value={profile.targetRole}
              onChange={e => setProfile({ ...profile, targetRole: e.target.value })}
              placeholder="e.g. Software Engineer, Bank PO, Graphic Designer"
              className="input text-sm w-full"
            />
            {/* Quick Pill options */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {POPULAR_ROLES.slice(0, 5).map(role => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setProfile({ ...profile, targetRole: role })}
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition ${
                    profile.targetRole === role
                      ? "bg-violet-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Sector & Experience Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-amber-500" /> Preferred Sector
              </label>
              <select
                value={profile.sector}
                onChange={e => setProfile({ ...profile, sector: e.target.value as any })}
                className="input text-sm w-full"
              >
                <option value="all">All (Govt &amp; Private)</option>
                <option value="govt">Government Jobs Only</option>
                <option value="private">Private Jobs Only</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-emerald-500" /> Experience Level
              </label>
              <select
                value={profile.experience}
                onChange={e => setProfile({ ...profile, experience: e.target.value })}
                className="input text-sm w-full"
              >
                <option value="Fresher">Fresher / Entry Level</option>
                <option value="1-3 yrs">1 - 3 Years</option>
                <option value="3-5 yrs">3 - 5 Years</option>
                <option value="5+ yrs">5+ Years</option>
              </select>
            </div>
          </div>

          {/* Preferred Location */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-red-500" /> Preferred Location
            </label>
            <div className="flex flex-wrap gap-1.5">
              {LOCATIONS.map(loc => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setProfile({ ...profile, location: loc })}
                  className={`rounded-xl border px-3 py-1 text-xs font-medium transition ${
                    profile.location === loc
                      ? "border-violet-600 bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-500"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Your Key Skills &amp; Qualifications
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customSkill}
                onChange={e => setCustomSkill(e.target.value)}
                onKeyDown={e => e.key === "Enter" && (e.preventDefault(), handleAddSkill(customSkill))}
                placeholder="Add skill (e.g. React, SQL, Tally, Communication)"
                className="input text-xs flex-1"
              />
              <button
                type="button"
                onClick={() => handleAddSkill(customSkill)}
                className="btn-secondary text-xs px-3 py-1.5 shrink-0"
              >
                Add
              </button>
            </div>

            {/* Added skill tags */}
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {profile.skills.map(s => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1 rounded-md bg-violet-100 text-violet-800 px-2.5 py-0.5 text-xs font-medium dark:bg-violet-900/40 dark:text-violet-300"
                >
                  {s}
                  <button type="button" onClick={() => handleRemoveSkill(s)} className="hover:text-red-500">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-200 pt-4 dark:border-slate-800">
          <button type="button" onClick={onClose} className="btn-secondary text-xs px-4 py-2">
            Cancel
          </button>
          <button type="button" onClick={handleSave} className="btn-primary text-xs px-5 py-2">
            <Check className="h-4 w-4" /> Save Profile &amp; Match Jobs
          </button>
        </div>
      </div>
    </div>
  );
}
