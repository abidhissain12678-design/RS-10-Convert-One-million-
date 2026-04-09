import React, { useState, useEffect } from 'react';

interface Task {
  _id: string;
  taskType: string;
  title: string;
  description: string;
  link: string;
  reward: string;
  totalQuantity: number;
  completedQuantity: number;
  active: boolean;
  requiresProof: boolean;
  imageUrl: string;
  createdAt: string;
}

const taskTypes = ['YouTube', 'Facebook', 'Instagram', 'TikTok', 'Twitter', 'WhatsApp', 'Website', 'Other'];

const CustomizeTasks: React.FC = () => {
  const [taskType, setTaskType] = useState('YouTube');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [reward, setReward] = useState('');
  const [totalQuantity, setTotalQuantity] = useState(1);
  const [active, setActive] = useState(true);
  const [requiresProof, setRequiresProof] = useState(true);
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [tasksError, setTasksError] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setTasksLoading(true);
    setTasksError(null);
    const token = localStorage.getItem('token');
    if (!token) {
      setTasksError('Admin authentication required');
      setTasksLoading(false);
      return;
    }

    try {
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://rs-10-convert-one-million.onrender.com' 
        : 'http://localhost:5000';
      
      const response = await fetch(`${baseUrl}/api/tasks/all`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        setTasksError('Failed to load tasks');
      }
    } catch (error) {
      console.error('Failed to load tasks:', error);
      setTasksError('Failed to load tasks');
    } finally {
      setTasksLoading(false);
    }
  };

  const retryLoadTasks = () => {
    loadTasks();
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setTaskType(task.taskType);
    setTitle(task.title);
    setDescription(task.description);
    setLink(task.link);
    setReward(task.reward);
    setTotalQuantity(task.totalQuantity);
    setActive(task.active);
    setRequiresProof(task.requiresProof);
    setImageUrl(task.imageUrl);
    setImagePreview(task.imageUrl);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://rs-10-convert-one-million.onrender.com' 
        : 'http://localhost:5000';
      
      const response = await fetch(`${baseUrl}/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setMessage('Task deleted successfully.');
        loadTasks();
      } else {
        setMessage('Failed to delete task.');
      }
    } catch (error) {
      setMessage('An error occurred while deleting the task.');
    }
  };

  const resetForm = () => {
    setEditingTask(null);
    setTaskType('YouTube');
    setTitle('');
    setDescription('');
    setLink('');
    setReward('');
    setTotalQuantity(1);
    setActive(true);
    setRequiresProof(true);
    setImageUrl('');
    setImagePreview('');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setImagePreview('');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImagePreview(reader.result);
        setImageUrl('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');

    if (!title.trim() || !description.trim() || !link.trim() || !reward.trim() || !totalQuantity) {
      setMessage('Please complete all required fields before submitting.');
      return;
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      setMessage('Admin authentication required. Please log in first.');
      return;
    }

    setLoading(true);
    try {
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://rs-10-convert-one-million.onrender.com' 
        : 'http://localhost:5000';
      
      const url = editingTask 
        ? `${baseUrl}/api/tasks/${editingTask._id}`
        : `${baseUrl}/api/admin/create-task`;
      
      const method = editingTask ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          taskType,
          title,
          description,
          link,
          reward,
          totalQuantity,
          active,
          requiresProof,
          imageUrl: imagePreview || imageUrl
        })
      });
      const result = await response.json();
      if (!response.ok) {
        setMessage(result.error || 'Failed to save task.');
      } else {
        setMessage(editingTask ? 'Task updated successfully.' : 'Task saved successfully.');
        resetForm();
        loadTasks();
      }
    } catch (error) {
      setMessage('An error occurred while saving the task.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#04060f', padding: '40px 20px', color: '#fff', fontFamily: 'Segoe UI, sans-serif' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', background: '#081126', border: '1px solid rgba(255,215,0,0.18)', borderRadius: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.45)', overflow: 'hidden' }}>
        <div style={{ padding: '32px', background: 'linear-gradient(135deg, rgba(255,215,0,0.12), rgba(40, 40, 60, 0.95))', borderBottom: '1px solid rgba(255,215,0,0.12)' }}>
          <h1 style={{ margin: 0, fontSize: '2rem', letterSpacing: '0.5px', color: '#FFD700' }}>
            {editingTask ? 'Edit Task' : 'Customize Tasks'}
          </h1>
          <p style={{ margin: '8px 0 0', color: '#cfd8ff', maxWidth: '720px', lineHeight: 1.6 }}>Create new micro-task campaigns that appear in the dashboard. Add type, title, reward, quantity, and optional image metadata for each task.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '30px', display: 'grid', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <label style={{ display: 'flex', flexDirection: 'column', fontSize: '14px', color: '#ccc' }}>
              Task Type
              <select value={taskType} onChange={(e) => setTaskType(e.target.value)} style={{ marginTop: '8px', padding: '12px 14px', borderRadius: '12px', border: '1px solid #2e3a61', background: '#10172c', color: '#fff' }}>
                {taskTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', fontSize: '14px', color: '#ccc' }}>
              Title
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" style={{ marginTop: '8px', padding: '12px 14px', borderRadius: '12px', border: '1px solid #2e3a61', background: '#10172c', color: '#fff' }} />
            </label>
          </div>

          <label style={{ display: 'flex', flexDirection: 'column', fontSize: '14px', color: '#ccc' }}>
            Description
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter the task description" rows={5} style={{ marginTop: '8px', padding: '14px', borderRadius: '16px', border: '1px solid #2e3a61', background: '#10172c', color: '#fff', resize: 'vertical' }} />
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <label style={{ display: 'flex', flexDirection: 'column', fontSize: '14px', color: '#ccc' }}>
              Link
              <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://" style={{ marginTop: '8px', padding: '12px 14px', borderRadius: '12px', border: '1px solid #2e3a61', background: '#10172c', color: '#fff' }} />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', fontSize: '14px', color: '#ccc' }}>
              Reward
              <input value={reward} onChange={(e) => setReward(e.target.value)} placeholder="e.g. 50 coins" style={{ marginTop: '8px', padding: '12px 14px', borderRadius: '12px', border: '1px solid #2e3a61', background: '#10172c', color: '#fff' }} />
            </label>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'flex-end' }}>
            <label style={{ display: 'flex', flexDirection: 'column', fontSize: '14px', color: '#ccc' }}>
              Total Quantity
              <input type="number" min={1} value={totalQuantity} onChange={(e) => setTotalQuantity(Number(e.target.value))} style={{ marginTop: '8px', padding: '12px 14px', borderRadius: '12px', border: '1px solid #2e3a61', background: '#10172c', color: '#fff' }} />
            </label>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', borderRadius: '12px', border: '1px solid #2e3a61', background: '#10172c' }}>
              <div>
                <div style={{ fontSize: '14px', color: '#ccc', marginBottom: '6px' }}>Status</div>
                <div style={{ color: active ? '#9ef55d' : '#f57c7c', fontWeight: 700 }}>{active ? 'Active' : 'Disabled'}</div>
              </div>
              <label style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                <input type="checkbox" checked={active} onChange={() => setActive(!active)} style={{ opacity: 0, width: 0, height: 0 }} />
                <span style={{ width: '46px', height: '26px', background: active ? '#5a9b4f' : '#444', borderRadius: '999px', position: 'relative', transition: 'background 0.2s ease' }}>
                  <span style={{ position: 'absolute', top: '3px', left: active ? '22px' : '3px', width: '20px', height: '20px', borderRadius: '50%', background: '#fff', transition: 'left 0.2s ease' }} />
                </span>
              </label>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', borderRadius: '12px', border: '1px solid #2e3a61', background: '#10172c' }}>
              <div>
                <div style={{ fontSize: '14px', color: '#ccc', marginBottom: '6px' }}>Requires Proof</div>
                <div style={{ color: requiresProof ? '#9ef55d' : '#f57c7c', fontWeight: 700 }}>{requiresProof ? 'Yes' : 'No'}</div>
              </div>
              <label style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                <input type="checkbox" checked={requiresProof} onChange={() => setRequiresProof(!requiresProof)} style={{ opacity: 0, width: 0, height: 0 }} />
                <span style={{ width: '46px', height: '26px', background: requiresProof ? '#5a9b4f' : '#444', borderRadius: '999px', position: 'relative', transition: 'background 0.2s ease' }}>
                  <span style={{ position: 'absolute', top: '3px', left: requiresProof ? '22px' : '3px', width: '20px', height: '20px', borderRadius: '50%', background: '#fff', transition: 'left 0.2s ease' }} />
                </span>
              </label>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <label style={{ display: 'flex', flexDirection: 'column', fontSize: '14px', color: '#ccc' }}>
              Image URL
              <input value={imageUrl} onChange={(e) => { setImageUrl(e.target.value); setImagePreview(''); }} placeholder="Paste image URL" style={{ marginTop: '8px', padding: '12px 14px', borderRadius: '12px', border: '1px solid #2e3a61', background: '#10172c', color: '#fff' }} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', fontSize: '14px', color: '#ccc' }}>
              Upload Image
              <input type="file" accept="image/*" onChange={handleFileUpload} style={{ marginTop: '8px', color: '#fff' }} />
            </label>
          </div>

          {imagePreview ? (
            <div style={{ borderRadius: '18px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
              <img src={imagePreview} alt="Task preview" style={{ width: '100%', objectFit: 'cover', maxHeight: '320px' }} />
            </div>
          ) : null}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" disabled={loading} style={{ background: '#FFD700', color: '#111', border: 'none', padding: '14px 28px', borderRadius: '14px', fontWeight: 700, cursor: 'pointer', minWidth: '180px' }}>
                {loading ? 'Saving...' : editingTask ? 'Update Task' : 'Save Task'}
              </button>
              {editingTask && (
                <button 
                  type="button" 
                  onClick={resetForm}
                  style={{ background: '#666', color: '#fff', border: 'none', padding: '14px 28px', borderRadius: '14px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
              )}
            </div>
            <div style={{ flex: 1, minWidth: '180px', color: message.startsWith('Task saved') || message.startsWith('Task updated') ? '#9ef55d' : '#ff9b9b', fontSize: '14px' }}>
              {message}
            </div>
          </div>
        </form>

        {/* Task History Section */}
        <div style={{ marginTop: '40px', padding: '30px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px' }}>
          <h2 style={{ color: '#FFD700', marginBottom: '20px', fontSize: '1.5rem' }}>Task History</h2>
          
          {tasksLoading ? (
            <div style={{textAlign: 'center', padding: '40px', color: '#FFD700'}}>
              <div style={{fontSize: '20px', marginBottom: '10px'}}>⏳</div>
              <div>Loading tasks...</div>
            </div>
          ) : tasksError ? (
            <div style={{textAlign: 'center', padding: '40px', color: '#FF6347'}}>
              <div style={{fontSize: '20px', marginBottom: '10px'}}>❌</div>
              <div>{tasksError}</div>
              <button onClick={retryLoadTasks} style={{background: '#FFD700', color: '#111', border: 'none', padding: '10px 20px', borderRadius: '8px', marginTop: '15px', cursor: 'pointer'}}>Retry</button>
            </div>
          ) : tasks.length === 0 ? (
            <p style={{ color: '#888', textAlign: 'center', padding: '40px' }}>No tasks created yet.</p>
          ) : (
            <div style={{ display: 'grid', gap: '15px' }}>
              {tasks.map((task) => (
                <div key={task._id} style={{
                  background: 'rgba(255,255,255,0.05)',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '15px'
                }}>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <h3 style={{ color: '#FFD700', margin: '0 0 8px 0', fontSize: '1.1rem' }}>{task.title}</h3>
                    <p style={{ color: '#ccc', margin: '0 0 8px 0', fontSize: '0.9rem' }}>{task.taskType} • RS {task.reward}</p>
                    <p style={{ color: '#888', margin: 0, fontSize: '0.8rem' }}>
                      Completed: {task.completedQuantity}/{task.totalQuantity} • 
                      Status: <span style={{ color: task.active ? '#9ef55d' : '#f57c7c' }}>
                        {task.active ? 'Active' : 'Disabled'}
                      </span> • 
                      Proof: <span style={{ color: task.requiresProof ? '#FFD700' : '#888' }}>
                        {task.requiresProof ? 'Required' : 'Not Required'}
                      </span>
                    </p>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => handleEditTask(task)}
                      style={{
                        background: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      style={{
                        background: '#f44336',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomizeTasks;
