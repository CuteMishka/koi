import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Article() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const docRef = doc(db, "news", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setArticle(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-koi-800"></div></div>;
  if (!article) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">Article not found.</div>;

  return (
    // ИСПРАВЛЕНИЕ: Убран класс pt-24. Теперь фон картинки под хедером.
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      
      {/* Article Header Image */}
      <div className="w-full h-[500px] relative bg-koi-900 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-koi-900 via-black/20 to-black/30 z-10"></div>
          <img 
            src={article.image} 
            className="w-full h-full object-cover absolute inset-0 z-0" 
            alt={article.title}
            onError={(e) => e.target.src='https://images.unsplash.com/photo-1579684385127-1ef15d508118'}
          />
          
          <div className="absolute bottom-0 left-0 w-full z-20 p-8 md:p-16 text-white max-w-5xl mx-auto">
              {/* Кнопка назад поднята выше контента */}
              <div className="mb-8">
                <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-white/80 hover:text-koi-orange transition bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                    <ArrowLeft size={16}/> Back to News
                </Link>
              </div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <span className="bg-koi-orange/90 text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-wider mb-4 inline-block shadow-lg">
                    {article.category}
                </span>
                <h1 className="text-3xl md:text-5xl font-bold font-display leading-tight mb-6 text-shadow-sm">
                    {article.title}
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-white/90">
                    <span className="flex items-center gap-2"><Calendar size={18} className="text-koi-orange"/> {article.date?.seconds ? new Date(article.date.seconds * 1000).toLocaleDateString() : "Just Now"}</span>
                    <span className="flex items-center gap-2"><User size={18} className="text-koi-orange"/> {article.author || "Editorial Team"}</span>
                </div>
              </motion.div>
          </div>
      </div>

      {/* Article Content */}
      <main className="max-w-4xl mx-auto px-6 -mt-10 relative z-30">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-slate-100"
          >
              <div className="prose prose-lg prose-slate max-w-none">
                  {article.desc.split('\n').map((paragraph, idx) => (
                      <p key={idx} className="mb-6 text-slate-700 leading-8 text-lg">
                          {paragraph}
                      </p>
                  ))}
              </div>
          </motion.div>
      </main>

    </div>
  );
}