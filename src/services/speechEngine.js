// Czech Speech Synthesis Engine for "Paní učitelka"
// Accurately voiced pupils and teacher using Web Speech API with advanced Czech phonetic normalization

/**
 * Normalizes Czech text before feeding it to speech synthesis.
 * Eliminates the notorious bug where TTS engines spell out isolated "Jé" or "Jééé" as "j e s čárkou",
 * strips emojis, expands abbreviations and math formulas into fluent spoken Czech.
 * @param {string} text - Raw input text
 * @returns {string} - Clean, phonetically normalized Czech text for TTS
 */
export function preprocessCzechForTTS(text) {
  if (!text || typeof text !== 'string') return '';
  let s = text;

  // 1. Remove all emojis (⭐, 🍎, 🍕, etc.) so TTS doesn't read symbol names
  s = s.replace(/\p{Extended_Pictographic}/gu, '');

  // 2. Strip quotation marks and typographical symbols that synthesizers read out loud
  s = s.replace(/[„“”"«»]/g, '');
  s = s.replace(/:\s+/g, ', '); // Convert colon to natural pause comma
  s = s.replace(/[•–—]/g, ' ');

  // 3. Expand common school units and abbreviations
  s = s.replace(/\batd\./gi, 'a tak dále');
  s = s.replace(/\bnapř\./gi, 'například');
  s = s.replace(/\bcca\b/gi, 'přibližně');
  s = s.replace(/\btj\./gi, 'to jest');
  s = s.replace(/\btzn\./gi, 'to znamená');
  s = s.replace(/\bapod\./gi, 'a podobně');
  s = s.replace(/\btzv\./gi, 'tak zvaně');
  s = s.replace(/(\d+)\s*km\/h\b/gi, '$1 kilometrů v hodině');
  s = s.replace(/(\d+)\s*km\b/gi, '$1 kilometrů');
  s = s.replace(/(\d+)\s*kg\b/gi, '$1 kilogramů');
  s = s.replace(/(\d+)\s*min\b/gi, '$1 minut');
  s = s.replace(/(\d+)\s*°C\b/gi, '$1 stupňů Celsia');

  // 4. Ordinal numbers common in school context
  s = s.replace(/\b1\.\s*tříd/gi, 'první tříd');
  s = s.replace(/\b2\.\s*tříd/gi, 'druhé tříd');
  s = s.replace(/\b3\.\s*tříd/gi, 'třetí tříd');
  s = s.replace(/\b4\.\s*tříd/gi, 'čtvrté tříd');
  s = s.replace(/\b5\.\s*tříd/gi, 'páté tříd');
  s = s.replace(/\bza\s+1\b/gi, 'za jedna');
  s = s.replace(/\bza\s+2\b/gi, 'za dva');

  // 5. Fix isolated or repeated 'Jé', 'Jééé', 'Jéé' which TTS parses as letter J + letter "e s čárkou"
  s = s.replace(/(^|[^\p{L}])([Jj])é+(?=[^\p{L}]|$)/gu, (match, prefix, j) => {
    return prefix + (j === 'J' ? 'Jéje' : 'jéje');
  });
  s = s.replace(/(^|[^\p{L}])([Jj])ej(?=[^\p{L}]|$)/gu, (match, prefix, j) => {
    return prefix + (j === 'J' ? 'Jejda' : 'jejda');
  });

  // 6. Common pupil interjections with elongated vowels
  s = s.replace(/(^|[^\p{L}])[Jj]up[ií]+(?=[^\p{L}]|$)/giu, '$1Jupí');
  s = s.replace(/(^|[^\p{L}])[Gg][oó]+[ll]+(?=[^\p{L}]|$)/giu, '$1Gól');
  s = s.replace(/(^|[^\p{L}])[Mm]ň[aá]+m(?=[^\p{L}]|$)/giu, '$1Mňam');
  s = s.replace(/(^|[^\p{L}])[AÁaá]{2,}(?=[^\p{L}]|$)/giu, '$1Ách');
  s = s.replace(/(^|[^\p{L}])[UÚuú]{2,}(?=[^\p{L}]|$)/giu, '$1Úha');
  s = s.replace(/(^|[^\p{L}])[Oo]{3,}(?=[^\p{L}]|$)/giu, '$1Ó');
  s = s.replace(/(^|[^\p{L}])[Ee]{3,}(?=[^\p{L}]|$)/giu, '$1É');
  s = s.replace(/(^|[^\p{L}])[Hh]ur[aá]+(?=[^\p{L}]|$)/giu, '$1Hurá');

  // 7. Yawning / sleepy sounds
  s = s.replace(/(^|[^\p{L}])[Zz]ív\.{1,3}/gu, '$1Ách jo... ');

  // 8. Reduce 3+ repeated identical letters to 1
  s = s.replace(/([\p{L}])\1{2,}/gu, '$1');

  // 9. Math expressions to fluent Czech spoken words
  s = s.replace(/(\d+)\s*\+\s*(\d+)/g, '$1 plus $2');
  s = s.replace(/(\d+)\s*-\s*(\d+)/g, '$1 mínus $2');
  s = s.replace(/(\d+)\s*[*xX•]\s*(\d+)/g, '$1 krát $2');
  s = s.replace(/(\d+)\s*[\/:]\s*(\d+)/g, '$1 děleno $2');
  s = s.replace(/=\s*(\d+)/g, 'rovná se $1');

  // 10. Natural prosody: expand numbers in common questions
  s = s.replace(/\b5\s*krát\s*5\b/gi, 'pět krát pět');
  s = s.replace(/\b12\s*plus\s*15\b/gi, 'dvanáct plus patnáct');

  // 11. Natural cadence: convert long ellipsis (...) to gentle comma pause
  s = s.replace(/\.{3,}/g, ', ');

  // 12. Clean up multiple punctuation and excess whitespace
  s = s.replace(/,\s*,/g, ',');
  s = s.replace(/\s+/g, ' ').trim();

  return s;
}

class SpeechEngine {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.voices = [];
    this.czechVoices = [];
    this.czechVoice = null;
    this.femaleVoice = null;
    this.maleVoice = null;
    this.currentUtterance = null;
    this.isSpeaking = false;
    this.onSpeechStateChange = null;

    if (this.synth) {
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices() || [];
    
    // Filter all Czech voices
    const czechVoices = this.voices.filter(v => 
      v.lang === 'cs-CZ' || v.lang === 'cs_CZ' || v.lang.startsWith('cs')
    );

    // Score voices by quality (Natural/Neural/Online/Apple/Google get top ranking)
    const scoreVoice = (v) => {
      let score = 0;
      const name = (v.name || '').toLowerCase();
      if (name.includes('natural')) score += 100;
      if (name.includes('neural')) score += 95;
      if (name.includes('enhanced') || name.includes('premium')) score += 90;
      if (name.includes('siri')) score += 85;
      if (name.includes('online')) score += 50;
      if (name.includes('google')) score += 40;
      if (name.includes('zuzana')) score += 30;
      if (name.includes('jakub') || name.includes('vlasta') || name.includes('jan')) score += 25;
      if (v.lang === 'cs-CZ') score += 15;
      if (v.default) score += 5;
      return score;
    };

    czechVoices.sort((a, b) => scoreVoice(b) - scoreVoice(a));

    this.czechVoices = czechVoices;
    this.czechVoice = czechVoices[0] || null;

    // Distinguish Female vs Male Czech voices for boy / girl students
    this.femaleVoice = czechVoices.find(v => {
      const n = (v.name || '').toLowerCase();
      return n.includes('female') || n.includes('vlasta') || n.includes('zuzana') || n.includes('iveta') || n.includes('hana');
    }) || this.czechVoice;

    this.maleVoice = czechVoices.find(v => {
      const n = (v.name || '').toLowerCase();
      return n.includes('male') || n.includes('jakub') || n.includes('jan') || n.includes('michal') || n.includes('josef');
    }) || this.czechVoice;
  }

  getAvailableCzechVoices() {
    return this.czechVoices;
  }

  getActiveVoiceName() {
    return this.czechVoice ? this.czechVoice.name : 'Výchozí systémový hlas';
  }

  // Pre-warm audio on iOS Safari on first user interaction
  warmUp() {
    if (!this.synth) return;
    try {
      this.synth.resume();
      const silent = new SpeechSynthesisUtterance(' ');
      silent.volume = 0.01;
      silent.rate = 2;
      this.synth.speak(silent);
    } catch {
      // Ignored
    }
  }

  stop() {
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
      this.keepAliveInterval = null;
    }
    if (!this.synth) return;
    try {
      this.synth.cancel();
      this.isSpeaking = false;
      if (this.onSpeechStateChange) {
        this.onSpeechStateChange(false, null);
      }
    } catch {
      // Ignored
    }
  }

  /**
   * Speak Czech text with character-specific voice and pitch tuning
   * @param {string} text - text to speak
   * @param {Object} options - { characterId, pitch, rate, volume, onStart, onEnd }
   */
  speak(text, options = {}) {
    if (!this.synth || !text) {
      if (options.onEnd) options.onEnd();
      return;
    }

    // Cancel any previous utterance
    this.stop();

    // Phonetically normalize Czech text (fixes "j e s čárkou", emojis, math, etc.)
    const spokenText = preprocessCzechForTTS(text);
    if (!spokenText) {
      if (options.onEnd) options.onEnd();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(spokenText);
    this.currentUtterance = utterance; // Prevent garbage collection bug in Chrome/Safari

    // Refresh voices if not yet cached
    if (!this.czechVoice) {
      this.loadVoices();
    }

    // Character gender & voice selection
    const femaleCharacters = ['eliska', 'viktorie', 'sofie', 'teacher'];
    const isFemale = options.characterId && femaleCharacters.includes(options.characterId);

    let voiceToUse = this.czechVoice;
    if (isFemale && this.femaleVoice) {
      voiceToUse = this.femaleVoice;
    } else if (!isFemale && this.maleVoice && options.characterId) {
      voiceToUse = this.maleVoice;
    }

    if (voiceToUse) {
      utterance.voice = voiceToUse;
      utterance.lang = voiceToUse.lang;
    } else {
      utterance.lang = 'cs-CZ';
    }

    // Character voice tuning defaults (natural, warm parameters without chipmunk distortion)
    let pitch = options.pitch ?? 1.0;
    let rate = options.rate ?? 1.0;
    let volume = options.volume ?? 1.0;

    // Apply specific pupil profiles if characterId is given
    if (options.characterId) {
      switch (options.characterId) {
        case 'eliska': // Šprtka - enthusiastic, cheerful, bright young voice
          pitch = 1.14;
          rate = 1.04;
          break;
        case 'matyas': // Šašek - energetic, bouncy, playful
          pitch = 1.08;
          rate = 1.08;
          break;
        case 'ondra': // Spáč - calm, relaxed, drowsy
          pitch = 0.94;
          rate = 0.88;
          break;
        case 'viktorie': // Rebelka - confident, spirited
          pitch = 1.04;
          rate = 1.02;
          break;
        case 'tomas': // Stydlín - gentle, polite, soft
          pitch = 1.08;
          rate = 0.94;
          volume = 0.88;
          break;
        case 'filip': // Sportovec - fast, crisp
          pitch = 0.98;
          rate = 1.06;
          break;
        case 'sofie': // Umělkyně - melodic, sweet
          pitch = 1.12;
          rate = 0.96;
          break;
        case 'kuba': // Hladovec - cheerful, round
          pitch = 0.96;
          rate = 0.96;
          break;
        case 'teacher': // Paní učitelka - warm, articulate, maternal, gentle pacing for children
          pitch = 1.03;
          rate = 0.94;
          volume = 1.0;
          break;
        default:
          pitch = 1.0;
          rate = 1.0;
      }
    }

    utterance.pitch = pitch;
    utterance.rate = rate;
    utterance.volume = volume;

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (this.onSpeechStateChange) {
        this.onSpeechStateChange(true, options.characterId);
      }
      if (options.onStart) options.onStart();
    };

    const handleFinish = () => {
      if (this.keepAliveInterval) {
        clearInterval(this.keepAliveInterval);
        this.keepAliveInterval = null;
      }
      this.isSpeaking = false;
      this.currentUtterance = null;
      if (this.onSpeechStateChange) {
        this.onSpeechStateChange(false, null);
      }
      if (options.onEnd) options.onEnd();
    };

    utterance.onend = handleFinish;
    utterance.onerror = (err) => {
      console.warn('Speech error:', err);
      handleFinish();
    };

    // Keep-alive guard for mobile Safari / Chrome on long sentences
    if (this.keepAliveInterval) clearInterval(this.keepAliveInterval);
    this.keepAliveInterval = setInterval(() => {
      if (this.isSpeaking && this.synth && !this.synth.paused) {
        this.synth.pause();
        this.synth.resume();
      }
    }, 4000);

    // Workaround for Chrome/Safari pausing long speeches
    try {
      this.synth.speak(utterance);
    } catch (e) {
      console.error('Failed to trigger speech synthesis', e);
      handleFinish();
    }
  }
}

export const speech = new SpeechEngine();
