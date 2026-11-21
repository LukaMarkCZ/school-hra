import React, { useState } from 'react';
import { X, Sparkles, Send, Shuffle } from 'lucide-react';

const ALL_QUESTIONS_POOL = [
  {
    id: 'math-1',
    emoji: '🔢',
    title: 'Počítání',
    question: 'Kolik je pět plus sedm?',
    color: '#3B82F6',
    bg: '#EFF6FF'
  },
  {
    id: 'math-2',
    emoji: '➕',
    title: 'Počítání',
    question: 'Kolik je osm plus šest?',
    color: '#3B82F6',
    bg: '#EFF6FF'
  },
  {
    id: 'math-3',
    emoji: '➖',
    title: 'Odčítání',
    question: 'Kolik je patnáct mínus sedm?',
    color: '#2563EB',
    bg: '#DBEAFE'
  },
  {
    id: 'math-4',
    emoji: '✖️',
    title: 'Násobilka',
    question: 'Kolik je tři krát čtyři?',
    color: '#2563EB',
    bg: '#DBEAFE'
  },
  {
    id: 'math-5',
    emoji: '⭐',
    title: 'Násobilka pěti',
    question: 'Kolik je pět krát pět?',
    color: '#1D4ED8',
    bg: '#EFF6FF'
  },
  {
    id: 'forest',
    emoji: '🌲',
    title: 'Přírodověda',
    question: 'Jaká zvířata žijí v našem českém lese?',
    color: '#059669',
    bg: '#ECFDF5'
  },
  {
    id: 'pets',
    emoji: '🐶',
    title: 'Domácí mazlíčci',
    question: 'Kdo má doma pejska nebo kočičku a jak se o ně staráme?',
    color: '#059669',
    bg: '#ECFDF5'
  },
  {
    id: 'prague',
    emoji: '🏰',
    title: 'Vlastivěda',
    question: 'Jaké je hlavní město České republiky?',
    color: '#DC2626',
    bg: '#FEF2F2'
  },
  {
    id: 'flag',
    emoji: '🇨🇿',
    title: 'Naše země',
    question: 'Jaké barvy má česká státní vlajka?',
    color: '#DC2626',
    bg: '#FEF2F2'
  },
  {
    id: 'snezka',
    emoji: '🏔️',
    title: 'Hory',
    question: 'Jak se jmenuje nejvyšší hora České republiky?',
    color: '#D97706',
    bg: '#FFFBEB'
  },
  {
    id: 'rainbow',
    emoji: '🌈',
    title: 'Výtvarná výchova',
    question: 'Jaké barvy má duha na obloze?',
    color: '#D97706',
    bg: '#FFFBEB'
  },
  {
    id: 'painting',
    emoji: '🎨',
    title: 'Míchání barev',
    question: 'Jaká barva vznikne, když smícháme modrou a žlutou?',
    color: '#D97706',
    bg: '#FFFBEB'
  },
  {
    id: 'planets',
    emoji: '🚀',
    title: 'Vesmír',
    question: 'Která planeta je nejblíže ke Slunci?',
    color: '#7C3AED',
    bg: '#F5F3FF'
  },
  {
    id: 'mars',
    emoji: '🪐',
    title: 'Planety',
    question: 'Která planeta sluneční soustavy má okolo sebe prstence?',
    color: '#7C3AED',
    bg: '#F5F3FF'
  },
  {
    id: 'food',
    emoji: '🍎',
    title: 'Zdravá svačinka',
    question: 'Co je nejzdravější k jídlu ke svačině?',
    color: '#16A34A',
    bg: '#F0FDF4'
  },
  {
    id: 'lunch',
    emoji: '🍲',
    title: 'Školní oběd',
    question: 'Jaké jídlo máte ze školní jídelny nejraději?',
    color: '#16A34A',
    bg: '#F0FDF4'
  },
  {
    id: 'pe',
    emoji: '⚽',
    title: 'Tělesná výchova',
    question: 'Jaký sport máte nejraději v tělocviku?',
    color: '#0284C7',
    bg: '#F0F9FF'
  },
  {
    id: 'running',
    emoji: '🏃',
    title: 'Běh a hry',
    question: 'Kdo umí nejrychleji běhat a hrát na honěnou?',
    color: '#0284C7',
    bg: '#F0F9FF'
  }
];

export function QuickQuestionsModal({ onClose, onSelectQuestion }) {
  const [customText, setCustomText] = useState('');
  const [offset, setOffset] = useState(0);

  // Show 8 questions at a time
  const currentQuestions = ALL_QUESTIONS_POOL.slice(offset, offset + 8);

  const handleShuffle = () => {
    const nextOffset = (offset + 8) >= ALL_QUESTIONS_POOL.length ? 0 : offset + 8;
    setOffset(nextOffset);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (customText.trim()) {
      onSelectQuestion(customText.trim());
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="quick-questions-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-with-icon">
            <Sparkles className="w-8 h-8 text-amber-500 mr-2" />
            <h2>Kouzelná témata otázek pro třídu</h2>
          </div>
          <button
            type="button"
            className="modal-close-icon-btn"
            onClick={onClose}
            title="Zavřít"
          >
            <X className="w-8 h-8 text-slate-700" />
          </button>
        </div>

        <div className="modal-toolbar-row">
          <p className="modal-subtitle">
            Ťukni na libovolnou otázku a třída se ihned začne hlásit!
          </p>
          <button
            type="button"
            className="btn-shuffle-questions"
            onClick={handleShuffle}
            title="Ukázat jinou sadu otázek"
          >
            <Shuffle className="w-5 h-5 mr-1 text-indigo-600" />
            <span>Ukázat další otázky</span>
          </button>
        </div>

        {/* Visual Cards Grid */}
        <div className="questions-grid">
          {currentQuestions.map((item) => (
            <button
              key={item.id}
              type="button"
              className="question-card-btn"
              style={{ backgroundColor: item.bg, borderColor: item.color }}
              onClick={() => {
                onSelectQuestion(item.question);
                onClose();
              }}
            >
              <span className="question-card-emoji">{item.emoji}</span>
              <div className="question-card-info">
                <span className="question-card-title" style={{ color: item.color }}>
                  {item.title}
                </span>
                <span className="question-card-question">„{item.question}“</span>
              </div>
            </button>
          ))}
        </div>

        {/* Custom Text Input for Parent/Teacher */}
        <form onSubmit={handleCustomSubmit} className="custom-question-form">
          <label htmlFor="custom-q" className="custom-q-label">Nebo napiš vlastní otázku:</label>
          <div className="custom-input-row">
            <input
              id="custom-q"
              type="text"
              placeholder="Např.: Kolik nohou má pavouk?"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="custom-q-input"
            />
            <button
              type="submit"
              disabled={!customText.trim()}
              className="custom-q-submit-btn"
            >
              <Send className="w-6 h-6 mr-1" />
              <span>Položit</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
