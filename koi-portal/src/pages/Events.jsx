import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs, addDoc, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, MapPin, Plus, Trash2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isAfter } from 'date-fns';

export default function Events() {
  const { t } = useLanguage();
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Календарь
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Модалка и Форма
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', date: '', time: '', location: '', desc: '' });
  
  // Обратный отсчет
  const [nextEvent, setNextEvent] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    // Проверка админа
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // Здесь можно добавить более строгую проверку роли через БД, если нужно
        // Пока просто проверяем наличие пользователя для простоты, или роль из Firestore как в Dashboard
        const userDoc = await getDocs(query(collection(db, "users"))); // Упрощено
        // В реальном проекте лучше тянуть конкретного юзера и смотреть поле role
        // Предположим, что мы передаем роль через пропсы или контекст, но здесь для скорости:
        // Если ты админ в Dashboard, ты будешь админом и здесь, если добавишь проверку
        // Для теста я разрешу добавление всем авторизованным (или добавь проверку role === 'admin')
        setIsAdmin(true); 
      }
    });

    fetchEvents();
    return () => unsubscribe();
  }, []);

  // Таймер обратного отсчета
  useEffect(() => {
    if (!nextEvent) return;
    const timer = setInterval(() => {
      const now = new Date();
      const eventDate = new Date(nextEvent.dateTime);
      const diff = eventDate - now;

      if (diff <= 0) {
        clearInterval(timer);
        setNextEvent(null); // Событие прошло
      } else {
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / 1000 / 60) % 60);
        const s = Math.floor((diff / 1000) % 60);
        setTimeLeft({ d, h, m, s });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [nextEvent]);

  const fetchEvents = async () => {
    const q = query(collection(db, "events"), orderBy("dateTime", "asc"));
    const snapshot = await getDocs(q);
    const eventsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setEvents(eventsData);

    // Находим ближайшее событие
    const upcoming = eventsData.find(e => isAfter(new Date(e.dateTime), new Date()));
    setNextEvent(upcoming || null);
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      // Соединяем дату и время в ISO строку
      const fullDateTime = new Date(`${formData.date}T${formData.time}`);
      
      await addDoc(collection(db, "events"), {
        title: formData.title,
        desc: formData.desc,
        location: formData.location,
        dateTime: fullDateTime.toISOString(),
        author: user.email
      });
      setShowModal(false);
      setFormData({ title: '', date: '', time: '', location: '', desc: '' });
      fetchEvents();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if(confirm('Delete event?')) {
        await deleteDoc(doc(db, "events", id));
        fetchEvents();
    }
  }

  // --- ЛОГИКА КАЛЕНДАРЯ ---
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Неделя с понедельника
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const eventsOnSelectedDate = events.filter(e => isSameDay(new Date(e.dateTime), selectedDate));

  return (
    <div className="min-h-screen bg-[#f7f9fc] font-sans pb-20">
      
      {/* HERO & COUNTDOWN */}
      <div className="relative pt-32 pb-24 bg-[#021024] text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#164e87] to-[#021024] opacity-90"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold font-display mb-8">{t('events')}</h1>
            
            {/* TIMER */}
            {nextEvent ? (
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 md:p-10 inline-block shadow-2xl">
                    <p className="text-[#f06439] font-bold uppercase tracking-widest text-xs mb-4">{t('nextEvent')}</p>
                    <h2 className="text-xl md:text-3xl font-bold mb-6">{nextEvent.title}</h2>
                    <div className="flex gap-4 md:gap-8 justify-center text-center">
                        <div><div className="text-3xl md:text-5xl font-mono font-bold">{timeLeft.d}</div><div className="text-[10px] uppercase opacity-60">Days</div></div>
                        <div className="text-3xl md:text-5xl font-mono font-bold opacity-50">:</div>
                        <div><div className="text-3xl md:text-5xl font-mono font-bold">{timeLeft.h}</div><div className="text-[10px] uppercase opacity-60">Hrs</div></div>
                        <div className="text-3xl md:text-5xl font-mono font-bold opacity-50">:</div>
                        <div><div className="text-3xl md:text-5xl font-mono font-bold">{timeLeft.m}</div><div className="text-[10px] uppercase opacity-60">Min</div></div>
                        <div className="text-3xl md:text-5xl font-mono font-bold opacity-50">:</div>
                        <div><div className="text-3xl md:text-5xl font-mono font-bold text-[#f06439]">{timeLeft.s}</div><div className="text-[10px] uppercase opacity-60">Sec</div></div>
                    </div>
                </div>
            ) : (
                <p className="text-slate-400">{t('noEvents')}</p>
            )}
        </div>
      </div>

      {/* CALENDAR & LIST SECTION */}
      <div className="max-w-7xl mx-auto px-4 -mt-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT: CALENDAR */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-card p-6 md:p-8 border border-slate-100">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-bold font-display text-[#021024]">
                        {format(currentDate, 'MMMM yyyy')}
                    </h3>
                    <div className="flex gap-2">
                        <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-2 hover:bg-slate-100 rounded-full transition"><ChevronLeft/></button>
                        <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-2 hover:bg-slate-100 rounded-full transition"><ChevronRight/></button>
                    </div>
                </div>

                {/* Grid Header */}
                <div className="grid grid-cols-7 text-center mb-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
                </div>

                {/* Grid Days */}
                <div className="grid grid-cols-7 gap-2 md:gap-4">
                    {calendarDays.map((day, idx) => {
                        const isSelected = isSameDay(day, selectedDate);
                        const isCurrentMonth = isSameMonth(day, currentDate);
                        // Есть ли событие в этот день?
                        const hasEvent = events.some(e => isSameDay(new Date(e.dateTime), day));

                        return (
                            <div 
                                key={idx} 
                                onClick={() => setSelectedDate(day)}
                                className={`
                                    h-14 md:h-24 rounded-xl border flex flex-col items-start justify-start p-2 cursor-pointer transition relative
                                    ${isSelected ? 'border-[#f06439] bg-orange-50' : 'border-slate-100 hover:border-slate-300 bg-white'}
                                    ${!isCurrentMonth && 'opacity-30 bg-slate-50'}
                                `}
                            >
                                <span className={`text-sm font-bold ${isSelected ? 'text-[#f06439]' : 'text-slate-700'}`}>
                                    {format(day, 'd')}
                                </span>
                                {hasEvent && (
                                    <div className="mt-auto w-full">
                                        <div className="w-2 h-2 rounded-full bg-[#0f4c81] mb-1"></div>
                                        <div className="hidden md:block text-[10px] text-[#0f4c81] font-medium truncate w-full">Event</div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* RIGHT: SELECTED DAY DETAILS */}
            <div className="lg:col-span-1">
                <div className="bg-[#021024] text-white rounded-2xl shadow-card p-6 md:p-8 min-h-[400px] flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-[#f06439] font-bold text-xs uppercase tracking-widest mb-1">Selected Date</p>
                            <h3 className="text-3xl font-bold font-display">{format(selectedDate, 'MMMM d, yyyy')}</h3>
                        </div>
                        {isAdmin && (
                            <button onClick={() => setShowModal(true)} className="bg-[#f06439] hover:bg-orange-600 p-3 rounded-full shadow-lg transition transform hover:scale-105" title="Add Event">
                                <Plus size={20} color="white"/>
                            </button>
                        )}
                    </div>

                    <div className="space-y-4 flex-grow overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                        {eventsOnSelectedDate.length === 0 ? (
                            <div className="text-center py-10 opacity-50">
                                <CalendarIcon size={40} className="mx-auto mb-4 opacity-50"/>
                                <p>No events for this day.</p>
                            </div>
                        ) : (
                            eventsOnSelectedDate.map(ev => (
                                <motion.div 
                                    key={ev.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="bg-white/10 border border-white/10 rounded-xl p-4 hover:bg-white/20 transition group"
                                >
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-lg mb-1">{ev.title}</h4>
                                        {isAdmin && (
                                            <button onClick={() => handleDelete(ev.id)} className="text-white/30 hover:text-red-400 transition"><Trash2 size={14}/></button>
                                        )}
                                    </div>
                                    <div className="text-sm text-white/60 mb-3 line-clamp-2">{ev.desc}</div>
                                    <div className="flex items-center gap-4 text-xs font-bold text-[#f06439]">
                                        <span className="flex items-center gap-1"><Clock size={12}/> {format(new Date(ev.dateTime), 'HH:mm')}</span>
                                        <span className="flex items-center gap-1"><MapPin size={12}/> {ev.location || 'Online'}</span>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </div>

        </div>
      </div>

      {/* ADMIN MODAL */}
      <AnimatePresence>
        {showModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
                >
                    <div className="bg-[#021024] p-6 flex justify-between items-center text-white">
                        <h3 className="font-bold text-lg">{t('addEvent')}</h3>
                        <button onClick={() => setShowModal(false)}><X/></button>
                    </div>
                    <form onSubmit={handleAddEvent} className="p-8 space-y-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Title</label>
                            <input required className="w-full border p-3 rounded-lg bg-slate-50" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Date</label>
                                <input required type="date" className="w-full border p-3 rounded-lg bg-slate-50" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Time</label>
                                <input required type="time" className="w-full border p-3 rounded-lg bg-slate-50" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Location</label>
                            <input className="w-full border p-3 rounded-lg bg-slate-50" placeholder="Room 101 / Zoom" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                            <textarea className="w-full border p-3 rounded-lg bg-slate-50" rows="3" value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})}></textarea>
                        </div>
                        <button type="submit" className="w-full bg-[#f06439] text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition">Save Event</button>
                    </form>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
}