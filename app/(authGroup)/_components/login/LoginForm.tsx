"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useActionState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { loginActions } from "../../_actions/authActions";

type LoginFormValues = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  // defaultValues: {
  //   email: "mdriaz191051@gmail.com",
  //   password: "sUNPaZKVtr",
  // },
  // instructor default values
  // defaultValues: {
  //   email: "akash@orba-aise.com",
  //   password: "EL6WgeZNmX",
  // },

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "superadmin@university.edu",
      password: "SuperAdmin@123",
    },
  });

  const [state, formAction, loading] = useActionState(loginActions, null);
  const [isPending, startTransition] = useTransition();

  const isSubmitting = loading || isPending;

  const onSubmit = (data: LoginFormValues) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    startTransition(() => {
      formAction(formData);
    });
  };

  useEffect(() => {
    if (!state) return;

    if (state.success) {
      toast.success(state.message || "Login successful");
    } else {
      toast.error(state.message || "Something went wrong");
    }
  }, [state]);

  return (
    <div className="relative z-10 w-full max-w-md bg-[#12243a]/90 border border-blue-200/15 rounded-3xl p-8 shadow-2xl shadow-blue-950/30 backdrop-blur-xl flex flex-col justify-between overflow-hidden text-slate-100 font-sans">
      {/* Background Accent Glow */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content */}
      <div className="w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-slate-50 mb-2">
            Welcome back
          </h2>
          <p className="text-xs text-slate-400 max-w-[280px] mx-auto leading-relaxed">
            Enter your credentials to access your account and workspace
          </p>
        </div>

        {/* Social Authentication */}
        <div className="flex gap-3 mb-6">
          <button
            type="button"
            disabled={isSubmitting}
            className="flex-1 flex items-center justify-center gap-2 border border-blue-200/15 rounded-full py-2.5 px-4 bg-blue-950/30 hover:bg-blue-900/40 hover:border-blue-200/30 transition text-sm font-medium text-slate-200 disabled:opacity-50"
          >
            <GoogleIcon className="w-4 h-4" />
            <span>Google</span>
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            className="flex-1 flex items-center justify-center gap-2 border border-blue-200/15 rounded-full py-2.5 px-4 bg-blue-950/30 hover:bg-blue-900/40 hover:border-blue-200/30 transition text-sm font-medium text-slate-200 disabled:opacity-50"
          >
            <AppleIcon className="w-4 h-4 fill-white" />
            <span>Apple</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center mb-6">
          <div className="w-full border-t border-blue-200/15" />
          <span className="absolute bg-[#12243a] px-3 text-xs text-slate-500">
            Or continue with
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 pl-1">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                disabled={isSubmitting}
                placeholder="name@example.com"
                className="w-full rounded-full bg-blue-950/35 border border-blue-200/15 pl-10 pr-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-400/60 focus:ring-1 focus:ring-sky-400/40 disabled:opacity-50 transition"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email address",
                  },
                })}
              />
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            </div>
            {errors.email && (
              <p className="text-xs text-red-400 pl-2">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 pl-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                disabled={isSubmitting}
                placeholder="••••••••"
                className="w-full rounded-full bg-blue-950/35 border border-blue-200/15 pl-10 pr-11 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-400/60 focus:ring-1 focus:ring-sky-400/40 disabled:opacity-50 transition"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must contain at least 6 characters",
                  },
                })}
              />
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-400 pl-2">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-sky-400 py-3 font-semibold text-blue-950 hover:bg-sky-300 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition mt-3 shadow-md shadow-sky-950/30"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.11 0-5.74-2.1-6.68-4.93H1.21v3.15C3.2 21.3 7.32 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.32 14.27c-.24-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.21C.44 8.11 0 9.99 0 12s.44 3.89 1.21 5.42l4.11-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.32 0 3.2 2.7 1.21 6.58l4.11 3.15c.94-2.83 3.57-4.98 6.68-4.98z"
      />
    </svg>
  );
}

function AppleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 170 170" {...props}>
      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.81.13-9.69-1.93-14.65-6.18-3.26-2.8-7.14-7.58-11.64-14.34-6.18-9.3-10.98-19.78-14.4-31.42-3.41-11.65-5.12-22.75-5.12-33.32 0-14.12 3.47-25.96 10.4-35.53 6.94-9.56 15.82-14.4 26.65-14.51 5.37 0 10.85 1.34 16.45 4.02 5.6 2.68 9.53 4.07 11.78 4.17 2.01 0 6.05-1.46 12.13-4.38 6.08-2.93 11.45-4.22 16.12-3.87 11.85.94 21.05 5.43 27.6 13.47-10.5 6.37-15.63 15.22-15.38 26.54.25 8.92 3.63 16.48 10.14 22.68 6.51 6.2 14.35 9.77 23.51 10.71-2.45 7.27-5.69 14.34-9.71 21.21zm-28.71-105.7c0 6.6-2.47 12.87-7.41 17.81-4.94 4.94-11.07 7.72-18.4 8.35-.13-1.01-.19-1.9-.19-2.67 0-6.47 2.58-12.79 7.74-17.94 5.16-5.16 11.45-8 18.88-8.52.06.94.12 1.93.12 2.97z" />
    </svg>
  );
}
