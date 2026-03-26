import { useEffect, useState, useRef } from 'react';

const styles = {
  sidebar: { width: '200px', background: '#0a0a0a', padding: '30px', borderRight: '1px solid #222', height: '100vh', position: 'fixed' as const, zIndex: 10, overflowY: 'auto' as const, paddingBottom: '50px', scrollbarWidth: 'none' as const },
  sidebarMobile: { width: '250px', background: '#0a0a0a', padding: '30px', borderRight: '1px solid #222', height: '100vh', position: 'fixed' as const, zIndex: 1000, overflowY: 'auto' as const, paddingBottom: '50px', scrollbarWidth: 'none' as const, left: '0', transform: 'translateX(-100%)', transition: 'transform 0.3s ease' },
  sidebarMobileOpen: { transform: 'translateX(0)' },
  picContainer: { position: 'relative' as const, width: '80px', height: '80px', margin: '0 auto' },
  imgCircle: { width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' as const, border: '2px solid gold' },
  imgPlaceholder: { width: '100%', height: '100%', borderRadius: '50%', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', border: '2px solid gold' },
  uploadLabel: { position: 'absolute' as const, bottom: '0', right: '0', background: 'gold', color: 'black', width: '25px', height: '25px', borderRadius: '50%', cursor: 'pointer', fontWeight: 'bold' as const, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' },
  navBtn: { background: 'none', border: 'none', color: '#888', width: '100%', textAlign: 'left' as const, padding: '15px 0', cursor: 'pointer', fontSize: '15px' },
  navBtnActive: { background: 'none', border: 'none', color: 'gold', width: '100%', textAlign: 'left' as const, padding: '15px 0', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold' as const },
  main: { marginLeft: '250px', flex: 1, padding: '40px' },
  mainMobile: { marginLeft: '0', flex: 1, padding: '20px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #222', paddingBottom: '15px' },
  headerMobile: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #222', paddingBottom: '15px', flexWrap: 'wrap' as const },
  hamburger: { display: 'none', fontSize: '24px', cursor: 'pointer', color: 'gold' },
  hamburgerMobile: { display: 'block', fontSize: '24px', cursor: 'pointer', color: 'gold' },
  timerContainer: { background: '#111', padding: '10px 20px', borderRadius: '12px', border: '1px solid #333', textAlign: 'right' as const },
  alertBox: { background: '#111', padding: '30px', borderRadius: '15px', border: '1px solid gold', textAlign: 'center' as const, marginTop: '20px' },
  paymentRow: { background: '#222', padding: '10px', borderRadius: '10px', display: 'flex', justifyContent: 'space-around', fontSize: '10px', marginBottom: '15px' },
  tidInput: { padding: '10px', width: '90%', background: '#000', border: '1px solid #333', color: '#fff', marginBottom: '10px', borderRadius: '5px' },
  fieldLabel: {
    display: 'block',
    fontSize: '12px',
    color: '#888',
    marginBottom: '5px',
    marginTop: '10px'
  },
  goldBtnLarge: { background: 'gold', color: 'black', border: 'none', padding: '12px 30px', borderRadius: '8px', fontWeight: 'bold' as const, cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '15px', marginTop: '30px' },
  cardLocked: { background: '#050505', padding: '20px', borderRadius: '15px', border: '1px solid #222', textAlign: 'center' as const, opacity: 0.5 },
  cardOpen: { background: '#111', padding: '20px', borderRadius: '15px', border: '1px solid gold', textAlign: 'center' as const, boxShadow: '0 0 10px gold' },
  logoutBtn: { background: '#ff4444', color: 'white', border: 'none', width: '100%', padding: '10px', borderRadius: '5px', cursor: 'pointer', marginTop: '40px' },
  socialLinkItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
    color: '#fff',
    padding: '4px 0',
    transition: '0.3s',
    cursor: 'pointer'
  },
  socialName: {
    fontSize: '13px',
    fontWeight: 'bold',
    color: '#fff'
  },
  socialSlogan: {
    fontSize: '10px',
    color: 'gold', // Slogan gold color mein zyada pyara lagega
    opacity: 0.8
  },
  card: { background: '#0a0a0a', border: '1px solid #222', padding: '25px', borderRadius: '15px' },
  modalOverlay: { position: 'fixed' as const, top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modalContent: { background: '#111', padding: '40px', borderRadius: '15px', border: '2px solid gold', maxWidth: '600px', width: '90%', maxHeight: '80vh', overflowY: 'auto' as const, fontFamily: "'Noto Nastaliq Urdu', serif", lineHeight: 1.8 },
  modalHeading: { color: '#FFD700', fontSize: '28px', textAlign: 'center' as const, marginBottom: '20px', fontWeight: 'bold' as const, fontFamily: "'Noto Nastaliq Urdu', serif" },
  modalText: { color: 'white', fontSize: '22px', marginBottom: '20px', fontWeight: 'bold' as const, fontFamily: "'Noto Nastaliq Urdu', serif" },
  modalButton: { background: 'gold', color: 'black', border: 'none', padding: '12px 30px', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold' as const, cursor: 'pointer', display: 'block', margin: '0 auto', fontFamily: "'Noto Nastaliq Urdu', serif" }
};

type ActivationStatusType = 'not_requested' | 'pending' | 'approved' | 'expired' | 'pending_chance' | 'locked' | 'completed';

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0); 
  const [activationStatus, setActivationStatus] = useState<ActivationStatusType>('not_requested'); 
  const [activeTab, setActiveTab] = useState('home'); 
  const [activeMembers, setActiveMembers] = useState(0); 
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [networkReferrals, setNetworkReferrals] = useState<{ position: number; referralCode: string; status: 'locked' | 'unlocked'; paymentApproved: boolean }[]>([]);

  // Profile Edit States
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editUsername, setEditUsername] = useState(''); // New Username State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Withdrawal States
  const [withdrawalData, setWithdrawalData] = useState({
    amount: '1000000',
    method: '',
    account: '',
    captcha: ''
  });

  // Timer and Chance States
  const [timerEndTime, setTimerEndTime] = useState<number | null>(null);
  const [chanceLevel, setChanceLevel] = useState(0); // 0: initial, 1: 1st chance bought, 2: 2nd chance bought, 3: locked
  const [isLocked, setIsLocked] = useState(false);

  // Pending timestamp for reactivation
  const [pendingTimestamp, setPendingTimestamp] = useState<number | null>(null);
  const prevActivationStatus = useRef<string>('not_requested');
  const [hasReloadedAfterApproval, setHasReloadedAfterApproval] = useState(false);

  // Payment Request Status
  const [paymentStatus, setPaymentStatus] = useState<'not_requested' | 'pending' | 'approved' | 'rejected'>('not_requested');
  const [paymentRequestId, setPaymentRequestId] = useState<string | null>(null);

  // Withdraw request status
  const [withdrawalStatus, setWithdrawalStatus] = useState<'idle' | 'pending' | 'submitted' | 'failed'>('idle');
  const [withdrawalMessage, setWithdrawalMessage] = useState('');

  // Completed users state
  const [completedUsers, setCompletedUsers] = useState<any[]>([]);

  // Urdu Modal State
  const [showUrduModal, setShowUrduModal] = useState(false);

  // Payment Progress States
  const [approvedPaymentsCount, setApprovedPaymentsCount] = useState(0);
  const [showCongratulationsModal, setShowCongratulationsModal] = useState(false);
  const [lastApprovedPaymentPosition, setLastApprovedPaymentPosition] = useState<number | null>(null);

  // Network Strength State
  const [calculatedNetworkStrength, setCalculatedNetworkStrength] = useState(0);

  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    localStorage.setItem('dashboardActiveTab', tab);
    if (tab === 'referral') {
      fetchCompletedUsers();
    }
  };

  const getLink = (link: string) => {
    if (!link) return '#';
    if (link.startsWith('http')) return link;
    return `https://${link}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => alert('Copied!'));
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsed = JSON.parse(userData);
        setUser(parsed);
        setEditName(parsed.name);
        setEditPhone(parsed.phone || '');
        setEditLocation(parsed.city || '');
        setEditUsername(parsed.username || 'AbidMillionaire'); // Default ya saved username
        setNetworkReferrals(parsed.networkReferrals || Array.from({ length: 11 }, (_, i) => ({ position: i + 1, referralCode: '', status: 'locked', paymentApproved: false })));
      }
      setActiveTab(localStorage.getItem('dashboardActiveTab') || 'home');

      // Load timer states
      const storedActivationStatus = localStorage.getItem('activationStatus') || 'not_requested';
      setActivationStatus(storedActivationStatus as any);

      // Show Urdu modal if not shown before
      if (!localStorage.getItem('urduModalShown')) {
        setShowUrduModal(true);
        localStorage.setItem('urduModalShown', 'true');
      }

      const storedChanceLevel = parseInt(localStorage.getItem('chanceLevel') || '0');
      setChanceLevel(storedChanceLevel);

      const storedIsLocked = localStorage.getItem('isLocked') === 'true';
      setIsLocked(storedIsLocked);

      const storedPendingTimestamp = localStorage.getItem('pendingTimestamp');
      setPendingTimestamp(storedPendingTimestamp ? parseInt(storedPendingTimestamp) : null);
    }
  }, []);

  // Fetch user data periodically to sync with backend
  useEffect(() => {
    const fetchUser = () => {
      if (user && user._id) {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/login';
          return;
        }
        fetch(`http://localhost:5000/api/auth/user/${user._id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
          .then(res => {
            console.log('Fetch user response status:', res.status);
            if (res.status === 401 || res.status === 403) {
              console.error('Auth error:', res.status, 'Token invalid or expired');
              localStorage.clear();
              window.location.href = '/login';
              return;
            }
            if (!res.ok) {
              console.error('Fetch user failed:', res.status, res.statusText);
              return res.text().then(text => console.error('Response:', text));
            }
            return res.json();
          })
          .then(data => {
            if (data.activationStatus) {
              // Don't change status back from 'completed' to 'approved'
              if (data.activationStatus === 'approved' && activationStatus === 'completed') {
                // Keep the completed status
              } else if (data.activationStatus === 'approved' && prevActivationStatus.current === 'pending' && !hasReloadedAfterApproval) {
                setHasReloadedAfterApproval(true);
                window.location.reload();
              } else {
                setActivationStatus(data.activationStatus as ActivationStatusType);
              }
              prevActivationStatus.current = data.activationStatus;
            }
            if (data.timerEndTime) {
              setTimerEndTime(new Date(data.timerEndTime).getTime());
              const remaining = Math.max(0, Math.floor((new Date(data.timerEndTime).getTime() - Date.now()) / 1000));
              setTimeLeft(remaining);
            }
            if (data.chanceLevel !== undefined) setChanceLevel(data.chanceLevel);
            setIsLocked(data.chanceLevel === 3);
            const normalizedNetworkReferrals = (data.networkReferrals || []).map((r: any, i: number) => ({
              position: r.position || i + 1,
              referralCode: r.referralCode || '',
              status: r.status === 'unlocked' ? 'unlocked' : 'locked',
              paymentApproved: r.paymentApproved || false
            }));
            setNetworkReferrals(normalizedNetworkReferrals);
            console.log('Updated networkReferrals:', normalizedNetworkReferrals);
            console.log('Referral count:', data.referralCount);
            // Update user with latest data
            setUser({ ...data, networkReferrals: normalizedNetworkReferrals });
            localStorage.setItem('user', JSON.stringify({ ...data, networkReferrals: normalizedNetworkReferrals }));
          })
          .catch(err => console.log('Error fetching user:', err));
      }
    };

    fetchUser();
    const interval = setInterval(fetchUser, 10000); // Every 10 seconds
    return () => clearInterval(interval);
  }, [user, hasReloadedAfterApproval]);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('activationStatus', activationStatus);
    if (activationStatus !== 'pending') {
      setPendingTimestamp(null);
    }
  }, [activationStatus]);

  useEffect(() => {
    if (timerEndTime) localStorage.setItem('timerEndTime', timerEndTime.toString());
  }, [timerEndTime]);

  useEffect(() => {
    localStorage.setItem('chanceLevel', chanceLevel.toString());
  }, [chanceLevel]);

  useEffect(() => {
    localStorage.setItem('isLocked', isLocked.toString());
  }, [isLocked]);

  useEffect(() => {
    if (pendingTimestamp) localStorage.setItem('pendingTimestamp', pendingTimestamp.toString());
    else localStorage.removeItem('pendingTimestamp');
  }, [pendingTimestamp]);

  // Count approved payments and track milestones
  useEffect(() => {
    const approvedCount = networkReferrals.filter(r => r.paymentApproved).length;
    
    // Check if we just reached 11 approved payments
    if (approvedCount === 11 && approvedCount > approvedPaymentsCount) {
      setShowCongratulationsModal(true);
    }
    
    setApprovedPaymentsCount(approvedCount);
  }, [networkReferrals, approvedPaymentsCount]);

  // Calculate network strength from completed referrals
  useEffect(() => {
    if (completedUsers.length === 0) {
      setCalculatedNetworkStrength(0);
      return;
    }

    const totalNetwork = completedUsers.reduce((sum: number, referredUser: any) => {
      const approvedPaymentsForUser = (referredUser.networkReferrals || []).filter((r: any) => r.paymentApproved).length;
      const allPaymentsApproved = approvedPaymentsForUser >= 11;
      const teamCount = referredUser.totalNetworkSize || 0;
      
      // Only count network if all 11 payments are approved
      return sum + (allPaymentsApproved ? teamCount : 0);
    }, 0);

    setCalculatedNetworkStrength(totalNetwork);
  }, [completedUsers]);

  // Fetch payment status
  useEffect(() => {
    const fetchPaymentStatus = () => {
      const token = localStorage.getItem('token');
      if (token) {
        fetch('http://localhost:5000/api/payment/user-payments', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
          .then(res => res.json())
          .then(data => {
            if (Array.isArray(data) && data.length > 0) {
              const latestPayment = data[0]; // Assuming sorted by createdAt desc
              setPaymentStatus(latestPayment.status.toLowerCase());
              setPaymentRequestId(latestPayment._id);
            }
          })
          .catch(err => console.log('Error fetching payment status:', err));
      }
    };

    fetchPaymentStatus();
    const interval = setInterval(fetchPaymentStatus, 15000); // Check every 15 seconds
    return () => clearInterval(interval);
  }, []);

  // Timer countdown effect
  useEffect(() => {
    if (timerEndTime) {
      const interval = setInterval(() => {
        const remaining = Math.max(0, Math.floor((timerEndTime - Date.now()) / 1000));
        setTimeLeft(remaining);
        if (remaining === 0) {
          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timerEndTime]);

const [settings, setSettings] = useState<any>({
  jazzcash: '03XX-XXXXXXX',
  easypaisa: '03XX-XXXXXXX',
  bank: 'Bank Details',
  notice: '',
  socialLink: '#'
});

const [notificationsHistory, setNotificationsHistory] = useState<string[]>([]);

const [news, setNews] = useState<any[]>([]);


useEffect(() => {
  const fetchSettings = () => {
    fetch('http://localhost:5000/api/admin/get-settings')
      .then(res => res.json())
      .then(data => {
        console.log("Settings Data:", data);
        setSettings((prev: any) => ({ ...prev, ...data }));
        console.log('Current Notice:', data.notice);
      })
      .catch(err => console.log('Error fetching settings:', err));
  };

  fetchSettings(); // Initial fetch

  const interval = setInterval(fetchSettings, 10000); // Fetch every 10 seconds

  return () => clearInterval(interval);
}, []);

useEffect(() => {
  fetch('http://localhost:5000/api/admin/notifications-history')
    .then(res => res.json())
    .then(data => {
      console.log("Notifications History:", data);
      setNotificationsHistory(data || []);
    })
    .catch(err => console.log('Error fetching notifications history:', err));
}, []);

useEffect(() => {
  fetch('http://localhost:5000/api/admin/get-news')
    .then(res => res.json())
    .then(data => {
      console.log("News:", data);
      setNews(data || []);
    })
    .catch(err => console.log('Error fetching news:', err));
}, []);

  // Timer countdown
  useEffect(() => {
    const activeCount = networkReferrals.filter(r => r.status === 'unlocked').length;
    if (activeCount >= 11) {
      setTimeLeft(0);
      setActivationStatus('completed');
      return;
    }

    if (activationStatus === 'approved' && timerEndTime) {
      const timer = setInterval(() => {
        const remaining = Math.max(0, Math.floor((timerEndTime - Date.now()) / 1000));
        setTimeLeft(remaining);

        if (remaining <= 0) {
          // HARD lock after 2 hours when challenge is not complete
          const currentActiveCount = networkReferrals.filter(r => r.status === 'unlocked').length;
          if (currentActiveCount >= 11) {
            setActivationStatus('completed');
            setIsLocked(false);
          } else {
            setActivationStatus('locked');
            setIsLocked(true);
            setChanceLevel(3);
            setNetworkReferrals(prev => prev.map(r => ({ ...r, status: 'locked' })));
            setUser(prev => prev ? { ...prev, status: 'locked' } : prev);
            localStorage.setItem('activationStatus', 'locked');
            localStorage.setItem('isLocked', 'true');
          }
          setTimeLeft(0);
          clearInterval(timer);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [activationStatus, timerEndTime, networkReferrals, chanceLevel]);

  // When activationStatus changes to approved, start timer if not already
  useEffect(() => {
    if (activationStatus === 'approved' && !timerEndTime) {
      const endTime = Date.now() + 2 * 60 * 60 * 1000; // 2 hours
      setTimerEndTime(endTime);
      setTimeLeft(2 * 60 * 60);
    }
  }, [activationStatus, timerEndTime]);

  const handleBuyChance = (tid: string) => {
    const amount = chanceLevel === 0 ? 50 : 100;
    fetch('http://localhost:5000/api/admin/buy-chance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user._id, tid, amount })
    })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      setActivationStatus('pending_chance');
    })
    .catch(err => alert('Error submitting chance purchase'));
  };

  const handleRequestActivation = async (tid: string, screenshotFile?: File) => {
    try {
      let token = localStorage.getItem('token');
      if (!token) {
        alert('Please login again');
        window.location.href = '/login';
        return;
      }

      if (!tid || tid.trim() === '') {
        alert('Please enter a valid Transaction ID');
        return;
      }

      const formData = new FormData();
      formData.append('transactionId', tid);
      formData.append('amountType', '10');
      if (screenshotFile) {
        formData.append('screenshot', screenshotFile);
      }

      console.log('Submitting activation request with TID:', tid, 'Token:', token.substring(0, 20) + '...');

      const response = await fetch('http://localhost:5000/api/payment/request-activation', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      console.log('Activation request response:', response.status, data);

      if (response.ok) {
        alert('Payment request submitted successfully! Waiting for admin approval...');
        // Refresh user data and payments
        const userRes = await fetch(`http://localhost:5000/api/auth/user/${user._id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData);
          setActivationStatus(userData.activationStatus as ActivationStatusType);
        }
      } else if (response.status === 401 || data.error?.includes('jwt') || data.error?.includes('token')) {
        console.error('Token expired or invalid:', data);
        alert('⚠️  Your session has expired. Please login again.');
        window.location.href = '/login';
      } else {
        console.error('Failed to submit activation request:', data);
        alert(`Error: ${data.error || data.message || 'Failed to submit request'}`);
      }
    } catch (error) {
      console.error('Network error submitting activation request:', error);
      alert('Network error: Please check your connection and try again.');
    }
  };

  const handleSubmitWithdrawal = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login again');
      window.location.href = '/login';
      return;
    }

    if (!withdrawalData.amount || !withdrawalData.method || !withdrawalData.account) {
      alert('Please select withdrawal method and enter account details.');
      return;
    }

    setWithdrawalStatus('pending');
    setWithdrawalMessage('Sending withdrawal request, wait...');

    try {
      const response = await fetch('http://localhost:5000/api/payment/request-withdrawal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: Number(withdrawalData.amount.replace(/,/g, '')),
          method: withdrawalData.method,
          account: withdrawalData.account
        })
      });

      const data = await response.json();
      if (response.ok) {
        setWithdrawalStatus('submitted');
        setWithdrawalMessage('Withdrawal request sent. Admin will review it soon.');
      } else {
        setWithdrawalStatus('failed');
        setWithdrawalMessage(`Error: ${data.error || data.message || 'Unable to submit withdrawal'}`);
      }
    } catch (error: any) {
      setWithdrawalStatus('failed');
      setWithdrawalMessage(`Network error: ${error.message || 'Please try again'}`);
    }
  };

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`;
  };

  const handleLogout = () => {
  localStorage.clear();
  window.location.href = '/login';
};

  // Fetch completed users
  const fetchCompletedUsers = () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    fetch('http://localhost:5000/api/auth/referred-users', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCompletedUsers(data);
        }
      })
      .catch(err => console.log('Error fetching referred users:', err));
  };

  const handleImageUpload = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePic(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  if (!user) return <div style={{color: 'gold', textAlign: 'center', marginTop: '50px'}}>Loading...</div>;

  // ==== ACCOUNT LOCKED PAGE ====
  if (activationStatus === 'locked') {
    return (
      <div style={{ background: '#000', color: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', padding: '20px' }}>
        <div style={{ textAlign: 'center', maxWidth: '600px', background: '#111', padding: '60px 40px', borderRadius: '15px', border: '2px solid #FF4444' }}>
          <div style={{ fontSize: '80px', marginBottom: '30px' }}>🔒</div>
          <h1 style={{ color: '#FF4444', fontSize: '36px', marginBottom: '20px', fontWeight: 'bold' }}>ACCOUNT LOCKED</h1>
          
          <div style={{ background: '#0a0a0a', padding: '25px', borderRadius: '10px', marginBottom: '30px', border: '1px solid #333' }}>
            <p style={{ fontSize: '18px', color: '#FFD700', marginBottom: '15px', fontWeight: 'bold' }}>Challenge Failed!</p>
            <p style={{ fontSize: '16px', color: '#fff', lineHeight: '1.6', marginBottom: '15px' }}>
              You were unable to complete 11 direct referrals within the 2-hour time limit.
            </p>
            <div style={{ background: '#1a1a1a', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
              <p style={{ color: '#888', fontSize: '14px', margin: '5px 0' }}>✗ Timer Expired</p>
              <p style={{ color: '#888', fontSize: '14px', margin: '5px 0' }}>✗ Referrals Incomplete: {user.referralCount || 0}/11</p>
              <p style={{ color: '#888', fontSize: '14px', margin: '5px 0' }}>✗ Access Revoked</p>
            </div>
            <p style={{ fontSize: '15px', color: '#fff', lineHeight: '1.6' }}>
              This account is permanently locked from the challenge. To participate again, <span style={{ color: 'gold', fontWeight: 'bold' }}>create a new account</span> and try with a fresh start!
            </p>
          </div>

          <div style={{ display: 'flex', gap: '15px', flexDirection: 'column' }}>
            <button 
              onClick={() => {
                localStorage.clear();
                window.location.href = '/register';
              }}
              style={{ background: 'gold', color: 'black', border: 'none', padding: '15px 40px', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Create New Account
            </button>
            <button 
              onClick={handleLogout}
              style={{ background: '#333', color: '#fff', border: '1px solid gold', padding: '15px 40px', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Logout
            </button>
          </div>

          <p style={{ fontSize: '12px', color: '#666', marginTop: '30px', lineHeight: '1.6' }}>
            💡 Tip: Join as a referral of an active user to be added to their network instantly!
          </p>
        </div>
      </div>
    );
  }

  // ==== ACCOUNT BANNED PAGE ====
  if (user?.banned) {
    return (
      <div style={{ background: '#000', color: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', padding: '20px' }}>
        <div style={{ textAlign: 'center', maxWidth: '600px', background: '#111', padding: '60px 40px', borderRadius: '15px', border: '2px solid #FF4444' }}>
          <div style={{ fontSize: '80px', marginBottom: '30px' }}>🚫</div>
          <h1 style={{ color: '#FF4444', fontSize: '36px', marginBottom: '20px', fontWeight: 'bold' }}>ACCOUNT BANNED</h1>
          
          <div style={{ background: '#0a0a0a', padding: '25px', borderRadius: '10px', marginBottom: '30px', border: '1px solid #333' }}>
            <p style={{ fontSize: '18px', color: '#FFD700', marginBottom: '15px', fontWeight: 'bold' }}>⚠️ Access Denied</p>
            <p style={{ fontSize: '16px', color: '#fff', lineHeight: '1.6', marginBottom: '15px' }}>
              Your account has been permanently banned by the administrator. This action was taken due to violation of our terms and conditions.
            </p>
            <div style={{ background: '#1a1a1a', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
              <p style={{ color: '#888', fontSize: '14px', margin: '5px 0' }}>❌ Account Suspended</p>
              <p style={{ color: '#888', fontSize: '14px', margin: '5px 0' }}>❌ Access Revoked</p>
              <p style={{ color: '#888', fontSize: '14px', margin: '5px 0' }}>❌ Withdrawal Disabled</p>
            </div>
            <p style={{ fontSize: '15px', color: '#fff', lineHeight: '1.6' }}>
              If you believe this is a mistake, please <span style={{ color: 'gold', fontWeight: 'bold' }}>contact support</span> for further assistance.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '15px', flexDirection: 'column' }}>
            <button 
              onClick={() => window.open('https://wa.me/92', '_blank')}
              style={{ background: 'gold', color: 'black', border: 'none', padding: '15px 40px', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Contact Support
            </button>
            <button 
              onClick={handleLogout}
              style={{ background: '#333', color: '#fff', border: '1px solid gold', padding: '15px 40px', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Logout
            </button>
          </div>

          <p style={{ fontSize: '12px', color: '#666', marginTop: '30px', lineHeight: '1.6' }}>
            Account Status: <span style={{ color: '#FF4444', fontWeight: 'bold' }}>BANNED</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', display: 'flex', fontFamily: 'sans-serif' }}>
      
      {/* SIDEBAR START */}
      <div style={styles.sidebar} className="dashboard-sidebar">
      
  <div style={{textAlign: 'center', marginBottom: '20px'}}>
     <div style={styles.picContainer}>
        {profilePic ? <img src={profilePic} style={styles.imgCircle} /> : <div style={styles.imgPlaceholder}>👤</div>}
        <label style={styles.uploadLabel}>
          <input type="file" onChange={handleImageUpload} style={{display: 'none'}} />
          +
        </label>
     </div>
     <h2 style={{color: 'gold', fontSize: '16px', marginTop: '10px'}}>{editUsername}</h2>
  </div>
  
  <button onClick={() => handleTabChange('home')} style={activeTab === 'home' ? styles.navBtnActive : styles.navBtn}>🏠 Dashboard</button>
  <button onClick={() => handleTabChange('profile')} style={activeTab === 'profile' ? styles.navBtnActive : styles.navBtn}>👤 User Profile</button>
  <button onClick={() => handleTabChange('referral')} style={activeTab === 'referral' ? styles.navBtnActive : styles.navBtn}>� Referral History</button>
  <button onClick={() => handleTabChange('wallet')} style={activeTab === 'wallet' ? styles.navBtnActive : styles.navBtn}>💰 Wallet</button>
  <button onClick={() => handleTabChange('news')} style={activeTab === 'news' ? styles.navBtnActive : styles.navBtn}>📰 Daily News</button>

  {/* DYNAMIC SOCIAL LINKS & SLOGANS (Connected with Admin) */}
  <div style={{marginTop: '25px', borderTop: '1px solid #222', paddingTop: '15px'}}>
    <p style={{fontSize: '10px', color: 'gold', marginBottom: '12px', letterSpacing: '1px'}}>OFFICIAL CHANNELS</p>
    
    <div style={{display: 'flex', flexDirection: 'column', gap: '6px'}}>
      {/* 1. YouTube */}
      <a href={getLink(settings.ytLink)} target="_blank" rel="noopener noreferrer" style={styles.socialLinkItem}>
        <span style={{fontSize: '18px'}}>🔴</span>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <span style={styles.socialName}>YouTube</span>
          <span style={styles.socialSlogan}>{settings.ytSlogan || "Watch & Learn"}</span>
        </div>
      </a>

      {/* 2. TikTok */}
      <a href={getLink(settings.ttLink)} target="_blank" rel="noopener noreferrer" style={styles.socialLinkItem}>
        <span style={{fontSize: '18px'}}>📱</span>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <span style={styles.socialName}>TikTok</span>
          <span style={styles.socialSlogan}>{settings.ttSlogan || "Follow for Updates"}</span>
        </div>
      </a>

      {/* 3. Facebook */}
      <a href={getLink(settings.fbLink)} target="_blank" rel="noopener noreferrer" style={styles.socialLinkItem}>
        <span style={{fontSize: '18px'}}>📘</span>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <span style={styles.socialName}>Facebook</span>
          <span style={styles.socialSlogan}>{settings.fbSlogan || "Join Community"}</span>
        </div>
      </a>

      {/* 4. WhatsApp Channel */}
      <a href={getLink(settings.waLink)} target="_blank" rel="noopener noreferrer" style={styles.socialLinkItem}>
        <span style={{fontSize: '18px'}}>💬</span>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <span style={styles.socialName}>WhatsApp</span>
          <span style={styles.socialSlogan}>{settings.waSlogan || "Get Alerts"}</span>
        </div>
      </a>
      
      {/* 5. Instagram */}
      <a href={getLink(settings.igLink)} target="_blank" rel="noopener noreferrer" style={styles.socialLinkItem}>
        <span style={{fontSize: '18px'}}>📸</span>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <span style={styles.socialName}>Instagram</span>
          <span style={styles.socialSlogan}>{settings.igSlogan || "Our Stories"}</span>
        </div>
      </a>

      {/* 6. LinkedIn */}
      <a href={getLink(settings.liLink)} target="_blank" rel="noopener noreferrer" style={styles.socialLinkItem}>
        <span style={{fontSize: '18px'}}>🔗</span>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <span style={styles.socialName}>LinkedIn</span>
          <span style={styles.socialSlogan}>{settings.liSlogan || "Professional Network"}</span>
        </div>
      </a>

      {/* 7. Twitter */}
      <a href={getLink(settings.twLink)} target="_blank" rel="noopener noreferrer" style={styles.socialLinkItem}>
        <span style={{fontSize: '18px'}}>𝕏</span>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <span style={styles.socialName}>Twitter</span>
          <span style={styles.socialSlogan}>{settings.twSlogan || "Latest Updates"}</span>
        </div>
      </a>
    </div>
  </div>
  
  <button onClick={handleLogout} style={{...styles.logoutBtn, marginTop: '20px'}}>🚪 Logout</button>
  
</div>

    {/* 2. MAIN CONTENT START (Line 157) */}
    <div style={styles.main} className="dashboard-main">
      <div style={styles.header} className="dashboard-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={styles.hamburger} className="dashboard-hamburger" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>☰</div>
          <div>
            <h1 style={{fontSize: '30px', margin: 0}}>WELCOME <span style={{color: 'gold'}}>MILLIONAIRE</span></h1>
            <div style={{fontSize: '14px', color: '#aaa'}}>Network Strength: {calculatedNetworkStrength.toLocaleString()} / 1,000,000</div>
          </div>
        </div>
        <div style={styles.timerContainer}>
          <p style={{fontSize: '10px', margin: 0}}>
            {(activationStatus as ActivationStatusType) === 'approved' ? 'TIMER RUNNING' : 
             (activationStatus as ActivationStatusType) === 'expired' ? 'TIMER EXPIRED' : 
             (activationStatus as ActivationStatusType) === 'pending_chance' ? 'CHANCE PENDING' : 
             (activationStatus as ActivationStatusType) === 'locked' ? 'ACCOUNT LOCKED' :
             (activationStatus as ActivationStatusType) === 'completed' ? 'CHALLENGE COMPLETED' : 'NOT ACTIVATED'}
          </p>
          <h2 style={{margin: 0, color: activationStatus === 'approved' ? 'gold' : '#444'}}>{formatTime(timeLeft)}</h2>
        </div>
      </div>

        {/* TARGET SECTION */}
        {(() => {
          const isNetworkMet = calculatedNetworkStrength >= 1000000;
          const isPaymentsMet = approvedPaymentsCount === 11;
          const isWithdrawalReady = isNetworkMet && isPaymentsMet;
          return (
            <div style={{...styles.alertBox, ...(isWithdrawalReady ? {} : { filter: 'grayscale(100%)', opacity: 0.5 })}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                  <h1 style={{fontSize: '40px', margin: 0, fontWeight: 'bold'}}>RS. 1,000,000</h1>
                  <p style={{fontWeight: 'bold', color: isWithdrawalReady ? '#32CD32' : '#FFD700'}}>{isWithdrawalReady ? '✓ Ready to Withdraw' : 'Complete All Requirements'}</p>
                </div>
                <button onClick={() => { 
                  if (isWithdrawalReady) {
                    setActiveTab('wallet');
                  } else {
                    const missingNetwork = !isNetworkMet ? `Network: ${calculatedNetworkStrength.toLocaleString()}/1,000,000` : '';
                    const missingPayments = !isPaymentsMet ? `Payments: ${approvedPaymentsCount}/11` : '';
                    const message = [missingNetwork, missingPayments].filter(Boolean).join(' | ');
                    alert('⚠️ Not Ready Yet!\n' + message);
                  }
                }} style={{...styles.goldBtnLarge, opacity: isWithdrawalReady ? 1 : 0.5}} disabled={!isWithdrawalReady}>Withdraw</button>
              </div>
              <p style={{fontSize: '14px', color: '#888', marginTop: '10px'}}>
                Network: {calculatedNetworkStrength.toLocaleString()}/1,000,000 | Payments Approved: {approvedPaymentsCount}/11
              </p>
            </div>
          );
        })()}

        {/* 1. DASHBOARD TAB */}
        {activeTab === 'home' && (
          <div>
            {(activationStatus as ActivationStatusType) === 'locked' && (
              <div style={styles.alertBox}>
                <h2 style={{color: 'red', margin: '0 0 10px 0'}}>2 HOURS EXPIRED — CHALLENGE FAILED. ACCOUNT LOCKED.</h2>
                <p>11-member target not met in time. Create a new account or login with another approved user to restart.</p>
              </div>
            )}
            {(activationStatus as ActivationStatusType) === 'approved' && (
              <div style={styles.alertBox}>
                <h2 style={{color: 'gold', margin: '0 0 10px 0'}}>ACTIVE CHAIN</h2>
                <p>Timer is running. Complete 11 members within 2 hours.</p>
              </div>
            )}
            {activationStatus === 'completed' && (
              <div style={styles.alertBox}>
                <h2 style={{color: 'green', margin: '0 0 10px 0'}}>CHALLENGE COMPLETED!</h2>
                <p>Congratulations! You have successfully completed the 11 direct referrals within the time limit.</p>
              </div>
            )}
            {activationStatus === 'expired' && (
              <div style={styles.alertBox}>
                <h2 style={{color: 'gold', margin: '0 0 10px 0'}}>BUY {chanceLevel === 0 ? '1ST' : '2ND'} CHANCE ({chanceLevel === 0 ? 50 : 100} RS)</h2>
                <div style={styles.paymentRow}>
                  <p><b>JazzCash/EasyPaisa/Bank:</b> {settings.jazzcash} / {settings.easypaisa}</p>
                </div>
                <input type="text" placeholder="Enter Transaction ID (TID)" style={styles.tidInput} id="chanceTid" />
                <p style={{fontSize: '11px', color: '#888'}}>Amount Required: RS. {chanceLevel === 0 ? 50 : 100}</p>
                <p style={{fontSize: '11px', color: '#888'}}>Upload Payment Screenshot:</p>
                <input type="file" style={{marginBottom: '10px'}} />
                <button 
                  onClick={() => {
                    const tid = (document.getElementById('chanceTid') as HTMLInputElement).value;
                    if (tid) handleBuyChance(tid);
                    else alert('Enter TID');
                  }}
                  style={styles.goldBtnLarge}
                >
                  SUBMIT PAYMENT
                </button>
              </div>
            )}
            {activationStatus === 'pending_chance' && (
              <div style={styles.alertBox}>
                <h2 style={{color: 'gold', margin: '0 0 10px 0'}}>CHANCE PAYMENT PENDING APPROVAL</h2>
                <p>Your chance purchase is being reviewed by admin.</p>
              </div>
            )}
            {(activationStatus === 'not_requested' || activationStatus === 'pending' || activationStatus === 'approved') && (
              <div style={styles.alertBox}>
                <h2 style={{color: 'gold', margin: '0 0 10px 0'}}>ACTIVATE CHAIN</h2>
                <div style={styles.paymentRow}>
                  <p><b>JazzCash/EasyPaisa/Bank:</b> {settings.jazzcash} / {settings.easypaisa}</p>
                </div>
                <input type="text" placeholder="Enter Transaction ID (TID)" style={styles.tidInput} id="activationTid" />
                <input type="file" accept="image/*" style={{marginBottom: '10px'}} id="activationScreenshot" />
                <p style={{fontSize: '11px', color: '#888'}}>Amount Required: RS. 10</p>
                <button 
                  onClick={() => {
                    const tid = (document.getElementById('activationTid') as HTMLInputElement).value;
                    const screenshotInput = document.getElementById('activationScreenshot') as HTMLInputElement;
                    const screenshotFile = screenshotInput.files?.[0];
                    if (tid) handleRequestActivation(tid, screenshotFile);
                    else alert('Enter TID');
                  }}
                  disabled={paymentStatus === 'pending' || paymentStatus === 'approved'}
                  style={{
                    ...styles.goldBtnLarge,
                    opacity: paymentStatus === 'pending' || paymentStatus === 'approved' ? 0.5 : 1,
                    cursor: paymentStatus === 'pending' || paymentStatus === 'approved' ? 'not-allowed' : 'pointer',
                    backgroundColor: paymentStatus === 'approved' ? '#32CD32' : paymentStatus === 'rejected' ? '#FF6347' : 'gold'
                  }}
                >
                  {paymentStatus === 'not_requested' ? 'SEND REQUEST' : 
                   paymentStatus === 'pending' ? 'PENDING' : 
                   paymentStatus === 'approved' ? 'APPROVED' : 
                   paymentStatus === 'rejected' ? 'REJECTED' : 'SEND REQUEST'}
                </button>
                {paymentStatus === 'approved' && timerEndTime && (
                  <div style={{marginTop: '20px', textAlign: 'center', background: '#0a0a0a', padding: '15px', borderRadius: '10px', border: '1px solid #333'}}>
                    <h3 style={{color: 'gold', margin: '0 0 10px 0'}}>⏱️ TIMER - Complete 11 Referrals</h3>
                    <p style={{fontSize: '24px', color: '#32CD32', fontWeight: 'bold', margin: '10px 0'}}>{formatTime(timeLeft)}</p>
                    <p style={{fontSize: '12px', color: '#888', margin: '10px 0'}}>Referred Users: <span style={{color: 'gold'}}>{user?.referralCount || 0} / 11</span></p>
                    <div style={{marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #333'}}>
                      <p style={{fontSize: '12px', color: '#888', margin: '5px 0'}}>Approved Payments: <span style={{color: approvedPaymentsCount === 11 ? '#32CD32' : '#FFD700', fontWeight: 'bold'}}>{approvedPaymentsCount} / 11</span></p>
                      {approvedPaymentsCount < 11 && (
                        <p style={{fontSize: '10px', color: '#FFA500', margin: '5px 0'}}>⏳ تمام ادائیگیاں مکمل ہونے کے بعد پیش رفت شمار ہوگی</p>
                      )}
                      {approvedPaymentsCount === 11 && (
                        <p style={{fontSize: '10px', color: '#32CD32', margin: '5px 0'}}>✓ تمام ادائیگیاں مکمل! آپ کا ملین چین شروع ہو گیا ہے!</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
            <div style={{marginTop: '40px'}}>
              <h2 style={{textAlign: 'center', color: 'gold'}}>YOUR NETWORK PROGRESS</h2>
              <p style={{textAlign: 'center', color: '#888', fontSize: '12px'}}>⚠️ صرف 2 گھنٹے میں 11 اراکین شامل ہوں! (Only 11 users unlock in 2 hours to join the Million Chain!)</p>
              <p style={{textAlign: 'center', color: '#FFA500', fontSize: '11px', fontWeight: 'bold', margin: '10px 0'}}>📋 تمام ادائیگیاں منظور ہونے سے پہلے پیش رفت شمار نہیں ہوگی (Progress is not counted until all 11 payments are approved)</p>
              {paymentStatus === 'approved' && (
                <>
                  <p style={{textAlign: 'center', color: '#32CD32', fontSize: '13px', fontWeight: 'bold'}}>✓ Activation Approved - Timer Started!</p>
                  <p style={{textAlign: 'center', color: approvedPaymentsCount === 11 ? '#32CD32' : '#FFD700', fontSize: '12px', fontWeight: 'bold', margin: '5px 0'}}>Approved Payments: {approvedPaymentsCount} / 11</p>
                </>
              )}
              <div style={styles.grid}>
                {Array.from({ length: Math.max(11, networkReferrals.length) }, (_, i) => {
                  const pos = i + 1;
                  const ref = networkReferrals.find(r => r.position === pos);
                  const isLocked = !ref || ref.status === 'locked';
                  const isPendingPayment = ref && ref.status === 'unlocked' && !ref.paymentApproved;
                  console.log(`Box ${pos}:`, { ref, isLocked, referralCode: ref?.referralCode, isPendingPayment });
                  const link = `http://localhost:3000/register?ref=${user?.username || editUsername}-m${pos}`;
                  return (
                    <div key={i} style={isPendingPayment ? {...styles.cardOpen, borderColor: '#FFD700', opacity: 0.8} : isLocked ? styles.cardLocked : styles.cardOpen}>
                      <div style={{fontSize: '30px'}}>{isLocked ? '🔒' : isPendingPayment ? '⏳' : '👤'}</div>
                      <p style={{fontSize: '12px'}}>Member {pos}</p>
                      <p style={{fontSize: '10px', color: isPendingPayment ? '#FFD700' : 'gold'}}>{isLocked ? 'LOCKED' : isPendingPayment ? 'PENDING PAYMENT' : 'ACTIVE'}</p>
                      {!isLocked && ref?.paymentApproved && (
                        <div style={{fontSize: '11px', color: '#32CD32', fontWeight: 'bold', margin: '5px 0', fontFamily: "'Noto Nastaliq Urdu', serif"}}>
                          ✓ اللہ مبارک کرے<br/>
                          <span style={{fontSize: '10px', color: '#FFD700'}}>{ref?.referralCode || 'Unknown User'}</span>
                        </div>
                      )}
                      {isPendingPayment && (
                        <div style={{fontSize: '11px', color: '#FFD700', fontWeight: 'bold', margin: '5px 0', fontFamily: "'Noto Nastaliq Urdu', serif"}}>
                          ⏳ منتظر ادائیگی<br/>
                          <span style={{fontSize: '10px', color: '#888'}}>{ref?.referralCode || 'Unknown User'}</span>
                        </div>
                      )}
                      {isLocked && (
                        <div style={{textAlign: 'center'}}>
                          <a href={paymentStatus === 'approved' && (activationStatus as ActivationStatusType) !== 'locked' ? link : undefined} target="_blank" style={{fontSize: '8px', color: '#888', wordBreak: 'break-all', margin: '5px 0', textDecoration: 'underline', display: 'block', pointerEvents: paymentStatus === 'approved' && (activationStatus as ActivationStatusType) !== 'locked' ? 'auto' : 'none'}}>{link}</a>
                          <button onClick={() => paymentStatus === 'approved' && (activationStatus as ActivationStatusType) !== 'locked' && copyToClipboard(link)} disabled={paymentStatus !== 'approved' || (activationStatus as ActivationStatusType) === 'locked'} style={{...styles.goldBtnLarge, padding: '5px 10px', fontSize: '10px', opacity: paymentStatus === 'approved' && (activationStatus as ActivationStatusType) !== 'locked' ? 1 : 0.5, cursor: paymentStatus === 'approved' && (activationStatus as ActivationStatusType) !== 'locked' ? 'pointer' : 'not-allowed'}}>Copy Link</button>
                        </div>
                      )}
                    </div>
                  );
                })}
                <div 
                  style={{...styles.cardLocked, cursor: (activationStatus as ActivationStatusType) === 'locked' ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', opacity: (activationStatus as ActivationStatusType) === 'locked' ? 0.5 : 1}}
                  onClick={() => {
                    if ((activationStatus as ActivationStatusType) !== 'locked') {
                      const newPos = networkReferrals.length + 1;
                      setNetworkReferrals([...networkReferrals, { position: newPos, referralCode: '', status: 'locked', paymentApproved: false }]);
                    }
                  }}
                >
                  +
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. USER PROFILE TAB */}
        {activeTab === 'profile' && (
          <div style={styles.alertBox}>
            <h2 style={{color: 'gold', marginBottom: '20px'}}>CUSTOMIZE PROFILE</h2>
            <div style={{textAlign: 'left', maxWidth: '400px', margin: '0 auto'}}>
              <label>Username (Sidebar Name):</label>
              <input value={editUsername} onChange={(e)=>setEditUsername(e.target.value)} style={styles.tidInput} />
              <label>Full Name:</label>
              <input value={editName} onChange={(e)=>setEditName(e.target.value)} style={styles.tidInput} />
              <label>Phone Number:</label>
              <input value={editPhone} onChange={(e)=>setEditPhone(e.target.value)} style={styles.tidInput} />
              <label>Location / Country:</label>
              <input value={editLocation} onChange={(e)=>setEditLocation(e.target.value)} style={styles.tidInput} />
              <p><b>Email:</b> {user.email} (Fixed)</p>
              
              <h3 style={{color: 'gold', marginTop: '30px'}}>Change Password</h3>
              <label>Old Password:</label>
              <input type="password" value={oldPassword} onChange={(e)=>setOldPassword(e.target.value)} style={styles.tidInput} />
              <label>New Password:</label>
              <input type="password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} style={styles.tidInput} />
              <button 
                onClick={async () => {
                  if (!oldPassword || !newPassword) {
                    alert('Please fill both passwords');
                    return;
                  }
                  try {
                    const res = await fetch('http://localhost:5000/api/auth/update-password', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email: user.email, oldPassword, newPassword })
                    });
                    const data = await res.json();
                    alert(data.message);
                    if (res.ok) {
                      setOldPassword('');
                      setNewPassword('');
                    }
                  } catch (err) {
                    alert('Error updating password');
                  }
                }}
                style={styles.goldBtnLarge}
              >
                UPDATE PASSWORD
              </button>
            </div>
            <button style={styles.goldBtnLarge}>SAVE CHANGES</button>
          </div>
        )}

        {/* 3. REFERRAL HISTORY TAB */}
        {activeTab === 'referral' && (
          <div style={styles.card}>
            <h2 style={{color: 'gold', marginBottom: '20px'}}>📊 REFERRAL HISTORY</h2>
            <p style={{fontSize: '14px', color: '#888', marginBottom: '20px'}}>Your referred users and their team sizes:</p>
            <div style={{background: '#0a0a0a', padding: '15px', borderRadius: '8px', border: '1px solid #333', marginBottom: '20px'}}>
              <p style={{fontSize: '12px', color: '#FFD700', margin: '0', fontWeight: 'bold'}}>📋 Important: Team counts are only shown after all 11 payments are approved</p>
              <p style={{fontSize: '11px', color: '#888', margin: '5px 0 0 0'}}>تمام ادائیگیاں منظور ہونے کے بعد ہی ٹیم کی تعداد شمار ہوگی</p>
            </div>
            
            {completedUsers.length === 0 ? (
              <p style={{textAlign: 'center', color: '#666'}}>No referrals yet</p>
            ) : (
              <div style={{maxHeight: '400px', overflowY: 'auto'}}>
                {completedUsers.map((referredUser: any) => {
                  const teamCount = referredUser.totalNetworkSize || 0;
                  const directReferrals = referredUser.referralCount || 0;
                  const approvedPaymentsForUser = (referredUser.networkReferrals || []).filter((r: any) => r.paymentApproved).length;
                  const allPaymentsApproved = approvedPaymentsForUser >= 11;
                  const isCompleted = (directReferrals >= 11 || (referredUser.networkReferrals && referredUser.networkReferrals.filter((r: any) => r.status === 'unlocked').length >= 11)) && allPaymentsApproved;
                  
                  return (
                    <div key={referredUser._id} style={{
                      background: '#111',
                      padding: '15px',
                      marginBottom: '10px',
                      borderRadius: '8px',
                      border: '1px solid #333'
                    }}>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <div>
                          <h3 style={{color: 'gold', margin: '0 0 5px 0', fontSize: '16px'}}>
                            {referredUser.name}
                          </h3>
                          <p style={{color: '#888', margin: '0', fontSize: '12px'}}>
                            Username: {referredUser.username}
                          </p>
                          <p style={{color: '#888', margin: '0', fontSize: '12px'}}>
                            Direct Referrals: {directReferrals}/11 {directReferrals >= 11 ? '✓' : ''}
                          </p>
                          <p style={{color: approvedPaymentsForUser > 0 ? '#FFD700' : '#888', margin: '0', fontSize: '12px', fontWeight: allPaymentsApproved ? 'bold' : 'normal'}}>
                            Approved Payments: {approvedPaymentsForUser}/11 {allPaymentsApproved ? '✓' : ''}
                          </p>
                        </div>
                        <div style={{textAlign: 'right'}}>
                          <div style={{color: 'gold', fontSize: '18px', fontWeight: 'bold'}}>
                            Team: {isCompleted ? teamCount.toLocaleString() : 'N/A'}
                          </div>
                          <div style={{color: isCompleted ? '#32CD32' : '#FFA500', fontSize: '12px'}}>
                            {isCompleted ? '✅ Completed' : allPaymentsApproved ? '✓ Payments Ready' : '⏳ In Progress'}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            <div style={{marginTop: '30px', padding: '20px', background: '#111', borderRadius: '8px', border: '1px solid #333'}}>
              <h3 style={{color: 'gold', margin: '0 0 15px 0'}}>Your Referral Link</h3>
              <p style={{fontSize: '12px', color: '#888', marginBottom: '10px'}}>Share this link to invite new members:</p>
              <div style={{background: '#000', padding: '10px', border: '1px dashed gold', margin: '10px 0', fontSize: '11px', wordBreak: 'break-all'}}>
                {`${window.location.origin}/register?ref=${user?.username || 'USER'}-m1`}
              </div>
              <button onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/register?ref=${user?.username || 'USER'}-m1`);
                alert('Referral link copied!');
              }} style={styles.goldBtnLarge}>
                COPY REFERRAL LINK
              </button>
            </div>
          </div>
        )}

        {/* 4. WALLET TAB */}
        {activeTab === 'wallet' && (
          <div style={styles.alertBox}>
            <h2 style={{color: 'gold', marginBottom: '20px'}}>Withdrawal Request</h2>
            {(() => {
              const isNetworkMet = calculatedNetworkStrength >= 1000000;
              const isPaymentsMet = approvedPaymentsCount === 11;
              const isWithdrawalReady = isNetworkMet && isPaymentsMet;
              
              return (
                <>
                  <form onSubmit={handleSubmitWithdrawal}>
                    <label style={styles.fieldLabel}>Withdrawal Amount</label>
                    <input
                      type="text"
                      value="1,000,000"
                      readOnly
                      style={styles.tidInput}
                    />

                    <label style={styles.fieldLabel}>Payment Method</label>
                    <select
                      style={styles.tidInput}
                      value={withdrawalData.method}
                      onChange={(e) => setWithdrawalData({...withdrawalData, method: e.target.value})}
                      disabled={!isWithdrawalReady}
                    >
                      <option value="">Select Method</option>
                      <option value="JazzCash">JazzCash</option>
                      <option value="EasyPaisa">EasyPaisa</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                    </select>

                    <label style={styles.fieldLabel}>Account Number / IBAN</label>
                    <input
                      type="text"
                      placeholder="Enter account details"
                      value={withdrawalData.account}
                      style={styles.tidInput}
                      onChange={(e) => setWithdrawalData({...withdrawalData, account: e.target.value})}
                      disabled={!isWithdrawalReady}
                    />

                    <label style={styles.fieldLabel}>Security Captcha (Type 7H9K)</label>
                    <input
                      type="text"
                      placeholder="7H9K"
                      value={withdrawalData.captcha}
                      style={styles.tidInput}
                      onChange={(e) => setWithdrawalData({...withdrawalData, captcha: e.target.value})}
                      disabled={!isWithdrawalReady}
                    />

                    <button
                      type="submit"
                      style={{...styles.goldBtnLarge, opacity: !isWithdrawalReady || withdrawalStatus === 'pending' ? 0.5 : 1}}
                      disabled={!isWithdrawalReady || withdrawalStatus === 'pending'}
                    >
                      {!isWithdrawalReady ? 'Not Ready' : withdrawalStatus === 'pending' ? 'Sending...' : 'Submit Withdrawal'}
                    </button>

                    {withdrawalMessage && (
                      <p style={{ marginTop: '12px', color: withdrawalStatus === 'failed' ? '#FF6347' : '#32CD32' }}>
                        {withdrawalMessage}
                      </p>
                    )}
                  </form>
                  {!isWithdrawalReady && (
                    <div style={{marginTop: '20px', padding: '15px', background: '#0a0a0a', borderRadius: '8px', border: '1px solid #333', textAlign: 'center'}}>
                      <p style={{color: '#888', margin: '0', marginBottom: '10px'}}>⚠️ Withdrawal Requirements:</p>
                      <p style={{color: isNetworkMet ? '#32CD32' : '#FF6347', margin: '5px 0', fontSize: '12px', fontWeight: 'bold'}}>
                        {isNetworkMet ? '✓' : '✗'} Network Strength: {calculatedNetworkStrength.toLocaleString()} / 1,000,000
                      </p>
                      <p style={{color: isPaymentsMet ? '#32CD32' : '#FF6347', margin: '5px 0', fontSize: '12px', fontWeight: 'bold'}}>
                        {isPaymentsMet ? '✓' : '✗'} All Payments Approved: {approvedPaymentsCount} / 11
                      </p>
                      {!isNetworkMet && (
                        <p style={{color: '#FFD700', margin: '10px 0 0 0', fontSize: '11px'}}>
                          Need {(1000000 - calculatedNetworkStrength).toLocaleString()} more team members
                        </p>
                      )}
                      {!isPaymentsMet && (
                        <p style={{color: '#FFD700', margin: '10px 0 0 0', fontSize: '11px'}}>
                          تمام 11 ادائیگیاں منظور ہونے کا انتظار کریں ({ 11 - approvedPaymentsCount} باقی)
                        </p>
                      )}
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        )}
        {/* DAILY NEWS TAB */}
        {activeTab === 'news' && (
          <div style={styles.card}>
            <h2 style={{color: 'gold', marginBottom: '20px'}}>📰 Daily News & Updates</h2>
            {news.length > 0 ? (
              <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                {news.map((item, index) => (
                  <div key={index} style={{borderBottom: '1px solid #111', paddingBottom: '10px'}}>
                    <p style={{fontSize: '14px', margin: '0 0 5px 0'}}>{item.content}</p>
                    <small style={{color: '#444'}}>{new Date(item.date).toLocaleDateString()}</small>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{color: '#888'}}>No news available</p>
            )}
          </div>
        )}

      </div>
    
  
      {/* Urdu Modal Notice */}
      {showUrduModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalHeading}>ملینیر چیلنج کی اہم تفصیلات</h2>
            <div style={styles.modalText}>
              ملینیر چیلنج میں خوش آمدید! چیلنج شروع کرنے سے پہلے یہ باتیں غور سے پڑھ لیں:<br/><br/>
              • انٹری اور چیلنج: چیلنج میں شامل ہونے کی فیس صرف 10 روپے ہے (ناقابلِ واپسی)۔ آپ نے صرف 2 گھنٹے میں اپنے 11 ممبرز پورے کرنے ہیں۔<br/><br/>
              • ناکام ہونے پر اضافی چانس: اگر 2 گھنٹے میں 11 ممبرز نہیں ہوتے تو گھبرائیں نہیں! پہلا اضافی چانس آپ کو 50 روپے میں ملے گا۔ اگر پھر بھی مکمل نہ ہو سکے تو اگلا چانس 100 روپے میں ملے گا تاکہ آپ کی محنت ضائع نہ ہو۔<br/><br/>
              • لیول سسٹم کی طاقت (10 سے 10 لاکھ تک): جب آپ اپنے 11 ممبرز پورے کریں گے تو آپ کا کام ختم! اب وہ 11 ممبرز اپنے 11، 11 ممبرز بنائیں گے جو دیکھتے ہی دیکھتے 121 (لیول 1) پر پہنچ جائیں گے۔ اسی طرح جب ہر ممبر اپنی 11 کی ٹیم بناتا جائے گا تو آپ کی شروع کی گئی چین 1 ملین (10 لاکھ) کو چھو لے گی اور آپ 10 روپے سے 10 لاکھ روپے جیت جائیں گے۔<br/><br/>
              • وارننگ (انتہائی ضروری): غلط ٹرانزیکشن آئی ڈی (TID) یا جعلی سکرین شاٹ بھیجنے والے کو فوری طور پر بلاک کر دیا جائے گا اور ہمیشہ کے لیے چین سے ریموو (خارج) کر دیا جائے گا۔<br/><br/>
              یہ چیلنج آپ کی زندگی بدل سکتا ہے، بس 11 لوگوں سے شروعات کریں!
            </div>
            <button onClick={() => setShowUrduModal(false)} style={styles.modalButton}>میں چیلنج کے لیے تیار ہوں</button>
          </div>
        </div>
      )}

      {/* Congratulations Modal - All 11 Payments Completed */}
      {showCongratulationsModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={{...styles.modalHeading, fontSize: '36px'}}>🎉 مبارک ہو! 🎉</h2>
            <div style={styles.modalText}>
              <p style={{fontSize: '24px', color: '#32CD32', fontWeight: 'bold', margin: '20px 0'}}>آپ نے کامیابی سے<br/>11 ادائیگیاں مکمل کر لیں!</p>
              <p style={{fontSize: '18px', color: 'gold', margin: '20px 0'}}>آپ کے تمام 11 ممبرز اب شامل ہو گئے ہیں۔</p>
              <p style={{fontSize: '16px', color: '#FFD700', margin: '20px 0', lineHeight: 1.6}}>
                آپ کا ملین چین شروع ہو گیا ہے!<br/>
                اب آپ کے 11 ممبرز اپنے 11، 11 ممبرز بنائیں گے۔<br/>
                (10 روپے = 10 لاکھ روپے)
              </p>
              <div style={{padding: '15px', background: '#1a1a1a', borderRadius: '8px', border: '1px solid gold', marginTop: '20px'}}>
                <p style={{fontSize: '14px', color: '#888', margin: '0'}}>اللہ تمہاری کوشش کو قبول کرے اور یہ رقم تمہیں خوش حال رکھے۔</p>
              </div>
            </div>
            <button onClick={() => setShowCongratulationsModal(false)} style={styles.modalButton}>بہترین! اگلا قدم</button>
          </div>
        </div>
      )}

</div>
);
};

export default Dashboard;