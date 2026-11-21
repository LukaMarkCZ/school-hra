import React from 'react';
import { Mic, Check, X, Loader2, Volume2, AlertTriangle, Keyboard, RefreshCw, ExternalLink } from 'lucide-react';

export function TeacherMicBar({
  micStatus, // 'starting' | 'listening' | 'error'
  liveText,
  errorMessage,
  onSubmit,
  onCancel,
  onOpenKeyboard,
  onRetry
}) {
  if (micStatus !== 'starting' && micStatus !== 'listening' && micStatus !== 'error') {
    return null;
  }

  const isStarting = micStatus === 'starting';
  const isError = micStatus === 'error';
  const hasText = Boolean(liveText && liveText.trim());

  if (isError) {
    const isHttpsIssue = window.location.protocol === 'http:' && window.location.hostname !== 'localhost';

    return (
      <div className="teacher-mic-overlay-container">
        <div className="teacher-mic-card state-error">
          <div className="mic-card-header">
            <div className="mic-card-status-pill error-pill">
              <AlertTriangle className="w-5 h-5 text-amber-600 mr-2 flex-shrink-0" />
              <span className="status-label text-amber-950 font-extrabold">
                {isHttpsIssue ? 'Na iPadu je nutné zabezpečené HTTPS' : 'Mikrofon v prohlížeči'}
              </span>
            </div>
            <button
              type="button"
              className="btn-mic-cancel-round"
              onClick={onCancel}
              title="Zavřít"
            >
              <X className="w-6 h-6 text-slate-600" />
            </button>
          </div>

          <div className="mic-error-box">
            <p className="mic-error-text">
              {errorMessage || 'Prohlížeč na tabletu zablokoval přístup k mikrofonu.'}
            </p>
          </div>

          <div className="mic-card-buttons-row">
            <button
              type="button"
              className="btn-mic-submit animate-bounce-subtle"
              onClick={onOpenKeyboard}
            >
              <Keyboard className="w-5 h-5 mr-2" />
              <span>Diktovat přes klávesnici iPadu</span>
            </button>

            {!isHttpsIssue && onRetry && (
              <button
                type="button"
                className="btn-mic-cancel-text"
                onClick={onRetry}
              >
                <RefreshCw className="w-4 h-4 mr-1 inline" />
                <span>Zkusit znovu</span>
              </button>
            )}

            <button
              type="button"
              className="btn-mic-cancel-text"
              onClick={onCancel}
            >
              Zavřít
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="teacher-mic-overlay-container">
      <div className={`teacher-mic-card ${isStarting ? 'state-starting' : 'state-listening'}`}>
        {/* Status Header */}
        <div className="mic-card-header">
          <div className="mic-card-status-pill">
            {isStarting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-amber-500 mr-2" />
                <span className="status-label text-amber-900 font-extrabold">
                  ⏳ Zapínám mikrofon... Počkej na cinknutí!
                </span>
              </>
            ) : (
              <>
                <span className="recording-live-dot" />
                <span className="status-label text-red-900 font-extrabold">
                  🔴 TEĎ MLUV! Třída tě poslouchá...
                </span>
              </>
            )}
          </div>

          <button
            type="button"
            className="btn-mic-cancel-round"
            onClick={onCancel}
            title="Zrušit mluvení"
          >
            <X className="w-6 h-6 text-slate-600" />
          </button>
        </div>

        {/* Live Heard Transcript Box */}
        <div className="mic-transcript-box">
          {hasText ? (
            <p className="transcript-live-text">
              „{liveText}“
            </p>
          ) : (
            <p className="transcript-placeholder">
              {isStarting
                ? 'Za okamžik zazní cinknutí a můžeš mluvit...'
                : 'Mluv nahlas do tabletu (např. „Jaké zvíře žije v lese?“)...'}
            </p>
          )}
        </div>

        {/* Action Controls & Hint */}
        <div className="mic-card-actions">
          <div className="mic-card-hint">
            <Volume2 className="w-4 h-4 text-slate-500 mr-1 inline-block" />
            <span>
              {hasText
                ? 'Po domluvení 2 vteřinky počkej (odešle se samo), nebo ťukni na zelené tlačítko:'
                : 'Mluv zřetelně směrem k tabletu nebo notebooku.'}
            </span>
          </div>

          <div className="mic-card-buttons-row">
            {hasText && (
              <button
                type="button"
                className="btn-mic-submit animate-bounce-subtle"
                onClick={onSubmit}
              >
                <Check className="w-6 h-6 mr-2 stroke-[3]" />
                <span>Zeptat se třídy!</span>
              </button>
            )}

            <button
              type="button"
              className="btn-mic-cancel-text"
              onClick={onOpenKeyboard}
              title="Použít klávesnici a systémové diktování"
            >
              <Keyboard className="w-4 h-4 mr-1 inline" />
              <span>Napsat / Klávesnice</span>
            </button>

            <button
              type="button"
              className="btn-mic-cancel-text"
              onClick={onCancel}
            >
              <span>Zrušit</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
