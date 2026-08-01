import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";

import { useAuth } from "@/hooks/useAuth";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { extractErrorMessage } from "@/services/apiClient";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormValues = z.infer<typeof schema>;

export function LoginPage(): JSX.Element {
  useDocumentTitle("Login — GovJobs Portal", "Sign in to bookmark jobs and track applications.");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues): Promise<void> {
    setError(null);
    try {
      await login(values.email, values.password);
      const from = (location.state as { from?: string } | null)?.from ?? "/";
      navigate(from, { replace: true });
    } catch (err) {
      setError(extractErrorMessage(err, "Unable to sign in"));
    }
  }

  return (
    <div className="container-page flex justify-center py-16">
      <div className="card w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back</h1>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">Sign in to manage your saved jobs.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" type="email" className="input" autoComplete="email" {...register("email")} />
            {formState.errors.email && <p className="mt-1 text-xs text-red-600">{formState.errors.email.message}</p>}
          </div>

          <div>
            <label className="label" htmlFor="password">Password</label>
            <input id="password" type="password" className="input" autoComplete="current-password" {...register("password")} />
            {formState.errors.password && <p className="mt-1 text-xs text-red-600">{formState.errors.password.message}</p>}
          </div>

          {error && <p className="rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{error}</p>}

          <button type="submit" className="btn-primary w-full" disabled={formState.isSubmitting}>
            {formState.isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Sign in
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          New here?{" "}
          <Link to="/register" className="font-semibold text-brand-600 hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
