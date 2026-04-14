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
  const [trendingBlogs, setTrendingBlogs] = useState<Blog[]>([]);
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

        // Fetch trending blogs
        const allBlogsResponse = await fetch(`${baseUrl}/api/blogs`, {
          cache: 'no-cache'
        });

        if (allBlogsResponse.ok) {
          const allBlogsData = await allBlogsResponse.json();
          const trending = allBlogsData.blogs
            .filter((b: Blog) => b.slug !== slug)
            .slice(0, 5);
          setTrendingBlogs(trending);
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
        background: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#d32f2f',
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
        background: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{ color: '#d32f2f', fontSize: '1.2rem' }}>
          ❌ {error || 'Blog not found'}
        </div>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <button
            style={{
              backgroundColor: '#d32f2f',
              color: '#fff',
              border: 'none',
              padding: '12px 30px',
              borderRadius: '4px',
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
      background: '#f5f5f5',
      color: '#333',
      minHeight: '100vh',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
    }}>
      {/* Red and White Header */}
      <header style={{
        background: 'linear-gradient(135deg, #d32f2f 0%, #c62828 100%)',
        color: '#fff',
        padding: '20px 0',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 4px 12px rgba(211, 47, 47, 0.15)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{
              fontSize: '1.8rem',
              fontWeight: '700',
              color: '#fff',
              cursor: 'pointer',
              letterSpacing: '1px'
            }}>
              📰 MILLION HUB
            </div>
          </Link>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <button
              style={{
                backgroundColor: '#fff',
                color: '#d32f2f',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: '600',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f5f5f5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#fff';
              }}
            >
              ← Back to News
            </button>
          </Link>
        </div>
      </header>

      {/* Main Content - 2 Column Layout */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px',
        display: 'grid',
        gridTemplateColumns: '1fr 300px',
        gap: '40px'
      }}>
        {/* Left Column - Article Content */}
        <article style={{
          backgroundColor: '#fff',
          borderRadius: '4px',
          padding: '40px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
        }}>
          {/* Hero Image */}
          <div style={{
            marginBottom: '30px',
            borderRadius: '4px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#e0e0e0'
          }}>
            <img
              src={blog.thumbnail}
              alt={blog.title}
              style={{
                width: '100%',
                height: '400px',
                objectFit: 'cover',
                display: 'block'
              }}
            />
          </div>

          {/* Article Header */}
          <div style={{
            borderTop: '3px solid #d32f2f',
            paddingTop: '20px',
            marginBottom: '30px'
          }}>
            {/* Category/Keywords */}
            {blog.focusKeywords.length > 0 && (
              <div style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
                marginBottom: '12px'
              }}>
                {blog.focusKeywords.slice(0, 3).map((keyword, idx) => (
                  <span
                    key={idx}
                    style={{
                      backgroundColor: '#d32f2f',
                      color: '#fff',
                      padding: '4px 12px',
                      borderRadius: '2px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      textTransform: 'uppercase'
                    }}
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            )}

            {/* Article Title */}
            <h1 style={{
              fontSize: '2.2rem',
              color: '#1a1a1a',
              margin: '0 0 15px 0',
              fontWeight: '700',
              lineHeight: 1.3
            }}>
              {blog.title}
            </h1>

            {/* Meta Info */}
            <div style={{
              display: 'flex',
              gap: '20px',
              fontSize: '0.85rem',
              color: '#666',
              flexWrap: 'wrap'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                ✍️ <strong>{blog.author}</strong>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                📅 {new Date(blog.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                ⏱️ {blog.readingTime} min read
              </span>
            </div>
          </div>

          {/* Article Excerpt */}
          {blog.metaDescription && (
            <p style={{
              fontSize: '1.1rem',
              color: '#555',
              fontStyle: 'italic',
              marginBottom: '30px',
              paddingBottom: '20px',
              borderBottom: '1px solid #e0e0e0',
              lineHeight: 1.6
            }}>
              {blog.metaDescription}
            </p>
          )}

          {/* Article Content */}
          <div
            style={{
              fontSize: '1rem',
              lineHeight: 2.2,
              color: '#333',
              marginBottom: '40px',
              wordBreak: 'break-word'
            }}
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            className="article-content"
          />

          {/* Author Bio */}
          <div
            style={{
              backgroundColor: '#f9f9f9',
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
              padding: '25px',
              marginTop: '40px',
              borderLeft: '4px solid #d32f2f'
            }}
          >
            <h3 style={{
              color: '#d32f2f',
              margin: '0 0 12px 0',
              fontSize: '1.1rem',
              fontWeight: '700'
            }}>
              About the Author
            </h3>
            <p style={{
              color: '#666',
              lineHeight: 1.6,
              margin: '0',
              fontSize: '0.95rem'
            }}>
              <strong style={{ color: '#1a1a1a' }}>{blog.author}</strong> is a contributor at Million Hub, sharing insights and expertise on earning opportunities, financial freedom, and personal growth strategies.
            </p>
          </div>
        </article>

        {/* Right Column - Trending Sidebar */}
        <aside>
          {/* Trending Box */}
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '4px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            position: 'sticky',
            top: '100px'
          }}>
            {/* Header */}
            <div style={{
              background: '#d32f2f',
              color: '#fff',
              padding: '15px 20px',
              fontWeight: '700',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              🔥 TRENDING NOW
            </div>

            {/* Trending Articles */}
            <div style={{ padding: '0' }}>
              {trendingBlogs.length > 0 ? (
                trendingBlogs.map((trendBlog, idx) => (
                  <Link key={trendBlog._id} href={`/blog/${trendBlog.slug}`} style={{ textDecoration: 'none' }}>
                    <div
                      style={{
                        display: 'flex',
                        gap: '12px',
                        padding: '15px',
                        borderBottom: idx < trendingBlogs.length - 1 ? '1px solid #e0e0e0' : 'none',
                        cursor: 'pointer',
                        transition: 'background 0.3s',
                        backgroundColor: '#fff'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f9f9f9';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#fff';
                      }}
                    >
                      {/* Trending Number */}
                      <div style={{
                        background: '#d32f2f',
                        color: '#fff',
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '700',
                        fontSize: '0.9rem',
                        flexShrink: 0
                      }}>
                        {idx + 1}
                      </div>

                      {/* Content */}
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <h4 style={{
                          color: '#1a1a1a',
                          margin: '0 0 6px 0',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          lineHeight: 1.3,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {trendBlog.title}
                        </h4>
                        <p style={{
                          color: '#999',
                          fontSize: '0.75rem',
                          margin: '0',
                          display: 'flex',
                          gap: '8px'
                        }}>
                          <span>{trendBlog.readingTime} min</span>
                          <span>•</span>
                          <span>{new Date(trendBlog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div style={{ padding: '20px', color: '#999', textAlign: 'center' }}>
                  No trending articles
                </div>
              )}
            </div>
          </div>

          {/* Subscribe Box */}
          <div style={{
            backgroundColor: '#d32f2f',
            color: '#fff',
            padding: '20px',
            borderRadius: '4px',
            marginTop: '20px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(211, 47, 47, 0.15)'
          }}>
            <h3 style={{
              margin: '0 0 10px 0',
              fontSize: '1rem',
              fontWeight: '700'
            }}>
              Stay Updated
            </h3>
            <p style={{
              margin: '0 0 15px 0',
              fontSize: '0.85rem',
              lineHeight: 1.4
            }}>
              Get the latest news & insights
            </p>
            <button style={{
              width: '100%',
              backgroundColor: '#fff',
              color: '#d32f2f',
              border: 'none',
              padding: '10px',
              borderRadius: '4px',
              fontWeight: '600',
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f5f5f5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#fff';
              }}
            >
              Subscribe
            </button>
          </div>
        </aside>
      </div>

      {/* Global Article Content Styles */}
      <style jsx global>{`
        @font-face {
          font-family: 'Jameel Noori Nastaleeq';
          src: url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap');
          font-weight: 400;
          font-style: normal;
        }

        .article-content {
          font-family: '"Jameel Noori Nastaleeq", "Segoe UI", Tahoma, sans-serif';
          line-height: 2.2;
        }

        .article-content h1,
        .article-content h2,
        .article-content h3,
        .article-content h4,
        .article-content h5,
        .article-content h6 {
          color: #d32f2f;
          margin-top: 30px;
          margin-bottom: 15px;
          font-weight: 700;
          line-height: 1.3;
        }

        .article-content h1 {
          font-size: 1.8rem;
          border-bottom: 3px solid #d32f2f;
          padding-bottom: 10px;
        }

        .article-content h2 {
          font-size: 1.5rem;
          border-left: 4px solid #d32f2f;
          padding-left: 15px;
        }

        .article-content h3 {
          font-size: 1.2rem;
          border-left: 3px solid #d32f2f;
          padding-left: 12px;
        }

        .article-content p {
          margin: 0 0 15px 0;
          text-align: justify;
          line-height: 2.2;
          letter-spacing: 0.3px;
          color: #333;
        }

        .article-content a {
          color: #d32f2f;
          text-decoration: underline;
          transition: all 0.3s ease;
        }

        .article-content a:hover {
          color: #b71c1c;
          text-decoration-thickness: 2px;
        }

        .article-content ul,
        .article-content ol {
          margin: 20px 0 20px 30px;
          color: #333;
        }

        .article-content li {
          margin-bottom: 12px;
          line-height: 2;
          letter-spacing: 0.2px;
        }

        .article-content blockquote {
          margin: 25px 0;
          padding: 20px;
          border-left: 4px solid #d32f2f;
          background: #f9f9f9;
          border-radius: 4px;
          font-style: italic;
          color: #555;
          font-size: 1rem;
          line-height: 2;
        }

        .article-content code {
          background: #f5f5f5;
          border: 1px solid #e0e0e0;
          color: #d32f2f;
          padding: 4px 8px;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
          font-size: 0.9rem;
        }

        .article-content pre {
          background: #f5f5f5;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          padding: 20px;
          overflow-x: auto;
          margin: 20px 0;
        }

        .article-content pre code {
          background: transparent;
          border: none;
          padding: 0;
          color: #333;
        }

        .article-content img {
          max-width: 100%;
          height: auto;
          border-radius: 4px;
          margin: 20px 0;
          border: 1px solid #e0e0e0;
        }

        .article-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 25px 0;
          border: 1px solid #e0e0e0;
        }

        .article-content th,
        .article-content td {
          padding: 12px;
          text-align: left;
          border: 1px solid #e0e0e0;
        }

        .article-content th {
          background: #f5f5f5;
          color: #d32f2f;
          font-weight: 700;
        }

        .article-content tr:hover {
          background: #f9f9f9;
        }

        .article-content hr {
          border: none;
          height: 2px;
          background: linear-gradient(90deg, transparent, #d32f2f, transparent);
          margin: 40px 0;
        }

        .article-content strong {
          color: #d32f2f;
          font-weight: 700;
        }

        .article-content em {
          color: #d32f2f;
          font-style: italic;
        }

        /* Responsive Layout */
        @media (max-width: 768px) {
          div[style*="display: grid"][style*="grid-template-columns: 1fr 300px"] {
            grid-template-columns: 1fr !important;
          }

          .article-content {
            line-height: 2;
          }
        }
      `}</style>
    </div>
  );
};

export default BlogDetailPage;
