import React from 'react';
import { StudentAvatar } from './StudentAvatar';
import { X, Star, Award, Check } from 'lucide-react';

// Single Double Desk Unit
function DoubleDeskUnit({
  studentLeft,
  studentRight,
  onStudentClick,
  activeSpeakerId,
  speechText,
  spotlightStudentId,
  leftProp,
  rightProp
}) {
  const isSpeaking = activeSpeakerId && (studentLeft?.id === activeSpeakerId || studentRight?.id === activeSpeakerId);
  const isSpotlight = spotlightStudentId && (studentLeft?.id === spotlightStudentId || studentRight?.id === spotlightStudentId);
  const isElevated = Boolean(isSpeaking || isSpotlight);

  return (
    <div className={`classroom-desk-unit ${isElevated ? 'elevated-desk' : ''}`}>
      {/* 1. Behind the desk: Students sitting on chairs */}
      <div className={`desk-students-layer ${isElevated ? 'elevated-layer' : ''}`}>
        {studentLeft && (
          <div className="student-seat seat-left">
            <StudentAvatar
              student={studentLeft}
              onClick={onStudentClick}
              isSpeaking={activeSpeakerId === studentLeft.id}
              speechText={speechText}
              isSpotlight={spotlightStudentId === studentLeft.id}
            />
          </div>
        )}
        {studentRight && (
          <div className="student-seat seat-right">
            <StudentAvatar
              student={studentRight}
              onClick={onStudentClick}
              isSpeaking={activeSpeakerId === studentRight.id}
              speechText={speechText}
              isSpotlight={spotlightStudentId === studentRight.id}
            />
          </div>
        )}
      </div>

      {/* 2. In front: Wooden School Desk overlapping lower torso */}
      <div className="desk-furniture-layer">
        {/* Desktop Surface */}
        <div className="desk-surface-top">
          <div className="desk-prop-slot slot-left">{leftProp}</div>
          <div className="desk-prop-slot slot-right">{rightProp}</div>
        </div>
        {/* Front Wood Panel with Nameplates */}
        <div className="desk-front-panel">
          <div className="student-nameplate" onClick={() => studentLeft && onStudentClick(studentLeft)}>
            <span className="nameplate-icon">🏷️</span>
            <span className="nameplate-name">{studentLeft?.name}</span>
            <span className="nameplate-nick">({studentLeft?.nickname})</span>
          </div>
          <div className="student-nameplate" onClick={() => studentRight && onStudentClick(studentRight)}>
            <span className="nameplate-icon">🏷️</span>
            <span className="nameplate-name">{studentRight?.name}</span>
            <span className="nameplate-nick">({studentRight?.nickname})</span>
          </div>
        </div>
        {/* Desk Legs */}
        <div className="desk-legs-row">
          <div className="desk-leg leg-left" />
          <div className="desk-leg leg-right" />
        </div>
      </div>
    </div>
  );
}

export function Classroom({
  students,
  onStudentClick,
  activeSpeakerId,
  speechText,
  spotlightStudentId,
  boardMessage,
  activeQuestion,
  onEndQuestion,
  activeMischiefStudent,
  calledStudent,
  onQuickGrade,
  onOpenFullGradebook,
  onDismissCalledStudent,
  isBreakTime,
  paperAirplaneActive
}) {
  // Students per desk
  const sEliska = students.find(s => s.id === 'eliska');
  const sMatyas = students.find(s => s.id === 'matyas');
  const sOndra = students.find(s => s.id === 'ondra');
  const sViktorie = students.find(s => s.id === 'viktorie');
  const sTomas = students.find(s => s.id === 'tomas');
  const sFilip = students.find(s => s.id === 'filip');
  const sSofie = students.find(s => s.id === 'sofie');
  const sKuba = students.find(s => s.id === 'kuba');

  return (
    <div className={`classroom-scene ${isBreakTime ? 'break-time-active' : ''}`}>
      {/* 1. CLASSROOM WALL & BLACKBOARD */}
      <div className="classroom-wall">
        {/* Window on Left */}
        <div className="classroom-window window-left">
          <div className="window-frame">
            <div className="window-pane sky-view">
              <div className="sun-glow" />
              <div className="cloud cloud-1" />
              <div className="cloud cloud-2" />
              <div className="tree-branch" />
            </div>
          </div>
        </div>

        {/* Big Central Blackboard */}
        <div className="blackboard-container">
          <div className="blackboard-frame">
            <div className="blackboard-inner">
              <div className="board-header">
                <span className="chalk-date">📅 3. TŘÍDA A</span>
                {activeQuestion ? (
                  <button
                    type="button"
                    className="chalk-btn-end-q"
                    onClick={onEndQuestion}
                    title="Ukončit otázku"
                  >
                    <X className="w-4 h-4 mr-1" />
                    <span>Ukončit</span>
                  </button>
                ) : (
                  <span className="chalk-star">✨ Hodná třída ✨</span>
                )}
              </div>

              <div className="board-content">
                <p className="chalk-text main-question">
                  {boardMessage}
                </p>
              </div>

              <div className="chalk-tray">
                <div className="chalk white-chalk" />
                <div className="chalk yellow-chalk" />
                <div className="chalk pink-chalk" />
                <div className="sponge" />
              </div>
            </div>
          </div>
        </div>

        {/* Clock & Posters on Right */}
        <div className="classroom-decorations">
          <div className="wall-clock">
            <div className="clock-face">
              <div className="clock-hand hour-hand" />
              <div className="clock-hand minute-hand" />
              <div className="clock-center" />
            </div>
          </div>

          <div className="school-poster poster-abc">
            <span className="poster-title">Abeceda</span>
            <span className="poster-text">A B C Č D</span>
          </div>

          <div className="school-poster poster-map">
            <span className="poster-title">Česko</span>
            <span className="poster-emoji">🏰 🦁</span>
          </div>
        </div>
      </div>

      {/* 3. CALLED STUDENT QUICK GRADING OVERLAY */}
      {calledStudent && (
        <div className="quick-grading-floating-bar">
          <div className="quick-grading-header">
            <span className="called-title">
              Odpovídá: <strong>{calledStudent.name} ({calledStudent.nickname})</strong>
            </span>
            <button
              type="button"
              className="btn-quick-close"
              onClick={onDismissCalledStudent}
              title="Hotovo"
            >
              <Check className="w-5 h-5 mr-1" />
              <span>Hotovo</span>
            </button>
          </div>

          <div className="quick-grading-buttons">
            <button
              type="button"
              className="quick-btn btn-star"
              onClick={() => onQuickGrade(calledStudent, 'star')}
              title="Velká pochvala s hvězdičkou"
            >
              <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />
              <span>Hvězdička!</span>
            </button>

            <button
              type="button"
              className="quick-btn btn-grade-1"
              onClick={() => onQuickGrade(calledStudent, 1)}
              title="Dát jedničku"
            >
              <span className="quick-grade-num">1</span>
              <span>Výborně</span>
            </button>

            <button
              type="button"
              className="quick-btn btn-grade-2"
              onClick={() => onQuickGrade(calledStudent, 2)}
              title="Dát dvojku"
            >
              <span className="quick-grade-num">2</span>
              <span>Pěkně</span>
            </button>

            <button
              type="button"
              className="quick-btn btn-grade-5"
              onClick={() => onQuickGrade(calledStudent, 5)}
              title="Dát pětku"
            >
              <span className="quick-grade-num">5</span>
              <span>Zabrat!</span>
            </button>

            <button
              type="button"
              className="quick-btn btn-open-book"
              onClick={() => onOpenFullGradebook(calledStudent)}
              title="Otevřít celou žákovskou knížku"
            >
              <Award className="w-5 h-5 text-indigo-200" />
              <span>Žákovská</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. MISCHIEF FLOATING ALERT BAR */}
      {activeMischiefStudent && !calledStudent && (
        <div className="mischief-floating-alert">
          <div className="mischief-alert-content">
            <span className="alert-icon">⚠️</span>
            <span className="alert-text">
              <strong>{activeMischiefStudent.name}</strong> zlobí!
              {activeMischiefStudent.mischiefType === 'plane' && ' Hází vlaštovky! ✈️'}
              {activeMischiefStudent.mischiefType === 'sleep' && ' Spí na lavici! 😴'}
              {activeMischiefStudent.mischiefType === 'talk' && ' Vyrušuje a povídá si! 🗣️'}
              {activeMischiefStudent.mischiefType === 'snack' && ' Tajně jí svačinu! 🍎'}
              {activeMischiefStudent.mischiefType === 'ball' && ' Hraje si pod lavicí! ⚽'}
            </span>
          </div>
          <button
            type="button"
            className="btn-alert-napomenout"
            onClick={() => onStudentClick(activeMischiefStudent)}
          >
            <span>👉 Napomenout {activeMischiefStudent.name}</span>
          </button>
        </div>
      )}

      {/* Break Time Banner */}
      {isBreakTime && (
        <div className="break-time-banner">
          <div className="break-banner-badge">
            <span className="break-icon">🔔 🎉</span>
            <span className="break-text">PŘESTÁVKA! DĚTI MAJÍ VOLNO!</span>
            <span className="break-sub">Můžeš se projít po třídě nebo zazvonit na další hodinu!</span>
          </div>
        </div>
      )}

      {/* Flying Paper Airplane */}
      {paperAirplaneActive && (
        <div className="flying-airplane">
          <div className="airplane-icon">✈️</div>
          <div className="airplane-trail" />
        </div>
      )}

      {/* 5. CLASSROOM FLOOR WITH 2 ROWS OF DESKS */}
      <div className="classroom-floor">
        {/* Back Row (Row 2): Tomáš & Filip | Sofie & Kuba */}
        <div className="desks-row-container row-back">
          <DoubleDeskUnit
            studentLeft={sTomas}
            studentRight={sFilip}
            onStudentClick={onStudentClick}
            activeSpeakerId={activeSpeakerId}
            speechText={speechText}
            spotlightStudentId={spotlightStudentId}
            leftProp={<div className="desk-prop open-book" title="Čítanka" />}
            rightProp={<div className="desk-prop pencil-case" title="Penál" />}
          />

          <DoubleDeskUnit
            studentLeft={sSofie}
            studentRight={sKuba}
            onStudentClick={onStudentClick}
            activeSpeakerId={activeSpeakerId}
            speechText={speechText}
            spotlightStudentId={spotlightStudentId}
            leftProp={<div className="desk-prop watercolor-box" title="Vodovky" />}
            rightProp={<div className="desk-prop snack-box" title="Krabička na svačinu" />}
          />
        </div>

        {/* Front Row (Row 1): Eliška & Matyáš | Ondra & Viktorie */}
        <div className="desks-row-container row-front">
          <DoubleDeskUnit
            studentLeft={sEliska}
            studentRight={sMatyas}
            onStudentClick={onStudentClick}
            activeSpeakerId={activeSpeakerId}
            speechText={speechText}
            spotlightStudentId={spotlightStudentId}
            leftProp={<div className="desk-prop notebook-clean" title="Vzorný sešit" />}
            rightProp={<div className="desk-prop pen-holder" title="Kousátko / propiska" />}
          />

          <DoubleDeskUnit
            studentLeft={sOndra}
            studentRight={sViktorie}
            onStudentClick={onStudentClick}
            activeSpeakerId={activeSpeakerId}
            speechText={speechText}
            spotlightStudentId={spotlightStudentId}
            leftProp={<div className="desk-prop paper-sheet" title="Papír na spaní" />}
            rightProp={<div className="desk-prop ruler" title="Pravítko" />}
          />
        </div>
      </div>
    </div>
  );
}
