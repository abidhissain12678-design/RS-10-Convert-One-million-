import React, { useState, useEffect, useRef } from 'react';

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
  isTrending?: boolean;
  publishedAt?: string;
}

const ManageBlogs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'list' | 'newsletter'>('create');
  const [showLivePreview, setShowLivePreview] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('Million Hub');
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [metaDescription, setMetaDescription] = useState('');
  const [focusKeywords, setFocusKeywords] = useState('');
  const [isTrending, setIsTrending] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [tickerText, setTickerText] = useState('Welcome to Million Hub');
  const [category, setCategory] = useState('Digital Skills');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.tiny.cloud/1/eskh1g5djqxo76mh9st4nk22t3q2pfiu726ar1d2dhkj1i4p/tinymce/6/tinymce.min.js';
    script.referrerPolicy = 'origin';
    script.onload = () => {
      (window as any).tinymce.init({
        selector: '#tiny-editor',
        height: 500,
        menubar: true,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount', 'directionality',
          'paste', 'powerpaste', 'insertdatetime', 'autoresize'
        ],
        toolbar: 'undo redo | blocks | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media table | ltr rtl | code | removeformat | help',
        content_style: 'body { font-family: "Jameel Noori Nastaleeq", serif; font-size: 16px; background: #0f172a; color: #cbd5e1; direction: rtl; text-align: right; line-height: 1.8; }',
        skin: 'oxide-dark',
        content_css: 'dark',
        directionality: 'rtl',
        relative_urls: false,
        remove_script_host: false,
        branding: false,
        statusbar: true,
        paste_as_text: false,
        powerpaste_word_import: 'clean',
        powerpaste_html_import: 'clean',
        autoresize_bottom_margin: 50,
        setup: (editor: any) => {
          editorRef.current = editor;
          editor.on('change', () => setContent(editor.getContent()));
          editor.on('keyup', () => setContent(editor.getContent()));
        }
      });
    };
    document.head.appendChild(script);
    return () => {
      if ((window as any).tinymce) (window as any).tinymce.remove();
    };
  }, []);

  useEffect(() => {
    const plainText = content.replace(/<[^>]*>/g, '').trim();
    const words = plainText ? plainText.split(/\s+/).length : 0;
    setWordCount(words);
    setReadingTime(Math.max(1, Math.ceil(words / 200)));
  }, [content]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setThumbnailPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setMessage('Title required!');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setMessage('Saved successfully!');
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 mb-8">
          <h1 className="text-2xl font-black text-white uppercase">Million Hub Admin</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#1e293b] rounded-2xl border border-slate-800 p-6">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Article Title..."
                className="w-full bg-transparent text-3xl font-black outline-none border-b border-slate-800 pb-4 focus:border-[#fbbf24] text-[#fbbf24] placeholder:text-slate-700 mb-4"
              />
              <textarea id="tiny-editor"></textarea>
            </div>

            <div className="bg-[#1e293b] rounded-2xl border border-slate-800 p-6">
              <h3 className="text-sm font-bold text-[#fbbf24] mb-4 uppercase">SEO Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={focusKeywords}
                  onChange={(e) => setFocusKeywords(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm outline-none focus:border-[#fbbf24]"
                  placeholder="Keywords"
                />
                <textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm outline-none focus:border-[#fbbf24]"
                  placeholder="Meta description"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#1e293b] rounded-2xl border border-slate-800 p-6">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-[#fbbf24] text-black font-black py-3 rounded-lg hover:shadow-lg transition-all"
              >
                {loading ? 'Processing...' : 'Publish'}
              </button>
              {message && <p className="text-center text-sm text-[#fbbf24] mt-2">{message}</p>}
            </div>

            <div className="bg-[#1e293b] rounded-2xl border border-slate-800 p-6">
              <h3 className="text-xs font-black text-slate-400 mb-4 uppercase">Thumbnail</h3>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="aspect-video bg-slate-950 border-2 border-dashed border-slate-800 rounded-xl flex items-center justify-center cursor-pointer hover:border-[#fbbf24]"
              >
                {thumbnailPreview ? <img src={thumbnailPreview} className="w-full h-full object-cover" /> : <span>📷 Upload</span>}
              </div>
              <input type="file" ref={fileInputRef} hidden onChange={handleImageChange} accept="image/*" />
            </div>

            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex justify-between">
              <div>
                <p className="text-xs text-slate-500">Words</p>
                <p className="text-lg font-black">{wordCount}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Read Time</p>
                <p className="text-lg font-black text-[#fbbf24]">{readingTime}m</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .urdu-text { font-family: 'Jameel Noori Nastaleeq', serif; }
        .tox-tinymce { border-radius: 12px !important; border: 1px solid #334155 !important; }
      `}</style>
    </div>
  );
};

export default ManageBlogs;