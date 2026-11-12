"use client";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { useForm, useWatch } from "react-hook-form";
import { Loader2, Mail, Presentation, RotateCcw, ShieldCheck } from "lucide-react";
import { authStyles } from "../authStyles";
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
    <div className="w-full">
      {/* Top Icon Badge */}
      <div className="mb-6 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Presentation className="size-6" aria-hidden="true" />
      </div>

      {/* Header */}
      <div className={authStyles.header}>
        <h2 className={authStyles.title}>Instructor Verification</h2>
        <p className={authStyles.subtitle}>
          Enter your instructor email and the 6-digit OTP code sent by your administrator.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Email Field */}
        <div className={authStyles.field}>
          <label htmlFor="verify-instructor-email" className={authStyles.label}>
            Instructor Email
          </label>
          <div className={authStyles.inputWrapper}>
            <input
              id="verify-instructor-email"
              type="email"
              autoComplete="email"
              placeholder="instructor@university.edu"
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? "verify-instructor-email-error" : undefined}
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
            <p id="verify-instructor-email-error" role="alert" className={authStyles.error}>
              {errors.email.message}
            </p>
          )}
        </div>

        {/* OTP Field */}
        <div
          role="group"
          aria-labelledby="verify-instructor-otp-label"
          className={authStyles.field}
        >
          <div className="flex items-center justify-between">
            <span id="verify-instructor-otp-label" className={authStyles.label}>
              6-Digit OTP Code
            </span>
            <button
              type="button"
              onClick={handleResend}
              disabled={resendTimer > 0 || !emailValue}
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
                ref={(element) => {
                  inputRefs.current[index] = element;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(event) => {
                  const value = event.target.value;
                  if (!/^\d*$/.test(value)) return;
                  const next = [...otpArray];
                  next[index] = value.slice(-1);
                  updateOtp(next);
                  if (value && index < 5) inputRefs.current[index + 1]?.focus();
                }}
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
          disabled={loading || isPending}
          className={authStyles.primaryButton}
        >
          {(loading || isPending) && (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          )}
          {loading || isPending ? "Verifying..." : "Verify Instructor"}
        </button>
      </form>

      <p className={authStyles.footnote}>
        <ShieldCheck className="size-4 text-success" aria-hidden="true" />
        Secure instructor verification
      </p>
    </div>
  );
}
