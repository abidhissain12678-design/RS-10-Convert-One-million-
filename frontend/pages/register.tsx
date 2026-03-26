import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const Register = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    city: '',
    phoneNumber: '',
    password: '',
    referralCode: ''
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showUrduModal, setShowUrduModal] = useState(false);

  // Auto-fill referral code from URL query
  useEffect(() => {
    if (router.query.ref) {
      setFormData(prev => ({
        ...prev,
        referralCode: router.query.ref as string
      }));
    }
  }, [router.query.ref]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.fullName || !formData.username || !formData.email || !formData.city || !formData.phoneNumber || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (!agreeToTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Phone validation (basic)
    const phoneRegex = /^[\d\-\+\(\)\s]+$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      setError('Please enter a valid phone number');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.fullName,
          username: formData.username,
          email: formData.email,
          city: formData.city,
          phone: formData.phoneNumber,
          password: formData.password,
          referredBy: formData.referralCode || undefined
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Registration successful, store token and user data, then redirect to dashboard
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/dashboard');
      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const navButton = (href: string, label: string) => (
    <a
      href={href}
      style={{
        color: '#FFFFFF',
        textDecoration: 'none',
        padding: '8px 14px',
        borderRadius: '8px',
        border: '1px solid rgba(255,255,255,0.26)',
        background: 'rgba(5, 16, 36, 0.72)',
        fontSize: '14px',
        margin: '0 5px'
      }}
    >
      {label}
    </a>
  );

  return (
    <div style={{
      background: 'linear-gradient(160deg, #0f1f3e, #06102a 50%, #02070f 100%)',
      backgroundImage: 'url("https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1500&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      color: '#F9D74D',
      paddingBottom: '80px',
      fontFamily: 'Inter, sans-serif',
      boxSizing: 'border-box'
    }}>
      <Head>
        <title>Register | Chain-10 Challenge</title>
      </Head>

      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 99,
        backdropFilter: 'blur(8px)',
        background: 'rgba(3,10,22,0.80)',
        borderBottom: '1px solid rgba(255,255,255,0.15)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '14px'
      }}>
        {navButton('/', 'Home')}
        {navButton('/register', 'Sign Up')}
        {navButton('/login', 'Login')}
        {navButton('#contact', 'Contact')}
        {navButton('#sport-team', 'Sport Team')}
      </header>

      <div style={{
        maxWidth: '500px',
        margin: '0 auto',
        border: '2px solid #FFD700',
        padding: '30px',
        borderRadius: '15px',
        backgroundColor: '#111',
        boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)',
        overflow: 'visible'
      }}>
        <h2 style={{
          color: '#FFD700',
          textAlign: 'center',
          fontSize: '28px',
          marginBottom: '30px',
          fontWeight: 'bold'
        }}>
          Join Chain-10 Challenge
        </h2>

        {error && (
          <div style={{
            backgroundColor: '#ff4444',
            color: '#fff',
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: 'bold',
              color: '#FFD700'
            }}>
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '2px solid #FFD700',
                backgroundColor: '#222',
                color: '#FFD700',
                fontSize: '16px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: 'bold',
              color: '#FFD700'
            }}>
              Username *
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '2px solid #FFD700',
                backgroundColor: '#222',
                color: '#FFD700',
                fontSize: '16px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              placeholder="Choose a username"
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: 'bold',
              color: '#FFD700'
            }}>
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '2px solid #FFD700',
                backgroundColor: '#222',
                color: '#FFD700',
                fontSize: '16px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              placeholder="Enter your email address"
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: 'bold',
              color: '#FFD700'
            }}>
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '2px solid #FFD700',
                backgroundColor: '#222',
                color: '#FFD700',
                fontSize: '16px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              placeholder="Create a password (min 6 characters)"
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: 'bold',
              color: '#FFD700'
            }}>
              City *
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '2px solid #FFD700',
                backgroundColor: '#222',
                color: '#FFD700',
                fontSize: '16px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              placeholder="Enter your city"
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: 'bold',
              color: '#FFD700'
            }}>
              Phone Number *
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '2px solid #FFD700',
                backgroundColor: '#222',
                color: '#FFD700',
                fontSize: '16px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: 'bold',
              color: '#FFD700'
            }}>
              Referral Code (Optional)
            </label>
            <input
              type="text"
              name="referralCode"
              value={formData.referralCode}
              onChange={handleInputChange}
              readOnly={!!router.query.ref}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '2px solid #FFD700',
                backgroundColor: router.query.ref ? '#333' : '#222',
                color: '#FFD700',
                fontSize: '16px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              placeholder="Enter referral code if you have one"
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              color: '#FFD700'
            }}>
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                style={{
                  marginRight: '10px',
                  width: '18px',
                  height: '18px',
                  accentColor: '#FFD700'
                }}
                required
              />
              <span style={{ fontSize: '14px', lineHeight: '1.4' }}>
                I agree to the <span onClick={() => setShowUrduModal(true)} style={{ color: '#FFD700', textDecoration: 'underline', cursor: 'pointer' }}>Terms and Conditions</span>
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '15px',
              backgroundColor: '#FFD700',
              color: '#000',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '18px',
              transition: 'all 0.3s ease',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          marginTop: '20px',
          color: '#FFD700'
        }}>
          <p>Already have an account? <a href="/login" style={{ color: '#FFD700', textDecoration: 'underline' }}>Login here</a></p>
        </div>
      </div>

      {/* Urdu Modal Notice */}
      {showUrduModal && (
        <div style={modalStyles.modalOverlay}>
          <div style={modalStyles.modalContent}>
            <h2 style={modalStyles.modalHeading}>ملینیر چیلنج کی اہم تفصیلات</h2>
            <div style={modalStyles.modalText}>
              <p>ملینیر چیلنج میں خوش آمدید! چیلنج شروع کرنے سے پہلے یہ باتیں غور سے پڑھ لیں:</p>
              
              <div style={{marginBottom: '15px'}}>
                <h4 style={{color: '#FFD700', fontWeight: 'bold', margin: '10px 0'}}>انٹری اور چیلنج</h4>
                <p>چیلنج میں شامل ہونے کی ا نٹری  فیس صرف 10 روپے ہے (ناقابلِ واپسی)۔ آپ نے صرف 2 گھنٹے میں اپنے 11 ممبرز پورے کرنے ہیں۔</p>
              </div>
              
              <div style={{marginBottom: '15px'}}>
                <h4 style={{color: '#FFD700', fontWeight: 'bold', margin: '10px 0'}}>یہ  اتنی بڑی ٹیم کیسے بنے گئی؟</h4>
                <p>
(پہلا لیول ۔آپ کے 11 میمبر)   

(سیکنڈ لیول۔آپ کے  11 میمبر جب اپنے  اپنے 11 میمبر کریں گے تو 121میمبر مکمل ہو جا ئیں۔)

(تیسرا لیول۔ 121 میمبر    کے اپنے اپنے 11 میمبر  1331 میمبر مکمل ہو ں گئے۔)

(چوتھا لیول۔ 1331میمبر  کے اپنے اپنے 11 میمبر 14641 میمبر مکمل ہو جائیں گئے۔)

(پانچواں لیول ۔ 14641 میمبر کے اپنے اپنے 11 میمبر 161051میمبر مکمل ہو جائیں گئے۔)

(چھٹا لیول ،ونر لیول۔ 161051میمبر کے اپنے اپنے  11 میمبر 1771561میمبر مکمل ہو جائیں گئے۔)

(اس طرح آپ  چھٹے لیول پر 1000000 جیت جائیں گئے۔)

اور اس چیلنج کی سب سے منفرد  چیز جو ٹارگٹ کو دنوں میں مکمل کرے گئ۔ وہ  ٹائمر ہے جس میں میمبر نے 2 گھنٹے کے اندر  اپنے 11 میمبر مکمل کرنے ہیں
</p>
              </div>
              
              <div style={{marginBottom: '15px'}}>
                <h4 style={{color: '#FFD700', fontWeight: 'bold', margin: '10px 0'}}>لیول سسٹم کی طاقت (10 سے 10 لاکھ تک)</h4>
                <p>جب آپ اپنے 11 ممبرز پورے کریں گے تو آپ کا کام ختم! اب وہ 11 ممبرز اپنے 11، 11 ممبرز بنائیں گے جو دیکھتے ہی دیکھتے 121 (لیول 1) پر پہنچ جائیں گے۔ اسی طرح جب ہر ممبر اپنی 11 کی ٹیم بناتا جائے گا تو آپ کی شروع کی گئی چین 1 ملین (10 لاکھ) کو چھو لے گی اور آپ 10 روپے سے 10 لاکھ روپے جیت جائیں گے۔</p>
              </div>
              
              <div style={{marginBottom: '15px'}}>
                <h4 style={{color: '#FFD700', fontWeight: 'bold', margin: '10px 0'}}>وارننگ (انتہائی ضروری)</h4>
                <p>غلط ٹرانزیکشن آئی ڈی (TID) یا جعلی سکرین شاٹ بھیجنے والے کو فوری طور پر بلاک کر دیا جائے گا اور ہمیشہ کے لیے چین سے ریموو (خارج) کر دیا جائے گا۔</p>
              </div>
              
              <p>یہ چیلنج آپ کی زندگی بدل سکتا ہے، بس 11 لوگوں سے شروعات کریں!</p>
            </div>
            <button onClick={() => setShowUrduModal(false)} style={modalStyles.modalButton}>میں چیلنج کے لیے تیار ہوں</button>
          </div>
        </div>
      )}

      <footer style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 95,
        background: 'rgba(3, 10, 22, 0.92)',
        borderTop: '1px solid rgba(255,255,255,0.18)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 8px',
        backdropFilter: 'blur(8px)'
      }}>
        {navButton('/', 'Home')}
        {navButton('/register', 'Sign Up')}
        {navButton('/login', 'Login')}
        {navButton('#contact', 'Contact')}
        {navButton('#sport-team', 'Sport Team')}
      </footer>
    </div>
  );
};

const modalStyles = {
  modalOverlay: { position: 'fixed' as 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modalContent: { background: '#111', padding: '40px', borderRadius: '15px', border: '2px solid #FFD700', maxWidth: '600px', width: '90%', maxHeight: '80vh', overflowY: 'auto' as 'auto', fontFamily: "'Noto Nastaliq Urdu', serif", lineHeight: 3.0, direction: 'rtl' as 'rtl', textAlign: 'right' as 'right' },
  modalHeading: { color: '#FFD700', fontSize: '28px', textAlign: 'center' as 'center', marginBottom: '20px', fontWeight: 'bold' as 'bold', borderBottom: '2px solid #FFD700', paddingBottom: '10px' },
  modalText: { color: 'white', fontSize: '24px', marginBottom: '20px', fontWeight: 'normal' as 'normal' },
  modalButton: { background: '#FFD700', color: 'black', border: 'none', padding: '12px 30px', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold' as 'bold', cursor: 'pointer', display: 'block', margin: '0 auto' }
};

export default Register;