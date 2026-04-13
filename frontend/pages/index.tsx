import React from 'react';

const Index: React.FC = () => {
  const navButton = (href: string, label: string) => (
    <a
      href={href}
      style={{
        color: '#fff',
        textDecoration: 'none',
        padding: '6px 10px',
        border: '1px solid rgba(255,255,255,0.3)',
        borderRadius: '6px',
        display: 'inline-block',
        margin: '0 4px',
        backdropFilter: 'blur(4px)',
        transition: 'all 0.25s ease',
        background: 'rgba(0,0,0,0.45)',
        fontSize: '12px',
        fontWeight: '500',
        cursor: 'pointer'
      }}
    >
      {label}
    </a>
  );

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0f1419 0%, #1a1f26 50%, #0a0e12 100%)',
      color: '#F8D94A',
      minHeight: '100vh',
      fontFamily: 'Inter, sans-serif',
      overflowX: 'hidden',
      position: 'relative',
      backgroundImage: 'url("https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1920&q=1080")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundBlendMode: 'overlay',
      backgroundAttachment: 'fixed'
    }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 15px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(3, 10, 22, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.12)',
        boxShadow: '0 2px 20px rgba(0,0,0,0.3)',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <div style={{
          fontSize: '1.1rem',
          fontWeight: 800,
          color: '#FFD700',
          letterSpacing: '1px',
          whiteSpace: 'nowrap'
        }}>
          MILLION HUB
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
          {navButton('/register', 'Sign Up')}
          {navButton('/login', 'Login')}
        </div>
      </header>

      <div style={{
        display: 'flex',
        minHeight: 'calc(100vh - 80px)',
        width: '100%',
        flexDirection: 'column',
        flexWrap: 'wrap'
      }} className="split-container">

        {/* Landing Page Section */}
        <div style={{
          flex: 1,
          transition: 'all 0.5s ease',
          overflowY: 'auto',
          background: 'rgba(15, 20, 25, 0.95)',
          backdropFilter: 'blur(10px)',
          width: '100%',
          minWidth: '100%'
        }} className="landing-section">
          <main style={{
            width: '100%'
          }}>
        {/* Hero Section */}
        <section id="home" style={{
          textAlign: 'center',
          padding: '40px 15px 40px',
          maxWidth: '1200px',
          margin: '0 auto',
          position: 'relative',
          width: '100%',
          boxSizing: 'border-box'
        }} className="hero-section">
          <div style={{
            background: 'rgba(0,0,0,0.4)',
            padding: '30px 20px',
            borderRadius: '15px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
          }}>
            <h1 style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              marginBottom: '15px',
              color: '#FFD700',
              textShadow: '0 0 30px rgba(255, 215, 0, 0.5)',
              fontWeight: '800',
              letterSpacing: '-1px'
            }} className="hero-title">
              MILLION HUB
            </h1>
            <h2 style={{
              fontSize: 'clamp(1.3rem, 4vw, 2.2rem)',
              marginBottom: '15px',
              color: '#FFD700',
              fontWeight: 'bold',
              textShadow: '0 0 10px rgba(255, 215, 0, 0.5)'
            }} className="hero-subtitle">
              💰 RS 10 to Convert RS 1,000,000 💰
            </h2>
            <p style={{
              fontSize: 'clamp(0.95rem, 2vw, 1.3rem)',
              color: '#E8E8E8',
              maxWidth: '800px',
              margin: '0 auto 25px',
              lineHeight: 1.6,
              fontWeight: '300'
            }} className="hero-description">
              Transform your financial future through exponential networking. Start with just 10 rupees and build a network that reaches 1 million members.
            </p>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', padding: '0 10px' }}>
              <a
                href="/register"
                style={{
                  background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                  color: '#000',
                  padding: '16px 32px',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  fontWeight: '700',
                  borderRadius: '50px',
                  display: 'inline-block',
                  boxShadow: '0 8px 25px rgba(255, 215, 0, 0.4)',
                  transition: 'all 0.3s ease',
                  border: '3px solid #FFD700',
                  cursor: 'pointer'
                }}
              >
                🚀 Start Your Journey
              </a>
              <a
                href="/login"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  color: '#FFD700',
                  padding: '16px 32px',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  fontWeight: '600',
                  borderRadius: '50px',
                  display: 'inline-block',
                  border: '2px solid #FFD700',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
              >
                🔑 Login to Account
              </a>
            </div>
          </div>
        </section>

        <EarningTasks />

        {/* Network Visualization */}
        <section id="how-it-works" style={{
          padding: '50px 15px',
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(5px)',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
            <h2 style={{
              textAlign: 'center',
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              color: '#FFD700',
              marginBottom: '15px',
              fontWeight: '700'
            }}>
              Your Network Growth Path
            </h2>
            <p style={{
              textAlign: 'center',
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: '#CCC',
              marginBottom: '40px',
              maxWidth: '700px',
              margin: '0 auto 40px'
            }}>
              Watch your network expand exponentially. Each level multiplies by 11, creating unlimited earning potential.
            </p>

            <NetworkVisualization />
          </div>
        </section>

        {/* Million Hub Network Explosion Card */}
        <section style={{
          padding: '40px 15px',
          background: 'rgba(15, 20, 25, 0.95)',
          backdropFilter: 'blur(10px)',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 215, 0, 0.05) 100%)',
              border: '1px solid rgba(255, 215, 0, 0.3)',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(255, 215, 0, 0.1)',
              transition: 'all 0.3s ease',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '30px',
              alignItems: 'center',
              padding: 'clamp(20px, 5vw, 30px)'
            }}>
              {/* Image */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <img
                  src="/million-hub-network-explosion.jpg.png"
                  alt="Million Hub Earning Plan"
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                    borderRadius: '12px',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                    display: 'block'
                  }}
                />
              </div>

              {/* Content */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
                justifyContent: 'center'
              }}>
                <p style={{
                  fontSize: 'clamp(0.85rem, 1.5vw, 1rem)',
                  color: '#FFD700',
                  fontWeight: '600',
                  margin: '0',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  See how your RS 10 starts a journey to RS 1,000,000
                </p>
                <h3 style={{
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  color: '#FFD700',
                  fontWeight: '700',
                  margin: '0 0 10px 0',
                  lineHeight: '1.2'
                }}>
                  Join Million Hub today!
                </h3>
                <p style={{
                  fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
                  color: '#CCC',
                  margin: '0',
                  lineHeight: '1.6'
                }}>
                  Transform RS 10 into RS 1,000,000 through our unique networking model.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="why-choose-section" style={{
          padding: '60px 15px',
          background: 'rgba(15, 28, 44, 0.8)',
          backdropFilter: 'blur(10px)',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            <h2 style={{
              textAlign: 'center',
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              color: '#FFD700',
              marginBottom: '50px',
              fontWeight: '700'
            }}>
              Why Choose Million Hub?
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '30px'
            }}>
              <FeatureCard
                icon="🌐"
                title="Exponential Growth"
                description="Each level multiplies by 11, creating massive network expansion and unlimited earning potential."
              />
              <FeatureCard
                icon="⚡"
                title="Fast & Secure"
                description="Lightning-fast processing with bank-level security. Your data and earnings are always protected."
              />
              <FeatureCard
                icon="🎯"
                title="Strategic Networking"
                description="Build meaningful connections that create lasting value and financial freedom for everyone."
              />
              <FeatureCard
                icon="💰"
                title="Low Entry Barrier"
                description="Start with just 10 rupees. No hidden fees, no complicated requirements."
              />
              <FeatureCard
                icon="🏆"
                title="Proven System"
                description="Thousands have already achieved financial freedom. Join the success stories."
              />
              <FeatureCard
                icon="📞"
                title="24/7 Support"
                description="Round-the-clock customer support to help you succeed at every step."
              />
            </div>
          </div>
        </section>


        {/* CTA Section */}
        <section style={{
          padding: '60px 20px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(15, 28, 44, 0.9), rgba(26, 35, 50, 0.9))'
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              color: '#FFD700',
              marginBottom: '15px',
              fontWeight: '700'
            }}>
              Ready to Transform Your Future?
            </h2>
            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.3rem)',
              color: '#E8E8E8',
              marginBottom: '30px',
              lineHeight: 1.6
            }}>
              Join thousands who have started their journey to financial freedom. Your success story begins with one simple step.
            </p>
            <a href="/register" style={{
              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              color: '#000',
              padding: 'clamp(14px 28px, 5vw, 20px 50px)',
              textDecoration: 'none',
              fontSize: 'clamp(1rem, 2vw, 1.4rem)',
              fontWeight: '700',
              borderRadius: '50px',
              display: 'inline-block',
              boxShadow: '0 10px 30px rgba(255, 215, 0, 0.4)',
              transition: 'all 0.3s ease',
              border: '3px solid #FFD700'
            }}>
              🚀 Join Million Hub Now
            </a>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" style={{
          padding: '50px 15px',
          textAlign: 'center',
          background: 'rgba(0, 0, 0, 0.8)',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <h2 style={{ color: '#FFD700', fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', marginBottom: '20px' }}>Contact Us</h2>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            flexWrap: 'wrap',
            color: '#CCC',
            fontSize: 'clamp(0.9rem, 2vw, 1rem)'
          }}>
            <div>📧 support@millionhub.com</div>
            <div>📱 +92 3299545214</div>
            <div>💬 WhatsApp: +92 300 1234567</div>
          </div>
        </section>
      </main>
        </div>
      </div>
    </div>
  );
};

// Register Form Component
const RegisterForm: React.FC = () => {
  const [formData, setFormData] = React.useState({
    fullName: '',
    username: '',
    email: '',
    city: '',
    phoneNumber: '',
    password: '',
    referralCode: ''
  });
  const [agreeToTerms, setAgreeToTerms] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');

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

    setIsLoading(true);

    try {
      const response = await fetch('https://rs-10-convert-one-million.onrender.com/api/auth/register', {
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
        // Registration successful
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = '/dashboard';
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('An error occurred during registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '400px',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '20px',
      padding: '20px',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      margin: '0 auto'
    }} className="register-form">
      <h2 style={{
        color: '#FFD700',
        textAlign: 'center',
        marginBottom: '10px',
        fontSize: '1.8rem',
        fontWeight: '700'
      }}>
        🚀 Join Million Hub
      </h2>
      <p style={{
        color: '#CCC',
        textAlign: 'center',
        marginBottom: '20px',
        fontSize: '0.85rem'
      }}>
        Start your journey to financial freedom
      </p>

      {error && (
        <div style={{
          background: 'rgba(231, 76, 60, 0.1)',
          border: '1px solid #E74C3C',
          borderRadius: '8px',
          padding: '10px',
          marginBottom: '20px',
          color: '#E74C3C',
          fontSize: '0.9rem'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name *"
            value={formData.fullName}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '12px 15px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#FFF',
              fontSize: '0.9rem',
              outline: 'none'
            }}
          />
        </div>

        <div>
          <input
            type="text"
            name="username"
            placeholder="Username *"
            value={formData.username}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '12px 15px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#FFF',
              fontSize: '0.9rem',
              outline: 'none'
            }}
          />
        </div>

        <div>
          <input
            type="email"
            name="email"
            placeholder="Email Address *"
            value={formData.email}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '12px 15px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#FFF',
              fontSize: '0.9rem',
              outline: 'none'
            }}
          />
        </div>

        <div>
          <input
            type="text"
            name="city"
            placeholder="City *"
            value={formData.city}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '12px 15px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#FFF',
              fontSize: '0.9rem',
              outline: 'none'
            }}
          />
        </div>

        <div>
          <input
            type="tel"
            name="phoneNumber"
            placeholder="Phone Number *"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '12px 15px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#FFF',
              fontSize: '0.9rem',
              outline: 'none'
            }}
          />
        </div>

        <div>
          <input
            type="password"
            name="password"
            placeholder="Password *"
            value={formData.password}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '12px 15px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#FFF',
              fontSize: '0.9rem',
              outline: 'none'
            }}
          />
        </div>

        <div>
          <input
            type="text"
            name="referralCode"
            placeholder="Referral Code (Optional)"
            value={formData.referralCode}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '12px 15px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#FFF',
              fontSize: '0.9rem',
              outline: 'none'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="checkbox"
            id="agreeToTerms"
            checked={agreeToTerms}
            onChange={(e) => setAgreeToTerms(e.target.checked)}
            style={{ width: '16px', height: '16px' }}
          />
          <label htmlFor="agreeToTerms" style={{ color: '#CCC', fontSize: '0.8rem', cursor: 'pointer' }}>
            I agree to the <span style={{ color: '#FFD700' }}>Terms & Conditions</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '15px',
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            color: '#000',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '700',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.7 : 1,
            transition: 'all 0.3s ease'
          }}
        >
          {isLoading ? 'Creating Account...' : '🚀 Start Your Journey'}
        </button>
      </form>
    </div>
  );
};

// Login Form Component
const LoginForm: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('https://rs-10-convert-one-million.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        window.location.href = '/dashboard';
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '400px',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '20px',
      padding: '20px',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      margin: '0 auto'
    }} className="login-form">
      <h2 style={{
        color: '#FFD700',
        textAlign: 'center',
        marginBottom: '10px',
        fontSize: '1.8rem',
        fontWeight: '700'
      }}>
        🔑 Welcome Back
      </h2>
      <p style={{
        color: '#CCC',
        textAlign: 'center',
        marginBottom: '20px',
        fontSize: '0.85rem'
      }}>
        Login to your Million Hub account
      </p>

      {error && (
        <div style={{
          background: 'rgba(231, 76, 60, 0.1)',
          border: '1px solid #E74C3C',
          borderRadius: '8px',
          padding: '10px',
          marginBottom: '20px',
          color: '#E74C3C',
          fontSize: '0.9rem'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px 15px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#FFF',
              fontSize: '0.9rem',
              outline: 'none'
            }}
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px 15px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#FFF',
              fontSize: '0.9rem',
              outline: 'none'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '15px',
            background: 'linear-gradient(135deg, #5BC0EB, #2980B9)',
            color: '#FFF',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '700',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.7 : 1,
            transition: 'all 0.3s ease'
          }}
        >
          {isLoading ? 'Logging in...' : '🔑 Login'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button
          onClick={() => {
            // This would need to be passed down or use context
            // For now, just show a message
            alert('Forgot password functionality would be implemented here');
          }}
          style={{
            background: 'none',
            border: 'none',
            color: '#5BC0EB',
            cursor: 'pointer',
            fontSize: '0.9rem',
            textDecoration: 'underline'
          }}
        >
          Forgot Password?
        </button>
      </div>
    </div>
  );
};

const EarningTasks: React.FC = () => {
  const cards = [
    { icon: '📺', title: 'Watch Videos', description: 'YouTube, TikTok, Instagram' },
    { icon: '👍', title: 'Like Posts', description: 'Social Media Posts' },
    { icon: '📺', title: 'Subscribe', description: 'YouTube Channels' },
    { icon: '👥', title: 'Follow Accounts', description: 'Instagram, Twitter' },
    { icon: '🔗', title: 'Share Content', description: 'Posts & Videos' },
    { icon: '✍️', title: 'Write Comments', description: 'Engage with Content' },
    { icon: '🎁', title: 'Daily Rewards', description: 'Complete quick tasks daily' },
    { icon: '📱', title: 'App Installs', description: 'Install and try apps' },
    { icon: '🌐', title: 'Website Visits', description: 'Visit partner websites' }
  ];

  return (
    <section style={{
      padding: '60px 15px',
      background: 'transparent',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <h2 style={{
          textAlign: 'center',
          fontSize: 'clamp(2rem, 4vw, 2.8rem)',
          color: '#FFD700',
          marginBottom: '15px',
          fontWeight: '800'
        }}>
          Earn Money Online
        </h2>
        <p style={{
          textAlign: 'center',
          fontSize: 'clamp(1rem, 2vw, 1.15rem)',
          color: '#DDD',
          maxWidth: '850px',
          margin: '0 auto 35px',
          lineHeight: 1.6
        }}>
          Complete simple tasks and earn money instantly. Watch videos, like posts, app install, Survey, Website Visit, subscribe to channels, follow accounts, Write comment, and share content to start earning today!
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px'
        }}>
          {cards.map((card) => (
            <div key={card.title} style={{
              background: '#1a1a1a',
              borderRadius: '18px',
              padding: '25px',
              boxShadow: '0 20px 45px rgba(0,0,0,0.35), 0 0 16px rgba(255, 215, 0, 0.12)',
              border: '1px solid rgba(255, 215, 0, 0.18)',
              minHeight: '190px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '18px',
                background: 'rgba(255, 215, 0, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
                marginBottom: '18px',
                color: '#FFD700'
              }}>
                {card.icon}
              </div>
              <h3 style={{
                fontSize: '1.2rem',
                color: '#FFF',
                marginBottom: '10px'
              }}>
                {card.title}
              </h3>
              <p style={{
                fontSize: '0.95rem',
                color: '#CCC',
                lineHeight: 1.7,
                margin: 0
              }}>
                {card.description}
              </p>
            </div>
          ))}
        </div>
        <div style={{
          marginTop: '30px',
          background: '#1a1a1a',
          borderRadius: '22px',
          padding: '30px',
          boxShadow: '0 24px 70px rgba(0,0,0,0.35), 0 0 20px rgba(255, 215, 0, 0.12)',
          border: '1px solid rgba(255, 215, 0, 0.2)',
          textAlign: 'center'
        }}>
          <h3 style={{
            color: '#FFD700',
            fontSize: '1.4rem',
            fontWeight: '700',
            marginBottom: '12px'
          }}>
            Minimum Payout: RS 100
          </h3>
          <p style={{
            color: '#CCC',
            fontSize: '1rem',
            lineHeight: 1.7,
            margin: 0
          }}>
            Payment Methods: JazzCash / EasyPaisa / Bank Account / PayPal / Payoneer.
          </p>
        </div>
      </div>
    </section>
  );
};

const NetworkVisualization: React.FC = () => {
  const [showConfetti, setShowConfetti] = React.useState(false);

  React.useEffect(() => {
    // Trigger confetti animation on mount
    setTimeout(() => setShowConfetti(true), 500);
  }, []);

  return (
    <div className="network-visualization" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '30px',
      padding: '40px 20px',
      maxWidth: '1200px',
      margin: '0 auto',
      position: 'relative',
      background: 'radial-gradient(ellipse at center, rgba(255,215,0,0.05) 0%, transparent 70%)',
      borderRadius: '25px',
      border: '2px solid rgba(255, 215, 0, 0.2)'
    }}>
      {/* Confetti Animation Elements */}
      {showConfetti && (
        <>
          <Confetti delay={0} left="10%" />
          <Confetti delay={200} left="20%" />
          <Confetti delay={400} left="30%" />
          <Confetti delay={600} left="40%" />
          <Confetti delay={800} left="60%" />
          <Confetti delay={1000} left="70%" />
          <Confetti delay={1200} left="80%" />
          <Confetti delay={1400} left="90%" />
        </>
      )}

      {/* Top Level - The Winner with Trophy */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px'
        }}>
          {/* Winner Character */}
          <div style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            gap: '30px',
            alignItems: 'flex-end',
            marginBottom: '20px'
          }} className="winner-characters">
            {/* Celebratory User */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px'
            }}>
              <div style={{
                width: '30%',
                height: '30%',
                minWidth: '80px',
                minHeight: '80px',
                maxWidth: '120px',
                maxHeight: '120px',
                aspectRatio: '1',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#000',
                fontSize: 'calc(2.5vw + 1rem)',
                fontWeight: '700',
                boxShadow: '0 15px 40px rgba(255, 215, 0, 0.5), inset -2px -2px 5px rgba(0,0,0,0.2)',
                border: '5px solid #FFF',
                animation: 'pulse 2s infinite'
              }} className="champion-circle">
                🏆
              </div>
              <div style={{
                color: '#FFD700',
                fontSize: '14px',
                fontWeight: '600',
                textAlign: 'center'
              }}>
                CHAMPION
              </div>
            </div>

            {/* Trophy with Money */}
            <div style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '15px'
            }}>
              {/* Large Trophy */}
              <div style={{
                width: '120px',
                height: '140px',
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                borderRadius: '20px 20px 10px 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '5px',
                boxShadow: '0 20px 50px rgba(255, 215, 0, 0.6), inset -3px -3px 10px rgba(0,0,0,0.3)',
                border: '3px solid #FFF',
                position: 'relative',
                overflow: 'hidden'
              }} className="trophy">
                {/* Money inside trophy */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                  animation: 'shimmer 2s infinite'
                }} />
                <div style={{
                  fontSize: '12px',
                  color: '#000',
                  fontWeight: '700',
                  textAlign: 'center',
                  zIndex: 2
                }} className="prize-text">
                  💰 PRIZE
                </div>
                <div style={{
                  fontSize: '24px',
                  fontWeight: '800',
                  color: '#000',
                  textShadow: '0 2px 4px rgba(255,255,255,0.5)',
                  zIndex: 2
                }} className="amount">
                  $1M
                </div>
                <div style={{
                  fontSize: '10px',
                  color: '#000',
                  fontWeight: '600',
                  zIndex: 2
                }} className="won-text">
                  💎 WON
                </div>
              </div>

              {/* Money Icons Around Trophy */}
              <div style={{
                position: 'absolute',
                top: '-15px',
                left: '-20px',
                fontSize: '20px',
                animation: 'float 3s ease-in-out infinite'
              }}>
                💵
              </div>
              <div style={{
                position: 'absolute',
                top: '-10px',
                right: '-25px',
                fontSize: '20px',
                animation: 'float 3s ease-in-out infinite 0.5s'
              }}>
                💴
              </div>
              <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '-30px',
                fontSize: '20px',
                animation: 'float 3s ease-in-out infinite 1s'
              }}>
                💶
              </div>
              <div style={{
                position: 'absolute',
                bottom: '20px',
                right: '-30px',
                fontSize: '20px',
                animation: 'float 3s ease-in-out infinite 1.5s'
              }}>
                💰
              </div>
            </div>

            {/* Celebratory User */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px'
            }}>
              <div style={{
                width: '30%',
                height: '30%',
                minWidth: '80px',
                minHeight: '80px',
                maxWidth: '120px',
                maxHeight: '120px',
                aspectRatio: '1',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#000',
                fontSize: 'calc(2.5vw + 1rem)',
                fontWeight: '700',
                boxShadow: '0 15px 40px rgba(255, 215, 0, 0.5), inset -2px -2px 5px rgba(0,0,0,0.2)',
                border: '5px solid #FFF',
                animation: 'pulse 2s infinite 0.5s'
              }} className="success-circle">
                🤝
              </div>
              <div style={{
                color: '#FFD700',
                fontSize: '14px',
                fontWeight: '600',
                textAlign: 'center'
              }}>
                SUCCESS
              </div>
            </div>
          </div>

          {/* Main Title */}
          <div style={{
            textAlign: 'center'
          }} className="winner-title">
            <h3 style={{
              color: '#FFD700',
              fontSize: '28px',
              fontWeight: '800',
              margin: '10px 0 5px 0',
              textShadow: '0 0 20px rgba(255, 215, 0, 0.6)',
              letterSpacing: '1px'
            }}>
              🎉 1 USER (WINNER) 🎉
            </h3>
            <p style={{
              color: '#5BC0EB',
              fontSize: '14px',
              fontWeight: '600',
              margin: 0
            }}>
              Your exponential journey begins here
            </p>
          </div>
        </div>

        {/* Connecting Lines */}
        <svg width="100%" height="80" style={{ minHeight: '80px' }} viewBox="0 0 400 80" preserveAspectRatio="xMidYMid meet">
          {/* Central downward line */}
          <line x1="200" y1="0" x2="200" y2="80" stroke="#FFD700" strokeWidth="3" opacity="0.6" />
          {/* Branching lines to 11 */}
          {Array.from({ length: 11 }).map((_, i) => {
            const angle = (i - 5) * 15;
            const xPos = 200 + Math.sin(angle * Math.PI / 180) * 180;
            return (
              <line
                key={`branch-${i}`}
                x1="200"
                y1="80"
                x2={xPos}
                y2="80"
                stroke="#5BC0EB"
                strokeWidth="2.5"
                opacity="0.7"
              />
            );
          })}
        </svg>
      </div>

      {/* Level 1 - 11 Members */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '25px',
        padding: '30px 25px',
        background: 'linear-gradient(135deg, rgba(91, 192, 235, 0.08), rgba(91, 192, 235, 0.03))',
        borderRadius: '20px',
        border: '2px solid rgba(91, 192, 235, 0.4)',
        width: '100%',
        maxWidth: '1000px'
      }} className="level-section">
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '12px',
          width: '100%'
        }}>
          {Array.from({ length: 11 }).map((_, i) => (
            <div
              key={`level1-${i}`}
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, #5BC0EB, #3498DB)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFF',
                fontSize: '20px',
                fontWeight: '700',
                boxShadow: '0 4px 15px rgba(91, 192, 235, 0.4)',
                border: '2px solid rgba(255, 255, 255, 0.8)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              className="level1-circles"
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 25px rgba(91, 192, 235, 0.6)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 15px rgba(91, 192, 235, 0.4)';
              }}
            >
              👥
            </div>
          ))}
        </div>

        <div style={{
          textAlign: 'center',
          width: '100%'
        }}>
          <h4 style={{
            color: '#5BC0EB',
            fontSize: '22px',
            fontWeight: '800',
            margin: '0 0 5px 0',
            textShadow: '0 0 10px rgba(91, 192, 235, 0.4)'
          }} className="level-title">
            📊 LEVEL 1: 11 MEMBERS
          </h4>
          <p style={{
            color: '#B0E0E6',
            fontSize: '13px',
            margin: '5px 0 0 0'
          }} className="level-subtitle">
            Each member brings one additional person into the network
          </p>
        </div>
      </div>

      {/* Level 2 - 121 Members */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '25px',
        padding: '30px 25px',
        background: 'linear-gradient(135deg, rgba(142, 68, 173, 0.08), rgba(142, 68, 173, 0.03))',
        borderRadius: '20px',
        border: '2px solid rgba(142, 68, 173, 0.4)',
        width: '100%',
        maxWidth: '1000px',
        overflow: 'hidden'
      }} className="level-section">
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'flex-start',
          gap: '5px',
          width: '100%',
          maxWidth: '880px'
        }}>
          {Array.from({ length: 121 }).map((_, memberIndex) => {
            const humanEmojis = ['👤', '👨', '👩', '👨‍💼', '👩‍💼', '👨‍🎓', '👩‍🎓', '👨‍🔬', '👩‍🔬', '👨‍💻', '👩‍💻', '👨‍🎨', '👩‍🎨'];
            const emoji = humanEmojis[memberIndex % humanEmojis.length];
            return (
              <div
                key={`level2-member-${memberIndex}`}
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #8E44AD, #6C3483)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFF',
                  fontSize: '12px',
                  fontWeight: '700',
                  boxShadow: '0 2px 8px rgba(142, 68, 173, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.6)',
                  transition: 'all 0.2s ease',
                  flexShrink: 0
                }}
                className="level2-circles"
              >
                {emoji}
              </div>
            );
          })}
        </div>

        <div style={{
          textAlign: 'center',
          width: '100%'
        }}>
          <h4 style={{
            color: '#8E44AD',
            fontSize: '22px',
            fontWeight: '800',
            margin: '0 0 5px 0',
            textShadow: '0 0 10px rgba(142, 68, 173, 0.4)'
          }} className="level-title">
            🎯 LEVEL 2: 11 MEMBER
          </h4>
          <p style={{
            color: '#D7BDE2',
            fontSize: '13px',
            margin: '2px 0 5px 0'
          }} className="level-calculation">
            (11 × 11)=121
          </p>
          <p style={{
            color: '#D7BDE2',
            fontSize: '13px',
            margin: '5px 0 0 0'
          }} className="level-subtitle">
            Exponential growth multiplied: each of the 11 members brings 11 more
          </p>
        </div>
      </div>

      {/* Level 3 - 1,331 Members with Cloud Visualization */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '25px',
        padding: '30px 25px',
        background: 'linear-gradient(135deg, rgba(231, 76, 60, 0.08), rgba(231, 76, 60, 0.03))',
        borderRadius: '20px',
        border: '2px solid rgba(231, 76, 60, 0.4)',
        width: '100%',
        maxWidth: '1000px'
      }}>
        <div style={{
          width: '100%',
          height: '200px',
          background: 'radial-gradient(ellipse at center, rgba(231, 76, 60, 0.15) 0%, transparent 70%)',
          borderRadius: '15px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '3px',
          padding: '15px',
          border: '1px dashed rgba(231, 76, 60, 0.3)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Massive network cloud visualization */}
          {Array.from({ length: 200 }).map((_, i) => (
            <div
              key={`level3-dot-${i}`}
              style={{
                width: Math.random() > 0.7 ? '6px' : '4px',
                height: Math.random() > 0.7 ? '6px' : '4px',
                borderRadius: '50%',
                background: `rgba(231, 76, 60, ${0.4 + Math.random() * 0.5})`,
                boxShadow: '0 1px 3px rgba(231, 76, 60, 0.3)',
                animation: `float ${2 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}

          {/* Connecting lines for network effect */}
          <svg
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none'
            }}
          >
            {Array.from({ length: 15 }).map((_, i) => {
              const x1 = Math.random() * 100,
                y1 = Math.random() * 100,
                x2 = Math.random() * 100,
                y2 = Math.random() * 100;
              return (
                <line
                  key={`line-${i}`}
                  x1={`${x1}%`}
                  y1={`${y1}%`}
                  x2={`${x2}%`}
                  y2={`${y2}%`}
                  stroke="rgba(231, 76, 60, 0.2)"
                  strokeWidth="0.5"
                />
              );
            })}
          </svg>

          <div style={{
            position: 'absolute',
            color: '#E74C3C',
            fontSize: '14px',
            fontWeight: '700',
            textAlign: 'center',
            background: 'rgba(0,0,0,0.3)',
            padding: '8px 12px',
            borderRadius: '8px',
            backdropFilter: 'blur(5px)'
          }}>
            1,331 MEMBERS
          </div>
        </div>

        <div style={{
          textAlign: 'center',
          width: '100%'
        }}>
          <h4 style={{
            color: '#E74C3C',
            fontSize: '22px',
            fontWeight: '800',
            margin: '0 0 5px 0',
            textShadow: '0 0 10px rgba(231, 76, 60, 0.4)'
          }} className="level-title">
            🌐 LEVEL 3: 121 MEMBER
          </h4>
          <p style={{
            color: '#F5B7B1',
            fontSize: '13px',
            margin: '2px 0 5px 0'
          }} className="level-calculation">
            (121 × 11)=1331
          </p>
          <p style={{
            color: '#F5B7B1',
            fontSize: '13px',
            margin: '5px 0 0 0'
          }} className="level-subtitle">
            The network begins to explode with exponential growth
          </p>
        </div>
      </div>

      {/* Exponential Growth Summary */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '30px',
        padding: '40px 30px',
        background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.12), rgba(91, 192, 235, 0.08))',
        borderRadius: '25px',
        border: '3px solid rgba(255, 215, 0, 0.4)',
        width: '100%',
        maxWidth: '900px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Gradient overlay background */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(ellipse at center, rgba(255,215,0,0.05) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />

        <div style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center'
        }}>
          <h3 style={{
            color: '#FFD700',
            fontSize: '26px',
            fontWeight: '800',
            margin: '0 0 10px 0',
            textShadow: '0 0 15px rgba(255, 215, 0, 0.6)',
            letterSpacing: '1px'
          }}>
            📈 EXPONENTIAL GROWTH CONTINUES...
          </h3>
          <p style={{
            color: '#5BC0EB',
            fontSize: '14px',
            margin: '0'
          }}>
            The following levels demonstrate the true power of exponential networks:
          </p>
        </div>

        {/* Growth Levels Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '20px',
          width: '100%',
          position: 'relative',
          zIndex: 1
        }}>
          <GrowthLevel level={4} members="14,641" color="#F39C12" />
          <GrowthLevel level={5} members="161,051" color="#16A085" />
          <GrowthLevel level={6} members="1,771,561" color="#D35400" isFinal />
        </div>

        {/* Total Network Achievement */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '15px'
          }}
        >
          {/* Yellow Upward Arrow */}
          <svg
            width="280"
            height="80"
            viewBox="0 0 280 80"
            preserveAspectRatio="xMidYMid meet"
            style={{
              filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.6))'
            }}
          >
            {/* Curved arrow path */}
            <defs>
              <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFD700" />
                <stop offset="100%" stopColor="#FFA500" />
              </linearGradient>
            </defs>

            {/* Curved arrow */}
            <path
              d="M 140 70 Q 40 50 40 20 Q 40 5 50 5 L 120 5"
              fill="none"
              stroke="url(#arrowGradient)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Arrow head */}
            <polygon
              points="120,2 135,25 110,20"
              fill="url(#arrowGradient)"
              filter="drop-shadow(0 0 5px rgba(255, 215, 0, 0.5))"
            />

            <path
              d="M 140 70 Q 240 50 240 20 Q 240 5 230 5 L 160 5"
              fill="none"
              stroke="url(#arrowGradient)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <polygon
              points="160,2 145,25 170,20"
              fill="url(#arrowGradient)"
              filter="drop-shadow(0 0 5px rgba(255, 215, 0, 0.5))"
            />

            {/* Text on arrow */}
            <text
              x="140"
              y="45"
              textAnchor="middle"
              fontSize="16"
              fontWeight="bold"
              fill="#FFD700"
            >
              TOTAL NETWORK
            </text>
          </svg>

          {/* Final Achievement Box */}
          <div
            style={{
              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              padding: '25px 40px',
              borderRadius: '20px',
              color: '#000',
              textAlign: 'center',
              boxShadow: '0 15px 50px rgba(255, 215, 0, 0.6), inset -2px -2px 5px rgba(0,0,0,0.2)',
              border: '4px solid #FFF',
              position: 'relative'
            }}
          >
            {/* Shimmer effect */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)',
                animation: 'shimmer 2s infinite',
                borderRadius: '20px'
              }}
            />

            <div style={{
              position: 'relative',
              zIndex: 1
            }}>
              <div style={{
                fontSize: '32px',
                fontWeight: '800',
                margin: '0 0 5px 0',
                letterSpacing: '2px'
              }}>
                1,000,000+ MEMBERS
              </div>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: 'rgba(0,0,0,0.8)'
              }}>
                💎 WINNER ACHIEVED! 🎉
              </div>
            </div>
          </div>

          {/* Celebration Icons */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            flexWrap: 'wrap',
            fontSize: '20px'
          }}>
            <span style={{ animation: 'bounce 1s infinite' }}>💰</span>
            <span style={{ animation: 'bounce 1s infinite 0.1s' }}>💎</span>
            <span style={{ animation: 'bounce 1s infinite 0.2s' }}>🏆</span>
            <span style={{ animation: 'bounce 1s infinite 0.3s' }}>⭐</span>
            <span style={{ animation: 'bounce 1s infinite 0.4s' }}>🎊</span>
            <span style={{ animation: 'bounce 1s infinite 0.5s' }}>🎉</span>
          </div>
        </div>
      </div>

      {/* CSS Animations and Responsive Styles */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }

        /* Desktop Styles - Split Screen */
        @media (min-width: 768px) {
          .split-container {
            flex-direction: row !important;
          }

          .forms-section {
            width: 50% !important;
            order: 1 !important;
            border-bottom: none !important;
            border-left: 1px solid rgba(255,255,255,0.1) !important;
            border-right: none !important;
          }

          .landing-section {
            width: 50% !important;
          }

          .register-form, .login-form {
            max-width: 350px !important;
            padding: 25px !important;
          }

          .register-form h2, .login-form h2 {
            font-size: 2rem !important;
          }

          .register-form p, .login-form p {
            font-size: 0.9rem !important;
            margin-bottom: 25px !important;
          }
        }

        /* Mobile Styles - Stacked Layout */
        @media (max-width: 767px) {
          .split-container {
            flex-direction: column !important;
          }

          .forms-section {
            width: 100% !important;
            order: -1 !important;
            border-bottom: 1px solid rgba(255,255,255,0.1) !important;
            border-left: none !important;
            padding: 15px !important;
          }

          .landing-section {
            width: 100% !important;
          }

          .register-form, .login-form {
            max-width: 100% !important;
            padding: 20px !important;
            margin: 0 !important;
          }

          .register-form h2, .login-form h2 {
            font-size: 1.6rem !important;
          }

          .register-form p, .login-form p {
            font-size: 0.8rem !important;
            margin-bottom: 20px !important;
          }

          .hero-section {
            padding: 60px 15px 40px !important;
          }

          .hero-title {
            font-size: 2.5rem !important;
          }

          .hero-subtitle {
            font-size: 1.8rem !important;
          }

          .hero-description {
            font-size: 1.1rem !important;
          }
        }
      `}</style>
    </div>
  );
};

// Confetti Component
const Confetti: React.FC<{ delay: number; left: string }> = ({ delay, left }) => (
  <div
    style={{
      position: 'absolute',
      top: '-10px',
      left,
      width: '10px',
      height: '10px',
      background: ['#FFD700', '#FFA500', '#5BC0EB', '#8E44AD', '#E74C3C'][
        Math.floor(Math.random() * 5)
      ],
      borderRadius: ['50%', '0'][Math.floor(Math.random() * 2)],
      animation: `confetti-fall ${2 + Math.random() * 1}s ease-in infinite`,
      animationDelay: `${delay}ms`,
      pointerEvents: 'none'
    }}
  />
);

// Branching Arrow Component
const BranchingArrow: React.FC<{ small?: boolean }> = ({ small = false }) => (
  <div style={{
    position: 'relative',
    width: small ? '20px' : '40px',
    height: small ? '15px' : '30px'
  }}>
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: small ? '15px' : '30px',
      height: small ? '2px' : '4px',
      background: '#FFD700',
      boxShadow: '0 0 10px rgba(255, 215, 0, 0.5)'
    }} />
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '0',
      height: '0',
      borderLeft: `${small ? '6px' : '12px'} solid transparent`,
      borderRight: `${small ? '6px' : '12px'} solid transparent`,
      borderTop: `${small ? '8px' : '16px'} solid #FFD700`,
      filter: 'drop-shadow(0 2px 4px rgba(255, 215, 0, 0.3))'
    }} />
  </div>
);

// Growth Level Component
const GrowthLevel: React.FC<{
  level: number;
  members: string;
  color: string;
  isFinal?: boolean
}> = ({ level, members, color, isFinal = false }) => (
  <div style={{
    background: `linear-gradient(135deg, ${color}, ${color}AA)`,
    padding: '20px',
    borderRadius: '15px',
    textAlign: 'center',
    color: '#FFF',
    boxShadow: `0 8px 25px ${color}40`,
    border: '2px solid rgba(255, 255, 255, 0.3)',
    position: 'relative'
  }}>
    {isFinal && (
      <div style={{
        position: 'absolute',
        top: '-15px',
        right: '-15px',
        background: '#FFD700',
        color: '#000',
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        fontWeight: '700',
        boxShadow: '0 4px 12px rgba(255, 215, 0, 0.4)'
      }}>
        🏆
      </div>
    )}
    <div style={{
      fontSize: '16px',
      fontWeight: '600',
      marginBottom: '8px',
      opacity: 0.9
    }}>
      Level {level}
    </div>
    <div style={{
      fontSize: '20px',
      fontWeight: '700',
      marginBottom: '5px'
    }}>
      {members}
    </div>
    <div style={{
      fontSize: '12px',
      opacity: 0.8
    }}>
      Members
    </div>
  </div>
);

// User Node Component
const UserNode: React.FC<{ name: string; isMain?: boolean; small?: boolean; tiny?: boolean }> = ({
  name,
  isMain = false,
  small = false,
  tiny = false
}) => {
  const size = tiny ? 8 : small ? 12 : isMain ? 60 : 25;
  const fontSize = tiny ? 6 : small ? 8 : isMain ? 16 : 10;

  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: isMain ? 'linear-gradient(135deg, #FFD700, #FFA500)' : 'linear-gradient(135deg, #5BC0EB, #2980B9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#FFF',
      fontSize: fontSize,
      fontWeight: '700',
      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
      border: isMain ? '3px solid #FFF' : '1px solid rgba(255,255,255,0.3)'
    }}>
      {isMain ? '👤' : '👥'}
    </div>
  );
};

// Arrow Component
const Arrow: React.FC = () => (
  <div style={{
    width: '0',
    height: '0',
    borderLeft: '15px solid transparent',
    borderRight: '15px solid transparent',
    borderTop: '20px solid #FFD700',
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
  }} />
);

// Feature Card Component
const FeatureCard: React.FC<{ icon: string; title: string; description: string }> = ({
  icon,
  title,
  description
}) => (
  <div style={{
    background: 'rgba(255, 255, 255, 0.05)',
    padding: '30px',
    borderRadius: '15px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
    textAlign: 'center'
  }}>
    <div style={{ fontSize: '3rem', marginBottom: '20px' }}>{icon}</div>
    <h3 style={{
      color: '#FFD700',
      fontSize: '1.4rem',
      marginBottom: '15px',
      fontWeight: '600'
    }}>
      {title}
    </h3>
    <p style={{
      color: '#E8E8E8',
      lineHeight: '1.6',
      fontSize: '1rem'
    }}>
      {description}
    </p>
  </div>
);

// Stat Card Component
const StatCard: React.FC<{ number: string; label: string }> = ({ number, label }) => (
  <div style={{
    background: 'rgba(255, 215, 0, 0.1)',
    padding: '25px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 215, 0, 0.3)',
    textAlign: 'center'
  }}>
    <div style={{
      fontSize: '2rem',
      fontWeight: '700',
      color: '#FFD700',
      marginBottom: '8px'
    }}>
      {number}
    </div>
    <div style={{
      color: '#CCC',
      fontSize: '0.9rem',
      fontWeight: '500'
    }}>
      {label}
    </div>
  </div>
);

export default Index;



