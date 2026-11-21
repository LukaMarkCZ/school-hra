import React from 'react';
import { Mic, MicOff, Bell, Shuffle, Sparkles, Settings, Coffee, Loader2 } from 'lucide-react';

export function TeacherDesk({
  isListening,
  micStatus = 'idle',
  onStartListening,
  onStopListening,
  onRingDeskBell,
  onPickRandomStudent,
  onToggleBreak,
  isBreakTime,
  onOpenQuickQuestions,
  onOpenSettings,
  isAIActive
}) {
  const isStarting = micStatus === 'starting';
  const isActivelyListening = micStatus === 'listening' || (isListening && !isStarting);

  return (
    <div className="teacher-desk-container">
      {/* Wooden Desk Surface & Blotter */}
      <div className="desk-blotter">
        {/* Left Desk Accessories */}
        <div className="desk-left-items">
          <div className="teacher-apple" title="Šťavnaté jablíčko pro paní učitelku">
            <span className="apple-emoji">🍎</span>
          </div>
          <div className="teacher-pens" title="Pero a červená tužka paní učitelky">
            <span className="pens-emoji">✒️ ✏️</span>
          </div>
        </div>

        {/* Central Main Controls Bar - Big Touch Buttons */}
        <div className="desk-actions-bar">
          {/* 1. Speech Recognition / Ask Class Microphone */}
          <button
            type="button"
            className={`action-btn btn-mic ${
              isActivelyListening ? 'listening-pulse' : isStarting ? 'starting-pulse' : ''
            }`}
            onClick={isListening ? onStopListening : onStartListening}
            title={
              isActivelyListening
                ? 'Klikni pro dokončení otázky'
                : isStarting
                  ? 'Zapínám mikrofon...'
                  : 'Stiskni a polož třídě otázku nahlas!'
            }
          >
            <div className="btn-icon-circle">
              {isStarting ? (
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              ) : isActivelyListening ? (
                <div className="sound-wave-anim">
                  <span className="wave-bar" />
                  <span className="wave-bar" />
                  <span className="wave-bar" />
                  <MicOff className="w-8 h-8 text-white" />
                </div>
              ) : (
                <Mic className="w-8 h-8 text-white" />
              )}
            </div>
            <span className="btn-label">
              {isStarting
                ? 'Zapínám...'
                : isActivelyListening
                  ? 'Poslouchám...'
                  : 'Položit otázku'}
            </span>
          </button>

          {/* 2. Quick Question Cards (Visual Topics) */}
          <button
            type="button"
            className="action-btn btn-ideas"
            onClick={onOpenQuickQuestions}
            title="Vyber si z připravených obrázkových otázek"
          >
            <div className="btn-icon-circle ideas-circle">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <span className="btn-label">Kartičky otázek</span>
          </button>

          {/* 3. Teacher Desk Bell (Calm the class!) */}
          <button
            type="button"
            className="action-btn btn-desk-bell"
            onClick={onRingDeskBell}
            title="Zazvoň zvonečkem! Všichni žáci ztichnou a sednou si rovně."
          >
            <div className="btn-icon-circle bell-circle">
              <Bell className="w-7 h-7 text-yellow-300" />
            </div>
            <span className="btn-label">Uklidnit třídu</span>
          </button>

          {/* 4. Pick Random Pupil */}
          <button
            type="button"
            className="action-btn btn-random"
            onClick={onPickRandomStudent}
            title="Vyvolat náhodného žáčka k tabuli"
          >
            <div className="btn-icon-circle random-circle">
              <Shuffle className="w-7 h-7 text-white" />
            </div>
            <span className="btn-label">Vyvolat žáka</span>
          </button>

          {/* 5. School Bell (Break Time Toggle) */}
          <button
            type="button"
            className={`action-btn btn-school-bell ${isBreakTime ? 'active-break' : ''}`}
            onClick={onToggleBreak}
            title={isBreakTime ? "Zvonit na hodinu! Všichni do lavic!" : "Zvonit na přestávku!"}
          >
            <div className="btn-icon-circle school-bell-circle">
              <span className="school-bell-emoji">⏰</span>
            </div>
            <span className="btn-label">
              {isBreakTime ? 'Zvonit na hodinu!' : 'Přestávka!'}
            </span>
          </button>
        </div>

        {/* Right Desk Accessories: Coffee mug, AI Badge & Settings */}
        <div className="desk-right-items">
          <button
            type="button"
            className={`btn-ai-desk-badge ${isAIActive ? 'badge-ai-on' : 'badge-ai-off'}`}
            onClick={onOpenSettings}
            title={isAIActive ? "✨ Gemini AI je připojeno a aktivní!" : "⚡ Klikni sem pro snadné zapojení Gemini AI"}
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="ai-badge-label">{isAIActive ? 'AI zapnuto' : 'Zapojit AI'}</span>
          </button>

          <div className="teacher-mug" title="Horký čaj pro paní učitelku">
            <Coffee className="w-5 h-5 text-amber-800" />
          </div>

          <button
            type="button"
            className="btn-settings-gear"
            onClick={onOpenSettings}
            title="Nastavení"
          >
            <Settings className="w-6 h-6 text-slate-700" />
          </button>
        </div>
      </div>
    </div>
  );
}
