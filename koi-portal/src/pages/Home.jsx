import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { ArrowRight, PlayCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';

export default function Home() {
  const { t } = useLanguage();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const q = query(collection(db, "news"), orderBy("date", "desc"));
        const snapshot = await getDocs(q);
        setNews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (e) {
        console.error("Error fetching news:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      
      <header className="relative pt-32 pb-48 bg-koi-900 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
            <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] opacity-60"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div className="inline-block py-1.5 px-5 rounded-full border border-white/20 bg-white/5 text-blue-200 text-[11px] font-bold tracking-[0.15em] uppercase mb-8 backdrop-blur-sm">
                    National Center of Excellence
                </div>
                
                <h1 className="text-5xl md:text-7xl font-extrabold text-white font-display leading-[1.1] mb-8 tracking-tight">
                    {t('heroTitle')} <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
                      {t('heroTitleCare')}
                    </span>
                </h1>
                
                <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
                    {t('heroSubtitle')}
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center gap-5">
                    <button className="bg-transparent border border-slate-500 hover:border-white text-white px-8 py-3.5 rounded font-semibold transition hover:bg-white/5">
                        {t('findDoc')}
                    </button>
                    
                    {/* ИСПРАВЛЕНИЕ: Кнопка Watch Video теперь Link */}
                    <Link to="/videos" className="flex items-center justify-center gap-2 bg-transparent text-white px-8 py-3.5 rounded font-semibold transition hover:text-blue-300 group">
                        <PlayCircle size={20} className="group-hover:scale-110 transition-transform"/>
                        {t('watchVideo')}
                    </Link>
                </div>
            </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 w-full border-t border-white/5 bg-black/10 backdrop-blur-sm py-8">
            <div className="max-w-6xl mx-auto flex flex-wrap justify-center md:justify-between gap-8 px-8 text-center text-white">
                <div className="flex-1">
                    <div className="text-3xl font-bold mb-1">12k+</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Patients</div>
                </div>
                <div className="flex-1 border-l border-white/10">
                    <div className="text-3xl font-bold mb-1">450</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Doctors</div>
                </div>
                <div className="flex-1 border-l border-white/10">
                    <div className="text-3xl font-bold mb-1">98%</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Satisfaction</div>
                </div>
            </div>
        </div>
      </header>

      <section className="relative z-20 px-4 pb-24">
        <div className="max-w-7xl mx-auto">
            <div className="absolute -top-20 left-4 md:left-8">
                <span className="text-koi-orange font-bold uppercase text-[10px] tracking-[0.2em] mb-2 block">
                  {t('latestUpdates')}
                </span>
                <h2 className="text-3xl font-bold text-white font-display">
                  {t('newsTitle')}
                </h2>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                {loading ? (
                    <div className="col-span-3 text-center py-20 text-slate-400">Loading updates...</div>
                ) : news.length === 0 ? (
                    <div className="col-span-3 text-center py-20 text-slate-400 bg-white rounded-lg shadow-sm">No news available.</div>
                ) : (
                    news.map((item, index) => (
                        <motion.article 
                            key={item.id}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-lg overflow-hidden shadow-card hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group cursor-pointer flex flex-col h-[420px]"
                        >
                            <Link to={`/news/${item.id}`} className="flex flex-col h-full">
                                <div className="relative h-48 overflow-hidden bg-slate-200">
                                    <span className="absolute top-4 left-4 z-10 bg-white text-koi-900 text-[10px] font-extrabold px-3 py-1 rounded uppercase tracking-wide shadow-sm">
                                        {item.category}
                                    </span>
                                    <img 
                                        src={item.image} 
                                        alt={item.title} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                                        onError={(e) => e.target.src='https://images.unsplash.com/photo-1579684385127-1ef15d508118'}
                                    />
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-3">
                                        {item.date?.seconds ? new Date(item.date.seconds * 1000).toLocaleDateString() : "Just Now"}
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-3 leading-snug font-display group-hover:text-koi-800 transition line-clamp-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-slate-500 text-sm line-clamp-3 leading-relaxed mb-4 flex-grow">
                                        {item.desc}
                                    </p>
                                    <div className="flex items-center text-koi-orange text-sm font-bold gap-2 group-hover:gap-3 transition-all mt-auto">
                                        Read Full Story <ArrowRight size={16} />
                                    </div>
                                </div>
                            </Link>
                        </motion.article>
                    ))
                )}
            </div>
        </div>
      </section>
    </div>
  );
}