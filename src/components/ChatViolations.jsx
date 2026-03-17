
import React, { useState, useEffect, useCallback } from "react";
// Assuming req, Spin, ago, Toast are exported from App.jsx or a utility file

function ChatViolations({ token, req, Spin, ago, Toast }) {
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null); // { msg, ok }

  const fetchViolations = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await req("/api/chat-violations", {}, token);
      setViolations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, req]);

  useEffect(() => {
    fetchViolations();
  }, [fetchViolations]);

  const handleDismiss = async (id) => {
    if (!window.confirm(`Are you sure you want to dismiss violation ${id}?`)) return;
    try {
      setLoading(true);
      await req(`/api/chat-violations/${id}/dismiss`, { method: "POST" }, token);
      setToast({ msg: `Violation ${id} dismissed successfully!`, ok: true });
      fetchViolations();
    } catch (err) {
      setToast({ msg: `Failed to dismiss violation: ${err.message}`, ok: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Chat Violations</h1>
      </div>
      {loading && <div style={{ padding: 40, textAlign: "center" }}><Spin /></div>}
      {error && <div className="empty">Error: {error}</div>}
      {!loading && !error && violations.length === 0 && <div className="empty">No chat violations found.</div>}
      {!loading && !error && violations.length > 0 && (
        <div className="tw">
          <div className="ts">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Message</th>
                  <th>Reason</th>
                  <th>Timestamp</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {violations.map((v) => (
                  <tr key={v.id}>
                    <td>{v.id}</td>
                    <td>{v.user_id}</td>
                    <td>{v.message}</td>
                    <td>{v.reason}</td>
                    <td>{ago(v.created_at)}</td>
                    <td>
                      <button className="btn sm br" onClick={() => handleDismiss(v.id)}>Dismiss</button>
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

export default ChatViolations;
