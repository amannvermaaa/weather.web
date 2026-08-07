'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Loader2, MessageSquare, Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';

export default function BlogPostClient({ slug }: { slug: string }) {
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, token } = useAuth();

  useEffect(() => {
    fetchPostData();
  }, [slug]);

  const fetchPostData = async () => {
    setLoading(true);
    try {
      const postRes = await fetch(`http://localhost:5000/blog/${slug}`);
      if (postRes.ok) {
        const postData = await postRes.json();
        setPost(postData);
        
        const commentsRes = await fetch(`http://localhost:5000/blog/${postData._id}/comments`);
        if (commentsRes.ok) setComments(await commentsRes.json());
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !post) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`http://localhost:5000/blog/${post._id}/comments`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ content: newComment })
      });
      if (res.ok) {
        const c = await res.json();
        setComments([c, ...comments]);
        setNewComment('');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center py-32"><Loader2 className="w-8 h-8 animate-spin text-cyan-400" /></div>;
  if (!post) return <div className="text-center py-32 text-slate-500">Post not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 pt-28">
      <Link href="/blog" className="text-cyan-400 hover:underline mb-8 inline-block">&larr; Back to all posts</Link>
      
      <div className="mb-12">
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 mb-4 inline-block">
          {post.category}
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">{post.title}</h1>
        <div className="flex items-center gap-3 text-sm text-slate-400">
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold">
            {post.author?.email?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-white">{post.author?.email}</p>
            <p>{new Date(post.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <div className="prose prose-invert prose-cyan max-w-none mb-16">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>

      <div className="border-t border-white/10 pt-12">
        <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-cyan-400" /> Comments ({comments.length})
        </h3>
        
        {user ? (
          <form onSubmit={submitComment} className="mb-10">
            <textarea 
              required
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Leave a comment..."
              className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 min-h-[100px] mb-4"
            />
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-6 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Post Comment
            </button>
          </form>
        ) : (
          <div className="bg-slate-900/50 border border-white/10 rounded-xl p-6 text-center mb-10">
            <p className="text-slate-400">Please log in to leave a comment.</p>
          </div>
        )}

        <div className="space-y-6">
          {comments.map(c => (
            <div key={c._id} className="bg-slate-900/30 border border-white/5 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white text-xs font-bold">
                  {c.user?.email?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{c.user?.email}</p>
                  <p className="text-xs text-slate-500">{new Date(c.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <p className="text-slate-300 text-sm whitespace-pre-wrap">{c.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
