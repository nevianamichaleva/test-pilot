"use client";

import styles from "./PhraseologismCards.module.css";

const OUTLINE = "#5B4BB4";
const OUTLINE_DARK = "#2D3436";

function Bg({ fill, dots }) {
  return (
    <>
      <rect width="160" height="120" fill={fill} />
      {dots?.map((d) => (
        <circle key={`${d.x}-${d.y}`} cx={d.x} cy={d.y} r={d.r ?? 3} fill={d.c} opacity="0.55" />
      ))}
    </>
  );
}

function Sparkle({ x, y, c = "#FFD93D", s = 8 }) {
  return (
    <path
      d={`M${x} ${y - s} L${x + s * 0.28} ${y - s * 0.28} L${x + s} ${y} L${x + s * 0.28} ${y + s * 0.28} L${x} ${y + s} L${x - s * 0.28} ${y + s * 0.28} L${x - s} ${y} L${x - s * 0.28} ${y - s * 0.28} Z`}
      fill={c}
      stroke={OUTLINE}
      strokeWidth="1"
    />
  );
}

function CartoonFace({ cx, cy, r = 18, mood = "happy" }) {
  return (
    <>
      <circle cx={cx} cy={cy} r={r} fill="#FFCB8E" stroke={OUTLINE} strokeWidth="2.5" />
      <circle cx={cx - r * 0.34} cy={cy - r * 0.12} r={r * 0.18} fill="#fff" stroke={OUTLINE} strokeWidth="1.5" />
      <circle cx={cx + r * 0.34} cy={cy - r * 0.12} r={r * 0.18} fill="#fff" stroke={OUTLINE} strokeWidth="1.5" />
      <circle cx={cx - r * 0.34} cy={cy - r * 0.12} r={r * 0.09} fill={OUTLINE_DARK} />
      <circle cx={cx + r * 0.34} cy={cy - r * 0.12} r={r * 0.09} fill={OUTLINE_DARK} />
      <ellipse cx={cx - r * 0.5} cy={cy + r * 0.18} rx={r * 0.16} ry={r * 0.1} fill="#FF8FAB" opacity="0.85" />
      <ellipse cx={cx + r * 0.5} cy={cy + r * 0.18} rx={r * 0.16} ry={r * 0.1} fill="#FF8FAB" opacity="0.85" />
      {mood === "happy" && (
        <path
          d={`M${cx - r * 0.38} ${cy + r * 0.18} Q${cx} ${cy + r * 0.62} ${cx + r * 0.38} ${cy + r * 0.18}`}
          fill="none"
          stroke={OUTLINE}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      )}
      {mood === "relieved" && (
        <>
          <path
            d={`M${cx - r * 0.32} ${cy + r * 0.22} Q${cx} ${cy + r * 0.48} ${cx + r * 0.32} ${cy + r * 0.22}`}
            fill="none"
            stroke={OUTLINE}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path d={`M${cx - r * 0.55} ${cy - r * 0.55} Q${cx - r * 0.15} ${cy - r * 0.35} ${cx + r * 0.1} ${cy - r * 0.62}`} fill="none" stroke="#4ECDC4" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
      {mood === "sad" && (
        <path
          d={`M${cx - r * 0.3} ${cy + r * 0.45} Q${cx} ${cy + r * 0.2} ${cx + r * 0.3} ${cy + r * 0.45}`}
          fill="none"
          stroke={OUTLINE}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      )}
      {mood === "wow" && (
        <ellipse cx={cx} cy={cy + r * 0.35} rx={r * 0.18} ry={r * 0.14} fill="#FF6B9D" stroke={OUTLINE} strokeWidth="2" />
      )}
      {mood === "confused" && (
        <>
          <path d={`M${cx - r * 0.15} ${cy + r * 0.35} L${cx + r * 0.15} ${cy + r * 0.35}`} stroke={OUTLINE} strokeWidth="2.5" strokeLinecap="round" />
          <text x={cx + r * 0.55} y={cy - r * 0.45} fontSize="14" fontWeight="900" fill="#AA96DA" fontFamily="Arial,sans-serif">?</text>
        </>
      )}
    </>
  );
}

function KidBody({ x, y, shirt = "#4ECDC4", pants = "#6C5CE7" }) {
  return (
    <>
      <rect x={x - 16} y={y} width="32" height="28" rx="8" fill={shirt} stroke={OUTLINE} strokeWidth="2.5" />
      <rect x={x - 14} y={y + 26} width="12" height="22" rx="5" fill={pants} stroke={OUTLINE} strokeWidth="2" />
      <rect x={x + 2} y={y + 26} width="12" height="22" rx="5" fill={pants} stroke={OUTLINE} strokeWidth="2" />
    </>
  );
}

function SvgFrame({ children, label, tone, labelTone }) {
  return (
    <figure className={styles.visualPanel} style={{ "--tone": tone, "--label-tone": labelTone || tone }}>
      {label ? <figcaption className={styles.visualLabel}>{label}</figcaption> : null}
      <svg className={styles.visualSvg} viewBox="0 0 160 120" aria-hidden>
        {children}
      </svg>
    </figure>
  );
}

function KapkiVodaLiteral() {
  return (
    <>
      <Bg fill="#B8E8FF" dots={[{ x: 24, y: 22, c: "#fff", r: 4 }, { x: 136, y: 18, c: "#FFE66D", r: 5 }, { x: 130, y: 96, c: "#FF8FAB", r: 3 }]} />
      <ellipse cx="54" cy="68" rx="24" ry="30" fill="#00B4FF" stroke={OUTLINE} strokeWidth="2.5" />
      <ellipse cx="54" cy="58" rx="10" ry="12" fill="#7FE7FF" opacity="0.7" />
      <ellipse cx="106" cy="68" rx="24" ry="30" fill="#00B4FF" stroke={OUTLINE} strokeWidth="2.5" />
      <ellipse cx="106" cy="58" rx="10" ry="12" fill="#7FE7FF" opacity="0.7" />
      <circle cx="48" cy="62" r="4" fill="#fff" />
      <circle cx="100" cy="62" r="4" fill="#fff" />
      <circle cx="48" cy="62" r="2" fill={OUTLINE_DARK} />
      <circle cx="100" cy="62" r="2" fill={OUTLINE_DARK} />
      <path d="M46 72 Q54 78 62 72" fill="none" stroke={OUTLINE} strokeWidth="2" strokeLinecap="round" />
      <path d="M98 72 Q106 78 114 72" fill="none" stroke={OUTLINE} strokeWidth="2" strokeLinecap="round" />
      <Sparkle x={80} y={28} c="#FFD93D" s={10} />
    </>
  );
}

function KapkiVodaFigurative() {
  return (
    <>
      <Bg fill="#E8FFF3" dots={[{ x: 18, y: 88, c: "#FF8FAB", r: 4 }, { x: 142, y: 84, c: "#AA96DA", r: 4 }]} />
      <CartoonFace cx={52} cy={42} r={16} mood="happy" />
      <KidBody x={52} y={58} shirt="#FF6B9D" pants="#6C5CE7" />
      <CartoonFace cx={108} cy={42} r={16} mood="happy" />
      <KidBody x={108} y={58} shirt="#FF6B9D" pants="#6C5CE7" />
      <text x={80} y={108} textAnchor="middle" fontSize="18" fill="#FF6B9D" fontFamily="Arial,sans-serif" fontWeight="900">=</text>
      <Sparkle x={80} y={24} c="#FFD93D" />
    </>
  );
}

function KamukSartseLiteral() {
  return (
    <>
      <Bg fill="#FFE8F0" dots={[{ x: 20, y: 20, c: "#FFD93D", r: 4 }, { x: 140, y: 24, c: "#4ECDC4", r: 3 }]} />
      <path d="M80 94 C58 76 52 58 80 50 C108 58 102 76 80 94" fill="#FF6B9D" stroke={OUTLINE} strokeWidth="2.5" />
      <path d="M80 94 C72 88 68 78 80 72 C92 78 88 88 80 94" fill="#FF8FAB" opacity="0.6" />
      <polygon points="80,14 98,42 62,42" fill="#A0AEC0" stroke={OUTLINE} strokeWidth="2.5" />
      <polygon points="80,22 90,38 70,38" fill="#CBD5E1" />
      <CartoonFace cx={80} cy={64} r={14} mood="sad" />
      <line x1="80" y1="42" x2="80" y2="50" stroke={OUTLINE} strokeWidth="3" />
      <Sparkle x={124} y={38} c="#FF9F43" s={7} />
    </>
  );
}

function KamukSartseFigurative() {
  return (
    <>
      <Bg fill="#D5FFF0" dots={[{ x: 26, y: 18, c: "#FFD93D", r: 5 }, { x: 134, y: 20, c: "#FF8FAB", r: 4 }]} />
      <CartoonFace cx={80} cy={46} r={22} mood="relieved" />
      <KidBody x={80} y={68} shirt="#4ECDC4" pants="#0984E3" />
      <path d="M28 34 L44 22" stroke="#4ECDC4" strokeWidth="3" strokeLinecap="round" />
      <path d="M132 34 L116 22" stroke="#4ECDC4" strokeWidth="3" strokeLinecap="round" />
      <Sparkle x={36} y={28} c="#FFD93D" />
      <Sparkle x={124} y={28} c="#FFD93D" />
    </>
  );
}

function UdarilKamukLiteral() {
  return (
    <>
      <Bg fill="#FFF4D6" dots={[{ x: 16, y: 16, c: "#FF8FAB", r: 3 }]} />
      <CartoonFace cx={48} cy={52} r={15} mood="wow" />
      <KidBody x={48} y={66} shirt="#74B9FF" pants="#6C5CE7" />
      <rect x={44} y={38} width="8" height="18" rx="3" fill="#FFCB8E" stroke={OUTLINE} strokeWidth="2" transform="rotate(-30 48 47)" />
      <polygon points="98,82 134,82 116,44" fill="#B2BEC3" stroke={OUTLINE} strokeWidth="2.5" />
      <polygon points="116,44 108,58 124,58" fill="#DFE6E9" />
      <text x={116} y={98} textAnchor="middle" fontSize="18" fontWeight="900" fill="#FF6B6B" fontFamily="Arial,sans-serif">БУМ!</text>
    </>
  );
}

function UdarilKamukFigurative() {
  return (
    <>
      <Bg fill="#FFF0E6" dots={[{ x: 140, y: 16, c: "#AA96DA", r: 4 }]} />
      <rect x={40} y={32} width="72" height="52" rx="10" fill="#FFEAA7" stroke={OUTLINE} strokeWidth="2.5" />
      <line x1={52} y1={48} x2={100} y2={48} stroke="#FF9F43" strokeWidth="3" strokeLinecap="round" />
      <line x1={52} y1={62} x2={92} y2={62} stroke="#FF9F43" strokeWidth="3" strokeLinecap="round" />
      <circle cx={118} cy={58} r={18} fill="#FF8FAB" stroke={OUTLINE} strokeWidth="2.5" />
      <line x1={110} y1={50} x2={126} y2={66} stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      <line x1={126} y1={50} x2={110} y2={66} stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      <CartoonFace cx={28} cy={88} r={10} mood="sad" />
    </>
  );
}

function SedmoNebeLiteral() {
  return (
    <>
      <Bg fill="#89CFF0" dots={[{ x: 20, y: 90, c: "#FFD93D", r: 4 }]} />
      <ellipse cx={36} cy={34} rx={30} ry={14} fill="#fff" stroke={OUTLINE} strokeWidth="2" />
      <ellipse cx={80} cy={22} rx={34} ry={16} fill="#fff" stroke={OUTLINE} strokeWidth="2" />
      <ellipse cx={124} cy={36} rx={28} ry={13} fill="#fff" stroke={OUTLINE} strokeWidth="2" />
      <circle cx={80} cy={72} r={16} fill="#FFCB8E" stroke={OUTLINE} strokeWidth="2.5" />
      <rect x={68} y={86} width="24" height="22" rx="6" fill="#FF6B9D" stroke={OUTLINE} strokeWidth="2" />
      <line x1={74} y1={108} x2={74} y2={116} stroke={OUTLINE} strokeWidth="3" strokeLinecap="round" />
      <line x1={86} y1={108} x2={86} y2={116} stroke={OUTLINE} strokeWidth="3" strokeLinecap="round" />
      <circle cx={80} cy={18} r={10} fill="#FFD93D" stroke={OUTLINE} strokeWidth="2" />
      <text x={80} y={22} textAnchor="middle" fontSize="11" fontWeight="900" fill="#FF9F43" fontFamily="Arial,sans-serif">7</text>
    </>
  );
}

function SedmoNebeFigurative() {
  return (
    <>
      <Bg fill="#FFF9C4" dots={[{ x: 14, y: 14, c: "#FF8FAB", r: 4 }, { x: 146, y: 18, c: "#4ECDC4", r: 4 }]} />
      <CartoonFace cx={80} cy={50} r={24} mood="happy" />
      <KidBody x={80} y={74} shirt="#FF6B9D" pants="#6C5CE7" />
      <Sparkle x={34} y={86} c="#FFD93D" s={9} />
      <Sparkle x={80} y={96} c="#FF8FAB" s={8} />
      <Sparkle x={126} y={84} c="#4ECDC4" s={9} />
      <path d="M48 28 L56 16 L64 28" fill="#FFD93D" stroke={OUTLINE} strokeWidth="1.5" />
      <path d="M96 24 L104 12 L112 24" fill="#FFD93D" stroke={OUTLINE} strokeWidth="1.5" />
    </>
  );
}

function TrunGlogLiteral() {
  return (
    <>
      <Bg fill="#E8FFE8" dots={[{ x: 130, y: 14, c: "#FFD93D", r: 4 }]} />
      <line x1={44} y1={98} x2={44} y2={38} stroke="#00B894" strokeWidth="5" strokeLinecap="round" />
      <polygon points="44,54 30,44 44,32 58,44" fill="#55EFC4" stroke={OUTLINE} strokeWidth="2" />
      <circle cx={44} cy={44} r={6} fill="#FF6B6B" stroke={OUTLINE} strokeWidth="1.5" />
      <line x1={112} y1={98} x2={112} y2={32} stroke="#6D4C41" strokeWidth="5" strokeLinecap="round" />
      <circle cx={112} cy={44} r={14} fill="#FF7675" stroke={OUTLINE} strokeWidth="2.5" />
      <circle cx={104} cy={56} r={5} fill={OUTLINE_DARK} />
      <circle cx={120} cy={60} r={5} fill={OUTLINE_DARK} />
      <circle cx={112} cy={62} r={4} fill="#FF8FAB" />
      <text x={80} y={18} textAnchor="middle" fontSize="10" fontWeight="900" fill="#E17055" fontFamily="Arial,sans-serif">→</text>
    </>
  );
}

function TrunGlogFigurative() {
  return (
    <>
      <Bg fill="#FFEEF3" dots={[{ x: 18, y: 22, c: "#AA96DA", r: 3 }]} />
      <rect x={24} y={72} width={112} height={18} rx={8} fill="#DFE6E9" stroke={OUTLINE} strokeWidth="2" />
      <circle cx={40} cy={62} r={14} fill="#FF7675" stroke={OUTLINE} strokeWidth="2" />
      <circle cx={72} cy={48} r={14} fill="#FF9F43" stroke={OUTLINE} strokeWidth="2" />
      <circle cx={104} cy={34} r={14} fill="#E17055" stroke={OUTLINE} strokeWidth="2" />
      <path d="M40 76 L72 62 L104 48" fill="none" stroke="#6C5CE7" strokeWidth="3" strokeDasharray="4 3" />
      <text x={40} y={24} textAnchor="middle" fontSize="10" fontWeight="900" fill="#E17055" fontFamily="Arial,sans-serif">лошо</text>
      <text x={104} y={18} textAnchor="middle" fontSize="10" fontWeight="900" fill="#D63031" fontFamily="Arial,sans-serif">още по-лошо!</text>
    </>
  );
}

function KapkaMoreLiteral() {
  return (
    <>
      <rect width="160" height="120" fill="#48DBFB" />
      <circle cx={130} cy={24} r={16} fill="#FFD93D" stroke={OUTLINE} strokeWidth="2" />
      <path d="M0 78 Q40 68 80 78 T160 78 L160 120 L0 120 Z" fill="#0ABDE3" stroke={OUTLINE} strokeWidth="2" />
      <ellipse cx={80} cy={66} rx={8} ry={10} fill="#7FE7FF" stroke="#fff" strokeWidth="2" />
      <circle cx={78} cy={64} r={2} fill={OUTLINE_DARK} />
      <path d="M76 70 Q80 74 84 70" fill="none" stroke={OUTLINE} strokeWidth="1.5" />
      <Sparkle x={24} y={32} c="#fff" s={6} />
    </>
  );
}

function KapkaMoreFigurative() {
  return (
    <>
      <Bg fill="#F0F4FF" dots={[{ x: 20, y: 20, c: "#FFD93D", r: 4 }]} />
      <rect x={20} y={58} width={120} height={40} rx={12} fill="#A29BFE" stroke={OUTLINE} strokeWidth="2.5" />
      <circle cx={36} cy={78} r={8} fill="#00CEC9" stroke={OUTLINE} strokeWidth="2" />
      <text x={80} y={44} textAnchor="middle" fontSize="13" fontWeight="900" fill="#6C5CE7" fontFamily="Arial,sans-serif">ГОЛЯМО</text>
      <text x={80} y={108} textAnchor="middle" fontSize="11" fontWeight="900" fill="#00CEC9" fontFamily="Arial,sans-serif">малко</text>
      <Sparkle x={132} y={48} c="#FFD93D" />
    </>
  );
}

function ChernaOvcaLiteral() {
  return (
    <>
      <Bg fill="#DFFFD6" dots={[{ x: 16, y: 18, c: "#FFD93D", r: 4 }]} />
      {[
        { x: 40, dark: false },
        { x: 80, dark: false },
        { x: 120, dark: true },
      ].map(({ x, dark }) => (
        <g key={x}>
          <ellipse cx={x} cy={76} rx={20} ry={16} fill={dark ? "#2D3436" : "#fff"} stroke={OUTLINE} strokeWidth="2.5" />
          <circle cx={x} cy={58} r={12} fill={dark ? "#2D3436" : "#fff"} stroke={OUTLINE} strokeWidth="2.5" />
          <circle cx={x - 4} cy={56} r={2} fill={dark ? "#fff" : OUTLINE_DARK} />
          <circle cx={x + 4} cy={56} r={2} fill={dark ? "#fff" : OUTLINE_DARK} />
          {!dark && <ellipse cx={x - 7} cy={60} rx={3} ry={2} fill="#FF8FAB" opacity="0.8" />}
          {dark && <ellipse cx={x - 7} cy={60} rx={3} ry={2} fill="#FF7675" opacity="0.8" />}
        </g>
      ))}
      <Sparkle x={120} y={28} c="#FFD93D" s={7} />
    </>
  );
}

function ChernaOvcaFigurative() {
  return (
    <>
      <Bg fill="#E8F4FF" dots={[{ x: 140, y: 90, c: "#FFD93D", r: 4 }]} />
      {[48, 80, 112].map((x, i) => (
        <g key={x}>
          <CartoonFace cx={x} cy={52} r={13} mood="happy" />
          <KidBody x={x} y={64} shirt={["#74B9FF", "#74B9FF", "#FF7675"][i]} pants="#6C5CE7" />
        </g>
      ))}
      <rect x={28} y={88} width={104} height={10} rx={5} fill="#FFD93D" stroke={OUTLINE} strokeWidth="2" />
    </>
  );
}

function MuhaSlonLiteral() {
  return (
    <>
      <Bg fill="#FFF8E7" dots={[{ x: 18, y: 18, c: "#4ECDC4", r: 3 }]} />
      <ellipse cx={42} cy={66} rx={14} ry={9} fill="#2D3436" stroke={OUTLINE} strokeWidth="2" />
      <ellipse cx={36} cy={62} rx={10} ry={6} fill="#74B9FF" opacity="0.5" />
      <ellipse cx={48} cy={62} rx={10} ry={6} fill="#74B9FF" opacity="0.5" />
      <circle cx={38} cy={66} r={3} fill="#fff" />
      <circle cx={46} cy={66} r={3} fill="#fff" />
      <ellipse cx={112} cy={70} rx={38} ry={30} fill="#B2BEC3" stroke={OUTLINE} strokeWidth="2.5" />
      <ellipse cx={92} cy={58} rx={16} ry={20} fill="#B2BEC3" stroke={OUTLINE} strokeWidth="2" />
      <circle cx={88} cy={52} r={4} fill="#fff" />
      <circle cx={104} cy={54} r={3} fill="#fff" />
      <rect x={96} y={78} width={28} height={10} rx={4} fill="#636E72" stroke={OUTLINE} strokeWidth="1.5" />
      <path d="M58 66 L78 66" stroke="#FF6B6B" strokeWidth="4" strokeLinecap="round" markerEnd="url(#arrMuha)" />
      <defs>
        <marker id="arrMuha" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#FF6B6B" />
        </marker>
      </defs>
      <text x={80} y={28} textAnchor="middle" fontSize="9" fontWeight="900" fill="#6C5CE7" fontFamily="Arial,sans-serif">мишка → слон?!</text>
    </>
  );
}

function MuhaSlonFigurative() {
  return (
    <>
      <Bg fill="#FFF0F5" dots={[{ x: 132, y: 16, c: "#FFD93D", r: 4 }]} />
      <CartoonFace cx={56} cy={48} r={18} mood="wow" />
      <KidBody x={56} y={66} shirt="#FF7675" pants="#6C5CE7" />
      <circle cx={108} cy={82} r={10} fill="#636E72" stroke={OUTLINE} strokeWidth="2" />
      <text x={108} y={86} textAnchor="middle" fontSize="10" fontWeight="900" fill="#fff" fontFamily="Arial,sans-serif">!</text>
      <ellipse cx={108} cy={68} rx={28} ry={10} fill="#FF8FAB" stroke={OUTLINE} strokeWidth="2" opacity="0.8" />
      <text x={108} y={72} textAnchor="middle" fontSize="8" fontWeight="900" fill="#D63031" fontFamily="Arial,sans-serif">огромен проблем</text>
    </>
  );
}

function RibaSuhoLiteral() {
  return (
    <>
      <Bg fill="#FFF3BF" dots={[{ x: 140, y: 20, c: "#FF8FAB", r: 4 }]} />
      <ellipse cx={82} cy={68} rx={36} ry={18} fill="#48DBFB" stroke={OUTLINE} strokeWidth="2.5" />
      <polygon points="118,68 138,58 138,78" fill="#0ABDE3" stroke={OUTLINE} strokeWidth="2" />
      <circle cx={66} cy={64} r={5} fill="#fff" stroke={OUTLINE} strokeWidth="1.5" />
      <circle cx={66} cy={64} r={2.5} fill={OUTLINE_DARK} />
      <path d="M60 74 Q66 78 72 74" fill="none" stroke={OUTLINE} strokeWidth="2" />
      <path d="M18 90 L142 90" stroke="#E17055" strokeWidth="5" strokeLinecap="round" />
      <text x={80} y={28} textAnchor="middle" fontSize="10" fontWeight="900" fill="#E17055" fontFamily="Arial,sans-serif">без вода!</text>
      <Sparkle x={28} y={72} c="#4ECDC4" s={6} />
    </>
  );
}

function RibaSuhoFigurative() {
  return (
    <>
      <Bg fill="#F0F8FF" dots={[{ x: 22, y: 16, c: "#FFD93D", r: 4 }]} />
      <CartoonFace cx={80} cy={46} r={20} mood="confused" />
      <KidBody x={80} y={66} shirt="#74B9FF" pants="#0984E3" />
      <rect x={28} y={82} width={104} height={22} rx={8} fill="#FFEAA7" stroke={OUTLINE} strokeWidth="2.5" />
      <text x={80} y={97} textAnchor="middle" fontSize="10" fontWeight="900" fill="#6C5CE7" fontFamily="Arial,sans-serif">ново място</text>
    </>
  );
}

function VulkOvcaLiteral() {
  return (
    <>
      <Bg fill="#E8FFD6" dots={[{ x: 16, y: 16, c: "#FFD93D", r: 4 }]} />
      <ellipse cx={80} cy={82} rx={34} ry={22} fill="#fff" stroke={OUTLINE} strokeWidth="2.5" />
      <circle cx={80} cy={54} r={20} fill="#fff" stroke={OUTLINE} strokeWidth="2.5" />
      <circle cx={74} cy={50} r={4} fill="#fff" stroke={OUTLINE} strokeWidth="1.5" />
      <circle cx={86} cy={50} r={4} fill="#FF6B6B" stroke={OUTLINE} strokeWidth="1.5" />
      <path d="M72 58 L88 58" stroke={OUTLINE} strokeWidth="2" />
      <path d="M62 42 L70 30 L78 42" fill="#2D3436" stroke={OUTLINE} strokeWidth="1.5" />
      <path d="M82 42 L90 30 L98 42" fill="#2D3436" stroke={OUTLINE} strokeWidth="1.5" />
      <ellipse cx={80} cy={38} rx={22} ry={10} fill="#fff" stroke={OUTLINE} strokeWidth="2" opacity="0.9" />
      <text x={80} y={18} textAnchor="middle" fontSize="9" fontWeight="900" fill="#6C5CE7" fontFamily="Arial,sans-serif">като овца...</text>
    </>
  );
}

function VulkOvcaFigurative() {
  return (
    <>
      <Bg fill="#FFECEC" dots={[{ x: 134, y: 18, c: "#FFD93D", r: 4 }]} />
      <CartoonFace cx={80} cy={46} r={22} mood="happy" />
      <rect x={56} y={80} width={48} height={22} rx={8} fill="#FF7675" stroke={OUTLINE} strokeWidth="2.5" />
      <text x={80} y={95} textAnchor="middle" fontSize="9" fontWeight="900" fill="#fff" fontFamily="Arial,sans-serif">лош план</text>
      <path d="M118 40 L128 30 M118 48 L132 48 M118 56 L128 66" stroke="#D63031" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
    </>
  );
}

function PchelicaLiteral() {
  return (
    <>
      <Bg fill="#FFF9DB" dots={[{ x: 18, y: 20, c: "#FF8FAB", r: 3 }, { x: 142, y: 88, c: "#4ECDC4", r: 4 }]} />
      <ellipse cx={80} cy={64} rx={26} ry={18} fill="#FFD93D" stroke={OUTLINE} strokeWidth="2.5" />
      <rect x={62} y={54} width="36" height="7" rx="2" fill="#2D3436" />
      <rect x={62} y={66} width="36" height="7" rx="2" fill="#2D3436" />
      <ellipse cx={54} cy={54} rx={14} ry={9} fill="#E8F4FF" stroke={OUTLINE} strokeWidth="2" opacity="0.85" />
      <ellipse cx={106} cy={54} rx={14} ry={9} fill="#E8F4FF" stroke={OUTLINE} strokeWidth="2" opacity="0.85" />
      <circle cx={72} cy={60} r={3} fill={OUTLINE_DARK} />
      <circle cx={88} cy={60} r={3} fill={OUTLINE_DARK} />
      <path d="M108 64 L138 48" stroke="#AA96DA" strokeWidth="2.5" strokeDasharray="5 3" />
      <Sparkle x={132} y={40} c="#FFD93D" s={7} />
    </>
  );
}

function PchelicaFigurative() {
  return (
    <>
      <Bg fill="#E8FFF0" dots={[{ x: 20, y: 88, c: "#FFD93D", r: 4 }]} />
      <CartoonFace cx={58} cy={44} r={16} mood="happy" />
      <KidBody x={58} y={60} shirt="#55EFC4" pants="#6C5CE7" />
      <rect x={92} y={72} width={22} height={22} rx={6} fill="#FFD93D" stroke={OUTLINE} strokeWidth="2" />
      <rect x={118} y={80} width={22} height={14} rx={6} fill="#FF9F43" stroke={OUTLINE} strokeWidth="2" />
      <rect x={92} y={52} width={18} height={18} rx={5} fill="#FF8FAB" stroke={OUTLINE} strokeWidth="2" />
      <Sparkle x={106} y={44} c="#FFD93D" s={6} />
    </>
  );
}

function KonLiteral() {
  return (
    <>
      <Bg fill="#DFF6CA" dots={[{ x: 16, y: 16, c: "#FFD93D", r: 4 }, { x: 144, y: 20, c: "#FF8FAB", r: 3 }]} />
      <ellipse cx={80} cy={76} rx={38} ry={22} fill="#E17055" stroke={OUTLINE} strokeWidth="2.5" />
      <rect x={56} y={44} width={48} height={32} rx={10} fill="#FF9F43" stroke={OUTLINE} strokeWidth="2.5" />
      <circle cx={68} cy={56} r={4} fill="#fff" />
      <circle cx={92} cy={56} r={4} fill="#fff" />
      <circle cx={68} cy={56} r={2} fill={OUTLINE_DARK} />
      <circle cx={92} cy={56} r={2} fill={OUTLINE_DARK} />
      <path d="M52 48 Q38 28 46 16" fill="none" stroke="#6D4C41" strokeWidth="4" strokeLinecap="round" />
      <path d="M108 48 Q122 26 114 14" fill="none" stroke="#6D4C41" strokeWidth="4" strokeLinecap="round" />
      <line x1={64} y1={98} x2={64} y2={112} stroke={OUTLINE} strokeWidth="4" strokeLinecap="round" />
      <line x1={96} y1={98} x2={96} y2={112} stroke={OUTLINE} strokeWidth="4" strokeLinecap="round" />
      <path d="M64 66 Q80 78 96 66" fill="none" stroke={OUTLINE} strokeWidth="2" />
    </>
  );
}

function KonFigurative() {
  return (
    <>
      <Bg fill="#F0F4FF" dots={[{ x: 18, y: 18, c: "#FFD93D", r: 4 }]} />
      <CartoonFace cx={72} cy={48} r={18} mood="happy" />
      <KidBody x={72} y={64} shirt="#FF7675" pants="#6C5CE7" />
      <path d="M48 88 L64 68 L80 90 L96 64 L112 88" fill="none" stroke="#6C5CE7" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <Sparkle x={112} y={56} c="#FFD93D" s={8} />
    </>
  );
}

const VISUALS = {
  "kapki-voda": { literal: KapkiVodaLiteral, figurative: KapkiVodaFigurative, litTone: "#B8E8FF", figTone: "#E8FFF3", litLabel: "#2563EB", figLabel: "#059669" },
  "kamuk-sartse": { literal: KamukSartseLiteral, figurative: KamukSartseFigurative, litTone: "#FFE8F0", figTone: "#D5FFF0", litLabel: "#DB2777", figLabel: "#059669" },
  "udaril-kamuk": { literal: UdarilKamukLiteral, figurative: UdarilKamukFigurative, litTone: "#FFF4D6", figTone: "#FFF0E6", litLabel: "#D97706", figLabel: "#EA580C" },
  "sedmo-nebe": { literal: SedmoNebeLiteral, figurative: SedmoNebeFigurative, litTone: "#89CFF0", figTone: "#FFF9C4", litLabel: "#0284C7", figLabel: "#CA8A04" },
  "trun-glog": { literal: TrunGlogLiteral, figurative: TrunGlogFigurative, litTone: "#E8FFE8", figTone: "#FFEEF3", litLabel: "#16A34A", figLabel: "#E11D48" },
  "kapka-more": { literal: KapkaMoreLiteral, figurative: KapkaMoreFigurative, litTone: "#48DBFB", figTone: "#F0F4FF", litLabel: "#0369A1", figLabel: "#7C3AED" },
  "cherna-ovca": { literal: ChernaOvcaLiteral, figurative: ChernaOvcaFigurative, litTone: "#DFFFD6", figTone: "#E8F4FF", litLabel: "#65A30D", figLabel: "#2563EB" },
  "muha-slon": { literal: MuhaSlonLiteral, figurative: MuhaSlonFigurative, litTone: "#FFF8E7", figTone: "#FFF0F5", litLabel: "#9333EA", figLabel: "#DB2777" },
  "riba-suho": { literal: RibaSuhoLiteral, figurative: RibaSuhoFigurative, litTone: "#FFF3BF", figTone: "#F0F8FF", litLabel: "#D97706", figLabel: "#0284C7" },
  "vulk-ovca": { literal: VulkOvcaLiteral, figurative: VulkOvcaFigurative, litTone: "#E8FFD6", figTone: "#FFECEC", litLabel: "#65A30D", figLabel: "#DC2626" },
  pchelica: { literal: PchelicaLiteral, figurative: PchelicaFigurative, litTone: "#FFF9DB", figTone: "#E8FFF0", litLabel: "#CA8A04", figLabel: "#16A34A" },
  kon: { literal: KonLiteral, figurative: KonFigurative, litTone: "#DFF6CA", figTone: "#F0F4FF", litLabel: "#65A30D", figLabel: "#6C5CE7" },
};

/**
 * @param {{ id: string, literalCaption?: string, figurativeCaption?: string, compact?: boolean }} props
 */
export function PhraseDualVisual({ id, literalCaption, figurativeCaption, compact = false }) {
  const pair = VISUALS[id];
  if (!pair) return null;
  const Lit = pair.literal;
  const Fig = pair.figurative;
  return (
    <div className={[styles.dualVisual, compact ? styles.dualCompact : ""].filter(Boolean).join(" ")}>
      <SvgFrame label={literalCaption || ""} tone={pair.litTone} labelTone={pair.litLabel}>
        <Lit />
      </SvgFrame>
      <SvgFrame label={figurativeCaption || ""} tone={pair.figTone} labelTone={pair.figLabel}>
        <Fig />
      </SvgFrame>
    </div>
  );
}
