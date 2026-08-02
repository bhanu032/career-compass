import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { useAuth } from "@/hooks/useAuth";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { extractErrorMessage } from "@/services/apiClient";
import { INDIAN_STATES, QUALIFICATIONS } from "@/utils/constants";

const schema = z.object({
  full_name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  confirm_password: z.string(),
  state: z.string().optional(),
  qualification: z.string().optional(),
}).refine((v) => v.password === v.confirm_password, {
  message: "Passwords do not match", path: ["confirm_password"],
});
type FormValues = z.infer<typeof schema>;

export function RegisterPage(): JSX.Element {
  const { t } = useTranslation();
  useDocumentTitle("Create account — DeshKiSeva");
  const { register: signUp } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues): Promise<void> {
    setError(null);
    try {
      await signUp({ full_name: values.full_name, email: values.email, password: values.password, state: values.state || undefined, qualification: values.qualification || undefined });
      navigate("/", { replace: true });
    } catch (err) {
      setError(extractErrorMessage(err, t("register.error")));
    }
  }

  return (
    <div className="container-page flex justify-center py-16">
      <div className="card w-full max-w-lg p-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t("register.title")}</h1>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{t("register.subtitle")}</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <label className="label" htmlFor="full_name">{t("register.fullName")}</label>
            <input id="full_name" className="input" {...register("full_name")} />
            {formState.errors.full_name && <p className="mt-1 text-xs text-red-600">{formState.errors.full_name.message}</p>}
          </div>
          <div>
            <label className="label" htmlFor="email">{t("register.email")}</label>
            <input id="email" type="email" className="input" autoComplete="email" {...register("email")} />
            {formState.errors.email && <p className="mt-1 text-xs text-red-600">{formState.errors.email.message}</p>}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="password">{t("register.password")}</label>
              <input id="password" type="password" className="input" autoComplete="new-password" {...register("password")} />
              {formState.errors.password && <p className="mt-1 text-xs text-red-600">{formState.errors.password.message}</p>}
            </div>
            <div>
              <label className="label" htmlFor="confirm_password">{t("register.confirmPassword")}</label>
              <input id="confirm_password" type="password" className="input" autoComplete="new-password" {...register("confirm_password")} />
              {formState.errors.confirm_password && <p className="mt-1 text-xs text-red-600">{formState.errors.confirm_password.message}</p>}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="state">{t("register.state")}</label>
              <select id="state" className="input" {...register("state")}>
                <option value="">{t("register.selectState")}</option>
                {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="qualification">{t("register.highestQual")}</label>
              <select id="qualification" className="input" {...register("qualification")}>
                <option value="">{t("register.selectQual")}</option>
                {QUALIFICATIONS.map((q) => <option key={q} value={q}>{q}</option>)}
              </select>
            </div>
          </div>
          {error && <p className="rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{error}</p>}
          <button type="submit" className="btn-primary w-full" disabled={formState.isSubmitting}>
            {formState.isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {t("register.createBtn")}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          {t("register.alreadyRegistered")}{" "}
          <Link to="/login" className="font-semibold text-brand-600 hover:underline">{t("register.signIn")}</Link>
        </p>
      </div>
    </div>
  );
}
