import React from 'react';
import { GRADE_TYPES, STAMP_TYPES } from '../data/studentsData';
import { X, Volume2, Award, Heart, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export function GradeBookModal({
  student,
  onClose,
  onGiveGrade,
  onGiveStamp,
  onStudentSpeak
}) {
  if (!student) return null;

  const handleGradeClick = (gradeItem) => {
    if (gradeItem.value === 1 || gradeItem.value === 'star') {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // Ignored
      }
    }
    onGiveGrade(student, gradeItem);
  };

  const handleStampClick = (stampItem) => {
    if (stampItem.id === 'praise') {
      try {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.6 }
        });
      } catch {
        // Ignored
      }
    }
    onGiveStamp(student, stampItem);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="gradebook-card-container" onClick={(e) => e.stopPropagation()}>
        {/* Header Bar */}
        <div className="gradebook-cover-banner">
          <div className="gradebook-title-row">
            <span className="notebook-crest">🎒</span>
            <span className="notebook-main-title">ŽÁKOVSKÁ KNÍŽKA</span>
            <span className="notebook-class-title">{student.name}</span>
          </div>
          <button
            type="button"
            className="gradebook-close-btn"
            onClick={onClose}
            title="Zavřít žákovskou knížku"
          >
            <X className="w-8 h-8 text-white" />
          </button>
        </div>

        {/* Lined Notebook Page */}
        <div className="gradebook-page">
          {/* Pupil Profile Card */}
          <div className="student-profile-bar">
            <div className="profile-photo-frame">
              <div className="profile-mini-avatar" style={{ backgroundColor: student.clothesColor }}>
                <span className="profile-avatar-emoji">
                  {student.id === 'eliska' && '👧'}
                  {student.id === 'matyas' && '👦'}
                  {student.id === 'ondra' && '😴'}
                  {student.id === 'viktorie' && '🛹'}
                  {student.id === 'tomas' && '🧒'}
                  {student.id === 'filip' && '⚽'}
                  {student.id === 'sofie' && '🎨'}
                  {student.id === 'kuba' && '🍎'}
                </span>
              </div>
            </div>

            <div className="profile-info-text">
              <h2 className="student-modal-name">{student.name}</h2>
              <p className="student-modal-role">
                <span className="role-tag">{student.nickname}</span>
                <span className="role-desc"> • {student.roleTitle}</span>
              </p>
            </div>

            {/* Quick Ask / Speak button */}
            <button
              type="button"
              className="btn-call-student"
              onClick={() => onStudentSpeak(student)}
              title="Nechat žáka promluvit"
            >
              <Volume2 className="w-6 h-6 mr-1" />
              <span>Promluv!</span>
            </button>
          </div>

          {/* Section 1: Big Grade Buttons */}
          <div className="gradebook-section">
            <h3 className="section-title">
              <Award className="w-6 h-6 text-emerald-600 inline mr-2" />
              1. Vyber známku:
            </h3>

            <div className="grades-grid">
              {GRADE_TYPES.map((g) => (
                <button
                  key={g.value}
                  type="button"
                  className={`grade-stamp-btn grade-btn-${g.value}`}
                  style={{ borderColor: g.color }}
                  onClick={() => handleGradeClick(g)}
                  title={`Udělit známku ${g.label}`}
                >
                  <span className="grade-stamp-value" style={{ color: g.color }}>
                    {g.short}
                  </span>
                  <span className="grade-stamp-label">{g.label.split(' - ')[1] || g.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Big Stamp Buttons (Notes / Razítka) */}
          <div className="gradebook-section">
            <h3 className="section-title">
              <Heart className="w-6 h-6 text-rose-500 inline mr-2" />
              2. Nebo dej obrázkové razítko:
            </h3>

            <div className="stamps-grid">
              {STAMP_TYPES.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  className={`stamp-box-btn stamp-${st.id}`}
                  onClick={() => handleStampClick(st)}
                  title={`Otisknout razítko: ${st.label}`}
                >
                  <span className="stamp-box-icon">{st.icon}</span>
                  <span className="stamp-box-text">{st.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: History of Grades & Stamps in this lesson */}
          <div className="gradebook-section history-section">
            <h3 className="section-title">
              <CheckCircle2 className="w-5 h-5 text-indigo-600 inline mr-2" />
              Razítka v sešitě z dnešního dne:
            </h3>

            <div className="history-entries-list">
              {student.grades.length === 0 && student.stamps.length === 0 ? (
                <div className="empty-history-notice">
                  <span>Zatím prázdná stránka. Ťukni na známku nebo razítko nahoře!</span>
                </div>
              ) : (
                <div className="entries-stream">
                  {/* Grades history stamps */}
                  {student.grades.map((gr, idx) => (
                    <div key={`gr-${idx}`} className="stamped-mark grade-mark" style={{ borderColor: gr.color }}>
                      <span className="stamped-value" style={{ color: gr.color }}>{gr.short}</span>
                      <span className="stamped-note">{gr.label}</span>
                    </div>
                  ))}

                  {/* Misbehavior / Praise Stamps */}
                  {student.stamps.map((st, idx) => (
                    <div key={`st-${idx}`} className="stamped-mark note-mark">
                      <span className="stamped-icon">{st.icon}</span>
                      <span className="stamped-note">{st.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom footer button */}
        <div className="gradebook-footer">
          <button
            type="button"
            className="btn-done-reading"
            onClick={onClose}
          >
            <span>Hotovo / Zpátky do třídy 🎒</span>
          </button>
        </div>
      </div>
    </div>
  );
}
