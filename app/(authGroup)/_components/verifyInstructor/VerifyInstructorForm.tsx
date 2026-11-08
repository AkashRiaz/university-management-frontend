"use client";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { useForm, useWatch } from "react-hook-form";
import { GraduationCap, Mail, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import {
  resendInstructorVerificationOtpAction,
  verifyInstructorActions,
} from "../../_actions/authActions";

type VerifyInstructorFormValues = { email: string; otp: string };

export default function VerifyInstructorForm() {
  const [otpArray, setOtpArray] = useState<string[]>(new Array(6).fill(""));
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [state, formAction, loading] = useActionState(verifyInstructorActions, null);
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit, setValue, control, formState: { errors } } =
    useForm<VerifyInstructorFormValues>({ defaultValues: { email: "", otp: "" } });
  const emailValue = useWatch({ control, name: "email" });

  useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = setTimeout(() => setResendTimer((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendTimer]);

  useEffect(() => {
    if (state?.success) toast.success(state.message);
    if (state && !state.success) toast.error(state.message);
  }, [state]);

  const updateOtp = (value: string[]) => {
    setOtpArray(value);
    setValue("otp", value.join(""), { shouldValidate: true });
  };

  const handleResend = async () => {
    if (!emailValue || resendTimer > 0) return;
    const result = await resendInstructorVerificationOtpAction(emailValue);
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    updateOtp(new Array(6).fill(""));
    setResendTimer(30);
    toast.success(result.message);
  };

  const onSubmit = (data: VerifyInstructorFormValues) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("otp", data.otp);
    startTransition(() => formAction(formData));
  };

  return (
    <div className="relative z-10 flex w-full max-w-md flex-col justify-between overflow-hidden rounded-3xl border border-blue-200/15 bg-[#12243a]/90 p-8 font-sans text-slate-100 shadow-2xl shadow-blue-950/30 backdrop-blur-xl">
      <div className="mb-6 flex justify-center pt-2">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-400 text-blue-950 shadow-lg shadow-sky-950/30">
          <GraduationCap className="h-9 w-9" />
        </div>
      </div>
      <div className="mb-6 text-center">
        <h2 className="mb-2 text-2xl font-bold tracking-tight text-slate-50">Instructor Verification</h2>
        <p className="mx-auto max-w-70 text-xs leading-relaxed text-slate-400">
          Enter your instructor email and the 6-digit OTP code sent by your administrator.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label className="pl-1 text-xs font-semibold text-slate-300">Instructor Email</label>
          <div className="relative">
            <input type="email" placeholder="instructor@university.edu" className="w-full rounded-full border border-blue-200/15 bg-blue-950/35 py-3 pl-4 pr-10 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-400/60 focus:outline-none focus:ring-1 focus:ring-sky-400/40" {...register("email", { required: "Email is required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Please enter a valid email address" } })} />
            <Mail className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          </div>
          {errors.email && <p className="pl-2 text-xs text-red-400">{errors.email.message}</p>}
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between px-1">
            <label className="text-xs font-semibold text-slate-300">6-Digit OTP Code</label>
            <button type="button" onClick={handleResend} disabled={resendTimer > 0 || !emailValue} className="flex items-center gap-1 text-xs text-slate-400 transition hover:text-slate-100 disabled:opacity-40">
              <RotateCcw className="h-3 w-3" />{resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Code"}
            </button>
          </div>
          <input type="hidden" {...register("otp", { required: "OTP code is required", minLength: { value: 6, message: "OTP code must be 6 digits" } })} />
          <div className="flex justify-between gap-2 pt-1">
            {otpArray.map((digit, index) => (
              <input key={index} ref={(element) => { inputRefs.current[index] = element; }} type="text" inputMode="numeric" maxLength={1} value={digit} onChange={(event) => { const value = event.target.value; if (!/^\d*$/.test(value)) return; const next = [...otpArray]; next[index] = value.slice(-1); updateOtp(next); if (value && index < 5) inputRefs.current[index + 1]?.focus(); }} className="h-12 w-11 rounded-xl border border-blue-200/15 bg-blue-950/35 text-center text-lg font-bold text-slate-100 focus:border-sky-400/60 focus:outline-none focus:ring-1 focus:ring-sky-400/40" />
            ))}
          </div>
          {errors.otp && <p className="pl-2 text-xs text-red-400">{errors.otp.message}</p>}
        </div>
        <button type="submit" disabled={loading || isPending} className="flex h-12 w-full items-center justify-center rounded-full bg-sky-400 font-semibold text-blue-950 transition hover:bg-sky-300 disabled:opacity-50">
          {loading || isPending ? "Verifying..." : "Verify Instructor"}
        </button>
      </form>
    </div>
  );
}
