// Speech Recognition Service (Speech to Text) for Teacher Questions in Czech
// Optimized for tablet / iPad and children:
// 1. Doesn't cut beginning: provides explicit 'onReady' signal when mic hardware starts
// 2. Doesn't cut end: uses continuous mode + 2.2s silence debounce + manual submit button

class SpeechRecognitionService {
  constructor() {
    const SpeechRecognition = typeof window !== 'undefined'
      ? (window.SpeechRecognition || window.webkitSpeechRecognition)
      : null;

    this.SpeechRecognitionClass = SpeechRecognition;
    this.recognition = null;
    this.isListening = false;
    this.isReady = false;
    this.currentTranscript = '';
    this.silenceTimer = null;

    this.onStartingCallback = null;
    this.onReadyCallback = null;
    this.onResultCallback = null;
    this.onFinalCallback = null;
    this.onErrorCallback = null;
    this.onEndCallback = null;
  }

  isSupported() {
    return !!this.SpeechRecognitionClass;
  }

  isSecureContext() {
    return typeof window === 'undefined' || window.isSecureContext !== false;
  }

  createInstance() {
    if (!this.SpeechRecognitionClass) return null;
    const rec = new this.SpeechRecognitionClass();
    rec.lang = 'cs-CZ';

    // Mobile browsers (iOS Safari, Android Chrome) must use continuous=false
    const isMobile = typeof navigator !== 'undefined' && (
      /iPad|iPhone|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    );

    rec.continuous = !isMobile;
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    return rec;
  }

  startListening({ onStarting, onReady, onResult, onFinal, onError, onEnd }) {
    if (!this.isSupported()) {
      if (onError) onError('Speech recognition is not supported in this browser.');
      return;
    }

    // Clean up previous run
    this.cancelListening();

    this.onStartingCallback = onStarting;
    this.onReadyCallback = onReady;
    this.onResultCallback = onResult;
    this.onFinalCallback = onFinal;
    this.onErrorCallback = onError;
    this.onEndCallback = onEnd;

    this.currentTranscript = '';
    this.isListening = true;
    this.isReady = false;

    if (onStarting) onStarting();

    this.recognition = this.createInstance();
    if (!this.recognition) return;

    // Fired when the microphone hardware is ACTUALLY capturing sound
    this.recognition.onstart = () => {
      this.isReady = true;
      if (this.onReadyCallback) this.onReadyCallback();
    };

    // Fired as speech is processed
    this.recognition.onresult = (event) => {
      let finalAccumulated = '';
      let interim = '';

      // Always iterate over ALL results to accumulate complete sentence
      for (let i = 0; i < event.results.length; ++i) {
        const res = event.results[i];
        if (res.isFinal) {
          finalAccumulated += res[0].transcript + ' ';
        } else {
          interim += res[0].transcript;
        }
      }

      const fullText = (finalAccumulated + interim).trim();

      if (fullText) {
        this.currentTranscript = fullText;
        if (this.onResultCallback) {
          this.onResultCallback(fullText);
        }

        // Reset silence timer: auto-submit when child pauses
        const isMobileDevice = typeof navigator !== 'undefined' && /iPad|iPhone|iPod|Android/i.test(navigator.userAgent);
        const silenceDelay = isMobileDevice ? 1600 : 2200;
        if (this.silenceTimer) clearTimeout(this.silenceTimer);
        this.silenceTimer = setTimeout(() => {
          this.submitCurrentTranscript();
        }, silenceDelay);
      }
    };

    this.recognition.onerror = (event) => {
      console.warn('Speech recognition error:', event.error);
      // 'no-speech' happens if user pauses before speaking, don't abort immediately
      if (event.error === 'no-speech') {
        return;
      }

      this.isListening = false;
      this.isReady = false;
      if (this.silenceTimer) clearTimeout(this.silenceTimer);

      if (this.onErrorCallback) {
        this.onErrorCallback(event.error);
      }
    };

    this.recognition.onend = () => {
      if (this.silenceTimer) clearTimeout(this.silenceTimer);

      const hadText = this.currentTranscript.trim();
      const wasListening = this.isListening;
      this.isListening = false;
      this.isReady = false;

      // If browser closed stream naturally but we collected speech, submit it!
      if (wasListening && hadText && this.onFinalCallback) {
        const cb = this.onFinalCallback;
        this.onFinalCallback = null;
        cb(hadText);
        return;
      }

      if (this.onEndCallback) {
        this.onEndCallback();
      }
    };

    try {
      this.recognition.start();
    } catch (e) {
      console.error('Failed to start speech recognition', e);
      this.isListening = false;
      this.isReady = false;
      if (onError) onError(e);
    }
  }

  // Submit what has been heard so far (called by silence timer, or manual checkmark button)
  submitCurrentTranscript() {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }

    const textToSubmit = this.currentTranscript.trim();
    const finalCallback = this.onFinalCallback;

    // Stop recognition
    this.stopEngine();

    if (textToSubmit && finalCallback) {
      this.onFinalCallback = null;
      finalCallback(textToSubmit);
    } else if (this.onEndCallback) {
      this.onEndCallback();
    }
  }

  // Teacher clicked "Zeptat se" button or tapped mic again to finish
  manualSubmit() {
    const text = this.currentTranscript.trim();
    if (text) {
      this.submitCurrentTranscript();
      return text;
    } else {
      this.cancelListening();
      return '';
    }
  }

  // Teacher clicked "Zrušit" button
  cancelListening() {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
    this.currentTranscript = '';
    this.isListening = false;
    this.isReady = false;
    this.stopEngine();
    if (this.onEndCallback) {
      this.onEndCallback();
    }
  }

  stopEngine() {
    this.isListening = false;
    this.isReady = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // Ignored
      }
      this.recognition = null;
    }
  }

  stopListening() {
    this.submitCurrentTranscript();
  }
}

export const speechRecognizer = new SpeechRecognitionService();
