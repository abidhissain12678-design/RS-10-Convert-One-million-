import React, { useState, useEffect } from 'react';
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

const TaskSubmissionHistory: React.FC = () => {
  const [approvedSubmissions, setApprovedSubmissions] = useState<UserTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
    loadApprovedSubmissions();
  }, []);

  const loadApprovedSubmissions = async () => {
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
        // Only show completed (approved) submissions
        const approved = data.filter((sub: UserTask) => sub.completed === true);
        setApprovedSubmissions(approved);
      } else {
        setError('Failed to load submission history');
      }
    } catch (err) {
      setError('Failed to load submission history');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#04060f', padding: '40px 20px', color: '#fff', fontFamily: 'Segoe UI, sans-serif' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ color: '#FFD700', marginBottom: '20px' }}>Task Submission History</h1>
          <p>Loading history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', background: '#04060f', padding: '40px 20px', color: '#fff', fontFamily: 'Segoe UI, sans-serif' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ color: '#FFD700', marginBottom: '20px' }}>Task Submission History</h1>
          <p style={{ color: 'red' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#04060f', padding: '40px 20px', color: '#fff', fontFamily: 'Segoe UI, sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '15px', marginBottom: '20px' }}>
          <h1 style={{ color: '#FFD700', margin: 0 }}>📊 Task Submission History</h1>
          <button
            onClick={() => {
              setLoading(true);
              loadApprovedSubmissions();
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

        <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(76, 175, 80, 0.1)', borderRadius: '8px', border: '1px solid #4CAF50' }}>
          <p style={{ color: '#ccc', margin: 0, fontSize: '14px' }}>
            This page shows all APPROVED and COMPLETED task submissions. These tasks have already been verified and rewards have been credited to users.
          </p>
        </div>

        <h2 style={{ color: '#FFD700', marginBottom: '20px' }}>✅ Approved Submissions ({approvedSubmissions.length})</h2>
        
        {approvedSubmissions.length === 0 ? (
          <p style={{ color: '#ccc' }}>No approved submissions in history yet.</p>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {approvedSubmissions.map((submission) => (
              <div key={submission._id} style={{
                background: 'rgba(76, 175, 80, 0.1)',
                padding: '20px',
                borderRadius: '12px',
                border: '2px solid #4CAF50'
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
                    background: '#4CAF50',
                    color: 'white',
                    fontSize: '13px',
                    fontWeight: 'bold'
                  }}>
                    ✅ APPROVED
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
                  <h4 style={{ color: '#FFD700', margin: '0 0 10px 0', fontSize: '16px' }}>Submissions ({(submission.proofUrls || []).length})</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                    {(submission.proofUrls || []).map((url, index) => {
                      const fullUrl = getImageUrl(url);
                      const isVideo = isVideoFile(fullUrl);
                      const isImage = isImageFile(fullUrl);
                      
                      return (
                        <div key={index} style={{
                          border: '1px solid rgba(76, 175, 80, 0.3)',
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
                            background: 'rgba(76, 175, 80, 0.2)',
                            textAlign: 'center'
                          }}>
                            <a
                              href={fullUrl}
                              download={`submission-${index + 1}-${Date.now()}`}
                              style={{
                                display: 'inline-block',
                                padding: '6px 12px',
                                background: '#4CAF50',
                                color: '#fff',
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
                  ✅ Approved: {new Date(submission.updatedAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskSubmissionHistory;
