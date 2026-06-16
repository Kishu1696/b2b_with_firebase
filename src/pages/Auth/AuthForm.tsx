import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/forms/FormField";
import { useAuth, type UserRole } from "@/context/AuthContext";
import { getApiError } from "@/services/api";

interface AuthFormProps {
  title: string;
  subtitle: string;
  mode: "login" | "register" | "forgot" | "otp" | "reset";
}

export default function AuthForm({ title, subtitle, mode }: AuthFormProps) {
  const auth = useAuth();

  // Read email/mode from sessionStorage (set by AuthContext after register/forgot)
  const storedEmail = sessionStorage.getItem("otp_email") ?? "";
  const storedOtpMode = sessionStorage.getItem("otp_mode") ?? "verify_email";
  const resetEmail = sessionStorage.getItem("reset_email") ?? "";
  const resetOtp = sessionStorage.getItem("reset_otp") ?? "";

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form fields
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState(storedEmail);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [role, setRole] = useState<UserRole>("buyer");

  const needsPassword = mode === "login" || mode === "register" || mode === "reset";

  const actionLabel = {
    login: "Sign in",
    register: "Create account",
    forgot: "Send reset code",
    otp: "Verify code",
    reset: "Reset password",
  }[mode];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (mode === "register" && password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      switch (mode) {
        case "login":
          await auth.login(email, password);
          break;

        case "register":
          await auth.register({
            full_name: fullName,
            email,
            password,
            company_name: companyName || undefined,
            role,
          });
          setSuccessMsg("Account created! Redirecting to verification...");
          break;

        case "forgot":
          await auth.forgotPassword(email);
          setSuccessMsg("If that email is registered, a reset code has been sent.");
          break;

        case "otp":
          if (storedOtpMode === "reset_password") {
            await auth.verifyResetOtp(storedEmail || email, otp);
          } else {
            await auth.verifyEmail(storedEmail || email, otp);
            setSuccessMsg("Email verified! Redirecting to login...");
          }
          break;

        case "reset":
          await auth.resetPassword(resetEmail || email, resetOtp || otp, password);
          setSuccessMsg("Password reset! Redirecting to login...");
          break;
      }
    } catch (err) {
      setErrorMsg(getApiError(err));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="mt-2 text-sm text-muted">{subtitle}</p>

      {successMsg && (
        <div className="mt-4 rounded-md border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-300">
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="mt-4 rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
          {errorMsg}
        </div>
      )}

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        {/* Register extra fields */}
        {mode === "register" && (
          <>
            <FormField label="Full name">
              <Input
                required
                placeholder="Jane Smith"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </FormField>
            <FormField label="Company name">
              <Input
                placeholder="Northstar Wholesale"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </FormField>
            <FormField label="Role">
              <select
                className="input-shell w-full"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
              >
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
                <option value="manager">Manager</option>
              </select>
            </FormField>
          </>
        )}

        {/* Email field */}
        {mode !== "otp" && mode !== "reset" && (
          <FormField label="Work email">
            <Input
              required
              type="email"
              placeholder="operator@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormField>
        )}

        {/* OTP field */}
        {mode === "otp" && (
          <>
            {storedEmail && (
              <p className="text-sm text-muted">
                Code sent to <span className="text-white font-medium">{storedEmail}</span>
              </p>
            )}
            <FormField label="Verification code">
              <Input
                required
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="tracking-widest text-center text-lg"
              />
            </FormField>
          </>
        )}

        {/* Password field */}
        {needsPassword && (
          <FormField label={mode === "reset" ? "New password" : "Password"}>
            <div className="relative">
              <Input
                required
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••"
                className="pr-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted"
                onClick={() => setShowPassword((v) => !v)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </FormField>
        )}

        {/* Confirm password */}
        {mode === "register" && (
          <FormField label="Confirm password">
            <Input
              required
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </FormField>
        )}

        {mode === "login" && (
          <div className="text-right">
            <Link className="text-xs text-muted hover:text-white" to="/auth/forgot-password">
              Forgot password?
            </Link>
          </div>
        )}

        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              {actionLabel}…
            </span>
          ) : (
            actionLabel
          )}
        </Button>
      </form>

      <div className="mt-5 flex flex-wrap gap-3 text-sm text-muted">
        {mode !== "login" && (
          <Link className="hover:text-white" to="/auth/login">
            Back to login
          </Link>
        )}
        {mode === "login" && (
          <Link className="hover:text-white" to="/auth/register">
            Create an account
          </Link>
        )}
      </div>
    </Card>
  );
}
