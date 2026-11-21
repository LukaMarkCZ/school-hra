import React from 'react';

const HAND_RAISE_BADGES = {
  eliska: { emoji: '🙋‍♀️', text: 'Já to vím!' },
  matyas: { emoji: '🙋‍♂️', text: 'Já! Hehe!' },
  filip: { emoji: '🙋‍♂️', text: 'Tady!' },
  viktorie: { emoji: '🙋‍♀️', text: 'Brnkačka!' },
  tomas: { emoji: '🙋‍♂️', text: 'Možná vím...' },
  sofie: { emoji: '🙋‍♀️', text: 'Mám nápad!' },
  kuba: { emoji: '🙋‍♂️', text: 'Já vím!' },
  ondra: { emoji: '🙋‍♂️', text: 'Zív... já...' }
};

/**
 * Animated 2D Cartoon Student Avatar
 * Custom SVG drawing with dynamic expressions, hair, accessories, and gestures
 */
export function StudentAvatar({
  student,
  onClick,
  isSpeaking,
  speechText,
  isSpotlight,
}) {
  const {
    id,
    name,
    nickname,
    hairColor,
    hairStyle,
    clothesColor,
    skinTone,
    accessory,
    glasses,
    state,
    mischiefType
  } = student;

  // Compute gesture states
  const isRaisingHand = state === 'raising_hand';
  const isSleeping = state === 'sleeping' || mischiefType === 'sleep';
  const isHappy = state === 'happy';
  const isShy = state === 'shy';
  const isShocked = state === 'shocked';
  const isThrowingPlane = mischiefType === 'plane';
  const isWhispering = mischiefType === 'talk';
  const isSnacking = mischiefType === 'snack';

  return (
    <div
      className={`student-avatar-container ${isSpotlight ? 'spotlight-student' : ''} ${isSpeaking ? 'speaking-active' : ''}`}
      onClick={() => onClick(student)}
      role="button"
      tabIndex={0}
      title={`${name} (${nickname}) - Ťuknutím otevřeš žákovskou knížku`}
    >
      {/* Active Speech Bubble */}
      {isSpeaking && speechText && (
        <div className="speech-bubble-wrapper">
          <div className="speech-bubble">
            <span className="speech-bubble-speaker">{name}:</span>
            <span className="speech-bubble-content">{speechText}</span>
            <div className="speech-bubble-arrow" />
          </div>
        </div>
      )}

      {/* Hand Raising Attention Badge - unique per character */}
      {isRaisingHand && !isSpeaking && (
        <div className="hand-raise-badge animate-bounce-callout">
          <span className="hand-emoji">{HAND_RAISE_BADGES[id]?.emoji || '🙋'}</span>
          <span className="hand-text">{HAND_RAISE_BADGES[id]?.text || 'Já vím!'}</span>
        </div>
      )}

      {/* Mischief Alert Badge */}
      {mischiefType && (
        <div className="mischief-badge" title="Tento žák zlobí! Ťukni na něj!">
          <span className="mischief-icon">
            {mischiefType === 'plane' && '✈️'}
            {mischiefType === 'talk' && '🗣️'}
            {mischiefType === 'sleep' && '😴'}
            {mischiefType === 'snack' && '🍎'}
            {mischiefType === 'ball' && '⚽'}
          </span>
          <span className="mischief-pulse" />
        </div>
      )}

      {/* Sleeping ZZZ animation */}
      {isSleeping && (
        <div className="sleep-zzz-particles">
          <span className="zzz z1">z</span>
          <span className="zzz z2">Z</span>
          <span className="zzz z3">Z</span>
        </div>
      )}

      {/* SVG Cartoon Character */}
      <div className={`avatar-svg-box ${isRaisingHand ? 'arm-up' : ''} ${isHappy ? 'bouncing' : ''}`}>
        <svg
          viewBox="0 0 160 180"
          className="student-svg"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id={`skinGrad-${id}`} cx="40%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#FFF2E8" />
              <stop offset="100%" stopColor={skinTone} />
            </radialGradient>
            <filter id={`shadow-${id}`} x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Torso / Clothes */}
          <g className="avatar-torso" filter={`url(#shadow-${id})`}>
            {/* Shoulders & shirt */}
            <path
              d={isSleeping
                ? "M 42 155 Q 80 142 118 155 L 126 180 L 34 180 Z"
                : "M 46 130 Q 80 120 114 130 L 128 180 L 32 180 Z"
              }
              fill={clothesColor}
            />
            {/* Collar */}
            <path
              d="M 66 126 Q 80 140 94 126 L 86 142 L 74 142 Z"
              fill="#FFFFFF"
            />
            {/* Tie or necklace or badge */}
            {id === 'eliska' && (
              <circle cx="80" cy="148" r="4" fill="#FFD700" />
            )}
            {id === 'filip' && (
              <text x="80" y="162" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">10</text>
            )}
          </g>

          {/* Left Arm (if raising hand, or normal) */}
          {isRaisingHand ? (
            <g className="avatar-arm-raised">
              {/* Hand waving up high */}
              <path
                d="M 44 130 Q 25 80 28 35 Q 36 28 46 34 L 54 85 Q 52 115 44 130 Z"
                fill={clothesColor}
              />
              {/* Hand palm & fingers waving */}
              <circle cx="32" cy="28" r="14" fill={skinTone} />
              <path d="M 22 24 Q 28 14 36 18 Q 42 22 40 32" stroke={skinTone} strokeWidth="6" strokeLinecap="round" />
            </g>
          ) : isThrowingPlane ? (
            <g className="avatar-arm-plane">
              {/* Arm reaching out holding paper airplane */}
              <path d="M 42 135 Q 20 110 18 90 L 32 88 Q 36 110 48 135 Z" fill={clothesColor} />
              <circle cx="20" cy="85" r="9" fill={skinTone} />
              {/* Paper airplane */}
              <polygon points="12,78 36,86 16,94 18,87" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="1.5" />
            </g>
          ) : isWhispering ? (
            <g className="avatar-arm-whisper">
              <path d="M 112 135 Q 128 115 110 95 L 98 102 Q 112 118 106 135 Z" fill={clothesColor} />
              <circle cx="108" cy="94" r="9" fill={skinTone} />
            </g>
          ) : isSnacking ? (
            <g className="avatar-arm-snack">
              <path d="M 52 138 Q 66 110 76 102 L 86 108 Q 78 122 56 142 Z" fill={clothesColor} />
              {/* Apple or cookie in hand */}
              <circle cx="82" cy="98" r="8" fill="#EF4444" />
              <path d="M 82 90 Q 84 86 86 86" stroke="#15803D" strokeWidth="2" fill="none" />
            </g>
          ) : (
            /* Normal resting arms on desk */
            <g className="avatar-arms-resting">
              <path d="M 44 130 Q 32 155 58 165 L 68 155 Q 46 145 52 130 Z" fill={clothesColor} />
              <path d="M 116 130 Q 128 155 102 165 L 92 155 Q 114 145 108 130 Z" fill={clothesColor} />
              {/* Resting hands */}
              <circle cx="60" cy="165" r="9" fill={skinTone} />
              <circle cx="100" cy="165" r="9" fill={skinTone} />
            </g>
          )}

          {/* Neck */}
          <rect
            x="72"
            y={isSleeping ? "108" : "102"}
            width="16"
            height="18"
            rx="4"
            fill={skinTone}
          />

          {/* Head & Face Group */}
          <g
            className="avatar-head-group"
            transform={isSleeping ? "rotate(14 80 80) translate(0 14)" : "rotate(0 80 80)"}
          >
            {/* Ears */}
            <circle cx="44" cy="78" r="9" fill={skinTone} />
            <circle cx="116" cy="78" r="9" fill={skinTone} />

            {/* Face base */}
            <ellipse
              cx="80"
              cy="76"
              rx="36"
              ry="38"
              fill={`url(#skinGrad-${id})`}
            />

            {/* Blushing cheeks for Tomáš or Shy or Happy */}
            {(isShy || isHappy || accessory === 'blush' || id === 'tomas') && (
              <g className="avatar-blush" opacity="0.65">
                <ellipse cx="58" cy="85" rx="7" ry="4.5" fill="#FF69B4" />
                <ellipse cx="102" cy="85" rx="7" ry="4.5" fill="#FF69B4" />
              </g>
            )}

            {/* Eyes */}
            {isSleeping ? (
              // Closed peaceful sleeping eyes
              <g stroke="#4A3728" strokeWidth="3" strokeLinecap="round" fill="none">
                <path d="M 58 75 Q 65 82 72 75" />
                <path d="M 88 75 Q 95 82 102 75" />
              </g>
            ) : isShocked ? (
              // Wide shocked eyes
              <g>
                <circle cx="64" cy="72" r="9" fill="#FFFFFF" />
                <circle cx="64" cy="72" r="5" fill="#222222" />
                <circle cx="62" cy="70" r="2" fill="#FFFFFF" />
                <circle cx="96" cy="72" r="9" fill="#FFFFFF" />
                <circle cx="96" cy="72" r="5" fill="#222222" />
                <circle cx="94" cy="70" r="2" fill="#FFFFFF" />
              </g>
            ) : isHappy ? (
              // Happy squinting smiling eyes
              <g stroke="#3A2818" strokeWidth="3.5" strokeLinecap="round" fill="none">
                <path d="M 56 74 Q 64 64 72 74" />
                <path d="M 88 74 Q 96 64 104 74" />
              </g>
            ) : (
              // Normal cartoon expressive eyes
              <g>
                <ellipse cx="64" cy="72" rx="7" ry="8.5" fill="#FFFFFF" stroke="#333" strokeWidth="1" />
                <ellipse cx="64" cy="72" rx="4.5" ry="5.5" fill="#2D3748" />
                <circle cx="62.5" cy="70" r="2" fill="#FFFFFF" />

                <ellipse cx="96" cy="72" rx="7" ry="8.5" fill="#FFFFFF" stroke="#333" strokeWidth="1" />
                <ellipse cx="96" cy="72" rx="4.5" ry="5.5" fill="#2D3748" />
                <circle cx="94.5" cy="70" r="2" fill="#FFFFFF" />
              </g>
            )}

            {/* Eyebrows */}
            {isShocked ? (
              <g stroke="#3E2723" strokeWidth="2.5" strokeLinecap="round" fill="none">
                <path d="M 56 58 Q 64 52 72 58" />
                <path d="M 88 58 Q 96 52 104 58" />
              </g>
            ) : isRaisingHand || isHappy ? (
              <g stroke="#3E2723" strokeWidth="2.5" strokeLinecap="round" fill="none">
                <path d="M 56 61 Q 64 57 72 61" />
                <path d="M 88 61 Q 96 57 104 61" />
              </g>
            ) : (
              <g stroke="#3E2723" strokeWidth="2.2" strokeLinecap="round" fill="none">
                <path d="M 56 62 Q 64 61 72 63" />
                <path d="M 88 63 Q 96 61 104 62" />
              </g>
            )}

            {/* Glasses for Eliška */}
            {glasses && (
              <g className="avatar-glasses" stroke="#D97706" strokeWidth="2.5" fill="none">
                <circle cx="64" cy="72" r="11" />
                <circle cx="96" cy="72" r="11" />
                <path d="M 75 72 L 85 72" />
                <path d="M 53 71 L 44 73" />
                <path d="M 107 71 L 116 73" />
              </g>
            )}

            {/* Nose */}
            <path
              d="M 80 77 Q 83 82 80 84"
              stroke="#D97706"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />

            {/* Mouth */}
            {isSpeaking ? (
              // Animated open speaking mouth
              <path
                d="M 72 90 Q 80 106 88 90 Z"
                fill="#DC2626"
                stroke="#991B1B"
                strokeWidth="2"
                className="mouth-speaking-anim"
              />
            ) : isShocked ? (
              <ellipse cx="80" cy="94" rx="7" ry="9" fill="#7F1D1D" />
            ) : isHappy ? (
              // Big beaming smile
              <path
                d="M 68 89 Q 80 104 92 89"
                stroke="#B91C1C"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="#EF4444"
              />
            ) : isSleeping ? (
              // Small drowsy mouth
              <ellipse cx="80" cy="91" rx="4" ry="2.5" fill="#A16207" />
            ) : (
              // Sweet smiling curve
              <path
                d="M 72 91 Q 80 97 88 91"
                stroke="#A16207"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            )}

            {/* Hair Styles */}
            <g className="avatar-hair">
              {hairStyle === 'pigtails' && (
                // Eliška's pigtails & bangs
                <g fill={hairColor}>
                  <path d="M 44 65 Q 80 32 116 65 Q 112 40 80 40 Q 48 40 44 65 Z" />
                  <path d="M 50 56 Q 80 72 110 56 Q 102 46 80 48 Q 58 46 50 56 Z" />
                  {/* Left Pigtail */}
                  <path d="M 44 64 Q 22 55 24 85 Q 26 100 36 94 Q 42 78 44 64 Z" />
                  {/* Right Pigtail */}
                  <path d="M 116 64 Q 138 55 136 85 Q 134 100 124 94 Q 118 78 116 64 Z" />
                  {/* Hair ribbons */}
                  <circle cx="36" cy="74" r="5" fill="#FF1493" />
                  <circle cx="124" cy="74" r="5" fill="#FF1493" />
                </g>
              )}

              {hairStyle === 'messy' && (
                // Matyáš's messy spiky orange hair
                <g fill={hairColor}>
                  <path d="M 42 66 Q 40 38 70 34 Q 80 20 94 32 Q 118 30 118 64 Q 110 46 80 48 Q 52 46 42 66 Z" />
                  {/* Spikes */}
                  <polygon points="60,36 68,22 76,34" />
                  <polygon points="78,32 88,18 96,32" />
                  <polygon points="98,34 112,24 114,40" />
                </g>
              )}

              {hairStyle === 'floppy' && (
                // Ondra's floppy sleepy hair
                <g fill={hairColor}>
                  <path d="M 44 66 Q 46 36 80 36 Q 114 36 116 66 Q 106 50 80 54 Q 54 50 44 66 Z" />
                  <path d="M 64 52 Q 74 68 84 54 Q 78 48 64 52 Z" />
                </g>
              )}

              {hairStyle === 'punk_braid' && (
                // Viktorie's cool hairstyle with purple streak
                <g fill={hairColor}>
                  <path d="M 44 65 Q 46 34 80 34 Q 114 34 116 65 Q 106 46 80 48 Q 54 46 44 65 Z" />
                  {/* Braid on side */}
                  <path d="M 116 65 Q 128 85 124 112 Q 118 110 114 90 Z" />
                  {/* Purple streak */}
                  <path d="M 65 38 Q 72 26 80 38 Q 76 56 68 56 Z" fill="#9333EA" />
                </g>
              )}

              {hairStyle === 'curly' && (
                // Tomáš's curly mop of hair
                <g fill={hairColor}>
                  <circle cx="52" cy="46" r="14" />
                  <circle cx="68" cy="38" r="15" />
                  <circle cx="86" cy="36" r="16" />
                  <circle cx="104" cy="42" r="14" />
                  <circle cx="114" cy="54" r="13" />
                  <circle cx="46" cy="58" r="12" />
                </g>
              )}

              {hairStyle === 'short_spiky' && (
                // Filip's sporty headband & hair
                <g>
                  <path d="M 44 60 Q 50 32 80 32 Q 110 32 116 60 Z" fill={hairColor} />
                  {/* Sport headband */}
                  <rect x="42" y="52" width="76" height="12" rx="4" fill="#EF4444" />
                  <line x1="42" y1="58" x2="118" y2="58" stroke="#FFFFFF" strokeWidth="2" />
                </g>
              )}

              {hairStyle === 'beret_curls' && (
                // Sofie's artistic beret & curls
                <g>
                  {/* Hair curls */}
                  <path d="M 44 65 Q 44 95 38 105 Q 48 95 48 70 Z" fill={hairColor} />
                  <path d="M 116 65 Q 116 95 122 105 Q 112 95 112 70 Z" fill={hairColor} />
                  {/* French beret */}
                  <ellipse cx="80" cy="42" rx="38" ry="18" fill="#EC4899" />
                  <circle cx="80" cy="24" r="4" fill="#BE185D" />
                  {/* Flower clip */}
                  <circle cx="56" cy="56" r="6" fill="#FBBF24" />
                  <circle cx="56" cy="56" r="3" fill="#FFFFFF" />
                </g>
              )}

              {hairStyle === 'round_mop' && (
                // Kuba's round mop
                <g fill={hairColor}>
                  <path d="M 44 68 Q 44 36 80 36 Q 116 36 116 68 Q 104 52 80 54 Q 56 52 44 68 Z" />
                </g>
              )}
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}
