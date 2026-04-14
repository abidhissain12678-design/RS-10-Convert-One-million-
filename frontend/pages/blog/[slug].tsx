import React from 'react';
import { useRouter } from 'next/router';
import DOMPurify from 'isomorphic-dompurify';
import { getApiBaseUrl } from '../../utils/api';

/**
 * Million Hub News Portal - Final Production Version (Fixed)
 * Features: Dynamic Data Handling, Urdu Font Optimization, Preview Compatible
 */

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

const BlogDetail: React.FC = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [blog, setBlog] = React.useState<Blog | null>(null);
  const [trendingBlogs, setTrendingBlogs] = React.useState<Blog[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
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
        setBlog(data.blog || data);

        // Fetch trending blogs
        const allBlogsResponse = await fetch(`${baseUrl}/api/blogs`, {
          cache: 'no-cache'
        });

        if (allBlogsResponse.ok) {
          const allBlogsData = await allBlogsResponse.json();
          const trending = allBlogsData.blogs
            .filter((b: Blog) => b.slug !== slug)
            .slice(0, 3);
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

  // Default data for fallback
  const defaultData = {
    title: "Million Hub: Pakistan Ka Naya Digital Inqilab",
    content: `
      <p>Million Hub Pakistan ka wo wahid platform ban gaya hai jahan naujawan nasal apni salahiyaton ko broye kar la kar mali tor par azad ho rahi hai.</p>
      <p>Sirf 10 rupaye ki membership fees se aap Million Hub ka hissa ban sakte hain. Ye raqam ek chai ke cup se bhi kam hai, lekin ye aapke liye kamyabi ke hazaron darwaze khol sakti hai.</p>
    `,
    thumbnail: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=1200&q=80",
    author: "Editor Million Hub"
  };

  const data = blog || defaultData;
  const sanitizedContent = blog ? DOMPurify.sanitize(blog.content) : data.content;

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#f9fafb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2rem',
        color: '#dc2626'
      }}>
        ⏳ Loading article...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#f9fafb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{ color: '#dc2626', fontSize: '1.2rem' }}>
          ❌ {error}
        </div>
        <button
          onClick={() => router.push('/')}
          style={{
            backgroundColor: '#dc2626',
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
      </div>
    );
  }

  return (
    <div style={{ background: '#f9fafb', textAlign: 'right', direction: 'rtl', minHeight: '100vh' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.cdnfonts.com/css/jameel-noori-nastaleeq');
        .urdu-font { font-family: 'Jameel Noori Nastaleeq', serif !important; }
        .article-content p { 
          line-height: 2.3; 
          margin-bottom: 1.8rem; 
          font-size: clamp(0.95rem, 2.5vw, 1.4rem); 
          text-align: justify;
          color: #1a202c;
        }
        .article-content img { 
          border-radius: 15px; 
          margin: 30px 0; 
          width: 100%; 
          max-height: 500px;
          object-fit: cover;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
        }
        .article-content blockquote {
          border-right: 10px solid #dc2626;
          background: #fff5f5;
          padding: 25px;
          margin: 40px 0;
          font-size: clamp(1rem, 2.5vw, 1.6rem);
          font-weight: bold;
          box-shadow: inset 0 0 10px rgba(0,0,0,0.02);
        }
        .article-content h1, .article-content h2, .article-content h3 {
          color: #1a202c;
          margin-top: 30px;
          margin-bottom: 15px;
          font-weight: 700;
        }
        .article-content h1 {
          font-size: clamp(1.3rem, 4vw, 1.8rem);
        }
        .article-content h2 {
          font-size: clamp(1.1rem, 3.5vw, 1.5rem);
        }
        .article-content h3 {
          font-size: clamp(1rem, 3vw, 1.2rem);
        }
        .article-content a {
          color: #dc2626;
          text-decoration: underline;
        }
        .article-content ul, .article-content ol {
          margin: 20px 0 20px 30px;
          font-size: clamp(0.95rem, 2.5vw, 1.1rem);
        }
        .article-content li {
          margin-bottom: 12px;
          line-height: 1.8;
        }
        .article-content code {
          font-size: clamp(0.75rem, 2vw, 0.9rem);
        }
        .article-content table {
          font-size: clamp(0.85rem, 2vw, 1rem);
        }
        
        @media (max-width: 768px) {
          .article-content {
            line-height: 2;
          }
          .urdu-font {
            word-spacing: 0.1em;
          }
        }
        
        @media (max-width: 480px) {
          .article-content p {
            text-align: left;
          }
          .article-content blockquote {
            padding: 15px;
            margin: 20px 0;
          }
        }
      `}} />

      {/* Top Black Bar */}
      <div style={{
        backgroundColor: '#000',
        color: '#fff',
        padding: 'clamp(8px, 2vw, 10px) clamp(12px, 4vw, 24px)',
        fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 60,
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', gap: 'clamp(12px, 3vw, 20px)', fontFamily: 'Jameel Noori Nastaleeq' }}>
          <span>Mangal, 14 April 2026</span>
          <span style={{ color: '#ef4444', fontWeight: 'bold', display: 'none' }} className="hidden-mobile">LIVE UPDATE</span>
        </div>
        <div style={{ display: 'flex', gap: 'clamp(12px, 3vw, 24px)', alignItems: 'center' }}>
          <a href="#" style={{ color: '#fff', textDecoration: 'none', fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)' }}>Facebook</a>
          <span style={{ color: '#4b5563', display: 'none' }} className="hidden-mobile">|</span>
          <a href="#" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold', fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)' }}>WhatsApp</a>
        </div>
      </div>

      {/* Professional News Header */}
      <header style={{
        backgroundColor: '#fff',
        padding: 'clamp(20px, 5vw, 48px) 0',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 clamp(12px, 4vw, 16px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <div style={{
            backgroundColor: '#dc2626',
            color: '#fff',
            padding: '6px clamp(12px, 3vw, 16px)',
            fontSize: 'clamp(8px, 2vw, 10px)',
            fontWeight: 900,
            letterSpacing: '4px',
            marginBottom: '16px'
          }}>
            EXCLUSIVE
          </div>
          <h1 style={{
            fontSize: 'clamp(1.5rem, 8vw, 3.75rem)',
            fontWeight: 900,
            color: '#111',
            marginBottom: '12px',
            letterSpacing: '-0.05em'
          }}>
            MILLION<span style={{ color: '#dc2626' }}>HUB</span>
          </h1>
          <p style={{
            color: '#9ca3af',
            fontWeight: 'bold',
            letterSpacing: '8px',
            textTransform: 'uppercase',
            fontSize: 'clamp(8px, 2vw, 10px)'
          }}>
            Digital Revolution of Pakistan
          </p>
        </div>
      </header>

      {/* Main Navigation Bar */}
      <nav style={{
        backgroundColor: '#fff',
        borderBottom: '4px solid #dc2626',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        position: 'sticky',
        top: '45px',
        zIndex: 50
      }}>
        <div style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 16px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflowX: 'auto',
          flexWrap: 'wrap'
        }}>
          <a href="/" style={{
            padding: 'clamp(12px, 3vw, 20px) clamp(16px, 4vw, 32px)',
            fontWeight: 900,
            color: '#dc2626',
            borderBottom: '4px solid #dc2626',
            fontFamily: 'Poppins',
            fontSize: 'clamp(0.9rem, 2vw, 1.25rem)',
            letterSpacing: 'wide',
            textDecoration: 'none',
            whiteSpace: 'nowrap'
          }}>
            HOME 
          </a>
          {['BUSSINES', 'MILLION WINNER', 'Digital Skills'].map((item) => (
            <a key={item} href="#" style={{
              padding: 'clamp(12px, 3vw, 20px) clamp(16px, 4vw, 32px)',
              fontWeight: 'bold',
              color: '#1f2937',
              fontFamily: 'Poppins',
              fontSize: 'clamp(0.9rem, 2vw, 1.25rem)',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              transition: 'color 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#dc2626'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#1f2937'}
            >
              {item}
            </a>
          ))}
        </div>
      </nav>

      {/* Main Layout Grid */}
      <main style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: 'clamp(20px, 5vw, 56px) clamp(12px, 4vw, 16px)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 'clamp(20px, 5vw, 56px)'
      }}>
        {/* Main Article Section */}
        <article style={{
          backgroundColor: '#fff',
          padding: 'clamp(20px, 5vw, 56px)',
          borderRadius: '12px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          border: '1px solid #f3f4f6',
          position: 'relative',
          order: 1
        }}>
          {/* Floating Category Tag */}
          <div style={{
            position: 'absolute',
            top: 0,
            right: '40px',
            transform: 'translateY(-50%)',
            backgroundColor: '#dc2626',
            color: '#fff',
            padding: '8px 24px',
            fontWeight: 'bold',
            fontFamily: 'Jameel Noori Nastaleeq',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
            zIndex: 10,
            direction: 'rtl',
            fontSize: 'clamp(10px, 2vw, 14px)'
          }}>
            {blog?.category || 'خصوصی رپورٹ'}
          </div>

          {/* Trending Badge */}
          {blog?.isTrending && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: '40px',
              transform: 'translateY(-50%)',
              backgroundColor: '#fbbf24',
              color: '#000',
              padding: '8px 24px',
              fontWeight: 'bold',
              fontSize: 'clamp(10px, 2vw, 14px)',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
              zIndex: 10
            }}>
              🔥 Trending
            </div>
          )}

          <h1 style={{
            fontSize: 'clamp(1.5rem, 5vw, 2.875rem)',
            fontWeight: 900,
            color: '#111',
            lineHeight: 1.15,
            fontFamily: 'Jameel Noori Nastaleeq',
            marginBottom: 'clamp(24px, 5vw, 48px)',
            marginTop: '16px'
          }}>
            {data.title}
          </h1>

          {/* Author & Meta Info */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'left',
            gap: 'clamp(12px, 3vw, 24px)',
            borderTop: '1px solid #f3f4f6',
            borderBottom: '1px solid #f3f4f6',
            padding: 'clamp(16px, 4vw, 32px) 0',
            marginBottom: 'clamp(24px, 5vw, 48px)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: '200px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                color: '#fff',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
                border: '4px solid #fff',
                fontSize: 'clamp(18px, 3vw, 24px)',
                flexShrink: 0
              }}>
                MH
              </div>
              <div style={{ textAlign: 'left' }}>
                <p style={{
                  fontWeight: 900,
                  color: '#111',
                  fontFamily: 'Poppins',
                  fontSize: 'clamp(0.95rem, 2vw, 1.25rem)',
                  margin: 0
                }}>
                  {data.author || 'Editor Million Hub'}
                </p>
                <p style={{
                  fontSize: 'clamp(9px, 1.5vw, 11px)',
                  color: '#dc2626',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '3px',
                  margin: '4px 0 0 0'
                }}>
                  Verified News Source
                </p>
              </div>
            </div>
            <div>
              <button style={{
                backgroundColor: '#25D366',
                color: '#fff',
                padding: 'clamp(8px, 2vw, 12px) clamp(16px, 4vw, 32px)',
                borderRadius: '9999px',
                fontSize: 'clamp(9px, 1.5vw, 12px)',
                fontWeight: 900,
                border: 'none',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#128C7E';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#25D366';
              }}
              >
                WHATSAPP SHARE
              </button>
            </div>
          </div>

          {/* Main Banner Image */}
          {data.thumbnail && (
            <div style={{
              width: '100%',
              borderRadius: '16px',
              marginBottom: 'clamp(24px, 5vw, 56px)',
              overflow: 'hidden',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              border: 'clamp(4px, 2vw, 10px) solid #fff',
              boxSizing: 'border-box'
            }}>
              <img
                src={data.thumbnail}
                alt={data.title}
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'cover',
                  transition: 'transform 500ms',
                  maxHeight: '500px'
                }}
              />
            </div>
          )}

          {/* Blog Body Content */}
          {/* Blog Body Content */}
<div 
  className="article-content urdu-font english-fallback"
  dangerouslySetInnerHTML={{ __html: sanitizedContent }}
  style={{ 
    fontFamily: "'Jameel Noori Nastaleeq', 'Inter', 'Poppins', sans-serif",
    lineHeight: '2.2'
  }}
/>

          {/* Call to Action Box */}
          <div style={{
            marginTop: 'clamp(40px, 5vw, 80px)',
            background: 'linear-gradient(to right, #fef2f2 0%, #fff 100%)',
            padding: 'clamp(20px, 5vw, 40px)',
            borderRadius: '24px',
            borderRight: 'clamp(6px, 2vw, 12px) solid #dc2626',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              opacity: 0.1,
              fontSize: 'clamp(72px, 15vw, 144px)',
              fontWeight: 900,
              color: '#dc2626',
              transform: 'translate(-40px, 40px)'
            }}>
              MH
            </div>
            <h3 style={{
              fontWeight: 900,
              fontSize: 'clamp(18px, 4vw, 24px)',
              marginBottom: '20px',
              color: '#b91c1c',
              fontFamily: 'Poppins',
              position: 'relative',
              zIndex: 10
            }}>
              Zaroori Maloomat:
            </h3>
            <p style={{
              fontFamily: 'Poppins',
              fontSize: 'clamp(14px, 3vw, 20px)',
              color: '#7f1d1d',
              lineHeight: 1.8,
              position: 'relative',
              zIndex: 10,
              margin: 0
            }}>
              Agar aap bhi 10 rupaye se apna safar shuru karna chahte hain, to abhi register karein aur is khabar ko apne doston tak pohanchayein.
            </p>
          </div>
        </article>

        {/* Sidebar Widgets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(20px, 5vw, 48px)', order: 2, minWidth: '300px' }}>
          {/* Popular Posts Widget */}
          <div style={{
            backgroundColor: '#fff',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            borderRadius: '16px',
            border: '1px solid #f3f4f6',
            padding: 'clamp(20px, 4vw, 40px)',
            position: 'relative',
            overflow: 'hidden',
            textAlign: 'left'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '8px',
              height: '100%',
              backgroundColor: '#dc2626'
            }}></div>
            <h3 style={{
              fontSize: 'clamp(18px, 3vw, 24px)',
              fontWeight: 900,
              borderBottom: '2px solid #f3f4f6',
              paddingBottom: '20px',
              marginBottom: 'clamp(20px, 4vw, 40px)',
              fontFamily: 'Poppins',
              margin: 0
            }}>
              NEW ARTICLES
            </h3>

            <div>
              {trendingBlogs.length > 0 ? (
                trendingBlogs.map((item, i) => (
                  <a
                    key={item._id}
                    href={`/blog/${item.slug}`}
                    style={{
                      display: 'flex',
                      gap: 'clamp(12px, 3vw, 20px)',
                      cursor: 'pointer',
                      borderBottom: i < trendingBlogs.length - 1 ? '1px solid #f3f4f6' : 'none',
                      paddingBottom: 'clamp(16px, 3vw, 32px)',
                      marginBottom: 'clamp(16px, 3vw, 32px)',
                      textDecoration: 'none',
                      color: 'inherit'
                    }}
                  >
                    <div style={{
                      width: 'clamp(70px, 15vw, 96px)',
                      minWidth: 'clamp(70px, 15vw, 96px)',
                      height: 'clamp(70px, 15vw, 96px)',
                      backgroundColor: '#f3f4f6',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 'clamp(16px, 3vw, 24px)',
                      fontWeight: 900,
                      color: '#111',
                      transition: 'background-color 0.3s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                    >
                      {i + 1}
                    </div>
                    <div style={{ textAlign: 'left', flex: 1 }}>
                      <h4 style={{
                        fontWeight: 'bold',
                        fontSize: 'clamp(13px, 2vw, 16px)',
                        fontFamily: 'Poppins',
                        lineHeight: 1.3,
                        color: '#1f2937',
                        marginBottom: '8px',
                        margin: '0 0 8px 0'
                      }}>
                        {item.title}
                      </h4>
                      <span style={{
                        fontSize: 'clamp(8px, 1.5vw, 10px)',
                        color: '#dc2626',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        letterSpacing: 'wider',
                        display: 'block'
                      }}>
                        {item.readingTime} min read
                      </span>
                    </div>
                  </a>
                ))
              ) : (
                <p style={{ color: '#9ca3af' }}>No trending articles</p>
              )}
            </div>
          </div>

          {/* Newsletter Box */}
          <div style={{
            backgroundColor: '#111',
            padding: 'clamp(24px, 5vw, 48px)',
            borderRadius: '32px',
            color: '#fff',
            textAlign: 'center',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
            position: 'relative',
            overflow: 'hidden',
            borderBottom: 'clamp(4px, 2vw, 8px) solid #dc2626'
          }}>
            <div style={{
              position: 'absolute',
              bottom: '-40px',
              left: '-40px',
              width: '160px',
              height: '160px',
              backgroundColor: 'rgba(220, 38, 38, 0.2)',
              borderRadius: '50%',
              filter: 'blur(48px)'
            }}></div>
            <h3 style={{
              fontSize: 'clamp(24px, 4vw, 32px)',
              fontWeight: 900,
              marginBottom: '24px',
              fontFamily: 'Poppins',
              letterSpacing: '-0.02em',
              margin: '0 0 24px 0'
            }}>
              Newsletter
            </h3>
            <p style={{
              color: '#9ca3af',
              fontSize: 'clamp(12px, 2vw, 14px)',
              marginBottom: '24px',
              fontFamily: 'Poppins',
              lineHeight: 1.8,
              margin: '0 0 24px 0'
            }}>
              Har nayi khabar aur update apne mobile par hasil karne ke liye register karein.
            </p>
            <input
              type="email"
              placeholder="Email Address..."
              style={{
                width: '100%',
                padding: 'clamp(12px, 3vw, 20px)',
                borderRadius: '16px',
                color: '#000',
                marginBottom: '20px',
                outline: 'none',
                fontWeight: 'bold',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
                border: 'none',
                boxSizing: 'border-box',
                textAlign: 'left',
                fontSize: 'clamp(12px, 2vw, 16px)'
              }}
            />
            <button
              style={{
                width: '100%',
                backgroundColor: '#dc2626',
                color: '#fff',
                padding: 'clamp(12px, 3vw, 20px)',
                fontWeight: 900,
                borderRadius: '16px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                textTransform: 'uppercase',
                fontSize: 'clamp(10px, 1.5vw, 12px)',
                letterSpacing: '4px',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
            >
              Join the Hub
            </button>
          </div>

          {/* Advertisement Space */}
          <div style={{
            backgroundColor: '#f9fafb',
            border: '4px dashed #d1d5db',
            paddingTop: '128px',
            paddingBottom: '128px',
            borderRadius: '32px',
            textAlign: 'center'
          }}>
            <span style={{
              color: '#d1d5db',
              fontWeight: 900,
              fontSize: '10px',
              letterSpacing: '10px',
              textTransform: 'uppercase'
            }}>
              Advertisement
            </span>
          </div>
        </div>
      </main>

      {/* Modern Black Footer */}
      <footer style={{
        backgroundColor: '#000',
        color: '#fff',
        paddingTop: 'clamp(40px, 5vw, 96px)',
        paddingBottom: 'clamp(40px, 5vw, 96px)',
        borderTopWidth: 'clamp(8px, 2vw, 15px)',
        borderTopColor: '#dc2626'
      }}>
        <div style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 clamp(12px, 4vw, 24px)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'clamp(30px, 5vw, 80px)',
          textAlign: 'left',
          marginBottom: 'clamp(30px, 5vw, 80px)'
        }}>
          <div>
            <h2 style={{
              fontSize: 'clamp(32px, 6vw, 48px)',
              fontWeight: 900,
              color: '#dc2626',
              marginBottom: 'clamp(20px, 4vw, 40px)',
              letterSpacing: '-0.05em',
              fontStyle: 'italic',
              margin: '0 0 clamp(20px, 4vw, 40px) 0'
            }}>
              MH
            </h2>
            <p style={{
              color: '#6b7280',
              fontFamily: 'Poppins',
              lineHeight: 2.4,
              fontSize: 'clamp(14px, 2vw, 20px)',
              margin: 0
            }}>
              Million Hub Pakistan ka wo wahid digital idaara hai jo har shehri ko maashi tor par azad dekhna chahta hai. Hamare sath judiye aur apna kal badliiye.
            </p>
          </div>
          <div style={{ fontFamily: 'Poppins' }}>
            <h3 style={{
              fontWeight: 900,
              fontSize: 'clamp(16px, 3vw, 18px)',
              marginBottom: 'clamp(20px, 4vw, 40px)',
              color: '#fff',
              borderRight: '4px solid #dc2626',
              paddingRight: '16px',
              margin: '0 0 clamp(20px, 4vw, 40px) 0'
            }}>
              Quick Links
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(12px, 2vw, 20px)',
              color: '#6b7280',
              fontSize: 'clamp(13px, 2vw, 18px)',
              fontWeight: 500
            }}>
              {['Main Page', 'All Categories', 'Success Stories', 'Contact Us'].map((link) => (
                <li key={link}
                  style={{
                    cursor: 'pointer',
                    transition: 'color 0.3s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#dc2626'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
                >
                  {link}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 style={{
              fontWeight: 900,
              fontSize: 'clamp(16px, 3vw, 18px)',
              marginBottom: 'clamp(20px, 4vw, 40px)',
              color: '#fff',
              borderRight: '4px solid #dc2626',
              paddingRight: '16px',
              fontFamily: 'Poppins',
              margin: '0 0 clamp(20px, 4vw, 40px) 0'
            }}>
              Follow Us
            </h3>
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 'clamp(12px, 3vw, 24px)',
              marginBottom: '24px'
            }}>
              <div style={{
                width: 'clamp(40px, 8vw, 56px)',
                height: 'clamp(40px, 8vw, 56px)',
                backgroundColor: '#1f2937',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: 'clamp(11px, 2vw, 14px)',
                border: '1px solid #374151',
                cursor: 'pointer',
                transition: 'background-color 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1f2937'}
              >
                FB
              </div>
              <div style={{
                width: 'clamp(40px, 8vw, 56px)',
                height: 'clamp(40px, 8vw, 56px)',
                backgroundColor: '#1f2937',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: 'clamp(11px, 2vw, 14px)',
                border: '1px solid #455165',
                cursor: 'pointer',
                transition: 'background-color 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#16a34a'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1f2937'}
              >
                WA
              </div>
            </div>
            <p style={{
              color: '#4b5563',
              fontSize: 'clamp(9px, 1.5vw, 11px)',
              letterSpacing: 'widest',
              fontWeight: 'bold',
              margin: 0
            }}>
              CONTACT: INFO@MILLIONHUB.PK
            </p>
          </div>
        </div>
        <div style={{
          textAlign: 'center',
          paddingTop: 'clamp(20px, 4vw, 48px)',
          borderTop: '1px solid #1f2937',
          color: '#f6f8fb',
          fontSize: 'clamp(8px, 1.5vw, 11px)',
          textTransform: 'uppercase',
          letterSpacing: '10px',
          fontWeight: 900
        }}>
          © 2026 MILLION HUB DIGITAL | THE FUTURE IS HERE
        </div>
      </footer>
    </div>
  );
};

export default BlogDetail;
