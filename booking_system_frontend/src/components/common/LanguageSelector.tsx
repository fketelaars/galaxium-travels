import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { LANGUAGES } from '../../hooks/languageData';

export const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = LANGUAGES.find((l) => l.code === language)!;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative inline-block text-left">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-card border border-white/20 text-star-white/80 hover:text-star-white hover:border-cosmic-purple/60 transition-all duration-200 text-sm font-medium"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{current.flag}</span>
        <span>{current.label}</span>
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 mt-2 w-40 rounded-xl overflow-hidden glass-card border border-white/15 shadow-xl z-50"
        >
          {LANGUAGES.map((lang) => (
            <li key={lang.code}>
              <button
                role="option"
                aria-selected={language === lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors duration-150 ${
                  language === lang.code
                    ? 'text-cosmic-purple bg-white/10 font-semibold'
                    : 'text-star-white/80 hover:text-star-white hover:bg-white/8'
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Made with Bob
