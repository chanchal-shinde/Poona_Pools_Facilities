/**
 * ==============================================================================
 * ADMIN DASHBOARD OVERVIEW (src/admin/pages/AdminDashboard.jsx)
 * ==============================================================================
 * Student / Developer Guide:
 * Module A: Overview Dashboard
 * 
 * Features:
 * - Real-time statistics cards: Total, New, In Progress, and Completed Inquiries.
 * - Active services and pool types metrics.
 * - System connection status indicators (Express API and MongoDB Atlas).
 * - Quick action shortcuts for the owner.
 * ==============================================================================
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import api from '../../services/api';

export default function AdminDashboard() {
  const { admin } = useAdminAuth();
  const [healthStatus, setHealthStatus] = useState({
    status: 'checking',
    dbConnected: false,
    environment: 'development'
  });
  const [inquiryStats, setInquiryStats] = useState({
    total: 0,
    new: 0,
    inProgress: 0,
    contacted: 0,
    completed: 0,
    archived: 0,
    recent: []
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // Statistics cards connected to real-time MongoDB Atlas metrics
  const stats = [
    {
      id: 'total-inquiries',
      title: 'Total Inquiries',
      value: statsLoading ? '...' : String(inquiryStats.total || 0),
      subtitle: 'All customer quote submissions',
      badge: 'Live Atlas Data',
      color: '#0284c7',
      bgLight: '#e0f2fe',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      )
    },
    {
      id: 'new-inquiries',
      title: 'New Inquiries',
      value: statsLoading ? '...' : String(inquiryStats.new || 0),
      subtitle: 'Awaiting first contact',
      badge: (inquiryStats.new || 0) > 0 ? 'Requires Action' : 'All Clear',
      color: '#ea580c',
      bgLight: '#ffedd5',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      )
    },
    {
      id: 'pending-inquiries',
      title: 'In Progress',
      value: statsLoading ? '...' : String(inquiryStats.inProgress || 0),
      subtitle: 'Under site evaluation',
      badge: 'Active Projects',
      color: '#8b5cf6',
      bgLight: '#f3e8ff',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      )
    },
    {
      id: 'completed-inquiries',
      title: 'Completed',
      value: statsLoading ? '...' : String(inquiryStats.completed || 0),
      subtitle: 'Finalized / Contracted',
      badge: 'Archive',
      color: '#16a34a',
      bgLight: '#dcfce7',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      )
    },
    {
      id: 'active-services',
      title: 'Active Services',
      value: '7',
      subtitle: 'Available on public catalog',
      badge: 'Configured',
      color: '#0891b2',
      bgLight: '#cffafe',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      )
    },
    {
      id: 'active-pools',
      title: 'Pool Categories',
      value: '6',
      subtitle: 'Active gallery categories',
      badge: 'Configured',
      color: '#4f46e5',
      bgLight: '#e0e7ff',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      )
    }
  ];

  // Fetch backend health status and inquiry statistics
  useEffect(() => {
    async function checkHealthAndStats() {
      try {
        const res = await api.get('/api/health');
        if (res) {
          setHealthStatus({
            status: res.status,
            dbConnected: res.database?.connected || false,
            host: res.database?.host,
            environment: res.environment
          });
        }
      } catch {
        setHealthStatus({
          status: 'offline',
          dbConnected: false,
          environment: 'offline'
        });
      }

      try {
        setStatsLoading(true);
        const statsRes = await api.get('/api/admin/inquiries/stats');
        if (statsRes && statsRes.success && statsRes.data) {
          setInquiryStats(statsRes.data);
        }
      } catch (err) {
        console.error('Failed to load inquiry stats:', err);
      } finally {
        setStatsLoading(false);
      }
    }
    checkHealthAndStats();
  }, []);

  return (
    <div className="admin-dashboard-page">
      {/* Welcome Banner */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h1 className="h3 fw-bold text-dark mb-1">
            Welcome back, {admin?.name || 'Administrator'}
          </h1>
          <p className="text-secondary small mb-0">
            Poona Pools Facilities administrative control center. Review inquiries and manage business content.
          </p>
        </div>

        {/* System Status Pill */}
        <div className="d-flex align-items-center gap-2">
          <div
            className={`d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill border small fw-semibold ${
              healthStatus.dbConnected
                ? 'bg-success bg-opacity-10 text-success border-success'
                : 'bg-warning bg-opacity-10 text-dark border-warning'
            }`}
          >
            <span
              className="rounded-circle"
              style={{
                width: '8px',
                height: '8px',
                backgroundColor: healthStatus.dbConnected ? '#16a34a' : '#ea580c'
              }}
            />
            <span>
              {healthStatus.dbConnected
                ? 'MongoDB Atlas: Connected'
                : 'MongoDB Atlas: Reconnecting...'}
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="row g-3 mb-4">
        {stats.map((s) => (
          <div key={s.id} className="col-12 col-sm-6 col-xl-4">
            <div className="admin-card p-3 p-md-4 h-100 d-flex flex-column justify-content-between">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <div className="text-muted small fw-semibold text-uppercase mb-1">
                    {s.title}
                  </div>
                  <div className="fs-2 fw-bold text-dark lh-1">
                    {s.value}
                  </div>
                </div>
                <div
                  className="stat-icon-wrapper"
                  style={{ backgroundColor: s.bgLight, color: s.color }}
                >
                  {s.icon}
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                <span className="text-muted small">{s.subtitle}</span>
                <span className="badge bg-light text-secondary border small">
                  {s.badge}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Customer Inquiries Section */}
      <div className="admin-card p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 className="h5 fw-bold text-dark mb-1">Recent Customer Inquiries</h2>
            <p className="text-muted small mb-0">Latest quote requests submitted by prospective pool owners.</p>
          </div>
          <Link to="/admin/inquiries" className="btn btn-sm btn-primary">
            View All Inquiries &rarr;
          </Link>
        </div>

        {Array.isArray(inquiryStats.recent) && inquiryStats.recent.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-uppercase small" style={{ fontSize: '0.75rem', letterSpacing: '0.04em' }}>
                <tr>
                  <th scope="col" className="ps-3">Customer</th>
                  <th scope="col">Phone</th>
                  <th scope="col">Location</th>
                  <th scope="col">Pool / Service</th>
                  <th scope="col">Status</th>
                  <th scope="col" className="text-end pe-3">Date</th>
                </tr>
              </thead>
              <tbody className="border-top-0">
                {inquiryStats.recent.map((inq) => (
                  <tr key={inq._id}>
                    <td className="ps-3">
                      <div className="fw-bold text-dark">{inq.customerName}</div>
                      <span className="badge bg-light text-secondary border small font-monospace">
                        #{inq._id.slice(-6).toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <a href={`tel:${inq.phone}`} className="text-decoration-none text-secondary small fw-medium">
                        {inq.phone}
                      </a>
                    </td>
                    <td>
                      <span className="small text-dark">{inq.location}</span>
                    </td>
                    <td>
                      <div className="small fw-semibold text-dark">{inq.poolType || 'Residential'}</div>
                      <div className="small text-muted">{inq.service || 'Construction'}</div>
                    </td>
                    <td>
                      <span
                        className={`badge small px-2 py-1 ${
                          inq.status === 'New'
                            ? 'bg-warning text-dark'
                            : inq.status === 'In Progress'
                            ? 'bg-info text-dark'
                            : inq.status === 'Completed'
                            ? 'bg-success'
                            : 'bg-secondary'
                        }`}
                      >
                        {inq.status}
                      </span>
                    </td>
                    <td className="text-end pe-3 text-muted small">
                      {inq.createdAt
                        ? new Date(inq.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short'
                          })
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4 text-center text-muted bg-light rounded-3 small">
            No customer inquiries found. Inquiries submitted via the public website will appear here in real time.
          </div>
        )}
      </div>

      {/* Quick Action Shortcuts */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-lg-8">
          <div className="admin-card p-4 h-100">
            <h2 className="h5 fw-bold text-dark mb-3">Management Modules Overview</h2>
            <p className="text-muted small mb-4">
              Direct shortcuts to update website information without redeploying frontend code.
            </p>

            <div className="row g-3">
              <div className="col-12 col-md-6">
                <div className="p-3 rounded-3 border bg-light h-100">
                  <div className="fw-semibold text-dark mb-1">Customer Inquiries</div>
                  <p className="text-muted small mb-2">View submissions, change status to In Progress or Completed.</p>
                  <Link to="/admin/inquiries" className="btn btn-sm btn-outline-primary">
                    Manage Inquiries
                  </Link>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="p-3 rounded-3 border bg-light h-100">
                  <div className="fw-semibold text-dark mb-1">Services Catalog</div>
                  <p className="text-muted small mb-2">Add, edit, or toggle active swimming pool services.</p>
                  <Link to="/admin/services" className="btn btn-sm btn-outline-primary">
                    Manage Services
                  </Link>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="p-3 rounded-3 border bg-light h-100">
                  <div className="fw-semibold text-dark mb-1">Pricing Configuration</div>
                  <p className="text-muted small mb-2">Update base rates per cubic meter and pool type multipliers.</p>
                  <Link to="/admin/pricing" className="btn btn-sm btn-outline-primary">
                    Configure Pricing
                  </Link>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="p-3 rounded-3 border bg-light h-100">
                  <div className="fw-semibold text-dark mb-1">Business Settings</div>
                  <p className="text-muted small mb-2">Update phone, WhatsApp numbers, email, and Google Maps address.</p>
                  <Link to="/admin/settings" className="btn btn-sm btn-outline-primary">
                    Edit Settings
                  </Link>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="p-3 rounded-3 border bg-light h-100">
                  <div className="fw-semibold text-dark mb-1">Customer Feedback &amp; Reviews</div>
                  <p className="text-muted small mb-2">Moderate client ratings, approve verified reviews for public display.</p>
                  <Link to="/admin/feedback" className="btn btn-sm btn-outline-primary">
                    Moderate Reviews
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security & System Info Card */}
        <div className="col-12 col-lg-4">
          <div className="admin-card p-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <h2 className="h5 fw-bold text-dark mb-3">Security &amp; Session</h2>
              
              <ul className="list-unstyled small mb-4">
                <li className="d-flex justify-content-between py-2 border-bottom">
                  <span className="text-muted">Signed In As:</span>
                  <strong className="text-dark">{admin?.email}</strong>
                </li>
                <li className="d-flex justify-content-between py-2 border-bottom">
                  <span className="text-muted">Role:</span>
                  <span className="badge bg-primary text-uppercase">{admin?.role || 'admin'}</span>
                </li>
                <li className="d-flex justify-content-between py-2 border-bottom">
                  <span className="text-muted">Token Storage:</span>
                  <span className="text-success fw-semibold">HttpOnly Cookie</span>
                </li>
                <li className="d-flex justify-content-between py-2 border-bottom">
                  <span className="text-muted">Session Expiration:</span>
                  <span className="text-dark">7 Days</span>
                </li>
                <li className="d-flex justify-content-between py-2">
                  <span className="text-muted">Environment:</span>
                  <span className="text-dark text-capitalize">{healthStatus.environment}</span>
                </li>
              </ul>
            </div>

            <div className="p-3 rounded-3 bg-light border small text-muted">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-1 text-primary">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              Database-driven management: edits made in this dashboard update customer pages immediately.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
