import React, { useState, useEffect, useRef } from 'react';
import { Classroom } from './components/Classroom';
import { TeacherDesk } from './components/TeacherDesk';
import { GradeBookModal } from './components/GradeBookModal';
import { QuickQuestionsModal } from './components/QuickQuestionsModal';
import { SettingsModal } from './components/SettingsModal';
import {
  INITIAL_STUDENTS,
  getRandomGradeReaction,
  getRandomStampReaction,
  getRandomIdleLine,
  getUnpreparedStudentAnswer
} from './data/studentsData';
import { sounds } from './services/soundEffects';
import { speech } from './services/speechEngine';
import { speechRecognizer } from './services/speechRecognition';
import { askClassroomQuestion, isAIConfigured, detectAddressedStudent } from './services/aiEngine';
import { TeacherMicBar } from './components/TeacherMicBar';
import { QuestionInputModal } from './components/QuestionInputModal';
import { StudentPerspectiveView } from './components/StudentPerspectiveView';
import confetti from 'canvas-confetti';
import './App.css';

export function App() {
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('school_students_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge saved grades and stamps with latest INITIAL_STUDENTS definitions
        return INITIAL_STUDENTS.map(initial => {
          const found = parsed.find(p => p.id === initial.id);
          if (found) {
            return {
              ...initial,
              grades: found.grades || [],
              stamps: found.stamps || []
            };
          }
          return initial;
        });
      } catch {
        // Fallback
      }
    }
    return INITIAL_STUDENTS;
  });

  // Classroom States
  const [selectedStudentForModal, setSelectedStudentForModal] = useState(null);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [questionAnswers, setQuestionAnswers] = useState({}); // studentId -> { answer, isCorrect }
  const [calledStudent, setCalledStudent] = useState(null);
  const [activeMischiefStudent, setActiveMischiefStudent] = useState(null);

  const [isListening, setIsListening] = useState(false);
  const [micStatus, setMicStatus] = useState('idle'); // 'idle' | 'starting' | 'listening' | 'error'
  const [micErrorMessage, setMicErrorMessage] = useState('');
  const [activeSpeakerId, setActiveSpeakerId] = useState(null);
  const [speechBubbleText, setSpeechBubbleText] = useState('');
  const [spotlightStudentId, setSpotlightStudentId] = useState(null);
  const [isBreakTime, setIsBreakTime] = useState(false);
  const [paperAirplaneActive, setPaperAirplaneActive] = useState(false);
  const [micLiveText, setMicLiveText] = useState('');

  // Modals
  const [isQuestionInputOpen, setIsQuestionInputOpen] = useState(false);
  const [isQuickQuestionsOpen, setIsQuickQuestionsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Active Game Perspective: 'teacher' (Player is teacher) | 'student' (Player is student in desk)
  const [gameMode, setGameMode] = useState(() => {
    return localStorage.getItem('school_game_mode') || 'teacher';
  });

  const [playerName, setPlayerName] = useState(() => {
    return localStorage.getItem('school_player_name') || 'Terezka';
  });

  useEffect(() => {
    localStorage.setItem('school_game_mode', gameMode);
  }, [gameMode]);

  // Keep ref for up-to-date students in timeouts/callbacks
  const studentsRef = useRef(students);
  useEffect(() => {
    studentsRef.current = students;
  }, [students]);

  // Save student grades/history to localStorage
  useEffect(() => {
    localStorage.setItem('school_students_data', JSON.stringify(students));
  }, [students]);

  // Global touch / click unlocks AudioContext and Speech on iOS Safari
  useEffect(() => {
    const handleFirstTouch = () => {
      sounds.init();
      speech.warmUp();
    };
    window.addEventListener('touchstart', handleFirstTouch, { once: true });
    window.addEventListener('click', handleFirstTouch, { once: true });
    return () => {
      window.removeEventListener('touchstart', handleFirstTouch);
      window.removeEventListener('click', handleFirstTouch);
    };
  }, []);

  // Calm Mischief Timer (every 35-50 seconds, a single student does something fun)
  useEffect(() => {
    if (isBreakTime || activeQuestion || calledStudent || selectedStudentForModal) return;

    const interval = setInterval(() => {
      if (speech.isSpeaking || activeMischiefStudent || isListening) return;

      const candidates = studentsRef.current.filter(s => !s.mischiefType);
      if (candidates.length === 0) return;

      const chosen = candidates[Math.floor(Math.random() * candidates.length)];
      let mischiefType = 'talk';

      if (chosen.id === 'viktorie' || chosen.id === 'matyas') {
        mischiefType = Math.random() > 0.4 ? 'plane' : 'talk';
      } else if (chosen.id === 'ondra') {
        mischiefType = 'sleep';
      } else if (chosen.id === 'kuba') {
        mischiefType = 'snack';
      } else if (chosen.id === 'filip') {
        mischiefType = 'ball';
      }

      // Update student mischief
      const updatedStudent = { ...chosen, mischiefType, state: 'misbehaving' };
      setStudents(prev =>
        prev.map(s => (s.id === chosen.id ? updatedStudent : s))
      );
      setActiveMischiefStudent(updatedStudent);

      if (mischiefType === 'plane') {
        sounds.playWhoosh();
        setPaperAirplaneActive(true);
        setTimeout(() => setPaperAirplaneActive(false), 3200);
      } else {
        sounds.playPop();
      }
    }, 38000);

    return () => clearInterval(interval);
  }, [isBreakTime, activeQuestion, calledStudent, selectedStudentForModal, activeMischiefStudent, isListening]);

  // ==========================================
  // QUESTION ASKING LOGIC (CONTROLLED BY TEACHER)
  // ==========================================

  // Start microphone speech recognition
  const handleStartListening = () => {
    sounds.init();
    speech.stop();
    setMicErrorMessage('');

    // Check if on insecure HTTP on network IP (tablets block in-browser Web Speech API on HTTP)
    const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    const isInsecureNetwork = typeof window !== 'undefined' && window.location.protocol === 'http:' && !isLocalhost;

    // If on tablet over local network or browser doesn't support Web Speech API,
    // open the tablet-friendly dictation & question modal directly!
    if (isInsecureNetwork || !speechRecognizer.isSupported()) {
      setIsQuestionInputOpen(true);
      return;
    }

    setMicStatus('starting');
    setIsListening(true);
    setMicLiveText('');

    speechRecognizer.startListening({
      onStarting: () => {
        setMicStatus('starting');
        setIsListening(true);
      },
      onReady: () => {
        sounds.playMicStart(); // Ding-dong cue: mic is live and capturing!
        setMicStatus('listening');
        setIsListening(true);
      },
      onResult: (text) => {
        setMicLiveText(text);
      },
      onFinal: (finalText) => {
        setMicStatus('idle');
        setIsListening(false);
        setMicLiveText('');
        sounds.playMicSuccess();
        handleSetClassroomQuestion(finalText);
      },
      onError: (err) => {
        console.warn('Speech recognition error:', err);
        let msg = 'Rozpoznávání řeči selhalo.';
        const errStr = String(err).toLowerCase();
        if (errStr.includes('not-allowed') || errStr.includes('permission')) {
          msg = 'Safari na iPadu zablokovalo mikrofon. V adresním řádku ťukněte na ikonu webu (aA) a povolte mikrofon.';
        } else if (errStr.includes('service') || errStr.includes('not-supported')) {
          msg = 'Na iPadu povolte diktování: Nastavení iPadu → Obecné → Klávesnice → Povolit diktování.';
        }
        setMicErrorMessage(msg);
        setMicStatus('error');
        setIsListening(true);
      },
      onEnd: () => {
        setMicStatus(prev => (prev === 'error' ? prev : 'idle'));
        setIsListening(prev => (micStatus === 'error' ? true : false));
        setMicLiveText('');
      }
    });
  };

  const handleStopOrSubmitMic = () => {
    if (micStatus === 'error') {
      handleCancelMic();
      return;
    }

    const text = speechRecognizer.manualSubmit();
    if (text) {
      setMicStatus('idle');
      setIsListening(false);
      setMicLiveText('');
      sounds.playMicSuccess();
      handleSetClassroomQuestion(text);
    } else {
      setMicStatus('idle');
      setIsListening(false);
      setMicLiveText('');
    }
  };

  const handleCancelMic = () => {
    speechRecognizer.cancelListening();
    setMicStatus('idle');
    setIsListening(false);
    setMicLiveText('');
    setMicErrorMessage('');
  };

  // Teacher sets a question for the class (from mic or from quick question cards)
  const handleSetClassroomQuestion = async (questionText) => {
    if (!questionText.trim()) return;

    sounds.playPop();
    setActiveQuestion(questionText);
    setCalledStudent(null);
    setActiveMischiefStudent(null);

    // Check if teacher specifically addressed one pupil (e.g. "svačinu Kubo", "Eliško...")
    const addressedObj = detectAddressedStudent(questionText, studentsRef.current);
    const addressedId = addressedObj ? addressedObj.id : null;

    // AI / Offline simulation generates answers for students
    const responses = await askClassroomQuestion(questionText, studentsRef.current, addressedId);
    const answersMap = {};
    responses.forEach(r => {
      answersMap[r.studentId] = { answer: r.answer, isCorrect: r.isCorrect };
    });
    setQuestionAnswers(answersMap);

    if (addressedObj) {
      // 1. Specific student addressed (e.g. "Kubo, ..."):
      // The addressed student answers directly!
      // Other pupils: 85% of the time, NO ONE ELSE raises hand!
      // 15% of the time, only Eliška (šprtka) raises her hand "kdyby náhodou nevěděl".
      const mayEliskaRaise = Math.random() < 0.15 && addressedObj.id !== 'eliska' && !!answersMap['eliska'];

      setStudents(prev =>
        prev.map(s => {
          if (s.id === addressedObj.id) {
            return { ...s, state: 'normal', mischiefType: null };
          }
          if (s.id === 'eliska' && mayEliskaRaise) {
            return { ...s, state: 'raising_hand', mischiefType: null };
          }
          // Realistic passive states for the rest of the class
          let passiveState = 'normal';
          if (s.id === 'ondra') passiveState = 'sleeping';
          else if (s.id === 'tomas') passiveState = 'shy';
          return {
            ...s,
            state: passiveState,
            mischiefType: null
          };
        })
      );

      // Addressed pupil answers IMMEDIATELY without waiting for a click!
      const studentObj = studentsRef.current.find(s => s.id === addressedObj.id) || addressedObj;
      const answerObj = answersMap[addressedObj.id] || {
        answer: `Paní učitelko Terezko, tady jsem a poslouchám!`,
        isCorrect: true
      };

      setCalledStudent(studentObj);
      setSpotlightStudentId(studentObj.id);
      setActiveSpeakerId(studentObj.id);
      setSpeechBubbleText(answerObj.answer);

      if (answerObj.isCorrect) sounds.playCheer();
      else sounds.playUhOh();

      // Speak aloud in pupil's unique voice
      speech.speak(answerObj.answer, {
        characterId: studentObj.id
      });
    } else {
      // General question to class: realistic classroom where only 2 to 3 students raise hands!
      setStudents(prev =>
        prev.map(s => {
          const isRaising = !!answersMap[s.id];
          let passiveState = 'normal';
          if (s.id === 'ondra') passiveState = 'sleeping';
          else if (s.id === 'tomas') passiveState = 'shy';

          return {
            ...s,
            state: isRaising ? 'raising_hand' : passiveState,
            mischiefType: null
          };
        })
      );

      sounds.playCheer();
    }
  };

  // End active question
  const handleEndQuestion = () => {
    sounds.playPop();
    setActiveQuestion(null);
    setQuestionAnswers({});
    setCalledStudent(null);
    setSpotlightStudentId(null);
    setActiveSpeakerId(null);
    setSpeechBubbleText('');

    setStudents(prev => prev.map(s => ({ ...s, state: 'normal' })));
  };

  // ==========================================
  // STUDENT SELECTION & INTERACTION LOGIC
  // ==========================================

  // Tapping a student in the classroom
  const handleStudentClick = (student) => {
    sounds.playPop();

    // CASE 1: Student is currently misbehaving -> reprimand them
    if (student.mischiefType || (activeMischiefStudent && activeMischiefStudent.id === student.id)) {
      handleCatchMischief(student);
      return;
    }

    // CASE 2: Active question is in progress -> call this student to answer!
    if (activeQuestion) {
      handleCallStudentForQuestion(student);
      return;
    }

    // CASE 3: Normal free mode -> open their student card / gradebook
    setSelectedStudentForModal(student);
  };

  // Calling a student to answer the current question
  const handleCallStudentForQuestion = (student) => {
    // Lower student's hand and spotlight them
    setStudents(prev =>
      prev.map(s => (s.id === student.id ? { ...s, state: 'speaking' } : s))
    );

    setCalledStudent(student);
    setSpotlightStudentId(student.id);

    // Retrieve their answer or generate a character-specific unready line!
    const answerData = questionAnswers[student.id];
    let spokenText = '';
    if (answerData) {
      spokenText = answerData.answer;
      if (answerData.isCorrect) sounds.playCheer();
      else sounds.playUhOh();
    } else {
      // The teacher called on a student who was NOT raising their hand! (Surprise real-life school moment)
      sounds.playUhOh();
      spokenText = getUnpreparedStudentAnswer(student);
    }

    setActiveSpeakerId(student.id);
    setSpeechBubbleText(spokenText);

    speech.speak(spokenText, {
      characterId: student.id,
      onEnd: () => {
        // Keep speech bubble visible and await teacher's grading!
      }
    });
  };

  // Quick grading directly from the classroom floating bar
  const handleQuickGrade = (student, gradeValue) => {
    sounds.playStamp();

    if (gradeValue === 1 || gradeValue === 'star') {
      try {
        confetti({ particleCount: 55, spread: 65, origin: { y: 0.6 } });
      } catch {
        // Ignored
      }
    }

    const now = new Date();
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

    const label = gradeValue === 'star'
      ? '⭐ Zlatá hvězdička s pochvalou'
      : `${gradeValue} - ${gradeValue === 1 ? 'Výborně' : (gradeValue === 2 ? 'Chvalitebně' : 'Nedostatečně')}`;

    const newGrade = {
      value: gradeValue,
      short: gradeValue === 'star' ? '⭐' : String(gradeValue),
      label,
      color: gradeValue === 1 || gradeValue === 'star' ? '#16A34A' : (gradeValue === 2 ? '#2563EB' : '#DC2626'),
      time: timeStr
    };

    // Update student
    setStudents(prev =>
      prev.map(s => {
        if (s.id === student.id) {
          return {
            ...s,
            grades: [newGrade, ...s.grades],
            state: gradeValue === 1 || gradeValue === 'star' ? 'happy' : 'shy'
          };
        }
        return s;
      })
    );

    // Student immediately reacts with their own voice! NO narrator voice!
    const studentReaction = getRandomGradeReaction(student, gradeValue);
    setSpeechBubbleText(studentReaction);
    setActiveSpeakerId(student.id);

    speech.speak(studentReaction, {
      characterId: student.id,
      onEnd: () => {
        // Reaction finished
      }
    });
  };

  // Catch a misbehaving student
  const handleCatchMischief = (student) => {
    sounds.playPop();
    setActiveSpeakerId(student.id);
    setSpotlightStudentId(student.id);

    // Resolve mischief
    setStudents(prev =>
      prev.map(s => (s.id === student.id ? { ...s, mischiefType: null, state: 'shy' } : s))
    );
    setActiveMischiefStudent(null);

    const apology = getRandomStampReaction(student, student.mischiefType);
    setSpeechBubbleText(apology);

    speech.speak(apology, {
      characterId: student.id,
      onEnd: () => {
        setTimeout(() => {
          setActiveSpeakerId(null);
          setSpeechBubbleText('');
          setSpotlightStudentId(null);
        }, 1800);
      }
    });
  };

  // Full Gradebook Modal Actions
  const handleGiveGradeFromModal = (student, gradeItem) => {
    sounds.playStamp();
    const now = new Date();
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newGrade = {
      value: gradeItem.value,
      short: gradeItem.short,
      label: gradeItem.label,
      color: gradeItem.color,
      time: timeStr
    };

    setStudents(prev =>
      prev.map(s => {
        if (s.id === student.id) {
          return {
            ...s,
            grades: [newGrade, ...s.grades],
            state: gradeItem.value === 1 || gradeItem.value === 'star' ? 'happy' : 'normal',
            mischiefType: null
          };
        }
        return s;
      })
    );

    setSelectedStudentForModal(prev => ({
      ...prev,
      grades: [newGrade, ...prev.grades],
      mischiefType: null
    }));

    // Student directly reacts with their voice
    const reactionText = getRandomGradeReaction(student, gradeItem.value);
    speech.speak(reactionText, { characterId: student.id });
  };

  const handleGiveStampFromModal = (student, stampItem) => {
    sounds.playStamp();
    const now = new Date();
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newStamp = {
      id: stampItem.id,
      icon: stampItem.icon,
      label: stampItem.label,
      color: stampItem.color,
      time: timeStr
    };

    setStudents(prev =>
      prev.map(s => {
        if (s.id === student.id) {
          return {
            ...s,
            stamps: [newStamp, ...s.stamps],
            state: stampItem.id === 'praise' ? 'happy' : 'shocked',
            mischiefType: null
          };
        }
        return s;
      })
    );

    setSelectedStudentForModal(prev => ({
      ...prev,
      stamps: [newStamp, ...prev.stamps],
      mischiefType: null
    }));

    // Student directly reacts with their voice
    const reactionText = getRandomStampReaction(student, stampItem.id);
    speech.speak(reactionText, { characterId: student.id });
  };

  // Student speaks idle thoughts
  const handleStudentSpeakFromModal = (student) => {
    sounds.playPop();
    const randomLine = getRandomIdleLine(student);

    setSelectedStudentForModal(null);
    setActiveSpeakerId(student.id);
    setSpeechBubbleText(randomLine);
    setSpotlightStudentId(student.id);

    speech.speak(randomLine, {
      characterId: student.id,
      onEnd: () => {
        setTimeout(() => {
          setActiveSpeakerId(null);
          setSpeechBubbleText('');
          setSpotlightStudentId(null);
        }, 1500);
      }
    });
  };

  // Desk Bell: Calm the classroom!
  const handleRingDeskBell = () => {
    sounds.playDeskBell();
    speech.stop();

    // Clear all mischief and sit students upright
    setStudents(prev =>
      prev.map(s => ({
        ...s,
        state: 'normal',
        mischiefType: null
      }))
    );
    setActiveMischiefStudent(null);
  };

  // Pick Random Student
  const handlePickRandomStudent = () => {
    sounds.playTick();
    const eligible = studentsRef.current;
    let ticks = 0;
    const maxTicks = 8;

    const interval = setInterval(() => {
      ticks++;
      const randomIdx = Math.floor(Math.random() * eligible.length);
      setSpotlightStudentId(eligible[randomIdx].id);
      sounds.playTick();

      if (ticks >= maxTicks) {
        clearInterval(interval);
        const finalStudent = eligible[randomIdx];
        setSpotlightStudentId(finalStudent.id);
        sounds.playCheer();

        setStudents(prev =>
          prev.map(s => (s.id === finalStudent.id ? { ...s, state: 'raising_hand' } : s))
        );

        const phrase = `Já? Já to vím, paní učitelko! Hlásím se!`;
        setActiveSpeakerId(finalStudent.id);
        setSpeechBubbleText(phrase);
        setCalledStudent(finalStudent);

        speech.speak(phrase, {
          characterId: finalStudent.id
        });
      }
    }, 140);
  };

  // School Bell (Break Time Toggle)
  const handleToggleBreak = () => {
    sounds.playSchoolBell(2.5);
    speech.stop();

    if (!isBreakTime) {
      setIsBreakTime(true);
      setActiveQuestion(null);
      setCalledStudent(null);

      try {
        confetti({ particleCount: 75, spread: 80, origin: { y: 0.5 } });
      } catch {
        // Ignored
      }

      setStudents(prev =>
        prev.map(s => ({ ...s, state: 'happy', mischiefType: null }))
      );

      speech.speak('Hurá, přestávka! Můžeme si hrát!', { characterId: 'matyas' });
    } else {
      setIsBreakTime(false);

      setStudents(prev =>
        prev.map(s => ({ ...s, state: 'normal', mischiefType: null }))
      );
    }
  };

  // Reset entire day
  const handleResetDay = () => {
    setStudents(INITIAL_STUDENTS);
    localStorage.removeItem('school_students_data');
    setActiveQuestion(null);
    setCalledStudent(null);
    setActiveMischiefStudent(null);
    sounds.playDeskBell();
  };

  // If in student perspective mode:
  if (gameMode === 'student') {
    return (
      <div className="school-game-app">
        <StudentPerspectiveView
          playerName={playerName}
          onSwitchToTeacherMode={() => {
            sounds.playPop();
            speech.stop();
            setGameMode('teacher');
          }}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
        {isSettingsOpen && (
          <SettingsModal
            onClose={() => setIsSettingsOpen(false)}
            onResetDay={handleResetDay}
            students={students}
            playerName={playerName}
            onUpdatePlayerName={(name) => {
              setPlayerName(name);
              localStorage.setItem('school_player_name', name);
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="school-game-app">
      {/* Floating Mode Switcher Button (Switch to Student in Desk Mode) */}
      <div className="floating-mode-switch-wrapper">
        <button
          type="button"
          className="btn-switch-to-student-floating"
          onClick={() => {
            sounds.playPop();
            speech.stop();
            setGameMode('student');
          }}
          title="Přepnout do pohledu žáčka v lavici"
        >
          <span className="text-xl mr-1.5">🎒</span>
          <span className="font-extrabold text-amber-950">Chci být žáček ({playerName})</span>
        </button>
      </div>

      {/* Main 2D Cartoon Classroom Scene */}
      <Classroom
        students={students}
        onStudentClick={handleStudentClick}
        activeSpeakerId={activeSpeakerId}
        speechText={speechBubbleText}
        spotlightStudentId={spotlightStudentId}
        boardMessage={
          isListening
            ? (micLiveText ? `🎙️ „${micLiveText}“` : '🎙️ Paní učitelko, polož otázku třídě...')
            : activeQuestion
              ? `Otázka: „${activeQuestion}“`
              : '📖 3. Třída A - Polož otázku mikrofonem nebo ťukni na žáčka!'
        }
        activeQuestion={activeQuestion}
        onEndQuestion={handleEndQuestion}
        activeMischiefStudent={activeMischiefStudent}
        calledStudent={calledStudent}
        onQuickGrade={handleQuickGrade}
        onOpenFullGradebook={(st) => setSelectedStudentForModal(st)}
        onDismissCalledStudent={() => {
          setCalledStudent(null);
          setSpotlightStudentId(null);
          setActiveSpeakerId(null);
          setSpeechBubbleText('');
        }}
        isBreakTime={isBreakTime}
        paperAirplaneActive={paperAirplaneActive}
      />

      {/* Active Teacher Microphone Bar (Starting / Listening / Live Transcript / Error) */}
      <TeacherMicBar
        micStatus={micStatus}
        liveText={micLiveText}
        errorMessage={micErrorMessage}
        onSubmit={handleStopOrSubmitMic}
        onCancel={handleCancelMic}
        onOpenKeyboard={() => {
          handleCancelMic();
          setIsQuestionInputOpen(true);
        }}
        onRetry={handleStartListening}
      />

      {/* Teacher Desk Foreground Controls Bar */}
      <TeacherDesk
        isListening={isListening}
        micStatus={micStatus}
        onStartListening={handleStartListening}
        onStopListening={handleStopOrSubmitMic}
        onRingDeskBell={handleRingDeskBell}
        onPickRandomStudent={handlePickRandomStudent}
        onToggleBreak={handleToggleBreak}
        isBreakTime={isBreakTime}
        onOpenQuickQuestions={() => setIsQuickQuestionsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isAIActive={isAIConfigured()}
      />

      {/* Full Gradebook Modal („Žákovská knížka“) */}
      {selectedStudentForModal && (
        <GradeBookModal
          student={selectedStudentForModal}
          onClose={() => setSelectedStudentForModal(null)}
          onGiveGrade={handleGiveGradeFromModal}
          onGiveStamp={handleGiveStampFromModal}
          onStudentSpeak={handleStudentSpeakFromModal}
        />
      )}

      {/* Quick Visual Questions Cards Modal */}
      {isQuickQuestionsOpen && (
        <QuickQuestionsModal
          onClose={() => setIsQuickQuestionsOpen(false)}
          onSelectQuestion={handleSetClassroomQuestion}
        />
      )}

      {/* Direct Question Input & iPad Keyboard Dictation Modal */}
      <QuestionInputModal
        isOpen={isQuestionInputOpen}
        onClose={() => setIsQuestionInputOpen(false)}
        onSubmitQuestion={handleSetClassroomQuestion}
      />

      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal
          onClose={() => setIsSettingsOpen(false)}
          onResetDay={handleResetDay}
          students={students}
          playerName={playerName}
          onUpdatePlayerName={(name) => {
            setPlayerName(name);
            localStorage.setItem('school_player_name', name);
          }}
        />
      )}
    </div>
  );
}

export default App;
