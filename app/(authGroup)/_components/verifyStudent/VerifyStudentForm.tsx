"use client";

import React, { useState, useRef, useEffect, useActionState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { GraduationCap, Mail, CheckCircle2, RotateCcw } from "lucide-react";
import {
  resendStudentVerificationOtpAction,
  verifyStudentActions,
} from "../../_actions/authActions";

type VerifyStudentFormValues = {
  email: string;
  otp: string;
};

export interface VerifyStudentFormProps {
  onResendOtp?: (email: string) => Promise<boolean> | void;
}

export default function VerifyStudentForm({
  onResendOtp,
}: VerifyStudentFormProps) {
  const [otpArray, setOtpArray] = useState<string[]>(new Array(6).fill(""));
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<VerifyStudentFormValues>({
    defaultValues: {
      email: "",
      otp: "",
    },
  });

  const emailValue = useWatch({ control, name: "email" });

  const [state, formAction, loading] = useActionState(verifyStudentActions, null);
  const [isPending, startTransition] = useTransition();

  // Countdown timer for resend button
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Sync OTP array to React Hook Form
  const updateOtpValue = (newOtpArray: string[]) => {
    setOtpArray(newOtpArray);
    const combinedOtp = newOtpArray.join("");
    setValue("otp", combinedOtp, { shouldValidate: true });
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otpArray];
    newOtp[index] = value.slice(-1);
    updateOtpValue(newOtp);

    // Auto-advance focus
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (!/^\d+$/.test(pastedData)) return;

    const digits = pastedData.slice(0, 6).split("");
    const newOtp = [...otpArray];

    digits.forEach((digit, idx) => {
      newOtp[idx] = digit;
    });

    updateOtpValue(newOtp);

    const targetIndex = Math.min(digits.length, 5);
    inputRefs.current[targetIndex]?.focus();
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      if (!otpArray[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0 || !emailValue) return;
    updateOtpValue(new Array(6).fill(""));
    setResendTimer(30);
    const result = onResendOtp
      ? { success: await onResendOtp(emailValue) }
      : await resendStudentVerificationOtpAction(emailValue);
    if (!result.success) {
      setResendTimer(0);
      toast.error("message" in result ? result.message : "Failed to resend verification code.");
      return;
    }
    toast.success("message" in result ? result.message : "Verification code resent to your email.");
  };

  const onSubmit = (data: VerifyStudentFormValues) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("otp", data.otp);
     startTransition(() => {
      formAction(formData);
    });
  };

  useEffect(() => {
    if (!state) return;

    if (state.success) {
      toast.success(state.message || "Student verified successfully!");
    } else {
      toast.error(state.message || "Verification failed");
    }
  }, [state]);

  return (
    <div
      className={`relative z-10 w-full max-w-md bg-[#12243a]/90 border border-blue-200/15 rounded-3xl p-8 shadow-2xl shadow-blue-950/30 backdrop-blur-xl flex flex-col justify-between overflow-hidden text-slate-100 font-sans `}
    >
      {/* Top Icon Badge */}
      <div className="flex justify-center mb-6 pt-2">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-400 text-blue-950 shadow-lg shadow-sky-950/30">
          <GraduationCap className="h-9 w-9" />
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-50 mb-2">
          Student Verification
        </h2>
        <p className="text-xs text-slate-400 max-w-70 mx-auto leading-relaxed">
          Enter your student email and the 6-digit OTP code sent by your
          administrator.
        </p>
      </div>

      {/* Form with React Hook Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 pl-1">
            Student Email
          </label>
          <div className="relative">
            <input
              type="email"
              // disabled={isSubmitting}
              placeholder="student@university.edu"
              className="w-full rounded-full bg-blue-950/35 border border-blue-200/15 pl-4 pr-10 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-400/60 focus:ring-1 focus:ring-sky-400/40 disabled:opacity-50 transition"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email address",
                },
              })}
            />
            <Mail className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          </div>
          {errors.email && (
            <p className="text-xs text-red-400 pl-2">{errors.email.message}</p>
          )}
        </div>

        {/* OTP Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between px-1">
            <label className="text-xs font-semibold text-slate-300">
              6-Digit OTP Code
            </label>
            <button
              type="button"
              // disabled={resendTimer > 0 || !emailValue || isSubmitting}
              onClick={handleResendCode}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-100 disabled:opacity-40 disabled:no-underline transition"
            >
              <RotateCcw className="w-3 h-3" />
              <span>
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Code"}
              </span>
            </button>
          </div>

          {/* Hidden Registered Input for RHF Validation */}
          <input
            type="hidden"
            {...register("otp", {
              required: "OTP code is required",
              minLength: {
                value: 6,
                message: "OTP code must be 6 digits",
              },
            })}
          />

          {/* Visible 6 Box Inputs */}
          <div className="flex justify-between gap-2 pt-1">
            {otpArray.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                // disabled={isSubmitting}
                value={digit}
                onPaste={handlePaste}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-11 h-12 text-center text-lg font-bold rounded-xl bg-blue-950/35 border border-blue-200/15 text-slate-100 focus:outline-none focus:border-sky-400/60 focus:ring-1 focus:ring-sky-400/40 disabled:opacity-50 transition"
              />
            ))}
          </div>
          {errors.otp && (
            <p className="text-xs text-red-400 pl-2">{errors.otp.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          // disabled={isSubmitting}
          className="w-full rounded-full bg-sky-400 py-3 font-semibold text-blue-950 hover:bg-sky-300 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99] transition shadow-lg shadow-sky-950/30 flex items-center justify-center gap-2 mt-4"
        >
          <CheckCircle2 className="w-4 h-4" />
          {/* <span>{isSubmitting ? "Verifying..." : "Verify Account"}</span> */}
          <span>Verify Account</span>
        </button>
      </form>

      {/* Bottom Accent Banner */}
      <div className="mt-8 -mx-8 -mb-8 bg-blue-950/45 border-t border-blue-200/10 p-4 text-slate-300 text-center font-medium text-xs tracking-wide">
        Secure student verification
      </div>
    </div>
  );
}
