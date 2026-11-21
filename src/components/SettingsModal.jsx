import React, { useState, useEffect } from 'react';
import {
  X,
  Key,
  Volume2,
  RotateCcw,
  Check,
  Sparkles,
  ExternalLink,
  AlertTriangle,
  Loader2,
  Tablet,
  Mic,
  Play,
  Square,
  Radio
} from 'lucide-react';
import { speech, testTTSPreview } from '../services/speechEngine';
import { sounds } from '../services/soundEffects';
import {
  getActiveApiKey,
  getActiveOpenAIApiKey,
  testGeminiAPI,
  testOpenAIAPI
} from '../services/aiEngine';

export function SettingsModal({ onClose, onResetDay, students, playerName = 'Terezka', onUpdatePlayerName }) {
  const [currentName, setCurrentName] = useState(playerName);

  // LLM AI State
  const [geminiKey, setGeminiKey] = useState(localStorage.getItem('gemini_api_key') || '');
  const [openAIKey, setOpenAIKey] = useState(localStorage.getItem('openai_api_key') || '');
  const [isTestingGemini, setIsTestingGemini] = useState(false);
  const [isTestingOpenAI, setIsTestingOpenAI] = useState(false);
  const [geminiTestResult, setGeminiTestResult] = useState(null);
  const [openAITestResult, setOpenAITestResult] = useState(null);

  // Voice TTS State
  const [ttsProvider, setTtsProvider] = useState(localStorage.getItem('tts_provider') || 'auto');
  const [elevenLabsKey, setElevenLabsKey] = useState(localStorage.getItem('elevenlabs_api_key') || '');
  const [openAIVoice, setOpenAIVoice] = useState(localStorage.getItem('openai_tts_voice') || 'nova');
  const [elevenVoiceId, setElevenVoiceId] = useState(localStorage.getItem('elevenlabs_voice_id') || '21m00Tcm4TlvDq8ikWAM');
  const [selectedWebVoice, setSelectedWebVoice] = useState(localStorage.getItem('preferred_webspeech_voice') || '');
  const [availableWebVoices, setAvailableWebVoices] = useState([]);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [previewError, setPreviewError] = useState('');

  useEffect(() => {
    speech.loadVoices();
    const list = speech.getAvailableCzechVoices();
    setAvailableWebVoices(list);
    if (!selectedWebVoice && list.length > 0) {
      setSelectedWebVoice(list[0].voiceURI || list[0].name);
    }
  }, []);

  // Save changes automatically
  const handleUpdateName = (val) => {
    setCurrentName(val);
    if (onUpdatePlayerName) onUpdatePlayerName(val.trim() || 'Terezka');
  };

  const handleGeminiKeyChange = (val) => {
    setGeminiKey(val);
    if (val.trim()) {
      localStorage.setItem('gemini_api_key', val.trim());
    } else {
      localStorage.removeItem('gemini_api_key');
    }
    setGeminiTestResult(null);
  };

  const handleOpenAIKeyChange = (val) => {
    setOpenAIKey(val);
    if (val.trim()) {
      localStorage.setItem('openai_api_key', val.trim());
    } else {
      localStorage.removeItem('openai_api_key');
    }
    setOpenAITestResult(null);
  };

  const handleTtsProviderChange = (provider) => {
    setTtsProvider(provider);
    localStorage.setItem('tts_provider', provider);
  };

  const handleElevenLabsKeyChange = (val) => {
    setElevenLabsKey(val);
    if (val.trim()) {
      localStorage.setItem('elevenlabs_api_key', val.trim());
    } else {
      localStorage.removeItem('elevenlabs_api_key');
    }
  };

  const handleOpenAIVoiceChange = (val) => {
    setOpenAIVoice(val);
    localStorage.setItem('openai_tts_voice', val);
  };

  const handleWebVoiceChange = (val) => {
    setSelectedWebVoice(val);
    localStorage.setItem('preferred_webspeech_voice', val);
    speech.loadVoices();
  };

  // Test Gemini
  const handleTestGemini = async (e) => {
    if (e) e.preventDefault();
    const key = geminiKey.trim();
    if (!key) {
      setGeminiTestResult({ ok: false, message: 'Nejprve zadejte klíč.' });
      return;
    }
    setIsTestingGemini(true);
    setGeminiTestResult(null);
    const res = await testGeminiAPI(key);
    setIsTestingGemini(false);
    if (res.ok) {
      setGeminiTestResult({ ok: true, message: 'Google Gemini je úspěšně připojeno!' });
    } else {
      setGeminiTestResult({ ok: false, message: `Chyba: ${res.error}` });
    }
  };

  // Test OpenAI
  const handleTestOpenAI = async (e) => {
    if (e) e.preventDefault();
    const key = openAIKey.trim();
    if (!key) {
      setOpenAITestResult({ ok: false, message: 'Nejprve zadejte OpenAI klíč.' });
      return;
    }
    setIsTestingOpenAI(true);
    setOpenAITestResult(null);
    const res = await testOpenAIAPI(key);
    setIsTestingOpenAI(false);
    if (res.ok) {
      setOpenAITestResult({ ok: true, message: 'OpenAI (GPT-4o) je úspěšně připojeno!' });
    } else {
      setOpenAITestResult({ ok: false, message: `Chyba: ${res.error}` });
    }
  };

  // Test Teacher Voice Preview
  const handleTestTeacherVoice = async () => {
    sounds.playPop();
    setPreviewError('');

    if (isPlayingPreview) {
      speech.stop();
      setIsPlayingPreview(false);
      return;
    }

    setIsPlayingPreview(true);

    const activeProvider = ttsProvider === 'auto'
      ? (openAIKey ? 'openai' : (elevenLabsKey ? 'elevenlabs' : 'webspeech'))
      : ttsProvider;

    const apiKey = activeProvider === 'openai' ? openAIKey : elevenLabsKey;

    await testTTSPreview({
      provider: activeProvider,
      apiKey,
      voiceId: elevenVoiceId,
      openAIVoice,
      webVoiceUri: selectedWebVoice,
      onStart: () => setIsPlayingPreview(true),
      onEnd: () => setIsPlayingPreview(false),
      onError: (err) => {
        setPreviewError(`Chyba hlasové služby: ${err}`);
        setIsPlayingPreview(false);
      }
    });
  };

  const handleTestPupilVoice = (student) => {
    sounds.playPop();
    speech.speak(`Jéje, paní učitelko! Tady je ${student.name}!`, {
      characterId: student.id
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="settings-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-with-icon">
            <span className="text-3xl mr-2">⚙️</span>
            <h2>Nastavení hry, hlasu a inteligence AI</h2>
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

        {/* 1. Player Name */}
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
              onChange={(e) => handleUpdateName(e.target.value)}
              placeholder="Zadej jméno (např. Terezka)"
              className="key-input-field font-bold text-slate-800"
            />
          </div>
        </div>

        {/* 2. Natural Voice Service (TTS) */}
        <div className="settings-section">
          <div className="section-header-row">
            <Volume2 className="w-6 h-6 text-pink-600 mr-2" />
            <h3>Přirozený hlas paní učitelky (Hlasová služba TTS)</h3>
          </div>
          <p className="settings-desc">
            Pokud paní učitelka zní roboticky, je to proto, že počítač používá starý systémový hlas. Můžete zde přepnout na <strong>nádherný lidský hlas s přirozenou intonací a dechem</strong>:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-3">
            {/* OpenAI TTS Option */}
            <button
              type="button"
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                ttsProvider === 'openai' || (ttsProvider === 'auto' && openAIKey)
                  ? 'border-indigo-600 bg-indigo-50/80 shadow-md ring-2 ring-indigo-400'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
              onClick={() => handleTtsProviderChange('openai')}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-indigo-950 text-sm">🎙️ OpenAI TTS</span>
                  <span className="text-[10px] bg-indigo-200 text-indigo-900 font-bold px-1.5 py-0.5 rounded">Doporučeno</span>
                </div>
                <p className="text-xs text-slate-600">
                  Přirozený lidský ženský hlas <strong>Nova</strong>. Zní jako skutečná mladá usměvavá paní učitelka.
                </p>
              </div>
            </button>

            {/* ElevenLabs Option */}
            <button
              type="button"
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                ttsProvider === 'elevenlabs' || (ttsProvider === 'auto' && elevenLabsKey && !openAIKey)
                  ? 'border-emerald-600 bg-emerald-50/80 shadow-md ring-2 ring-emerald-400'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
              onClick={() => handleTtsProviderChange('elevenlabs')}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-emerald-950 text-sm">🌟 ElevenLabs AI</span>
                  <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-1.5 py-0.5 rounded">Ultra Realistický</span>
                </div>
                <p className="text-xs text-slate-600">
                  Špičkový hyper-realistický AI model <strong>Multilingual v2</strong> s českou intonací.
                </p>
              </div>
            </button>

            {/* Local Web Speech Option */}
            <button
              type="button"
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                ttsProvider === 'webspeech' || (ttsProvider === 'auto' && !openAIKey && !elevenLabsKey)
                  ? 'border-sky-600 bg-sky-50/80 shadow-md ring-2 ring-sky-400'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
              onClick={() => handleTtsProviderChange('webspeech')}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-sky-950 text-sm">🌐 Vestavěný v PC/mobilu</span>
                  <span className="text-[10px] bg-sky-200 text-sky-900 font-bold px-1.5 py-0.5 rounded">Zdarma offline</span>
                </div>
                <p className="text-xs text-slate-600">
                  Hlas z Windows (Edge Vlasta/Jakub) nebo iOS (Zuzana/Siri). Nevyžaduje internet ani klíč.
                </p>
              </div>
            </button>
          </div>

          {/* Provider Details & Config */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl mt-3 space-y-3">
            {(ttsProvider === 'openai' || (ttsProvider === 'auto' && openAIKey)) && (
              <div>
                <label className="text-xs font-extrabold text-slate-800 block mb-1">
                  Hlas OpenAI:
                </label>
                <div className="flex items-center gap-3">
                  <select
                    value={openAIVoice}
                    onChange={(e) => handleOpenAIVoiceChange(e.target.value)}
                    className="p-2 text-sm border border-slate-300 rounded-lg bg-white font-bold text-slate-800"
                  >
                    <option value="nova">Nova (Teplý, milý, mateřský paní učitelky)</option>
                    <option value="shimmer">Shimmer (Jemný, melodický ženský)</option>
                    <option value="alloy">Alloy (Čistý, neutrální)</option>
                  </select>
                  <span className="text-xs text-slate-500">
                    Klíč se zadává v sekci OpenAI níže.
                  </span>
                </div>
              </div>
            )}

            {(ttsProvider === 'elevenlabs' || (ttsProvider === 'auto' && elevenLabsKey)) && (
              <div className="space-y-2">
                <div>
                  <label className="text-xs font-extrabold text-slate-800 block mb-1">
                    Váš ElevenLabs API klíč:
                  </label>
                  <input
                    type="password"
                    value={elevenLabsKey}
                    onChange={(e) => handleElevenLabsKeyChange(e.target.value)}
                    placeholder="Vložte sem ElevenLabs klíč..."
                    className="key-input-field text-sm"
                  />
                </div>
              </div>
            )}

            {(ttsProvider === 'webspeech' || (!openAIKey && !elevenLabsKey)) && (
              <div>
                <label className="text-xs font-extrabold text-slate-800 block mb-1">
                  Vyberte český hlas z vašeho zařízení:
                </label>
                {availableWebVoices.length > 0 ? (
                  <select
                    value={selectedWebVoice}
                    onChange={(e) => handleWebVoiceChange(e.target.value)}
                    className="p-2 text-sm border border-slate-300 rounded-lg bg-white font-bold text-slate-800 w-full"
                  >
                    {availableWebVoices.map((v) => (
                      <option key={v.voiceURI || v.name} value={v.voiceURI || v.name}>
                        {v.name} ({v.lang})
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="text-xs text-amber-800 font-bold block">
                    V systému zatím nebyl detekován žádný specifický český hlas, použije se výchozí.
                  </span>
                )}
                <span className="text-[11px] text-slate-500 block mt-1">
                  Tip: V prohlížeči <strong>Microsoft Edge</strong> jsou zdarma k dispozici přirozené lidské hlasy <em>Microsoft Vlasta Online</em> a <em>Antonin Online</em>.
                </span>
              </div>
            )}

            {/* Test Voice Button */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                className="btn-play-voice-preview"
                onClick={handleTestTeacherVoice}
              >
                {isPlayingPreview ? (
                  <>
                    <Square className="w-4 h-4 mr-1 text-red-600 fill-red-600" />
                    <span>Zastavit přehrávání</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-1 text-emerald-600 fill-emerald-600" />
                    <span>▶️ Poslechnout si ukázku hlasu paní učitelky</span>
                  </>
                )}
              </button>

              <span className="text-xs font-bold text-slate-600">
                Aktivní: {speech.getActiveVoiceName()}
              </span>
            </div>

            {previewError && (
              <div className="p-2 bg-rose-50 border border-rose-200 rounded text-xs text-rose-800 font-bold">
                {previewError}
              </div>
            )}
          </div>
        </div>

        {/* 3. LLM AI Providers (Gemini / OpenAI) */}
        <div className="settings-section ai-config-section">
          <div className="section-header-row">
            <Sparkles className="w-6 h-6 text-indigo-600 mr-2" />
            <h3>Umělá inteligence (Přirozené odpovědi paní učitelky a třídy)</h3>
          </div>
          <p className="settings-desc">
            S připojeným LLM modelem paní učitelka <strong>nikdy neopakuje stejné odpovědi</strong> a reaguje živě, vtipně a mateřsky na jakékoliv dětské nápady:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            {/* Google Gemini Card */}
            <div className="p-3 bg-white border border-indigo-200 rounded-xl shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-indigo-950 text-sm">Google Gemini AI</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-1.5 py-0.5 rounded">Zcela zdarma</span>
                </div>
                <p className="text-xs text-slate-600 mb-2">
                  Model <strong>Gemini 2.0 Flash</strong> od Google. Klíč získáte zdarma jedním kliknutím:
                </p>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-indigo-600 underline font-bold flex items-center mb-2"
                >
                  <span>Získat bezplatný klíč v Google AI Studio</span>
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
                <input
                  type="password"
                  value={geminiKey}
                  onChange={(e) => handleGeminiKeyChange(e.target.value)}
                  placeholder="Vložte sem klíč (začíná AIzaSy...)"
                  className="key-input-field text-xs mb-2"
                />
              </div>

              <div>
                <button
                  type="button"
                  className="btn-save-key text-xs py-1.5 w-full justify-center"
                  onClick={handleTestGemini}
                  disabled={isTestingGemini}
                >
                  {isTestingGemini ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Check className="w-4 h-4 mr-1" />}
                  <span>Otestovat Gemini AI</span>
                </button>
                {geminiTestResult && (
                  <div className={`mt-1.5 text-xs font-bold p-1.5 rounded ${geminiTestResult.ok ? 'bg-emerald-50 text-emerald-900' : 'bg-rose-50 text-rose-900'}`}>
                    {geminiTestResult.message}
                  </div>
                )}
              </div>
            </div>

            {/* OpenAI Card */}
            <div className="p-3 bg-white border border-slate-300 rounded-xl shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-slate-900 text-sm">OpenAI (ChatGPT / GPT-4o)</span>
                  <span className="text-[10px] bg-slate-200 text-slate-900 font-bold px-1.5 py-0.5 rounded">Špičková čeština</span>
                </div>
                <p className="text-xs text-slate-600 mb-2">
                  Model <strong>GPT-4o-mini</strong>. Tento klíč zároveň pohání i přirozený hlas Nova:
                </p>
                <a
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-slate-700 underline font-bold flex items-center mb-2"
                >
                  <span>Získat OpenAI API klíč</span>
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
                <input
                  type="password"
                  value={openAIKey}
                  onChange={(e) => handleOpenAIKeyChange(e.target.value)}
                  placeholder="Vložte sem klíč (začíná sk-...)"
                  className="key-input-field text-xs mb-2"
                />
              </div>

              <div>
                <button
                  type="button"
                  className="btn-save-key text-xs py-1.5 w-full justify-center bg-slate-800 hover:bg-slate-900"
                  onClick={handleTestOpenAI}
                  disabled={isTestingOpenAI}
                >
                  {isTestingOpenAI ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Check className="w-4 h-4 mr-1" />}
                  <span>Otestovat OpenAI</span>
                </button>
                {openAITestResult && (
                  <div className={`mt-1.5 text-xs font-bold p-1.5 rounded ${openAITestResult.ok ? 'bg-emerald-50 text-emerald-900' : 'bg-rose-50 text-rose-900'}`}>
                    {openAITestResult.message}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="status-badge-box mt-3">
            {openAIKey ? (
              <span className="status-tag status-ai">
                ✨ Aktivní mozek: OpenAI GPT-4o (Maximálně přirozená čeština a vřelost)
              </span>
            ) : geminiKey ? (
              <span className="status-tag status-ai">
                ✨ Aktivní mozek: Google Gemini AI (Chytré živé odpovědi)
              </span>
            ) : (
              <span className="status-tag status-offline">
                ⚡ Offline režim s pestrou bankou lidských vět (paní učitelka se neopakuje)
              </span>
            )}
          </div>
        </div>

        {/* 4. iPad & Tablet Live Address */}
        <div className="settings-section">
          <div className="section-header-row">
            <Tablet className="w-6 h-6 text-sky-600 mr-2" />
            <h3>Oficiální odkaz pro iPad a mobil (Zabezpečené HTTPS)</h3>
          </div>
          <p className="settings-desc">
            Na iPadu nebo mobilu v Safari / Chrome otevřete tuto oficiální zabezpečenou adresu (obsahuje zelený zámeček, mikrofon funguje bez varování):
          </p>

          <div className="mt-2 p-3 bg-emerald-50 border border-emerald-300 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <a
                href="https://lukamarkcz.github.io/school-hra/"
                target="_blank"
                rel="noreferrer"
                className="text-base bg-white px-3 py-1.5 rounded-lg border border-emerald-400 font-mono text-emerald-950 font-black underline select-all"
              >
                https://lukamarkcz.github.io/school-hra/
              </a>
            </div>
            <div className="flex items-start gap-2 text-xs text-emerald-900 bg-white/70 p-2.5 rounded-lg border border-emerald-200">
              <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Jak mluvit:</strong> V okně odpovědi se mikrofon sám zapne a jakmile dcera domluví, odpověď se sama automaticky odešle paní učitelce bez jakéhokoliv dalšího klikání!
              </span>
            </div>
          </div>
        </div>

        {/* 5. Pupils Voice Preview */}
        <div className="settings-section">
          <div className="section-header-row">
            <Volume2 className="w-6 h-6 text-emerald-600 mr-2" />
            <h3>Vyzkoušet hlasy spolužáků ve třídě</h3>
          </div>
          <div className="voice-test-grid">
            {students.map((st) => (
              <button
                key={st.id}
                type="button"
                className="voice-test-chip"
                onClick={() => handleTestPupilVoice(st)}
                title={`Poslechnout si hlas: ${st.name}`}
              >
                <span>{st.name} ({st.nickname})</span>
                <Volume2 className="w-4 h-4 ml-1 opacity-70" />
              </button>
            ))}
          </div>
        </div>

        {/* 6. Reset Day */}
        <div className="settings-section">
          <div className="section-header-row">
            <RotateCcw className="w-6 h-6 text-rose-600 mr-2" />
            <h3>Začít nový školní den</h3>
          </div>
          <p className="settings-desc">
            Vymaže všechny dosavadní známky ze sešitu a začne novou vyučovací hodinu:
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