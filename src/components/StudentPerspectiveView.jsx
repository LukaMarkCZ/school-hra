import React, { useState, useEffect, useRef } from 'react';
import {
  Hand,
  Mic,
  HelpCircle,
  Sparkles,
  BookOpen,
  RotateCcw,
  Volume2,
  Check,
  Star,
  Award,
  ArrowRight,
  Smile,
  X,
  Loader2,
  Keyboard,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { TEACHER_QUESTIONS_BANK, TEACHER_CALLOUT_PHRASES } from '../data/teacherData';
import { askTeacherAQuestion, evaluateStudentAnswer } from '../services/aiEngine';
import { speech } from '../services/speechEngine';
import { sounds } from '../services/soundEffects';
import { speechRecognizer } from '../services/speechRecognition';
import confetti from 'canvas-confetti';

export function StudentPerspectiveView({
  onSwitchToTeacherMode,
  playerName = 'Terezka',
  onOpenSettings
}) {
  // Current Teacher State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(TEACHER_QUESTIONS_BANK[0]);
  const [teacherSpeech, setTeacherSpeech] = useState(
    `Ahoj ${playerName}! Dneska máme ve třídě krásný den. Připravila jsem si pro vás novou otázku: ${TEACHER_QUESTIONS_BANK[0].question}`
  );
  const [isTeacherSpeaking, setIsTeacherSpeaking] = useState(false);

  // Player Student State
  const [isPlayerRaisingHand, setIsPlayerRaisingHand] = useState(false);
  const [isPlayerCalledOn, setIsPlayerCalledOn] = useState(false);
  const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false);
  const [autoStartAnswerMic, setAutoStartAnswerMic] = useState(true);
  const [isAskTeacherModalOpen, setIsAskTeacherModalOpen] = useState(false);
  const [isPlayerGradebookOpen, setIsPlayerGradebookOpen] = useState(false);

  // Classmates raising hands
  const [raisingClassmates, setRaisingClassmates] = useState(['eliska']);

  // Player's score / grades
  const [playerGrades, setPlayerGrades] = useState(() => {
    const saved = localStorage.getItem('school_player_grades');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return [
      { type: 'star', label: '⭐ Zlatá hvězdička za ranní příchod', time: '8:00' }
    ];
  });

  // Save player grades to localStorage
  useEffect(() => {
    localStorage.setItem('school_player_grades', JSON.stringify(playerGrades));
  }, [playerGrades]);

  // Initial greeting speech
  useEffect(() => {
    const timer = setTimeout(() => {
      speakTeacher(
        `Ahoj ${playerName}! Vítej ve své lavici. Mám pro tebe první otázku: ${currentQuestion.question}`
      );
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Helper to make teacher speak
  const speakTeacher = (text) => {
    setTeacherSpeech(text);
    setIsTeacherSpeaking(true);
    sounds.playTeacherIntro();
    speech.speak(text, {
      characterId: 'teacher',
      onEnd: () => setIsTeacherSpeaking(false)
    });
  };

  // 1. Next question from teacher
  const handleNextTeacherQuestion = () => {
    sounds.playPop();
    const nextIdx = (currentQuestionIndex + 1) % TEACHER_QUESTIONS_BANK.length;
    setCurrentQuestionIndex(nextIdx);
    const nextQ = TEACHER_QUESTIONS_BANK[nextIdx];
    setCurrentQuestion(nextQ);
    setIsPlayerRaisingHand(false);
    setIsPlayerCalledOn(false);

    // Some classmates raise hand
    const hasEliska = Math.random() < 0.75;
    const hasMatyas = Math.random() < 0.35;
    const newRaising = [];
    if (hasEliska) newRaising.push('eliska');
    if (hasMatyas) newRaising.push('matyas');
    setRaisingClassmates(newRaising);

    speakTeacher(`Tady je nová otázka: ${nextQ.question}`);
  };

  // 2. Player raises hand
  const handleRaiseHand = () => {
    sounds.playPop();
    setIsPlayerRaisingHand(true);

    // Teacher spots player and calls on them after a moment!
    setTimeout(() => {
      sounds.playDingDong();
      setIsPlayerCalledOn(true);
      const calloutTemplate = TEACHER_CALLOUT_PHRASES[Math.floor(Math.random() * TEACHER_CALLOUT_PHRASES.length)];
      const phrase = calloutTemplate.replace('{name}', playerName);
      speakTeacher(phrase);
    }, 600);
  };

  // 3. Player submits their answer
  const handleSubmitPlayerAnswer = async (answerText) => {
    setIsAnswerModalOpen(false);
    sounds.playPop();

    // Player speaks their answer
    speech.speak(answerText, {
      characterId: 'eliska', // high pitch cute child voice
      onEnd: async () => {
        // Teacher evaluates the answer with strict factual validation
        const evalResult = await evaluateStudentAnswer(currentQuestion, answerText, playerName);

        const now = new Date();
        const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

        if (evalResult.isCorrect) {
          try {
            confetti({ particleCount: 75, spread: 80, origin: { y: 0.5 } });
          } catch { /* ignore */ }
          sounds.playPraiseSparkle();

          // Add grade to player's gradebook ONLY on factually correct answer
          const newGradeItem = {
            type: evalResult.grade || 'star',
            label: evalResult.grade === 'star' ? '⭐ Zlatá hvězdička s pochvalou' : '1 - Výborně!',
            answer: answerText,
            question: currentQuestion.question,
            time: timeStr
          };
          setPlayerGrades(prev => [newGradeItem, ...prev]);
        } else {
          // Play gentle uh-oh sound for incorrect answer or nonsense
          sounds.playUhOh();

          // Record as effort/try in gradebook (does NOT award stars or ones)
          const newGradeItem = {
            type: 'try',
            label: '💡 Pokus o odpověď',
            answer: answerText,
            question: currentQuestion.question,
            time: timeStr
          };
          setPlayerGrades(prev => [newGradeItem, ...prev]);
        }

        // Teacher speaks the evaluation (praise or gentle maternal correction)
        speakTeacher(evalResult.evaluationText);
        setIsPlayerRaisingHand(false);
        setIsPlayerCalledOn(false);
      }
    });
  };

  // 4. Player asks teacher a question
  const handleAskTeacher = async (questionText) => {
    setIsAskTeacherModalOpen(false);
    sounds.playPop();

    // Player speaks their question
    speech.speak(`Paní učitelko, ${questionText}`, {
      characterId: 'eliska',
      onEnd: async () => {
        // Teacher answers
        const reply = await askTeacherAQuestion(questionText, playerName);
        sounds.playCheer();
        speakTeacher(reply);
      }
    });
  };

  const starCount = playerGrades.filter(g => g.type === 'star').length;
  const grade1Count = playerGrades.filter(g => g.type === 1 || g.type === '1').length;

  return (
    <div className="student-perspective-wrapper">
      {/* Top Navigation Bar */}
      <header className="student-perspective-header">
        <div className="header-left-pill-group">
          {/* Switch to Teacher Mode */}
          <button
            type="button"
            className="btn-switch-mode mode-teacher-inactive"
            onClick={onSwitchToTeacherMode}
            title="Přepnout do role Paní učitelky"
          >
            <span className="text-xl mr-1">👩‍🏫</span>
            <span className="font-bold">Hraju si na Paní učitelku</span>
          </button>

          {/* Active Student Mode Indicator */}
          <div className="mode-active-pill">
            <span className="text-xl mr-1">🎒</span>
            <span className="font-extrabold text-amber-950">Jsem žáček ({playerName})</span>
          </div>
        </div>

        {/* Right Stats & Gradebook quick badge */}
        <div className="header-right-stats">
          <button
            type="button"
            className="player-score-badge"
            onClick={() => setIsPlayerGradebookOpen(true)}
            title="Otevřít moji žákovskou knížku"
          >
            <span className="score-stars">⭐ {starCount}</span>
            <span className="score-sep">|</span>
            <span className="score-ones">🥇 {grade1Count}</span>
            <BookOpen className="w-4 h-4 ml-1.5 text-amber-700" />
          </button>

          <button
            type="button"
            className="settings-icon-btn-round"
            onClick={onOpenSettings}
            title="Nastavení hry"
          >
            ⚙️
          </button>
        </div>
      </header>

      {/* Main Classroom Perspective Canvas */}
      <main className="classroom-perspective-stage">
        {/* 1. Background Scenery: Window with Sunshine & Outdoors */}
        <div className="classroom-window-scenery">
          <div className="window-arch-frame">
            <div className="window-sky-view">
              <div className="sky-sun-glow" />
              <div className="sky-cloud cloud-drift-1" />
              <div className="sky-cloud cloud-drift-2" />
              <div className="tree-leaves-sway" />
            </div>
            <div className="window-pane-grid" />
            <div className="window-sunbeam-floor" />
          </div>
        </div>

        {/* 2. Right Wall Decorations: Clock, Bunting Garland & Posters */}
        <div className="classroom-wall-decorations">
          <div className="school-wall-clock" title="Školní hodiny">
            <div className="clock-rim">
              <div className="clock-hand-hour" />
              <div className="clock-hand-minute" />
              <div className="clock-center-pin" />
            </div>
          </div>
          <div className="school-poster alphabet-poster">
            <span className="poster-title">🔤 Abeceda</span>
            <span className="poster-text">A B C Č D E F G</span>
          </div>
          <div className="school-poster map-poster">
            <span className="poster-title">🇨🇿 Naše vlast</span>
            <span className="poster-badge">Praha • Brno</span>
          </div>
        </div>

        {/* 3. Bunting flags garland above chalkboard */}
        <div className="chalkboard-bunting-garland">
          <span className="bunting-flag flag-red" />
          <span className="bunting-flag flag-yellow" />
          <span className="bunting-flag flag-blue" />
          <span className="bunting-flag flag-green" />
          <span className="bunting-flag flag-pink" />
          <span className="bunting-flag flag-orange" />
          <span className="bunting-flag flag-purple" />
        </div>

        {/* 4. Isometric 3D Parquet Wood Floor */}
        <div className="classroom-perspective-floor">
          <div className="floor-wood-planks" />
        </div>

        {/* The Big Classroom Blackboard at the front */}
        <div className="perspective-chalkboard">
          <div className="chalkboard-frame">
            <div className="chalkboard-header-row">
              <span className="chalk-class-label">📅 3. TŘÍDA ZŠ • DNEŠNÍ VÝUKA</span>
              <span className="chalk-category-pill">{currentQuestion.categoryLabel}</span>
            </div>

            <div className="chalkboard-question-body">
              <h2 className="chalk-question-text">
                „{currentQuestion.question}“
              </h2>
              {currentQuestion.hint && (
                <p className="chalk-hint-text">💡 Nápověda: {currentQuestion.hint}</p>
              )}
            </div>

            {/* Chalk tray with colorful chalks */}
            <div className="chalk-tray">
              <span className="chalk-piece chalk-white" />
              <span className="chalk-piece chalk-yellow" />
              <span className="chalk-piece chalk-pink" />
              <span className="chalk-piece chalk-cyan" />
              <span className="chalk-sponge">🧽</span>
            </div>
          </div>
        </div>

        {/* Animated Paní učitelka standing in front of blackboard */}
        <div className="teacher-character-area">
          {/* Teacher's Active Speech Bubble */}
          <div className={`teacher-speech-bubble-box ${isTeacherSpeaking ? 'speaking-pulse' : ''}`}>
            <div className="teacher-speech-header-row">
              <div className="teacher-speech-avatar-badge">
                <span>👩‍🏫 Paní učitelka:</span>
              </div>
              <button
                type="button"
                className="btn-replay-teacher-speech"
                onClick={() => speakTeacher(teacherSpeech)}
                title="Přehrát hlas paní učitelky znovu"
              >
                <Volume2 className="w-3.5 h-3.5 text-indigo-600 mr-1" />
                <span>Zopakovat</span>
              </button>
            </div>
            <p className="teacher-speech-bubble-text">{teacherSpeech}</p>
            {isTeacherSpeaking && (
              <div className="teacher-audio-equalizer">
                <span className="eq-bar bar-1" />
                <span className="eq-bar bar-2" />
                <span className="eq-bar bar-3" />
                <span className="eq-bar bar-4" />
              </div>
            )}
            <div className="teacher-bubble-tail" />
          </div>

          {/* Teacher SVG Avatar */}
          <div className={`teacher-svg-container ${isTeacherSpeaking ? 'teacher-talking-body' : 'teacher-idle-body'}`}>
            <svg viewBox="0 0 160 220" className="teacher-svg">
              <defs>
                <linearGradient id="teacherBlouse" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4F46E5" />
                  <stop offset="100%" stopColor="#3730A3" />
                </linearGradient>
                <linearGradient id="teacherHair" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#854D0E" />
                  <stop offset="100%" stopColor="#543007" />
                </linearGradient>
                <linearGradient id="teacherSkin" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FDEDE2" />
                  <stop offset="100%" stopColor="#F5D0BA" />
                </linearGradient>
                <linearGradient id="pointerWood" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#D97706" />
                  <stop offset="100%" stopColor="#92400E" />
                </linearGradient>
              </defs>

              {/* Floor Shadow */}
              <ellipse cx="80" cy="216" rx="46" ry="7" fill="rgba(0,0,0,0.18)" />

              {/* Body / Blouse */}
              <path
                d="M 50 140 Q 80 135 110 140 L 126 216 L 34 216 Z"
                fill="url(#teacherBlouse)"
              />
              {/* White Peter Pan Collar */}
              <polygon points="80,140 66,160 80,172 94,160" fill="#FFFFFF" />
              {/* Elegant necklace with ruby jewel */}
              <circle cx="80" cy="180" r="5" fill="#EF4444" stroke="#B91C1C" strokeWidth="1" />

              {/* Left arm holding pointing stick towards the chalkboard */}
              <path d="M 48 145 Q 28 175 42 195 L 50 190 Q 38 174 56 150 Z" fill="#4338CA" />
              <circle cx="44" cy="196" r="8" fill="url(#teacherSkin)" />
              {/* Wooden pointer directed to board with golden star */}
              <line x1="44" y1="196" x2="14" y2="124" stroke="url(#pointerWood)" strokeWidth="4.5" strokeLinecap="round" />
              <circle cx="14" cy="124" r="5" fill="#F59E0B" />
              <polygon points="14,116 16,121 21,121 17,125 18,130 14,127 10,130 11,125 7,121 12,121" fill="#FDE047" stroke="#D97706" strokeWidth="0.8" />

              {/* Right arm friendly welcoming gesture */}
              <path d="M 112 145 Q 134 165 125 186 L 117 182 Q 124 165 106 148 Z" fill="#4338CA" />
              <circle cx="123" cy="188" r="8" fill="url(#teacherSkin)" />

              {/* Neck */}
              <rect x="73" y="118" width="14" height="24" rx="4" fill="url(#teacherSkin)" />

              {/* Head */}
              <ellipse cx="80" cy="85" rx="34" ry="38" fill="url(#teacherSkin)" />

              {/* Hair bun on top with red clip */}
              <circle cx="80" cy="40" r="23" fill="url(#teacherHair)" />
              <ellipse cx="80" cy="44" rx="15" ry="9" fill="#A16207" />
              <rect x="70" y="38" width="20" height="4" rx="2" fill="#EF4444" />

              {/* Hair strands framing face */}
              <path
                d="M 46 80 Q 46 48 80 48 Q 114 48 114 80 Q 102 60 80 62 Q 58 60 46 80 Z"
                fill="url(#teacherHair)"
              />
              <path d="M 46 80 Q 42 110 50 120 Q 52 100 52 85 Z" fill="url(#teacherHair)" />
              <path d="M 114 80 Q 118 110 110 120 Q 108 100 108 85 Z" fill="url(#teacherHair)" />

              {/* Blushing Cheeks */}
              <ellipse cx="58" cy="95" rx="7" ry="4.5" fill="#FDA4AF" opacity="0.65" />
              <ellipse cx="102" cy="95" rx="7" ry="4.5" fill="#FDA4AF" opacity="0.65" />

              {/* Sparkling Kind Eyes */}
              <ellipse cx="64" cy="82" rx="5" ry="6" fill="#1E293B" className="teacher-eye" />
              <circle cx="62" cy="80" r="2" fill="#FFFFFF" />
              <circle cx="65.5" cy="83.5" r="0.9" fill="#FFFFFF" />

              <ellipse cx="96" cy="82" rx="5" ry="6" fill="#1E293B" className="teacher-eye" />
              <circle cx="94" cy="80" r="2" fill="#FFFFFF" />
              <circle cx="97.5" cy="83.5" r="0.9" fill="#FFFFFF" />

              {/* Friendly Eyebrows */}
              <path d="M 57 73 Q 64 68 72 73" stroke="#451A03" strokeWidth="2.2" strokeLinecap="round" fill="none" />
              <path d="M 88 73 Q 96 68 103 73" stroke="#451A03" strokeWidth="2.2" strokeLinecap="round" fill="none" />

              {/* Red Stylish Glasses with Glass Light Reflection */}
              <circle cx="64" cy="83" r="13" stroke="#DC2626" strokeWidth="2.5" fill="rgba(255,255,255,0.12)" />
              <path d="M 55 76 L 68 88" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="96" cy="83" r="13" stroke="#DC2626" strokeWidth="2.5" fill="rgba(255,255,255,0.12)" />
              <path d="M 87 76 L 100 88" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="77" y1="83" x2="83" y2="83" stroke="#DC2626" strokeWidth="2.5" />

              {/* Nose */}
              <path d="M 80 86 Q 83 91 80 94" stroke="#D97706" strokeWidth="2" strokeLinecap="round" fill="none" />

              {/* Mouth with speech animation */}
              {isTeacherSpeaking ? (
                <path d="M 73 103 Q 80 114 87 103 Q 80 110 73 103 Z" fill="#DC2626" className="teacher-mouth-speaking" />
              ) : (
                <path d="M 72 104 Q 80 112 88 104" stroke="#DC2626" strokeWidth="2.8" strokeLinecap="round" fill="none" />
              )}
            </svg>
          </div>
        </div>

        {/* Classmates sitting in front rows */}
        <div className="perspective-classmates-row">
          {/* Eliška on the left desk */}
          <div className="classmate-desk classmate-left">
            {raisingClassmates.includes('eliska') && (
              <div className="classmate-hand-raise animate-bounce-callout">
                <span>🙋‍♀️ Eliška: „Já to vím!“</span>
              </div>
            )}
            <div className="classmate-character-svg-box">
              <svg viewBox="0 0 100 110" className="classmate-svg">
                <defs>
                  <linearGradient id="eliskaCardigan" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F472B6" />
                    <stop offset="100%" stopColor="#DB2777" />
                  </linearGradient>
                  <linearGradient id="eliskaHair" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FDE047" />
                    <stop offset="100%" stopColor="#CA8A04" />
                  </linearGradient>
                </defs>
                {/* Desk Edge */}
                <rect x="0" y="78" width="100" height="32" rx="4" fill="#B45309" stroke="#78350F" strokeWidth="2" />
                <rect x="10" y="82" width="30" height="20" rx="2" fill="#FEF3C7" stroke="#FDE68A" />
                {/* Backpack hanging on chair */}
                <rect x="74" y="65" width="22" height="30" rx="6" fill="#EC4899" />
                <circle cx="85" cy="78" r="4" fill="#FCE7F3" />
                {/* Body / Sweater */}
                <path d="M 28 65 Q 50 60 72 65 L 76 90 L 24 90 Z" fill="url(#eliskaCardigan)" />
                {/* Left braid */}
                <path d="M 28 45 Q 18 65 24 80" stroke="url(#eliskaHair)" strokeWidth="6" strokeLinecap="round" fill="none" />
                <circle cx="24" cy="80" r="3" fill="#EC4899" />
                {/* Right braid (or raised arm!) */}
                {raisingClassmates.includes('eliska') ? (
                  <g className="arm-waving">
                    <line x1="68" y1="65" x2="82" y2="25" stroke="url(#eliskaCardigan)" strokeWidth="8" strokeLinecap="round" />
                    <circle cx="82" cy="22" r="6" fill="#FCE7F3" />
                  </g>
                ) : (
                  <path d="M 72 45 Q 82 65 76 80" stroke="url(#eliskaHair)" strokeWidth="6" strokeLinecap="round" fill="none" />
                )}
                {/* Head from behind */}
                <circle cx="50" cy="42" r="22" fill="url(#eliskaHair)" />
                <ellipse cx="50" cy="34" rx="14" ry="8" fill="#FACC15" />
                <span className="classmate-desk-name">Eliška</span>
              </svg>
            </div>
            <span className="classmate-name-tag">Eliška (Šprtka)</span>
          </div>

          {/* Matyáš in center-right desk */}
          <div className="classmate-desk classmate-right">
            {raisingClassmates.includes('matyas') && (
              <div className="classmate-hand-raise animate-bounce-callout">
                <span>🙋‍♂️ Matyáš: „Já! Hehe!“</span>
              </div>
            )}
            <div className="classmate-character-svg-box">
              <svg viewBox="0 0 100 110" className="classmate-svg">
                <defs>
                  <linearGradient id="matyasHoodie" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FB923C" />
                    <stop offset="100%" stopColor="#EA580C" />
                  </linearGradient>
                  <linearGradient id="matyasHair" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#78350F" />
                    <stop offset="100%" stopColor="#451A03" />
                  </linearGradient>
                </defs>
                {/* Desk Edge */}
                <rect x="0" y="78" width="100" height="32" rx="4" fill="#B45309" stroke="#78350F" strokeWidth="2" />
                <rect x="55" y="82" width="28" height="18" rx="2" fill="#E0F2FE" stroke="#BAE6FD" />
                {/* Backpack hanging */}
                <rect x="4" y="65" width="22" height="30" rx="6" fill="#10B981" />
                {/* Body / Orange Hoodie */}
                <path d="M 28 65 Q 50 60 72 65 L 76 90 L 24 90 Z" fill="url(#matyasHoodie)" />
                {/* Hood details */}
                <path d="M 38 60 Q 50 72 62 60" stroke="#C2410C" strokeWidth="3" fill="none" />
                {/* Raised arm if raising hand */}
                {raisingClassmates.includes('matyas') ? (
                  <g className="arm-waving">
                    <line x1="32" y1="65" x2="18" y2="25" stroke="url(#matyasHoodie)" strokeWidth="8" strokeLinecap="round" />
                    <circle cx="18" cy="22" r="6" fill="#FED7AA" />
                  </g>
                ) : null}
                {/* Spiky hair from behind */}
                <circle cx="50" cy="42" r="22" fill="url(#matyasHair)" />
                <polygon points="34,30 38,20 44,28 50,18 56,28 62,20 66,30" fill="url(#matyasHair)" />
              </svg>
            </div>
            <span className="classmate-name-tag">Matyáš (Šašek)</span>
          </div>
        </div>

        {/* Player's Own Raised Hand Animation */}
        {isPlayerRaisingHand && (
          <div className="player-raised-hand-container animate-hand-up">
            <div className="player-hand-speech">
              <span className="font-extrabold text-amber-950">🙋‍♀️ {playerName}: Já to vím!</span>
            </div>
            <div className="player-arm-graphic" />
          </div>
        )}

        {/* Player's Desk in Foreground (Bottom Controls) */}
        <div className="player-student-desk">
          <div className="player-desk-surface">
            {/* Stationery groove with crayons, ruler & eraser */}
            <div className="desk-stationery-tray">
              <span className="crayon crayon-red" title="Červená pastelka" />
              <span className="crayon crayon-green" title="Zelená pastelka" />
              <span className="crayon crayon-blue" title="Modrá pastelka" />
              <span className="desk-ruler" title="Pravítko" />
              <span className="desk-eraser" title="Guma">🧽</span>
            </div>

            {/* Player's Open School Notebook */}
            <div className="player-notebook">
              <div className="notebook-header-line">
                <span className="notebook-subject-tag">📘 Český jazyk & Prvouka</span>
                <span className="notebook-owner-name">Sešit žáčka: {playerName}</span>
                <span className="notebook-sticker">⭐ 1*</span>
              </div>
              <div className="notebook-ruled-lines">
                <p className="notebook-handwritten-question">
                  „{currentQuestion.question}“
                </p>
                {isPlayerCalledOn && (
                  <p className="notebook-callout-cue text-emerald-800 font-bold animate-pulse">
                    ✨ Paní učitelka tě vyvolala! Ťukni na mikrofon a odpověz!
                  </p>
                )}
              </div>
            </div>

            {/* Main Player Action Buttons */}
            <div className="player-actions-toolbar">
              {/* 1. Raise Hand Button */}
              <button
                type="button"
                className={`btn-player-action btn-raise-hand ${isPlayerRaisingHand ? 'btn-active-raising' : ''}`}
                onClick={handleRaiseHand}
                disabled={isPlayerRaisingHand}
              >
                <div className="action-circle bg-amber-500">
                  <Hand className="w-7 h-7 text-white" />
                </div>
                <div className="action-labels">
                  <span className="action-main-title">
                    {isPlayerCalledOn ? 'Vyvolána!' : isPlayerRaisingHand ? 'Hlásím se...' : 'Přihlásit se'}
                  </span>
                  <span className="action-sub-title">✋ Zvednout ruku</span>
                </div>
              </button>

              {/* 2. Answer Question Button */}
              <button
                type="button"
                className={`btn-player-action btn-answer-action animate-bounce-subtle ${isPlayerCalledOn ? 'btn-called-active' : ''}`}
                onClick={() => {
                  sounds.playPop();
                  setAutoStartAnswerMic(true);
                  setIsAnswerModalOpen(true);
                }}
              >
                <div className="action-circle bg-emerald-600">
                  <Mic className="w-7 h-7 text-white" />
                </div>
                <div className="action-labels">
                  <span className="action-main-title">
                    {isPlayerCalledOn ? 'Odpovědět hned!' : 'Odpovědět'}
                  </span>
                  <span className="action-sub-title">🎙️ Ťukni a mluv!</span>
                </div>
              </button>

              {/* 3. Ask Teacher a Question */}
              <button
                type="button"
                className="btn-player-action btn-ask-teacher-action"
                onClick={() => {
                  sounds.playPop();
                  setIsAskTeacherModalOpen(true);
                }}
              >
                <div className="action-circle bg-indigo-600">
                  <HelpCircle className="w-7 h-7 text-white" />
                </div>
                <div className="action-labels">
                  <span className="action-main-title">Zeptat se</span>
                  <span className="action-sub-title">❓ Položit otázku</span>
                </div>
              </button>

              {/* 4. Next Question from Teacher */}
              <button
                type="button"
                className="btn-player-action btn-next-q-action"
                onClick={() => {
                  sounds.playPop();
                  handleNextTeacherQuestion();
                }}
                title="Paní učitelko, dejte nám další otázku!"
              >
                <div className="action-circle bg-sky-600">
                  <ArrowRight className="w-7 h-7 text-white" />
                </div>
                <div className="action-labels">
                  <span className="action-main-title">Další otázka</span>
                  <span className="action-sub-title">➡️ Nové téma</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL 1: Player Answer Dialog (Voice or Text) */}
      {isAnswerModalOpen && (
        <PlayerAnswerModal
          question={currentQuestion}
          playerName={playerName}
          initialAutoMic={autoStartAnswerMic}
          onClose={() => setIsAnswerModalOpen(false)}
          onSubmitAnswer={handleSubmitPlayerAnswer}
        />
      )}

      {/* MODAL 2: Ask Teacher a Question Dialog (Voice or Text) */}
      {isAskTeacherModalOpen && (
        <AskTeacherModal
          playerName={playerName}
          onClose={() => setIsAskTeacherModalOpen(false)}
          onSubmitQuestion={handleAskTeacher}
        />
      )}

      {/* MODAL 3: Player's Gradebook */}
      {isPlayerGradebookOpen && (
        <PlayerGradebookModal
          playerName={playerName}
          grades={playerGrades}
          onClose={() => setIsPlayerGradebookOpen(false)}
        />
      )}
    </div>
  );
}

// ----------------------------------------------------
// SUB-MODALS FOR STUDENT MODE
// ----------------------------------------------------

function PlayerAnswerModal({
  question,
  playerName,
  initialAutoMic = true,
  onClose,
  onSubmitAnswer
}) {
  const [answerText, setAnswerText] = useState('');
  const [micStatus, setMicStatus] = useState('idle'); // 'idle' | 'starting' | 'listening' | 'error'
  const [micLiveText, setMicLiveText] = useState('');
  const [micErrorMessage, setMicErrorMessage] = useState('');
  const textareaRef = useRef(null);
  const autoStartedRef = useRef(false);
  const hasBrowserSpeech = speechRecognizer.isSupported();

  // Clean up mic on unmount
  useEffect(() => {
    return () => {
      speechRecognizer.cancelListening();
    };
  }, []);

  const startListening = () => {
    sounds.init();
    speech.stop();
    setMicErrorMessage('');
    setMicLiveText('');
    setMicStatus('starting');

    speechRecognizer.startListening({
      onStarting: () => {
        setMicStatus('starting');
      },
      onReady: () => {
        sounds.playMicStart();
        setMicStatus('listening');
      },
      onResult: (text) => {
        setMicLiveText(text);
        setAnswerText(text);
      },
      onFinal: (finalText) => {
        setMicStatus('idle');
        setMicLiveText('');
        if (finalText && finalText.trim()) {
          const clean = finalText.trim();
          setAnswerText(clean);
          sounds.playMicSuccess();
          // AUTOMATIC ZERO-CONFIRMATION SUBMIT: as soon as child stops talking, send immediately!
          onSubmitAnswer(clean);
        }
      },
      onError: (err) => {
        console.warn('Student mic error:', err);
        setMicStatus('error');
        setMicErrorMessage(
          'Mikrofon v prohlížeči je zablokován nebo není dostupný. Zkontrolujte povolení mikrofonu v nastavení prohlížeče.'
        );
      },
      onEnd: () => {
        setMicStatus(prev => (prev === 'error' ? prev : 'idle'));
      }
    });
  };

  // Auto-start listening on mount so child doesn't even need to click the mic!
  useEffect(() => {
    if (initialAutoMic && !autoStartedRef.current) {
      autoStartedRef.current = true;
      const timer = setTimeout(() => {
        startListening();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [initialAutoMic]);

  const stopListening = () => {
    sounds.playPop();
    // Flush current speech transcript and trigger onFinal -> auto sends!
    speechRecognizer.stopListening();
  };

  const handleSend = (e) => {
    if (e) e.preventDefault();
    speechRecognizer.cancelListening();
    const finalAnswer = (answerText || micLiveText).trim();
    if (!finalAnswer) return;
    onSubmitAnswer(finalAnswer);
  };

  const isStarting = micStatus === 'starting';
  const isListening = micStatus === 'listening';
  const isError = micStatus === 'error';
  const hasVoiceText = Boolean(micLiveText && micLiveText.trim());
  const hasAnyText = Boolean((answerText && answerText.trim()) || hasVoiceText);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="question-input-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-with-icon">
            <span className="text-3xl mr-2">🎙️</span>
            <h2>Odpovědět paní učitelce</h2>
          </div>
          <button type="button" className="modal-close-icon-btn" onClick={onClose} title="Zavřít">
            <X className="w-8 h-8 text-slate-700" />
          </button>
        </div>

        {/* Question Banner */}
        <div className="current-q-banner">
          <span className="q-label font-bold text-indigo-900 block text-xs uppercase tracking-wider">
            Otázka na tabuli:
          </span>
          <span className="text-lg font-black text-indigo-950">
            „{question.question}“
          </span>
        </div>

        {/* 1. VOICE ANSWERING SECTION - AUTOMATIC & ZERO CONFIRMATION */}
        <div className="voice-answering-wrapper">
          {isListening ? (
            <div className="voice-mic-active-card">
              <div className="flex items-center justify-between w-full mb-3">
                <div className="flex items-center gap-2">
                  <span className="recording-live-dot" />
                  <span className="font-extrabold text-red-950 text-base md:text-lg">
                    🔴 POSLOUCHÁM TĚ... Mluv!
                  </span>
                </div>
                <button
                  type="button"
                  className="btn-mic-stop-action"
                  onClick={stopListening}
                  title="Odeslat hned teď"
                >
                  ⏹️ Odeslat hned
                </button>
              </div>

              {/* Live Speech Bubble */}
              <div className="voice-live-bubble">
                <p className="voice-heard-text">
                  {hasVoiceText ? `„${micLiveText}“` : 'Řekni svou odpověď nahlas...'}
                </p>
                <div className="text-xs text-emerald-800 font-extrabold flex items-center justify-center gap-1 mt-2.5">
                  <span>✨</span>
                  <span>Jakmile domluvíš, odpověď se sama automaticky odešle!</span>
                </div>
              </div>
            </div>
          ) : isStarting ? (
            <div className="voice-mic-starting-card">
              <Loader2 className="w-8 h-8 animate-spin text-amber-600 mr-3 flex-shrink-0" />
              <div>
                <span className="font-extrabold text-amber-950 text-base block">
                  Zapínám mikrofon...
                </span>
                <span className="text-xs text-amber-800 font-bold">
                  Za okamžik zazní cinknutí a můžeš mluvit!
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <button
                type="button"
                className="btn-voice-record-big"
                onClick={startListening}
              >
                <div className="mic-record-icon-circle bg-emerald-500 animate-pulse">
                  <Mic className="w-8 h-8 text-white" />
                </div>
                <div className="text-left ml-3 flex-1">
                  <span className="font-black text-white text-lg block">
                    🎙️ ŤUKNI A MLUV NAHLAS
                  </span>
                  <span className="text-xs text-emerald-100 font-bold">
                    Odpověď se po domluvení sama odešle paní učitelce
                  </span>
                </div>
              </button>
            </div>
          )}

          {isError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl mt-2 flex items-center justify-between text-xs text-red-800">
              <span>{micErrorMessage}</span>
              <button
                type="button"
                className="underline font-bold text-red-900 ml-2"
                onClick={startListening}
              >
                Zkusit znovu
              </button>
            </div>
          )}
        </div>

        {/* Quick Answers Chips - INSTANT SUBMIT ON TAP */}
        {question.correctAnswers && (
          <div className="quick-chips-section mt-2">
            <span className="quick-chips-label">Nebo ťukni rovnou na odpověď:</span>
            <div className="quick-chips-row">
              <button
                type="button"
                className="chip-btn animate-pulse"
                onClick={() => {
                  sounds.playPop();
                  speechRecognizer.cancelListening();
                  onSubmitAnswer(question.correctAnswers[0]);
                }}
              >
                ✨ {question.correctAnswers[0]}
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSend} className="question-form mt-2">
          <textarea
            ref={textareaRef}
            rows={2}
            value={answerText}
            onChange={e => setAnswerText(e.target.value)}
            placeholder={`Nebo můžeš napsat odpověď sem... (např. „${question.correctAnswers ? question.correctAnswers[0] : 'Moje odpověď'}“)`}
            className="question-textarea"
          />

          <div className="question-modal-actions">
            <button
              type="submit"
              disabled={!hasAnyText}
              className="btn-modal-submit"
            >
              <Check className="w-5 h-5 mr-1 stroke-[3]" />
              <span>Odeslat paní učitelce!</span>
            </button>
            <button type="button" className="btn-modal-cancel" onClick={onClose}>
              Zrušit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AskTeacherModal({ playerName, onClose, onSubmitQuestion }) {
  const [askText, setAskText] = useState('');
  const [micStatus, setMicStatus] = useState('idle');
  const [micLiveText, setMicLiveText] = useState('');
  const [micErrorMessage, setMicErrorMessage] = useState('');
  const textareaRef = useRef(null);
  const hasBrowserSpeech = speechRecognizer.isSupported();

  const quickQuestions = [
    'Proč je nebe modré?',
    'Kolik váží největší slon?',
    'Kdy už bude přestávka?',
    'Proč kočičky předou?',
    'Jak dýchají rybičky pod vodou?',
    'Budeme dneska kreslit pastelkami?'
  ];

  // Clean up mic on unmount
  useEffect(() => {
    return () => {
      speechRecognizer.cancelListening();
    };
  }, []);

  const startListening = () => {
    sounds.init();
    speech.stop();
    setMicErrorMessage('');
    setMicLiveText('');
    setMicStatus('starting');

    speechRecognizer.startListening({
      onStarting: () => setMicStatus('starting'),
      onReady: () => {
        sounds.playMicStart();
        setMicStatus('listening');
      },
      onResult: (text) => {
        setMicLiveText(text);
        setAskText(text);
      },
      onFinal: (finalText) => {
        setMicStatus('idle');
        setMicLiveText('');
        if (finalText && finalText.trim()) {
          setAskText(finalText.trim());
          sounds.playMicSuccess();
        }
      },
      onError: () => {
        setMicStatus('error');
        setMicErrorMessage('Nepodařilo se spustit mikrofon.');
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
    const clean = (askText || micLiveText).trim();
    if (!clean) return;
    onSubmitQuestion(clean);
  };

  const isStarting = micStatus === 'starting';
  const isListening = micStatus === 'listening';
  const hasVoiceText = Boolean(micLiveText && micLiveText.trim());
  const hasAnyText = Boolean((askText && askText.trim()) || hasVoiceText);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="question-input-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-with-icon">
            <span className="text-3xl mr-2">❓</span>
            <h2>Zeptat se paní učitelky</h2>
          </div>
          <button type="button" className="modal-close-icon-btn" onClick={onClose} title="Zavřít">
            <X className="w-8 h-8 text-slate-700" />
          </button>
        </div>

        <p className="settings-desc">
          Zeptej se paní učitelky na cokoliv, co tě zajímá – hlasem nebo výběrem otázky:
        </p>

        {/* Voice Question Section */}
        <div className="voice-answering-wrapper">
          {isListening ? (
            <div className="voice-mic-active-card">
              <div className="flex items-center justify-between w-full mb-3">
                <div className="flex items-center gap-2">
                  <span className="recording-live-dot" />
                  <span className="font-extrabold text-red-950 text-base md:text-lg">
                    🔴 TEĎ MLUV! Zeptej se paní učitelky...
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
                  {hasVoiceText ? `„${micLiveText}“` : 'Řekni svou otázku do mobilu...'}
                </p>
              </div>

              {hasVoiceText && (
                <button
                  type="button"
                  className="btn-voice-send-now animate-bounce-subtle mt-3"
                  onClick={handleSubmit}
                >
                  <Check className="w-6 h-6 mr-2 stroke-[3]" />
                  <span>Zeptat se: „{micLiveText}“</span>
                </button>
              )}
            </div>
          ) : isStarting ? (
            <div className="voice-mic-starting-card">
              <Loader2 className="w-8 h-8 animate-spin text-amber-600 mr-3 flex-shrink-0" />
              <div>
                <span className="font-extrabold text-amber-950 text-base block">
                  Zapínám mikrofon...
                </span>
                <span className="text-xs text-amber-800 font-bold">
                  Za okamžik zazní cinknutí a můžeš mluvit!
                </span>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="btn-voice-record-big btn-voice-ask-big"
              onClick={startListening}
            >
              <div className="mic-record-icon-circle animate-pulse">
                <Mic className="w-8 h-8 text-white" />
              </div>
              <div className="text-left ml-3 flex-1">
                <span className="font-black text-white text-lg block">
                  {askText ? '🔄 Zeptat se znovu hlasem' : '🎙️ ŤUKNI A ZEPTEJ SE NAHLAS'}
                </span>
                <span className="text-xs text-indigo-100 font-bold">
                  Zmáčkni a řekni otázku do mikrofonu mobilu
                </span>
              </div>
            </button>
          )}

          {micStatus === 'error' && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl mt-2 flex items-center justify-between text-xs text-red-800">
              <span>{micErrorMessage}</span>
              <button
                type="button"
                className="underline font-bold text-red-900 ml-2"
                onClick={startListening}
              >
                Zkusit znovu
              </button>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="question-form mt-2">
          <div className="quick-chips-section">
            <span className="quick-chips-label">Nebo vyber oblíbenou otázku jedním ťuknutím:</span>
            <div className="quick-chips-row flex-wrap">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="chip-btn"
                  onClick={() => {
                    sounds.playPop();
                    setAskText(q);
                  }}
                >
                  💡 {q}
                </button>
              ))}
            </div>
          </div>

          <textarea
            ref={textareaRef}
            rows={2}
            value={askText}
            onChange={e => setAskText(e.target.value)}
            placeholder="Paní učitelko, proč... ?"
            className="question-textarea"
          />

          <div className="question-modal-actions">
            <button
              type="submit"
              disabled={!hasAnyText}
              className="btn-modal-submit"
            >
              <Check className="w-5 h-5 mr-1" />
              <span>Zeptat se paní učitelky!</span>
            </button>
            <button type="button" className="btn-modal-cancel" onClick={onClose}>
              Zrušit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PlayerGradebookModal({ playerName, grades, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="gradebook-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-with-icon">
            <span className="text-3xl mr-2">📖</span>
            <h2>Žákovská knížka: {playerName}</h2>
          </div>
          <button type="button" className="modal-close-icon-btn" onClick={onClose}>
            <X className="w-8 h-8 text-slate-700" />
          </button>
        </div>

        <p className="settings-desc">
          Zde jsou všechny známky, hvězdičky a pochvaly, které jsi dnes získala od paní učitelky:
        </p>

        <div className="gradebook-history-list max-h-80 overflow-y-auto">
          {grades.length === 0 ? (
            <p className="text-center text-slate-500 py-6">Zatím nemáš žádnou známku. Přihlas se a odpověz na otázku!</p>
          ) : (
            grades.map((g, idx) => (
              <div key={idx} className="p-3 bg-amber-50 border border-amber-200 rounded-xl mb-2 flex items-center justify-between">
                <div>
                  <span className="font-bold text-amber-950 text-sm block">{g.label}</span>
                  {g.question && (
                    <span className="text-xs text-amber-800">Otázka: {g.question}</span>
                  )}
                </div>
                <span className="text-xs text-slate-400 font-mono">{g.time}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
