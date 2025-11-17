interface GamePreviewProps {
  game: 'snake' | 'pong' | 'tetris';
}

export function GamePreview({ game }: GamePreviewProps) {
  if (game === 'snake') {
    return (
      <svg viewBox="0 0 200 200" className="w-full h-auto">
        <rect width="200" height="200" fill="#0f0f23" />
        {/* Grid pattern */}
        <defs>
          <pattern id="snakeGrid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#1a1a2e" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="200" height="200" fill="url(#snakeGrid)" />
        
        {/* Snake */}
        <rect x="60" y="90" width="10" height="10" fill="#10b981" rx="1" />
        <rect x="70" y="90" width="10" height="10" fill="#34d399" rx="1" />
        <rect x="80" y="90" width="10" height="10" fill="#34d399" rx="1" />
        <rect x="90" y="90" width="10" height="10" fill="#34d399" rx="1" />
        <rect x="100" y="90" width="10" height="10" fill="#34d399" rx="1" />
        <rect x="110" y="90" width="10" height="10" fill="#34d399" rx="1" />
        <rect x="110" y="100" width="10" height="10" fill="#34d399" rx="1" />
        
        {/* Eyes */}
        <circle cx="63" cy="93" r="1.5" fill="#000" />
        <circle cx="67" cy="93" r="1.5" fill="#000" />
        
        {/* Food */}
        <rect x="140" y="60" width="8" height="8" fill="#ef4444" rx="1">
          <animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite"/>
        </rect>
      </svg>
    );
  }

  if (game === 'pong') {
    return (
      <svg viewBox="0 0 200 100" className="w-full h-auto">
        <rect width="200" height="100" fill="#0f0f23" />
        
        {/* Center line */}
        <line x1="100" y1="0" x2="100" y2="100" stroke="#1a1a2e" strokeWidth="2" strokeDasharray="5,5" />
        
        {/* Left paddle */}
        <rect x="10" y="30" width="5" height="40" fill="#3b82f6" rx="2">
          <animate attributeName="y" values="30;20;30" dur="2s" repeatCount="indefinite"/>
        </rect>
        
        {/* Right paddle */}
        <rect x="185" y="30" width="5" height="40" fill="#ef4444" rx="2">
          <animate attributeName="y" values="30;40;30" dur="2s" repeatCount="indefinite"/>
        </rect>
        
        {/* Ball */}
        <circle cx="100" cy="50" r="4" fill="#fff">
          <animate attributeName="cx" values="100;160;100;40;100" dur="3s" repeatCount="indefinite"/>
          <animate attributeName="cy" values="50;30;50;70;50" dur="3s" repeatCount="indefinite"/>
        </circle>
        
        {/* Scores */}
        <text x="70" y="25" fill="#3b82f6" fontSize="20" fontFamily="monospace" fontWeight="bold">5</text>
        <text x="125" y="25" fill="#ef4444" fontSize="20" fontFamily="monospace" fontWeight="bold">3</text>
      </svg>
    );
  }

  if (game === 'tetris') {
    return (
      <svg viewBox="0 0 120 200" className="w-full h-auto">
        <rect width="120" height="200" fill="#0f0f23" />
        
        {/* Grid */}
        <defs>
          <pattern id="tetrisGrid" width="12" height="12" patternUnits="userSpaceOnUse">
            <path d="M 12 0 L 0 0 0 12" fill="none" stroke="#1a1a2e" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="120" height="200" fill="url(#tetrisGrid)" />
        
        {/* Settled blocks */}
        <rect x="12" y="176" width="11" height="11" fill="#00f0f0" stroke="#000" strokeWidth="0.5" />
        <rect x="24" y="176" width="11" height="11" fill="#00f0f0" stroke="#000" strokeWidth="0.5" />
        <rect x="36" y="176" width="11" height="11" fill="#f0f000" stroke="#000" strokeWidth="0.5" />
        <rect x="48" y="176" width="11" height="11" fill="#f0f000" stroke="#000" strokeWidth="0.5" />
        <rect x="60" y="176" width="11" height="11" fill="#a000f0" stroke="#000" strokeWidth="0.5" />
        <rect x="72" y="176" width="11" height="11" fill="#f00000" stroke="#000" strokeWidth="0.5" />
        <rect x="84" y="176" width="11" height="11" fill="#f00000" stroke="#000" strokeWidth="0.5" />
        
        <rect x="24" y="164" width="11" height="11" fill="#00f0f0" stroke="#000" strokeWidth="0.5" />
        <rect x="36" y="164" width="11" height="11" fill="#f0f000" stroke="#000" strokeWidth="0.5" />
        <rect x="48" y="164" width="11" height="11" fill="#a000f0" stroke="#000" strokeWidth="0.5" />
        <rect x="60" y="164" width="11" height="11" fill="#a000f0" stroke="#000" strokeWidth="0.5" />
        <rect x="72" y="164" width="11" height="11" fill="#00f000" stroke="#000" strokeWidth="0.5" />
        <rect x="84" y="164" width="11" height="11" fill="#f00000" stroke="#000" strokeWidth="0.5" />
        
        {/* Falling piece (T-piece) */}
        <g>
          <animate attributeName="transform" values="translate(0,0);translate(0,60)" dur="3s" repeatCount="indefinite"/>
          <rect x="36" y="12" width="11" height="11" fill="#a000f0" stroke="#000" strokeWidth="0.5" />
          <rect x="48" y="12" width="11" height="11" fill="#a000f0" stroke="#000" strokeWidth="0.5" />
          <rect x="60" y="12" width="11" height="11" fill="#a000f0" stroke="#000" strokeWidth="0.5" />
          <rect x="48" y="24" width="11" height="11" fill="#a000f0" stroke="#000" strokeWidth="0.5" />
        </g>
      </svg>
    );
  }

  return null;
}
