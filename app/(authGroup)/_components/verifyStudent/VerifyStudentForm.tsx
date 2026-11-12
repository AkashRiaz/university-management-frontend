"use client";

import React, { useState, useRef, useEffect, useActionState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import {
  CheckCircle2,
  GraduationCap,
  Mail,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { authStyles } from "../authStyles";
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
    <div className="w-full">
      {/* Top Icon Badge */}
      <div className="mb-6 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <GraduationCap className="size-6" aria-hidden="true" />
      </div>

      {/* Header */}
      <div className={authStyles.header}>
        <h2 className={authStyles.title}>Student Verification</h2>
        <p className={authStyles.subtitle}>
          Enter your student email and the 6-digit OTP code sent by your
          administrator.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Email Field */}
        <div className={authStyles.field}>
          <label htmlFor="verify-student-email" className={authStyles.label}>
            Student Email
          </label>
          <div className={authStyles.inputWrapper}>
            <input
              id="verify-student-email"
              type="email"
              autoComplete="email"
              placeholder="student@university.edu"
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? "verify-student-email-error" : undefined}
              className={`${authStyles.input} pr-11`}
              {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email address",
                  },
                })}
            />
            <Mail className={`${authStyles.inputIcon} right-4`} aria-hidden="true" />
          </div>
          {errors.email && (
            <p id="verify-student-email-error" role="alert" className={authStyles.error}>
              {errors.email.message}
            </p>
          )}
        </div>

        {/* OTP Field */}
        <div
          role="group"
          aria-labelledby="verify-student-otp-label"
          className={authStyles.field}
        >
          <div className="flex items-center justify-between">
            <span id="verify-student-otp-label" className={authStyles.label}>
              6-Digit OTP Code
            </span>
            <button
              type="button"
              onClick={handleResendCode}
              className={authStyles.textButton}
            >
              <RotateCcw className="size-3" aria-hidden="true" />
              <span aria-live="polite">
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
          <div className={authStyles.otpGroup}>
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
                value={digit}
                onPaste={handlePaste}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                aria-label={`Digit ${index + 1} of 6`}
                className={authStyles.otpBox}
              />
            ))}
          </div>
          {errors.otp && (
            <p role="alert" className={authStyles.error}>
              {errors.otp.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={authStyles.primaryButton}
        >
          <CheckCircle2 className="size-4" aria-hidden="true" />
          <span>Verify Account</span>
        </button>
      </form>

      <p className={authStyles.footnote}>
        <ShieldCheck className="size-4 text-success" aria-hidden="true" />
        Secure student verification
      </p>
    </div>
  );
}
