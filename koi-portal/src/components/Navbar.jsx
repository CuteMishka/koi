import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { User, LogOut, Phone, Lock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const { lang, setLang, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  // Хедер синий, если: Dashboard ИЛИ Читаем статью ИЛИ Страница видео
  const isSolidHeader = 
    location.pathname === '/dashboard' || 
    location.pathname.includes('/news/') ||
    location.pathname === '/videos';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => { unsubscribe(); window.removeEventListener('scroll', handleScroll); };
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const langClass = (current) => 
    `cursor-pointer transition ${lang === current ? 'text-white font-bold scale-110' : 'hover:text-white opacity-70'}`;

  const navbarBg = (isSolidHeader || scrolled) ? 'bg-koi-900 shadow-lg py-2' : 'bg-transparent py-4';

  return (
    <div className={`fixed w-full z-50 transition-all duration-500 ${navbarBg}`}>
      
      {/* Top Bar */}
      <div className={`border-b border-white/10 pb-2 mb-2 transition-all duration-300 ${scrolled ? 'hidden opacity-0' : 'block opacity-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-8 flex justify-end items-center text-xs font-medium text-slate-400 gap-6">
            <div className="flex gap-3 select-none">
                <span onClick={() => setLang('EN')} className={langClass('EN')}>EN</span>
                <span onClick={() => setLang('KZ')} className={langClass('KZ')}>KZ</span>
                <span onClick={() => setLang('RU')} className={langClass('RU')}>RU</span>
            </div>
            <div className="flex items-center gap-2 hover:text-white cursor-pointer transition">
                <Phone size={12} />
                <span>+7 (727) 300-00-00</span>
            </div>
            {!user && (
              <Link to="/auth" className="flex items-center gap-2 hover:text-white cursor-pointer transition">
                  <Lock size={12} />
                  <span>Staff Portal</span>
              </Link>
            )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          
          <Link to="/" className="flex items-center gap-3 group">
            <img src="/logo.svg" alt="KOI" className="h-9 brightness-0 invert transition-transform group-hover:scale-105" />
            <div className="hidden md:block leading-none text-white">
              <div className="font-extrabold text-lg tracking-wide font-display">KOI</div>
            </div>
          </Link>

          {!isSolidHeader && location.pathname !== '/dashboard' && (
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-sm font-medium text-slate-300 hover:text-white transition">{t('institute')}</Link>
              {/* Ссылка на видео */}
              <Link to="/videos" className="text-sm font-medium text-slate-300 hover:text-white transition">{t('videos')}</Link>
              <Link to="/" className="text-sm font-medium text-slate-300 hover:text-white transition">{t('patients')}</Link>
              <Link to="/" className="text-sm font-medium text-slate-300 hover:text-white transition">{t('research')}</Link>
            </div>
          )}
          
          {/* Если мы на странице видео (где хедер синий), показываем меню тоже */}
          {location.pathname === '/videos' && (
             <div className="hidden md:flex items-center gap-8">
               <Link to="/" className="text-sm font-medium text-white/80 hover:text-white transition">{t('institute')}</Link>
               <Link to="/videos" className="text-sm font-bold text-white transition border-b-2 border-koi-orange">{t('videos')}</Link>
             </div>
          )}

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/dashboard" className={`flex items-center gap-2 px-4 py-2 rounded-full transition text-sm font-medium border ${isSolidHeader ? 'bg-white text-koi-900 border-white font-bold' : 'bg-white/10 text-white border-white/10 hover:bg-white/20'}`}>
                  <User size={16} /> <span className="hidden sm:inline">{t('cabinet')}</span>
                </Link>
                <button onClick={handleLogout} className="text-slate-400 hover:text-red-400 transition p-2 bg-white/5 rounded-full">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link to="/auth#register" className="bg-koi-orange hover:bg-orange-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5">
                {t('bookBtn')}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}