'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ForumPost, ForumComment } from '../../types';
import { INITIAL_POSTS } from '../../data/mockPosts';
import { PLASTIC_DATA } from '../../data/plastics';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import Breadcrumb from '../../components/Breadcrumb';
import { 
  MessageSquare, 
  ThumbsUp, 
  Filter, 
  PlusCircle, 
  Share2,
  Sparkles, 
  Check, 
  BookOpen, 
  ArrowRight,
  Trash2,
  Send,
  UserCheck,
  Lock,
  ShieldCheck
} from 'lucide-react';

export default function ForumPage() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const isAdmin = profile?.role === 'admin';
  const [selectedTag, setSelectedTag] = useState<string>('Semua');
  const [showNewPostModal, setShowNewPostModal] = useState<boolean>(false);
  const [posts, setPosts] = useState<ForumPost[]>(INITIAL_POSTS);

  // Comment state per post
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [commentGuestNames, setCommentGuestNames] = useState<Record<string, string>>({});
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({});

  // Load from Supabase with localStorage fallback on mount
  useEffect(() => {
    async function fetchPosts() {
      try {
        const [postsRes, commentsRes] = await Promise.all([
          supabase.from('posts').select('*').order('created_at', { ascending: false }),
          supabase.from('comments').select('*').order('created_at', { ascending: true })
        ]);

        const cloudComments: Record<string, ForumComment[]> = {};
        if (!commentsRes.error && commentsRes.data) {
          commentsRes.data.forEach((c: any) => {
            if (!cloudComments[c.post_id]) cloudComments[c.post_id] = [];
            cloudComments[c.post_id].push({
              id: c.id,
              post_id: c.post_id,
              author: {
                name: c.author_name || 'Warga Cirebon',
                badge: c.author_badge || 'Pemula Hijau'
              },
              content: c.content,
              created_at: c.created_at ? new Date(c.created_at).toLocaleDateString('id-ID') : 'Baru saja'
            });
          });
        }

        if (!postsRes.error && postsRes.data && postsRes.data.length > 0) {
          const cloudPosts: ForumPost[] = postsRes.data.map((item: any, idx: number) => ({
            id: item.id || `post-cloud-${idx}`,
            title: item.title,
            content: item.content,
            author: {
              name: item.author_name || 'Warga Cirebon',
              badge: item.author_badge || 'Pemula Hijau'
            },
            plastic_tag: item.plastic_tag || 'Kode 1 (PET)',
            upvotes: item.upvotes || 0,
            comments_count: (cloudComments[item.id]?.length) || item.comments_count || 0,
            created_at: item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID') : 'Baru saja',
            comments: cloudComments[item.id] || []
          }));
          // Gabungkan postingan cloud terbaru dengan diskusi awal agar forum selalu hidup
          const existingTitles = new Set(cloudPosts.map(p => p.title.toLowerCase()));
          const combined = [...cloudPosts, ...INITIAL_POSTS.filter(p => !existingTitles.has(p.title.toLowerCase()))];
          setPosts(combined);
          return;
        }
      } catch (err) {
        console.warn('Supabase posts unavailable, loading local cache:', err);
      }

      // Local storage fallback
      try {
        const saved = localStorage.getItem('forum_posts');
        if (saved) {
          setPosts(JSON.parse(saved));
        } else {
          localStorage.setItem('forum_posts', JSON.stringify(INITIAL_POSTS));
        }
      } catch {
        // fallback to initial
      }
    }

    fetchPosts();
  }, []);

  // Single like enforcement per user (toggle upvote)
  const [upvotedPosts, setUpvotedPosts] = useState<Record<string, boolean>>({});

  // Load upvoted posts from localStorage on mount
  useEffect(() => {
    try {
      const savedLikes = localStorage.getItem('trashline_upvoted_posts');
      if (savedLikes) {
        setUpvotedPosts(JSON.parse(savedLikes));
      }
    } catch {}
  }, []);

  // Form State for new post
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTag, setNewTag] = useState('Kode 1 (PET)');
  const [authorName, setAuthorName] = useState('');

  // Prefill author name when user profile is available
  useEffect(() => {
    if (profile?.name && !authorName) {
      setAuthorName(profile.name);
    }
  }, [profile, authorName]);

  // Upvote toggle handler (Maksimal 1 Like per user)
  const handleUpvote = async (postId: string) => {
    const targetPost = posts.find(p => p.id === postId);
    if (!targetPost) return;

    const isCurrentlyLiked = !!upvotedPosts[postId];
    // Jika sudah pernah like: kurangi 1 (batal like). Jika belum: tambah 1 (maks 1 per user).
    const newUpvotes = isCurrentlyLiked 
      ? Math.max(0, (targetPost.upvotes || 0) - 1)
      : (targetPost.upvotes || 0) + 1;

    const nextLikedState = {
      ...upvotedPosts,
      [postId]: !isCurrentlyLiked
    };

    setUpvotedPosts(nextLikedState);
    try {
      localStorage.setItem('trashline_upvoted_posts', JSON.stringify(nextLikedState));
    } catch {}

    const updated = posts.map(p => {
      if (p.id === postId) {
        return { ...p, upvotes: newUpvotes };
      }
      return p;
    });

    setPosts(updated);
    try {
      localStorage.setItem('forum_posts', JSON.stringify(updated));
    } catch {}

    // Update in Supabase if valid UUID
    if (postId && !postId.startsWith('post-')) {
      try {
        await supabase.from('posts').update({ upvotes: newUpvotes }).eq('id', postId);
      } catch {
        // ignore
      }
    }
  };

  // Add new post handler
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const chosenName = authorName.trim() || profile?.name || 'Warga Cirebon';
    const chosenBadge = profile?.badge || 'Pemula Hijau';

    const newPostItem: ForumPost = {
      id: `post-${Date.now()}`,
      title: newTitle,
      content: newContent,
      author: {
        name: chosenName,
        badge: chosenBadge
      },
      plastic_tag: newTag,
      upvotes: 1,
      comments_count: 0,
      created_at: 'Baru saja',
      comments: []
    };

    const updated = [newPostItem, ...posts];
    setPosts(updated);
    try {
      localStorage.setItem('forum_posts', JSON.stringify(updated));
    } catch {
      // ignore
    }

    // Try sync to Supabase
    try {
      const { error } = await supabase.from('posts').insert([{
        title: newTitle,
        content: newContent,
        plastic_tag: newTag,
        author_name: chosenName,
        author_badge: chosenBadge,
        upvotes: 1
      }]);
      if (error) {
        console.warn('Supabase post insert info:', error.message);
      }
    } catch (err) {
      console.warn('Sync cloud deferred, stored in browser:', err);
    }

    setNewTitle('');
    setNewContent('');
    setShowNewPostModal(false);
  };

  // Delete post handler (Hanya Pemilik atau Admin DLH)
  const handleDeletePost = async (postId: string, title: string, postAuthorName?: string) => {
    const isOwner = profile?.name && postAuthorName && profile.name.trim().toLowerCase() === postAuthorName.trim().toLowerCase();

    if (!isAdmin && !isOwner) {
      alert('Hanya Admin Pengawas DLH atau pembuat ide yang berhak menghapus ide ini.');
      return;
    }

    const confirmMsg = isAdmin && !isOwner
      ? `Hapus ide daur ulang "${title}" sebagai Admin Pengawas DLH (Moderasi Komunitas)?`
      : `Hapus ide daur ulang "${title}" milik Anda?`;

    if (!window.confirm(confirmMsg)) return;

    const updated = posts.filter(p => p.id !== postId);
    setPosts(updated);
    try {
      localStorage.setItem('forum_posts', JSON.stringify(updated));
    } catch {}

    if (postId && !postId.startsWith('post-')) {
      try {
        const { error } = await supabase.from('posts').delete().eq('id', postId);
        if (error) {
          console.warn('Supabase delete error:', error.message);
        }
      } catch (err) {
        console.warn('Sync post delete deferred:', err);
      }
    }
  };

  // Add comment handler
  const handleAddComment = async (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!user && !profile) {
      alert('Anda harus masuk akun warga terlebih dahulu untuk dapat berkomentar.');
      router.push('/login');
      return;
    }

    const text = (commentDrafts[postId] || '').trim();
    if (!text) return;

    const currentAuthorName = profile?.name || user?.email?.split('@')[0] || 'Warga Cirebon';
    const currentAuthorBadge = profile?.badge || 'Pemula Hijau';

    const newComment: ForumComment = {
      id: `comm-${Date.now()}`,
      post_id: postId,
      author: {
        name: currentAuthorName,
        badge: currentAuthorBadge
      },
      content: text,
      created_at: 'Baru saja'
    };

    const updated = posts.map(p => {
      if (p.id === postId) {
        const updatedComments = [...(p.comments || []), newComment];
        return {
          ...p,
          comments: updatedComments,
          comments_count: updatedComments.length
        };
      }
      return p;
    });

    setPosts(updated);
    try {
      localStorage.setItem('forum_posts', JSON.stringify(updated));
    } catch {}

    setCommentDrafts(prev => ({ ...prev, [postId]: '' }));

    // Sync to Supabase comments table
    if (postId && !postId.startsWith('post-')) {
      try {
        const { error } = await supabase.from('comments').insert([{
          post_id: postId,
          content: text,
          author_name: currentAuthorName,
          author_badge: currentAuthorBadge,
          author_id: user && !user.id.startsWith('demo-') ? user.id : null
        }]);

        if (error) {
          // If schema cache hasn't loaded author_name, insert content
          await supabase.from('comments').insert([{
            post_id: postId,
            content: text,
            author_id: user && !user.id.startsWith('demo-') ? user.id : null
          }]);
        }
      } catch (err) {
        console.warn('Sync comment deferred, stored locally:', err);
      }
    }
  };

  // Delete comment handler (Hanya Pemilik atau Admin DLH)
  const handleDeleteComment = async (postId: string, commentId: string, commentAuthorName?: string) => {
    const isOwner = profile?.name && commentAuthorName && profile.name.trim().toLowerCase() === commentAuthorName.trim().toLowerCase();

    if (!isAdmin && !isOwner) {
      alert('Hanya Admin Pengawas DLH atau pemilik tanggapan yang berhak menghapus.');
      return;
    }

    const confirmMsg = isAdmin && !isOwner
      ? 'Hapus tanggapan ini sebagai Admin Pengawas DLH (Moderasi Komunitas)?'
      : 'Hapus tanggapan Anda dari diskusi?';

    if (!window.confirm(confirmMsg)) return;

    const updated = posts.map(p => {
      if (p.id === postId) {
        const filteredComments = (p.comments || []).filter(c => c.id !== commentId);
        return {
          ...p,
          comments: filteredComments,
          comments_count: filteredComments.length
        };
      }
      return p;
    });

    setPosts(updated);
    try {
      localStorage.setItem('forum_posts', JSON.stringify(updated));
    } catch {}

    if (commentId && !commentId.startsWith('comm-')) {
      try {
        await supabase.from('comments').delete().eq('id', commentId);
      } catch (err) {
        console.warn('Sync comment delete deferred:', err);
      }
    }
  };

  const filteredPosts = posts.filter(p => {
    if (selectedTag === 'Semua') return true;
    return p.plastic_tag.toLowerCase().includes(selectedTag.toLowerCase());
  });

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10 space-y-8">
      <Breadcrumb items={[{ label: 'Forum Komunitas' }]} />
      
      {/* Header Banner - Gaya Trashline Editorial */}
      <section className="rounded-[24px] sm:rounded-[28px] bg-[#F1F2EE] dark:bg-[#1A1D1A] border border-[#E5E6DF] dark:border-[#2C322C] p-6 sm:p-10 lg:p-12 shadow-[0_8px_28px_rgba(25,30,20,0.05)] flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5C7D43]/10 text-[#5C7D43] dark:text-[#84A964] text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase">
              <MessageSquare className="w-3.5 h-3.5 text-[#5C7D43]" />
              <span>KOMUNITAS SIRKULAR & UP-CYCLING</span>
            </div>
            {isAdmin && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-[10px] sm:text-[11px] font-bold tracking-wider uppercase">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Mode Moderasi Admin DLH Aktif</span>
              </div>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#171916] dark:text-[#F0F2EE] leading-[1.08]">
            Forum <span className="text-[#5C7D43] dark:text-[#D8ED78]">Ide Daur Ulang</span>,<br />
            Kreativitas Nyata dari Warga.
          </h1>

          <p className="text-xs sm:text-sm text-[#777A73] dark:text-[#A6AFA8] leading-relaxed max-w-2xl">
            Bagikan karya kreasi upcycling Anda, tanyakan solusi daur ulang untuk sampah rumah tangga, dan berikan dukungan pada ide-ide terbaik sesama penggiat lingkungan.
          </p>
        </div>

        <button
          onClick={() => {
            if (!user && !profile) {
              alert('Silakan masuk akun warga terlebih dahulu untuk membagikan ide daur ulang.');
              router.push('/login');
              return;
            }
            setShowNewPostModal(true);
          }}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#5C7D43] hover:bg-[#4E6B38] text-white font-semibold text-xs shadow-sm transition-all shrink-0 self-start md:self-end active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Bagikan Ide Anda</span>
        </button>
      </section>

      {/* Filter Tag Bar - Opsi 2: Resin Pills Interaktif */}
      <div className="bg-white dark:bg-[#1E221E] rounded-2xl border border-[#E5E6DF] dark:border-[#2C322C] p-3 sm:p-4 shadow-xs">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none max-w-full">
            <span className="text-xs font-bold text-[#777A73] dark:text-[#A6AFA8] shrink-0 flex items-center gap-1.5 mr-2">
              <Filter className="w-3.5 h-3.5 text-[#5C7D43]" />
              Filter Plastik:
            </span>

            {/* Tombol Semua */}
            <button
              onClick={() => setSelectedTag('Semua')}
              className={`px-3.5 py-1.5 rounded-full text-[11px] font-semibold shrink-0 transition-all ${
                selectedTag === 'Semua'
                  ? 'bg-[#171916] text-white dark:bg-[#F0F2EE] dark:text-[#171916]'
                  : 'bg-[#F1F2EE] dark:bg-[#121412] text-[#777A73] dark:text-[#A6AFA8] hover:bg-[#E5E6DF]'
              }`}
            >
              Semua Topik
            </button>

            {/* Tombol 7 Kode Resin Berwarna */}
            {PLASTIC_DATA.map((p) => {
              const isSelected = selectedTag === p.code || selectedTag === `Kode ${p.id}`;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedTag(isSelected ? 'Semua' : p.code)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-semibold shrink-0 transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'text-white shadow-xs scale-105 ring-2 ring-black/15 dark:ring-white/20'
                      : 'bg-[#F1F2EE] dark:bg-[#121412] text-[#777A73] dark:text-[#A6AFA8] hover:opacity-85'
                  }`}
                  style={{ backgroundColor: isSelected ? p.color : undefined }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: isSelected ? '#ffffff' : p.color }}
                  />
                  <span>♳{p.id} {p.code}</span>
                </button>
              );
            })}
          </div>

          <div className="text-xs font-semibold text-[#777A73] dark:text-[#A6AFA8] shrink-0 ml-auto">
            Menampilkan <strong className="text-[#171916] dark:text-[#F0F2EE]">{filteredPosts.length}</strong> ide
          </div>
        </div>
      </div>

      {/* Posts Feed - Opsi 3: Desain Kartu Postingan Trashline */}
      <div className="space-y-6">
        {filteredPosts.map((post) => {
          // Cari data warna plastik yang cocok dengan post
          const matchedPlastic = PLASTIC_DATA.find((p) => 
            post.plastic_tag.includes(p.code) || post.plastic_tag.includes(String(p.id))
          );
          const tagBgColor = matchedPlastic?.color || '#5C7D43';

          return (
            <article
              key={post.id}
              className="bg-white dark:bg-[#1E221E] rounded-3xl border border-[#E5E6DF] dark:border-[#2C322C] p-6 sm:p-8 shadow-xs space-y-5 hover:border-[#5C7D43]/40 transition-all"
            >
              {/* Post Author Bar */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-[#5C7D43]/15 text-[#5C7D43] dark:text-[#84A964] border border-[#5C7D43]/20 flex items-center justify-center font-bold text-sm shrink-0">
                    {post.author.name[0]?.toUpperCase() || 'P'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-[#171916] dark:text-[#F0F2EE]">
                        {post.author.name}
                      </span>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full font-semibold bg-[#5C7D43]/10 text-[#5C7D43] dark:text-[#84A964]">
                        {post.author.badge}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#777A73] dark:text-[#A6AFA8]">{post.created_at}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Resin Tag Pill with Link to Kamus */}
                  {matchedPlastic ? (
                    <Link
                      href="/kamus"
                      title={`Pelajari karakteristik ${matchedPlastic.code} di Kamus`}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F1F2EE] dark:bg-[#121412] hover:bg-[#5C7D43]/15 text-[#171916] dark:text-[#F0F2EE] text-[11px] font-semibold border border-[#E5E6DF]/70 dark:border-[#2C322C]/70 transition-colors group/tag"
                    >
                      <span 
                        className="w-2 h-2 rounded-full shrink-0" 
                        style={{ backgroundColor: tagBgColor }}
                      />
                      <span>{post.plastic_tag}</span>
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover/tag:opacity-100 transition-opacity text-[#5C7D43] -ml-0.5" />
                    </Link>
                  ) : (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F1F2EE] dark:bg-[#121412] text-[#171916] dark:text-[#F0F2EE] text-[11px] font-semibold border border-[#E5E6DF]/70 dark:border-[#2C322C]/70">
                      <span 
                        className="w-2 h-2 rounded-full shrink-0" 
                        style={{ backgroundColor: tagBgColor }}
                      />
                      <span>{post.plastic_tag}</span>
                    </div>
                  )}

                  {/* Tombol Hapus Postingan (Hanya Admin DLH atau Pembuat Ide) */}
                  {(isAdmin || (profile?.name && post.author.name.trim().toLowerCase() === profile.name.trim().toLowerCase())) && (
                    <button
                      onClick={() => handleDeletePost(post.id, post.title, post.author.name)}
                      title={isAdmin && post.author.name !== profile?.name ? "Hapus ide ini (Wewenang Moderasi Admin DLH)" : "Hapus ide Anda"}
                      className="p-1.5 rounded-full text-[#777A73] hover:text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Post Title & Content */}
              <div className="space-y-2">
                <h2 className="text-lg sm:text-xl font-bold text-[#171916] dark:text-[#F0F2EE] leading-snug tracking-tight">
                  {post.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#777A73] dark:text-[#A6AFA8] leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>
              </div>

              {/* Quick Link to Kamus Plastik */}
              {matchedPlastic && (
                <div className="p-3 rounded-2xl bg-[#F1F2EE]/50 dark:bg-[#121412]/40 border border-[#E5E6DF]/60 dark:border-[#2C322C]/60 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-[#777A73] dark:text-[#A6AFA8]">
                    <BookOpen className="w-3.5 h-3.5 text-[#5C7D43]" />
                    <span className="text-[11px]">
                      Bahan ide ini menggunakan <strong className="text-[#171916] dark:text-[#F0F2EE]">♳{matchedPlastic.id} {matchedPlastic.code}</strong> ({matchedPlastic.name})
                    </span>
                  </div>
                  <Link
                    href="/kamus"
                    className="text-[11px] font-semibold text-[#5C7D43] dark:text-[#84A964] hover:underline flex items-center gap-1 shrink-0"
                  >
                    <span>Pelajari Plastik Ini</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}

              {/* Action Bar (Upvote, Comment count, Share) */}
              <div className="flex items-center justify-between pt-4 border-t border-[#E5E6DF]/70 dark:border-[#2C322C]/70 text-xs font-semibold">
                <div className="flex items-center gap-3">
                  {(() => {
                    const isLiked = !!upvotedPosts[post.id];
                    return (
                      <button
                        onClick={() => handleUpvote(post.id)}
                        title={isLiked ? "Batalkan dukungan" : "Beri 1 dukungan (maksimal 1 per warga)"}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all active:scale-95 group ${
                          isLiked
                            ? 'bg-[#5C7D43] text-white shadow-xs'
                            : 'bg-[#5C7D43]/10 hover:bg-[#5C7D43] text-[#5C7D43] hover:text-white dark:text-[#84A964] dark:hover:text-white'
                        }`}
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 transition-transform ${isLiked ? 'fill-current' : 'group-hover:scale-110'}`} />
                        <span>{post.upvotes} Dukungan{isLiked ? ' (Didukung)' : ''}</span>
                      </button>
                    );
                  })()}

                  <div className="flex items-center gap-1.5 text-[#777A73] dark:text-[#A6AFA8] px-3 py-2 rounded-full bg-[#F1F2EE] dark:bg-[#121412]">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{post.comments?.length || post.comments_count} Diskusi</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    alert('Tautan ide berhasil disalin!');
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full text-[#777A73] dark:text-[#A6AFA8] hover:text-[#171916] dark:hover:text-[#F0F2EE] hover:bg-[#F1F2EE] dark:hover:bg-[#121412] transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Bagikan</span>
                </button>
              </div>

              {/* Comments Section & Input */}
              <div className="pt-4 space-y-3 border-t border-[#E5E6DF]/70 dark:border-[#2C322C]/70">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#777A73] dark:text-[#A6AFA8] uppercase tracking-wider">
                    Diskusi & Masukan Warga ({post.comments?.length || 0})
                  </span>
                </div>

                {/* Existing Comments List */}
                {post.comments && post.comments.length > 0 && (
                  <div className="space-y-2">
                    {post.comments.map((comment) => (
                      <div 
                        key={comment.id}
                        className="p-3.5 rounded-2xl bg-[#F1F2EE]/60 dark:bg-[#121412]/50 text-xs space-y-1.5 border border-[#E5E6DF]/40 dark:border-[#2C322C]/40 group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[#171916] dark:text-[#F0F2EE]">{comment.author.name}</span>
                            <span className="text-[9px] px-2 py-0.5 rounded-full bg-white dark:bg-[#1E221E] text-[#5C7D43] dark:text-[#84A964] font-semibold border border-[#E5E6DF]/60 dark:border-[#2C322C]/60">
                              {comment.author.badge}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-[#777A73] dark:text-[#A6AFA8]">{comment.created_at}</span>
                            {(isAdmin || (profile?.name && comment.author.name.trim().toLowerCase() === profile.name.trim().toLowerCase())) && (
                              <button
                                onClick={() => handleDeleteComment(post.id, comment.id, comment.author.name)}
                                title={isAdmin && comment.author.name !== profile?.name ? "Hapus tanggapan (Wewenang Moderasi Admin DLH)" : "Hapus tanggapan Anda"}
                                className={`p-1 rounded-md transition-all flex items-center gap-1 ${
                                  isAdmin && comment.author.name !== profile?.name
                                    ? "text-red-500 hover:text-red-700 hover:bg-red-500/10 opacity-90 hover:opacity-100" 
                                    : "text-[#777A73] hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100"
                                }`}
                              >
                                <Trash2 className="w-3 h-3" />
                                {isAdmin && comment.author.name !== profile?.name && (
                                  <span className="text-[9px] font-bold text-red-600 dark:text-red-400">Moderasi</span>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-[#777A73] dark:text-[#A6AFA8] leading-relaxed">
                          {comment.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Form Input Komentar Baru (Hanya Jika Sudah Login) */}
                {user || profile ? (
                  <form onSubmit={(e) => handleAddComment(post.id, e)} className="pt-2 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-[#777A73] dark:text-[#A6AFA8]">
                      <span>Tulis Tanggapan / Tips untuk Ide Ini:</span>
                      <span className="font-medium text-[#5C7D43] dark:text-[#84A964]">
                        Komentar sebagai: <strong>{profile?.name || user?.email?.split('@')[0]}</strong> ({profile?.badge || 'Pemula Hijau'})
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Tulis ide tambahan, saran pemilahan, atau pertanyaan..."
                        value={commentDrafts[post.id] || ''}
                        onChange={(e) => setCommentDrafts(prev => ({ ...prev, [post.id]: e.target.value }))}
                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#F1F2EE] dark:bg-[#121412] border border-[#E5E6DF]/60 dark:border-[#2C322C]/60 focus:border-[#5C7D43] focus:bg-white dark:focus:bg-[#1E221E] text-xs text-[#171916] dark:text-[#F0F2EE]"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2.5 rounded-xl bg-[#5C7D43] hover:bg-[#4E6B38] text-white text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 shrink-0 shadow-xs"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Kirim</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="p-4 rounded-2xl bg-[#F1F2EE]/70 dark:bg-[#121412]/60 border border-[#E5E6DF]/70 dark:border-[#2C322C]/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 text-[#777A73] dark:text-[#A6AFA8]">
                      <Lock className="w-4 h-4 text-[#5C7D43] shrink-0" />
                      <span>Masuk akun warga terlebih dahulu untuk ikut berdiskusi dan memberikan tanggapan pada ide ini.</span>
                    </div>
                    <Link
                      href="/login"
                      className="px-4 py-2 rounded-full bg-[#5C7D43] hover:bg-[#4E6B38] text-white font-semibold text-xs shrink-0 transition-all active:scale-95 shadow-xs flex items-center gap-1"
                    >
                      <span>Masuk Akun</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* New Post Modal - Trashline Design */}
      {showNewPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1E221E] rounded-[28px] p-6 sm:p-8 max-w-lg w-full border border-[#E5E6DF] dark:border-[#2C322C] shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E6DF]/70 dark:border-[#2C322C]/70">
              <div>
                <span className="text-[10px] font-bold text-[#5C7D43] dark:text-[#84A964] uppercase tracking-wider block mb-1">
                  Kontribusi Komunitas
                </span>
                <h3 className="font-bold text-lg text-[#171916] dark:text-[#F0F2EE]">
                  Bagikan Ide Daur Ulang
                </h3>
              </div>
              <button
                onClick={() => setShowNewPostModal(false)}
                className="w-8 h-8 rounded-full bg-[#F1F2EE] dark:bg-[#121412] text-[#777A73] hover:text-[#171916] dark:hover:text-[#F0F2EE] flex items-center justify-center text-sm font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
              {profile && (
                <div className="p-3 rounded-2xl bg-[#5C7D43]/10 border border-[#5C7D43]/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-[#5C7D43]" />
                    <span className="text-[#171916] dark:text-[#F0F2EE]">
                      Posting sebagai: <strong>{profile.name}</strong>
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#5C7D43] text-white font-semibold">
                    {profile.badge}
                  </span>
                </div>
              )}

              <div>
                <label className="font-semibold text-[#171916] dark:text-[#F0F2EE] block mb-1.5">
                  Nama Anda / Komunitas:
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Budi Santoso (Komunitas Cirebon Bersih)"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F1F2EE] dark:bg-[#121412] border border-transparent focus:border-[#5C7D43] focus:bg-white dark:focus:bg-[#1E221E] focus:ring-2 focus:ring-[#5C7D43]/20 transition-all text-[#171916] dark:text-[#F0F2EE] placeholder-[#777A73]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#171916] dark:text-[#F0F2EE] block mb-1.5">
                  Kategori Jenis Plastik:
                </label>
                <select
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F1F2EE] dark:bg-[#121412] border border-transparent focus:border-[#5C7D43] focus:bg-white dark:focus:bg-[#1E221E] focus:ring-2 focus:ring-[#5C7D43]/20 transition-all text-[#171916] dark:text-[#F0F2EE]"
                >
                  <option value="Kode 1 (PET)">Kode 1: PET (Botol Bening)</option>
                  <option value="Kode 2 (HDPE)">Kode 2: HDPE (Botol Sampo/Jeriken)</option>
                  <option value="Kode 3 (PVC)">Kode 3: PVC (Pipa/Kabel)</option>
                  <option value="Kode 4 (LDPE)">Kode 4: LDPE (Kantong Kresek/Wrap)</option>
                  <option value="Kode 5 (PP)">Kode 5: PP (Cup Minuman/Kotak Makan)</option>
                  <option value="Kode 6 (PS)">Kode 6: PS (Styrofoam)</option>
                  <option value="Kode 7 (OTHER)">Kode 7: OTHER (Saset/Multilayer)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-[#171916] dark:text-[#F0F2EE] block mb-1.5">
                  Judul Ide Daur Ulang:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pot Tanaman Hidroponik Vertikal dari Botol PET Bekas"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F1F2EE] dark:bg-[#121412] border border-transparent focus:border-[#5C7D43] focus:bg-white dark:focus:bg-[#1E221E] focus:ring-2 focus:ring-[#5C7D43]/20 transition-all text-[#171916] dark:text-[#F0F2EE] placeholder-[#777A73]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#171916] dark:text-[#F0F2EE] block mb-1.5">
                  Uraian Langkah & Panduan:
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tuliskan alat/bahan yang dibutuhkan, langkah pemotongan, dan tips keamanan pengerjaannya..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#F1F2EE] dark:bg-[#121412] border border-transparent focus:border-[#5C7D43] focus:bg-white dark:focus:bg-[#1E221E] focus:ring-2 focus:ring-[#5C7D43]/20 transition-all text-[#171916] dark:text-[#F0F2EE] placeholder-[#777A73] leading-relaxed"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowNewPostModal(false)}
                  className="px-4 py-2.5 rounded-full font-semibold text-[#777A73] hover:text-[#171916] dark:hover:text-[#F0F2EE] hover:bg-[#F1F2EE] dark:hover:bg-[#121412] transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full font-semibold bg-[#5C7D43] hover:bg-[#4E6B38] text-white shadow-sm transition-all active:scale-95"
                >
                  Publikasikan Ide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
