// animals.js — SVG cartoon animal generators
// Each returns an SVG string for use inside <svg viewBox="0 0 100 100">

window.Animals = {

  fox: (bg = '#FFF0E8') => `
    <circle cx="50" cy="50" r="50" fill="${bg}"/>
    <circle cx="50" cy="54" r="28" fill="#E8541A"/>
    <ellipse cx="50" cy="74" rx="18" ry="10" fill="#c44210"/>
    <polygon points="30,30 36,52 24,52" fill="#E8541A"/>
    <polygon points="70,30 76,52 64,52" fill="#E8541A"/>
    <polygon points="31,30 36,48 26,48" fill="#f5c5a0"/>
    <polygon points="69,30 74,48 64,48" fill="#f5c5a0"/>
    <ellipse cx="50" cy="63" rx="14" ry="10" fill="#f5c5a0"/>
    <circle cx="43" cy="50" r="4" fill="#1a1a18"/>
    <circle cx="57" cy="50" r="4" fill="#1a1a18"/>
    <circle cx="44" cy="49" r="1.5" fill="#fff"/>
    <circle cx="58" cy="49" r="1.5" fill="#fff"/>
    <ellipse cx="50" cy="60" rx="3" ry="2" fill="#cc4444"/>
    <path d="M44,63 Q50,67 56,63" stroke="#cc4444" stroke-width="1.5" fill="none" stroke-linecap="round"/>`,

  bear: (bg = '#F5EDE6') => `
    <circle cx="50" cy="50" r="50" fill="${bg}"/>
    <circle cx="50" cy="55" r="28" fill="#8B5E3C"/>
    <circle cx="36" cy="32" r="10" fill="#8B5E3C"/>
    <circle cx="64" cy="32" r="10" fill="#8B5E3C"/>
    <circle cx="36" cy="32" r="6" fill="#a87050"/>
    <circle cx="64" cy="32" r="6" fill="#a87050"/>
    <ellipse cx="50" cy="65" rx="16" ry="11" fill="#a87050"/>
    <circle cx="43" cy="51" r="4.5" fill="#1a1a18"/>
    <circle cx="57" cy="51" r="4.5" fill="#1a1a18"/>
    <circle cx="44" cy="50" r="1.5" fill="#fff"/>
    <circle cx="58" cy="50" r="1.5" fill="#fff"/>
    <ellipse cx="50" cy="60" rx="4" ry="2.5" fill="#5a3020"/>
    <circle cx="46" cy="58" r="1.5" fill="#5a3020"/>
    <circle cx="54" cy="58" r="1.5" fill="#5a3020"/>
    <path d="M44,65 Q50,70 56,65" stroke="#5a3020" stroke-width="1.5" fill="none" stroke-linecap="round"/>`,

  bunny: (bg = '#FCF0F5') => `
    <circle cx="50" cy="50" r="50" fill="${bg}"/>
    <ellipse cx="37" cy="26" rx="8" ry="20" fill="#D4A0B8"/>
    <ellipse cx="63" cy="26" rx="8" ry="20" fill="#D4A0B8"/>
    <ellipse cx="37" cy="24" rx="4" ry="15" fill="#F2BFCE"/>
    <ellipse cx="63" cy="24" rx="4" ry="15" fill="#F2BFCE"/>
    <circle cx="50" cy="58" r="26" fill="#D4A0B8"/>
    <ellipse cx="50" cy="68" rx="15" ry="10" fill="#F2BFCE"/>
    <circle cx="43" cy="53" r="4" fill="#1a1a18"/>
    <circle cx="57" cy="53" r="4" fill="#1a1a18"/>
    <circle cx="44" cy="52" r="1.5" fill="#fff"/>
    <circle cx="58" cy="52" r="1.5" fill="#fff"/>
    <ellipse cx="50" cy="62" rx="3" ry="2" fill="#E090A0"/>
    <path d="M44,66 Q50,71 56,66" stroke="#C060A0" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <line x1="38" y1="62" x2="26" y2="60" stroke="#D4A0B8" stroke-width="1.2"/>
    <line x1="38" y1="64" x2="25" y2="64" stroke="#D4A0B8" stroke-width="1.2"/>
    <line x1="62" y1="62" x2="74" y2="60" stroke="#D4A0B8" stroke-width="1.2"/>
    <line x1="62" y1="64" x2="75" y2="64" stroke="#D4A0B8" stroke-width="1.2"/>`,

  owl: (bg = '#EEF1F8') => `
    <circle cx="50" cy="50" r="50" fill="${bg}"/>
    <ellipse cx="50" cy="57" rx="26" ry="28" fill="#8896B8"/>
    <ellipse cx="50" cy="50" rx="20" ry="22" fill="#C8D0E8"/>
    <polygon points="38,25 44,42 32,42" fill="#8896B8"/>
    <polygon points="62,25 68,42 56,42" fill="#8896B8"/>
    <circle cx="42" cy="52" r="9" fill="#fff"/>
    <circle cx="58" cy="52" r="9" fill="#fff"/>
    <circle cx="42" cy="52" r="6" fill="#3A4A6A"/>
    <circle cx="58" cy="52" r="6" fill="#3A4A6A"/>
    <circle cx="43" cy="51" r="2" fill="#fff"/>
    <circle cx="59" cy="51" r="2" fill="#fff"/>
    <polygon points="50,58 46,64 54,64" fill="#E8A830"/>
    <ellipse cx="50" cy="72" rx="12" ry="7" fill="#A0AACC"/>`,

  cat: (bg = '#F3F3F6') => `
    <circle cx="50" cy="50" r="50" fill="${bg}"/>
    <circle cx="50" cy="55" r="26" fill="#A0A0B8"/>
    <polygon points="30,36 36,54 22,52" fill="#A0A0B8"/>
    <polygon points="70,36 78,52 64,54" fill="#A0A0B8"/>
    <polygon points="31,37 36,51 25,50" fill="#F0C8C8"/>
    <polygon points="69,37 75,50 64,51" fill="#F0C8C8"/>
    <ellipse cx="50" cy="66" rx="16" ry="10" fill="#C8C8D8"/>
    <circle cx="43" cy="51" r="4" fill="#1a1a18"/>
    <circle cx="57" cy="51" r="4" fill="#1a1a18"/>
    <circle cx="44" cy="50" r="2" fill="#fff"/>
    <circle cx="58" cy="50" r="2" fill="#fff"/>
    <ellipse cx="50" cy="60" rx="2.5" ry="2" fill="#E08080"/>
    <path d="M44,64 Q50,68 56,64" stroke="#B06080" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <line x1="40" y1="61" x2="25" y2="58" stroke="#888" stroke-width="1"/>
    <line x1="40" y1="63" x2="25" y2="63" stroke="#888" stroke-width="1"/>
    <line x1="60" y1="61" x2="75" y2="58" stroke="#888" stroke-width="1"/>
    <line x1="60" y1="63" x2="75" y2="63" stroke="#888" stroke-width="1"/>`,

  panda: (bg = '#F2F2F2') => `
    <circle cx="50" cy="50" r="50" fill="${bg}"/>
    <circle cx="50" cy="55" r="27" fill="#F0F0F0"/>
    <circle cx="36" cy="36" r="10" fill="#333"/>
    <circle cx="64" cy="36" r="10" fill="#333"/>
    <ellipse cx="42" cy="52" rx="9" ry="8" fill="#222"/>
    <ellipse cx="58" cy="52" rx="9" ry="8" fill="#222"/>
    <circle cx="42" cy="51" r="5" fill="#fff"/>
    <circle cx="58" cy="51" r="5" fill="#fff"/>
    <circle cx="42" cy="51" r="3" fill="#111"/>
    <circle cx="58" cy="51" r="3" fill="#111"/>
    <circle cx="43" cy="50" r="1" fill="#fff"/>
    <circle cx="59" cy="50" r="1" fill="#fff"/>
    <ellipse cx="50" cy="64" rx="13" ry="9" fill="#e0e0e0"/>
    <ellipse cx="50" cy="61" rx="4" ry="2.5" fill="#D06060"/>
    <path d="M44,66 Q50,71 56,66" stroke="#999" stroke-width="1.5" fill="none" stroke-linecap="round"/>`,

  frog: (bg = '#E8F5EE') => `
    <circle cx="50" cy="50" r="50" fill="${bg}"/>
    <circle cx="50" cy="58" r="25" fill="#4AB870"/>
    <ellipse cx="50" cy="70" rx="18" ry="11" fill="#7FD89A"/>
    <circle cx="36" cy="38" r="10" fill="#4AB870"/>
    <circle cx="64" cy="38" r="10" fill="#4AB870"/>
    <circle cx="36" cy="38" r="7" fill="#fff"/>
    <circle cx="64" cy="38" r="7" fill="#fff"/>
    <circle cx="36" cy="38" r="4.5" fill="#1a1a18"/>
    <circle cx="64" cy="38" r="4.5" fill="#1a1a18"/>
    <circle cx="37" cy="37" r="1.5" fill="#fff"/>
    <circle cx="65" cy="37" r="1.5" fill="#fff"/>
    <ellipse cx="50" cy="60" rx="3" ry="2" fill="#E06060"/>
    <path d="M43,65 Q50,72 57,65" stroke="#3A9A5C" stroke-width="2" fill="none" stroke-linecap="round"/>
    <ellipse cx="50" cy="55" rx="12" ry="6" fill="#7FD89A"/>`,

  penguin: (bg = '#EDF0F6') => `
    <circle cx="50" cy="50" r="50" fill="${bg}"/>
    <ellipse cx="50" cy="58" rx="24" ry="28" fill="#2A3A5A"/>
    <ellipse cx="50" cy="62" rx="15" ry="20" fill="#F0F0F0"/>
    <circle cx="50" cy="38" r="16" fill="#2A3A5A"/>
    <circle cx="43" cy="36" r="4.5" fill="#fff"/>
    <circle cx="57" cy="36" r="4.5" fill="#fff"/>
    <circle cx="43" cy="36" r="3" fill="#1a1a18"/>
    <circle cx="57" cy="36" r="3" fill="#1a1a18"/>
    <circle cx="44" cy="35" r="1" fill="#fff"/>
    <circle cx="58" cy="35" r="1" fill="#fff"/>
    <polygon points="50,43 46,49 54,49" fill="#F5A800"/>
    <ellipse cx="50" cy="53" rx="8" ry="5" fill="#F0F0F0"/>
    <ellipse cx="28" cy="60" rx="8" ry="14" fill="#2A3A5A"/>
    <ellipse cx="72" cy="60" rx="8" ry="14" fill="#2A3A5A"/>
    <ellipse cx="40" cy="80" rx="10" ry="5" fill="#F5A800"/>
    <ellipse cx="60" cy="80" rx="10" ry="5" fill="#F5A800"/>`,

  hedgehog: (bg = '#F5EFE6') => `
    <circle cx="50" cy="50" r="50" fill="${bg}"/>
    <ellipse cx="50" cy="62" rx="28" ry="22" fill="#8B6030"/>
    <ellipse cx="50" cy="55" rx="20" ry="18" fill="#C8A060"/>
    <ellipse cx="50" cy="70" rx="18" ry="10" fill="#F5DDB0"/>
    <circle cx="43" cy="56" r="4" fill="#1a1a18"/>
    <circle cx="57" cy="56" r="4" fill="#1a1a18"/>
    <circle cx="44" cy="55" r="1.5" fill="#fff"/>
    <circle cx="58" cy="55" r="1.5" fill="#fff"/>
    <ellipse cx="50" cy="64" rx="3.5" ry="2.5" fill="#B07040"/>
    <path d="M44,68 Q50,73 56,68" stroke="#906030" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <line x1="32" y1="44" x2="38" y2="52" stroke="#6B4020" stroke-width="2" stroke-linecap="round"/>
    <line x1="38" y1="40" x2="42" y2="50" stroke="#6B4020" stroke-width="2" stroke-linecap="round"/>
    <line x1="44" y1="38" x2="46" y2="49" stroke="#6B4020" stroke-width="2" stroke-linecap="round"/>
    <line x1="50" y1="37" x2="50" y2="48" stroke="#6B4020" stroke-width="2" stroke-linecap="round"/>
    <line x1="56" y1="38" x2="54" y2="49" stroke="#6B4020" stroke-width="2" stroke-linecap="round"/>
    <line x1="62" y1="40" x2="58" y2="50" stroke="#6B4020" stroke-width="2" stroke-linecap="round"/>
    <line x1="68" y1="44" x2="62" y2="52" stroke="#6B4020" stroke-width="2" stroke-linecap="round"/>`,

  deer: (bg = '#FAF0E8') => `
    <circle cx="50" cy="50" r="50" fill="${bg}"/>
    <circle cx="50" cy="57" r="26" fill="#C8905A"/>
    <ellipse cx="50" cy="68" rx="16" ry="10" fill="#F0D0A0"/>
    <path d="M32,32 Q28,18 22,14 Q30,14 34,24 Q36,16 34,8 Q42,16 38,28" fill="#C8905A"/>
    <path d="M68,32 Q72,18 78,14 Q70,14 66,24 Q64,16 66,8 Q58,16 62,28" fill="#C8905A"/>
    <circle cx="43" cy="51" r="4.5" fill="#3A2810"/>
    <circle cx="57" cy="51" r="4.5" fill="#3A2810"/>
    <circle cx="44" cy="50" r="1.5" fill="#fff"/>
    <circle cx="58" cy="50" r="1.5" fill="#fff"/>
    <ellipse cx="50" cy="60" rx="3.5" ry="2.5" fill="#D07050"/>
    <path d="M44,65 Q50,70 56,65" stroke="#A06040" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <ellipse cx="36" cy="38" rx="5" ry="4" fill="#E0B080"/>
    <ellipse cx="64" cy="38" rx="5" ry="4" fill="#E0B080"/>`

};

// Helper: render an animal into an element
Animals.render = function(type, size = 60) {
  const fn = Animals[type];
  if (!fn) return '';
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" style="display:block">${fn()}</svg>`;
};

// Helper: return inner SVG paths only (for embedding)
Animals.paths = function(type) {
  const fn = Animals[type];
  return fn ? fn() : '';
};
