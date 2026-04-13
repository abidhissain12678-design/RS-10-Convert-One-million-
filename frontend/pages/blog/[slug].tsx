import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import DOMPurify from 'isomorphic-dompurify';
import { getApiBaseUrl } from '../../utils/api';

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

const BlogDetailPage: React.FC = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchBlog = async () => {
      setLoading(true);
      setError(null);
      try {
        const baseUrl = getApiBaseUrl();
        const response = await fetch(`${baseUrl}/api/blogs/${slug}`, {
          cache: 'no-cache'
        });

        if (!response.ok) {
          throw new Error('Blog not found');
        }

        const data = await response.json();
        // Handle both formats: { blog } and direct blog object
        setBlog(data.blog || data);

        // Fetch related blogs (same keywords)
        const allBlogsResponse = await fetch(`${baseUrl}/api/blogs`, {
          cache: 'no-cache'
        });

        if (allBlogsResponse.ok) {
          const allBlogsData = await allBlogsResponse.json();
          const related = allBlogsData.blogs
            .filter((b: Blog) => b.slug !== slug)
            .slice(0, 3);
          setRelatedBlogs(related);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load blog');
        console.error('Error fetching blog:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f1419 0%, #1a1f26 50%, #0a0e12 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFD700',
        fontSize: '1.2rem'
      }}>
        ⏳ Loading article...
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f1419 0%, #1a1f26 50%, #0a0e12 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{ color: '#F44336', fontSize: '1.2rem' }}>
          ❌ {error || 'Blog not found'}
        </div>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <button
            style={{
              backgroundColor: '#FFD700',
              color: '#000',
              border: 'none',
              padding: '12px 30px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '1rem'
            }}
          >
            ← Back to Home
          </button>
        </Link>
      </div>
    );
  }

  const sanitizedContent = DOMPurify.sanitize(blog.content);

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0f1419 0%, #1a1f26 50%, #0a0e12 100%)',
      color: '#F8D94A',
      minHeight: '100vh',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* Header Navigation */}
      <header style={{
        padding: '15px 20px',
        borderBottom: '1px solid rgba(255, 215, 0, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(15, 20, 25, 0.95)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          display: 'flex',
          gap: '15px',
          alignItems: 'center'
        }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <button
              style={{
                background: 'rgba(255, 215, 0, 0.1)',
                color: '#FFD700',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '600',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 215, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 215, 0, 0.1)';
              }}
            >
              ← Back
            </button>
          </Link>
          <div style={{ fontSize: '0.8rem', color: '#AAA' }}>
            MILLION HUB BLOG
          </div>
        </div>
      </header>

      {/* Main Content */}
      <article style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '60px 20px 80px',
        backgroundColor: 'rgba(26, 26, 46, 0.8)',
        borderRadius: '20px',
        border: '1px solid rgba(255, 215, 0, 0.1)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        paddingLeft: '30px',
        paddingRight: '30px'
      }}>
        {/* Hero Section with Thumbnail */}
        <div style={{
          marginBottom: '50px',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          backgroundColor: '#1a1a2e'
        }}>
          <img
            src={blog.thumbnail}
            alt={blog.title}
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '500px',
              objectFit: 'contain',
              display: 'block',
              aspectRatio: '16/9'
            }}
          />
        </div>

        {/* Article Meta Info */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          paddingBottom: '20px',
          borderBottom: '2px solid rgba(255, 215, 0, 0.15)',
          fontSize: '0.95rem',
          color: '#CCC'
        }}>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              👤 <strong>{blog.author}</strong>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              📅 {new Date(blog.createdAt).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              📝 {blog.wordCount} words
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              ⏱️ {blog.readingTime} min read
            </span>
          </div>
        </div>

        {/* Article Title */}
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          color: '#FFD700',
          marginBottom: '15px',
          fontWeight: '800',
          lineHeight: 1.3,
          background: 'linear-gradient(135deg, #FFD700, #FFA500)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          {blog.title}
        </h1>

        {/* Meta Description / Excerpt */}
        <p style={{
          fontSize: '1.15rem',
          color: '#DDD',
          marginBottom: '40px',
          lineHeight: 1.8,
          fontStyle: 'italic',
          borderLeft: '4px solid rgba(255, 215, 0, 0.4)',
          paddingLeft: '20px'
        }}>
          {blog.metaDescription || blog.excerpt}
        </p>

        {/* Focus Keywords */}
        {blog.focusKeywords.length > 0 && (
          <div style={{
            marginBottom: '40px',
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap'
          }}>
            {blog.focusKeywords.map((keyword, idx) => (
              <span
                key={idx}
                style={{
                  backgroundColor: 'rgba(255, 215, 0, 0.1)',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  color: '#FFD700',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: '600'
                }}
              >
                🔖 {keyword}
              </span>
            ))}
          </div>
        )}

        {/* Article Content - Rich HTML */}
        <div
          style={{
            fontSize: '1.05rem',
            lineHeight: 2,
            color: '#EEE',
            marginBottom: '60px',
            wordBreak: 'break-word',
            fontFamily: '"Jameel Noori Nastaleeq", "Segoe UI", Tahoma, san-serif'
          }}
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          className="blog-content"
        />

        {/* Author Bio Section - Glassmorphism */}
        <div
          style={{
            backgroundColor: 'rgba(255, 215, 0, 0.08)',
            border: '2px solid rgba(255, 215, 0, 0.25)',
            borderRadius: '16px',
            padding: '35px',
            marginBottom: '60px',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(255, 215, 0, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
            borderLeft: '5px solid rgba(255, 215, 0, 0.6)'
          }}
        >
          <h3 style={{
            color: '#FFD700',
            marginBottom: '15px',
            fontSize: '1.3rem',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            ✍️ About the Author
          </h3>
          <p style={{
            color: '#DDD',
            lineHeight: 1.8,
            margin: '0',
            fontSize: '1rem'
          }}>
            <strong style={{ color: '#FFD700', fontWeight: '700' }}>{blog.author}</strong> is a contributor at Million Hub, sharing insights and expertise on earning
            opportunities, financial freedom, and personal growth strategies. With a passion for helping others succeed, we provide actionable advice and proven methods.
          </p>
        </div>

        {/* Divider */}
        <div
          style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.3), transparent)',
            margin: '60px 0'
          }}
        />

        {/* Related Articles */}
        {relatedBlogs.length > 0 && (
          <div style={{ marginTop: '60px' }}>
            <h2 style={{
              color: '#FFD700',
              fontSize: '1.8rem',
              marginBottom: '30px',
              fontWeight: '700'
            }}>
              📚 Related Articles
            </h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '25px'
              }}
            >
              {relatedBlogs.map((relBlog) => (
                <Link key={relBlog._id} href={`/blog/${relBlog.slug}`} style={{ textDecoration: 'none' }}>
                  <article
                    style={{
                      background: 'rgba(255, 215, 0, 0.05)',
                      border: '1px solid rgba(255, 215, 0, 0.15)',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      height: '100%'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px)';
                      e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.15)';
                    }}
                  >
                    <img
                      src={relBlog.thumbnail}
                      alt={relBlog.title}
                      style={{
                        width: '100%',
                        height: '160px',
                        objectFit: 'cover'
                      }}
                    />
                    <div style={{ padding: '16px' }}>
                      <h3
                        style={{
                          color: '#FFD700',
                          fontSize: '1rem',
                          margin: '0 0 10px 0',
                          fontWeight: '600',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}
                      >
                        {relBlog.title}
                      </h3>
                      <p
                        style={{
                          color: '#AAA',
                          fontSize: '0.85rem',
                          margin: '0',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}
                      >
                        {relBlog.excerpt}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Global Blog Content Styles */}
      <style jsx global>{`
        @font-face {
          font-family: 'Jameel Noori Nastaleeq';
          src: url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap');
          font-weight: 400;
          font-style: normal;
        }

        .blog-content h1,
        .blog-content h2,
        .blog-content h3,
        .blog-content h4,
        .blog-content h5,
        .blog-content h6 {
          color: #FFD700;
          margin-top: 30px;
          margin-bottom: 15px;
          font-weight: 700;
          line-height: 1.3;
        }

        .blog-content h1 {
          font-size: 2rem;
          border-bottom: 2px solid rgba(255, 215, 0, 0.2);
          padding-bottom: 15px;
        }

        .blog-content h2 {
          font-size: 1.6rem;
          border-left: 5px solid rgba(255, 215, 0, 0.7);
          padding-left: 20px;
          margin-left: -20px;
          background: linear-gradient(90deg, rgba(255, 215, 0, 0.05), transparent);
          padding: 10px 15px 10px 20px;
          border-radius: 0 8px 8px 0;
        }

        .blog-content h3 {
          font-size: 1.3rem;
          border-left: 4px solid rgba(255, 215, 0, 0.6);
          padding-left: 16px;
          margin-left: -16px;
          background: linear-gradient(90deg, rgba(255, 215, 0, 0.03), transparent);
          padding: 8px 12px 8px 16px;
          border-radius: 0 6px 6px 0;
        }

        .blog-content p {
          margin: 0 0 20px 0;
          text-align: justify;
          line-height: 2;
          letter-spacing: 0.3px;
        }

        .blog-content a {
          color: #FFD700;
          text-decoration: underline;
          transition: all 0.3s ease;
        }

        .blog-content a:hover {
          color: #FFA500;
          text-decoration-thickness: 2px;
        }

        .blog-content ul,
        .blog-content ol {
          margin: 20px 0 20px 30px;
          color: #EEE;
        }

        .blog-content li {
          margin-bottom: 12px;
          line-height: 1.9;
          letter-spacing: 0.2px;
        }

        .blog-content blockquote {
          margin: 25px 0;
          padding: 20px;
          border-left: 5px solid rgba(255, 215, 0, 0.6);
          background: rgba(255, 215, 0, 0.08);
          border-radius: 8px;
          font-style: italic;
          color: #DDD;
          font-size: 1.1rem;
          line-height: 1.9;
          backdrop-filter: blur(10px);
        }

        .blog-content code {
          background: rgba(255, 215, 0, 0.1);
          border: 1px solid rgba(255, 215, 0, 0.2);
          color: #FFD700;
          padding: 4px 8px;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
          font-size: 0.9rem;
        }

        .blog-content pre {
          background: rgba(255, 215, 0, 0.05);
          border: 1px solid rgba(255, 215, 0, 0.2);
          border-radius: 8px;
          padding: 20px;
          overflow-x: auto;
          margin: 20px 0;
        }

        .blog-content pre code {
          background: transparent;
          border: none;
          padding: 0;
          color: #FFD700;
        }

        .blog-content img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 30px 0;
          border: 1px solid rgba(255, 215, 0, 0.2);
        }

        .blog-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 25px 0;
          border: 1px solid rgba(255, 215, 0, 0.2);
        }

        .blog-content th,
        .blog-content td {
          padding: 12px;
          text-align: left;
          border: 1px solid rgba(255, 215, 0, 0.1);
        }

        .blog-content th {
          background: rgba(255, 215, 0, 0.1);
          color: #FFD700;
          font-weight: 700;
        }

        .blog-content tr:hover {
          background: rgba(255, 215, 0, 0.05);
        }

        .blog-content hr {
          border: none;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.3), transparent);
          margin: 40px 0;
        }

        .blog-content strong {
          color: #FFD700;
          font-weight: 700;
        }

        .blog-content em {
          color: #FFA500;
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

export default BlogDetailPage;
