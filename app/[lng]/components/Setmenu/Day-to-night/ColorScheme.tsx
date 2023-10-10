'use client'
import React, { useState, useEffect } from 'react';

function ColorScheme() {
  const [colorScheme, setColorScheme] = useState('light');

  useEffect(() => {
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    setColorScheme(isDarkMode ? 'dark' : 'light');
  }, []);

  return <div>当前浏览器使用的是{colorScheme === 'dark' ? '深色' : '浅色'}模式</div>;
}

export default ColorScheme;