"use client"; // This marks the component as a Client Component

import { useEffect, useState } from 'react';
import styles from '@/app/home/page.module.css';

function LanguageSwitcher() {
  const [languageIndex, setLanguageIndex] = useState(0);

  const languages = [
    'Welcome to VITIAN', // English
    'विटियन में आपका स्वागत है', // Hindi
    'VITIAN க்கு வரவேற்கிறோம்', // Tamil
    'VITIAN-ലേക്ക് സ്വാഗതം',
    'VITIAN ಗೆ ಸುಸ್ವಾಗತ', // Kannada
    'VITIANకి స్వాగతం', // Telugu
    'VITIAN मध्ये आपले स्वागत आहे', // Marathi
    'VITIAN માં આપનું સ્વાગત છે', // Gujarati
    // Add more languages as needed
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setLanguageIndex((prevIndex) => (prevIndex + 1) % languages.length);
    }, 2000); // Change language every 2 seconds

    return () => clearInterval(interval);
  }, [languages.length]);

  return (
    <div className={styles.welcomeContainer}>
      <h1 className={styles.welcomeText}>{languages[languageIndex]}</h1>
    </div>
  );
}

export default LanguageSwitcher;
