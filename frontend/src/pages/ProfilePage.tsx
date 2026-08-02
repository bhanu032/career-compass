import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/hooks/useAuth";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { extractErrorMessage } from "@/services/apiClient";
import { authService } from "@/services/authService";
import { INDIAN_STATES, QUALIFICATIONS } from "@/utils/constants";

interface ProfileForm { full_name: string; phone: string; state: string; qualification: string; }

export function ProfilePage(): JSX.Element {
  const { t } = useTranslation();
  useDocumentTitle("My profile — DeshKiSeva");
  const { user, updateUser } = useAuth();
  const [status, setStatus] = useState<{ type: "ok" | "error"; message: string } | null>(null);

  const { register, handleSubmit, formState } = useForm<ProfileForm>({
    defaultValues: { full_name: user?.full_name ?? "", phone: user?.phone ?? "", state: user?.state ?? "", qualification: user?.qualification ?? "" },
  });

  async function onSubmit(values: ProfileForm): Promise<void> {
    setStatus(null);
    try {
      const updated = await authService.updateProfile({ full_name: values.full_name, phone: values.phone || null, state: values.state || null, qualification: values.qualification || null });
      updateUser(updated);
      setStatus({ type: "ok", message: t("profile.savedOk") });
    } catch (err) {
      setStatus({ type: "error", message: extractErrorMessage(err, "Could not update your profile") });
    }
  }

  return (
    <div className="container-page py-10">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t("profile.title")}</h1>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_300px]">
        <form className="card space-y-4 p-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="label" htmlFor="full_name">{t("profile.fullName")}</label>
            <input id="full_name" className="input" {...register("full_name", { required: true })} />
          </div>
          <div>
            <label className="label" htmlFor="phone">{t("profile.phone")}</label>
            <input id="phone" className="input" {...register("phone")} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="state">{t("profile.state")}</label>
              <select id="state" className="input" {...register("state")}>
                <option value="">{t("profile.selectState")}</option>
                {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="qualification">{t("profile.qualification")}</label>
              <select id="qualification" className="input" {...register("qualification")}>
                <option value="">{t("profile.selectQual")}</option>
                {QUALIFICATIONS.map((q) => <option key={q} value={q}>{q}</option>)}
              </select>
            </div>
          </div>
          {status && (
            <p className={status.type === "ok" ? "rounded-xl bg-emerald-50 px-3 py-2.5 text-sm text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" : "rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300"}>
              {status.message}
            </p>
          )}
          <button type="submit" className="btn-primary" disabled={formState.isSubmitting}>
            {formState.isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {t("profile.saveChanges")}
          </button>
        </form>

        <aside className="card h-fit p-6">
          <p className="text-xs uppercase tracking-wide text-slate-400">{t("profile.signedInAs")}</p>
          <p className="mt-1 font-semibold text-slate-900 dark:text-white">{user?.email}</p>
          <p className="mt-4 text-xs uppercase tracking-wide text-slate-400">{t("profile.role")}</p>
          <p className="mt-1 capitalize text-slate-700 dark:text-slate-200">{user?.role}</p>
        </aside>
      </div>
    </div>
  );
}
