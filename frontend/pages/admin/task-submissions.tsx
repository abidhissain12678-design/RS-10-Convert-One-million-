import React, { useState, useEffect } from 'react';

interface UserTask {
  _id: string;
  userId: {
    _id: string;
    name: string;
    username: string;
    email: string;
  };
  user?: {
    _id: string;
    name: string;
    username: string;
    email: string;
  };
  taskId: {
    _id: string;
    title: string;
    taskType: string;
    reward: string;
    description?: string;
  };
  task?: {
    _id: string;
    title: string;
    taskType: string;
    reward: string;
    description?: string;
  };
  proofUrls: string[];
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

interface WithdrawalRequest {
  _id: string;
  userId: {
    _id: string;
    name: string;
    username: string;
    email: string;
  };
  transactionId: string;
  amountType: number;
  type: string;
  status: string;
  withdrawMethod: string;
  withdrawAccount: string;
  accountHolderName?: string;
  createdAt: string;
}

const TaskSubmissions: React.FC = () => {
  const [submissions, setSubmissions] = useState<UserTask[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'tasks' | 'withdrawals'>('tasks');
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'production'
    ? 'https://rs-10-convert-one-million.onrender.com'
    : 'http://localhost:5000');
  const getImageUrl = (url: string) => url.startsWith('http') ? url : `${baseUrl}${url}`;

  useEffect(() => {
    loadSubmissions();
    loadWithdrawals();
  }, []);

  const loadSubmissions = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Admin authentication required');
      setLoading(false);
      return;
    }

    try {
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://rs-10-convert-one-million.onrender.com' 
        : 'http://localhost:5000';
      
      const response = await fetch(`${baseUrl}/api/tasks/admin/submissions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSubmissions(data);
      } else {
        setError('Failed to load submissions');
      }
    } catch (err) {
      setError('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const loadWithdrawals = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://rs-10-convert-one-million.onrender.com' 
        : 'http://localhost:5000';
      
      const response = await fetch(`${baseUrl}/api/payment/pending-payments`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Filter for task withdrawals
        const taskWithdrawals = data.filter((payment: any) => payment.type === 'Task Withdraw');
        setWithdrawals(taskWithdrawals);
      }
    } catch (err) {
      console.error('Failed to load withdrawals');
    }
  };

  const handleApprovePayment = async (submissionId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Admin authentication required');
      return;
    }

    try {
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://rs-10-convert-one-million.onrender.com' 
        : 'http://localhost:5000';
      
      const response = await fetch(`${baseUrl}/api/tasks/admin/approve-payment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ submissionId })
      });

      if (response.ok) {
        alert('Payment approved successfully!');
        loadSubmissions(); // Refresh the list
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to approve payment');
      }
    } catch (err) {
      alert('Failed to approve payment');
    }
  };

  const handleRejectPayment = async (submissionId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Admin authentication required');
      return;
    }

    try {
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://rs-10-convert-one-million.onrender.com' 
        : 'http://localhost:5000';
      
      const response = await fetch(`${baseUrl}/api/tasks/admin/reject-payment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ submissionId })
      });

      if (response.ok) {
        alert('Payment rejected successfully!');
        loadSubmissions(); // Refresh the list
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to reject payment');
      }
    } catch (err) {
      alert('Failed to reject payment');
    }
  };

  const handleApproveWithdrawal = async (paymentId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Admin authentication required');
      return;
    }

    try {
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://rs-10-convert-one-million.onrender.com' 
        : 'http://localhost:5000';
      
      const response = await fetch(`${baseUrl}/api/payment/approve-payment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ paymentId })
      });

      if (response.ok) {
        alert('Withdrawal approved successfully!');
        loadWithdrawals(); // Refresh the list
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to approve withdrawal');
      }
    } catch (err) {
      alert('Failed to approve withdrawal');
    }
  };

  const handleRejectWithdrawal = async (paymentId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Admin authentication required');
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/api/payment/reject-payment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ paymentId })
      });

      if (response.ok) {
        alert('Withdrawal rejected successfully!');
        loadWithdrawals();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to reject withdrawal');
      }
    } catch (err) {
      alert('Failed to reject withdrawal');
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#04060f', padding: '40px 20px', color: '#fff', fontFamily: 'Segoe UI, sans-serif' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ color: '#FFD700', marginBottom: '20px' }}>Task Submissions</h1>
          <p>Loading submissions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', background: '#04060f', padding: '40px 20px', color: '#fff', fontFamily: 'Segoe UI, sans-serif' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ color: '#FFD700', marginBottom: '20px' }}>Task Submissions</h1>
          <p style={{ color: 'red' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#04060f', padding: '40px 20px', color: '#fff', fontFamily: 'Segoe UI, sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '15px', marginBottom: '20px' }}>
          <h1 style={{ color: '#FFD700', margin: 0 }}>Admin Panel</h1>
          <button
            onClick={() => {
              setLoading(true);
              loadSubmissions();
              loadWithdrawals();
            }}
            style={{
              background: '#1e90ff',
              color: '#fff',
              border: 'none',
              padding: '10px 18px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            🔄 Refresh Data
          </button>
        </div>
        <p style={{ color: '#ccc', fontSize: '14px', marginBottom: '20px' }}>
          Proof screenshots appear below. Use the Withdrawals tab to approve Task Earnings withdrawal requests submitted by users.
        </p>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <button
            onClick={() => setActiveTab('tasks')}
            style={{
              background: activeTab === 'tasks' ? '#FFD700' : '#333',
              color: activeTab === 'tasks' ? '#000' : '#fff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Task Submissions
          </button>
          <button
            onClick={() => setActiveTab('withdrawals')}
            style={{
              background: activeTab === 'withdrawals' ? '#FFD700' : '#333',
              color: activeTab === 'withdrawals' ? '#000' : '#fff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Task Withdrawals ({withdrawals.length})
          </button>
        </div>

        {activeTab === 'tasks' && (
          <>
            <h2 style={{ color: '#FFD700', marginBottom: '20px' }}>Task Submissions</h2>
            {submissions.length === 0 ? (
              <p>No submissions found.</p>
            ) : (
              <div style={{ display: 'grid', gap: '20px' }}>
                {submissions.map((submission) => (
                  <div key={submission._id} style={{
                    background: 'rgba(255,255,255,0.05)',
                    padding: '20px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                  <div>
                    <h3 style={{ color: '#FFD700', margin: '0 0 5px 0' }}>{submission.taskId.title}</h3>
                    <p style={{ color: '#ccc', margin: 0, fontSize: '14px' }}>
                      {submission.taskId.taskType} • Reward: RS {submission.taskId.reward}
                    </p>
                  </div>
                  <div style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    background: submission.completed ? '#4CAF50' : '#FF9800',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {submission.completed ? 'Completed' : 'Pending'}
                  </div>
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <h4 style={{ color: '#FFD700', margin: '0 0 10px 0', fontSize: '16px' }}>User Details</h4>
                  <p style={{ color: '#ccc', margin: 0, fontSize: '14px' }}>
                    Name: {submission.userId?.name || submission.user?.name || 'Unknown'} ({submission.userId?.username || submission.user?.username || 'N/A'})<br/>
                    Email: {submission.userId?.email || submission.user?.email || 'N/A'}
                  </p>
                </div>
                
                <div>
                  <h4 style={{ color: '#FFD700', margin: '0 0 10px 0', fontSize: '16px' }}>Screenshots ({(submission.proofUrls || []).length})</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                    {(submission.proofUrls || []).map((url, index) => (
                      <div key={index} style={{
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        background: '#000'
                      }}>
                        <img
                          src={getImageUrl(url)}
                          alt={`Screenshot ${index + 1}`}
                          style={{
                            width: '100%',
                            height: '150px',
                            objectFit: 'cover',
                            display: 'block'
                          }}
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-image.png'; // Fallback image
                          }}
                        />
                        <div style={{
                          padding: '8px',
                          background: 'rgba(0,0,0,0.7)',
                          textAlign: 'center',
                          fontSize: '12px',
                          color: '#ccc'
                        }}>
                          Screenshot {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div style={{ marginTop: '15px', fontSize: '12px', color: '#888' }}>
                  Submitted: {new Date(submission.updatedAt).toLocaleString()}
                </div>
                
                {/* Payment Verification Section */}
                <div style={{ marginTop: '15px', padding: '10px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
                  <h4 style={{ color: '#FFD700', margin: '0 0 10px 0', fontSize: '14px' }}>Payment Verification</h4>
                  {submission.completed ? (
                    <p style={{ color: '#4CAF50', fontSize: '14px', margin: 0 }}>✅ Payment Approved - Reward Claimed</p>
                  ) : (
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => handleApprovePayment(submission._id)}
                        style={{
                          background: '#4CAF50',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          fontWeight: 'bold'
                        }}
                      >
                        ✅ Approve Payment
                      </button>
                      <button
                        onClick={() => handleRejectPayment(submission._id)}
                        style={{
                          background: '#f44336',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          fontWeight: 'bold'
                        }}
                      >
                        ❌ Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        </>
        )}

        {activeTab === 'withdrawals' && (
          <>
            <h2 style={{ color: '#FFD700', marginBottom: '20px' }}>Task Withdrawal Requests</h2>
            {withdrawals.length === 0 ? (
              <p>No withdrawal requests found.</p>
            ) : (
              <div style={{ display: 'grid', gap: '20px' }}>
                {withdrawals.map((withdrawal) => (
                  <div key={withdrawal._id} style={{
                    background: 'rgba(255,255,255,0.05)',
                    padding: '20px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.1)'}}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                      <div>
                        <h3 style={{ color: '#FFD700', margin: '0 0 5px 0' }}>Task Withdrawal Request</h3>
                        <p style={{ color: '#ccc', margin: 0, fontSize: '14px' }}>
                          Amount: RS {withdrawal.amountType?.toLocaleString?.() || withdrawal.amountType}
                        </p>
                      </div>
                      <div style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        background: '#FF9800',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        Pending
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: '15px' }}>
                      <h4 style={{ color: '#FFD700', margin: '0 0 10px 0', fontSize: '16px' }}>User Details</h4>
                      <p style={{ color: '#ccc', margin: 0, fontSize: '14px' }}>
                        Name: {withdrawal.userId.name} ({withdrawal.userId.username})<br/>
                        Email: {withdrawal.userId.email}
                      </p>
                    </div>
                    
                    <div style={{ marginBottom: '15px' }}>
                      <h4 style={{ color: '#FFD700', margin: '0 0 10px 0', fontSize: '16px' }}>Withdrawal Details</h4>
                      <p style={{ color: '#ccc', margin: 0, fontSize: '14px' }}>
                        Method: {withdrawal.withdrawMethod}<br/>
                        Account Number: {withdrawal.withdrawAccount}<br/>
                        Account Holder: {withdrawal.accountHolderName || 'N/A'}
                      </p>
                    </div>
                    
                    <div style={{ marginTop: '15px', fontSize: '12px', color: '#888' }}>
                      Requested: {new Date(withdrawal.createdAt).toLocaleString()}
                    </div>
                    
                    {/* Withdrawal Actions */}
                    <div style={{ marginTop: '15px', padding: '10px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
                      <h4 style={{ color: '#FFD700', margin: '0 0 10px 0', fontSize: '14px' }}>Actions</h4>
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => handleApproveWithdrawal(withdrawal._id)}
                          style={{
                            background: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                          }}
                        >
                          ✅ Approve Withdrawal
                        </button>
                        <button
                          onClick={() => handleRejectWithdrawal(withdrawal._id)}
                          style={{
                            background: '#f44336',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                          }}
                        >
                          ❌ Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TaskSubmissions;