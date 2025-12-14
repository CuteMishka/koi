import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

const translations = {
  EN: {
    // ...старые ключи...
    videos: "Video Lectures", // <-- ДОБАВИТЬ ЭТО
    institute: "Institute",
    departments: "Departments",
    patients: "Patients & Visitors",
    research: "Research",
    cabinet: "Cabinet",
    bookBtn: "Book Appointment",
    heroTitle: "Hope, Innovation,",
    heroTitleCare: "and Care.",
    heroSubtitle: "Leading the fight against cancer in Central Asia with advanced molecular diagnostics.",
    findDoc: "Find a Doctor",
    watchVideo: "Watch Video",
    latestUpdates: "Latest Updates",
    newsTitle: "News & Breakthroughs",
    footerDesc: "National Center for Advanced Cancer Care.",
    contactUs: "Contact Us",
    address: "Al-Farabi Ave 120, Almaty",
    rights: "All rights reserved."
  },
  RU: {
    // ...старые ключи...
    videos: "Видеолекции", // <-- ДОБАВИТЬ ЭТО
    institute: "Институт",
    departments: "Отделения",
    patients: "Пациентам",
    research: "Наука",
    cabinet: "Кабинет",
    bookBtn: "Записаться на прием",
    heroTitle: "Надежда, Инновации,",
    heroTitleCare: "и Забота.",
    heroSubtitle: "Лидеры в борьбе с раком в Центральной Азии. Передовая молекулярная диагностика.",
    findDoc: "Найти врача",
    watchVideo: "Смотреть видео",
    latestUpdates: "Последние новости",
    newsTitle: "События и Открытия",
    footerDesc: "Национальный центр передовой онкологии.",
    contactUs: "Контакты",
    address: "пр. Аль-Фараби 120, Алматы",
    rights: "Все права защищены."
  },
  KZ: {
    // ...старые ключи...
    videos: "Бейнедарiстер", // <-- ДОБАВИТЬ ЭТО
    institute: "Институт",
    departments: "Бөлімдер",
    patients: "Пациенттерге",
    research: "Ғылым",
    cabinet: "Кабинет",
    bookBtn: "Қабылдауға жазылу",
    heroTitle: "Үміт, Инновация,",
    heroTitleCare: "және Қамқорлық.",
    heroSubtitle: "Орталық Азиядағы қатерлі ісікке қарсы күрестің көшбасшысы.",
    findDoc: "Дәрігерді табу",
    watchVideo: "Бейнені көру",
    latestUpdates: "Соңғы жаңалықтар",
    newsTitle: "Жаңалықтар мен оқиғалар",
    footerDesc: "Жетілдірілген онкологиялық ұлттық орталық.",
    contactUs: "Байланыс",
    address: "әл-Фараби даңғ. 120, Алматы",
    rights: "Барлық құқықтар қорғалған."
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('EN');
  const t = (key) => translations[lang][key] || key;
  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);