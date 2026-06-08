"use client";

import { useState, useTransition } from "react";
import { loginAdmin } from "@/app/actions/adminAuth";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleLogin = () => {
    startTransition(async () => {
      const result = await loginAdmin(password);
      if (result?.error) setError(result.error);
    });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #F5F4F0; }
        .page { font-family: 'DM Sans', sans-serif; background: #F5F4F0; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; }
        .logo { font-family: 'Playfair Display', serif; font-size: 40px; font-weight: 900; color: #1a1a1a; letter-spacing: -1px; margin-bottom: 2.5rem; }
        .logo span { color: #E8A020; }
        .card { background: #fff; border-radius: 24px; padding: 2rem; width: 100%; text-align: center; max-width: 400px; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
        .title { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 900; color: #1a1a1a; letter-spacing: -0.5px; margin-bottom: 6px; }
        .subtitle { font-size: 13px; color: #aaa; margin-bottom: 1.75rem; }
        .input-label { font-size: 10px; color: #aaa; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px; display: block; }
        .input { width: 100%; border: 1.5px solid #eee; border-radius: 14px; padding: 16px 18px; font-size: 16px; font-family: 'DM Sans', sans-serif; font-weight: 400; background: #FAFAF8; color: #1a1a1a; outline: none; transition: border-color 0.2s; margin-bottom: 1.25rem; }
        .input:focus { border-color: #E8A020; }
        .error { font-size: 13px; color: #E05252; margin-bottom: 1rem; text-align: center; }
        .btn { width: 100%; background: #E8A020; color: #fff; border: none; border-radius: 30px; padding: 17px; font-size: 15px; font-family: 'DM Sans', sans-serif; font-weight: 600; cursor: pointer; letter-spacing: 0.02em; transition: opacity 0.2s; }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .hint { font-size: 11px; color: #ccc; text-align: center; margin-top: 1.25rem; letter-spacing: 0.04em; }
        .back-link { font-size: 12px; color: #aaa; text-decoration: none; margin-top: 1.5rem; }
        .back-link:hover { color: #1a1a1a; }
      `}</style>

      <div className="page">
        <div className="logo">tax<span>.</span>lk</div>

        <div className="card">
          <div className="title">Admin Login</div>
            <div className="subtitle"></div>    

          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Enter password"
          />

          {error && <div className="error">{error}</div>}

          <button className="btn" onClick={handleLogin} disabled={isPending}>
            {isPending ? "Logging in..." : "Login"}
          </button>

         
        </div>

        <a href="/" className="back-link">← Back to Calculator</a>
      </div>
    </>
  );
}