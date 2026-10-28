import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const navigate = useNavigate();

  // Authentication step: "credentials" | "otp"
  const [step, setStep] = useState("credentials");

  // Credentials form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // OTP form state (stored strictly in memory, never in localStorage/sessionStorage)
  const [challengeId, setChallengeId] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [otp, setOtp] = useState("");

  // Countdown timers (seconds)
  const [expirySeconds, setExpirySeconds] = useState(300); // 5-minute expiry
  const [cooldownSeconds, setCooldownSeconds] = useState(60); // 60-second resend cooldown

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Ref for auto-focusing OTP input upon entering OTP step
  const otpInputRef = useRef(null);

  // Expiry countdown timer (5 minutes = 300 seconds)
  useEffect(() => {
    if (step !== "otp") return;

    const timer = setInterval(() => {
      setExpirySeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [step, challengeId]);

  // Cooldown countdown timer (60 seconds)
  useEffect(() => {
    if (step !== "otp") return;

    const timer = setInterval(() => {
      setCooldownSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [step, challengeId]);

  // Auto-focus OTP input on entering the OTP screen
  useEffect(() => {
    if (step === "otp" && otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, [step]);

  // Format seconds to MM:SS string
  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // --------------------------------------------------------------------------
  // Step 1: Initial Credential Submission (POST /api/auth/login)
  // --------------------------------------------------------------------------
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid email or password.");
        setIsLoading(false);
        return;
      }

      if (data.status === "OTP_REQUIRED") {
        // Transition to OTP verification screen without saving any token
        setChallengeId(data.challengeId);
        setMaskedEmail(data.emailMasked || email.trim());
        setExpirySeconds(data.expiresInSeconds || 300);
        setCooldownSeconds(60);
        setOtp("");
        setError("");
        setSuccessMessage("");
        setStep("otp");
      } else {
        setError("Unexpected authentication response from server.");
      }
    } catch {
      setError("Unable to connect to the server. Please check if the backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  // --------------------------------------------------------------------------
  // Step 2: OTP Verification Submission (POST /api/auth/verify-otp)
  // --------------------------------------------------------------------------
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    if (expirySeconds <= 0) {
      setError("Verification code has expired. Please request a new code or log in again.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          challengeId,
          otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Verification failed. Please check the code and try again.");
        setIsLoading(false);
        return;
      }

      // Store JWT token strictly in sessionStorage under the existing adminToken key
      sessionStorage.setItem("adminToken", data.token);

      // Navigate to admin dashboard only after successful OTP verification
      navigate("/admin/dashboard");
    } catch {
      setError("Unable to connect to the server. Please check your network connection.");
      setIsLoading(false);
    }
  };

  // --------------------------------------------------------------------------
  // Step 3: Resend OTP Code (POST /api/auth/resend-otp)
  // --------------------------------------------------------------------------
  const handleResendOtp = async () => {
    if (cooldownSeconds > 0 || isLoading || !challengeId) return;

    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          challengeId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // If server enforces cooldown, extract remaining seconds if available
        if (response.status === 429 && data.message) {
          const match = data.message.match(/(\d+)\s*second/i);
          if (match && match[1]) {
            setCooldownSeconds(parseInt(match[1], 10));
          }
        }
        setError(data.message || "Unable to resend code. Please try again.");
        setIsLoading(false);
        return;
      }

      // Update challenge ID and reset timers only after successful response
      setChallengeId(data.challengeId);
      setExpirySeconds(data.expiresInSeconds || 300);
      setCooldownSeconds(60);
      setOtp("");
      setSuccessMessage(data.message || "A new verification code has been dispatched.");
    } catch {
      setError("Unable to connect to the server. Please check your network connection.");
    } finally {
      setIsLoading(false);
    }
  };

  // --------------------------------------------------------------------------
  // Back to Login: Reset OTP state and return to credentials view
  // --------------------------------------------------------------------------
  const handleBackToLogin = () => {
    setStep("credentials");
    setChallengeId("");
    setOtp("");
    setPassword("");
    setError("");
    setSuccessMessage("");
    setIsLoading(false);
  };

  // Restrict OTP input to numbers only, max 6 digits
  const handleOtpChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(val);
    if (error) setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        {/* Foundation Branding Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Sharda Welfare
          </h1>
          <p className="mt-2 text-gray-500">
            Admin Panel
          </p>
        </div>

        {/* Status Alerts */}
        {error && (
          <div className="mb-5 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-5 rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-700">
            {successMessage}
          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* VIEW 1: Email and Password Entry                                 */}
        {/* ---------------------------------------------------------------- */}
        {step === "credentials" ? (
          <div>
            <h2 className="mb-2 text-2xl font-semibold text-gray-800">
              Welcome Back
            </h2>
            <p className="mb-6 text-sm text-gray-500">
              Sign in to manage website content and projects.
            </p>

            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  autoComplete="username"
                  required
                  disabled={isLoading}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    disabled={isLoading}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-20 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-blue-700 py-3 font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400"
              >
                {isLoading ? "Verifying..." : "Sign In"}
              </button>
            </form>
          </div>
        ) : (
          /* ---------------------------------------------------------------- */
          /* VIEW 2: OTP Verification Screen                                  */
          /* ---------------------------------------------------------------- */
          <div>
            <h2 className="mb-2 text-2xl font-semibold text-gray-800">
              Two-Factor Authentication
            </h2>
            <p className="mb-6 text-sm text-gray-500 leading-relaxed">
              A 6-digit verification code has been sent to{" "}
              <span className="font-semibold text-gray-800">{maskedEmail}</span>.
            </p>

            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="otp"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Verification Code
                  </label>
                  <span
                    className={`text-xs font-semibold ${
                      expirySeconds <= 60 ? "text-red-600" : "text-gray-500"
                    }`}
                  >
                    {expirySeconds > 0
                      ? `Expires in ${formatTime(expirySeconds)}`
                      : "Code expired"}
                  </span>
                </div>

                <input
                  ref={otpInputRef}
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={otp}
                  onChange={handleOtpChange}
                  placeholder="000000"
                  autoComplete="one-time-code"
                  required
                  disabled={isLoading || expirySeconds <= 0}
                  className="w-full text-center tracking-[0.5em] text-2xl font-bold font-mono rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                />
              </div>

              {/* Resend Cooldown and Action Row */}
              <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                <span>Didn't receive the code?</span>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={cooldownSeconds > 0 || isLoading}
                  className="font-semibold text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed transition"
                >
                  {cooldownSeconds > 0
                    ? `Resend in ${cooldownSeconds}s`
                    : "Resend Code"}
                </button>
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={isLoading || otp.length !== 6 || expirySeconds <= 0}
                className="w-full rounded-lg bg-blue-700 py-3 font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400"
              >
                {isLoading ? "Verifying Code..." : "Verify & Sign In"}
              </button>

              {/* Back to Login Action */}
              <button
                type="button"
                onClick={handleBackToLogin}
                disabled={isLoading}
                className="w-full text-center text-sm font-medium text-gray-600 hover:text-gray-900 transition pt-2 block"
              >
                ← Back to Login
              </button>
            </form>
          </div>
        )}

        <p className="mt-8 text-center text-xs text-gray-400">
          Sharda Welfare Foundation
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;