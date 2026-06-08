"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSlabs, updateSlab, deleteSlab, addSlab } from "@/app/actions/taxSlabs";
import { logoutAdmin, verifyAdmin } from "@/app/actions/adminAuth";

interface TaxSlab {
  id: number;
  minIncome: number;
  maxIncome: number;
  rate: number;
}

export default function AdminPage() {
  const router = useRouter();
  const [slabs, setSlabs] = useState<TaxSlab[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState({ minIncome: 0, maxIncome: 0, rate: 0 });
  const [newSlab, setNewSlab] = useState({ minIncome: 0, maxIncome: 0, rate: 0 });
  const [isPending, startTransition] = useTransition();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    startTransition(async () => {
      const isAdmin = await verifyAdmin();
      if (!isAdmin) { router.push("/admin/login"); return; }
      setAuthorized(true);
      setSlabs(await getSlabs());
    });
  }, []);

  const handleEdit = (slab: TaxSlab) => {
    setEditingId(slab.id);
    setEditData({ minIncome: slab.minIncome, maxIncome: slab.maxIncome, rate: slab.rate });
  };

  const handleUpdate = (id: number) => {
    startTransition(async () => {
      await updateSlab(id, editData.rate, editData.minIncome, editData.maxIncome);
      setSlabs(await getSlabs());
      setEditingId(null);
    });
  };

  const handleDelete = (id: number) => {
    startTransition(async () => {
      await deleteSlab(id);
      setSlabs(await getSlabs());
    });
  };

  const handleAdd = () => {
    startTransition(async () => {
      await addSlab(newSlab.minIncome, newSlab.maxIncome, newSlab.rate);
      setSlabs(await getSlabs());
      setNewSlab({ minIncome: 0, maxIncome: 0, rate: 0 });
    });
  };

  const fmt = (n: number) => "Rs. " + Math.round(n).toLocaleString("en-LK");

  if (!authorized) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { background: #F5F4F0; }
        `}</style>
        <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#F5F4F0", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ fontSize: "13px", color: "#aaa" }}>Checking authorization...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #F5F4F0; }
        .page { font-family: 'DM Sans', sans-serif; background: #F5F4F0; min-height: 100vh; display: flex; flex-direction: column; }

        /* HEADER */
        .header { padding: 2rem 3rem; display: flex; justify-content: space-between; align-items: center; }
        .logo { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 700; color: #1a1a1a; letter-spacing: -1px; text-decoration: none; }
        .logo span { color: #E8A020; }
        .nav-btns { display: flex; gap: 10px; }
        .nav-btn { font-size: 11px; color: #6a6a6a; border: 1px solid #ddd; background: #fff; padding: 8px 16px; border-radius: 20px; cursor: pointer; font-family: 'DM Sans', sans-serif; text-decoration: none; transition: all 0.2s; }
        .nav-btn:hover { color: #1a1a1a; border-color: #bbb; }
        .nav-btn.danger { color: #de4343; border-color: #fde8e8; background: #fff8f8; }
        .nav-btn.danger:hover { background: #E05252; color: #fff; }
        .divider { height: 1px; background: #eae9e5; margin: 0; }

        /* CONTENT */
       .content { flex: 1; display: flex; flex-direction: column; align-items: center; padding: 2rem 2rem; }
        .page-title { font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 400; color: #1a1a1a; letter-spacing: -0.5px; margin-bottom: 6px; text-align: center; }
        .page-subtitle { font-size: 12px; color: #bbb; letter-spacing: 0.06em; margin-bottom: 2.5rem; text-align: center; }

        /* CARDS */
        .card { background: #fff; border-radius: 18px; padding: 1.75rem; width: 100%; max-width: 680px; margin-bottom: 1.25rem; }
        .card-label { font-size: 12px; color: #6a6a6a; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 1.25rem; }

        /* TABLE */
        .slab-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .slab-table th { text-align: left; font-weight: 400; font-size: 10px; color: #bbb; text-transform: uppercase; letter-spacing: 0.08em; padding-bottom: 10px; }
        .slab-table th:last-child { text-align: right; }
        .slab-table td { padding: 10px 0; border-top: 1px solid #F5F4F0; color: #555; vertical-align: middle; }
        .slab-table td:last-child { text-align: right; }
        .rate-badge { display: inline-block; background: #FEF3DC; color: #E8A020; font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 10px; }

        /* EDIT INPUTS */
        .edit-input { border: 1.5px solid #eee; border-radius: 10px; padding: 7px 12px; font-size: 13px; font-family: 'DM Sans', sans-serif; background: #FAFAF8; color: #1a1a1a; outline: none; width: 100px; }
        .edit-input:focus { border-color: #E8A020; }
        .btn-save { background: #E8A020; color: #fff; border: none; border-radius: 20px; padding: 7px 14px; font-size: 12px; font-family: 'DM Sans', sans-serif; font-weight: 500; cursor: pointer; margin-right: 6px; }
        .btn-cancel { background: #f0f0f0; color: #888; border: none; border-radius: 20px; padding: 7px 14px; font-size: 12px; font-family: 'DM Sans', sans-serif; cursor: pointer; }
        .btn-edit { background: #fff; color: #666; border: 1px solid #eee; border-radius: 20px; padding: 6px 14px; font-size: 12px; font-family: 'DM Sans', sans-serif; cursor: pointer; margin-right: 6px; transition: all 0.2s; }
        .btn-edit:hover { border-color: #E8A020; color: #E8A020; }
        .btn-delete { background: #fff8f8; color: #E05252; border: 1px solid #fde8e8; border-radius: 20px; padding: 6px 14px; font-size: 12px; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all 0.2s; }
        .btn-delete:hover { background: #E05252; color: #fff; }

        /* ADD FORM */
        .add-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem; }
        .input-label { font-size: 10px; color: #bbb; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 6px; display: block; }
        .input { width: 100%; border: 1.5px solid #eee; border-radius: 12px; padding: 13px 16px; font-size: 15px; font-family: 'DM Sans', sans-serif; background: #FAFAF8; color: #1a1a1a; outline: none; transition: border-color 0.2s; }
        .input:focus { border-color: #E8A020; }
        .add-btn { width: 100%; background: #1C1C1E; color: #fff; border: none; border-radius: 30px; padding: 16px; font-size: 14px; font-family: 'DM Sans', sans-serif; font-weight: 500; cursor: pointer; transition: opacity 0.2s; letter-spacing: 0.02em; }
        .add-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        /* FOOTER */
        .footer { padding: 1.5rem 3rem; border-top: 1px solid #eae9e5; display: flex; justify-content: space-between; align-items: center; }
        .footer p { font-size: 10px; color: #6a6a6a; letter-spacing: 0.06em; }
        .footer-logo { font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 700; color: #6a6a6a; }
        .footer-logo span { color: #E8A020; }
      `}</style>

      <div className="page">

        {/* Header */}
        <div className="header">
          <a href="/" className="logo">tax<span>.</span>lk</a>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "35px", fontWeight: 400, color: "#1a1a1a", letterSpacing: "-0.5px" }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Admin Panel</div>
            <div style={{ fontSize: "11px", color: "#6a6a6a", letterSpacing: "0.06em", marginTop: "3px" }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;MANAGE SRI LANKA APIT / PAYE TAX SLABS</div>
          </div>
          <div className="nav-btns">
            <a href="/" className="nav-btn">← Calculator</a>
            <button className="nav-btn danger" onClick={() => startTransition(async () => await logoutAdmin())}>
              Logout
            </button>
          </div>
        </div>
        <div className="divider" />

        {/* Content */}
        <div className="content">

          {/* Tax Slabs Table */}
          <div className="card">
            <div className="card-label">Tax Slabs</div>
            <table className="slab-table">
              <thead>
                <tr>
                  <th>Min Income</th>
                  <th>Max Income</th>
                  <th>Rate</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {slabs.map((slab) => (
                  <tr key={slab.id}>
                    {editingId === slab.id ? (
                      <>
                        <td><input className="edit-input" type="number" value={editData.minIncome} onChange={(e) => setEditData({ ...editData, minIncome: Number(e.target.value) })} /></td>
                        <td><input className="edit-input" type="number" value={editData.maxIncome} onChange={(e) => setEditData({ ...editData, maxIncome: Number(e.target.value) })} /></td>
                        <td><input className="edit-input" type="number" value={editData.rate} onChange={(e) => setEditData({ ...editData, rate: Number(e.target.value) })} /></td>
                        <td>
                          <button className="btn-save" onClick={() => handleUpdate(slab.id)}>Save</button>
                          <button className="btn-cancel" onClick={() => setEditingId(null)}>Cancel</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={{ color: "#1a1a1a", fontWeight: 500 }}>{fmt(slab.minIncome)}</td>
                        <td>{slab.maxIncome >= 999999999 ? <span style={{ color: "#bbb" }}>No limit</span> : fmt(slab.maxIncome)}</td>
                        <td><span className="rate-badge">{slab.rate}%</span></td>
                        <td>
                          <button className="btn-edit" onClick={() => handleEdit(slab)}>Edit</button>
                          <button className="btn-delete" onClick={() => handleDelete(slab.id)}>Delete</button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add New Slab */}
          <div className="card">
            <div className="card-label">Add New Slab</div>
            <div className="add-grid">
              <div>
                <label className="input-label">Min Income</label>
                <input className="input" type="number" value={newSlab.minIncome} onChange={(e) => setNewSlab({ ...newSlab, minIncome: Number(e.target.value) })} />
              </div>
              <div>
                <label className="input-label">Max Income</label>
                <input className="input" type="number" value={newSlab.maxIncome} onChange={(e) => setNewSlab({ ...newSlab, maxIncome: Number(e.target.value) })} />
              </div>
              <div>
                <label className="input-label">Rate (%)</label>
                <input className="input" type="number" value={newSlab.rate} onChange={(e) => setNewSlab({ ...newSlab, rate: Number(e.target.value) })} />
              </div>
            </div>
            <button className="add-btn" onClick={handleAdd} disabled={isPending}>
              {isPending ? "Adding..." : "Add New Slab"}
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="footer">
          <p>TAX BRACKETS FETCHED DYNAMICALLY FROM DATABASE</p>
          <div className="footer-logo">tax<span>.</span>lk</div>
        </div>

      </div>
    </>
  );
}