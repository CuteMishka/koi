import React from 'react';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    // ИСПРАВЛЕНИЕ: -mt-1 (отрицательный отступ вверх) убирает щель
    // Убраны все border-t, чтобы не было линий
    <footer className="bg-koi-900 text-slate-400 pt-20 pb-10 font-sans relative z-50 -mt-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        
        <div className="col-span-1">
          <div className="flex items-center gap-3 mb-6">
            <img src="/logo.svg" className="h-8 brightness-0 invert opacity-90" alt="Logo" />
            <span className="text-white font-bold font-display tracking-widest text-lg">KOI</span>
          </div>
          <p className="text-sm leading-relaxed mb-6 opacity-80">
            {t('footerDesc')}
          </p>
          <div className="flex gap-4">
             <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-koi-orange transition cursor-pointer text-white"><i className="fab fa-facebook-f text-xs"></i></div>
             <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-koi-orange transition cursor-pointer text-white"><i className="fab fa-instagram text-xs"></i></div>
             <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-koi-orange transition cursor-pointer text-white"><i className="fab fa-linkedin-in text-xs"></i></div>
          </div>
        </div>
        
        <div>
          <h4 className="text-white font-bold mb-6 font-display text-sm uppercase tracking-wider">{t('institute')}</h4>
          <ul className="space-y-3 text-sm">
            <li><a href="#" className="hover:text-white transition flex items-center gap-2 group"><ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-koi-orange"/> About Us</a></li>
            <li><a href="#" className="hover:text-white transition flex items-center gap-2 group"><ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-koi-orange"/> Leadership</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6 font-display text-sm uppercase tracking-wider">{t('patients')}</h4>
          <ul className="space-y-3 text-sm">
             <li><a href="#" className="hover:text-white transition flex items-center gap-2 group"><ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-koi-orange"/> {t('findDoc')}</a></li>
             <li><a href="#" className="hover:text-white transition flex items-center gap-2 group"><ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-koi-orange"/> {t('bookBtn')}</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6 font-display text-sm uppercase tracking-wider">{t('contactUs')}</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin size={16} className="text-koi-orange mt-0.5 shrink-0" />
              <span className="opacity-80">{t('address')}</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={16} className="text-koi-orange shrink-0" />
              <span className="opacity-80">+7 (727) 300-00-00</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={16} className="text-koi-orange shrink-0" />
              <span className="opacity-80">info@koi.kz</span>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Линия здесь убрана, используется просто паддинг */}
      <div className="max-w-7xl mx-auto px-4 pt-4 flex flex-col md:flex-row justify-between items-center text-xs opacity-50 gap-4">
        <p>&copy; 2025 KOI. {t('rights')}</p>
        <div className="flex gap-6">
            <a href="#" className="hover:text-white transition">Privacy</a>
            <a href="#" className="hover:text-white transition">Terms</a>
        </div>
      </div>
    </footer>
  );
}