import React, { useState, useEffect } from 'react';
import {
  X,
  Volume2,
  RotateCcw,
  Check,
  Sparkles,
  ExternalLink,
  AlertTriangle,
  Loader2,
  Tablet,
  Play,
  Square,
  Trash2
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

  const handleClearGemini = () => {
    setGeminiKey('');
    localStorage.removeItem('gemini_api_key');
    setGeminiTestResult({ ok: false, message: 'Gemini klíč byl smazán.' });
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

  const handleClearOpenAI = () => {
    setOpenAIKey('');
    localStorage.removeItem('openai_api_key');
    setOpenAITestResult({ ok: false, message: 'OpenAI klíč byl smazán.' });
  };

  const handleTtsProviderChange = (provider) => {
    setTtsProvider(provider);
    localStorage.setItem('tts_provider', provider);
    setPreviewError('');
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
      setGeminiTestResult({ ok: false, message: 'Nejprve zadejte Gemini klíč.' });
      return;
    }
    setIsTestingGemini(true);
    setGeminiTestResult(null);
    const res = await testGeminiAPI(key);
    setIsTestingGemini(false);
    if (res.ok) {
      setGeminiTestResult({ ok: true, message: res.message });
    } else {
      setGeminiTestResult({ ok: false, message: res.error });
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
      setOpenAITestResult({ ok: true, message: res.message });
    } else {
      setOpenAITestResult({ ok: false, message: res.error });
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
        setPreviewError(err);
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

  const isOpenAIWithCreditError = openAITestResult && !openAITestResult.ok && openAITestResult.message.includes('kredit');

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
          <div style={{ marginTop: '8px' }}>
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
            Pokud paní učitelka zní roboticky, je to způsobeno starým systémovým hlasem v počítači. Zde můžete přepnout na <strong>nádherný lidský hlas s přirozenou intonací a dechem</strong>:
          </p>

          <div className="settings-provider-grid">
            {/* OpenAI TTS Option */}
            <div
              className={`settings-provider-card ${ttsProvider === 'openai' || (ttsProvider === 'auto' && openAIKey && !isOpenAIWithCreditError) ? 'active' : ''}`}
              onClick={() => handleTtsProviderChange('openai')}
            >
              <div>
                <div className="settings-card-top-row">
                  <span className="settings-card-title">🎙️ OpenAI TTS</span>
                  <span className="settings-card-badge">Doporučeno</span>
                </div>
                <p className="settings-card-desc">
                  Přirozený lidský ženský hlas <strong>Nova</strong>. Zní jako skutečná mladá usměvavá paní učitelka.
                </p>
              </div>
            </div>

            {/* ElevenLabs Option */}
            <div
              className={`settings-provider-card ${ttsProvider === 'elevenlabs' || (ttsProvider === 'auto' && elevenLabsKey) ? 'active' : ''}`}
              onClick={() => handleTtsProviderChange('elevenlabs')}
            >
              <div>
                <div className="settings-card-top-row">
                  <span className="settings-card-title">🌟 ElevenLabs</span>
                  <span className="settings-card-badge badge-green">Ultra Realistický</span>
                </div>
                <p className="settings-card-desc">
                  Špičkový hyper-realistický AI model <strong>Multilingual v2</strong> s českou intonací.
                </p>
              </div>
            </div>

            {/* Local Web Speech Option */}
            <div
              className={`settings-provider-card ${ttsProvider === 'webspeech' || (ttsProvider === 'auto' && !openAIKey && !elevenLabsKey) || isOpenAIWithCreditError ? 'active' : ''}`}
              onClick={() => handleTtsProviderChange('webspeech')}
            >
              <div>
                <div className="settings-card-top-row">
                  <span className="settings-card-title">🌐 Hlas v zařízení</span>
                  <span className="settings-card-badge badge-blue">Zdarma offline</span>
                </div>
                <p className="settings-card-desc">
                  Hlas z Windows (Edge Vlasta/Jakub) nebo iOS (Zuzana/Siri). Nevyžaduje internet ani kredit.
                </p>
              </div>
            </div>
          </div>

          {/* Provider Details & Config */}
          <div className="settings-config-box">
            {(ttsProvider === 'openai' || (ttsProvider === 'auto' && openAIKey)) && (
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1E293B', display: 'block', marginBottom: '4px' }}>
                  Hlas OpenAI pro paní učitelku:
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <select
                    value={openAIVoice}
                    onChange={(e) => handleOpenAIVoiceChange(e.target.value)}
                    className="settings-select-input"
                    style={{ maxWidth: '280px' }}
                  >
                    <option value="nova">Nova (Teplý, milý, mateřský paní učitelky)</option>
                    <option value="shimmer">Shimmer (Jemný, melodický ženský)</option>
                    <option value="alloy">Alloy (Čistý, neutrální)</option>
                  </select>
                  <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
                    Klíč se zadává v sekci OpenAI níže.
                  </span>
                </div>
                {isOpenAIWithCreditError && (
                  <div className="settings-test-msg msg-err" style={{ marginTop: '8px' }}>
                    ⚠️ Váš OpenAI účet nemá kredit. Pro vyzkoušení hlasu přepněte na <strong>„Hlas v zařízení“</strong> výše.
                  </div>
                )}
              </div>
            )}

            {(ttsProvider === 'elevenlabs' || (ttsProvider === 'auto' && elevenLabsKey)) && (
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1E293B', display: 'block', marginBottom: '4px' }}>
                  Váš ElevenLabs API klíč:
                </label>
                <input
                  type="password"
                  value={elevenLabsKey}
                  onChange={(e) => handleElevenLabsKeyChange(e.target.value)}
                  placeholder="Vložte sem ElevenLabs klíč..."
                  className="settings-input-key"
                />
              </div>
            )}

            {(ttsProvider === 'webspeech' || (!openAIKey && !elevenLabsKey) || isOpenAIWithCreditError) && (
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1E293B', display: 'block', marginBottom: '4px' }}>
                  Vyberte český hlas z vašeho zařízení:
                </label>
                {availableWebVoices.length > 0 ? (
                  <select
                    value={selectedWebVoice}
                    onChange={(e) => handleWebVoiceChange(e.target.value)}
                    className="settings-select-input"
                  >
                    {availableWebVoices.map((v) => (
                      <option key={v.voiceURI || v.name} value={v.voiceURI || v.name}>
                        {v.name} ({v.lang})
                      </option>
                    ))}
                  </select>
                ) : (
                  <span style={{ fontSize: '0.8rem', color: '#92400E', fontWeight: 700, display: 'block' }}>
                    V systému zatím nebyl detekován žádný specifický český hlas, použije se výchozí.
                  </span>
                )}
                <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '6px', lineHeight: 1.4 }}>
                  <div>💡 <strong>Na iPadu/iPhonu:</strong> V <em>Nastavení iPadu → Zpřístupnění → Předčítání obsahu → Hlasy → Čeština</em> stáhněte rozšířený hlas <strong>Zuzana / Siri</strong> pro krásný lidský tón.</div>
                  <div>💡 <strong>Na PC:</strong> V prohlížeči <strong>Microsoft Edge</strong> jsou zdarma k dispozici přirozené lidské hlasy <em>Microsoft Vlasta Online</em> a <em>Antonin Online</em>.</div>
                </div>
              </div>
            )}

            {/* Test Voice Button */}
            <div style={{ paddingTop: '8px', borderTop: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
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

              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569' }}>
                Aktivní: {speech.getActiveVoiceName()}
              </span>
            </div>

            {previewError && (
              <div className="settings-test-msg msg-err">
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

          <div className="settings-ai-grid">
            {/* Google Gemini Card */}
            <div className="settings-ai-card card-gemini">
              <div>
                <div className="settings-card-top-row">
                  <span className="settings-card-title">Google Gemini AI</span>
                  <span className="settings-card-badge badge-green">Zcela zdarma</span>
                </div>
                <p className="settings-card-desc" style={{ marginBottom: '8px' }}>
                  Model <strong>Gemini 1.5 / 2.0 Flash</strong> od Google. Klíč získáte zdarma jedním kliknutím:
                </p>
                <div>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="settings-link-row"
                  >
                    <span>Získat bezplatný klíč v Google AI Studio</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </a>
                </div>
                <input
                  type="password"
                  value={geminiKey}
                  onChange={(e) => handleGeminiKeyChange(e.target.value)}
                  placeholder="Vložte sem klíč (začíná AIzaSy...)"
                  className="settings-input-key"
                />
              </div>

              <div>
                <div className="settings-buttons-row">
                  <button
                    type="button"
                    className="settings-btn-test"
                    onClick={handleTestGemini}
                    disabled={isTestingGemini}
                  >
                    {isTestingGemini ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Check className="w-4 h-4 mr-1" />}
                    <span>Otestovat Gemini AI</span>
                  </button>
                  {geminiKey && (
                    <button
                      type="button"
                      className="settings-btn-clear"
                      onClick={handleClearGemini}
                      title="Smazat klíč"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {geminiTestResult && (
                  <div className={`settings-test-msg ${geminiTestResult.ok ? 'msg-ok' : 'msg-err'}`}>
                    {geminiTestResult.message}
                  </div>
                )}
              </div>
            </div>

            {/* OpenAI Card */}
            <div className="settings-ai-card card-openai">
              <div>
                <div className="settings-card-top-row">
                  <span className="settings-card-title">OpenAI (ChatGPT / GPT-4o)</span>
                  <span className="settings-card-badge">Špičková čeština</span>
                </div>
                <p className="settings-card-desc" style={{ marginBottom: '8px' }}>
                  Model <strong>GPT-4o-mini</strong> a přirozený hlas <strong>Nova</strong>:
                </p>
                <div>
                  <a
                    href="https://platform.openai.com/api-keys"
                    target="_blank"
                    rel="noreferrer"
                    className="settings-link-row"
                  >
                    <span>Získat OpenAI API klíč</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </a>
                </div>
                <input
                  type="password"
                  value={openAIKey}
                  onChange={(e) => handleOpenAIKeyChange(e.target.value)}
                  placeholder="Vložte sem klíč (začíná sk-...)"
                  className="settings-input-key"
                />
              </div>

              <div>
                <div className="settings-buttons-row">
                  <button
                    type="button"
                    className="settings-btn-test btn-openai"
                    onClick={handleTestOpenAI}
                    disabled={isTestingOpenAI}
                  >
                    {isTestingOpenAI ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Check className="w-4 h-4 mr-1" />}
                    <span>Otestovat OpenAI</span>
                  </button>
                  {openAIKey && (
                    <button
                      type="button"
                      className="settings-btn-clear"
                      onClick={handleClearOpenAI}
                      title="Smazat klíč"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {openAITestResult && (
                  <div className={`settings-test-msg ${openAITestResult.ok ? 'msg-ok' : 'msg-err'}`}>
                    {openAITestResult.message}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="settings-badge-status">
            {openAIKey && openAITestResult?.ok ? (
              <span className="status-tag status-ai">
                ✨ Aktivní mozek: OpenAI GPT-4o-mini (Maximálně přirozená čeština a vřelost)
              </span>
            ) : geminiKey && (!geminiTestResult || geminiTestResult.ok) ? (
              <span className="status-tag status-ai">
                ✨ Aktivní mozek: Google Gemini AI (Chytré živé odpovědi)
              </span>
            ) : (
              <span className="status-tag status-offline">
                ⚡ Aktivní mozek: Vestavěný offline mozek s pestrou bankou (60+ lidských vět bez opakování)
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

          <div style={{ marginTop: '8px', padding: '12px 14px', background: '#ECFDF5', border: '1.5px solid #6EE7B7', borderRadius: '14px' }}>
            <div style={{ marginBottom: '8px' }}>
              <a
                href="https://lukamarkcz.github.io/school-hra/"
                target="_blank"
                rel="noreferrer"
                style={{
                  fontSize: '0.95rem',
                  background: '#FFFFFF',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid #10B981',
                  fontFamily: 'monospace',
                  color: '#064E3B',
                  fontWeight: 900,
                  textDecoration: 'underline',
                  display: 'inline-block'
                }}
              >
                https://lukamarkcz.github.io/school-hra/
              </a>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.78rem', color: '#065F46', background: 'rgba(255,255,255,0.7)', padding: '10px', borderRadius: '8px' }}>
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