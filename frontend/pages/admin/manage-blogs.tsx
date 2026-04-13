import React, { useState, useEffect, useRef } from 'react';
import { getApiBaseUrl } from '../../utils/api';

interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  thumbnail: string;
  author: string;
  createdAt: string;
}

const ManageBlogs: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('Million Hub');
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [blogsLoading, setBlogsLoading] = useState(true);
  const [blogsError, setBlogsError] = useState<string | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    setBlogsLoading(true);
    setBlogsError(null);
    const token = localStorage.getItem('token');
    if (!token) {
      setBlogsError('Admin authentication required');
      setBlogsLoading(false);
      return;
    }

    try {
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/api/blogs/admin/all`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBlogs(data.blogs || []);
      } else {
        setBlogsError('Failed to load blogs');
      }
    } catch (error) {
      console.error('Failed to load blogs:', error);
      setBlogsError('Failed to load blogs');
    } finally {
      setBlogsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditBlog = (blog: Blog) => {
    setEditingBlog(blog);
    setTitle(blog.title);
    setContent(blog.content);
    setAuthor(blog.author);
    setThumbnailPreview(blog.thumbnail);
    setThumbnail(null);
  };

  const handleCancelEdit = () => {
    setEditingBlog(null);
    setTitle('');
    setContent('');
    setAuthor('Million Hub');
    setThumbnail(null);
    setThumbnailPreview('');
    setMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setMessage('Blog title is required');
      return;
    }
    
    if (!content.trim()) {
      setMessage('Blog content is required');
      return;
    }

    if (!editingBlog && !thumbnail) {
      setMessage('Thumbnail is required for new blogs');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Authentication required');
        return;
      }

      const baseUrl = getApiBaseUrl();
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('author', author);
      if (thumbnail) {
        formData.append('thumbnail', thumbnail);
      }

      const endpoint = editingBlog
        ? `${baseUrl}/api/blogs/${editingBlog._id}`
        : `${baseUrl}/api/blogs/create`;

      const method = editingBlog ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(editingBlog ? 'Blog updated successfully!' : 'Blog created successfully!');
        handleCancelEdit();
        loadBlogs();
      } else {
        setMessage(data.error || 'Failed to save blog');
      }
    } catch (error) {
      console.error('Error saving blog:', error);
      setMessage('Error saving blog');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBlog = async (blogId: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/api/blogs/${blogId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setMessage('Blog deleted successfully!');
        loadBlogs();
      } else {
        const data = await response.json();
        setMessage(data.error || 'Failed to delete blog');
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      setMessage('Error deleting blog');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      padding: '40px 20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          color: '#FFD700',
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          📝 Manage Blogs
        </h1>

        {/* Form Section */}
        <div style={{
          background: 'rgba(255, 215, 0, 0.05)',
          border: '2px solid rgba(255, 215, 0, 0.3)',
          borderRadius: '16px',
          padding: '30px',
          marginBottom: '40px'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            color: '#FFD700',
            marginBottom: '20px'
          }}>
            {editingBlog ? '✏️ Edit Blog' : '➕ Create New Blog'}
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Title Input */}
            <div>
              <label style={{ display: 'block', color: '#FFD700', marginBottom: '8px', fontWeight: '600' }}>
                Blog Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter blog title (3-200 characters)"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: '#FFF',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Author Input */}
            <div>
              <label style={{ display: 'block', color: '#FFD700', marginBottom: '8px', fontWeight: '600' }}>
                Author Name
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Enter author name"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: '#FFF',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Content Textarea */}
            <div>
              <label style={{ display: 'block', color: '#FFD700', marginBottom: '8px', fontWeight: '600' }}>
                Blog Content *
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter blog content (supports HTML)"
                style={{
                  width: '100%',
                  minHeight: '300px',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: '#FFF',
                  fontSize: '1rem',
                  fontFamily: 'Arial, sans-serif',
                  boxSizing: 'border-box',
                  resize: 'vertical'
                }}
              />
              <small style={{ color: '#CCC', marginTop: '5px', display: 'block' }}>
                📝 You can use HTML tags for formatting (e.g., &lt;strong&gt;, &lt;em&gt;, &lt;p&gt;, &lt;ul&gt;, etc.)
              </small>
            </div>

            {/* Thumbnail Upload */}
            <div>
              <label style={{ display: 'block', color: '#FFD700', marginBottom: '8px', fontWeight: '600' }}>
                Blog Thumbnail {!editingBlog && '*'}
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{
                  display: 'block',
                  marginBottom: '10px',
                  color: '#FFF'
                }}
              />
              {thumbnailPreview && (
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  style={{
                    maxWidth: '200px',
                    maxHeight: '200px',
                    borderRadius: '8px',
                    marginTop: '10px',
                    border: '1px solid rgba(255, 215, 0, 0.3)'
                  }}
                />
              )}
            </div>

            {/* Message Display */}
            {message && (
              <div style={{
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: message.includes('successfully') ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)',
                color: message.includes('successfully') ? '#4CAF50' : '#F44336',
                border: `1px solid ${message.includes('successfully') ? '#4CAF50' : '#F44336'}`
              }}>
                {message}
              </div>
            )}

            {/* Submit Buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  backgroundColor: loading ? '#888' : '#FFD700',
                  color: '#000',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.3s'
                }}
              >
                {loading ? '⏳ Saving...' : editingBlog ? '💾 Update Blog' : '✅ Create Blog'}
              </button>
              {editingBlog && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  style={{
                    flex: 1,
                    padding: '12px 20px',
                    backgroundColor: 'rgba(255, 215, 0, 0.2)',
                    color: '#FFD700',
                    border: '2px solid #FFD700',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                >
                  ❌ Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Blogs List Section */}
        <div>
          <h2 style={{
            fontSize: '1.5rem',
            color: '#FFD700',
            marginBottom: '20px'
          }}>
            📚 Existing Blogs ({blogs.length})
          </h2>

          {blogsLoading ? (
            <div style={{ textAlign: 'center', color: '#CCC', padding: '40px 20px' }}>
              ⏳ Loading blogs...
            </div>
          ) : blogsError ? (
            <div style={{
              backgroundColor: 'rgba(244, 67, 54, 0.2)',
              color: '#F44336',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #F44336',
              textAlign: 'center'
            }}>
              {blogsError}
            </div>
          ) : blogs.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#CCC', padding: '40px 20px' }}>
              No blogs yet. Create your first blog above!
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px'
            }}>
              {blogs.map((blog) => (
                <article key={blog._id} style={{
                  background: 'rgba(255, 215, 0, 0.05)',
                  border: '1px solid rgba(255, 215, 0, 0.2)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  transition: 'all 0.3s'
                }}>
                  {/* Blog Thumbnail */}
                  <img
                    src={blog.thumbnail}
                    alt={blog.title}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover'
                    }}
                  />

                  {/* Blog Info */}
                  <div style={{ padding: '15px' }}>
                    <h3 style={{
                      color: '#FFD700',
                      fontSize: '1.1rem',
                      margin: '0 0 8px 0',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {blog.title}
                    </h3>

                    <p style={{
                      color: '#CCC',
                      fontSize: '0.85rem',
                      margin: '5px 0',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {blog.content.replace(/<[^>]*>/g, '')}
                    </p>

                    <div style={{ fontSize: '0.8rem', color: '#AAA', margin: '10px 0' }}>
                      By {blog.author} | {new Date(blog.createdAt).toLocaleDateString()}
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                      <button
                        onClick={() => handleEditBlog(blog)}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          backgroundColor: 'rgba(255, 215, 0, 0.2)',
                          color: '#FFD700',
                          border: '1px solid #FFD700',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.9rem'
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteBlog(blog._id)}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          backgroundColor: 'rgba(244, 67, 54, 0.2)',
                          color: '#F44336',
                          border: '1px solid #F44336',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.9rem'
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageBlogs;
