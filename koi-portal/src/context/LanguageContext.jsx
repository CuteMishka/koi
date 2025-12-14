import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

const translations = {
  EN: {
    // ...старые ...
    events: "Events & Calendar",
    nextEvent: "Next Event Starts In:",
    noEvents: "No upcoming events scheduled.",
    addEvent: "Add New Event",
    eventTitle: "Event Title",
    eventDesc: "Description",
    eventDate: "Date & Time",
    institute: "Institute",
    videos: "Videos",
    patients: "Patients",
    research: "Research",
    cabinet: "Cabinet",
    bookBtn: "Book Appointment",
    heroTitle: "Hope, Innovation,",
    heroTitleCare: "and Care.",
    heroSubtitle: "Leading the fight against cancer in Central Asia.",
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
    // ...старые ...
    events: "События и Календарь",
    nextEvent: "До следующего события:",
    noEvents: "Запланированных мероприятий нет.",
    addEvent: "Добавить событие",
    eventTitle: "Название события",
    eventDesc: "Описание",
    eventDate: "Дата и Время",
    institute: "Институт",
    videos: "Видеолекции",
    patients: "Пациентам",
    research: "Наука",
    cabinet: "Кабинет",
    bookBtn: "Записаться на прием",
    heroTitle: "Надежда, Инновации,",
    heroTitleCare: "и Забота.",
    heroSubtitle: "Лидеры в борьбе с раком в Центральной Азии.",
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
    // ...старые ...
    events: "Іс-шаралар күнтізбесі",
    nextEvent: "Келесі іс-шараға дейін:",
    noEvents: "Жоспарланған іс-шаралар жоқ.",
    addEvent: "Іс-шара қосу",
    eventTitle: "Іс-шара атауы",
    eventDesc: "Сипаттамасы",
    eventDate: "Күні мен уақыты",
    institute: "Институт",
    videos: "Бейнедарiстер",
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