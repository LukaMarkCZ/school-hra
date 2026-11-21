import React, { useState, useEffect, useRef } from 'react';
import { Mic, Check, X, Sparkles, MessageCircle, Loader2, Keyboard } from 'lucide-react';
import { sounds } from '../services/soundEffects';
import { speechRecognizer } from '../services/speechRecognition';

export function QuestionInputModal({
  isOpen,
  onClose,
  onSubmitQuestion,
  initialText = ''
}) {
  const [text, setText] = useState(initialText);
  const [micStatus, setMicStatus] = useState('idle'); // 'idle' | 'starting' | 'listening' | 'error'
  const [micLiveText, setMicLiveText] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setText(initialText);
      setMicStatus('idle');
      setMicLiveText('');
    }
    return () => {
      speechRecognizer.cancelListening();
    };
  }, [isOpen, initialText]);

  if (!isOpen) return null;

  const startListening = () => {
    sounds.init();
    setMicStatus('starting');
    setMicLiveText('');

    speechRecognizer.startListening({
      onStarting: () => setMicStatus('starting'),
      onReady: () => {
        sounds.playMicStart();
        setMicStatus('listening');
      },
      onResult: (t) => {
        setMicLiveText(t);
        setText(t);
      },
      onFinal: (finalT) => {
        setMicStatus('idle');
        setMicLiveText('');
        if (finalT && finalT.trim()) {
          setText(finalT.trim());
          sounds.playMicSuccess();
        }
      },
      onError: () => {
        setMicStatus('error');
      },
      onEnd: () => setMicStatus(prev => (prev === 'error' ? prev : 'idle'))
    });
  };

  const stopListening = () => {
    sounds.playPop();
    speechRecognizer.stopListening();
    setMicStatus('idle');
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    speechRecognizer.cancelListening();
    const clean = text.trim();
    if (!clean) return;
    sounds.playPop();
    onSubmitQuestion(clean);
    onClose();
  };

  const handleQuickChip = (chipText) => {
    sounds.playPop();
    setText(chipText);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="question-input-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-with-icon">
            <span className="text-3xl mr-2">🎙️</span>
            <h2>Položit otázku třídě</h2>
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

        {/* 1. Direct Voice Input on Mobile */}
        <div className="voice-answering-wrapper">
          {micStatus === 'listening' ? (
            <div className="voice-mic-active-card">
              <div className="flex items-center justify-between w-full mb-2">
                <div className="flex items-center gap-2">
                  <span className="recording-live-dot" />
                  <span className="font-extrabold text-red-950 text-base">
                    🔴 TEĎ MLUV! Polož otázku třídě...
                  </span>
                </div>
                <button
                  type="button"
                  className="btn-mic-stop-action"
                  onClick={stopListening}
                >
                  ⏹️ Zastavit
                </button>
              </div>
              <div className="voice-live-bubble">
                <p className="voice-heard-text">
                  {micLiveText ? `„${micLiveText}“` : 'Mluv nahlas do mobilu...'}
                </p>
              </div>
            </div>
          ) : micStatus === 'starting' ? (
            <div className="voice-mic-starting-card">
              <Loader2 className="w-7 h-7 animate-spin text-amber-600 mr-2 flex-shrink-0" />
              <span className="font-extrabold text-amber-950 text-sm">
                Zapínám mikrofon... Můžeš mluvit!
              </span>
            </div>
          ) : (
            <button
              type="button"
              className="btn-voice-record-big"
              onClick={startListening}
            >
              <div className="mic-record-icon-circle bg-emerald-500 animate-pulse">
                <Mic className="w-7 h-7 text-white" />
              </div>
              <div className="text-left ml-3 flex-1">
                <span className="font-black text-white text-base block">
                  {text ? '🔄 Znovu říct otázku hlasem' : '🎙️ ŤUKNI A ŘEKNI OTÁZKU NAHLAS'}
                </span>
                <span className="text-xs text-emerald-100 font-bold">
                  Mluv přímo do mikrofonu mobilu
                </span>
              </div>
            </button>
          )}
        </div>

        {/* Mobile Dictation Callout */}
        <div
          className="ipad-dictation-callout cursor-pointer hover:bg-indigo-100 transition-colors mt-2"
          onClick={() => inputRef.current?.focus()}
        >
          <div className="callout-icon-box">
            <Keyboard className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="callout-text-box">
            <strong className="text-indigo-950 font-bold text-xs block">
              📱 Tip pro mobil: Diktování přes klávesnici
            </strong>
            <span className="text-indigo-900 text-xs">
              Můžeš také ťuknout do pole níže a na klávesnici mobilu stisknout <strong>ikonku mikrofonu 🎤 (vedle mezerníku)</strong>.
            </span>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="question-form mt-2">
          <div className="question-input-wrapper">
            <textarea
              ref={inputRef}
              rows={2}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Např. „Kubo, co máš dnes ke svačině?“ nebo „Kolik nohou má pavouk?“"
              className="question-textarea"
            />
          </div>

          {/* Quick Idea Chips */}
          <div className="quick-chips-section">
            <span className="quick-chips-label">Nebo vyber rychlý nápad:</span>
            <div className="quick-chips-row">
              <button
                type="button"
                className="chip-btn"
                onClick={() => handleQuickChip('Svačinu Kubo!')}
              >
                🥪 Svačinu Kubo!
              </button>
              <button
                type="button"
                className="chip-btn"
                onClick={() => handleQuickChip('Kolik nohou má pavouk?')}
              >
                🕷️ Kolik nohou má pavouk?
              </button>
              <button
                type="button"
                className="chip-btn"
                onClick={() => handleQuickChip('Eliško, kolik je pět plus sedm?')}
              >
                🔢 Eliško, kolik je 5 + 7?
              </button>
              <button
                type="button"
                className="chip-btn"
                onClick={() => handleQuickChip('Jaké zvíře žije v lese?')}
              >
                🌲 Jaké zvíře žije v lese?
              </button>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="modal-actions-footer">
            <button
              type="submit"
              className="btn-submit-question animate-bounce-subtle"
              disabled={!text.trim()}
            >
              <Check className="w-6 h-6 mr-2 stroke-[3]" />
              <span>Položit otázku třídě!</span>
            </button>

            <button
              type="button"
              className="btn-modal-cancel"
              onClick={onClose}
            >
              Zrušit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
