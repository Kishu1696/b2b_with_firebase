/**
 * OtpVerification.tsx
 * Firebase email link verification ke baad user ko guide karta hai
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, RefreshCw, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";

export default function OtpVerification() {
  const { resendVerificationEmail } = useAuth() as any;
  const storedEmail = sessionStorage.getItem("otp_email") ?? "";
  const isReset     = sessionStorage.getItem("otp_mode") === "reset_password";

  const [resent,  setResent]  = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  async function handleResend() {
    setLoading(true);
    setError(null);
    try {
      if (resendVerificationEmail) await resendVerificationEmail();
      setResent(true);
    } catch (e: any) {
      setError(e?.message ?? "Error hua, dobara try karein.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <div className="flex flex-col items-center text-center gap-5">
        <div className="rounded-full bg-blue-500/10 p-4">
          <Mail className="h-8 w-8 text-blue-400" />
        </div>

        <div>
          <h1 className="text-2xl font-bold">
            {isReset ? "Password Reset Email Bheja Gaya" : "Email Verify Karein"}
          </h1>
          <p className="mt-2 text-sm text-muted">
            Firebase ne ek link bheja hai:
          </p>
          {storedEmail && (
            <p className="mt-1 font-medium text-white">{storedEmail}</p>
          )}
        </div>

        <div className="w-full rounded-lg border border-blue-500/20 bg-blue-500/5 p-4 text-sm text-left space-y-2">
          <p className="font-medium text-blue-300">Steps:</p>
          <ol className="list-decimal list-inside space-y-1 text-muted">
            <li>Apna email inbox open karein</li>
            <li>
              {isReset
                ? "Firebase ka \"Reset your password\" email dhundein"
                : "Firebase ka \"Verify your email\" email dhundein"}
            </li>
            <li>Email mein diye link par click karein</li>
            <li>
              {isReset
                ? "Naya password set karein"
                : "Wapas aayein aur login karein"}
            </li>
          </ol>
          <p className="text-xs text-muted mt-2">
            ⚠️ Spam/Junk folder bhi check karein
          </p>
        </div>

        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}

        {resent && (
          <div className="flex items-center gap-2 text-sm text-green-400">
            <CheckCircle className="h-4 w-4" />
            Email dobara bhej diya gaya!
          </div>
        )}

        {!isReset && (
          <Button
            variant="outline"
            className="w-full"
            onClick={handleResend}
            disabled={loading || resent}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Bhej raha hai..." : resent ? "Email Bheja Gaya ✓" : "Email Dobara Bhejein"}
          </Button>
        )}

        <Link to="/auth/login" className="text-sm text-muted hover:text-white transition-colors">
          ← Login par wapas jayein
        </Link>
      </div>
    </Card>
  );
}
