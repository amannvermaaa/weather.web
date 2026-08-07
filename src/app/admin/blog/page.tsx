'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Loader2, Plus, Trash2, Edit2, Save } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  
  const { token } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, [token]);

  const fetchPosts = () => {
    setLoading(true);
    fetch('http://localhost:5000/admin/blog', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      setPosts(data);
      setLoading(false);
    })
    .catch(console.error);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { title, slug, content, category, seoTitle, seoDescription, published: true };
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `http://localhost:5000/admin/blog/${editingId}` : `http://localhost:5000/admin/blog`;
    
    try {
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        fetchPosts();
        resetForm();
      } else {
        const error = await res.json();
        alert(error.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setTitle(''); setSlug(''); setContent(''); setCategory('General'); setSeoTitle(''); setSeoDescription('');
    setEditingId(null);
    setIsEditing(false);
  };

  const editPost = (post: any) => {
    setTitle(post.title);
    setSlug(post.slug);
    setContent(post.content);
    setCategory(post.category);
    setSeoTitle(post.seoTitle || '');
    setSeoDescription(post.seoDescription || '');
    setEditingId(post._id);
    setIsEditing(true);
  };

  const deletePost = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    try {
      const res = await fetch(`http://localhost:5000/admin/blog/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchPosts();
    } catch (error) {
      console.error(error);
    }
  };

  if (isEditing) {
    return (
      <div className="bg-slate-900 border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">{editingId ? 'Edit Post' : 'New Post'}</h2>
          <button onClick={resetForm} className="text-slate-400 hover:text-white text-sm">Cancel</button>
        </div>
        
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase text-slate-400 mb-1">Title</label>
              <input required value={title} onChange={e => { setTitle(e.target.value); if(!editingId) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')); }} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:border-cyan-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs uppercase text-slate-400 mb-1">Slug</label>
              <input required value={slug} onChange={e => setSlug(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:border-cyan-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs uppercase text-slate-400 mb-1">Category</label>
              <input required value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:border-cyan-500 outline-none" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase text-slate-400 mb-1">Markdown Content</label>
              <textarea required value={content} onChange={e => setContent(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:border-cyan-500 outline-none min-h-[400px] font-mono" />
            </div>
            <div>
              <label className="block text-xs uppercase text-slate-400 mb-1">Live Preview</label>
              <div className="w-full bg-black/20 border border-white/5 rounded-lg p-4 h-[400px] overflow-y-auto prose prose-invert prose-sm">
                <ReactMarkdown>{content || '*Preview will appear here*'}</ReactMarkdown>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <h3 className="text-sm font-semibold text-white mb-4">SEO Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase text-slate-400 mb-1">SEO Title</label>
                <input value={seoTitle} onChange={e => setSeoTitle(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:border-cyan-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs uppercase text-slate-400 mb-1">SEO Description</label>
                <input value={seoDescription} onChange={e => setSeoDescription(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:border-cyan-500 outline-none" />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" className="bg-cyan-500 text-black px-6 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-cyan-400 transition-colors">
              <Save className="w-4 h-4" /> Save Post
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-white/10 rounded-xl overflow-hidden shadow-sm">
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">Blog Posts</h2>
        <button onClick={() => setIsEditing(true)} className="bg-cyan-500/10 text-cyan-400 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-cyan-500/20 transition-colors">
          <Plus className="w-4 h-4" /> New Post
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-cyan-400" /></div>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/20 border-b border-white/10">
              <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Title</th>
              <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Category</th>
              <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
              <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {posts.map(post => (
              <tr key={post._id} className="hover:bg-white/5 transition-colors">
                <td className="p-4 text-sm text-white font-medium">{post.title}</td>
                <td className="p-4 text-sm text-slate-400">{post.category}</td>
                <td className="p-4 text-sm text-slate-400">{new Date(post.createdAt).toLocaleDateString()}</td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => editPost(post)} className="text-slate-500 hover:text-cyan-400 transition-colors p-1"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => deletePost(post._id)} className="text-slate-500 hover:text-red-400 transition-colors p-1"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr><td colSpan={4} className="p-8 text-center text-slate-500">No posts found.</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
