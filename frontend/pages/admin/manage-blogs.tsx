import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { getApiBaseUrl } from '../../utils/api';

// Dynamically import React-Quill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  thumbnail: string;
  author: string;
  status: 'draft' | 'published';
  metaDescription: string;
  focusKeywords: string[];
  wordCount: number;
  readingTime: number;
  excerpt: string;
  createdAt: string;
  publishedAt?: string;
}

// Quill modules configuration
const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link', 'image'],
    ['clean']
  ],
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'blockquote', 'code-block',
  'list', 'bullet',
  'link', 'image'
];

const ManageBlogs: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('Million Hub');
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [metaDescription, setMetaDescription] = useState('');
  const [focusKeywords, setFocusKeywords] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [loading, setLoading] = useState(false);
  const [blogsLoading, setBlogsLoading] = useState(true);
  const [blogsError, setBlogsError] = useState<string | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadBlogs();
  }, []);

  // Calculate word count and reading time when content changes
  useEffect(() => {
    const stripHtml = (html: string) => html.replace(/<[^>]*>/g, '');
    const plainText = stripHtml(content);
    const words = plainText.trim().split(/\s+/).filter(w => w.length > 0).length;
    setWordCount(words);
    setReadingTime(Math.max(1, Math.ceil(words / 200)));
  }, [content]);

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
    setStatus(blog.status);
    setMetaDescription(blog.metaDescription);
    setFocusKeywords(blog.focusKeywords.join(', '));
    setThumbnailPreview(blog.thumbnail);
    setThumbnail(null);
    setMessage('');
  };

  const handleCancelEdit = () => {
    setEditingBlog(null);
    setTitle('');
    setContent('');
    setAuthor('Million Hub');
    setThumbnail(null);
    setThumbnailPreview('');
    setStatus('draft');
    setMetaDescription('');
    setFocusKeywords('');
    setMessage('');
  };

  const showMessage = (msg: string, type: 'success' | 'error' = 'success') => {
    setMessage(msg);
    setMessageType(type);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      showMessage('Blog title is required', 'error');
      return;
    }
    
    if (!content.trim()) {
      showMessage('Blog content is required', 'error');
      return;
    }

    if (!editingBlog && !thumbnail) {
      showMessage('Thumbnail is required for new blogs', 'error');
      return;
    }

    if (metaDescription.length > 160) {
      showMessage('Meta description must be 160 characters or less', 'error');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showMessage('Authentication required', 'error');
        return;
      }

      const baseUrl = getApiBaseUrl();
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('author', author);
      formData.append('status', status);
      formData.append('metaDescription', metaDescription);
      formData.append('focusKeywords', focusKeywords);
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
        showMessage(editingBlog ? '✅ Blog updated successfully!' : '✅ Blog created successfully!', 'success');
        handleCancelEdit();
        loadBlogs();
      } else {
        showMessage(data.error || 'Failed to save blog', 'error');
      }
    } catch (error) {
      console.error('Error saving blog:', error);
      showMessage('Error saving blog', 'error');
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
        showMessage('✅ Blog deleted successfully!', 'success');
        loadBlogs();
      } else {
        const data = await response.json();
        showMessage(data.error || 'Failed to delete blog', 'error');
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      showMessage('Error deleting blog', 'error');
    }
  };

  const handleTogglePublish = async (blog: Blog) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/api/blogs/${blog._id}/toggle-publish`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ publish: blog.status === 'draft' })
      });

      if (response.ok) {
        showMessage(`✅ Blog ${blog.status === 'draft' ? 'published' : 'unpublished'} successfully!`, 'success');
        loadBlogs();
      } else {
        const data = await response.json();
        showMessage(data.error || 'Failed to toggle publish status', 'error');
      }
    } catch (error) {
      console.error('Error toggling publish:', error);
      showMessage('Error toggling publish status', 'error');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      padding: '40px 20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          color: '#FFD700',
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          📝 WordPress-Style Blog Management
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
                placeholder="Enter blog title"
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

            {/* Rich Text Editor */}
            <div>
              <label style={{ display: 'block', color: '#FFD700', marginBottom: '8px', fontWeight: '600' }}>
                Blog Content * (Rich Text Editor)
              </label>
              <div style={{
                backgroundColor: '#FFF',
                borderRadius: '8px',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                overflow: 'hidden'
              }}>
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={modules}
                  formats={formats}
                  style={{ minHeight: '300px' }}
                />
              </div>
              <small style={{ color: '#AAA', marginTop: '8px', display: 'block' }}>
                📊 Word Count: {wordCount} | ⏱️ Reading Time: {readingTime} min{readingTime !== 1 ? 's' : ''}
              </small>
            </div>

            {/* Meta Description */}
            <div>
              <label style={{ display: 'block', color: '#FFD700', marginBottom: '8px', fontWeight: '600' }}>
                SEO Meta Description (Max 160 characters)
              </label>
              <textarea
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value.substring(0, 160))}
                placeholder="Write a compelling meta description for search engines"
                style={{
                  width: '100%',
                  minHeight: '80px',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: '#FFF',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                  fontFamily: 'Arial, sans-serif'
                }}
              />
              <small style={{ color: '#AAA', marginTop: '5px', display: 'block' }}>
                {metaDescription.length}/160 characters
              </small>
            </div>

            {/* Focus Keywords */}
            <div>
              <label style={{ display: 'block', color: '#FFD700', marginBottom: '8px', fontWeight: '600' }}>
                Focus Keywords (comma-separated)
              </label>
              <input
                type="text"
                value={focusKeywords}
                onChange={(e) => setFocusKeywords(e.target.value)}
                placeholder="e.g., million hub, earning online, financial freedom"
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
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    style={{
                      maxWidth: '300px',
                      maxHeight: '200px',
                      borderRadius: '8px',
                      marginTop: '10px',
                      border: '2px solid rgba(255, 215, 0, 0.5)'
                    }}
                  />
                  <small style={{ color: '#AAA', display: 'block', marginTop: '5px' }}>
                    Preview - Image will be optimized by Cloudinary
                  </small>
                </div>
              )}
            </div>

            {/* Status Toggle */}
            <div>
              <label style={{ display: 'block', color: '#FFD700', marginBottom: '8px', fontWeight: '600' }}>
                Publication Status
              </label>
              <div style={{ display: 'flex', gap: '15px' }}>
                {(['draft', 'published'] as const).map((s) => (
                  <label key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#FFF' }}>
                    <input
                      type="radio"
                      name="status"
                      value={s}
                      checked={status === s}
                      onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                    />
                    {s === 'draft' ? '📋 Save as Draft' : '📈 Publish Now'}
                  </label>
                ))}
              </div>
            </div>

            {/* Message Display */}
            {message && (
              <div style={{
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: messageType === 'success' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)',
                color: messageType === 'success' ? '#4CAF50' : '#F44336',
                border: `1px solid ${messageType === 'success' ? '#4CAF50' : '#F44336'}`
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
            📚 All Blogs ({blogs.length})
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
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '20px'
            }}>
              {blogs.map((blog) => (
                <article key={blog._id} style={{
                  background: 'rgba(255, 215, 0, 0.05)',
                  border: `2px solid ${blog.status === 'published' ? '#4CAF50' : '#FFA500'}`,
                  borderRadius: '12px',
                  overflow: 'hidden',
                  transition: 'all 0.3s'
                }}>
                  {/* Blog Thumbnail */}
                  <div style={{ position: 'relative' }}>
                    <img
                      src={blog.thumbnail}
                      alt={blog.title}
                      style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover'
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      backgroundColor: blog.status === 'published' ? '#4CAF50' : '#FFA500',
                      color: '#FFF',
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}>
                      {blog.status === 'published' ? '✅ Published' : '📋 Draft'}
                    </div>
                  </div>

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

                    <div style={{
                      display: 'flex',
                      gap: '10px',
                      marginBottom: '10px',
                      fontSize: '0.85rem',
                      color: '#AAA'
                    }}>
                      <span>📝 {blog.wordCount} words</span>
                      <span>⏱️ {blog.readingTime} min read</span>
                    </div>

                    <p style={{
                      color: '#CCC',
                      fontSize: '0.85rem',
                      margin: '5px 0 10px 0',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      minHeight: '40px'
                    }}>
                      {blog.excerpt || 'No excerpt available'}
                    </p>

                    <div style={{ fontSize: '0.8rem', color: '#AAA', margin: '10px 0' }}>
                      By {blog.author} | {new Date(blog.createdAt).toLocaleDateString()}
                    </div>

                    {blog.focusKeywords.length > 0 && (
                      <div style={{ marginBottom: '10px' }}>
                        <small style={{ color: '#5BC0EB' }}>
                          🔍 Keywords: {blog.focusKeywords.join(', ')}
                        </small>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '15px' }}>
                      <button
                        onClick={() => handleTogglePublish(blog)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          backgroundColor: blog.status === 'draft' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 152, 0, 0.2)',
                          color: blog.status === 'draft' ? '#4CAF50' : '#FF9800',
                          border: `1px solid ${blog.status === 'draft' ? '#4CAF50' : '#FF9800'}`,
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          fontWeight: '600'
                        }}
                      >
                        {blog.status === 'draft' ? '📤 Publish' : '📋 Unpublish'}
                      </button>

                      <div style={{ display: 'flex', gap: '8px' }}>
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
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        :global(.ql-container) {
          font-size: 1rem !important;
          font-family: Arial, sans-serif !important;
        }
        :global(.ql-editor) {
          min-height: 300px !important;
          color: #333 !important;
        }
        :global(.ql-toolbar) {
          border-top: 1px solid #DDD !important;
          border-bottom: 1px solid #DDD !important;
          background: #FAFAFA !important;
        }
      `}</style>
    </div>
  );
};

export default ManageBlogs;
