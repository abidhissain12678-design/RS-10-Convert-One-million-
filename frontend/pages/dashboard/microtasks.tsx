import React, { useEffect, useState, useRef } from 'react';
import { getApiBaseUrl } from '../../utils/api';

interface Task {
  _id: string;
  taskType: string;
  title: string;
  description: string;
  reward: string;
  link: string;
  totalQuantity: number;
  completedQuantity: number;
  completedBy?: string[];
  requiresProof: boolean;
}

const getTaskIcon = (taskType: string) => {
  switch (taskType.toLowerCase()) {
    case 'youtube': return '🎥';
    case 'facebook': return '📘';
    case 'instagram': return '📷';
    case 'tiktok': return '🎵';
    case 'twitter': return '🐦';
    case 'whatsapp': return '💬';
    case 'video review': return '🎬';
    default: return '🔗';
  }
};

const MicroTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [proofFiles, setProofFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [taskHistory, setTaskHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [taskEarnings, setTaskEarnings] = useState<number>(0);
  const [completedTaskIds, setCompletedTaskIds] = useState<Set<string>>(new Set());
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawData, setWithdrawData] = useState({
    amount: '',
    method: '',
    accountNumber: '',
    accountHolderName: ''
  });
  const [withdrawSubmitting, setWithdrawSubmitting] = useState(false);
  const [referralPaymentVerified, setReferralPaymentVerified] = useState(false);
  const [userReferrals, setUserReferrals] = useState<any[]>([]);
  const [loadingReferralStatus, setLoadingReferralStatus] = useState(true);
  
  // YouTube Player states
  const playerRef = useRef<any | null>(null);
  const playerContainerId = 'youtube-player-container';
  const [videoEnded, setVideoEnded] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);
  const youtubeApiLoadedRef = useRef(false);
  const videoStartTimeRef = useRef<number>(0);

  const fetchTaskEarnings = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/api/tasks/user/earnings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTaskEarnings(data.taskEarnings);
      }
    } catch (err) {
      console.error('Failed to fetch task earnings');
    }
  };

  const fetchReferralPaymentStatus = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoadingReferralStatus(false);
      return;
    }

    try {
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/api/auth/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUserReferrals(userData.networkReferrals || []);
        
        // Check if user has any referral with unlocked status and payment approved
        const hasVerifiedReferral = (userData.networkReferrals || []).some(
          (referral: any) => referral.status === 'unlocked' && referral.paymentApproved === true
        );
        
        setReferralPaymentVerified(hasVerifiedReferral);
      }
    } catch (err) {
      console.error('Failed to fetch referral payment status');
    } finally {
      setLoadingReferralStatus(false);
    }
  };

  const fetchCompletedTasks = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/api/tasks/user/submissions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const completedIds: Set<string> = new Set(data.filter((task: any) => task.completed).map((task: any) => String(task.taskId._id || task.taskId)));
        setCompletedTaskIds(completedIds);
      }
    } catch (err) {
      console.error('Failed to fetch completed tasks');
    }
  };

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view tasks');
        setLoading(false);
        return;
      }

      try {
        const userRaw = localStorage.getItem('user');
        if (userRaw) {
          try {
            const userObject = JSON.parse(userRaw);
            setCurrentUserId(userObject?.id || userObject?._id || null);
          } catch {
            setCurrentUserId(null);
          }
        }

        const baseUrl = getApiBaseUrl();
        const response = await fetch(`${baseUrl}/api/tasks/active`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Cache-Control': 'no-cache'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }

        const data = await response.json();
        setTasks(data);
      } catch (err) {
        setError('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
    fetchTaskEarnings();
    fetchCompletedTasks();
    fetchReferralPaymentStatus();
  }, []);

  // Load YouTube API script
  useEffect(() => {
    if (!youtubeApiLoadedRef.current) {
      const loadYouTubeAPI = () => {
        if (window.YT && window.YT.Player) {
          // API already loaded
          youtubeApiLoadedRef.current = true;
          console.log('YouTube API already loaded');
          return;
        }

        window.onYouTubeIframeAPIReady = () => {
          console.log('YouTube IFrame API ready');
          youtubeApiLoadedRef.current = true;
        };

        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        script.async = true;

        script.onload = () => {
          console.log('YouTube API script loaded successfully');
          if (window.YT && window.YT.Player) {
            youtubeApiLoadedRef.current = true;
          }
        };

        script.onerror = () => {
          console.error('Failed to load YouTube API script');
          setVideoError('Failed to load YouTube API');
        };

        document.body.appendChild(script);
      };

      loadYouTubeAPI();
    }
  }, []);

  // Extract YouTube video ID from URL
  const extractYouTubeVideoId = (url: string): string | null => {
    if (!url) {
      console.error('No URL provided for video ID extraction');
      return null;
    }

    console.log('Extracting video ID from URL:', url);

    try {
      const patterns = [
        /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
        /youtu\.be\/([a-zA-Z0-9_-]{11})/,
        /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
        /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/
      ];

      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
          console.log('Video ID extracted:', match[1]);
          return match[1];
        }
      }

      console.error('No valid YouTube video ID found in URL:', url);
      return null;
    } catch (e) {
      console.error('Error extracting YouTube video ID:', e);
      return null;
    }
  };

  // Initialize YouTube player
  const initializeYouTubePlayer = (videoId: string) => {
    console.log('Initializing YouTube player with video ID:', videoId);

    if (!videoId) {
      setVideoError('Invalid video ID');
      return;
    }

    if (!window.YT || !window.YT.Player) {
      console.log('YouTube API not ready, retrying in 1 second...');
      setTimeout(() => initializeYouTubePlayer(videoId), 1000);
      return;
    }

    // Safely destroy existing player
    if (playerRef.current) {
      try {
        playerRef.current.destroy();
        console.log('Destroyed existing YouTube player');
      } catch (error) {
        console.warn('Error destroying YouTube player:', error);
      }
      playerRef.current = null;
    }

    // Check if container exists before creating player
    const container = document.getElementById(playerContainerId);
    if (!container) {
      console.error('YouTube player container not found');
      setVideoError('Player container not found');
      return;
    }

    try {
      console.log('Creating new YouTube player...');
      playerRef.current = new window.YT.Player(playerContainerId, {
        height: '400',
        width: '100%',
        videoId: videoId,
        playerVars: {
          'autoplay': 1,
          'controls': 0,  // Hide controls to prevent seeking/skipping
          'disablekb': 1,  // Disable keyboard controls
          'enablejsapi': 1,
          'origin': window.location.origin,
          'rel': 0,
          'modestbranding': 1,
          'fs': 0,  // Disable fullscreen
          'iv_load_policy': 3,
          'cc_load_policy': 0,
          'playsinline': 1  // Inline playback on mobile
        },
        events: {
          'onReady': (event: any) => {
            console.log('🎬 YouTube player ready - Full video watching required');
            setVideoError(null);
            videoStartTimeRef.current = 0;
            
            // All seeking is prevented by hidden controls (controls: 0, disablekb: 1)
            // Only tracking video completion via onStateChange event (ENDED)
            
            try {
              event.target.playVideo();
              setVideoPlaying(true);
            } catch (playError) {
              console.warn('Auto-play blocked, waiting for user interaction', playError);
            }
          },
          'onStateChange': onPlayerStateChange,
          'onError': (event: any) => {
            console.error('YouTube player error:', event.data);
            let errorMessage = 'Unknown YouTube player error';
            switch (event.data) {
              case 2:
                errorMessage = 'Invalid video ID or video not found';
                break;
              case 5:
                errorMessage = 'HTML5 player error';
                break;
              case 100:
                errorMessage = 'Video not found or private';
                break;
              case 101:
              case 150:
                errorMessage = 'Video cannot be embedded';
                break;
            }
            setVideoError(errorMessage);
          }
        }
      });
    } catch (error) {
      console.error('Error creating YouTube player:', error);
      setVideoError('Failed to create video player');
      playerRef.current = null;
    }
  };

  // Handle YouTube player state changes
  const onPlayerStateChange = (event: YTOnStateChangeEvent) => {
    try {
      if (event.data === window.YT.PlayerState.ENDED) {
        console.log('✅ Video completed - Full video watched successfully');
        setVideoEnded(true);
        setVideoPlaying(false);
      } else if (event.data === window.YT.PlayerState.PLAYING) {
        const player = playerRef.current || (event as any).target;
        if (player) {
          const currentTime = player.getCurrentTime();
          const duration = player.getDuration();
          console.log(`▶️ Video playing - ${currentTime.toFixed(1)}s / ${duration.toFixed(1)}s`);
        }
        setVideoEnded(false);
        setVideoPlaying(true);
      } else if (event.data === window.YT.PlayerState.PAUSED || event.data === window.YT.PlayerState.BUFFERING) {
        console.log('⏸️ Video paused or buffering');
        setVideoPlaying(false);
      }
    } catch (error) {
      console.warn('Error handling YouTube player state change:', error);
    }
  };

  // Cleanup YouTube player when modal closes
  useEffect(() => {
    if (!showModal && playerRef.current) {
      try {
        playerRef.current.destroy();
      } catch (error) {
        console.warn('Error destroying YouTube player on modal close:', error);
      }
      playerRef.current = null;
      setVideoId(null);
      setVideoError(null);
      setVideoEnded(false);
    }
  }, [showModal]);

  const playYouTubeVideo = () => {
    if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
      try {
        playerRef.current.playVideo();
      } catch (error) {
        console.warn('Unable to start video playback:', error);
      }
    }
  };

  useEffect(() => {
    if (showModal && currentTask?.taskType.toLowerCase() === 'youtube' && videoId) {
      initializeYouTubePlayer(videoId);
    }
  }, [showModal, currentTask, videoId]);

  const handleSubmitProof = async () => {
    if (!proofFiles || proofFiles.length === 0 || !currentTask) return;

    if (proofFiles.length > 3) {
      alert('Maximum 3 screenshots allowed');
      return;
    }

    setSubmitting(true);
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('taskId', currentTask._id);
    
    proofFiles.forEach((file, index) => {
      formData.append('proofs', file);
    });

    try {
      const baseUrl = getApiBaseUrl();
      console.log('📤 Submitting proof to:', `${baseUrl}/api/tasks/submit-proof`);
      console.log('📋 Task ID:', currentTask._id, '| Files:', proofFiles.length);
      
      const response = await fetch(`${baseUrl}/api/tasks/submit-proof`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      console.log('📨 Server response status:', response.status);

      if (!response.ok) {
        let errorMessage = 'Failed to submit proof';
        try {
          const errorData = await response.json();
          errorMessage = errorData?.message || errorData?.error || `Server error (${response.status})`;
          console.error('❌ Server error details:', errorData);
        } catch (parseErr) {
          const text = await response.text().catch(() => '');
          if (text) {
            errorMessage = `Server error (${response.status}): ${text.substring(0, 100)}`;
            console.error('❌ Raw error response:', text);
          }
        }
        alert(errorMessage);
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('✅ Proof submission success:', result);
      alert('✅ Proof submitted successfully!');
      setShowModal(false);
      setProofFiles([]);
      fetchCompletedTasks(); // Refresh completed tasks
    } catch (err: any) {
      console.error('❌ Proof submission error:', err.message || err);
      if (!err.message || err.message.includes('fetch')) {
        alert('Network error - please check your connection and try again');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleClaimReward = async () => {
    if (!currentTask) return;

    setSubmitting(true);
    const token = localStorage.getItem('token');

    try {
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/api/tasks/claim-reward`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ taskId: currentTask._id })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to claim reward');
      }

      const data = await response.json();
      alert(`Reward claimed! New balance: RS ${data.newBalance}`);
      setShowModal(false);
      // Refresh tasks
      window.location.reload();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartTask = (task: Task) => {
    setCurrentTask(task);
    setProofFiles([]);
    setVideoEnded(false);
    setVideoError(null);
    setShowModal(true);

    // For YouTube tasks, initialize player; for others, open link
    if (task.taskType.toLowerCase() === 'youtube') {
      const extractedVideoId = extractYouTubeVideoId(task.link);
      setVideoId(extractedVideoId);

      if (extractedVideoId) {
        console.log('Starting YouTube task with video ID:', extractedVideoId);
      } else {
        console.error('Failed to extract video ID from URL:', task.link);
        setVideoError('Invalid YouTube URL - could not extract video ID');
      }
    } else {
      window.open(task.link, '_blank');
    }
  };

  const handleWithdrawSubmit = async () => {
    if (parseInt(withdrawData.amount) < 100) {
      alert('Minimum withdrawal amount is 100 RS');
      return;
    }

    if (parseInt(withdrawData.amount) > taskEarnings) {
      alert('Withdrawal amount cannot exceed available balance');
      return;
    }

    setWithdrawSubmitting(true);
    const token = localStorage.getItem('token');

    try {
      const baseUrl = getApiBaseUrl();
      
      const response = await fetch(`${baseUrl}/api/payment/request-task-withdrawal`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(withdrawData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit withdrawal request');
      }

      alert('Withdrawal request submitted successfully!');
      setShowWithdrawModal(false);
      setWithdrawData({ amount: '', method: '', accountNumber: '', accountHolderName: '' });
      // Refresh earnings
      fetchTaskEarnings();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setWithdrawSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', color: '#fff', textAlign: 'center' }}>
        <h1>Micro Tasks</h1>
        <p>Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px', color: '#fff', textAlign: 'center' }}>
        <h1>Micro Tasks</h1>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', color: '#fff' }}>
      <h1>Micro Tasks</h1>
      
      {/* Task Earnings Balance */}
      <div style={{
        background: '#111',
        padding: '20px',
        borderRadius: '15px',
        border: '1px solid gold',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        <h3 style={{ color: 'gold', margin: '0 0 10px 0' }}>Task Earnings Balance</h3>
        <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff', margin: 0 }}>
          RS {taskEarnings.toLocaleString()}
        </p>
        <p style={{ color: '#ccc', fontSize: '14px', margin: '10px 0 20px 0' }}>
          Minimum withdrawal amount is RS 100. Complete more tasks to increase your balance!
        </p>
        <button
          onClick={() => setShowWithdrawModal(true)}
          disabled={taskEarnings < 100}
          style={{
            background: taskEarnings >= 100 ? 'gold' : '#555',
            color: taskEarnings >= 100 ? 'black' : '#ccc',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: taskEarnings >= 100 ? 'pointer' : 'not-allowed',
            width: '100%'
          }}
        >
          Withdraw Earnings
        </button>
      </div>
      
      {tasks.length === 0 ? (
        <p>No active tasks available.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
          {tasks.map((task) => {
            const progress = Math.round((task.completedQuantity / task.totalQuantity) * 100);
            const isFull = task.completedQuantity >= task.totalQuantity;
            const alreadyCompleted = completedTaskIds.has(task._id);
            const isReferralNotVerified = !referralPaymentVerified;
            
            let buttonLabel = isFull ? 'Task Full' : alreadyCompleted ? 'Already Completed' : 'Start Task';
            let disabledButton = isFull || alreadyCompleted || isReferralNotVerified;
            
            if (isReferralNotVerified && !isFull && !alreadyCompleted) {
              buttonLabel = 'Referral Pending';
            }

            return (
              <div key={task._id} style={{
                background: '#111',
                padding: '20px',
                borderRadius: '15px',
                border: '1px solid gold',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>
                  {getTaskIcon(task.taskType)}
                </div>
                <h3 style={{ margin: '10px 0', color: 'gold' }}>{task.title}</h3>
                <p style={{ margin: '10px 0', fontSize: '18px', fontWeight: 'bold' }}>
                  Reward: RS {task.reward}
                </p>
                <div style={{ margin: '20px 0' }}>
                  <div style={{
                    width: '100%',
                    height: '10px',
                    background: '#333',
                    borderRadius: '5px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${progress}%`,
                      height: '100%',
                      background: 'gold',
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                  <p style={{ marginTop: '5px', fontSize: '12px' }}>
                    {task.completedQuantity}/{task.totalQuantity} ({progress}%)
                  </p>
                </div>
                {isReferralNotVerified && !isFull && !alreadyCompleted && (
                  <p style={{ color: '#ffa500', fontSize: '12px', marginBottom: '10px', padding: '8px', background: '#1a1a1a', borderRadius: '5px' }}>
                    ⏳ Complete 11 referral verification to unlock tasks
                  </p>
                )}
                <button
                  onClick={() => handleStartTask(task)}
                  disabled={disabledButton}
                  style={{
                    background: disabledButton ? '#555' : 'gold',
                    color: disabledButton ? '#ccc' : 'black',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    cursor: disabledButton ? 'not-allowed' : 'pointer',
                    width: '100%'
                  }}
                >
                  {buttonLabel}
                </button>
              </div>
            );
          })}
        </div>
      )}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          overflow: 'auto',
          padding: '20px'
        }}>
          <div style={{
            background: '#111',
            padding: '30px',
            borderRadius: '15px',
            border: '1px solid gold',
            textAlign: 'center',
            maxWidth: currentTask?.taskType.toLowerCase() === 'youtube' ? '800px' : '400px',
            width: '100%'
          }}>
            {/* YOUTUBE TASK */}
            {currentTask?.taskType.toLowerCase() === 'youtube' ? (
              <div>
                {!videoEnded ? (
                  <>
                    <h2 style={{ color: 'gold', marginBottom: '10px' }}>
                      🎥 {currentTask?.title || 'Watch This Video'}
                    </h2>
                    <p style={{ color: '#FFD700', marginBottom: '15px', fontSize: '16px', fontWeight: 'bold' }}>
                      Reward: RS {currentTask?.reward}
                    </p>
                    <p style={{ color: '#ccc', marginBottom: '20px', fontSize: '13px', padding: '8px', background: '#1a1a1a', borderRadius: '8px' }}>
                      {currentTask?.description || 'Watch this video completely and follow the channel'}
                    </p>
                    <div style={{ marginBottom: '20px', padding: '12px', background: '#ff6347', borderRadius: '8px', textAlign: 'center' }}>
                      <p style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold', margin: '0' }}>
                        ⚠️ MUST WATCH ENTIRE VIDEO
                      </p>
                      <p style={{ color: '#fff', fontSize: '12px', margin: '5px 0 0 0' }}>
                        No skip controls - Video must play completely to submit proof
                      </p>
                    </div>
                    <div
                      key={`youtube-player-wrapper-${videoId || 'empty'}`}
                      style={{
                        width: '100%',
                        maxWidth: '600px',
                        margin: '0 auto 20px',
                        border: '2px solid gold',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        backgroundColor: '#000',
                        minHeight: '200px',
                        position: 'relative'
                      }}
                    >
                      <div
                        style={{
                          display: videoEnded ? 'none' : 'block',
                          width: '100%',
                          height: '400px'
                        }}
                      >
                        <div
                          id={playerContainerId}
                          style={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: '#000'
                          }}
                        />
                      </div>

                      {videoError && (
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textAlign: 'center',
                          padding: '20px',
                          color: '#ff6b6b',
                          backgroundColor: 'rgba(0,0,0,0.75)'
                        }}>
                          <div>
                            <div style={{ fontSize: '48px', marginBottom: '10px' }}>⚠️</div>
                            <div style={{ fontSize: '16px', marginBottom: '10px' }}>Video Error</div>
                            <div style={{ fontSize: '14px', color: '#ccc' }}>{videoError}</div>
                            {!videoId && (
                              <div style={{ fontSize: '12px', color: '#888', marginTop: '10px' }}>
                                URL: {currentTask?.link}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {!videoError && !videoId && (
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textAlign: 'center',
                          padding: '20px',
                          color: '#ffa500',
                          backgroundColor: 'rgba(0,0,0,0.75)'
                        }}>
                          <div>
                            <div style={{ fontSize: '48px', marginBottom: '10px' }}>🔍</div>
                            <div style={{ fontSize: '16px', marginBottom: '10px' }}>Extracting Video ID...</div>
                            <div style={{ fontSize: '12px', color: '#888' }}>
                              URL: {currentTask?.link}
                            </div>
                          </div>
                        </div>
                      )}

                      {!videoError && videoId && !videoPlaying && !videoEnded && (
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textAlign: 'center',
                          padding: '20px',
                          color: '#fff',
                          backgroundColor: 'rgba(0,0,0,0.5)'
                        }}>
                          <div>
                            <div style={{ fontSize: '24px', marginBottom: '10px' }}>▶️</div>
                            <div style={{ fontSize: '16px', marginBottom: '10px' }}>Click to play the video</div>
                            <button
                              onClick={playYouTubeVideo}
                              style={{
                                background: 'gold',
                                color: 'black',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                              }}
                            >
                              Play Video
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '20px' }}>
                      ⏸️ Keep this window active and watch the entire video to proceed
                    </p>
                    <button
                      onClick={() => {
                        setShowModal(false);
                        // Safely destroy YouTube player
                        if (playerRef.current) {
                          try {
                            playerRef.current.destroy();
                          } catch (error) {
                            console.warn('Error destroying YouTube player on cancel:', error);
                          }
                          playerRef.current = null;
                        }
                      }}
                      style={{
                        background: '#ff4444',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      Exit
                    </button>
                  </>
                ) : (
                  <div>
                    <h2 style={{ color: 'gold', marginBottom: '10px' }}>
                      ✅ Video Completed!
                    </h2>
                    <p style={{ color: '#FFD700', marginBottom: '15px', fontSize: '16px', fontWeight: 'bold' }}>
                      Reward: RS {currentTask?.reward}
                    </p>
                    <p style={{ color: '#fff', marginBottom: '20px' }}>
                      Great! Now follow the YouTube channel:
                    </p>
                    <button
                      onClick={() => window.open(currentTask.link, '_blank')}
                      style={{
                        background: '#ff0000',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        marginBottom: '20px',
                        fontSize: '16px',
                        width: '100%'
                      }}
                    >
                      🎬 Go to YouTube - Like, Subscribe & Comment
                    </button>
                    <p style={{ color: '#fff', marginBottom: '20px' }}>
                      Upload screenshots showing your engagement:
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        if (files.length < 2) {
                          alert('Please upload at least 2 screenshots');
                          e.target.value = '';
                          setProofFiles([]);
                        } else if (files.length > 3) {
                          alert('Maximum 3 screenshots allowed');
                          e.target.value = '';
                          setProofFiles([]);
                        } else {
                          setProofFiles(files);
                        }
                      }}
                      style={{
                        marginBottom: '20px',
                        padding: '10px',
                        background: '#000',
                        border: '1px solid #333',
                        color: '#fff',
                        borderRadius: '5px',
                        width: '100%',
                        cursor: 'pointer'
                      }}
                    />
                    {proofFiles.length > 0 && (
                      <div style={{ marginBottom: '20px' }}>
                        <p style={{ color: '#ccc', fontSize: '14px', marginBottom: '10px' }}>
                          📸 {proofFiles.length} screenshot{proofFiles.length > 1 ? 's' : ''} selected
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '10px' }}>
                          {Array.from(proofFiles).map((file, index) => (
                            <div key={index} style={{
                              width: '100%',
                              height: '80px',
                              background: '#000',
                              border: '1px solid gold',
                              borderRadius: '5px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#666',
                              fontSize: '12px',
                              overflow: 'hidden'
                            }}>
                              <img 
                                src={URL.createObjectURL(file)} 
                                alt={`Preview ${index + 1}`}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover'
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                      <button
                        onClick={handleSubmitProof}
                        disabled={proofFiles.length < 2 || submitting || !videoEnded}
                        style={{
                          background: (proofFiles.length >= 2 && videoEnded) ? 'gold' : '#666',
                          color: (proofFiles.length >= 2 && videoEnded) ? 'black' : '#999',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '8px',
                          fontWeight: 'bold',
                          cursor: (proofFiles.length >= 2 && videoEnded && !submitting) ? 'pointer' : 'not-allowed',
                          flex: 1,
                          maxWidth: '200px'
                        }}
                      >
                        {submitting ? 'Submitting...' : !videoEnded ? '⏳ Watch video first' : '✅ Submit Proof'}
                      </button>
                      <button
                        onClick={() => {
                          setShowModal(false);
                          // Safely destroy YouTube player
                          if (playerRef.current) {
                            try {
                              playerRef.current.destroy();
                            } catch (error) {
                              console.warn('Error destroying YouTube player on cancel:', error);
                            }
                            playerRef.current = null;
                          }
                        }}
                        style={{
                          background: '#666',
                          color: 'white',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          flex: 1,
                          maxWidth: '200px'
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* NON-YOUTUBE TASKS */
              <>
                <h2 style={{ color: 'gold', marginBottom: '10px' }}>
                  📋 {currentTask?.title || 'Task'}
                </h2>
                <p style={{ color: '#FFD700', marginBottom: '15px', fontSize: '18px', fontWeight: 'bold' }}>
                  Reward: RS {currentTask?.reward}
                </p>
                <p style={{ color: '#ccc', marginBottom: '20px', fontSize: '14px', padding: '10px', background: '#1a1a1a', borderRadius: '8px', minHeight: '40px' }}>
                  {currentTask?.description || 'Complete this task and submit proof'}
                </p>
                <p style={{ color: '#fff', marginBottom: '20px' }}>
                  Your task link has been opened in a new tab. Submit proof or claim reward below after completion.
                </p>
                
                {/* VIDEO REVIEW TASK - VIDEO UPLOAD */}
                {currentTask?.taskType?.toLowerCase() === 'video review' ? (
                  <>
                    <p style={{ color: '#fff', marginBottom: '20px' }}>
                      📹 Upload your video proof (max 500MB):
                    </p>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) {
                          setProofFiles([]);
                          return;
                        }
                        
                        const maxSize = 500 * 1024 * 1024; // 500MB
                        if (file.size > maxSize) {
                          alert('Video file is too large. Maximum size: 500MB');
                          e.target.value = '';
                          setProofFiles([]);
                          return;
                        }
                        
                        setProofFiles([file]);
                      }}
                      style={{
                        marginBottom: '20px',
                        padding: '10px',
                        background: '#000',
                        border: '2px solid #FFD700',
                        color: '#fff',
                        borderRadius: '5px',
                        width: '100%',
                        cursor: 'pointer'
                      }}
                    />
                    {proofFiles.length > 0 && (
                      <div style={{ marginBottom: '20px', padding: '15px', background: '#1a1a1a', borderRadius: '8px', border: '1px solid #FFD700' }}>
                        <p style={{ color: '#32CD32', fontSize: '14px', margin: '0 0 10px 0', fontWeight: 'bold' }}>
                          ✅ Video selected: {(proofFiles[0].size / (1024 * 1024)).toFixed(2)}MB
                        </p>
                        <video 
                          src={URL.createObjectURL(proofFiles[0])} 
                          style={{
                            width: '100%',
                            maxHeight: '300px',
                            borderRadius: '5px',
                            background: '#000'
                          }}
                          controls
                        />
                      </div>
                    )}
                    <div>
                      <button
                        onClick={handleSubmitProof}
                        disabled={proofFiles.length === 0 || submitting}
                        style={{
                          background: proofFiles.length > 0 ? 'gold' : '#666',
                          color: proofFiles.length > 0 ? 'black' : '#999',
                          border: 'none',
                          padding: '12px 24px',
                          borderRadius: '8px',
                          fontWeight: 'bold',
                          cursor: proofFiles.length > 0 && !submitting ? 'pointer' : 'not-allowed',
                          marginBottom: '10px',
                          width: '100%'
                        }}
                      >
                        {submitting ? '⏳ Uploading...' : '🎬 Upload Video & Claim Reward'}
                      </button>
                      <button
                        onClick={() => {
                          setShowModal(false);
                          setProofFiles([]);
                        }}
                        style={{
                          background: '#666',
                          color: 'white',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          width: '100%'
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  /* NON-VIDEO TASKS - Check if proof required */
                  <>
                    {currentTask?.requiresProof ? (
                      /* SCREENSHOT TASKS */
                      <>
                    <p style={{ color: '#fff', marginBottom: '20px' }}>
                      Submit up to 3 screenshots as proof to claim your reward.
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        if (files.length > 3) {
                          alert('Maximum 3 screenshots allowed');
                          e.target.value = '';
                          setProofFiles([]);
                        } else {
                          setProofFiles(files);
                        }
                      }}
                      style={{
                        marginBottom: '20px',
                        padding: '10px',
                        background: '#000',
                        border: '1px solid #333',
                        color: '#fff',
                        borderRadius: '5px',
                        width: '100%'
                      }}
                    />
                    {proofFiles.length > 0 && (
                      <p style={{ color: '#ccc', fontSize: '14px', marginBottom: '20px' }}>
                        {proofFiles.length} file{proofFiles.length > 1 ? 's' : ''} selected
                      </p>
                    )}
                    <div>
                      <button
                        onClick={handleSubmitProof}
                        disabled={proofFiles.length === 0 || submitting}
                        style={{
                          background: 'gold',
                          color: 'black',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '8px',
                          fontWeight: 'bold',
                          cursor: proofFiles.length > 0 && !submitting ? 'pointer' : 'not-allowed',
                          marginRight: '10px'
                        }}
                      >
                        {submitting ? 'Submitting...' : 'Submit Proof'}
                      </button>
                      <button
                        onClick={() => setShowModal(false)}
                        style={{
                          background: '#666',
                          color: 'white',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '8px',
                          cursor: 'pointer'
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                  ) : (
                    /* NO PROOF REQUIRED - Direct claim button */
                    <div>
                      <button
                        onClick={handleClaimReward}
                        disabled={submitting}
                        style={{
                          background: 'gold',
                          color: 'black',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '8px',
                          fontWeight: 'bold',
                          cursor: submitting ? 'not-allowed' : 'pointer',
                          marginRight: '10px'
                        }}
                      >
                        {submitting ? 'Claiming...' : 'Claim Reward'}
                      </button>
                      <button
                        onClick={() => setShowModal(false)}
                        style={{
                          background: '#666',
                          color: 'white',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '8px',
                          cursor: 'pointer'
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                    </>
                )}
              </>
            )}
          </div>
        </div>
      )}
      {showWithdrawModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: '#111',
            padding: '30px',
            borderRadius: '15px',
            border: '1px solid gold',
            textAlign: 'center',
            maxWidth: '400px',
            width: '100%'
          }}>
            <h2 style={{ color: 'gold', marginBottom: '20px' }}>Withdraw Task Earnings</h2>
            <p style={{ color: '#ccc', marginBottom: '20px' }}>Available Balance: RS {taskEarnings.toLocaleString()}</p>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ color: '#fff', display: 'block', marginBottom: '5px' }}>Withdraw Amount (Min: 100)</label>
              <input
                type="number"
                min="100"
                max={taskEarnings}
                value={withdrawData.amount}
                onChange={(e) => setWithdrawData({...withdrawData, amount: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: '#000',
                  border: '1px solid #333',
                  color: '#fff',
                  borderRadius: '5px'
                }}
                placeholder="Enter amount"
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ color: '#fff', display: 'block', marginBottom: '5px' }}>Payment Method</label>
              <select
                value={withdrawData.method}
                onChange={(e) => setWithdrawData({...withdrawData, method: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: '#000',
                  border: '1px solid #333',
                  color: '#fff',
                  borderRadius: '5px'
                }}
              >
                <option value="">Select Method</option>
                <option value="JazzCash">JazzCash</option>
                <option value="EasyPaisa">EasyPaisa</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ color: '#fff', display: 'block', marginBottom: '5px' }}>Account Number</label>
              <input
                type="text"
                value={withdrawData.accountNumber}
                onChange={(e) => setWithdrawData({...withdrawData, accountNumber: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: '#000',
                  border: '1px solid #333',
                  color: '#fff',
                  borderRadius: '5px'
                }}
                placeholder="Enter account number"
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#fff', display: 'block', marginBottom: '5px' }}>Account Holder Name</label>
              <input
                type="text"
                value={withdrawData.accountHolderName}
                onChange={(e) => setWithdrawData({...withdrawData, accountHolderName: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: '#000',
                  border: '1px solid #333',
                  color: '#fff',
                  borderRadius: '5px'
                }}
                placeholder="Enter account holder name"
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleWithdrawSubmit}
                disabled={withdrawSubmitting || !withdrawData.amount || parseInt(withdrawData.amount) < 100 || !withdrawData.method || !withdrawData.accountNumber || !withdrawData.accountHolderName}
                style={{
                  background: 'gold',
                  color: 'black',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  flex: 1
                }}
              >
                {withdrawSubmitting ? 'Submitting...' : 'Submit Withdrawal'}
              </button>
              <button
                onClick={() => setShowWithdrawModal(false)}
                style={{
                  background: '#666',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  flex: 1
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// YouTube API Type Declarations
declare global {
  interface Window {
    YT: {
      Player: any;
      PlayerState: {
        UNSTARTED: number;
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface YTOnStateChangeEvent {
  data: number;
}

export default MicroTasks;
