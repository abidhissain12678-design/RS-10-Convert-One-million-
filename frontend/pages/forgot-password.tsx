import { useState } from 'react';
import { useRouter } from 'next/router';
import { getApiBaseUrl } from '../utils/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: new password
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const baseUrl = getApiBaseUrl();

      if (step === 1) {
        if (!email) {
          setMessage('Please enter your email address');
          setIsLoading(false);
          return;
        }
        console.log('📧 Sending forgot password request for:', email);
        const response = await fetch(`${baseUrl}/api/auth/forgot-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });
        const data = await response.json();
        if (response.ok) {
          setMessage('✅ OTP sent to your email. Check spam folder if not found.');
          setStep(2);
        } else {
          setMessage(data.message || data.error || 'Failed to send OTP. Please try again.');
          console.error('❌ Forgot password error:', data);
        }
      } else if (step === 2) {
        if (!otp) {
          setMessage('Please enter the OTP');
          setIsLoading(false);
          return;
        }
        console.log('🔐 Verifying OTP for:', email);
        const response = await fetch(`${baseUrl}/api/auth/verify-otp`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, otp }),
        });
        const data = await response.json();
        if (response.ok) {
          setMessage('✅ OTP verified! Now set your new password.');
          setStep(3);
        } else {
          setMessage(data.message || data.error || 'Invalid or expired OTP. Please try again.');
          console.error('❌ OTP verification error:', data);
        }
      } else if (step === 3) {
        if (!newPassword) {
          setMessage('Please enter a new password');
          setIsLoading(false);
          return;
        }
        if (newPassword.length < 6) {
          setMessage('Password must be at least 6 characters');
          setIsLoading(false);
          return;
        }
        console.log('🔄 Resetting password for:', email);
        const response = await fetch(`${baseUrl}/api/auth/reset-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, otp, newPassword }),
        });
        const data = await response.json();
        if (response.ok) {
          setMessage('✅ Password reset successfully! Redirecting to login...');
          setTimeout(() => router.push('/login'), 2000);
        } else {
          setMessage(data.message || data.error || 'Failed to reset password. Please try again.');
          console.error('❌ Password reset error:', data);
        }
      }
    } catch (error) {
      console.error('❌ Network error:', error);
      setMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={{ color: 'gold', textAlign: 'center', marginBottom: '10px' }}>
          {step === 1 ? '🔒 FORGOT PASSWORD' : step === 2 ? '🔐 VERIFY OTP' : '🔄 RESET PASSWORD'}
        </h1>
        <p style={{ color: '#888', textAlign: 'center', fontSize: '14px', marginBottom: '30px' }}>
          {step === 1 ? 'Enter your email address and we\'ll send you an OTP' :
           step === 2 ? 'Enter the 6-digit OTP sent to your email' :
           'Enter your new password'}
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          {step === 1 && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <input 
                type="email" 
                placeholder="example@mail.com" 
                required 
                style={styles.input} 
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                disabled={isLoading}
              />
            </div>
          )}

          {step === 2 && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>OTP (6 Digits)</label>
              <input 
                type="text" 
                placeholder="Enter 6-digit OTP" 
                required 
                maxLength={6}
                style={styles.input} 
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} 
                disabled={isLoading}
              />
            </div>
          )}

          {step === 3 && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>New Password</label>
              <input 
                type="password" 
                placeholder="Enter new password (min 6 characters)" 
                required 
                minLength={6}
                style={styles.input} 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)} 
                disabled={isLoading}
              />
            </div>
          )}

          {message && (
            <div style={{
              backgroundColor: message.includes('✅') ? '#4CAF50' : '#ff4444',
              color: '#fff',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              textAlign: 'center',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              {message}
            </div>
          )}

          <button type="submit" style={{...styles.submitBtn, opacity: isLoading ? 0.6 : 1, cursor: isLoading ? 'not-allowed' : 'pointer'}} disabled={isLoading}>
            {isLoading ? '⏳ PROCESSING...' : step === 1 ? '📤 SEND OTP' : step === 2 ? '✓ VERIFY OTP' : '🔄 RESET PASSWORD'}
          </button>
        </form>

        <div style={styles.links}>
          <span onClick={() => router.push('/login')} style={styles.link}>
            ← Back to Login
          </span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { 
    background: '#000', 
    minHeight: '100vh', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: '20px' 
  },
  card: { 
    background: '#111', 
    padding: '40px', 
    borderRadius: '20px', 
    border: '1px solid gold', 
    maxWidth: '400px', 
    width: '100%',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
  },
  form: { display: 'flex', flexDirection: 'column' as 'column', gap: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column' as 'column', gap: '8px' },
  label: { color: 'gold', fontSize: '12px', fontWeight: 'bold' as 'bold', letterSpacing: '1px' },
  input: { 
    background: '#000', 
    border: '1px solid #333', 
    color: '#fff', 
    padding: '12px', 
    borderRadius: '8px',
    fontSize: '15px',
    outline: 'none'
  },
  submitBtn: { 
    background: 'gold', 
    color: 'black', 
    border: 'none', 
    padding: '15px', 
    borderRadius: '8px', 
    fontWeight: 'bold' as 'bold', 
    cursor: 'pointer', 
    fontSize: '16px',
    marginTop: '10px'
  },
  links: { 
    textAlign: 'center' as 'center', 
    marginTop: '25px' 
  },
  link: { 
    color: '#666', 
    fontSize: '14px', 
    cursor: 'pointer', 
    textDecoration: 'underline'
  }
};

export default ForgotPassword;


