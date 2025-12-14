import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

export default function Videos() {
  const { t } = useLanguage();

  const videoList = [
    { id: "M7lc1UVf-VE", title: "Modern Oncology Methods", category: "Technology" },
    { id: "dQw4w9WgXcQ", title: "Patient Care Guidelines", category: "Patients" },
    { id: "ysz5S6P_ks0", title: "Institute Overview 2025", category: "Institute" },
    { id: "jNQXAC9IVRw", title: "Research Grants Update", category: "Research" },
  ];

  return (
    // ИСПРАВЛЕНИЕ: pt-40 для большого отступа сверху
    <div className="min-h-screen bg-slate-50 font-sans pt-40 pb-20">
      
      {/* Заголовок */}
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-koi-orange font-bold uppercase text-xs tracking-widest mb-3 block">Educational Resources</span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-koi-900 font-display">{t('videos')}</h1>
            <div className="w-20 h-1 bg-koi-orange mx-auto mt-6 rounded-full"></div>
        </motion.div>
      </div>

      {/* Сетка видео */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10">
        {videoList.map((video, index) => (
            <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group border border-slate-100"
            >
                <div className="relative aspect-video bg-black group-hover:opacity-90 transition-opacity">
                    <iframe 
                        className="w-full h-full absolute inset-0"
                        src={`https://www.youtube.com/embed/${video.id}`} 
                        title={video.title}
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                    ></iframe>
                </div>
                
                <div className="p-8">
                    <span className="text-koi-800 text-[10px] font-bold px-3 py-1.5 bg-blue-50 rounded uppercase tracking-wider mb-4 inline-block">
                        {video.category}
                    </span>
                    <h3 className="text-xl font-bold text-slate-800 font-display leading-tight group-hover:text-koi-800 transition">
                        {video.title}
                    </h3>
                </div>
            </motion.div>
        ))}
      </div>
    </div>
  );
}