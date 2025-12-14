import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { User, LogOut, Phone, Lock, Menu, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => { unsubscribe(); window.removeEventListener('scroll', handleScroll); };
  }, []);

  // Закрываем мобильное меню при переходе
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const langClass = (current) => 
    `cursor-pointer transition ${lang === current ? 'text-white font-bold scale-110' : 'hover:text-white opacity-70'}`;

  // ЛОГИКА ФОНА:
  // Если мы НЕ на главной ('/') -> Всегда темный синий фон (#021024)
  // Если мы на главной, но скроллим -> Темный синий фон
  // Иначе (на главной наверху) -> Прозрачный
  const isNotHome = location.pathname !== '/';
  const navbarBg = (isNotHome || scrolled || mobileMenuOpen) 
    ? 'bg-[#021024] shadow-lg py-2' 
    : 'bg-transparent py-4';

  // Хелпер для активных ссылок
  const getLinkClass = (path) => 
    `text-sm font-medium transition ${location.pathname === path ? 'text-white font-bold border-b-2 border-[#f06439] pb-1' : 'text-slate-300 hover:text-white'}`;

  return (
    <div className={`fixed w-full z-50 transition-all duration-300 ${navbarBg}`}>
      
      {/* Top Bar (исчезает при скролле) */}
      <div className={`hidden md:block border-b border-white/10 pb-2 mb-2 transition-all duration-300 ${scrolled ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 h-auto'}`}>
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
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group z-50">
            <img src="/logo.svg" alt="KOI" className="h-9 brightness-0 invert transition-transform group-hover:scale-105" />
            <div className="hidden md:block leading-none text-white">
              <div className="font-extrabold text-lg tracking-wide font-display">KOI</div>
            </div>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className={getLinkClass('/')}>{t('institute')}</Link>
            
            {/* Вкладка Events */}
            <Link to="/events" className={getLinkClass('/events')}>{t('events')}</Link>
            
            <Link to="/videos" className={getLinkClass('/videos')}>{t('videos')}</Link>
            <Link to="/" className="text-sm font-medium text-slate-300 hover:text-white transition">{t('patients')}</Link>
            <Link to="/" className="text-sm font-medium text-slate-300 hover:text-white transition">{t('research')}</Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4 z-50">
            
            {/* Языки на мобилках */}
            <div className="flex md:hidden gap-3 text-[10px] text-white font-bold mr-2">
                <span onClick={() => setLang('EN')} className={lang === 'EN' ? 'text-[#f06439]' : 'opacity-50'}>EN</span>
                <span onClick={() => setLang('KZ')} className={lang === 'KZ' ? 'text-[#f06439]' : 'opacity-50'}>KZ</span>
            </div>

            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 rounded-full transition text-sm font-medium border bg-white/10 text-white border-white/10 hover:bg-white/20">
                  <User size={16} /> <span className="hidden sm:inline">{t('cabinet')}</span>
                </Link>
                {/* Кнопка выхода */}
                <button onClick={handleLogout} className="hidden md:flex items-center justify-center w-9 h-9 rounded-full bg-white/10 text-white/70 hover:bg-[#f06439] hover:text-white transition" title="Log Out">
                    <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link to="/auth#register" className="hidden md:block bg-[#f06439] hover:bg-orange-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5">
                {t('bookBtn')}
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button className="md:hidden text-white p-1 focus:outline-none" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* MOBILE MENU OVERLAY */}
      {mobileMenuOpen && (
        <div className="absolute top-0 left-0 w-full h-screen bg-[#021024] pt-24 px-6 flex flex-col gap-6 md:hidden animate-fade-in z-40">
            <Link to="/" className="text-xl font-bold text-white border-b border-white/10 pb-4">{t('institute')}</Link>
            
            {/* Events в моб меню */}
            <Link to="/events" className="text-xl font-bold text-white border-b border-white/10 pb-4 flex justify-between items-center">
                {t('events')} <span className="text-[#f06439] text-xs uppercase tracking-wider">New</span>
            </Link>
            
            <Link to="/videos" className="text-xl font-bold text-white border-b border-white/10 pb-4">{t('videos')}</Link>
            <Link to="/" className="text-xl font-bold text-white border-b border-white/10 pb-4">{t('patients')}</Link>
            
            {!user ? (
                <Link to="/auth" className="bg-[#f06439] text-white py-3 rounded-lg text-center font-bold mt-4 shadow-lg">
                    {t('bookBtn')}
                </Link>
            ) : (
                <button onClick={handleLogout} className="flex items-center justify-center gap-2 bg-white/10 text-white py-4 rounded-xl font-bold mt-4">
                    <LogOut size={20} /> Log Out
                </button>
            )}
        </div>
      )}
    </div>
  );
}