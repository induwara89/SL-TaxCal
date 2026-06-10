"use client";

import { useState, useTransition } from "react";
import { calculateTax, TaxResult } from "./actions/calculateTax";

export default function Home() {
  const [salary, setSalary] = useState("");
  const [deductEPF, setDeductEPF] = useState(false);
  const [result, setResult] = useState<TaxResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleCalculate = () => {
    startTransition(async () => {
      const data = await calculateTax(Number(salary), 0, deductEPF);
      setResult(data);
    });
  };

  const fmt = (n: number) => "Rs. " + Math.round(n).toLocaleString("en-LK");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #F5F4F0; }
        .page { font-family: 'DM Sans', sans-serif; background: #F5F4F0; min-height: 100vh; padding: 1.5rem 2rem; }

        /* NAV */
        .nav { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .logo { font-family: 'Playfair Display', serif; font-size: 30px; font-weight: 900; color: #1a1a1a; letter-spacing: -1px; }
        .logo span { color: #E8A020; }
        .nav-center { text-align: center; }
        .nav-center h1 { font-family: 'Playfair Display', serif; font-size: 40px; font-weight: 900; color: #1a1a1a; letter-spacing: -0.5px; }
        .nav-center p { font-size: 11px; color: #6a6a6a; letter-spacing: 0.04em; margin-top: 7px; }
        .admin-btn { font-size: 14px; color: #4a4a4a;border: 1.5px solid #ddd; background: #fff; padding: 7px 16px; border-radius: 20px; cursor: pointer; font-family: 'DM Sans', sans-serif; text-decoration: none; }

        /* LAYOUT */
        .layout { display: grid; grid-template-columns: 1fr 1.4fr 1fr; gap: 1.25rem; align-items: start; margin-top: 1.5rem; }
        .layout-single { display: flex; justify-content: center; margin-top: 1.5rem; }

        /* CARDS */
        .card { background: #fff; border-radius: 20px; padding: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
        .card-label { font-size: 12px; color: #6a6a6a; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 10px; }
        .card-value { font-family: 'DM Sans', sans-serif; font-size: 22px; font-weight: 500; color: #1a1a1a; }
        .card + .card { margin-top: 1.25rem; }

        /* INPUT CARD */
        .input-card { background: #fff; border-radius: 20px; padding: 1.75rem; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
        .input-label { font-size: 12px; color: #6a6a6a; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px; display: block; }
        .salary-input { width: 100%; border: 1.5px solid #eee; border-radius: 14px; padding: 15px 18px; font-size: 20px; font-family: 'DM Sans', sans-serif; font-weight: 500; background: #FAFAF8; color: #1a1a1a; outline: none; transition: border-color 0.2s; margin-bottom: 1.25rem; }
        .salary-input:focus { border-color: #E8A020; }
        .epf-row { display: flex; align-items: center; gap: 10px; margin-bottom: 1.25rem; }
        .epf-row input { width: 17px; height: 17px; accent-color: #E8A020; }
        .epf-row label { font-size: 13px; color: #666; }
        .calc-btn { width: 100%; background: #E8A020; color: #fff; border: none; border-radius: 30px; padding: 16px; font-size: 14px; font-family: 'DM Sans', sans-serif; font-weight: 600; cursor: pointer; transition: opacity 0.2s; }
        .calc-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* NET PAY CARD */
        .net-card { background: #1C1C1E; border-radius: 20px; padding: 1.75rem; margin-top: 1.25rem; }
        .net-label { font-size: 12px; color: #8f8f8f; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 10px; }
        .net-value { font-family: 'DM Sans', sans-serif; font-size: 36px; font-weight: 300; color: #E8A020; letter-spacing: -1px; }

        /* BREAKDOWN */
        .brow { display: flex; justify-content: space-between; font-size: 12px; padding: 7px 0; border-top: 1px solid #F5F4F0; color: #666; }
        .brow.total { font-size: 13px; font-weight: 600; color: #1a1a1a; border-top: 1px solid #eee; padding-top: 10px; margin-top: 2px; }
        .deduct { color: #E05252; }
        .net-green { color: #2E9E6B; }
        .rate-badge { display: inline-block; background: #FEF3DC; color: #E8A020; font-size: 11px; font-weight: 600; padding: 2px 9px; border-radius: 10px; margin-left: 6px; }

        /* TIER TABLE */
        .tier-table { width: 100%; border-collapse: collapse; font-size: 12px; }
        .tier-table th { text-align: left; font-weight: 400; color: #bbb; font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em; padding-bottom: 8px; }
        .tier-table th:last-child { text-align: right; }
        .tier-table th:nth-child(2) { text-align: center; }
        .tier-table td { padding: 7px 0; border-top: 1px solid #F5F4F0; color: #555; font-size: 12px; }
        .tier-table td:last-child { text-align: right; color: #1a1a1a; font-weight: 500; }
        .tier-table td:nth-child(2) { text-align: center; }
        .rate-dot { display: inline-block; background: #FEF3DC; color: #E8A020; font-size: 10px; font-weight: 600; padding: 2px 7px; border-radius: 8px; }

        .footer { font-size: 10px; color: #ccc; text-align: center; padding: 2rem 0 1rem; letter-spacing: 0.04em; }

        /* PLACEHOLDER */
        .placeholder { background: #fff; border-radius: 20px; padding: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.04); min-height: 120px; display: flex; align-items: center; justify-content: center; }
        .placeholder p { font-size: 12px; color: #ddd; text-align: center; line-height: 1.6; }
      `}</style>

      <div className="page">

        {/* Navbar */}
        <nav className="nav">
          <div className="logo">tax<span>.</span>lk</div>
          <div className="nav-center">
            <h1>Sri Lanka Salary Tax Calculator</h1>
            <p>APIT / PAYE — 2024 / 2025 TAX YEAR</p>
          </div>
          <a href="/admin/login" className="admin-btn">Admin</a>
        </nav>

        &nbsp;

        {/* Layout */}
        {!result ? (
          // Before calculate — centered input only
          <div className="layout-single">
            <div style={{ width: "100%", maxWidth: "420px" }}>
              <div className="input-card">
                <label className="input-label">Enter Monthly Salary (Rs.)</label>
                <input
                  className="salary-input"
                  type="number"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCalculate()}
                  placeholder="ex: 200,000"
                />
                <div className="epf-row">
                  <input type="checkbox" id="epf" checked={deductEPF} onChange={(e) => setDeductEPF(e.target.checked)} />
                  <label htmlFor="epf">Deduct 8% Employee EPF</label>
                </div>
                <button className="calc-btn" onClick={handleCalculate} disabled={isPending}>
                  {isPending ? "Calculating..." : "Calculate Tax"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          // After calculate — 3 column layout
          <div className="layout">

            {/* LEFT COLUMN */}
            <div>
              <div className="card">
                <div className="card-label">Tax Withheld</div>
                <div className="card-value">{fmt(result.totalTax)}</div>
              </div>
              <div className="card">
                <div className="card-label">
                  Salary Breakdown
                  <span className="rate-badge">{result.effectiveTaxRate}% effective</span>
                </div>
                <div className="brow"><span>Gross Salary</span><span>{fmt(result.grossSalary)}</span></div>
                <div className="brow"><span>Tax Deduction</span><span className="deduct">− {fmt(result.totalTax)}</span></div>
                <div className="brow"><span>EPF Deduction</span><span className="deduct">− {fmt(result.employeeEPF)}</span></div>
                <div className="brow total"><span>Net Take-Home</span><span className="net-green">{fmt(result.netSalary)}</span></div>
              </div>
            </div>

            {/* CENTER COLUMN */}
            <div>
              <div className="input-card">
                <label className="input-label">Enter Monthly Salary (Rs.)</label>
                <input
                  className="salary-input"
                  type="number"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCalculate()}
                  placeholder="ex: 200,000"
                />
                <div className="epf-row">
                  <input type="checkbox" id="epf2" checked={deductEPF} onChange={(e) => setDeductEPF(e.target.checked)} />
                  <label htmlFor="epf2">Deduct 8% Employee EPF</label>
                </div>
                <button className="calc-btn" onClick={handleCalculate} disabled={isPending}>
                  {isPending ? "Calculating..." : "Calculate Tax"}
                </button>
              </div>
              <div className="net-card">
                <div className="net-label">Net Take-Home Pay</div>
                <div className="net-value">{fmt(result.netSalary)}</div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div>
              <div className="card">
                <div className="card-label">EPF Contribution</div>
                <div className="card-value">{fmt(result.employeeEPF)}</div>
              </div>
              <div className="card">
                <div className="card-label">Tax Tier Breakdown</div>
                <table className="tier-table">
                  <thead>
                    <tr>
                      <th>Range</th>
                      <th>Rate</th>
                      <th>Tax</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.tierBreakdown.map((tier, i) => (
                      <tr key={i}>
                        <td>{Math.round(tier.minIncome / 1000)}k — {tier.maxIncome >= 999999999 ? "above" : Math.round(tier.maxIncome / 1000) + "k"}</td>
                        <td><span className="rate-dot">{tier.rate}%</span></td>
                        <td>{fmt(tier.taxAmount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        <div className="footer">TAX BRACKETS FETCHED DYNAMICALLY FROM DATABASE</div>

      </div>
    </>
  );
}