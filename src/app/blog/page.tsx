'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Loader2 } from 'lucide-react';

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    fetchPosts();
  }, [search, category]);

  const fetchPosts = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category !== 'All') params.append('category', category);

    fetch(`http://localhost:5000/blog?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(console.error);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 pt-28">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 mb-4">
          WeatherWeb Intel
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Deep dives into meteorology, climate tech, and the science behind the weather.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900/50 border border-white/10 rounded-full py-3 pl-12 pr-4 text-white focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-slate-900/50 border border-white/10 rounded-full px-6 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
        >
          <option value="All">All Categories</option>
          <option value="Meteorology">Meteorology</option>
          <option value="Climate">Climate</option>
          <option value="Updates">App Updates</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-cyan-400" /></div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 text-slate-500">No articles found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <Link key={post._id} href={`/blog/${post.slug}`} className="group block">
              <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 h-full hover:border-cyan-500/50 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400">
                    {post.category}
                  </span>
                  <span className="text-xs text-slate-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  {post.title}
                </h2>
                <p className="text-sm text-slate-400 line-clamp-3">
                  {post.seoDescription || "Read more about this topic..."}
                </p>
                <div className="mt-4 pt-4 border-t border-white/5 text-xs text-slate-500 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-white">
                    {post.author?.email?.charAt(0).toUpperCase()}
                  </div>
                  {post.author?.email}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
