import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getApiBaseUrl } from '../utils/api';

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

const BlogSection: React.FC = () => {
  const [blogs, setBlogs] = React.useState<Blog[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const baseUrl = getApiBaseUrl();
        const response = await fetch(`${baseUrl}/api/blogs`, {
          cache: 'no-cache'
        });
        
        if (response.ok) {
          const data = await response.json();
          setBlogs(data.blogs || []);
        }
      } catch (error) {
        console.error('Failed to fetch blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <section style={{
      padding: '80px 20px',
      background: 'linear-gradient(135deg, rgba(15, 20, 30, 0.98), rgba(20, 25, 40, 0.98))',
      width: '100%',
      boxSizing: 'border-box',
      borderTop: '2px solid rgba(255, 215, 0, 0.2)',
      borderBottom: '2px solid rgba(255, 215, 0, 0.2)'
    }}>
      <article style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{
            fontSize: '0.85rem',
            color: '#FFD700',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            marginBottom: '10px',
            fontWeight: '700'
          }}>
            ✨ Our Latest Content
          </div>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            color: '#FFD700',
            marginBottom: '20px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            📰 Dark Magazine Blog
          </h2>
          <p style={{
            fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
            color: '#CCC',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Stay updated with premium insights, success stories, and expert tips from Million Hub
          </p>
        </div>

        {/* Blog Cards Grid */}
        {loading ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#CCC'
          }}>
            <div style={{ fontSize: '1.2rem', marginBottom: '15px' }}>⏳ Loading premium content...</div>
          </div>
        ) : blogs.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#CCC',
            fontSize: '1.1rem'
          }}>
            No blog articles published yet. Check back soon!
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(280px, 90vw, 380px), 1fr))',
            gap: '40px',
            marginBottom: '50px'
          }}>
            {blogs.slice(0, 6).map((blog) => (
              <Link key={blog._id} href={`/blog/${blog.slug}`} style={{ textDecoration: 'none' }}>
                <article style={{
                  background: 'rgba(255, 215, 0, 0.03)',
                  border: '1px solid rgba(255, 215, 0, 0.15)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                  cursor: 'pointer',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.transform = 'translateY(-12px) scale(1.02)';
                  el.style.boxShadow = '0 20px 50px rgba(255, 215, 0, 0.2)';
                  el.style.borderColor = 'rgba(255, 215, 0, 0.4)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.transform = 'translateY(0) scale(1)';
                  el.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
                  el.style.borderColor = 'rgba(255, 215, 0, 0.15)';
                }}>
                  {/* Thumbnail with Zoom Effect */}
                  <div style={{
                    position: 'relative',
                    overflow: 'hidden',
                    height: '240px',
                    background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.05))'
                  }}>
                    <img
                      src={blog.thumbnail}
                      alt={blog.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1) rotate(1deg)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                      }}
                    />
                    {/* Category/Status Badge */}
                    <div style={{
                      position: 'absolute',
                      top: '15px',
                      right: '15px',
                      padding: '6px 14px',
                      borderRadius: '20px',
                      backgroundColor: 'rgba(255, 215, 0, 0.15)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 215, 0, 0.3)',
                      color: '#FFD700',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}>
                      ✨ Featured
                    </div>
                  </div>

                  {/* Content Area */}
                  <div style={{
                    padding: '28px',
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1
                  }}>
                    {/* Meta Info - Top */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '14px',
                      fontSize: '0.8rem',
                      color: '#AAA',
                      borderBottom: '1px solid rgba(255, 215, 0, 0.1)',
                      paddingBottom: '12px'
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        👤 {blog.author}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        📅 {new Date(blog.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>

                    {/* Blog Title */}
                    <h3 style={{
                      fontSize: 'clamp(1.2rem, 2.5vw, 1.4rem)',
                      color: '#FFD700',
                      margin: '0 0 14px 0',
                      fontWeight: '700',
                      lineHeight: 1.3,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      transition: 'color 0.3s ease'
                    }}>
                      {blog.title}
                    </h3>

                    {/* Blog Excerpt */}
                    <p style={{
                      fontSize: '0.95rem',
                      color: '#DDD',
                      margin: '0 0 auto 0',
                      lineHeight: 1.6,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      minHeight: '50px'
                    }}>
                      {blog.excerpt}
                    </p>

                    {/* Reading Time */}
                    <div style={{
                      display: 'flex',
                      gap: '15px',
                      marginTop: '16px',
                      paddingTop: '16px',
                      borderTop: '1px solid rgba(255, 215, 0, 0.1)',
                      fontSize: '0.85rem',
                      color: '#AAA'
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        📝 {blog.wordCount} words
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        ⏱️ {blog.readingTime} min read
                      </span>
                    </div>

                    {/* Read More Button */}
                    <button
                      style={{
                        marginTop: '20px',
                        backgroundColor: 'transparent',
                        color: '#FFD700',
                        border: '2px solid rgba(255, 215, 0, 0.4)',
                        padding: '11px 20px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease',
                        backgroundImage: 'linear-gradient(135deg, rgba(255, 215, 0, 0), rgba(255, 215, 0, 0.1))',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 215, 0, 0.15)';
                        e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.7)';
                        e.currentTarget.style.color = '#FFD700';
                        e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.4)';
                        e.currentTarget.style.color = '#FFD700';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      Read Full Article →
                    </button>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}

        {/* View All Button */}
        {blogs.length > 6 && (
          <div style={{
            textAlign: 'center',
            paddingTop: '40px',
            borderTop: '1px solid rgba(255, 215, 0, 0.1)'
          }}>
            <Link href="/blog" style={{ textDecoration: 'none' }}>
              <button
                style={{
                  backgroundColor: 'rgba(255, 215, 0, 0.1)',
                  color: '#FFD700',
                  border: '2px solid #FFD700',
                  padding: '14px 40px',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  letterSpacing: '1px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFD700';
                  e.currentTarget.style.color = '#000';
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(255, 215, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 215, 0, 0.1)';
                  e.currentTarget.style.color = '#FFD700';
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                📚 View All Articles
              </button>
            </Link>
          </div>
        )}
      </article>
    </section>
  );
};

export default BlogSection;
