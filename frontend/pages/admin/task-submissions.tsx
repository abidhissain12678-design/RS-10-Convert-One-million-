import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getApiBaseUrl } from '../../utils/api';

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

const TaskSubmissions: React.FC = () => {
  const [pendingSubmissions, setPendingSubmissions] = useState<UserTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const getImageUrl = (url: string) => url.startsWith('http') ? url : `${getApiBaseUrl()}${url}`;

  const isVideoFile = (url: string) => {
    const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.flv', '.m3u8'];
    return videoExtensions.some(ext => url.toLowerCase().includes(ext));
  };

  const isImageFile = (url: string) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
    return imageExtensions.some(ext => url.toLowerCase().includes(ext));
  };

  useEffect(() => {
    loadPendingSubmissions();
  }, []);

  const loadPendingSubmissions = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Admin authentication required');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${getApiBaseUrl()}/api/tasks/admin/submissions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
      });

      if (response.ok) {
        const data = await response.json();
        // ONLY show pending (not completed) tasks
        const pending = data.filter((sub: UserTask) => !sub.completed);
        setPendingSubmissions(pending);
      } else {
        setError('Failed to load submissions');
      }
    } catch (err) {
      setError('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePayment = async (submissionId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Admin authentication required');
      return;
    }

    setProcessingId(submissionId);
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/tasks/admin/approve-payment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ submissionId })
      });

      if (response.ok) {
        const data = await response.json();
        // Remove from pending list after approval
        setPendingSubmissions(prev => prev.filter(s => s._id !== submissionId));
        alert(`✅ Payment APPROVED! Task earnings added to user account (RS ${data.taskEarnings || 'updated'})`);
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to approve payment');
      }
    } catch (err) {
      alert('Failed to approve payment');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectPayment = async (submissionId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Admin authentication required');
      return;
    }

    setProcessingId(submissionId);
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/tasks/admin/reject-payment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ submissionId })
      });

      if (response.ok) {
        // Remove from pending list after rejection
        setPendingSubmissions(prev => prev.filter(s => s._id !== submissionId));
        alert('❌ Payment REJECTED! Task moved to History.');
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to reject payment');
      }
    } catch (err) {
      alert('Failed to reject payment');
    } finally {
      setProcessingId(null);
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
          <h1 style={{ color: '#FFD700', margin: 0 }}>Admin Panel - Task Submissions</h1>
          <button
            onClick={() => {
              setLoading(true);
              loadPendingSubmissions();
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

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <button
            style={{
              background: '#FFD700',
              color: '#000',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px'
            }}
          >
            📋 Task Submissions ({pendingSubmissions.length})
          </button>
          <Link href="/admin/task-submission-history">
            <button
              style={{
                background: '#333',
                color: '#fff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px'
              }}
            >
              📊 Task Submission History
            </button>
          </Link>
        </div>

        <p style={{ color: '#ccc', fontSize: '14px', marginBottom: '20px' }}>
          Review pending task proof submissions below. Click <strong>Approve</strong> to verify and credit the user's account, or <strong>Reject</strong> to deny the submission.
        </p>

        <h2 style={{ color: '#FFD700', marginBottom: '20px' }}>⏳ Pending Submissions ({pendingSubmissions.length})</h2>

        {pendingSubmissions.length === 0 ? (
          <div style={{ padding: '20px', background: 'rgba(255, 215, 0, 0.1)', borderRadius: '8px', border: '1px solid #FFD700' }}>
            <p style={{ color: '#FFD700', margin: 0 }}>✅ No pending submissions! All tasks have been reviewed.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {pendingSubmissions.map((submission) => (
              <div key={submission._id} style={{
                background: 'rgba(255, 107, 107, 0.1)',
                padding: '20px',
                borderRadius: '12px',
                border: '2px solid #FF6B6B'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                  <div>
                    <h3 style={{ color: '#FFD700', margin: '0 0 5px 0' }}>{submission.taskId.title}</h3>
                    <p style={{ color: '#ccc', margin: 0, fontSize: '14px' }}>
                      {submission.taskId.taskType} • Reward: RS {submission.taskId.reward}
                    </p>
                  </div>
                  <div style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    background: '#FF6B6B',
                    color: 'white',
                    fontSize: '13px',
                    fontWeight: 'bold'
                  }}>
                    ⏳ PENDING
                  </div>
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <h4 style={{ color: '#FFD700', margin: '0 0 10px 0', fontSize: '16px' }}>User Details</h4>
                  <p style={{ color: '#ccc', margin: 0, fontSize: '14px' }}>
                    Name: <strong>{submission.userId?.name || submission.user?.name || 'Unknown'}</strong> ({submission.userId?.username || submission.user?.username || 'N/A'})<br/>
                    Email: {submission.userId?.email || submission.user?.email || 'N/A'}
                  </p>
                </div>
                
                <div>
                  <h4 style={{ color: '#FFD700', margin: '0 0 10px 0', fontSize: '16px' }}>Proof Files ({(submission.proofUrls || []).length})</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                    {(submission.proofUrls || []).map((url, index) => {
                      const fullUrl = getImageUrl(url);
                      const isVideo = isVideoFile(fullUrl);
                      const isImage = isImageFile(fullUrl);
                      
                      return (
                        <div key={index} style={{
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          background: '#000',
                          display: 'flex',
                          flexDirection: 'column'
                        }}>
                          {isVideo ? (
                            <div style={{
                              width: '100%',
                              height: '150px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: '#1a1a1a',
                              fontSize: '48px'
                            }}>
                              🎬
                            </div>
                          ) : isImage ? (
                            <img
                              src={fullUrl}
                              alt={`Submission ${index + 1}`}
                              style={{
                                width: '100%',
                                height: '150px',
                                objectFit: 'cover',
                                display: 'block',
                                cursor: 'pointer'
                              }}
                              onClick={() => window.open(fullUrl, '_blank')}
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement!.innerHTML = '<div style="width: 100%; height: 150px; display: flex; align-items: center; justify-content: center; background: #1a1a1a; font-size: 40px;">📄</div>';
                              }}
                            />
                          ) : (
                            <div style={{
                              width: '100%',
                              height: '150px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: '#1a1a1a',
                              fontSize: '40px'
                            }}>
                              📄
                            </div>
                          )}
                          <div style={{
                            padding: '8px',
                            background: 'rgba(0,0,0,0.7)',
                            textAlign: 'center',
                            fontSize: '12px',
                            color: '#ccc'
                          }}>
                            {isVideo ? '🎬 Video' : isImage ? '🖼️ Screenshot' : '📄 File'} {index + 1}
                          </div>
                          <div style={{
                            padding: '8px',
                            textAlign: 'center'
                          }}>
                            <a
                              href={fullUrl}
                              download={`submission-${index + 1}-${Date.now()}`}
                              style={{
                                display: 'inline-block',
                                padding: '6px 12px',
                                background: '#FFD700',
                                color: '#000',
                                textDecoration: 'none',
                                borderRadius: '4px',
                                fontSize: '11px',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                              }}
                            >
                              ⬇️ Download
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div style={{ marginTop: '15px', fontSize: '12px', color: '#888' }}>
                  Submitted: {new Date(submission.updatedAt).toLocaleString()}
                </div>

                {/* Action Buttons */}
                <div style={{ marginTop: '15px', padding: '15px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
                  <h4 style={{ color: '#FFD700', margin: '0 0 12px 0', fontSize: '14px' }}>Action Required</h4>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => handleApprovePayment(submission._id)}
                      disabled={processingId === submission._id}
                      style={{
                        background: processingId === submission._id ? '#888' : '#4CAF50',
                        color: 'white',
                        border: 'none',
                        padding: '10px 18px',
                        borderRadius: '6px',
                        fontSize: '13px',
                        cursor: processingId === submission._id ? 'not-allowed' : 'pointer',
                        fontWeight: 'bold',
                        opacity: processingId === submission._id ? 0.6 : 1
                      }}
                    >
                      {processingId === submission._id ? '⏳ Processing...' : '✅ Approve & Credit User'}
                    </button>
                    <button
                      onClick={() => handleRejectPayment(submission._id)}
                      disabled={processingId === submission._id}
                      style={{
                        background: processingId === submission._id ? '#888' : '#f44336',
                        color: 'white',
                        border: 'none',
                        padding: '10px 18px',
                        borderRadius: '6px',
                        fontSize: '13px',
                        cursor: processingId === submission._id ? 'not-allowed' : 'pointer',
                        fontWeight: 'bold',
                        opacity: processingId === submission._id ? 0.6 : 1
                      }}
                    >
                      {processingId === submission._id ? '⏳ Processing...' : '❌ Reject'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskSubmissions;
