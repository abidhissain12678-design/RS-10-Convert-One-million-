import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { getApiBaseUrl } from '../../utils/api';

import 'react-quill/dist/quill.snow.css';

// Dynamically import React-Quill to avoid SSR issues
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill');
    return RQ;
  },
  { 
    ssr: false,
    loading: () => <div style={{ color: '#AAA', padding: '20px' }}>Loading editor...</div>
  }
);

// Register custom fonts after client-side mount
const registerQuillFonts = () => {
  if (typeof window !== 'undefined') {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const Quill = require('quill');
      const Font = Quill.import('formats/font');
      
      if (Font) {
        // Set whitelist of available fonts
        Font.whitelist = [
          'sans-serif',
          'serif',
          'monospace',
          'Roboto',
          'Poppins',
          'Nastaliq',
          'Arial',
          'Georgia',
          'Times',
          'Courier',
          'Trebuchet',
          'Verdana'
        ];
        
        // Register the Font format with whitelist
        Quill.register(Font, true);
        
        // Map font display names to CSS values
        const fontFormat = Quill.import('formats/font');
        fontFormat.whitelist = Font.whitelist;
      }
    } catch (error) {
      console.warn('Could not register Quill fonts:', error);
    }
  }
};

// Register custom line-height Parchment attribute
const registerQuillLineHeight = () => {
  if (typeof window !== 'undefined') {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const Quill = require('quill');
      const Parchment = Quill.import('parchment');
      
      // Create custom LineHeight class
      class LineHeightClass extends Parchment.Attributor.Style {
        constructor() {
          super('lineheight', 'line-height', {
            scope: Parchment.Scope.BLOCK,
            whitelist: ['1.0', '1.5', '1.8', '2.0']
          });
        }
      }
      
      // Register the custom line-height attribute
      Quill.register(new LineHeightClass(), true);
    } catch (error) {
      console.warn('Could not register Quill line-height:', error);
    }
  }
};

// Detect if text contains Urdu/Arabic characters
const isUrduText = (text: string): boolean => {
  const urduArabicRegex = /[\u0600-\u06FF]/g;
  return urduArabicRegex.test(text);
};

// Get default line-height based on content language
const getDefaultLineHeight = (content: string): string => {
  // Strip HTML tags to check content
  const plainText = content.replace(/<[^>]*>/g, '');
  return isUrduText(plainText) ? '1.8' : '1.5';
};

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
  isTrending?: boolean;
  category?: string;
}

// Quill modules configuration
const createModules = () => ({
  clipboard: {
    matchVisibility: true,
  },
  history: {
    delay: 1000,
    maxStack: 50,
    userOnly: true
  },
  toolbar: {
    container: [
      [{ 'header': [1, 2, 3, false] }],
      [
        { 'font': [
          'sans-serif',
          'serif',
          'monospace',
          'Roboto',
          'Poppins',
          'Nastaliq',
          'Arial',
          'Georgia',
          'Times',
          'Courier',
          'Trebuchet',
          'Verdana'
        ]}
      ],
      [{ 'size': ['small', 'normal', 'large', 'huge'] }],
      [{ 'lineheight': ['1.0', '1.5', '1.8', '2.0'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': ['', 'center', 'right', 'justify'] }],
      [{ 'direction': 'rtl' }],
      ['link', 'image'],
      ['clean']
    ]
  }
});

const formats = [
  'header',
  'font', 'size', 'lineheight',
  'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'script',
  'blockquote', 'code-block',
  'list', 'bullet',
  'align', 'direction',
  'link', 'image'
];

// Newsletter Manager Component
const NewsletterManager: React.FC = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [stats] = useState({ totalSubscribers: 5420, openRate: '24%', lastSent: '2 days ago' });

  const sendNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      alert('✅ Newsletter sabhi subscribers ko bhej diya gaya hai!');
      setSubject('');
      setMessage('');
    }, 2000);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '32px', marginTop: '30px' }}>
      {/* Compose Section */}
      <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', padding: '32px', boxShadow: '0 20px 25px rgba(0, 0, 0, 0.4)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#fbbf24', marginBottom: '24px', textTransform: 'uppercase', fontStyle: 'italic', letterSpacing: '0.05em' }}>Compose New Announcement</h2>
          <form onSubmit={sendNewsletter} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Email Subject</label>
              <input 
                type="text" 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                style={{ width: '100%', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '16px', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s', color: '#cbd5e1' }}
                placeholder="E.g. Million Hub Weekly Update"
                onFocus={(e) => e.currentTarget.style.borderColor = '#fbbf24'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#1e293b'}
              />
            </div>
            <div>
              <label style={{ fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Message Body</label>
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={8}
                style={{ width: '100%', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '16px', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s', color: '#cbd5e1', fontFamily: 'inherit', resize: 'none' }}
                placeholder="Apna paigham yahan likhein..."
                onFocus={(e) => e.currentTarget.style.borderColor = '#fbbf24'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#1e293b'}
              ></textarea>
            </div>
            <button 
              type="submit"
              disabled={isSending}
              style={{ width: '100%', background: '#fbbf24', color: '#000', fontWeight: 900, padding: '16px', borderRadius: '12px', boxShadow: '0 10px 15px rgba(251, 191, 36, 0.2)', cursor: isSending ? 'not-allowed' : 'pointer', transition: 'all 0.2s', opacity: isSending ? 0.6 : 1, transform: isSending ? 'scale(0.98)' : 'scale(1)', border: 'none', fontSize: '14px', textTransform: 'uppercase', fontStyle: 'italic', letterSpacing: '0.05em' }}
              onMouseEnter={(e) => !isSending && (e.currentTarget.style.transform = 'scale(1.01)')}
              onMouseLeave={(e) => !isSending && (e.currentTarget.style.transform = 'scale(1)')}
            >
              {isSending ? 'Sending Emails...' : 'Broadcast to All Subscribers 📣'}
            </button>
          </form>
        </div>
      </div>

      {/* Stats Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px', boxShadow: '0 20px 25px rgba(0, 0, 0, 0.4)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '128px', height: '128px', background: '#fbbf24', opacity: 0.05, borderRadius: '50%', marginRight: '-64px', marginTop: '-64px' }}></div>
          <h3 style={{ fontSize: '10px', fontWeight: 900, color: '#94a3b8', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Audience Insights</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <p style={{ fontSize: '30px', fontWeight: 900, color: '#fff', margin: 0 }}>{stats.totalSubscribers}</p>
                <p style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', margin: '4px 0 0 0' }}>Subscribers</p>
              </div>
              <span style={{ color: '#22c55e', fontSize: '12px', fontWeight: 700 }}>+12% ↑</span>
            </div>
            
            <div style={{ height: '1px', background: '#1e293b' }}></div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '12px', borderRadius: '12px', border: '1px solid #334155' }}>
                <p style={{ fontSize: '14px', fontWeight: 900, color: '#fbbf24', margin: 0 }}>{stats.openRate}</p>
                <p style={{ fontSize: '8px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', margin: '4px 0 0 0' }}>Open Rate</p>
              </div>
              <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '12px', borderRadius: '12px', border: '1px solid #334155' }}>
                <p style={{ fontSize: '14px', fontWeight: 900, color: '#fff', margin: 0 }}>{stats.lastSent}</p>
                <p style={{ fontSize: '8px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', margin: '4px 0 0 0' }}>Last Blast</p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ background: '#fbbf24', borderRadius: '16px', padding: '24px', color: '#000' }}>
          <h4 style={{ fontWeight: 900, textTransform: 'uppercase', fontStyle: 'italic', fontSize: '12px', margin: '0 0 8px 0' }}>Pro Tip</h4>
          <p style={{ fontSize: '12px', fontWeight: 700, lineHeight: '1.5', margin: 0 }}>Zyada engagement ke liye images aur catchy subjects ka istemal karein!</p>
        </div>
      </div>
    </div>
  );
};

const ManageBlogs: React.FC = () => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
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
  const [htmlViewActive, setHtmlViewActive] = useState(false);
  const [activeTab, setActiveTab] = useState<'blogs' | 'newsletter'>('blogs');
  const [isTrending, setIsTrending] = useState(false);
  const [category, setCategory] = useState('Digital Skills');
  const [showLivePreview, setShowLivePreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [modules] = useState(createModules());

  useEffect(() => {
    registerQuillFonts();
    registerQuillLineHeight();
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

  // Apply default line-height for Urdu content
  useEffect(() => {
    if (content && isUrduText(content)) {
      // Only apply if no line-height is already set in the content
      if (!content.includes('line-height')) {
        // The line-height will be applied when users select text and apply formatting from the toolbar
        console.log('Urdu content detected - recommended line-height: 1.8 or 2.0 for better readability');
      }
    }
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
    setSlug(blog.slug);
    setContent(blog.content);
    setAuthor(blog.author);
    setStatus(blog.status);
    setMetaDescription(blog.metaDescription);
    setFocusKeywords(blog.focusKeywords.join(', '));
    setThumbnailPreview(blog.thumbnail);
    setThumbnail(null);
    setMessage('');
    setIsTrending(blog.isTrending || false);
    setCategory(blog.category || 'Digital Skills');
  };

  const handleCancelEdit = () => {
    setEditingBlog(null);
    setTitle('');
    setSlug('');
    setContent('');
    setAuthor('Million Hub');
    setThumbnail(null);
    setThumbnailPreview('');
    setStatus('draft');
    setMetaDescription('');
    setFocusKeywords('');
    setMessage('');
    setHtmlViewActive(false);
    setIsTrending(false);
    setCategory('Digital Skills');
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
      formData.append('isTrending', String(isTrending));
      formData.append('category', category);
      if (slug.trim()) {
        formData.append('slug', slug);
      }
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
          📝 MILLION HUB-Digital Blog Management
        </h1>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '30px', justifyContent: 'center' }}>
          <button
            onClick={() => setActiveTab('blogs')}
            style={{
              padding: '12px 24px',
              background: activeTab === 'blogs' ? '#FFD700' : '#334155',
              color: activeTab === 'blogs' ? '#000' : '#CBD5E1',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.3s',
              boxShadow: activeTab === 'blogs' ? '0 10px 15px rgba(255, 215, 0, 0.3)' : 'none'
            }}
            onMouseEnter={(e) => activeTab !== 'blogs' && (e.currentTarget.style.background = '#475569')}
            onMouseLeave={(e) => activeTab !== 'blogs' && (e.currentTarget.style.background = '#334155')}
          >
            📚 Manage Blogs
          </button>
          <button
            onClick={() => setActiveTab('newsletter')}
            style={{
              padding: '12px 24px',
              background: activeTab === 'newsletter' ? '#FFD700' : '#334155',
              color: activeTab === 'newsletter' ? '#000' : '#CBD5E1',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.3s',
              boxShadow: activeTab === 'newsletter' ? '0 10px 15px rgba(255, 215, 0, 0.3)' : 'none'
            }}
            onMouseEnter={(e) => activeTab !== 'newsletter' && (e.currentTarget.style.background = '#475569')}
            onMouseLeave={(e) => activeTab !== 'newsletter' && (e.currentTarget.style.background = '#334155')}
          >
            📬 Newsletter
          </button>
        </div>

        {activeTab === 'blogs' && (
        <>
        {/* Form Section with Live Preview */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: showLivePreview ? '1fr 400px' : '1fr',
          gap: '30px',
          marginBottom: '40px'
        }}>
          {/* Form Container */}
          <div style={{
            background: 'rgba(255, 215, 0, 0.05)',
            border: '2px solid rgba(255, 215, 0, 0.3)',
            borderRadius: '16px',
            padding: '30px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{
                fontSize: '1.5rem',
                color: '#FFD700',
                margin: 0
              }}>
                {editingBlog ? '✏️ Edit Blog' : '➕ Create New Blog'}
              </h2>
              <button
                type="button"
                onClick={() => setShowLivePreview(!showLivePreview)}
                style={{
                  padding: '8px 16px',
                  background: showLivePreview ? '#FFD700' : 'rgba(255, 215, 0, 0.2)',
                  color: showLivePreview ? '#000' : '#FFD700',
                  border: `2px solid ${showLivePreview ? '#FFD700' : 'rgba(255, 215, 0, 0.5)'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s'
                }}
              >
                📱 {showLivePreview ? 'Hide' : 'Show'} Preview
              </button>
            </div>

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

            {/* Slug Input (Optional) */}
            <div>
              <label style={{ display: 'block', color: '#FFD700', marginBottom: '8px', fontWeight: '600' }}>
                URL Slug (Optional - Required for Urdu titles)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''))}
                placeholder="e.g., my-blog-post (auto-generated if left empty)"
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
              <small style={{ color: '#AAA', marginTop: '5px', display: 'block' }}>
                💡 Tip: For Urdu titles, enter a custom English slug here (lowercase, hyphens only). It will be auto-generated if you leave this empty.
              </small>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ color: '#FFD700', fontWeight: '600' }}>
                  Blog Content * (Rich Text Editor)
                </label>
                <button
                  type="button"
                  onClick={() => setHtmlViewActive(!htmlViewActive)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: htmlViewActive ? 'rgba(100, 200, 255, 0.2)' : 'rgba(255, 215, 0, 0.2)',
                    color: htmlViewActive ? '#64C8FF' : '#FFD700',
                    border: `1px solid ${htmlViewActive ? '#64C8FF' : '#FFD700'}`,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: '600'
                  }}
                >
                  {htmlViewActive ? '</> HTML' : '<> Rich Text'}
                </button>
              </div>

              {htmlViewActive ? (
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter raw HTML code here"
                  style={{
                    width: '100%',
                    minHeight: '300px',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 215, 0, 0.3)',
                    backgroundColor: '#1a1a1a',
                    color: '#FFD700',
                    fontFamily: '"Courier New", monospace',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box',
                    resize: 'vertical',
                    lineHeight: '1.5'
                  }}
                />
              ) : (
                <div style={{
                  backgroundColor: '#FFF',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  overflow: 'hidden'
                }}>
                  {typeof window !== 'undefined' && (
                    <ReactQuill
                      theme="snow"
                      value={content}
                      onChange={setContent}
                      modules={modules}
                      formats={formats}
                    />
                  )}
                </div>
              )}
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

            {/* Category Selector */}
            <div>
              <label style={{ display: 'block', color: '#FFD700', marginBottom: '8px', fontWeight: '600' }}>
                Main Category
              </label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  borderRadius: '8px',
                  padding: '12px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  color: '#FFD700',
                  fontSize: '1rem'
                }}
              >
                <option value="Digital Skills">💻 Digital Skills</option>
                <option value="Kamyabiyan">🏆 Kamyabiyan</option>
                <option value="Karobar">📈 Karobar</option>
                <option value="Safha Awal">📰 Safha Awal</option>
              </select>
            </div>

            {/* Trending Now Switch */}
            <div>
              <label style={{ display: 'block', color: '#FFD700', marginBottom: '8px', fontWeight: '600' }}>
                Trending Settings
              </label>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';}}
              onMouseLeave={(e) => {e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.3)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';}}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#ef4444', fontSize: '1.2rem' }}>🔥</span>
                  <span style={{ color: '#FFF', fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Trending Now</span>
                </div>
                <button 
                  type="button"
                  onClick={() => setIsTrending(!isTrending)}
                  style={{
                    width: '48px',
                    height: '24px',
                    borderRadius: '12px',
                    border: 'none',
                    background: isTrending ? '#dc2626' : '#4b5563',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.3s',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '2px',
                    width: '16px',
                    height: '16px',
                    background: '#FFF',
                    borderRadius: '50%',
                    transition: 'all 0.3s',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    left: isTrending ? '28px' : '4px'
                  }}></div>
                </button>
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

          {/* --- Live Mobile Preview Section --- */}
          {showLivePreview && (
            <div style={{
              position: 'sticky',
              top: '20px',
              height: 'fit-content',
              background: '#fff',
              borderRadius: '40px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              border: '8px solid #1f2937',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* Mobile Speaker/Camera Notch Detail */}
              <div style={{
                width: '100%',
                height: '32px',
                background: '#1f2937',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <div style={{
                  width: '64px',
                  height: '4px',
                  background: '#111827',
                  borderRadius: '9999px'
                }}></div>
              </div>

              {/* Preview Content Area */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                background: '#fff',
                padding: '16px',
                height: '700px',
                direction: 'rtl',
                textAlign: 'right'
              }}>
                {/* Category Label - English (Left Aligned) */}
                <div style={{ marginBottom: '8px', direction: 'ltr', textAlign: 'left' }}>
                  <span style={{
                    color: '#fbbf24',
                    fontWeight: 900,
                    fontSize: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    background: '#000',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    display: 'inline-block',
                    fontFamily: "'Inter', 'Poppins', -apple-system, sans-serif"
                  }}>
                    {category || 'Category'}
                  </span>
                </div>

                {/* Blog Title - Urdu (Right Aligned, Nastaliq) */}
                <h1 style={{
                  fontSize: '1.25rem',
                  fontWeight: 900,
                  color: '#000',
                  marginBottom: '16px',
                  lineHeight: 1.3,
                  fontFamily: "'Jameel Noori Nastaleeq', 'Nastaliq', serif",
                  direction: 'rtl',
                  textAlign: 'right'
                }}>
                  {title || 'Yahan aapka blog title dikhay ga...'}
                </h1>

                {/* Author & Date Info */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '16px',
                  borderBottom: '1px solid #e2e8f0',
                  paddingBottom: '12px',
                  direction: 'rtl',
                  flexDirection: 'row-reverse'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#e0e7ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    fontWeight: 700,
                    color: '#9ca3af',
                    flexShrink: 0
                  }}>
                    MH
                  </div>
                  <div style={{ fontSize: '10px', textAlign: 'right' }}>
                    <p style={{ fontWeight: 700, color: '#000', margin: 0, fontFamily: "'Jameel Noori Nastaleeq', serif" }}>{author || 'Million Hub'}</p>
                    <p style={{ color: '#9ca3af', margin: '4px 0 0 0', fontSize: '9px' }}>منشور • {new Date().toLocaleDateString('en-PK')}</p>
                  </div>
                </div>

                {/* Featured Image Preview */}
                {thumbnailPreview ? (
                  <div style={{
                    width: '100%',
                    aspectRatio: '16 / 9',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    marginBottom: '16px',
                    boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)'
                  }}>
                    <img src={thumbnailPreview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Blog Preview" />
                  </div>
                ) : (
                  <div style={{
                    width: '100%',
                    aspectRatio: '16 / 9',
                    background: '#f3f4f6',
                    borderRadius: '12px',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px dashed #e5e7eb'
                  }}>
                    <span style={{ fontSize: '10px', color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase' }}>No Image Uploaded</span>
                  </div>
                )}

                {/* Real-time Content Rendering */}
                {isTrending && (
                  <div style={{
                    display: 'inline-block',
                    background: '#dc2626',
                    color: '#fff',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '9px',
                    fontWeight: 700,
                    marginBottom: '12px',
                    direction: 'ltr'
                  }}>
                    🔥 Trending
                  </div>
                )}
                <div style={{
                  fontSize: '14px',
                  lineHeight: 2,
                  color: '#475569',
                  direction: 'rtl',
                  textAlign: 'right',
                  fontFamily: "'Jameel Noori Nastaleeq', serif"
                }} dangerouslySetInnerHTML={{ __html: content || '<p style="color: #d1d5db;">Apna content likhna shuru karein...</p>' }} />
              </div>

              {/* Mobile Home Indicator */}
              <div style={{
                width: '100%',
                height: '24px',
                background: '#fff',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <div style={{
                  width: '80px',
                  height: '4px',
                  background: '#e5e7eb',
                  borderRadius: '9999px'
                }}></div>
              </div>
            </div>
          )}
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
                    {blog.isTrending && (
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        backgroundColor: '#dc2626',
                        color: '#FFF',
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                      }}>
                        🔥 Trending
                      </div>
                    )}
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

                    {blog.category && (
                      <div style={{ marginBottom: '10px' }}>
                        <small style={{ color: '#fbbf24', fontWeight: 'bold' }}>
                          📁 {blog.category}
                        </small>
                      </div>
                    )}

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
        </>
        )}

        {activeTab === 'newsletter' && (
          <NewsletterManager />
        )}
      </div>

      <style jsx>{`
        :global(.ql-container) {
          font-size: 1rem !important;
          font-family: Arial, sans-serif !important;
        }
        :global(.ql-editor) {
          min-height: 300px !important;
          color: #333 !important;
          padding-bottom: 100px !important;
        }
        :global(.ql-editor.ql-blank::before) {
          color: #999 !important;
        }
        :global(.ql-toolbar) {
          border-top: 1px solid #DDD !important;
          border-bottom: 1px solid #DDD !important;
          background: #FAFAFA !important;
        }
        :global(.ql-snow .ql-stroke) {
          stroke: #444 !important;
        }
        :global(.ql-snow .ql-fill) {
          fill: #444 !important;
        }
        :global(.ql-snow .ql-picker-label) {
          color: #444 !important;
        }
        :global(.ql-editor) {
          direction: ltr;
        }
        :global(.ql-editor[style*="direction: rtl"]) {
          direction: rtl;
          text-align: right;
        }
        :global(.ql-snow .ql-direction-rtl) {
          direction: rtl;
        }
        :global(.ql-tooltip) {
          position: absolute !important;
          background: #FFF !important;
          border: 1px solid #CCC !important;
          z-index: 9999 !important;
        }
        :global(.ql-tooltip.ql-flip) {
          position: absolute !important;
          top: auto !important;
        }
        /* Line Height Styles */
        :global(.ql-editor[style*="line-height: 1.0"]) {
          line-height: 1.0 !important;
        }
        :global(.ql-editor[style*="line-height: 1.2"]) {
          line-height: 1.2 !important;
        }
        :global(.ql-editor[style*="line-height: 1.5"]) {
          line-height: 1.5 !important;
        }
        :global(.ql-editor[style*="line-height: 1.8"]) {
          line-height: 1.8 !important;
        }
        :global(.ql-editor[style*="line-height: 2.0"]) {
          line-height: 2.0 !important;
        }
        :global(.ql-editor[style*="line-height: 2.5"]) {
          line-height: 2.5 !important;
        }
        :global(p[style*="line-height: 1.0"]) {
          line-height: 1.0 !important;
        }
        :global(p[style*="line-height: 1.2"]) {
          line-height: 1.2 !important;
        }
        :global(p[style*="line-height: 1.5"]) {
          line-height: 1.5 !important;
        }
        :global(p[style*="line-height: 1.8"]) {
          line-height: 1.8 !important;
        }
        :global(p[style*="line-height: 2.0"]) {
          line-height: 2.0 !important;
        }
        :global(p[style*="line-height: 2.5"]) {
          line-height: 2.5 !important;
        }
        :global(div[style*="line-height: 1.0"]) {
          line-height: 1.0 !important;
        }
        :global(div[style*="line-height: 1.2"]) {
          line-height: 1.2 !important;
        }
        :global(div[style*="line-height: 1.5"]) {
          line-height: 1.5 !important;
        }
        :global(div[style*="line-height: 1.8"]) {
          line-height: 1.8 !important;
        }
        :global(div[style*="line-height: 2.0"]) {
          line-height: 2.0 !important;
        }
        :global(div[style*="line-height: 2.5"]) {
          line-height: 2.5 !important;
        }
        /* Urdu-specific line-height defaults */
        :global(.ql-editor.ql-nastaliq) {
          line-height: 1.8 !important;
        }
        :global(.ql-editor.is-urdu) {
          line-height: 1.8 !important;
        }
        @font-face {
          font-family: 'Roboto';
          font-display: swap;
          src: local('Roboto'), local('Roboto-Regular'),
               url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap') format('truetype');
          font-weight: 400;
          font-style: normal;
        }
        @font-face {
          font-family: 'Poppins';
          font-display: swap;
          src: local('Poppins'), local('Poppins-Regular'),
               url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;700&display=swap') format('truetype');
          font-weight: 400;
          font-style: normal;
        }
        /* Nastaliq Font - Regular */
        @font-face {
          font-family: 'Nastaliq';
          font-display: swap;
          src: local('Noto Nastaliq Urdu'), local('NotoNastaliqUrdu'),
               url('/fonts/static/NotoNastaliqUrdu-Regular.ttf') format('truetype');
          font-weight: 400;
          font-style: normal;
          font-stretch: normal;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        /* Nastaliq Font - Medium */
        @font-face {
          font-family: 'Nastaliq';
          font-display: swap;
          src: local('Noto Nastaliq Urdu Medium'), local('NotoNastaliqUrdu-Medium'),
               url('/fonts/static/NotoNastaliqUrdu-Medium.ttf') format('truetype');
          font-weight: 500;
          font-style: normal;
          font-stretch: normal;
        }
        /* Nastaliq Font - SemiBold */
        @font-face {
          font-family: 'Nastaliq';
          font-display: swap;
          src: local('Noto Nastaliq Urdu SemiBold'), local('NotoNastaliqUrdu-SemiBold'),
               url('/fonts/static/NotoNastaliqUrdu-SemiBold.ttf') format('truetype');
          font-weight: 600;
          font-style: normal;
          font-stretch: normal;
        }
        /* Nastaliq Font - Bold */
        @font-face {
          font-family: 'Nastaliq';
          font-display: swap;
          src: local('Noto Nastaliq Urdu Bold'), local('NotoNastaliqUrdu-Bold'),
               url('/fonts/static/NotoNastaliqUrdu-Bold.ttf') format('truetype');
          font-weight: 700;
          font-style: normal;
          font-stretch: normal;
        }
        :global(.ql-font-Roboto) {
          font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
        }
        :global(.ql-font-Poppins) {
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
        }
        :global(.ql-font-Nastaliq) {
          font-family: 'Nastaliq', 'Urdu Typesetting', 'Jameel Noori Nastaleeq', 'Arial', serif !important;
          font-weight: 400;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        /* Mobile-specific font adjustments */
        @media (max-width: 768px) {
          :global(.ql-font-Nastaliq) {
            font-size: 1.05em;
            line-height: 1.6;
            letter-spacing: 0.02em;
          }
        }
        :global(.ql-toolbar .ql-formats button[value="undo"]:before) {
          content: '↶';
        }
        :global(.ql-toolbar .ql-formats button[value="redo"]:before) {
          content: '↷';
        }
      `}</style>
    </div>
  );
};

export default ManageBlogs;
