"use client";

import React, { useState, useEffect } from "react";

type EventSubmission = {
  id: string;
  type: string; // "COMPETITOR" | "SPONSOR"
  eventName: string;
  ticketToken?: string;
  name: string;
  email: string;
  phone: string;
  groupName?: string;
  category?: string;
  tier?: string;
  experience?: string;
  message?: string;
  status: string;
  createdAt: string;
};

export default function PortalEventsPage() {
  const [submissions, setSubmissions] = useState<EventSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedSubmission, setSelectedSubmission] = useState<EventSubmission | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/portal/events");
      const data = await res.json();
      if (data.submissions) {
        setSubmissions(data.submissions);
      }
    } catch (err) {
      console.error("Failed to fetch event submissions", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/portal/events", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setSubmissions((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
        );
        if (selectedSubmission?.id === id) {
          setSelectedSubmission((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event submission?")) return;
    try {
      const res = await fetch(`/api/portal/events?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setSubmissions((prev) => prev.filter((s) => s.id !== id));
        if (selectedSubmission?.id === id) setSelectedSubmission(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredSubmissions = submissions.filter((item) => {
    if (filterType !== "ALL" && item.type !== filterType) return false;
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.phone.toLowerCase().includes(q) ||
        (item.ticketToken && item.ticketToken.toLowerCase().includes(q)) ||
        (item.groupName && item.groupName.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q)) ||
        (item.tier && item.tier.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const totalCount = submissions.length;
  const competitorsCount = submissions.filter((s) => s.type === "COMPETITOR").length;
  const sponsorsCount = submissions.filter((s) => s.type === "SPONSOR").length;
  const pendingCount = submissions.filter((s) => s.status === "PENDING").length;

  return (
    <div style={{ padding: "24px", color: "var(--gray-100)", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: "10px" }}>
            <i className="fas fa-calendar-star" style={{ color: "#00d4ff" }} /> Event Submissions & Tickets
          </h1>
          <p style={{ color: "var(--gray-60)", fontSize: "0.9rem", marginTop: "4px" }}>
            Rynex Eclipse 2026 — Competitor Tickets & Sponsorship Proposals
          </p>
        </div>

        <button
          type="button"
          onClick={fetchSubmissions}
          style={{
            background: "var(--gray-10)",
            border: "1px solid var(--gray-20)",
            color: "var(--gray-100)",
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "0.85rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <i className="fas fa-rotate" /> Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        <div style={{ background: "var(--gray-10)", border: "1px solid var(--gray-20)", padding: "20px", borderRadius: "8px" }}>
          <div style={{ fontSize: "0.8rem", color: "var(--gray-60)", textTransform: "uppercase" }}>Total Submissions</div>
          <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "#00d4ff", marginTop: "4px" }}>{totalCount}</div>
        </div>

        <div style={{ background: "var(--gray-10)", border: "1px solid var(--gray-20)", padding: "20px", borderRadius: "8px" }}>
          <div style={{ fontSize: "0.8rem", color: "var(--gray-60)", textTransform: "uppercase" }}>Competitor Tickets</div>
          <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "#00ffaa", marginTop: "4px" }}>{competitorsCount}</div>
        </div>

        <div style={{ background: "var(--gray-10)", border: "1px solid var(--gray-20)", padding: "20px", borderRadius: "8px" }}>
          <div style={{ fontSize: "0.8rem", color: "var(--gray-60)", textTransform: "uppercase" }}>Sponsor Proposals</div>
          <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "#a855f7", marginTop: "4px" }}>{sponsorsCount}</div>
        </div>

        <div style={{ background: "var(--gray-10)", border: "1px solid var(--gray-20)", padding: "20px", borderRadius: "8px" }}>
          <div style={{ fontSize: "0.8rem", color: "var(--gray-60)", textTransform: "uppercase" }}>Pending Review</div>
          <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "#eab308", marginTop: "4px" }}>{pendingCount}</div>
        </div>
      </div>

      {/* Filters & Search */}
      <div style={{ background: "var(--gray-10)", border: "1px solid var(--gray-20)", padding: "16px", borderRadius: "8px", marginBottom: "20px", display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            onClick={() => setFilterType("ALL")}
            style={{
              padding: "6px 14px",
              borderRadius: "4px",
              border: "1px solid var(--gray-20)",
              background: filterType === "ALL" ? "#00d4ff" : "transparent",
              color: filterType === "ALL" ? "#030712" : "var(--gray-100)",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
          >
            All ({submissions.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType("COMPETITOR")}
            style={{
              padding: "6px 14px",
              borderRadius: "4px",
              border: "1px solid var(--gray-20)",
              background: filterType === "COMPETITOR" ? "#00d4ff" : "transparent",
              color: filterType === "COMPETITOR" ? "#030712" : "var(--gray-100)",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
          >
            Competitors ({competitorsCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterType("SPONSOR")}
            style={{
              padding: "6px 14px",
              borderRadius: "4px",
              border: "1px solid var(--gray-20)",
              background: filterType === "SPONSOR" ? "#00d4ff" : "transparent",
              color: filterType === "SPONSOR" ? "#030712" : "var(--gray-100)",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
          >
            Sponsors ({sponsorsCount})
          </button>
        </div>

        <div style={{ flex: 1, minWidth: "240px" }}>
          <input
            type="text"
            placeholder="Search by ticket token, name, email, group/team..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid var(--gray-20)",
              background: "var(--white)",
              color: "var(--gray-100)",
              fontSize: "0.875rem",
              outline: "none",
            }}
          />
        </div>
      </div>

      {/* Table Section */}
      <div style={{ background: "var(--gray-10)", border: "1px solid var(--gray-20)", borderRadius: "8px", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--gray-60)" }}>Loading submissions...</div>
        ) : filteredSubmissions.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--gray-60)" }}>No event submissions found.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.875rem" }}>
              <thead>
                <tr style={{ background: "var(--gray-20)", color: "var(--gray-100)", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.5px" }}>
                  <th style={{ padding: "12px 16px" }}>Type / Ticket</th>
                  <th style={{ padding: "12px 16px" }}>Name / Contact</th>
                  <th style={{ padding: "12px 16px" }}>Group / Team / Org</th>
                  <th style={{ padding: "12px 16px" }}>Category / Tier</th>
                  <th style={{ padding: "12px 16px" }}>Status</th>
                  <th style={{ padding: "12px 16px" }}>Submitted Date</th>
                  <th style={{ padding: "12px 16px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((item) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid var(--gray-20)" }}>
                    <td style={{ padding: "14px 16px" }}>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: "4px",
                          marginRight: "8px",
                          background: item.type === "COMPETITOR" ? "rgba(0, 255, 170, 0.15)" : "rgba(168, 85, 247, 0.15)",
                          color: item.type === "COMPETITOR" ? "#00ffaa" : "#c084fc",
                        }}
                      >
                        {item.type}
                      </span>
                      {item.ticketToken && (
                        <div style={{ fontFamily: "monospace", fontSize: "0.8rem", color: "#00d4ff", marginTop: "4px" }}>
                          {item.ticketToken}
                        </div>
                      )}
                    </td>

                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontWeight: 600, color: "var(--gray-100)" }}>{item.name}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--gray-60)" }}>{item.email}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--gray-60)" }}>{item.phone}</div>
                    </td>

                    <td style={{ padding: "14px 16px", color: "var(--gray-90)", fontWeight: 500 }}>
                      {item.groupName || "Individual"}
                    </td>

                    <td style={{ padding: "14px 16px", color: "var(--gray-90)" }}>
                      {item.type === "COMPETITOR" ? item.category || "Participant" : item.tier || "Sponsor"}
                    </td>

                    <td style={{ padding: "14px 16px" }}>
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          border: "1px solid var(--gray-20)",
                          background: "var(--white)",
                          color:
                            item.status === "CONFIRMED"
                              ? "#10b981"
                              : item.status === "CONTACTED"
                              ? "#3b82f6"
                              : item.status === "CANCELLED"
                              ? "#ef4444"
                              : "#eab308",
                          fontWeight: 600,
                          fontSize: "0.8rem",
                          cursor: "pointer",
                        }}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONTACTED">CONTACTED</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>

                    <td style={{ padding: "14px 16px", color: "var(--gray-60)", fontSize: "0.8rem" }}>
                      {new Date(item.createdAt).toLocaleDateString()} {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>

                    <td style={{ padding: "14px 16px", textAlign: "right" }}>
                      <button
                        type="button"
                        onClick={() => setSelectedSubmission(item)}
                        style={{
                          background: "rgba(0, 212, 255, 0.1)",
                          border: "1px solid #00d4ff",
                          color: "#00d4ff",
                          padding: "4px 10px",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "0.8rem",
                          marginRight: "6px",
                        }}
                      >
                        View
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        style={{
                          background: "rgba(239, 68, 68, 0.1)",
                          border: "1px solid #ef4444",
                          color: "#ef4444",
                          padding: "4px 10px",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "0.8rem",
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Submission Detail Modal */}
      {selectedSubmission && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(6px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setSelectedSubmission(null)}
        >
          <div
            style={{
              background: "var(--gray-10)",
              border: "1px solid #00d4ff",
              borderRadius: "12px",
              maxWidth: "560px",
              width: "100%",
              padding: "28px",
              position: "relative",
              color: "var(--gray-100)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedSubmission(null)}
              style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", color: "var(--gray-60)", fontSize: "1.2rem", cursor: "pointer" }}
            >
              <i className="fas fa-times" />
            </button>

            <div style={{ fontSize: "0.8rem", textTransform: "uppercase", color: "#00d4ff", letterSpacing: "1px", marginBottom: "4px" }}>
              {selectedSubmission.type} SUBMISSION DETAILS
            </div>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 700, margin: "0 0 16px 0" }}>{selectedSubmission.name}</h2>

            {selectedSubmission.ticketToken && (
              <div style={{ background: "var(--white)", border: "1px dashed #00d4ff", padding: "10px", borderRadius: "6px", fontFamily: "monospace", color: "#00d4ff", textAlign: "center", marginBottom: "16px", fontWeight: "bold" }}>
                Ticket Token: {selectedSubmission.ticketToken}
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "0.9rem", lineHeight: "1.6", marginBottom: "20px" }}>
              <div><strong>Email:</strong> {selectedSubmission.email}</div>
              <div><strong>Phone:</strong> {selectedSubmission.phone}</div>
              <div><strong>Group / Team / Org:</strong> {selectedSubmission.groupName || "Individual"}</div>
              <div>
                <strong>{selectedSubmission.type === "COMPETITOR" ? "Category" : "Tier"}:</strong>{" "}
                {selectedSubmission.type === "COMPETITOR" ? selectedSubmission.category : selectedSubmission.tier}
              </div>
              <div><strong>Status:</strong> {selectedSubmission.status}</div>
              <div><strong>Submitted:</strong> {new Date(selectedSubmission.createdAt).toLocaleString()}</div>
            </div>

            {selectedSubmission.message && (
              <div style={{ marginBottom: "20px" }}>
                <strong style={{ fontSize: "0.9rem" }}>Message / Proposal Notes:</strong>
                <div style={{ background: "var(--white)", padding: "12px", borderRadius: "6px", fontSize: "0.875rem", color: "var(--gray-90)", marginTop: "6px", whiteSpace: "pre-wrap" }}>
                  {selectedSubmission.message}
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: "12px" }}>
              <a
                href={`mailto:${selectedSubmission.email}?subject=Rynex Eclipse 2026 Submission Follow-up&body=Hi ${selectedSubmission.name},`}
                style={{
                  flex: 1,
                  background: "#00d4ff",
                  color: "#030712",
                  padding: "10px",
                  borderRadius: "6px",
                  fontWeight: 700,
                  textAlign: "center",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                }}
              >
                <i className="fas fa-envelope" /> Send Email
              </a>

              <a
                href={`tel:${selectedSubmission.phone}`}
                style={{
                  flex: 1,
                  background: "var(--gray-20)",
                  color: "var(--gray-100)",
                  padding: "10px",
                  borderRadius: "6px",
                  fontWeight: 600,
                  textAlign: "center",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                }}
              >
                <i className="fas fa-phone" /> Call {selectedSubmission.phone}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
