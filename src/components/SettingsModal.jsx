import React, { useState } from 'react';
import { X, Key, Volume2, RotateCcw, Check, Sparkles, ExternalLink, AlertTriangle, Loader2, Tablet, Mic } from 'lucide-react';
import { speech } from '../services/speechEngine';
import { sounds } from '../services/soundEffects';
import { getActiveApiKey, testGeminiAPI } from '../services/aiEngine';

export function SettingsModal({ onClose, onResetDay, students, playerName = 'Terezka', onUpdatePlayerName }) {
  const activeKey = getActiveApiKey();
  const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || activeKey || '');
  const [currentName, setCurrentName] = useState(playerName);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null); // { ok: boolean, message: string }

  const handleSaveAndTestKey = async (e) => {
    if (e) e.preventDefault();
    const cleanKey = apiKey.trim();

    if (!cleanKey) {
      localStorage.removeItem('gemini_api_key');
      setTestResult({ ok: false, message: 'Klíč byl vymazán. Aplikace nyní používá vestavěný offline mozek.' });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    const result = await testGeminiAPI(cleanKey);
    setIsTesting(false);

    if (result.ok) {
      localStorage.setItem('gemini_api_key', cleanKey);
      setTestResult({
        ok: true,
        message: 'Výborně! Gemini AI je úspěšně připojeno! Žáčci nyní budou odpovídat chytře a k věci na jakoukoliv otázku.'
      });
    } else {
      setTestResult({
        ok: false,
        message: `Chyba při ověřování klíče: ${result.error}. Zkontrolujte, zda jste zkopírovali celý klíč.`
      });
    }
  };

  const handleClearKey = () => {
    localStorage.removeItem('gemini_api_key');
    setApiKey('');
    setTestResult({ ok: false, message: 'Klíč byl smazán. Aktivován offline režim.' });
  };

  const handleTestVoice = (student) => {
    sounds.playPop();
    speech.speak(`Jéje, paní učitelko! Tady je ${student.name}! Jednička, to je paráda!`, {
      characterId: student.id
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="settings-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-with-icon">
            <span className="text-3xl mr-2">⚙️</span>
            <h2>Nastavení hry & Připojení AI</h2>
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

        {/* 0. Player Name Configuration */}
        <div className="settings-section">
          <div className="section-header-row">
            <span className="text-2xl mr-2">🎒</span>
            <h3>Jméno dítěte v roli žáčka</h3>
          </div>
          <p className="settings-desc">
            Tímto jménem tě bude Paní učitelka i celá třída oslovovat, vyvolávat a psát ti ho do žákovské knížky:
          </p>
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={currentName}
              onChange={(e) => {
                setCurrentName(e.target.value);
                if (onUpdatePlayerName) onUpdatePlayerName(e.target.value.trim() || 'Terezka');
              }}
              placeholder="Zadej jméno (např. Terezka)"
              className="key-input-field font-bold text-slate-800"
            />
          </div>
        </div>

        {/* 1. Gemini AI Configuration Section */}
        <div className="settings-section ai-config-section">
          <div className="section-header-row">
            <Sparkles className="w-6 h-6 text-indigo-600 mr-2" />
            <h3>Jak zapojit umělou inteligenci (Google Gemini AI)</h3>
          </div>

          <div className="ai-guide-box">
            <p className="ai-guide-intro">
              S připojeným <strong>Gemini AI</strong> budou žáčci odpovídat v reálném čase <strong>přesně na jakoukoliv položenou otázku</strong> (zvířata, vesmír, pohádky, zeměpis, cokoliv vás napadne).
            </p>

            <div className="ai-steps-list">
              <div className="ai-step-item">
                <span className="step-num">1</span>
                <div className="step-text">
                  Klíč je <strong>zcela zdarma</strong> od Google. Otevřete stránku s klíči:
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="btn-open-aistudio"
                  >
                    <span>Otevřít Google AI Studio (získat klíč zdarma)</span>
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </a>
                </div>
              </div>

              <div className="ai-step-item">
                <span className="step-num">2</span>
                <div className="step-text">
                  Přihlaste se svým Google účtem a klikněte na tlačítko <strong>„Create API key“</strong>.
                </div>
              </div>

              <div className="ai-step-item">
                <span className="step-num">3</span>
                <div className="step-text">
                  Zkopírujte vygenerovaný kód (začíná <code>AIzaSy...</code>) a vložte ho do pole níže:
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSaveAndTestKey} className="api-key-form">
            <div className="input-with-label">
              <label htmlFor="gemini-key-input" className="key-label">
                <Key className="w-4 h-4 mr-1 text-slate-600" />
                Váš Gemini API klíč:
              </label>
              <input
                id="gemini-key-input"
                type="text"
                placeholder="Vložte sem klíč (např. AIzaSy...)"
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setTestResult(null);
                }}
                className="api-key-input"
              />
            </div>

            <div className="form-buttons-row">
              <button
                type="submit"
                className="btn-save-key"
                disabled={isTesting}
              >
                {isTesting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-1 animate-spin" />
                    <span>Ověřuji klíč...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5 mr-1" />
                    <span>Otestovat a uložit klíč</span>
                  </>
                )}
              </button>

              {apiKey && (
                <button
                  type="button"
                  className="btn-clear-key"
                  onClick={handleClearKey}
                  disabled={isTesting}
                >
                  Smazat klíč
                </button>
              )}
            </div>

            {testResult && (
              <div className={`test-feedback-box ${testResult.ok ? 'feedback-ok' : 'feedback-error'}`}>
                {testResult.ok ? (
                  <>
                    <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span className="feedback-text text-emerald-900 font-medium">{testResult.message}</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                    <span className="feedback-text text-rose-900 font-medium">{testResult.message}</span>
                  </>
                )}
              </div>
            )}
          </form>

          <div className="status-badge-box">
            {activeKey ? (
              <span className="status-tag status-ai">
                ✨ Gemini AI mozek je AKTIVNÍ (odpovědi generuje živá umělá inteligence)
              </span>
            ) : (
              <span className="status-tag status-offline">
                ⚡ Offline režim (odpovědi vybírá vestavěný chytrý simulátor)
              </span>
            )}
          </div>
        </div>

        {/* 2. Mobile & Tablet Connection & Dictation Guide */}
        <div className="settings-section">
          <div className="section-header-row">
            <Tablet className="w-6 h-6 text-sky-600 mr-2" />
            <h3>Připojení na mobilu a tabletu (Wi-Fi)</h3>
          </div>
          <p className="settings-desc">
            Mobil připojte k vaší domácí Wi-Fi síti a v prohlížeči (Safari / Chrome) otevřete tuto adresu:
          </p>

          <div className="mt-2 space-y-2">
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl">
              <div className="flex items-center text-emerald-950 font-bold mb-1">
                <span>🌐 Wi-Fi adresa pro mobil i tablet:</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <code className="text-base bg-white px-3 py-1.5 rounded-lg border border-emerald-400 font-mono text-emerald-950 font-black select-all">
                  http://192.168.100.148:5173/
                </code>
              </div>
              <div className="flex items-start gap-2 text-xs text-emerald-900 bg-white/70 p-2.5 rounded-lg border border-emerald-200">
                <Mic className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Jak mluvit na mobilu:</strong> V okně pro odpověď nebo otázku stačí na klávesnici mobilu stisknout <strong>ikonku mikrofonu 🎤 vedle mezerníku</strong> a říct odpověď nahlas!
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Test Student Voices */}
        <div className="settings-section">
          <div className="section-header-row">
            <Volume2 className="w-6 h-6 text-emerald-600 mr-2" />
            <h3>Hlasy dětí ve třídě (Syntéza řeči)</h3>
          </div>
          <p className="settings-desc">
            Aktivní hlas v systému: <strong className="text-slate-800">{speech.getActiveVoiceName()}</strong>. Každý žáček má navíc nastavený svůj charakteristický tón a tempo:
          </p>
          <div className="voice-test-grid">
            {students.map((st) => (
              <button
                key={st.id}
                type="button"
                className="voice-test-chip"
                onClick={() => handleTestVoice(st)}
                title={`Poslechnout si hlas: ${st.name}`}
              >
                <span>{st.name} ({st.nickname})</span>
                <Volume2 className="w-4 h-4 ml-1 opacity-70" />
              </button>
            ))}
          </div>
        </div>

        {/* 3. Reset Session / New Day */}
        <div className="settings-section">
          <div className="section-header-row">
            <RotateCcw className="w-6 h-6 text-rose-600 mr-2" />
            <h3>Začít nový školní den</h3>
          </div>
          <p className="settings-desc">
            Vymaže všechny dosavadní známky a poznámky ze sešitů a začne novou vyučovací hodinu:
          </p>
          <button
            type="button"
            className="btn-reset-day"
            onClick={() => {
              if (window.confirm('Opravdu chceš začít nový školní den a smazat známky?')) {
                onResetDay();
                onClose();
              }
            }}
          >
            <Sparkles className="w-5 h-5 mr-1" />
            Začít nový den v 3.A
          </button>
        </div>
      </div>
    </div>
  );
}
