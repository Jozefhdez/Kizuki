import { useState } from "react";
import { supabase } from "../services/supabaseClient";
import "../styles/Login.css";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Regex patterns for validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;

  const validateEmail = (email: string): boolean => {
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return passwordRegex.test(password);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setError(null);
    
    if (value && !validateEmail(value)) {
      setError("Please enter a valid email address.");
      return;
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setError(null);
    
    if (value && !validatePassword(value)) {
      setError("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.");
      return;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);

    // Validate inputs before submission
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.");
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          switch (error.message) {
            case "Invalid login credentials":
              setError("Incorrect email or password.");
              break;
            case "Email not confirmed":
              setError("You must confirm your email before logging in.");
              break;
            default:
              setError("Login error: " + error.message);
          }
          return;
        }
      
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          if (error.message.includes("User already registered")) {
            setError("Email is already registered.");
          } else {
            setError("Registration error: " + error.message);
          }
          return;
        }

        setInfo(
          "Registration successful. Check your email to confirm your account."
        );
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
            <div className="logo-title">
            <img src="/kizuki.svg" alt="Kizuki Logo" className="logo" />
            <h1 className="login-title">Kizuki</h1>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {info && <div className="success-message">{info}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={
              loading ||
              !email ||
              !password
            }
          >
            {loading ? (
              <div className="spinner"></div>
            ) : isLogin ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="login-spacing">
          <button
            className="btn btn-secondary btn-full"
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
              setInfo(null);
            }}
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
