import { useState } from 'react';
import { useRouter } from 'next/router';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const navButton = (href: string, label: string) => (
    <a
      href={href}
      style={{
        color: '#FFF',
        textDecoration: 'none',
        padding: '8px 12px',
        border: '1px solid rgba(255,255,255,0.32)',
        borderRadius: '8px',
        margin: '0 5px',
        background: 'rgba(7, 20, 35, 0.78)',
      }}
    >
      {label}
    </a>
  );

  const handleLogin = async (e: any) => {
    e.preventDefault();
    
    if (!email || !password) {
      alert("Please fill all fields!");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
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
        
        router.push('/dashboard');
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login. Please try again.');
    }
  };

  return (
    <div style={{
      ...styles.container,
      background: 'linear-gradient(150deg, #111e42, #051221 50%, #02070f 100%)',
      backgroundImage: 'url("https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1500&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      color: '#FFF'
    }}>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 99,
        background: 'rgba(3, 10, 22, 0.85)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(255,255,255,0.12)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '12px 10px'
      }}>
        {navButton('/', 'Home')}
        {navButton('/register', 'Sign Up')}
        {navButton('/login', 'Login')}
        {navButton('#contact', 'Contact')}
        {navButton('#sport-team', 'Sport Team')}
      </header>

      <div style={styles.loginCard}>
        <h1 style={{ color: 'gold', textAlign: 'center', marginBottom: '10px' }}>WELCOME BACK</h1>
        <p style={{ color: '#888', textAlign: 'center', fontSize: '14px', marginBottom: '30px' }}>
          Login to your Millionaire Hub account
        </p>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input 
              type="email" 
              placeholder="example@mail.com" 
              required 
              style={styles.input} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              required 
              style={styles.input} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>

          <div style={styles.forgotRow}>
            <span 
              onClick={() => router.push('/forgot-password')} 
              style={styles.forgotLink}
            >
              Forgot Password?
            </span>
          </div>

          <button type="submit" style={styles.loginBtn}>LOGIN NOW</button>
        </form>

        <p style={styles.footerText}>
          Don't have an account? <span onClick={() => router.push('/register')} style={{color: 'gold', cursor: 'pointer'}}>Join Chain</span>
        </p>
      </div>

      <footer style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(3, 10, 22, 0.90)',
        borderTop: '1px solid rgba(255,255,255,0.12)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '8px',
        padding: '10px',
        backdropFilter: 'blur(6px)',
        zIndex: 98
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

const styles = {
  container: { 
    background: '#000', 
    minHeight: '100vh', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: '20px' 
  },
  loginCard: { 
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
  forgotRow: { textAlign: 'right' as 'right' },
  forgotLink: { 
    color: '#666', 
    fontSize: '13px', 
    cursor: 'pointer', 
    transition: '0.3s',
    textDecoration: 'underline'
  },
  loginBtn: { 
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
  footerText: { 
    textAlign: 'center' as 'center', 
    marginTop: '25px', 
    fontSize: '14px', 
    color: '#888' 
  }
};

export default Login;