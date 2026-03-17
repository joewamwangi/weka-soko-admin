
import React, { useState, useEffect, useCallback } from "react";
// Assuming req, Spin, fmtKES, ago, Toast are exported from App.jsx or a utility file
// For now, we'll assume they are passed or imported from App.jsx for simplicity

function EscrowManagement({ token, req, Spin, fmtKES, ago, Toast }) {
  const [escrows, setEscrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null); // { msg, ok }

  const fetchEscrows = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await req("/api/admin/escrows", {}, token);
      setEscrows(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, req]);

  useEffect(() => {
    fetchEscrows();
  }, [fetchEscrows]);

  const handleAction = async (id, actionType) => {
    if (!window.confirm(`Are you sure you want to ${actionType} escrow ${id}?`)) return;
    try {
      setLoading(true);
      await req(`/api/admin/escrows/${id}/${actionType}`, { method: "POST" }, token);
      setToast({ msg: `Escrow ${actionType}d successfully!`, ok: true });
      fetchEscrows();
    } catch (err) {
      setToast({ msg: `Failed to ${actionType} escrow: ${err.message}`, ok: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Escrow Management</h1>
      </div>
      {loading && <div style={{ padding: 40, textAlign: "center" }}><Spin /></div>}
      {error && <div className="empty">Error: {error}</div>}
      {!loading && !error && escrows.length === 0 && <div className="empty">No escrows found.</div>}
      {!loading && !error && escrows.length > 0 && (
        <div className="tw">
          <div className="ts">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Listing</th>
                  <th>Buyer</th>
                  <th>Seller</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {escrows.map((e) => (
                  <tr key={e.id}>
                    <td>{e.id}</td>
                    <td>{e.listing_title}</td>
                    <td>{e.buyer_name}</td>
                    <td>{e.seller_name}</td>
                    <td>{fmtKES(e.amount)}</td>
                    <td><span className={`badge ${e.status === "funded" ? "by2" : e.status === "released" ? "bg" : e.status === "disputed" ? "br2" : "bm"}`}>{e.status}</span></td>
                    <td>{ago(e.created_at)}</td>
                    <td>
                      {(e.status === "holding" || e.status === "disputed") && (
                        <div style={{ display: "flex", gap: 6 }}>
                          <button className="btn sm bp" onClick={() => handleAction(e.id, "release")}>Release</button>
                          <button className="btn sm br" onClick={() => handleAction(e.id, "refund")}>Refund</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {toast && <Toast msg={toast.msg} ok={toast.ok} onClose={() => setToast(null)} />}
    </div>
  );
}

export default EscrowManagement;
