import { useState, useEffect } from 'react';
import { getApiBaseUrl } from '../utils/api';
import { API_BASE_URL, apiGet, apiPost, apiPut } from '../utils/apiConfig';
import dynamic from 'next/dynamic';

const ManageBlogs = dynamic(() => import('./admin/manage-blogs'), { ssr: false });

const AdminPanel = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [activeTab, setActiveTab] = useState('requests');
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAdmin(true);
    }
    setActiveTab(localStorage.getItem('adminActiveTab') || 'requests');
  }, []);
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    localStorage.setItem('adminActiveTab', tab);
  };
  
  // --- DATABASE STATES ---
  const [users, setUsers] = useState<any[]>([]);
  const [lockedAccounts, setLockedAccounts] = useState<any[]>([]);

  const [paymentRequests, setPaymentRequests] = useState<any[]>([]);
  const [allPayments, setAllPayments] = useState<any[]>([]);
  const [taskSubmissions, setTaskSubmissions] = useState<any[]>([]);

  // Loading and error states
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [errorUsers, setErrorUsers] = useState<string | null>(null);
  const [isLoadingPayments, setIsLoadingPayments] = useState(true);
  const [errorPayments, setErrorPayments] = useState<string | null>(null);
  const [isLoadingAllPayments, setIsLoadingAllPayments] = useState(true);
  const [errorAllPayments, setErrorAllPayments] = useState<string | null>(null);
  const [isLoadingLockedAccounts, setIsLoadingLockedAccounts] = useState(true);
  const [errorLockedAccounts, setErrorLockedAccounts] = useState<string | null>(null);
  const [isLoadingTaskSubmissions, setIsLoadingTaskSubmissions] = useState(true);
  const [errorTaskSubmissions, setErrorTaskSubmissions] = useState<string | null>(null);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoadingUsers(true);
      setErrorUsers(null);
      try {
        const response = await apiGet('/api/admin/users');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.error('Expected array of users, got:', data);
          setUsers([]);
        }
      } catch (err) {
        console.log('Error fetching users:', err);
        setErrorUsers('Failed to load users. Please try again.');
      } finally {
        setIsLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  // Fetch payment requests
  useEffect(() => {
    const fetchPayments = async () => {
      setIsLoadingPayments(true);
      setErrorPayments(null);
      try {
        const response = await apiGet('/api/admin/pending-payments');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setPaymentRequests(data);
        } else if (data && Array.isArray((data as any).pendingPayments)) {
          setPaymentRequests((data as any).pendingPayments);
        } else {
          console.error('Expected array for pending payments, got:', data);
          setPaymentRequests([]);
        }
      } catch (err) {
        console.log('Error fetching payments:', err);
        setErrorPayments('Failed to load payment requests. Please try again.');
      } finally {
        setIsLoadingPayments(false);
      }
    };
    fetchPayments();
    // Load once on mount - no auto-refresh
    // Use manual Refresh button for updates
  }, []);

  // Fetch all payments (pending, approved, rejected)
  useEffect(() => {
    const fetchAllPayments = async () => {
      setIsLoadingAllPayments(true);
      setErrorAllPayments(null);
      try {
        const response = await apiGet('/api/admin/all-payments');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setAllPayments(data);
        } else {
          console.error('Expected array for all payments, got:', data);
          setAllPayments([]);
        }
      } catch (err) {
        console.log('Error fetching all payments:', err);
        setErrorAllPayments('Failed to load transaction history. Please try again.');
      } finally {
        setIsLoadingAllPayments(false);
      }
    };
    fetchAllPayments();
    // Load once on mount - no auto-refresh
    // Use manual Refresh button for updates
  }, []);

  // Fetch locked accounts
  useEffect(() => {
    const fetchLockedAccounts = async () => {
      setIsLoadingLockedAccounts(true);
      setErrorLockedAccounts(null);
      try {
        const response = await apiGet('/api/admin/locked-accounts');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setLockedAccounts(data);
        } else {
          console.error('Expected array for locked accounts, got:', data);
          setLockedAccounts([]);
        }
      } catch (err) {
        console.log('Error fetching locked accounts:', err);
        setErrorLockedAccounts('Failed to load locked accounts. Please try again.');
      } finally {
        setIsLoadingLockedAccounts(false);
      }
    };
    fetchLockedAccounts();
    // Load once on mount - no auto-refresh
    // Use manual Refresh button for updates
  }, []);

  // Fetch task submissions
  useEffect(() => {
    const fetchTaskSubmissions = async () => {
      setIsLoadingTaskSubmissions(true);
      setErrorTaskSubmissions(null);
      try {
        const response = await apiGet('/api/admin/task-submissions');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setTaskSubmissions(data);
        } else if (data && Array.isArray((data as any).taskSubmissions)) {
          setTaskSubmissions((data as any).taskSubmissions);
        } else {
          console.error('Expected array for task submissions, got:', data);
          setTaskSubmissions([]);
        }
      } catch (err) {
        console.log('Error fetching task submissions:', err);
        setErrorTaskSubmissions('Failed to load task submissions. Please try again.');
      } finally {
        setIsLoadingTaskSubmissions(false);
      }
    };
    fetchTaskSubmissions();
    // Load once on mount - no auto-refresh
    // Use manual Refresh button for updates
  }, []);

  // Retry functions
  const retryFetchUsers = () => {
    const fetchUsers = async () => {
      setIsLoadingUsers(true);
      setErrorUsers(null);
      try {
        const response = await apiGet('/api/admin/users');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.error('Expected array of users, got:', data);
          setUsers([]);
        }
      } catch (err) {
        console.log('Error fetching users:', err);
        setErrorUsers('Failed to load users. Please try again.');
      } finally {
        setIsLoadingUsers(false);
      }
    };
    fetchUsers();
  };

  const retryFetchPayments = () => {
    const fetchPayments = async () => {
      setIsLoadingPayments(true);
      setErrorPayments(null);
      try {
        const response = await apiGet('/api/admin/pending-payments');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setPaymentRequests(data);
        } else if (data && Array.isArray((data as any).pendingPayments)) {
          setPaymentRequests((data as any).pendingPayments);
        } else {
          console.error('Expected array for pending payments, got:', data);
          setPaymentRequests([]);
        }
      } catch (err) {
        console.log('Error fetching payments:', err);
        setErrorPayments('Failed to load payment requests. Please try again.');
      } finally {
        setIsLoadingPayments(false);
      }
    };
    fetchPayments();
  };

  const retryFetchAllPayments = () => {
    const fetchAllPayments = async () => {
      setIsLoadingAllPayments(true);
      setErrorAllPayments(null);
      try {
        const response = await apiGet('/api/admin/all-payments');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setAllPayments(data);
        } else {
          console.error('Expected array for all payments, got:', data);
          setAllPayments([]);
        }
      } catch (err) {
        console.log('Error fetching all payments:', err);
        setErrorAllPayments('Failed to load transaction history. Please try again.');
      } finally {
        setIsLoadingAllPayments(false);
      }
    };
    fetchAllPayments();
  };

  const retryFetchLockedAccounts = () => {
    const fetchLockedAccounts = async () => {
      setIsLoadingLockedAccounts(true);
      setErrorLockedAccounts(null);
      try {
        const response = await apiGet('/api/admin/locked-accounts');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setLockedAccounts(data);
        } else {
          console.error('Expected array for locked accounts, got:', data);
          setLockedAccounts([]);
        }
      } catch (err) {
        console.log('Error fetching locked accounts:', err);
        setErrorLockedAccounts('Failed to load locked accounts. Please try again.');
      } finally {
        setIsLoadingLockedAccounts(false);
      }
    };
    fetchLockedAccounts();
  };

  const retryFetchTaskSubmissions = () => {
    const fetchTaskSubmissions = async () => {
      setIsLoadingTaskSubmissions(true);
      setErrorTaskSubmissions(null);
      try {
        const response = await apiGet('/api/admin/task-submissions');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setTaskSubmissions(data);
        } else if (data && Array.isArray((data as any).taskSubmissions)) {
          setTaskSubmissions((data as any).taskSubmissions);
        } else {
          console.error('Expected array for task submissions, got:', data);
          setTaskSubmissions([]);
        }
      } catch (err) {
        console.log('Error fetching task submissions:', err);
        setErrorTaskSubmissions('Failed to load task submissions. Please try again.');
      } finally {
        setIsLoadingTaskSubmissions(false);
      }
    };
    fetchTaskSubmissions();
  };

  // --- SETTINGS STATES ---
  const [settings, setSettings] = useState({
    jazzcash: '0300-1234567',
    easypaisa: '0345-1234567',
    withdrawLimit: '500',
    ytLink: '', ytSlogan: 'Subscribe for Updates',
    ttLink: '', ttSlogan: 'Follow for Fun',
    twLink: '', twSlogan: 'Latest Updates',
    fbLink: '', fbSlogan: 'Join Our Community',
    liLink: '', liSlogan: 'Professional Network',
    waLink: '', waSlogan: 'Get Alerts on WhatsApp',
    igLink: '', igSlogan: 'See Our Stories',
    notice: ''
  });

  const [newsText, setNewsText] = useState('');

  // Fetch settings on component mount
  useEffect(() => {
    fetch(`${getApiBaseUrl()}/api/admin/get-settings`)
      .then(res => res.json())
      .then(data => {
        console.log("Settings Data:", data);
        if (data && Object.keys(data).length > 0) {
          setSettings(prevSettings => ({ ...prevSettings, ...data }));
        }
      })
      .catch(err => console.log('Error fetching settings:', err));
    setActiveTab(localStorage.getItem('adminActiveTab') || 'requests');
  }, []);

  // --- FUNCTIONS ---
  const handlePaymentAction = async (id: string, action: string, type: string) => {
    if (action === 'approve') {
      try {
        const response = await apiPost('/api/admin/approve-payment', { paymentId: id });
        if (response.ok) {
          alert('✅ Payment approved!');
          // Refresh the list
          window.location.reload();
        } else {
          const data = await response.json();
          alert('❌ Error: ' + (data.error || 'Failed to approve payment'));
        }
      } catch (err) {
        alert('❌ Error approving payment: ' + err);
      }
    } else if (action === 'reject') {
      try {
        const response = await apiPost('/api/admin/reject-payment', { paymentId: id });
        if (response.ok) {
          alert('✅ Payment rejected!');
          // Refresh the list
          window.location.reload();
        } else {
          const data = await response.json();
          alert('❌ Error: ' + (data.error || 'Failed to reject payment'));
        }
      } catch (err) {
        alert('❌ Error rejecting payment: ' + err);
      }
    }
  };

  const banUser = async (id: string) => {
    try {
      await apiPut(`/api/admin/ban-user/${id}`, {});
      alert("User Banned!");
      // Refresh users
      window.location.reload();
    } catch (err) {
      alert('Error banning user');
    }
  };

  const reactiveUser = async (id: string) => {
    try {
      await apiPut(`/api/admin/unban-user/${id}`, {});
      alert("User Unbanned!");
      // Refresh users
      window.location.reload();
    } catch (err) {
      alert('Error unbanning user');
    }
  };

  const updateUser = async (userId: string, updatedData: any) => {
    try {
      await apiPut('/api/admin/update-user', { userId, ...updatedData });
      alert("User Updated!");
      // Refresh users
      window.location.reload();
    } catch (err) {
      alert('Error updating user');
    }
  };

  const handleSaveSettings = async () => {
    console.log('Saving Settings:', settings);
    try {
        const response = await apiPost('/api/admin/update-settings', settings);
        const data = await response.json();
        console.log('Update settings response:', response.status, data);

        if (response.ok) {
            alert('✅ Mubarak Ho! Saari Settings Database mein save ho gayi hain.');
        } else {
            console.error('Failed to save settings:', data);
            alert(`Error saving settings: ${data.error || data.message || 'Unknown error'}`);
        }
    } catch (error: any) {
        console.error('Network error saving settings:', error);
        alert(`❌ Connection Fail! ${error.message || 'Check backend server and network.'}`);
    }
  };

  const handlePostNews = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first');
      window.location.href = '/login';
      return;
    }
    if (!newsText.trim()) {
      alert("Please enter news content.");
      return;
    }
    try {
        const response = await apiPost('/api/admin/post-news', { content: newsText });
        const data = await response.json();
        console.log('Post news response:', response.status, data);
        
        if (response.ok) {
            alert("✅ News Posted Successfully!");
            setNewsText('');
        } else {
            console.error('Failed to post news:', data);
            if (response.status === 403) {
              alert('Admin access required');
            } else {
              alert(`Error posting news: ${data.message || 'Unknown error'}`);
            }
        }
    } catch (error) {
        console.error('Network error posting news:', error);
        alert("❌ Network error. Check console for details.");
    }
  };

  const handleAdminLogin = async () => {
    try {
      const response = await apiPost('/api/auth/admin-login', { key: adminPass });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        setIsAdmin(true);
      } else {
        alert('Invalid admin key');
      }
    } catch (error) {
      alert('Login failed');
    }
  };

  // Backfill locked account records for existing locked users
  const handleBackfillLockedAccounts = async () => {
    if (!confirm('This will create missing LockedAccount records for all locked users. Continue?')) return;
    try {
      const response = await apiPost('/api/admin/backfill-locked-accounts', {});
      const data = await response.json();
      if (response.ok) {
        alert(`✅ Backfill Complete!\nCreated: ${data.created}\nSkipped: ${data.skipped}\nTotal: ${data.total}`);
        window.location.reload();
      } else {
        alert('❌ Error during backfill: ' + data.error);
      }
    } catch (err) {
      alert('❌ Backfill failed');
    }
  };

  // Process expired users (timers that have ended)
  const handleExpireOverdueUsers = async () => {
    if (!confirm('This will lock users whose 2-hour timer has expired and referral count < 11. Continue?')) return;
    try {
      const response = await apiPost('/api/admin/expire-overdue-users', {});
      const data = await response.json();
      if (response.ok) {
        alert(`✅ Processing Complete!\nUsers Processed: ${data.processed}`);
        window.location.reload();
      } else {
        alert('❌ Error during processing: ' + data.error);
      }
    } catch (err) {
      alert('❌ Processing failed');
    }
  };

  // Refresh locked accounts list
  const handleRefreshLockedAccounts = async () => {
    try {
      const response = await apiGet('/api/admin/locked-accounts');
      const data = await response.json();
      if (Array.isArray(data)) {
        setLockedAccounts(data);
        alert(`✅ Refreshed! Found ${data.length} locked accounts`);
      }
    } catch (err) {
      alert('❌ Error refreshing');
    }
  };

  // Create test locked account record
  const handleCreateTestLockedAccount = async () => {
    if (!confirm('This will create a LockedAccount record for the first locked user in database. Continue?')) return;
    try {
      const response = await apiPost('/api/admin/create-test-locked-account', {});
      const data = await response.json();
      if (response.ok) {
        alert(`✅ Test record created!\nUsername: ${data.record.username}`);
        handleRefreshLockedAccounts();
      } else {
        alert('❌ Error: ' + data.error);
      }
    } catch (err) {
      alert('❌ Failed to create test record');
    }
  };

  if (!isAdmin) {
    return (
      <div style={styles.loginOverlay}>
        <div style={styles.loginBox}>
          <h1 style={{color: 'gold'}}>ADMIN ACCESS</h1>
          <input type="password" placeholder="Admin Key" style={styles.loginInput} onChange={(e)=>setAdminPass(e.target.value)} />
          <button onClick={handleAdminLogin} style={styles.goldBtnLarge}>UNLOCK</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#050505', color: '#fff', minHeight: '100vh', display: 'flex', fontFamily: 'sans-serif' }}>
      
      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <h2 style={{color: 'gold', textAlign: 'center'}}>ADMIN</h2>
        <button onClick={() => handleTabChange('overview')} style={activeTab === 'overview' ? styles.navBtnActive : styles.navBtn}>📊 Overview</button>
        <button onClick={() => handleTabChange('network_progress')} style={activeTab === 'network_progress' ? styles.navBtnActive : styles.navBtn}>🌐 Network Progress</button>
        <button onClick={() => handleTabChange('requests')} style={activeTab === 'requests' ? styles.navBtnActive : styles.navBtn}>💰 Payment Requests</button>
        <button onClick={() => handleTabChange('withdraw_approvals')} style={activeTab === 'withdraw_approvals' ? styles.navBtnActive : styles.navBtn}>💎 Mega Withdrawals</button>
        <button onClick={() => handleTabChange('txn_history')} style={activeTab === 'txn_history' ? styles.navBtnActive : styles.navBtn}>🧾 Transaction History</button>
        <button onClick={() => handleTabChange('register')} style={activeTab === 'register' ? styles.navBtnActive : styles.navBtn}>📝 Registered Users</button>
        <button onClick={() => handleTabChange('locked_accounts')} style={activeTab === 'locked_accounts' ? styles.navBtnActive : styles.navBtn}>🔒 Locked Accounts</button>
        <button onClick={() => handleTabChange('task_submissions')} style={activeTab === 'task_submissions' ? styles.navBtnActive : styles.navBtn}>📋 Task Submissions</button>
        <button onClick={() => handleTabChange('social_settings')} style={activeTab === 'social_settings' ? styles.navBtnActive : styles.navBtn}>🌐 Social Settings</button>
        <button onClick={() => handleTabChange('manage_news')} style={activeTab === 'manage_news' ? styles.navBtnActive : styles.navBtn}>📰 Manage News</button>
        <button onClick={() => handleTabChange('manage_blogs')} style={activeTab === 'manage_blogs' ? styles.navBtnActive : styles.navBtn}>📝 Manage Blogs</button>
        <button onClick={() => handleTabChange('maintenance')} style={activeTab === 'maintenance' ? styles.navBtnActive : styles.navBtn}>🛠️ Maintenance</button>
        <button onClick={() => { window.location.href = '/admin/customize-tasks'; }} style={styles.navBtn}>🧩 Customize Tasks</button>
        <button onClick={() => handleTabChange('change_password')} style={activeTab === 'change_password' ? styles.navBtnActive : styles.navBtn}>🔑 Change Password</button>
        <button onClick={() => { localStorage.removeItem('token'); setIsAdmin(false); window.location.href='/'; }} style={styles.logoutBtn}>🚪 Logout Admin</button>
      </div>

      <div style={styles.main}>
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div style={styles.card}>
            <h2 style={{color: 'gold', marginBottom: '30px', fontSize: '28px'}}>📊 Admin Overview Dashboard</h2>
            
            {/* Statistics Grid */}
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px'}}>
              
              {/* Total Users Card */}
              <div style={{
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                border: '2px solid #0f3460',
                borderRadius: '15px',
                padding: '25px',
                boxShadow: '0 0 20px rgba(15, 52, 96, 0.3)',
                textAlign: 'center'
              }}>
                <div style={{fontSize: '40px', marginBottom: '10px'}}>👥</div>
                <div style={{fontSize: '14px', color: '#888', marginBottom: '8px'}}>Total Users</div>
                <div style={{fontSize: '36px', color: '#00D9FF', fontWeight: 'bold'}}>{users.length}</div>
                <div style={{fontSize: '12px', color: '#666', marginTop: '10px'}}>Registered Members</div>
              </div>

              {/* Blocked Users Card */}
              <div style={{
                background: 'linear-gradient(135deg, #2e1a1a 0%, #3e1616 100%)',
                border: '2px solid #600f0f',
                borderRadius: '15px',
                padding: '25px',
                boxShadow: '0 0 20px rgba(96, 15, 15, 0.3)',
                textAlign: 'center'
              }}>
                <div style={{fontSize: '40px', marginBottom: '10px'}}>🚫</div>
                <div style={{fontSize: '14px', color: '#888', marginBottom: '8px'}}>Blocked Users</div>
                <div style={{fontSize: '36px', color: '#FF6B6B', fontWeight: 'bold'}}>
                  {users.filter((u: any) => u.blocked === true).length}
                </div>
                <div style={{fontSize: '12px', color: '#666', marginTop: '10px'}}>Suspended Accounts</div>
              </div>

              {/* Locked Users Card */}
              <div style={{
                background: 'linear-gradient(135deg, #2e1a1a 0%, #3e1616 100%)',
                border: '2px solid #FFD700',
                borderRadius: '15px',
                padding: '25px',
                boxShadow: '0 0 20px rgba(255, 215, 0, 0.2)',
                textAlign: 'center'
              }}>
                <div style={{fontSize: '40px', marginBottom: '10px'}}>🔒</div>
                <div style={{fontSize: '14px', color: '#888', marginBottom: '8px'}}>Locked Accounts</div>
                <div style={{fontSize: '36px', color: '#FFD700', fontWeight: 'bold'}}>{lockedAccounts.length}</div>
                <div style={{fontSize: '12px', color: '#666', marginTop: '10px'}}>Access Restricted</div>
              </div>

              {/* Total Payments Card */}
              <div style={{
                background: 'linear-gradient(135deg, #1a2e1a 0%, #163e16 100%)',
                border: '2px solid #0f600f',
                borderRadius: '15px',
                padding: '25px',
                boxShadow: '0 0 20px rgba(15, 96, 15, 0.3)',
                textAlign: 'center'
              }}>
                <div style={{fontSize: '40px', marginBottom: '10px'}}>💰</div>
                <div style={{fontSize: '14px', color: '#888', marginBottom: '8px'}}>Total Payments</div>
                <div style={{fontSize: '36px', color: '#32CD32', fontWeight: 'bold'}}>
                  RS {Array.isArray(allPayments) ? allPayments.reduce((sum: number, p: any) => sum + (p.amountType ? parseInt(p.amountType) : 0), 0).toLocaleString() : 0}
                </div>
                <div style={{fontSize: '12px', color: '#666', marginTop: '10px'}}>All Transactions</div>
              </div>

              {/* Approved Payments (Incoming) Card */}
              <div style={{
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                border: '2px solid #0f3460',
                borderRadius: '15px',
                padding: '25px',
                boxShadow: '0 0 20px rgba(15, 52, 96, 0.3)',
                textAlign: 'center'
              }}>
                <div style={{fontSize: '40px', marginBottom: '10px'}}>📥</div>
                <div style={{fontSize: '14px', color: '#888', marginBottom: '8px'}}>Approved Payments</div>
                <div style={{fontSize: '36px', color: '#00D9FF', fontWeight: 'bold'}}>
                  RS {Array.isArray(allPayments) ? allPayments.filter((p: any) => p.status === 'Approved').reduce((sum: number, p: any) => sum + (p.amountType ? parseInt(p.amountType) : 0), 0).toLocaleString() : 0}
                </div>
                <div style={{fontSize: '12px', color: '#666', marginTop: '10px'}}>Accepted Requests</div>
              </div>

              {/* Pending Payments Card */}
              <div style={{
                background: 'linear-gradient(135deg, #2e2e1a 0%, #3e3e16 100%)',
                border: '2px solid #606010',
                borderRadius: '15px',
                padding: '25px',
                boxShadow: '0 0 20px rgba(96, 96, 15, 0.3)',
                textAlign: 'center'
              }}>
                <div style={{fontSize: '40px', marginBottom: '10px'}}>⏳</div>
                <div style={{fontSize: '14px', color: '#888', marginBottom: '8px'}}>Pending Payments</div>
                <div style={{fontSize: '36px', color: '#FFD700', fontWeight: 'bold'}}>
                  RS {Array.isArray(allPayments) ? allPayments.filter((p: any) => p.status === 'Pending').reduce((sum: number, p: any) => sum + (p.amountType ? parseInt(p.amountType) : 0), 0).toLocaleString() : 0}
                </div>
                <div style={{fontSize: '12px', color: '#666', marginTop: '10px'}}>Under Review</div>
              </div>

              {/* Withdrawal Requests Card */}
              <div style={{
                background: 'linear-gradient(135deg, #2e1a2e 0%, #3e163e 100%)',
                border: '2px solid #60306f',
                borderRadius: '15px',
                padding: '25px',
                boxShadow: '0 0 20px rgba(96, 48, 111, 0.3)',
                textAlign: 'center'
              }}>
                <div style={{fontSize: '40px', marginBottom: '10px'}}>📤</div>
                <div style={{fontSize: '14px', color: '#888', marginBottom: '8px'}}>Total Withdrawals</div>
                <div style={{fontSize: '36px', color: '#DA70D6', fontWeight: 'bold'}}>
                  RS {Array.isArray(allPayments) ? allPayments.filter((p: any) => p.type === 'Task Withdraw' || p.type === 'Withdrawal').reduce((sum: number, p: any) => sum + (p.amountType ? parseInt(p.amountType) : 0), 0).toLocaleString() : 0}
                </div>
                <div style={{fontSize: '12px', color: '#666', marginTop: '10px'}}>Outgoing</div>
              </div>

              {/* Rejected Payments Card */}
              <div style={{
                background: 'linear-gradient(135deg, #2e1a1a 0%, #3e1616 100%)',
                border: '2px solid #600f0f',
                borderRadius: '15px',
                padding: '25px',
                boxShadow: '0 0 20px rgba(96, 15, 15, 0.3)',
                textAlign: 'center'
              }}>
                <div style={{fontSize: '40px', marginBottom: '10px'}}>❌</div>
                <div style={{fontSize: '14px', color: '#888', marginBottom: '8px'}}>Rejected Payments</div>
                <div style={{fontSize: '36px', color: '#FF6B6B', fontWeight: 'bold'}}>
                  RS {Array.isArray(allPayments) ? allPayments.filter((p: any) => p.status === 'Rejected').reduce((sum: number, p: any) => sum + (p.amountType ? parseInt(p.amountType) : 0), 0).toLocaleString() : 0}
                </div>
                <div style={{fontSize: '12px', color: '#666', marginTop: '10px'}}>Declined</div>
              </div>

              {/* Task Submissions Card */}
              <div style={{
                background: 'linear-gradient(135deg, #1a2e1a 0%, #163e16 100%)',
                border: '2px solid #0f600f',
                borderRadius: '15px',
                padding: '25px',
                boxShadow: '0 0 20px rgba(15, 96, 15, 0.3)',
                textAlign: 'center'
              }}>
                <div style={{fontSize: '40px', marginBottom: '10px'}}>📋</div>
                <div style={{fontSize: '14px', color: '#888', marginBottom: '8px'}}>Task Submissions</div>
                <div style={{fontSize: '36px', color: '#32CD32', fontWeight: 'bold'}}>{taskSubmissions.length}</div>
                <div style={{fontSize: '12px', color: '#666', marginTop: '10px'}}>Work Submitted</div>
              </div>
            </div>

            {/* Weekly and Monthly Progress */}
            <div style={{marginTop: '40px', paddingTop: '30px', borderTop: '1px solid #333'}}>
              <h3 style={{color: '#FFD700', marginBottom: '20px', fontSize: '20px'}}>📈 Activity Timeline</h3>
              
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px'}}>
                {/* This Week's Stats */}
                <div style={{
                  background: '#0a0a0a',
                  border: '1px solid #333',
                  borderRadius: '12px',
                  padding: '20px'
                }}>
                  <div style={{fontSize: '16px', color: '#FFD700', fontWeight: 'bold', marginBottom: '15px'}}>📅 This Week</div>
                  {(() => {
                    const today = new Date();
                    const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
                    const weekPayments = Array.isArray(allPayments) ? allPayments.filter((p: any) => {
                      const pDate = new Date(p.createdAt);
                      return pDate >= weekStart;
                    }) : [];
                    const weekAmount = weekPayments.reduce((sum: number, p: any) => sum + (p.amountType ? parseInt(p.amountType) : 0), 0);
                    return (
                      <div>
                        <div style={{marginBottom: '10px'}}>
                          <div style={{fontSize: '12px', color: '#888'}}>Transactions</div>
                          <div style={{fontSize: '22px', color: '#00D9FF', fontWeight: 'bold'}}>{weekPayments.length}</div>
                        </div>
                        <div>
                          <div style={{fontSize: '12px', color: '#888'}}>Amount (RS)</div>
                          <div style={{fontSize: '22px', color: '#32CD32', fontWeight: 'bold'}}>{weekAmount.toLocaleString()}</div>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* This Month's Stats */}
                <div style={{
                  background: '#0a0a0a',
                  border: '1px solid #333',
                  borderRadius: '12px',
                  padding: '20px'
                }}>
                  <div style={{fontSize: '16px', color: '#FFD700', fontWeight: 'bold', marginBottom: '15px'}}>📆 This Month</div>
                  {(() => {
                    const today = new Date();
                    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
                    const monthPayments = Array.isArray(allPayments) ? allPayments.filter((p: any) => {
                      const pDate = new Date(p.createdAt);
                      return pDate >= monthStart;
                    }) : [];
                    const monthAmount = monthPayments.reduce((sum: number, p: any) => sum + (p.amountType ? parseInt(p.amountType) : 0), 0);
                    return (
                      <div>
                        <div style={{marginBottom: '10px'}}>
                          <div style={{fontSize: '12px', color: '#888'}}>Transactions</div>
                          <div style={{fontSize: '22px', color: '#00D9FF', fontWeight: 'bold'}}>{monthPayments.length}</div>
                        </div>
                        <div>
                          <div style={{fontSize: '12px', color: '#888'}}>Amount (RS)</div>
                          <div style={{fontSize: '22px', color: '#32CD32', fontWeight: 'bold'}}>{monthAmount.toLocaleString()}</div>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* User Growth */}
                <div style={{
                  background: '#0a0a0a',
                  border: '1px solid #333',
                  borderRadius: '12px',
                  padding: '20px'
                }}>
                  <div style={{fontSize: '16px', color: '#FFD700', fontWeight: 'bold', marginBottom: '15px'}}>📊 User Stats</div>
                  {(() => {
                    const activeUsers = users.filter((u: any) => u.blocked !== true).length;
                    const inactiveUsers = users.filter((u: any) => u.blocked === true).length;
                    return (
                      <div>
                        <div style={{marginBottom: '10px'}}>
                          <div style={{fontSize: '12px', color: '#888'}}>Active Users</div>
                          <div style={{fontSize: '22px', color: '#32CD32', fontWeight: 'bold'}}>{activeUsers}</div>
                        </div>
                        <div>
                          <div style={{fontSize: '12px', color: '#888'}}>Inactive/Blocked</div>
                          <div style={{fontSize: '22px', color: '#FF6B6B', fontWeight: 'bold'}}>{inactiveUsers}</div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Quick Stats Summary */}
            <div style={{marginTop: '40px', paddingTop: '30px', borderTop: '1px solid #333'}}>
              <h3 style={{color: '#FFD700', marginBottom: '20px', fontSize: '20px'}}>⚡ Quick Summary</h3>
              <div style={{
                background: '#0a0a0a',
                border: '1px solid #333',
                borderRadius: '12px',
                padding: '20px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px'
              }}>
                <div>
                  <div style={{fontSize: '12px', color: '#888', marginBottom: '5px'}}>Total Revenue</div>
                  <div style={{fontSize: '24px', color: '#FFD700', fontWeight: 'bold'}}>
                    RS {Array.isArray(allPayments) ? allPayments.filter((p: any) => p.status === 'Approved').reduce((sum: number, p: any) => sum + (p.amountType ? parseInt(p.amountType) : 0), 0).toLocaleString() : 0}
                  </div>
                </div>
                <div>
                  <div style={{fontSize: '12px', color: '#888', marginBottom: '5px'}}>Pending Amount</div>
                  <div style={{fontSize: '24px', color: '#FFD700', fontWeight: 'bold'}}>
                    RS {Array.isArray(allPayments) ? allPayments.filter((p: any) => p.status === 'Pending').reduce((sum: number, p: any) => sum + (p.amountType ? parseInt(p.amountType) : 0), 0).toLocaleString() : 0}
                  </div>
                </div>
                <div>
                  <div style={{fontSize: '12px', color: '#888', marginBottom: '5px'}}>Completion Rate</div>
                  <div style={{fontSize: '24px', color: '#32CD32', fontWeight: 'bold'}}>
                    {Array.isArray(paymentRequests) && paymentRequests.length > 0 ? 
                      Math.round((paymentRequests.filter((p: any) => p.status !== 'Pending').length / paymentRequests.length) * 100) 
                      : 0}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* USER NETWORK PROGRESS TAB */}
        {activeTab === 'network_progress' && (
          <div style={styles.card}>
            <h2 style={{color: 'gold', marginBottom: '30px', fontSize: '28px'}}>🌐 User Network Progress</h2>
            
            {isLoadingUsers ? (
              <div style={{textAlign: 'center', padding: '40px', color: '#FFD700'}}>
                <div style={{fontSize: '20px', marginBottom: '10px'}}>⏳</div>
                <div>Loading user network data...</div>
              </div>
            ) : errorUsers ? (
              <div style={{textAlign: 'center', padding: '40px', color: '#FF6347'}}>
                <div style={{fontSize: '20px', marginBottom: '10px'}}>❌</div>
                <div>{errorUsers}</div>
                <button onClick={retryFetchUsers} style={{...styles.goldBtn, marginTop: '15px'}}>Retry</button>
              </div>
            ) : (
              <>
                {/* Summary Stats */}
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '30px'}}>
                  <div style={{background: '#0a0a0a', border: '1px solid #FFD700', borderRadius: '10px', padding: '15px', textAlign: 'center'}}>
                    <div style={{fontSize: '12px', color: '#888', marginBottom: '5px'}}>Active Chain Users</div>
                    <div style={{fontSize: '28px', color: '#00D9FF', fontWeight: 'bold'}}>
                      {users.filter((u: any) => u.chainActive === true || (u as any).verifiedUsers?.length >= 1).length}
                    </div>
                  </div>
                  <div style={{background: '#0a0a0a', border: '1px solid #32CD32', borderRadius: '10px', padding: '15px', textAlign: 'center'}}>
                    <div style={{fontSize: '12px', color: '#888', marginBottom: '5px'}}>Verified 11+ Users</div>
                    <div style={{fontSize: '28px', color: '#32CD32', fontWeight: 'bold'}}>
                      {users.filter((u: any) => (u as any).verifiedUsers?.length >= 11).length}
                    </div>
                  </div>
                  <div style={{background: '#0a0a0a', border: '1px solid #FFD700', borderRadius: '10px', padding: '15px', textAlign: 'center'}}>
                    <div style={{fontSize: '12px', color: '#888', marginBottom: '5px'}}>Million Club (1M+)</div>
                    <div style={{fontSize: '28px', color: '#FFD700', fontWeight: 'bold'}}>
                      {users.filter((u: any) => (u as any).networkCount >= 1000000 || (u as any).totalNetwork >= 1000000).length}
                    </div>
                  </div>
                </div>

                {/* Top Members List */}
                <div style={{marginBottom: '40px'}}>
                  <h3 style={{color: '#FFD700', marginBottom: '20px', fontSize: '20px'}}>👑 Top Network Members</h3>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '12px'}}>
                    {Array.isArray(users) && users.length > 0 ? (
                      users
                        .filter((u: any) => (u as any).verifiedUsers?.length >= 1 || u.chainActive === true)
                        .sort((a: any, b: any) => {
                          const aNetwork = (a as any).networkCount || (a as any).totalNetwork || 0;
                          const bNetwork = (b as any).networkCount || (b as any).totalNetwork || 0;
                          return bNetwork - aNetwork;
                        })
                        .slice(0, 20)
                        .map((user: any, index: number) => {
                          const networkCount = (user as any).networkCount || (user as any).totalNetwork || 0;
                          const verifiedCount = (user as any).verifiedUsers?.length || 0;
                          const progressPercent = Math.min((networkCount / 1000000) * 100, 100);
                          const isMillionClub = networkCount >= 1000000;
                          
                          return (
                            <div key={user._id} style={{
                              background: isMillionClub ? 'linear-gradient(135deg, #3e3e1a 0%, #2e2e1a 100%)' : '#0a0a0a',
                              border: isMillionClub ? '2px solid #FFD700' : '1px solid #333',
                              borderRadius: '12px',
                              padding: '15px',
                              boxShadow: isMillionClub ? '0 0 20px rgba(255,215,0,0.2)' : 'none'
                            }}>
                              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px'}}>
                                <div>
                                  <div style={{fontSize: '14px', color: '#FFD700', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px'}}>
                                    {index === 0 && '🥇'} {index === 1 && '🥈'} {index === 2 && '🥉'} {index > 2 && `#${index + 1}`}
                                    {' '}{user.username}
                                  </div>
                                  <div style={{fontSize: '12px', color: '#666', marginTop: '2px'}}>{user.email}</div>
                                </div>
                                <div style={{textAlign: 'right'}}>
                                  <div style={{fontSize: '12px', color: '#888', marginBottom: '3px'}}>Verified Users</div>
                                  <div style={{fontSize: '16px', color: '#00D9FF', fontWeight: 'bold'}}>{verifiedCount}/11</div>
                                </div>
                              </div>

                              {/* Progress Bar */}
                              <div style={{marginBottom: '10px'}}>
                                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
                                  <div style={{fontSize: '11px', color: '#888'}}>Network Growth</div>
                                  <div style={{fontSize: '12px', color: '#FFD700', fontWeight: 'bold'}}>
                                    {networkCount.toLocaleString()} / 1,000,000
                                  </div>
                                </div>
                                <div style={{
                                  background: '#1a1a1a',
                                  borderRadius: '8px',
                                  height: '12px',
                                  overflow: 'hidden',
                                  border: '1px solid #333'
                                }}>
                                  <div style={{
                                    background: isMillionClub ? '#FFD700' : progressPercent > 50 ? '#32CD32' : '#00D9FF',
                                    height: '100%',
                                    width: `${progressPercent}%`,
                                    transition: 'width 0.3s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '9px',
                                    color: '#000',
                                    fontWeight: 'bold',
                                    paddingLeft: progressPercent > 10 ? '2px' : '0px'
                                  }}>
                                    {progressPercent > 5 ? `${Math.round(progressPercent)}%` : ''}
                                  </div>
                                </div>
                              </div>

                              {/* Status Badge */}
                              <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                                {verifiedCount >= 11 && (
                                  <span style={{
                                    background: '#0f600f',
                                    color: '#32CD32',
                                    padding: '4px 10px',
                                    borderRadius: '6px',
                                    fontSize: '11px',
                                    fontWeight: 'bold'
                                  }}>
                                    ✅ Verified 11+
                                  </span>
                                )}
                                {isMillionClub && (
                                  <span style={{
                                    background: '#3e3e1a',
                                    color: '#FFD700',
                                    padding: '4px 10px',
                                    borderRadius: '6px',
                                    fontSize: '11px',
                                    fontWeight: 'bold'
                                  }}>
                                    👑 Million Club
                                  </span>
                                )}
                                {networkCount >= 500000 && networkCount < 1000000 && (
                                  <span style={{
                                    background: '#2e1a1a',
                                    color: '#FF6B6B',
                                    padding: '4px 10px',
                                    borderRadius: '6px',
                                    fontSize: '11px',
                                    fontWeight: 'bold'
                                  }}>
                                    🔥 Half Million!
                                  </span>
                                )}
                                {networkCount >= 100000 && networkCount < 500000 && (
                                  <span style={{
                                    background: '#1a2e1a',
                                    color: '#32CD32',
                                    padding: '4px 10px',
                                    borderRadius: '6px',
                                    fontSize: '11px',
                                    fontWeight: 'bold'
                                  }}>
                                    📈 Growing
                                  </span>
                                )}
                              </div>

                              {/* Stats Grid */}
                              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #333'}}>
                                <div>
                                  <div style={{fontSize: '11px', color: '#888', marginBottom: '2px'}}>Position</div>
                                  <div style={{fontSize: '13px', color: '#00D9FF', fontWeight: 'bold'}}>{index + 1}</div>
                                </div>
                                <div>
                                  <div style={{fontSize: '11px', color: '#888', marginBottom: '2px'}}>Status</div>
                                  <div style={{fontSize: '13px', color: user.blocked ? '#FF6B6B' : '#32CD32', fontWeight: 'bold'}}>
                                    {user.blocked ? '🚫 Blocked' : '✅ Active'}
                                  </div>
                                </div>
                                <div>
                                  <div style={{fontSize: '11px', color: '#888', marginBottom: '2px'}}>Distance</div>
                                  <div style={{fontSize: '13px', color: '#FFD700', fontWeight: 'bold'}}>
                                    {isMillionClub ? '✨ Done' : `${(1000000 - networkCount).toLocaleString()}`}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                    ) : (
                      <div style={{textAlign: 'center', padding: '40px', color: '#666'}}>
                        <div style={{fontSize: '30px', marginBottom: '10px'}}>🔍</div>
                        <div>No active network users found</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Leaderboard Stats */}
                <div style={{marginTop: '40px', paddingTop: '30px', borderTop: '1px solid #333'}}>
                  <h3 style={{color: '#FFD700', marginBottom: '20px', fontSize: '20px'}}>📊 Network Statistics</h3>
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px'}}>
                    {(() => {
                      const activeUsers = users.filter((u: any) => u.chainActive === true || (u as any).verifiedUsers?.length >= 1);
                      const verifiedUsers = users.filter((u: any) => (u as any).verifiedUsers?.length >= 11);
                      const millionClubUsers = users.filter((u: any) => (u as any).networkCount >= 1000000 || (u as any).totalNetwork >= 1000000);
                      const halfMillionUsers = users.filter((u: any) => {
                        const network = (u as any).networkCount || (u as any).totalNetwork || 0;
                        return network >= 500000 && network < 1000000;
                      });
                      const topUser = activeUsers.sort((a: any, b: any) => {
                        const aNetwork = (a as any).networkCount || (a as any).totalNetwork || 0;
                        const bNetwork = (b as any).networkCount || (b as any).totalNetwork || 0;
                        return bNetwork - aNetwork;
                      })[0];
                      const topNetwork = topUser ? ((topUser as any).networkCount || (topUser as any).totalNetwork || 0) : 0;

                      return (
                        <>
                          <div style={{background: '#0a0a0a', border: '1px solid #333', borderRadius: '10px', padding: '15px'}}>
                            <div style={{fontSize: '12px', color: '#888', marginBottom: '8px'}}>Average Network</div>
                            <div style={{fontSize: '24px', color: '#00D9FF', fontWeight: 'bold'}}>
                              {activeUsers.length > 0 ? (
                                Math.round(
                                  activeUsers.reduce((sum: number, u: any) => sum + ((u as any).networkCount || (u as any).totalNetwork || 0), 0) / activeUsers.length
                                ).toLocaleString()
                              ) : 0}
                            </div>
                          </div>

                          <div style={{background: '#0a0a0a', border: '1px solid #333', borderRadius: '10px', padding: '15px'}}>
                            <div style={{fontSize: '12px', color: '#888', marginBottom: '8px'}}>Largest Network</div>
                            <div style={{fontSize: '24px', color: '#FFD700', fontWeight: 'bold'}}>
                              {topNetwork.toLocaleString()}
                            </div>
                            {topUser && <div style={{fontSize: '11px', color: '#666', marginTop: '5px'}}>by {topUser.username}</div>}
                          </div>

                          <div style={{background: '#0a0a0a', border: '1px solid #333', borderRadius: '10px', padding: '15px'}}>
                            <div style={{fontSize: '12px', color: '#888', marginBottom: '8px'}}>Total Network Size</div>
                            <div style={{fontSize: '24px', color: '#32CD32', fontWeight: 'bold'}}>
                              {activeUsers.reduce((sum: number, u: any) => sum + ((u as any).networkCount || (u as any).totalNetwork || 0), 0).toLocaleString()}
                            </div>
                          </div>

                          <div style={{background: '#0a0a0a', border: '1px solid #333', borderRadius: '10px', padding: '15px'}}>
                            <div style={{fontSize: '12px', color: '#888', marginBottom: '8px'}}>Half Million Club</div>
                            <div style={{fontSize: '24px', color: '#FF6B6B', fontWeight: 'bold'}}>
                              {halfMillionUsers.length}
                            </div>
                            <div style={{fontSize: '11px', color: '#666', marginTop: '5px'}}>500K+ members</div>
                          </div>

                          <div style={{background: '#0a0a0a', border: '1px solid #333', borderRadius: '10px', padding: '15px'}}>
                            <div style={{fontSize: '12px', color: '#888', marginBottom: '8px'}}>Verified Leaders</div>
                            <div style={{fontSize: '24px', color: '#32CD32', fontWeight: 'bold'}}>
                              {verifiedUsers.length}
                            </div>
                            <div style={{fontSize: '11px', color: '#666', marginTop: '5px'}}>11+ verified</div>
                          </div>

                          <div style={{background: '#0a0a0a', border: '1px solid #FFD700', borderRadius: '10px', padding: '15px'}}>
                            <div style={{fontSize: '12px', color: '#888', marginBottom: '8px'}}>🏆 Million Club</div>
                            <div style={{fontSize: '24px', color: '#FFD700', fontWeight: 'bold'}}>
                              {millionClubUsers.length}
                            </div>
                            <div style={{fontSize: '11px', color: '#666', marginTop: '5px'}}>1M+ members</div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* 1. PAYMENT REQUESTS */}
        {activeTab === 'requests' && (
          <div style={styles.card}>
            <h2 style={{color: 'gold', marginBottom: '20px'}}>💰 Pending Payment Requests</h2>
            {isLoadingPayments ? (
              <div style={{textAlign: 'center', padding: '40px', color: '#FFD700'}}>
                <div style={{fontSize: '20px', marginBottom: '10px'}}>⏳</div>
                <div>Loading payment requests...</div>
              </div>
            ) : errorPayments ? (
              <div style={{textAlign: 'center', padding: '40px', color: '#FF6347'}}>
                <div style={{fontSize: '20px', marginBottom: '10px'}}>❌</div>
                <div>{errorPayments}</div>
                <button onClick={retryFetchPayments} style={{...styles.goldBtn, marginTop: '15px'}}>Retry</button>
              </div>
            ) : (
              <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '15px'}}>
                {Array.isArray(paymentRequests) && paymentRequests.length > 0 ? (
                  paymentRequests.map(req => (
                  <div key={req._id} style={{
                    background: '#0a0a0a',
                    border: `1px solid ${req.status === 'Pending' ? '#FFD700' : req.status === 'Approved' ? '#32CD32' : '#FF6347'}`,
                    borderRadius: '10px',
                    padding: '15px',
                    boxShadow: '0 0 10px rgba(255,215,0,0.1)'
                  }}>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '15px', marginBottom: '12px'}}>
                      <div><div style={{fontSize: '11px', color: '#888'}}>👤 USER</div><div style={{fontSize: '13px', color: 'gold', fontWeight: 'bold'}}>{req.username}</div><div style={{fontSize: '11px', color: '#666'}}>{req.email}</div></div>
                      <div><div style={{fontSize: '11px', color: '#888'}}>📝 TYPE</div><div style={{fontSize: '13px', color: '#ccc'}}>{req.type}</div></div>
                      <div><div style={{fontSize: '11px', color: '#888'}}>💵 AMOUNT</div><div style={{fontSize: '14px', color: '#FFD700', fontWeight: 'bold'}}>RS {req.amountType}</div></div>
                      <div><div style={{fontSize: '11px', color: '#888'}}>🧾 TID</div><div style={{fontSize: '12px', color: '#ccc'}}>{req.transactionId || 'N/A'}</div></div>
                    </div>
                    {req.type === 'Task Withdraw' ? (
                      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px', marginBottom: '12px', padding: '10px', background: '#1a1a1a', borderRadius: '8px'}}>
                        <div><div style={{fontSize: '11px', color: '#888'}}>🏦 METHOD</div><div style={{fontSize: '12px', color: '#ccc'}}>{req.withdrawMethod || 'N/A'}</div></div>
                        <div><div style={{fontSize: '11px', color: '#888'}}>💳 ACCOUNT</div><div style={{fontSize: '12px', color: '#FFD700', fontWeight: 'bold'}}>{req.withdrawAccount || 'N/A'}</div></div>
                        <div><div style={{fontSize: '11px', color: '#888'}}>👤 HOLDER</div><div style={{fontSize: '12px', color: '#FFD700', fontWeight: 'bold'}}>{req.accountHolderName || 'N/A'}</div></div>
                        <div><div style={{fontSize: '11px', color: '#888'}}>✅ STATUS</div><div style={{fontSize: '13px', color: req.status === 'Approved' ? '#32CD32' : req.status === 'Rejected' ? '#FF6347' : '#FFD700', fontWeight: 'bold'}}>{req.status}</div></div>
                      </div>
                    ) : (
                      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '12px', padding: '10px', background: '#1a1a1a', borderRadius: '8px'}}>
                        <div><div style={{fontSize: '11px', color: '#888'}}>📸 SCREENSHOT</div>{req.screenshotUrl ? <a href={req.screenshotUrl.startsWith('http') ? req.screenshotUrl : `${getApiBaseUrl()}${req.screenshotUrl}`} target="_blank" rel="noopener noreferrer" style={{color: '#1e90ff', textDecoration: 'underline'}}>View File</a> : <span style={{color: '#888'}}>N/A</span>}</div>
                        <div><div style={{fontSize: '11px', color: '#888'}}>✅ STATUS</div><div style={{fontSize: '13px', color: req.status === 'Approved' ? '#32CD32' : req.status === 'Rejected' ? '#FF6347' : '#FFD700', fontWeight: 'bold'}}>{req.status}</div></div>
                        <div><div style={{fontSize: '11px', color: '#888'}}>📅 CREATED</div><div style={{fontSize: '12px', color: '#ccc'}}>{req.createdAt ? new Date(req.createdAt).toLocaleDateString() : 'N/A'}</div></div>
                      </div>
                    )}
                    <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                      {req.status === 'Pending' && (
                        <>
                          <button onClick={() => handlePaymentAction(req._id, 'approve', req.type)} style={{...styles.approveBtn, flex: 1}}>✅ Approve</button>
                          <button onClick={() => handlePaymentAction(req._id, 'reject', req.type)} style={{...styles.rejectBtn, flex: 1}}>❌ Reject</button>
                        </>
                      )}
                      {req.status !== 'Pending' && <div style={{flex: 1, textAlign: 'center', color: '#666', fontSize: '12px'}}>Status: {req.status}</div>}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{textAlign: 'center', padding: '40px', color: '#666'}}>
                  <div style={{fontSize: '30px', marginBottom: '10px'}}>📭</div>
                  <div>No payment requests found</div>
                </div>
              )}
            </div>
            )}
          </div>
        )}

        {/* WITHDRAWAL REQUESTS TAB FOR ADMIN */}
        {activeTab === 'withdraw_approvals' && (
          <div style={styles.card}>
            <h2 style={{color: 'gold', marginBottom: '20px'}}>💎 Mega Withdrawal Requests</h2>
            <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '15px'}}>
              {Array.isArray(allPayments) && allPayments.filter(p => p.type === 'Withdraw').length > 0 ? (
                allPayments.filter(p => p.type === 'Withdraw').map(req => (
                  <div key={req._id} style={{
                    background: '#0a0a0a',
                    border: `1px solid ${req.status === 'Pending' ? '#FFD700' : req.status === 'Approved' ? '#32CD32' : '#FF6347'}`,
                    borderRadius: '10px',
                    padding: '15px',
                    boxShadow: '0 0 15px rgba(255,215,0,0.15)'
                  }}>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '12px'}}>
                      <div><div style={{fontSize: '11px', color: '#888'}}>👤 USER</div><div style={{fontSize: '13px', color: 'gold', fontWeight: 'bold'}}>{req.username}</div><div style={{fontSize: '11px', color: '#666'}}>{req.email}</div></div>
                      <div><div style={{fontSize: '11px', color: '#888'}}>💰 AMOUNT</div><div style={{fontSize: '16px', color: '#FFD700', fontWeight: 'bold'}}>RS {req.amountType}</div></div>
                      <div><div style={{fontSize: '11px', color: '#888'}}>✅ STATUS</div><div style={{fontSize: '13px', color: req.status === 'Approved' ? '#32CD32' : req.status === 'Rejected' ? '#FF6347' : '#FFD700', fontWeight: 'bold'}}>{req.status}</div></div>
                    </div>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px', marginBottom: '12px', padding: '10px', background: '#1a1a1a', borderRadius: '8px'}}>
                      <div><div style={{fontSize: '11px', color: '#888'}}>🏦 METHOD</div><div style={{fontSize: '12px', color: '#ccc'}}>{req.withdrawMethod || 'N/A'}</div></div>
                      <div><div style={{fontSize: '11px', color: '#888'}}>💳 ACCOUNT</div><div style={{fontSize: '12px', color: '#FFD700', fontWeight: 'bold'}}>{req.withdrawAccount || 'N/A'}</div></div>
                      <div><div style={{fontSize: '11px', color: '#888'}}>👤 HOLDER</div><div style={{fontSize: '12px', color: '#FFD700', fontWeight: 'bold'}}>{req.accountHolderName || 'N/A'}</div></div>
                      <div><div style={{fontSize: '11px', color: '#888'}}>📅 REQUESTED</div><div style={{fontSize: '12px', color: '#ccc'}}>{req.createdAt ? new Date(req.createdAt).toLocaleDateString() : 'N/A'}</div></div>
                    </div>
                    <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                      {req.status === 'Pending' && (
                        <>
                          <button onClick={() => handlePaymentAction(req._id, 'approve', req.type)} style={{...styles.approveBtn, flex: 1}}>✅ Approve Withdrawal</button>
                          <button onClick={() => handlePaymentAction(req._id, 'reject', req.type)} style={{...styles.rejectBtn, flex: 1}}>❌ Reject</button>
                        </>
                      )}
                      {req.status !== 'Pending' && <div style={{flex: 1, textAlign: 'center', color: '#666', fontSize: '12px'}}>Status: {req.status}</div>}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{textAlign: 'center', padding: '40px', color: '#666'}}>
                  <div style={{fontSize: '30px', marginBottom: '10px'}}>💎</div>
                  <div>No withdrawal requests found</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. REGISTERED USERS */}
        {activeTab === 'register' && (
          <div style={styles.card}>
            <h2 style={{color: 'gold', marginBottom: '20px'}}>👥 Manage All Users ({users.length})</h2>
            {isLoadingUsers ? (
              <div style={{textAlign: 'center', padding: '40px', color: '#FFD700'}}>
                <div style={{fontSize: '20px', marginBottom: '10px'}}>⏳</div>
                <div>Loading users...</div>
              </div>
            ) : errorUsers ? (
              <div style={{textAlign: 'center', padding: '40px', color: '#FF6347'}}>
                <div style={{fontSize: '20px', marginBottom: '10px'}}>❌</div>
                <div>{errorUsers}</div>
                <button onClick={retryFetchUsers} style={{...styles.goldBtn, marginTop: '15px'}}>Retry</button>
              </div>
            ) : (
              <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '15px', maxHeight: '80vh', overflowY: 'auto'}}>
                {users && users.length > 0 ? (
                  users.map(u => (
                  <div key={u._id} style={{
                    background: '#0a0a0a',
                    border: `1px solid ${u.banned ? '#FF6347' : '#333'}`,
                    borderRadius: '10px',
                    padding: '15px',
                    opacity: u.banned ? 0.6 : 1
                  }}>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '15px', marginBottom: '12px'}}>
                      <div>
                        <div style={{fontSize: '11px', color: '#888', marginBottom: '3px'}}>📝 NAME</div>
                        <input type="text" defaultValue={u.name} id={`name-${u._id}`} style={{...styles.inputField, fontSize: '13px'}} />
                      </div>
                      <div>
                        <div style={{fontSize: '11px', color: '#888', marginBottom: '3px'}}>👤 USERNAME</div>
                        <input type="text" defaultValue={u.username} id={`username-${u._id}`} style={{...styles.inputField, fontSize: '13px', color: 'gold'}} />
                      </div>
                      <div>
                        <div style={{fontSize: '11px', color: '#888', marginBottom: '3px'}}>📞 PHONE</div>
                        <input type="text" defaultValue={u.phone} id={`phone-${u._id}`} style={{...styles.inputField, fontSize: '13px'}} />
                      </div>
                      <div>
                        <div style={{fontSize: '11px', color: '#888', marginBottom: '3px'}}>📧 EMAIL</div>
                        <input type="email" defaultValue={u.email} id={`email-${u._id}`} style={{...styles.inputField, fontSize: '13px'}} />
                      </div>
                    </div>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '15px', marginBottom: '12px'}}>
                      <div>
                        <div style={{fontSize: '11px', color: '#888', marginBottom: '3px'}}>📍 CITY</div>
                        <input type="text" defaultValue={u.city} id={`city-${u._id}`} style={{...styles.inputField, fontSize: '13px'}} />
                      </div>
                      <div>
                        <div style={{fontSize: '11px', color: '#888', marginBottom: '3px'}}>🔗 REFERRED BY</div>
                        <input type="text" defaultValue={u.referredBy || ''} id={`referredBy-${u._id}`} style={{...styles.inputField, fontSize: '13px'}} />
                      </div>
                      <div>
                        <div style={{fontSize: '11px', color: '#888', marginBottom: '3px'}}>🔐 STATUS</div>
                        <div style={{fontSize: '13px', color: u.banned ? '#FF6347' : '#32CD32', fontWeight: 'bold', padding: '8px', background: '#1a1a1a', borderRadius: '4px'}}>
                          {u.banned ? '🚫 BANNED' : '✅ ACTIVE'}
                        </div>
                      </div>
                    </div>
                    <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                      <button onClick={() => {
                        const updatedData = {
                          name: (document.getElementById(`name-${u._id}`) as HTMLInputElement).value,
                          username: (document.getElementById(`username-${u._id}`) as HTMLInputElement).value,
                          phone: (document.getElementById(`phone-${u._id}`) as HTMLInputElement).value,
                          email: (document.getElementById(`email-${u._id}`) as HTMLInputElement).value,
                          city: (document.getElementById(`city-${u._id}`) as HTMLInputElement).value,
                          referredBy: (document.getElementById(`referredBy-${u._id}`) as HTMLInputElement).value
                        };
                        updateUser(u._id, updatedData);
                      }} style={{...styles.approveBtn, flex: 1}}>💾 Save Changes</button>
                      {u.banned ? (
                        <button onClick={() => reactiveUser(u._id)} style={{...styles.approveBtn, flex: 1}}>↩️ Unban User</button>
                      ) : (
                        <button onClick={() => banUser(u._id)} style={{...styles.rejectBtn, flex: 1}}>🚫 Ban User</button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{textAlign: 'center', padding: '40px', color: '#666'}}>
                  <div style={{fontSize: '30px', marginBottom: '10px'}}>👥</div>
                  <div>No users found</div>
                </div>
              )}
            </div>
            )}
          </div>
        )}

        {/* 3. LOCKED ACCOUNTS */}
        {activeTab === 'locked_accounts' && (
          <div style={styles.card}>
            <h2 style={{color: 'gold', marginBottom: '20px'}}>🔒 Locked Accounts - Challenge Failed</h2>
            <p style={{fontSize: '13px', color: '#aaa', marginBottom: '10px'}}>Users who were unable to complete 11 direct referrals within the 2-hour time limit</p>
            
            {/* Action Buttons */}
            <div style={{marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
              <button onClick={handleRefreshLockedAccounts} style={{...styles.approveBtn, background: '#1e90ff'}}>🔄 Refresh List</button>
              <button onClick={handleCreateTestLockedAccount} style={{...styles.approveBtn, background: '#ff8c00'}}>🧪 Create Test Record</button>
              <span style={{fontSize: '12px', color: '#666', alignSelf: 'center', fontWeight: 'bold'}}>📊 Total: {lockedAccounts.length} locked accounts</span>
            </div>

            {isLoadingLockedAccounts ? (
              <div style={{textAlign: 'center', padding: '40px', color: '#FFD700'}}>
                <div style={{fontSize: '20px', marginBottom: '10px'}}>⏳</div>
                <div>Loading locked accounts...</div>
              </div>
            ) : errorLockedAccounts ? (
              <div style={{textAlign: 'center', padding: '40px', color: '#FF6347'}}>
                <div style={{fontSize: '20px', marginBottom: '10px'}}>❌</div>
                <div>{errorLockedAccounts}</div>
                <button onClick={retryFetchLockedAccounts} style={{...styles.goldBtn, marginTop: '15px'}}>Retry</button>
              </div>
            ) : (
              <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '15px'}}>
                {lockedAccounts && lockedAccounts.length > 0 ? (
                lockedAccounts.map(account => (
                  <div key={account._id} style={{
                    background: '#0a0a0a',
                    border: '1px solid #333',
                    borderRadius: '10px',
                    padding: '18px',
                    boxShadow: '0 0 10px rgba(255,215,0,0.1)'
                  }}>
                    {/* Header Row */}
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #333'}}>
                      <div>
                        <div style={{fontSize: '11px', color: '#888', marginBottom: '5px'}}>👤 USERNAME</div>
                        <div style={{fontSize: '16px', color: 'gold', fontWeight: 'bold'}}>{account.username}</div>
                      </div>
                      <div>
                        <div style={{fontSize: '11px', color: '#888', marginBottom: '5px'}}>📧 EMAIL</div>
                        <div style={{fontSize: '13px', color: '#ccc'}}>{account.email}</div>
                      </div>
                      <div>
                        <div style={{fontSize: '11px', color: '#888', marginBottom: '5px'}}>📍 CITY</div>
                        <div style={{fontSize: '13px', color: '#ccc'}}>{account.city}</div>
                      </div>
                    </div>

                    {/* Contact & Location */}
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '15px', marginBottom: '15px'}}>
                      <div>
                        <div style={{fontSize: '11px', color: '#888', marginBottom: '5px'}}>📞 PHONE</div>
                        <div style={{fontSize: '13px', color: '#ccc'}}>{account.phone}</div>
                      </div>
                      <div>
                        <div style={{fontSize: '11px', color: '#888', marginBottom: '5px'}}>🔗 REFERRED BY</div>
                        <div style={{fontSize: '13px', color: '#ccc'}}>{account.referredBy || 'Direct Signup'}</div>
                      </div>
                      <div>
                        <div style={{fontSize: '11px', color: '#888', marginBottom: '5px'}}>🌐 NETWORK SIZE</div>
                        <div style={{fontSize: '14px', color: '#FFD700', fontWeight: 'bold'}}>{account.totalNetworkSize || 0}</div>
                      </div>
                      <div>
                        <div style={{fontSize: '11px', color: '#888', marginBottom: '5px'}}>📅 LOCKED DATE</div>
                        <div style={{fontSize: '13px', color: '#ccc'}}>{account.lockedAt ? new Date(account.lockedAt).toLocaleDateString() : 'N/A'}</div>
                      </div>
                    </div>

                    {/* Referral Status */}
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px', padding: '12px', background: '#1a1a1a', borderRadius: '8px'}}>
                      <div>
                        <div style={{fontSize: '11px', color: '#888', marginBottom: '5px'}}>✅ REFERRAL COUNT</div>
                        <div style={{fontSize: '18px', color: '#FF6347', fontWeight: 'bold'}}>
                          {account.referralCount} <span style={{fontSize: '14px', color: '#888'}}>/11</span>
                        </div>
                      </div>
                      <div>
                        <div style={{fontSize: '11px', color: '#888', marginBottom: '5px'}}>⚠️ REASON LOCKED</div>
                        <div style={{fontSize: '12px', color: '#FFD700'}}>{account.reasonLocked || 'Challenge Failed'}</div>
                      </div>
                      <div>
                        <div style={{fontSize: '11px', color: '#888', marginBottom: '5px'}}>🎁 2ND CHANCE STATUS</div>
                        <div style={{fontSize: '16px', fontWeight: 'bold'}}>
                          {account.secondChanceGiven ? <span style={{color: '#32CD32'}}>✅ GIVEN</span> : <span style={{color: '#FF6347'}}>❌ NOT GIVEN</span>}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                      {!account.secondChanceGiven ? (
                        <button onClick={async () => {
                          try {
                            const token = localStorage.getItem('token');
                            const headers: any = { 'Content-Type': 'application/json' };
                            if (token) headers['Authorization'] = `Bearer ${token}`;
                            const response = await fetch(`${getApiBaseUrl()}/api/admin/give-second-chance-locked`, {
                              method: 'POST',
                              headers,
                              body: JSON.stringify({ lockedAccountId: account._id })
                            });
                            if (response.ok) {
                              alert('✅ Second chance given successfully!');
                              handleRefreshLockedAccounts();
                            } else {
                              const data = await response.json();
                              alert('❌ Error: ' + (data.error || 'Failed to give second chance'));
                            }
                          } catch (err) {
                            alert('❌ Error giving second chance: ' + err);
                          }
                        }} style={{...styles.approveBtn, flex: 1, minWidth: '150px'}}>
                          🎁 Give 2nd Chance
                        </button>
                      ) : (
                        <button disabled style={{...styles.approveBtn, flex: 1, minWidth: '150px', opacity: 0.5, background: '#666'}}>
                          ✅ Already Given
                        </button>
                      )}
                      <button onClick={async () => {
                        if (!confirm('Are you sure you want to ban this account?')) return;
                        try {
                          const token = localStorage.getItem('token');
                          const headers: any = { 'Content-Type': 'application/json' };
                          if (token) headers['Authorization'] = `Bearer ${token}`;
                          const response = await fetch(`${getApiBaseUrl()}/api/admin/ban-user/${account.userId}`, {
                            method: 'PUT',
                            headers
                          });
                          if (response.ok) {
                            alert('✅ Account banned successfully!');
                            handleRefreshLockedAccounts();
                          } else {
                            const data = await response.json();
                            alert('❌ Error: ' + (data.error || 'Failed to ban account'));
                          }
                        } catch (err) {
                          alert('❌ Error banning account: ' + err);
                        }
                      }} style={{...styles.rejectBtn, flex: 1, minWidth: '100px'}}>
                        🚫 Ban Account
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{textAlign: 'center', padding: '40px', color: '#666'}}>
                  <div style={{fontSize: '40px', marginBottom: '10px'}}>🎉</div>
                  <div style={{fontSize: '16px'}}>No locked accounts found</div>
                  <div style={{fontSize: '12px', color: '#555', marginTop: '10px'}}>Use "Create Test Record" or "Backfill" to populate data</div>
                </div>
              )}
            </div>
            )}
          </div>
        )}

        {/* Manage Banned section removed as per request */}

        {/* 4. TASK SUBMISSIONS */}
        {activeTab === 'task_submissions' && (
          <div style={styles.card}>
            <h2 style={{color: 'gold', marginBottom: '20px'}}>📋 Task Submissions ({taskSubmissions.length})</h2>
            <p style={{fontSize: '13px', color: '#aaa', marginBottom: '20px'}}>Review user task submissions with multiple screenshots for verification</p>
            
            {isLoadingTaskSubmissions ? (
              <div style={{textAlign: 'center', padding: '40px', color: '#FFD700'}}>
                <div style={{fontSize: '20px', marginBottom: '10px'}}>⏳</div>
                <div>Loading task submissions...</div>
              </div>
            ) : errorTaskSubmissions ? (
              <div style={{textAlign: 'center', padding: '40px', color: '#FF6347'}}>
                <div style={{fontSize: '20px', marginBottom: '10px'}}>❌</div>
                <div>{errorTaskSubmissions}</div>
                <button onClick={retryFetchTaskSubmissions} style={{...styles.goldBtn, marginTop: '15px'}}>Retry</button>
              </div>
            ) : (
              <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '15px'}}>
                {taskSubmissions && taskSubmissions.length > 0 ? (
                taskSubmissions.map(submission => (
                  <div key={submission._id} style={{
                    background: '#0a0a0a',
                    border: '1px solid #333',
                    borderRadius: '10px',
                    padding: '18px',
                    boxShadow: '0 0 10px rgba(255,215,0,0.1)'
                  }}>
                    {/* Header Row */}
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #333'}}>
                      <div>
                        <div style={{fontSize: '11px', color: '#888', marginBottom: '5px'}}>👤 USER</div>
                        <div style={{fontSize: '16px', color: 'gold', fontWeight: 'bold'}}>{submission.userId?.username || submission.user?.username || 'Unknown'}</div>
                        <div style={{fontSize: '12px', color: '#ccc'}}>{submission.userId?.email || submission.user?.email || 'N/A'}</div>
                      </div>
                      <div>
                        <div style={{fontSize: '11px', color: '#888', marginBottom: '5px'}}>🎯 TASK</div>
                        <div style={{fontSize: '14px', color: '#FFD700', fontWeight: 'bold'}}>{submission.taskId?.title || submission.task?.title || 'Unknown Task'}</div>
                        <div style={{fontSize: '12px', color: '#ccc'}}>{submission.taskId?.description || submission.task?.description || ''}</div>
                      </div>
                      <div>
                        <div style={{fontSize: '11px', color: '#888', marginBottom: '5px'}}>📅 SUBMITTED</div>
                        <div style={{fontSize: '13px', color: '#ccc'}}>{submission.createdAt ? new Date(submission.createdAt).toLocaleDateString() : 'N/A'}</div>
                        <div style={{fontSize: '12px', color: '#666'}}>{submission.createdAt ? new Date(submission.createdAt).toLocaleTimeString() : ''}</div>
                      </div>
                    </div>

                    {/* Screenshots Grid */}
                    <div style={{marginBottom: '15px'}}>
                      <div style={{fontSize: '13px', color: '#FFD700', marginBottom: '10px', fontWeight: 'bold'}}>
                        📸 Screenshots ({submission.proofUrls?.length || 0})
                      </div>
                      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px'}}>
                        {submission.proofUrls && submission.proofUrls.length > 0 ? (
                          submission.proofUrls.map((url: string, index: number) => (
                            <div key={index} style={{textAlign: 'center'}}>
                              <img 
                                src={url.startsWith('http') ? url : `${getApiBaseUrl()}${url}`} 
                                alt={`Screenshot ${index + 1}`}
                                style={{
                                  width: '100%',
                                  maxWidth: '180px',
                                  height: '120px',
                                  objectFit: 'cover',
                                  borderRadius: '8px',
                                  border: '1px solid #333',
                                  cursor: 'pointer'
                                }}
                                onClick={() => window.open(url.startsWith('http') ? url : `${getApiBaseUrl()}${url}`, '_blank')}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDE4MCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxODAiIGhlaWdodD0iMTIwIiBmaWxsPSIjMTExIi8+Cjx0ZXh0IHg9IjkwIiB5PSI2MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjODg4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPkltYWdlIE5vdCBGb3VuZDwvdGV4dD4KPC9zdmc+';
                                }}
                              />
                              <div style={{fontSize: '11px', color: '#888', marginTop: '5px'}}>Screenshot {index + 1}</div>
                            </div>
                          ))
                        ) : (
                          <div style={{textAlign: 'center', padding: '40px', color: '#666', gridColumn: '1 / -1'}}>
                            <div style={{fontSize: '30px', marginBottom: '10px'}}>📷</div>
                            <div>No screenshots available</div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', paddingTop: '15px', borderTop: '1px solid #333'}}>
                      <button 
                        onClick={async () => {
                          if (!confirm('Approve this task submission?')) return;
                          try {
                            const token = localStorage.getItem('token');
                            const headers: any = { 'Content-Type': 'application/json' };
                            if (token) headers['Authorization'] = `Bearer ${token}`;
                            const response = await fetch(`${getApiBaseUrl()}/api/admin/approve-task-submission`, {
                              method: 'POST',
                              headers,
                              body: JSON.stringify({ submissionId: submission._id })
                            });
                            if (response.ok) {
                              alert('✅ Task submission approved!');
                              // Refresh the list
                              window.location.reload();
                            } else {
                              const data = await response.json();
                              alert('❌ Error: ' + (data.error || 'Failed to approve submission'));
                            }
                          } catch (err) {
                            alert('❌ Error approving submission: ' + err);
                          }
                        }}
                        style={{...styles.approveBtn, flex: 1}}
                      >
                        ✅ Approve Submission
                      </button>
                      <button 
                        onClick={async () => {
                          if (!confirm('Reject this task submission?')) return;
                          try {
                            const token = localStorage.getItem('token');
                            const headers: any = { 'Content-Type': 'application/json' };
                            if (token) headers['Authorization'] = `Bearer ${token}`;
                            const response = await fetch(`${getApiBaseUrl()}/api/admin/reject-task-submission`, {
                              method: 'POST',
                              headers,
                              body: JSON.stringify({ submissionId: submission._id })
                            });
                            if (response.ok) {
                              alert('✅ Task submission rejected!');
                              // Refresh the list
                              window.location.reload();
                            } else {
                              const data = await response.json();
                              alert('❌ Error: ' + (data.error || 'Failed to reject submission'));
                            }
                          } catch (err) {
                            alert('❌ Error rejecting submission: ' + err);
                          }
                        }}
                        style={{...styles.rejectBtn, flex: 1}}
                      >
                        ❌ Reject Submission
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{textAlign: 'center', padding: '40px', color: '#666'}}>
                  <div style={{fontSize: '40px', marginBottom: '10px'}}>📋</div>
                  <div style={{fontSize: '16px'}}>No task submissions found</div>
                  <div style={{fontSize: '12px', color: '#555', marginTop: '10px'}}>Users will appear here when they submit tasks with screenshots</div>
                </div>
              )}
            </div>
            )}
          </div>
        )}

        {/* 5. SOCIAL SETTINGS (FILE 2) */}
        {activeTab === 'social_settings' && (
           <div style={styles.card}>
    <h2 style={{color: 'gold', marginBottom: '20px'}}>🌐 Social Media Connectivity</h2>
    
    <div style={styles.socialGrid}>
      {/* Row 1: YouTube */}
      <div style={styles.linkRow}>
        <label>🔴 YouTube</label>
        <input value={settings.ytLink} onChange={(e) => setSettings({...settings, ytLink: e.target.value})} placeholder="Channel Link" style={styles.loginInput} />
        <input value={settings.ytSlogan} onChange={(e) => setSettings({...settings, ytSlogan: e.target.value})} placeholder="Slogan (e.g. Watch Tutorials)" style={styles.loginInput} />
      </div>

      {/* Row 2: TikTok */}
      <div style={styles.linkRow}>
        <label>📱 TikTok</label>
        <input value={settings.ttLink} onChange={(e) => setSettings({...settings, ttLink: e.target.value})} placeholder="TikTok Profile Link" style={styles.loginInput} />
        <input value={settings.ttSlogan} onChange={(e) => setSettings({...settings, ttSlogan: e.target.value})} placeholder="Slogan (e.g. Follow for Fun)" style={styles.loginInput} />
      </div>

      {/* Row 3: Twitter (X) */}
      <div style={styles.linkRow}>
        <label>🐦 Twitter (X)</label>
        <input value={settings.twLink} onChange={(e) => setSettings({...settings, twLink: e.target.value})} placeholder="Twitter Link" style={styles.loginInput} />
        <input value={settings.twSlogan} onChange={(e) => setSettings({...settings, twSlogan: e.target.value})} placeholder="Slogan (e.g. Latest Updates)" style={styles.loginInput} />
      </div>

      {/* Row 4: Facebook */}
      <div style={styles.linkRow}>
        <label>📘 Facebook</label>
        <input value={settings.fbLink} onChange={(e) => setSettings({...settings, fbLink: e.target.value})} placeholder="Page Link" style={styles.loginInput} />
        <input value={settings.fbSlogan} onChange={(e) => setSettings({...settings, fbSlogan: e.target.value})} placeholder="Slogan (e.g. Join Our Community)" style={styles.loginInput} />
      </div>

      {/* Row 5: LinkedIn */}
      <div style={styles.linkRow}>
        <label>💼 LinkedIn</label>
        <input value={settings.liLink} onChange={(e) => setSettings({...settings, liLink: e.target.value})} placeholder="LinkedIn Profile" style={styles.loginInput} />
        <input value={settings.liSlogan} onChange={(e) => setSettings({...settings, liSlogan: e.target.value})} placeholder="Slogan (e.g. Professional Network)" style={styles.loginInput} />
      </div>

      {/* Row 6: WhatsApp Channel */}
      <div style={styles.linkRow}>
        <label>💬 WhatsApp Channel</label>
        <input value={settings.waLink} onChange={(e) => setSettings({...settings, waLink: e.target.value})} placeholder="Channel Link" style={styles.loginInput} />
        <input value={settings.waSlogan} onChange={(e) => setSettings({...settings, waSlogan: e.target.value})} placeholder="Slogan (e.g. Get Alerts on WhatsApp)" style={styles.loginInput} />
      </div>

      {/* Row 7: Instagram */}
      <div style={styles.linkRow}>
        <label>📸 Instagram</label>
        <input value={settings.igLink} onChange={(e) => setSettings({...settings, igLink: e.target.value})} placeholder="Instagram Link" style={styles.loginInput} />
        <input value={settings.igSlogan} onChange={(e) => setSettings({...settings, igSlogan: e.target.value})} placeholder="Slogan (e.g. See Our Stories)" style={styles.loginInput} />
      </div>
    </div>

    <button onClick={handleSaveSettings} style={styles.goldBtnLarge}>SAVE ALL SOCIAL LINKS</button>
  </div>
)}

{/* MANAGE NEWS TAB */}
{activeTab === 'manage_news' && (
  <div style={styles.card}>
    <h2 style={{color: 'go ld', marginBottom: '20px'}}>📰 Manage Daily News</h2>
    <p style={{fontSize: '12px', color: '#888'}}>Post news that will appear in the user dashboard.</p>
    <textarea value={newsText} onChange={(e) => setNewsText(e.target.value)} placeholder="Write your news here..." style={{...styles.tidInput, height: '100px', marginTop: '15px'}} />
    <button onClick={handlePostNews} style={styles.goldBtnLarge}>POST NEWS</button>
  </div>
)}

{/* MAINTENANCE TAB */}
{activeTab === 'maintenance' && (
  <div style={styles.card}>
    <h2 style={{color: 'gold', marginBottom: '20px'}}>🛠️ System Maintenance Hub</h2>
    <p style={{fontSize: '13px', color: '#aaa', marginBottom: '20px'}}>Admin maintenance tools for system management & quick navigation</p>
    
    {/* Locked Accounts Section */}
    <div style={{marginBottom: '30px'}}>
      <h3 style={{color: '#FFD700', marginBottom: '15px', fontSize: '14px'}}>🔒 Locked Accounts Management</h3>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px'}}>
        <div style={{...styles.inputGroup, padding: '15px', border: '1px solid #333', borderRadius: '8px'}}>
          <h4 style={{color: '#FFD700', marginBottom: '8px', fontSize: '12px'}}>📋 Backfill Locked Accounts</h4>
          <p style={{fontSize: '11px', color: '#888', marginBottom: '12px'}}>Creates records for already-locked users</p>
          <button onClick={handleBackfillLockedAccounts} style={{...styles.goldBtnLarge, width: '100%', fontSize: '12px'}}>START BACKFILL</button>
        </div>

        <div style={{...styles.inputGroup, padding: '15px', border: '1px solid #333', borderRadius: '8px'}}>
          <h4 style={{color: '#FFD700', marginBottom: '8px', fontSize: '12px'}}>⏰ Process Expired Timers</h4>
          <p style={{fontSize: '11px', color: '#888', marginBottom: '12px'}}>Auto-lock users whose 2-hour timer ended</p>
          <button onClick={handleExpireOverdueUsers} style={{...styles.goldBtnLarge, width: '100%', fontSize: '12px'}}>PROCESS EXPIRED</button>
        </div>

        <div style={{...styles.inputGroup, padding: '15px', border: '1px solid #333', borderRadius: '8px'}}>
          <h4 style={{color: '#FFD700', marginBottom: '8px', fontSize: '12px'}}>🧪 Create Test Record</h4>
          <p style={{fontSize: '11px', color: '#888', marginBottom: '12px'}}>Create test data for demo</p>
          <button onClick={handleCreateTestLockedAccount} style={{...styles.goldBtnLarge, width: '100%', fontSize: '12px', background: '#ff8c00'}}>CREATE TEST</button>
        </div>
      </div>
    </div>

    {/* Quick Navigation Section */}
    <div>
      <h3 style={{color: '#FFD700', marginBottom: '15px', fontSize: '14px'}}>⚡ Quick Navigation</h3>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px'}}>
        <button onClick={() => {
          handleTabChange('requests');
          alert('✅ Switched to Payment Requests tab');
        }} style={{...styles.approveBtn, padding: '12px', fontSize: '12px', height: 'auto'}}>
          💰 Payment Requests
        </button>

        <button onClick={() => {
          handleTabChange('withdraw_approvals');
          alert('✅ Switched to Mega Withdrawals tab');
        }} style={{...styles.approveBtn, padding: '12px', fontSize: '12px', height: 'auto', background: '#1e90ff'}}>
          💎 Mega Withdrawals
        </button>

        <button onClick={() => {
          handleTabChange('register');
          alert('✅ Switched to Registered Users tab');
        }} style={{...styles.approveBtn, padding: '12px', fontSize: '12px', height: 'auto', background: '#32CD32'}}>
          👥 All Users
        </button>

        <button onClick={() => {
          handleTabChange('txn_history');
          alert('✅ Switched to Transaction History tab');
        }} style={{...styles.approveBtn, padding: '12px', fontSize: '12px', height: 'auto', background: '#ff8c00'}}>
          🧾 Payment History
        </button>

        <button onClick={() => {
          handleTabChange('locked_accounts');
          alert('✅ Switched to Locked Accounts tab');
        }} style={{...styles.approveBtn, padding: '12px', fontSize: '12px', height: 'auto', background: '#FF6347'}}>
          🔒 Locked Accounts
        </button>

        <button onClick={() => {
          handleTabChange('task_submissions');
          alert('✅ Switched to Task Submissions tab');
        }} style={{...styles.approveBtn, padding: '12px', fontSize: '12px', height: 'auto', background: '#20B2AA'}}>
          📋 Task Submissions
        </button>

        <button onClick={() => {
          handleTabChange('manage_news');
          alert('✅ Switched to Manage News tab');
        }} style={{...styles.approveBtn, padding: '12px', fontSize: '12px', height: 'auto', background: '#9370DB'}}>
          📰 Manage News
        </button>

        <button onClick={() => {
          handleTabChange('social_settings');
          alert('✅ Switched to Social Settings tab');
        }} style={{...styles.approveBtn, padding: '12px', fontSize: '12px', height: 'auto', background: '#20B2AA'}}>
          🌐 Social Settings
        </button>

        <button onClick={() => {
          handleTabChange('change_password');
          alert('✅ Switched to Change Password tab');
        }} style={{...styles.approveBtn, padding: '12px', fontSize: '12px', height: 'auto', background: '#FFB6C1'}}>
          🔐 Change Password
        </button>
      </div>
    </div>

    <div style={{marginTop: '30px', padding: '15px', background: '#1a1a1a', borderRadius: '8px', borderLeft: '4px solid #FFD700'}}>
      <h3 style={{color: '#FFD700', marginBottom: '10px', fontSize: '14px'}}>⚠️ Important Notes:</h3>
      <ul style={{fontSize: '12px', color: '#aaa', listStylePosition: 'inside'}}>
        <li>✅ All tabs now have improved card-based formatting for better readability</li>
        <li>✅ Backfill is safe to run multiple times - duplicates are prevented</li>
        <li>✅ Use Quick Navigation buttons to jump between tabs instantly</li>
        <li>✅ All data tables have been converted to card format for easier viewing</li>
      </ul>
    </div>
  </div>
)}

{/* NOTIFICATION TAB removed as requested */}

{/* MANAGE BLOGS TAB */}
{activeTab === 'manage_blogs' && (
  <ManageBlogs />
)}

{/* CHANGE PASSWORD TAB */}
{activeTab === 'change_password' && (
  <div style={styles.card}>
    <h2 style={{color: 'gold'}}>🔐 Update Admin Password</h2>
    <div style={{maxWidth: '400px', marginTop: '20px'}}>
      <label style={styles.fieldLabel}>Current Password:</label>
      <input type="password" style={styles.tidInput} />
      
      <label style={styles.fieldLabel}>New Password:</label>
      <input type="password" style={styles.tidInput} />
      
      <button style={styles.goldBtnLarge} onClick={() => alert("Password Updated!")}>UPDATE PASSWORD</button>
    </div>
  </div>
)}

{/* Manage Users section removed as per request */}

{/* TRANSACTION HISTORY TAB */}
{activeTab === 'txn_history' && (
  <div style={styles.card}>
    <h2 style={{color: 'gold', marginBottom: '20px'}}>🧾 Transaction History</h2>
    {isLoadingAllPayments ? (
      <div style={{textAlign: 'center', padding: '40px', color: '#FFD700'}}>
        <div style={{fontSize: '20px', marginBottom: '10px'}}>⏳</div>
        <div>Loading transaction history...</div>
      </div>
    ) : errorAllPayments ? (
      <div style={{textAlign: 'center', padding: '40px', color: '#FF6347'}}>
        <div style={{fontSize: '20px', marginBottom: '10px'}}>❌</div>
        <div>{errorAllPayments}</div>
        <button onClick={retryFetchAllPayments} style={{...styles.goldBtn, marginTop: '15px'}}>Retry</button>
      </div>
    ) : (
      <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '12px', maxHeight: '70vh', overflowY: 'auto'}}>
        {Array.isArray(allPayments) && allPayments.length > 0 ? (
          allPayments.map(payment => (
            <div key={payment._id} style={{
              background: '#0a0a0a',
              border: '1px solid #333',
              borderRadius: '10px',
              padding: '15px',
              display: 'grid',
              gridTemplateColumns: '1fr auto auto',
              gap: '15px',
              alignItems: 'center'
            }}>
              <div>
                <div style={{fontSize: '13px', color: '#ccc'}}>{payment.username} - {payment.type}</div>
                <div style={{fontSize: '11px', color: '#666', marginTop: '3px'}}>Status: {payment.status} | {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : 'N/A'}</div>
              </div>
              <div style={{textAlign: 'right'}}>
                <div style={{fontSize: '16px', color: payment.status === 'Approved' ? '#32CD32' : payment.status === 'Rejected' ? '#FF6347' : '#FFD700', fontWeight: 'bold'}}>RS {payment.amountType}</div>
                <div style={{fontSize: '11px', color: '#666'}}>{payment.status}</div>
              </div>
              <div style={{fontSize: '11px', color: '#888'}}>🕐</div>
            </div>
          ))
        ) : (
          <div style={{
            background: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: '10px',
            padding: '15px',
            textAlign: 'center',
            color: '#666',
            fontSize: '12px'
          }}>
            <div style={{marginBottom: '5px'}}>📊</div>
            No transactions found
          </div>
        )}
      </div>
    )}
  </div>
)}
        
      </div>
    </div>
  );
};

const styles: any = {
  loginOverlay: { background: '#000', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  loginBox: { background: '#0a0a0a', padding: '40px', border: '1px solid gold', borderRadius: '15px', textAlign: 'center' },
  sidebar: { width: '250px', background: '#0a0a0a', borderRight: '1px solid #222', height: '100vh', position: 'fixed', padding: '20px', overflowY: 'auto', paddingBottom: '100px' },
  main: { marginLeft: '290px', padding: '40px', flex: 1 },
  loginInput: { padding: '12px', width: '100%', background: '#111', border: '1px solid #333', color: '#fff', borderRadius: '8px', marginBottom: '15px', display: 'block' },
  navBtn: { background: 'none', border: 'none', color: '#666', width: '100%', textAlign: 'left', padding: '15px', cursor: 'pointer' },
  navBtnActive: { background: 'rgba(255,215,0,0.1)', color: 'gold', width: '100%', textAlign: 'left', padding: '15px', cursor: 'pointer', fontWeight: 'bold', borderLeft: '4px solid gold' },
  card: { background: '#0a0a0a', border: '1px solid #222', padding: '25px', borderRadius: '15px' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  th: { padding: '12px', borderBottom: '1px solid #333', fontWeight: 'bold' },
  td: { padding: '12px', borderBottom: '1px solid #222' },
  tr: { borderBottom: '1px solid #222' },
  approveBtn: { background: 'green', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', marginRight: '5px' },
  rejectBtn: { background: 'red', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' },
  goldBtnLarge: { background: 'gold', border: 'none', padding: '12px 40px', fontWeight: 'bold', cursor: 'pointer', borderRadius: '8px' },
  inputGroup: { marginBottom: '25px', borderBottom: '1px solid #222', paddingBottom: '10px' },
  fieldLabel: {
    display: 'block',
    fontSize: '12px',
    color: '#888',
    marginBottom: '5px',
    marginTop: '10px'
  },
  logoutBtn: { background: '#ff4444', color: 'white', border: 'none', width: '100%', padding: '10px', borderRadius: '5px', cursor: 'pointer', marginTop: '40px', fontWeight: 'bold', fontSize: '14px' },
  inputField: { padding: '8px', background: '#111', border: '1px solid #333', color: '#fff', borderRadius: '4px', width: '100%' },
};

export default AdminPanel;


