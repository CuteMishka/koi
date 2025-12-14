import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', name: '', staffCode: '' });
  const [error, setError] = useState(''); // Состояние для ошибки
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Валидация пароля
  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Сброс ошибки

    // Проверка пароля при регистрации
    if (!isLogin && !validatePassword(formData.password)) {
      setError('Password must be at least 8 characters, include 1 uppercase letter and 1 number.');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
      } else {
        const cred = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const role = formData.staffCode === 'KOI-ADMIN-2025' ? 'admin' : 'user';
        await setDoc(doc(db, 'users', cred.user.uid), {
          name: formData.name,
          email: formData.email,
          role: role,
          createdAt: new Date()
        });
      }
      navigate('/dashboard');
    } catch (err) {
      // Красивый вывод ошибок Firebase
      if (err.code === 'auth/invalid-credential') setError('Invalid email or password.');
      else if (err.code === 'auth/email-already-in-use') setError('This email is already registered.');
      else if (err.code === 'auth/weak-password') setError('Password is too weak.');
      else setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-koi-900 flex items-center justify-center p-4 relative overflow-hidden font-sans">
        
        {/* Анимированный фон */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px]"
            />
            <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-koi-orange/5 rounded-full blur-[100px]"></div>
        </div>

        <Link to="/" className="absolute top-8 left-8 text-slate-400 hover:text-white flex items-center gap-2 transition text-sm z-20 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Website
        </Link>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-[420px] bg-white rounded-2xl shadow-2xl p-10 relative z-10"
        >
            <div className="text-center mb-8">
                <div className="flex justify-center mb-6">
                    <img src="/logo.svg" alt="KOI" className="h-8 filter invert contrast-150" />
                </div>
                <h2 className="text-2xl font-bold font-display text-slate-900">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                <p className="text-slate-500 text-sm mt-2">Access the secure medical portal.</p>
            </div>

            {/* Блок ошибки */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-lg mb-4 flex items-start gap-2 overflow-hidden"
                >
                  <AlertCircle size={16} className="shrink-0 mt-0.5"/>
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                    <div>
                        <input 
                            type="text" required placeholder="Full Name"
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-800 focus:border-koi-800 focus:ring-1 focus:ring-koi-800 outline-none transition placeholder-slate-400 text-sm"
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                )}
                <input 
                    type="email" required placeholder="Email Address"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-800 focus:border-koi-800 focus:ring-1 focus:ring-koi-800 outline-none transition placeholder-slate-400 text-sm"
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
                <div>
                   <input 
                      type="password" required placeholder="Password"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-800 focus:border-koi-800 focus:ring-1 focus:ring-koi-800 outline-none transition placeholder-slate-400 text-sm"
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                   />
                   {!isLogin && <p className="text-[10px] text-slate-400 mt-1 ml-1">Min 8 chars, 1 uppercase, 1 number.</p>}
                </div>
                
                {!isLogin && (
                    <input 
                        type="text" placeholder="Staff Code (Optional)" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-800 focus:border-koi-800 focus:ring-1 focus:ring-koi-800 outline-none transition placeholder-slate-400 text-sm"
                        onChange={(e) => setFormData({...formData, staffCode: e.target.value})}
                    />
                )}
                
                <button type="submit" disabled={loading} className="w-full bg-koi-800 hover:bg-slate-900 text-white py-3.5 rounded-lg font-bold shadow-lg shadow-blue-900/10 transition transform hover:-translate-y-0.5 mt-2 disabled:opacity-70 disabled:cursor-not-allowed">
                    {loading ? (
                       <span className="flex items-center justify-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Processing...</span>
                    ) : (isLogin ? 'Sign In' : 'Create Account')}
                </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center text-sm">
                <span className="text-slate-500">{isLogin ? "Don't have an account?" : "Already have an account?"}</span>
                <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="ml-2 text-koi-800 font-bold hover:underline transition">
                    {isLogin ? "Register" : "Log In"}
                </button>
            </div>
        </motion.div>
    </div>
  );
}