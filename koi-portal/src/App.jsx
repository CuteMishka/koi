import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Article from './pages/Article';
import Videos from './pages/Videos';
import Events from './pages/Events'; // 1. Импорт
import PageTransition from './components/PageTransition';
import ScrollToTop from './components/ScrollToTop';

export default function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';

  return (
    <>
      <ScrollToTop />
      {!isAuthPage && <Navbar />}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
          <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
          <Route path="/news/:id" element={<PageTransition><Article /></PageTransition>} />
          <Route path="/videos" element={<PageTransition><Videos /></PageTransition>} />
          <Route path="/events" element={<PageTransition><Events /></PageTransition>} /> {/* 2. Маршрут */}
        </Routes>
      </AnimatePresence>

      {!isAuthPage && <Footer />}
    </>
  );
}