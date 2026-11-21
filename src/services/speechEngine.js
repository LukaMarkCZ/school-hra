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

  // 2. Expand common Czech abbreviations that synthesizers spell letter-by-letter
  s = s.replace(/\batd\./gi, 'a tak dále');
  s = s.replace(/\bnapř\./gi, 'například');
  s = s.replace(/\bcca\b/gi, 'přibližně');
  s = s.replace(/\btj\./gi, 'to jest');
  s = s.replace(/\btzn\./gi, 'to znamená');
  s = s.replace(/\bapod\./gi, 'a podobně');
  s = s.replace(/\btzv\./gi, 'tak zvaně');

  // 3. Fix isolated or repeated 'Jé', 'Jééé', 'Jéé' which TTS parses as letter J + letter "e s čárkou"
  // Replaced by standard natural Czech interjection "Jéje" or "Jejda"
  s = s.replace(/(^|[^\p{L}])([Jj])é+(?=[^\p{L}]|$)/gu, (match, prefix, j) => {
    return prefix + (j === 'J' ? 'Jéje' : 'jéje');
  });
  s = s.replace(/(^|[^\p{L}])([Jj])ej(?=[^\p{L}]|$)/gu, (match, prefix, j) => {
    return prefix + (j === 'J' ? 'Jejda' : 'jejda');
  });

  // 4. Common pupil interjections with elongated vowels
  s = s.replace(/(^|[^\p{L}])[Jj]up[ií]+(?=[^\p{L}]|$)/giu, '$1Jupí');
  s = s.replace(/(^|[^\p{L}])[Gg][oó]+[ll]+(?=[^\p{L}]|$)/giu, '$1Gól');
  s = s.replace(/(^|[^\p{L}])[Mm]ň[aá]+m(?=[^\p{L}]|$)/giu, '$1Mňam');
  s = s.replace(/(^|[^\p{L}])[AÁaá]{2,}(?=[^\p{L}]|$)/giu, '$1Ách');
  s = s.replace(/(^|[^\p{L}])[UÚuú]{2,}(?=[^\p{L}]|$)/giu, '$1Úha');
  s = s.replace(/(^|[^\p{L}])[Oo]{3,}(?=[^\p{L}]|$)/giu, '$1Ó');
  s = s.replace(/(^|[^\p{L}])[Ee]{3,}(?=[^\p{L}]|$)/giu, '$1É');
  s = s.replace(/(^|[^\p{L}])[Hh]ur[aá]+(?=[^\p{L}]|$)/giu, '$1Hurá');

  // 5. Yawning / sleepy sounds
  s = s.replace(/(^|[^\p{L}])[Zz]ív\.{1,3}/gu, '$1Ách jo... ');

  // 6. Reduce any other 3+ repeated identical letters to 1 (e.g. supeeer -> super)
  s = s.replace(/([\p{L}])\1{2,}/gu, '$1');

  // 7. Math expressions to fluent Czech spoken words
  s = s.replace(/(\d+)\s*\+\s*(\d+)/g, '$1 plus $2');
  s = s.replace(/(\d+)\s*-\s*(\d+)/g, '$1 mínus $2');
  s = s.replace(/(\d+)\s*[*xX•]\s*(\d+)/g, '$1 krát $2');
  s = s.replace(/(\d+)\s*[\/:]\s*(\d+)/g, '$1 děleno $2');
  s = s.replace(/=\s*(\d+)/g, 'rovná se $1');

  // 8. Natural cadence: convert awkward long ellipsis (...) to natural comma pause
  s = s.replace(/\.{3,}/g, ', ');

  // 9. Clean up multiple punctuation and excess whitespace
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
      if (name.includes('neural')) score += 90;
      if (name.includes('enhanced') || name.includes('premium')) score += 80;
      if (name.includes('online')) score += 40;
      if (name.includes('google')) score += 35;
      if (name.includes('zuzana') || name.includes('jakub') || name.includes('vlasta') || name.includes('jan')) score += 20;
      if (v.lang === 'cs-CZ') score += 10;
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

    // Character voice tuning defaults (balanced natural ranges)
    let pitch = options.pitch ?? 1.0;
    let rate = options.rate ?? 1.0;
    let volume = options.volume ?? 1.0;

    // Apply specific pupil profiles if characterId is given
    if (options.characterId) {
      switch (options.characterId) {
        case 'eliska': // Šprtka - enthusiastic, quick, higher pitch
          pitch = 1.25;
          rate = 1.1;
          break;
        case 'matyas': // Šašek - energetic, bouncy, playful
          pitch = 1.12;
          rate = 1.18;
          break;
        case 'ondra': // Spáč - slow, drowsy, low pitch
          pitch = 0.88;
          rate = 0.85;
          break;
        case 'viktorie': // Rebelka - cool, lively, bold
          pitch = 1.05;
          rate = 1.05;
          break;
        case 'tomas': // Stydlín - shy, soft, gentle
          pitch = 1.18;
          rate = 0.92;
          volume = 0.85;
          break;
        case 'filip': // Sportovec - fast, punchy, sporty
          pitch = 0.96;
          rate = 1.16;
          break;
        case 'sofie': // Umělkyně - dreamy, melodic, creative
          pitch = 1.22;
          rate = 0.96;
          break;
        case 'kuba': // Hladovec - cheerful, round tone
          pitch = 0.92;
          rate = 0.96;
          break;
        case 'teacher': // Paní učitelka - clear, warm, friendly
          pitch = 1.05;
          rate = 1.0;
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
