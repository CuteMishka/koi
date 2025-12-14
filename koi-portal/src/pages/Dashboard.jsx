import React, { useEffect, useState } from 'react';
import { auth, db, storage } from '../firebase';
import { doc, getDoc, updateDoc, collection, addDoc, serverTimestamp, getDocs, deleteDoc, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Оставил Storage если настроили CORS, или замените на Base64
import { useNavigate } from 'react-router-dom';
import { PlusCircle, User, Activity, Camera, Upload, Trash2, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [newsList, setNewsList] = useState([]);
  
  const [newsForm, setNewsForm] = useState({ title: '', category: 'Institute', desc: '' });
  const [newsFile, setNewsFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!auth.currentUser) return navigate('/auth');
      
      const docSnap = await getDoc(doc(db, "users", auth.currentUser.uid));
      if (docSnap.exists()) {
        const user = docSnap.data();
        setUserData(user);
        if(user.role === 'admin') fetchNews();
      }
    };
    fetchData();
  }, [navigate]);

  const fetchNews = async () => {
      const q = query(collection(db, "news"), orderBy("date", "desc"));
      const snapshot = await getDocs(q);
      setNewsList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }

  // Используем Base64 если Storage выдает CORS, или оставь storage если починил
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setMsg({ type: 'info', text: 'Uploading avatar...' });
      const base64 = await convertToBase64(file);
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, { photoURL: base64 });
      setUserData({ ...userData, photoURL: base64 });
      setMsg({ type: 'success', text: 'Avatar updated!' });
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: '', text: '' });
    
    try {
      let imageUrl = '';
      if (newsFile) {
          imageUrl = await convertToBase64(newsFile);
      }

      await addDoc(collection(db, "news"), {
        ...newsForm,
        image: imageUrl,
        date: serverTimestamp(),
        author: userData.name
      });

      setMsg({ type: 'success', text: 'News published.' });
      setNewsForm({ title: '', category: 'Institute', desc: '' });
      setNewsFile(null);
      fetchNews();
    } catch (e) {
      setMsg({ type: 'error', text: e.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNews = async (id) => {
      if(!window.confirm("Delete this news?")) return;
      try {
          await deleteDoc(doc(db, "news", id));
          setNewsList(newsList.filter(item => item.id !== id));
          setMsg({ type: 'success', text: 'News deleted.' });
      } catch (error) {
          alert(error.message);
      }
  }

  if (!userData) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-koi-800"></div></div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      
      {/* ВАЖНО: Убрали внутренний <header>. 
         Добавили pt-28 (Padding Top), чтобы контент не заезжал под Navbar.
      */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 relative z-10 pt-32">
        
        {/* Banner */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full -mr-16 -mt-16 z-0 opacity-50"></div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                  <h1 className="text-3xl font-bold font-display text-slate-800 mb-2">My Dashboard</h1>
                  <p className="text-slate-500">Welcome back, {userData.name}.</p>
              </div>
          </div>
        </motion.div>

        {msg.text && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`mb-6 p-4 rounded-lg flex items-center gap-3 shadow-sm ${msg.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                {msg.type === 'success' ? <CheckCircle size={18}/> : <Activity size={18}/>}
                <span className="text-sm font-medium">{msg.text}</span>
            </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Profile */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center relative group">
                    <div className="relative w-32 h-32 mx-auto mb-6">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md bg-slate-100 flex items-center justify-center">
                            {userData.photoURL ? (
                                <img src={userData.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <User size={48} className="text-slate-300" />
                            )}
                        </div>
                        <label className="absolute bottom-1 right-1 bg-orange-500 text-white p-2.5 rounded-full cursor-pointer shadow-lg hover:bg-orange-600 transition transform hover:scale-110 z-20 border-2 border-white">
                            <Camera size={18} />
                            <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                        </label>
                    </div>
                    <h2 className="font-bold text-xl text-slate-800 mb-1">{userData.name}</h2>
                    <p className="text-sm text-slate-400 mb-4">{userData.email}</p>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${userData.role === 'admin' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                        {userData.role}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-2 space-y-8">
                {userData.role === 'admin' ? (
                  <>
                    <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
                        <div className="bg-slate-50 border-b border-slate-200 px-8 py-5 flex items-center gap-3">
                            <PlusCircle size={20} className="text-koi-800"/>
                            <h2 className="text-lg font-bold text-slate-800">Publish News</h2>
                        </div>
                        <div className="p-8">
                            <form onSubmit={handlePublish} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <input type="text" required placeholder="Article Title" 
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:bg-white focus:border-koi-800 outline-none transition text-sm" 
                                        value={newsForm.title} onChange={e => setNewsForm({...newsForm, title: e.target.value})} />
                                    <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:bg-white focus:border-koi-800 outline-none transition text-sm"
                                        value={newsForm.category} onChange={e => setNewsForm({...newsForm, category: e.target.value})}>
                                        <option>Institute</option><option>Technology</option><option>Research</option><option>Community</option>
                                    </select>
                                </div>

                                <label className={`flex items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer transition ${newsFile ? 'border-green-400 bg-green-50' : 'border-slate-300 hover:border-koi-800 hover:bg-slate-50'}`}>
                                    <div className="text-center">
                                        {newsFile ? (
                                            <span className="text-green-700 font-medium text-sm flex items-center gap-2"><CheckCircle size={16}/> {newsFile.name}</span>
                                        ) : (
                                            <div className="text-slate-400 flex flex-col items-center">
                                                <Upload size={20} className="mb-1"/>
                                                <span className="text-sm">Click to upload (Max 800KB)</span>
                                            </div>
                                        )}
                                    </div>
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => setNewsFile(e.target.files[0])} />
                                </label>

                                <textarea required placeholder="Content..." rows="3" 
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:bg-white focus:border-koi-800 outline-none transition text-sm resize-none"
                                    value={newsForm.desc} onChange={e => setNewsForm({...newsForm, desc: e.target.value})}></textarea>

                                <button type="submit" disabled={loading} className="w-full bg-koi-800 hover:bg-slate-900 text-white py-3 rounded-lg font-bold transition disabled:opacity-50">
                                    {loading ? 'Publishing...' : 'Publish Article'}
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wide">Manage News</h3>
                        <div className="space-y-3">
                            {newsList.map(news => (
                                <div key={news.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded bg-slate-200 overflow-hidden flex-shrink-0 border border-slate-200">
                                            <img src={news.image} className="w-full h-full object-cover" onError={(e)=>e.target.style.display='none'}/>
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-slate-700 line-clamp-1">{news.title}</div>
                                            <div className="text-[10px] text-slate-400">{news.date?.seconds ? new Date(news.date.seconds * 1000).toLocaleDateString() : 'Just now'}</div>
                                        </div>
                                    </div>
                                    <button onClick={() => handleDeleteNews(news.id)} className="text-slate-400 hover:text-red-500 p-2 transition bg-white border border-slate-100 rounded shadow-sm">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                  </>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                        <Activity size={48} className="text-blue-200 mx-auto mb-4"/>
                        <h3 className="text-xl font-bold text-slate-800">Patient Portal</h3>
                        <p className="text-slate-500 mt-2">Synchronization in progress...</p>
                    </div>
                )}
            </div>
        </div>
      </main>
    </div>
  );
}