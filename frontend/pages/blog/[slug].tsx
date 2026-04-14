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
          font-size: 1.4rem; 
          text-align: justify;
          color: #1a202c;
        }
        .article-content img { 
          border-radius: 15px; 
          margin: 30px 0; 
          width: 100%; 
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
        }
        .article-content blockquote {
          border-right: 10px solid #dc2626;
          background: #fff5f5;
          padding: 25px;
          margin: 40px 0;
          font-size: 1.6rem;
          font-weight: bold;
          box-shadow: inset 0 0 10px rgba(0,0,0,0.02);
        }
        .article-content h1, .article-content h2, .article-content h3 {
          color: #1a202c;
          margin-top: 30px;
          margin-bottom: 15px;
          font-weight: 700;
        }
        .article-content a {
          color: #dc2626;
          text-decoration: underline;
        }
        .article-content ul, .article-content ol {
          margin: 20px 0 20px 30px;
        }
      `}} />

      {/* Top Black Bar */}
      <div style={{
        backgroundColor: '#000',
        color: '#fff',
        padding: '10px 24px',
        fontSize: '0.75rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 60,
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', gap: '20px', fontFamily: 'Jameel Noori Nastaleeq' }}>
          <span>Mangal, 14 April 2026</span>
          <span style={{ color: '#ef4444', fontWeight: 'bold' }}>LIVE UPDATE</span>
        </div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <a href="#" style={{ color: '#fff', textDecoration: 'none' }}>Facebook</a>
          <span style={{ color: '#4b5563' }}>|</span>
          <a href="#" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>WhatsApp Group</a>
        </div>
      </div>

      {/* Professional News Header */}
      <header style={{
        backgroundColor: '#fff',
        padding: '48px 0',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <div style={{
            backgroundColor: '#dc2626',
            color: '#fff',
            padding: '6px 16px',
            fontSize: '10px',
            fontWeight: 900,
            letterSpacing: '4px',
            marginBottom: '16px'
          }}>
            EXCLUSIVE
          </div>
          <h1 style={{
            fontSize: 'clamp(2rem, 8vw, 3.75rem)',
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
            fontSize: '10px'
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
          overflowX: 'auto'
        }}>
          <a href="/" style={{
            padding: '20px 32px',
            fontWeight: 900,
            color: '#dc2626',
            borderBottom: '4px solid #dc2626',
            fontFamily: 'Jameel Noori Nastaleeq',
            fontSize: '1.25rem',
            letterSpacing: 'wide',
            textDecoration: 'none',
            whiteSpace: 'nowrap'
          }}>
            Safha Awal
          </a>
          {['Karobar', 'Kamyabiyan', 'Digital Skills'].map((item) => (
            <a key={item} href="#" style={{
              padding: '20px 32px',
              fontWeight: 'bold',
              color: '#1f2937',
              fontFamily: 'Jameel Noori Nastaleeq',
              fontSize: '1.25rem',
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
          <a href="/admin" style={{
            padding: '20px 32px',
            fontWeight: 'bold',
            color: '#d1d5db',
            fontFamily: 'Jameel Noori Nastaleeq',
            fontSize: '1.25rem',
            textDecoration: 'none',
            whiteSpace: 'nowrap'
          }}>
            Admin
          </a>
        </div>
      </nav>

      {/* Main Layout Grid */}
      <main style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '56px 16px',
        display: 'grid',
        gridTemplateColumns: '1fr 300px',
        gap: '56px'
      }}>
        {/* Main Article Section */}
        <article style={{
          backgroundColor: '#fff',
          padding: '56px',
          borderRadius: '12px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          border: '1px solid #f3f4f6',
          position: 'relative'
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
            zIndex: 10
          }}>
            Khosusi Report
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 6vw, 2.875rem)',
            fontWeight: 900,
            color: '#111',
            lineHeight: 1.15,
            fontFamily: 'Jameel Noori Nastaleeq',
            marginBottom: '48px',
            marginTop: '16px'
          }}>
            {data.title}
          </h1>

          {/* Author & Meta Info */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '24px',
            borderTop: '1px solid #f3f4f6',
            borderBottom: '1px solid #f3f4f6',
            padding: '32px 0',
            marginBottom: '48px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
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
                fontSize: '24px',
                flexShrink: 0
              }}>
                MH
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{
                  fontWeight: 900,
                  color: '#111',
                  fontFamily: 'Jameel Noori Nastaleeq',
                  fontSize: '1.25rem',
                  margin: 0
                }}>
                  {data.author || 'Editor Million Hub'}
                </p>
                <p style={{
                  fontSize: '11px',
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
                padding: '12px 32px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: 900,
                border: 'none',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s'
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
              marginBottom: '56px',
              overflow: 'hidden',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              border: '10px solid #fff',
              boxSizing: 'border-box'
            }}>
              <img
                src={data.thumbnail}
                alt={data.title}
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'cover',
                  transition: 'transform 500ms'
                }}
              />
            </div>
          )}

          {/* Blog Body Content */}
          <div
            className="article-content urdu-font"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            style={{ fontFamily: 'Jameel Noori Nastaleeq' }}
          />

          {/* Call to Action Box */}
          <div style={{
            marginTop: '80px',
            background: 'linear-gradient(to right, #fef2f2 0%, #fff 100%)',
            padding: '40px',
            borderRadius: '24px',
            borderRight: '12px solid #dc2626',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              opacity: 0.1,
              fontSize: '144px',
              fontWeight: 900,
              color: '#dc2626',
              transform: 'translate(-40px, 40px)'
            }}>
              MH
            </div>
            <h3 style={{
              fontWeight: 900,
              fontSize: '24px',
              marginBottom: '20px',
              color: '#b91c1c',
              fontFamily: 'Jameel Noori Nastaleeq',
              position: 'relative',
              zIndex: 10
            }}>
              Zaroori Maloomat:
            </h3>
            <p style={{
              fontFamily: 'Jameel Noori Nastaleeq',
              fontSize: '20px',
              color: '#7f1d1d',
              lineHeight: 1.8,
              position: 'relative',
              zIndex: 10
            }}>
              Agar aap bhi 10 rupaye se apna safar shuru karna chahte hain, to abhi register karein aur is khabar ko apne doston tak pohanchayein.
            </p>
          </div>
        </article>

        {/* Sidebar Widgets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
          {/* Popular Posts Widget */}
          <div style={{
            backgroundColor: '#fff',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            borderRadius: '16px',
            border: '1px solid #f3f4f6',
            padding: '40px',
            position: 'relative',
            overflow: 'hidden',
            textAlign: 'right'
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
              fontSize: '24px',
              fontWeight: 900,
              borderBottom: '2px solid #f3f4f6',
              paddingBottom: '20px',
              marginBottom: '40px',
              fontFamily: 'Jameel Noori Nastaleeq'
            }}>
              Taza Khabrein
            </h3>

            <div>
              {trendingBlogs.length > 0 ? (
                trendingBlogs.map((item, i) => (
                  <a
                    key={item._id}
                    href={`/blog/${item.slug}`}
                    style={{
                      display: 'flex',
                      gap: '20px',
                      cursor: 'pointer',
                      borderBottom: i < trendingBlogs.length - 1 ? '1px solid #f3f4f6' : 'none',
                      paddingBottom: '32px',
                      marginBottom: '32px',
                      textDecoration: 'none',
                      color: 'inherit'
                    }}
                  >
                    <div style={{
                      width: '96px',
                      height: '96px',
                      backgroundColor: '#f3f4f6',
                      borderRadius: '8px',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      fontWeight: 900,
                      color: '#111',
                      transition: 'background-color 0.3s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                    >
                      {i + 1}
                    </div>
                    <div style={{ textAlign: 'right', flex: 1 }}>
                      <h4 style={{
                        fontWeight: 'bold',
                        fontSize: '16px',
                        fontFamily: 'Jameel Noori Nastaleeq',
                        lineHeight: 1.3,
                        color: '#1f2937',
                        marginBottom: '8px'
                      }}>
                        {item.title}
                      </h4>
                      <span style={{
                        fontSize: '10px',
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
            padding: '48px',
            borderRadius: '32px',
            color: '#fff',
            textAlign: 'center',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
            position: 'relative',
            overflow: 'hidden',
            borderBottom: '8px solid #dc2626'
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
              fontSize: '32px',
              fontWeight: 900,
              marginBottom: '24px',
              fontFamily: 'Jameel Noori Nastaleeq',
              letterSpacing: '-0.02em'
            }}>
              Newsletter
            </h3>
            <p style={{
              color: '#9ca3af',
              fontSize: '14px',
              marginBottom: '40px',
              fontFamily: 'Jameel Noori Nastaleeq',
              lineHeight: 1.8,
              paddingLeft: '16px',
              paddingRight: '16px'
            }}>
              Har nayi khabar aur update apne mobile par hasil karne ke liye register karein.
            </p>
            <input
              type="email"
              placeholder="Email Address..."
              style={{
                width: '100%',
                padding: '20px',
                borderRadius: '16px',
                color: '#000',
                marginBottom: '20px',
                outline: 'none',
                fontWeight: 'bold',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
                border: 'none',
                boxSizing: 'border-box',
                textAlign: 'right'
              }}
            />
            <button
              style={{
                width: '100%',
                backgroundColor: '#dc2626',
                color: '#fff',
                padding: '20px',
                fontWeight: 900,
                borderRadius: '16px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                textTransform: 'uppercase',
                fontSize: '12px',
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
        paddingTop: '96px',
        paddingBottom: '96px',
        borderTopWidth: '15px',
        borderTopColor: '#dc2626'
      }}>
        <div style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '80px',
          textAlign: 'right'
        }}>
          <div>
            <h2 style={{
              fontSize: '48px',
              fontWeight: 900,
              color: '#dc2626',
              marginBottom: '40px',
              letterSpacing: '-0.05em',
              fontStyle: 'italic'
            }}>
              MH
            </h2>
            <p style={{
              color: '#6b7280',
              fontFamily: 'Jameel Noori Nastaleeq',
              lineHeight: 2.4,
              fontSize: '20px'
            }}>
              Million Hub Pakistan ka wo wahid digital idaara hai jo har shehri ko maashi tor par azad dekhna chahta hai. Hamare sath judiye aur apna kal badliiye.
            </p>
          </div>
          <div style={{ fontFamily: 'Jameel Noori Nastaleeq' }}>
            <h3 style={{
              fontWeight: 900,
              fontSize: '18px',
              marginBottom: '40px',
              color: '#fff',
              borderRight: '4px solid #dc2626',
              paddingRight: '16px'
            }}>
              Quick Links
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              color: '#6b7280',
              fontSize: '18px',
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
              fontSize: '18px',
              marginBottom: '40px',
              color: '#fff',
              borderRight: '4px solid #dc2626',
              paddingRight: '16px',
              fontFamily: 'Jameel Noori Nastaleeq'
            }}>
              Follow Us
            </h3>
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '24px',
              marginBottom: '40px'
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                backgroundColor: '#1f2937',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '14px',
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
                width: '56px',
                height: '56px',
                backgroundColor: '#1f2937',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '14px',
                border: '1px solid #374151',
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
              fontSize: '11px',
              letterSpacing: 'widest',
              fontWeight: 'bold'
            }}>
              CONTACT: INFO@MILLIONHUB.PK
            </p>
          </div>
        </div>
        <div style={{
          textAlign: 'center',
          marginTop: '96px',
          paddingTop: '48px',
          borderTop: '1px solid #1f2937',
          color: '#4b5563',
          fontSize: '11px',
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
