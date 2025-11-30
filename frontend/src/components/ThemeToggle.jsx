import { useState, useEffect } from 'react'
import './ThemeToggle.css'
function ThemeToggle() {
  const [isDark, setIsDark] = useState(true)
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'light') {
      setIsDark(false)
      document.documentElement.setAttribute('data-theme', 'light')
    } else {
      setIsDark(true)
      document.documentElement.setAttribute('data-theme', 'dark')
    }
  }, [])
  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light')
    localStorage.setItem('theme', newTheme ? 'dark' : 'light')
  }
  return (
    <button className="theme-toggle" onClick={toggleTheme} aria-label="Tema değiştir">
      {isDark ? '☀' : '🌙'}
    </button>
  )
}
export default ThemeToggle
