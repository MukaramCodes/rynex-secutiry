'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [loggedUser, setLoggedUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      setLoggedUser(data.user);
      setShowSuccessPopup(true);

      setTimeout(() => {
        router.push('/portal/dashboard');
        router.refresh();
      }, 1800);
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* SUCCESS LOGIN POPUP */}
      {showSuccessPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupCard}>
            <div className={styles.popupLogoContainer}>
              <div className={styles.logoPulseRing}></div>
              <Image
                src="/images/logo-transparent.png"
                alt="Rynex Security"
                width={72}
                height={72}
                className={styles.popupLogoImg}
                priority
              />
            </div>
            <div className={styles.accessGrantedBadge}>Access Granted</div>
            <h2 className={styles.popupTitle}>Welcome back!</h2>

            {loggedUser && (
              <div className={styles.userInfoBox}>
                <div className={styles.userName}>{loggedUser.name}</div>
                <div className={styles.userRoleBadge}>{loggedUser.role} Access</div>
                <div className={styles.userEmail}>{loggedUser.email}</div>
              </div>
            )}

            <div className={styles.loadingProgressContainer}>
              <div className={styles.loadingProgressBar}></div>
            </div>
            <div className={styles.popupStatusText}>Preparing your workspace...</div>
          </div>
        </div>
      )}

      {/* LEFT BRANDING PANEL */}
      <div className={styles.leftPanel}>
        <div className={styles.panelDecor}></div>
        <div className={styles.panelGrid}></div>

        <div className={styles.brandMark}>
          <div className={styles.brandLogoWrap}>
            <Image
              src="/images/logo-transparent.png"
              alt="Rynex Security"
              width={52}
              height={52}
              className={styles.brandLogo}
              priority
            />
          </div>
          <h1 className={styles.brandTitle}>Rynex Security</h1>
          <p className={styles.brandSubtitle}>
            Enterprise Security Operations Platform for Red Team, Blue Team & GRC professionals.
          </p>
        </div>

        <div className={styles.featureList}>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <i className="fas fa-shield-halved" aria-hidden="true"></i>
            </div>
            <span className={styles.featureText}>Zero-Trust Access Control</span>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <i className="fas fa-file-shield" aria-hidden="true"></i>
            </div>
            <span className={styles.featureText}>VAPT & SOC Report Management</span>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <i className="fas fa-scroll" aria-hidden="true"></i>
            </div>
            <span className={styles.featureText}>Full Audit Trail & Logging</span>
          </div>
        </div>
      </div>

      {/* RIGHT LOGIN PANEL */}
      <div className={styles.rightPanel}>
        <div className={styles.formWrapper}>
          {/* Mobile logo */}
          <div className={styles.mobileLogoRow}>
            <Image
              src="/images/logo-transparent.png"
              alt="Rynex Security"
              width={36}
              height={36}
              className={styles.mobileLogoImg}
            />
            <span className={styles.mobileLogoText}>Rynex Security</span>
          </div>

          <h2 className={styles.formHeading}>Sign in to your account</h2>
          <p className={styles.formSubheading}>
            Enter your credentials to access the Security Operations Portal.
          </p>

          <div className={styles.statusBar}>
            <span className={styles.statusDot}></span>
            All systems operational — Secure connection active
          </div>

          {error && (
            <div className={styles.errorBox}>
              <i className="fas fa-circle-exclamation" aria-hidden="true"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                Email address
              </label>
              <div className={styles.inputWrap}>
                <i className={`fas fa-envelope ${styles.inputIcon}`} aria-hidden="true"></i>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  placeholder="you@rynexsecurity.com"
                  required
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <div className={styles.inputWrap}>
                <i className={`fas fa-lock ${styles.inputIcon}`} aria-hidden="true"></i>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                  placeholder="••••••••••"
                  required
                  disabled={loading}
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? (
                <>
                  <span className={styles.submitSpinner}></span>
                  Signing in...
                </>
              ) : (
                <>
                  <i className="fas fa-arrow-right-to-bracket" aria-hidden="true"></i>
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className={styles.formFooter}>
            <i className="fas fa-lock" aria-hidden="true"></i>
            Restricted access
            <span className={styles.footerDivider}></span>
            IP addresses are logged
          </div>
        </div>
      </div>
    </div>
  );
}
