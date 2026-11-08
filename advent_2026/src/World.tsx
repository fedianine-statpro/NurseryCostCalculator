export function World() {
  return (
    <svg
      className="world"
      viewBox="0 0 1440 700"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sky" x2="0" y2="1">
          <stop stopColor="#0b242c" />
          <stop offset="1" stopColor="#376263" />
        </linearGradient>
        <linearGradient id="snow" x2="0" y2="1">
          <stop stopColor="#d4e5df" />
          <stop offset="1" stopColor="#719e9c" />
        </linearGradient>
        <radialGradient id="halo">
          <stop stopColor="#fadd9b" stopOpacity=".5" />
          <stop offset="1" stopColor="#fadd9b" stopOpacity="0" />
        </radialGradient>
        <g id="pine">
          <path
            d="M0 0L-40 85H-25L-62 145H-39L-82 215H82L39 145H62L25 85H40Z"
            fill="#163c38"
          />
          <path
            d="M0 0L-40 85L-15 74L0 50L18 77L40 85Z M-25 105L-62 145L-28 132L0 112L35 138L62 145L25 105L0 83Z"
            fill="#accbc5"
            opacity=".7"
          />
          <path d="M-6 214V250H6V214" fill="#443e32" />
        </g>
        <g id="house">
          <path d="M-73 0V125H74V0Z" fill="#8b8170" />
          <path d="M-98 10L-14-94L92 5L78 19L-13-57L-81 25Z" fill="#e2e9df" />
          <path d="M-81 25L-13-57L78 19L-12-36Z" fill="#55483d" />
          <path
            d="M-15 125V65a25 25 0 0150 0v60"
            fill="#783f32"
            stroke="#d8bc82"
            strokeWidth="5"
          />
          <circle cx="24" cy="91" r="3" fill="#f9dc8a" />
          <rect x="-57" y="40" width="29" height="39" rx="12" fill="#ffdb85" />
          <path d="M-43 40V79M-57 58H-28" stroke="#66543b" strokeWidth="4" />
          <path d="M-80 127H84" stroke="#e6eee3" strokeWidth="10" />
          <path d="M45-38V-80H61V-23" fill="#8b8170" />
        </g>
      </defs>
      <path fill="url(#sky)" d="M0 0H1440V700H0Z" />
      <circle cx="1090" cy="128" r="110" fill="url(#halo)" />
      <circle cx="1090" cy="128" r="35" fill="#eee4bd" />
      {Array.from({ length: 34 }, (_, i) => (
        <circle
          key={i}
          cx={(i * 173 + 51) % 1440}
          cy={(i * 53 + 20) % 350}
          r={i % 3 === 0 ? 2 : 1}
          fill="#e4dcaf"
        />
      ))}
      <path d="M0 490Q300 350 610 480T1440 405V700H0" fill="#426965" />
      {[20, 130, 240, 390, 550, 870, 1010, 1190, 1360].map((x, i) => (
        <use
          key={x}
          href="#pine"
          transform={
            "translate(" +
            x +
            " " +
            (250 + (i % 3) * 30) +
            ") scale(" +
            (1 + (i % 3) * 0.25) +
            ")"
          }
        />
      ))}
      <path d="M0 580Q340 460 740 570T1440 515V700H0" fill="url(#snow)" />
      <path
        d="M730 700Q1050 610 1090 510"
        fill="none"
        stroke="#e8e8d1"
        strokeWidth="58"
        opacity=".55"
      />
      <use href="#house" transform="translate(230 420) scale(1.15)" />
      <use href="#house" transform="translate(1110 428) scale(.9)" />
      <use href="#house" transform="translate(1280 470) scale(.65)" />
      <path
        d="M0 295Q220 440 435 285M1000 300Q1210 425 1440 280"
        fill="none"
        stroke="#a79862"
        strokeWidth="2"
      />
      {[
        40, 92, 145, 200, 260, 320, 380, 1030, 1090, 1150, 1210, 1270, 1330,
        1390,
      ].map((x, i) => (
        <g key={x}>
          <circle
            cx={x}
            cy={
              x < 500
                ? 315 + Math.sin((x / 435) * Math.PI) * 50
                : 320 + Math.sin(((x - 1000) / 440) * Math.PI) * 40
            }
            r="14"
            fill="url(#halo)"
          />
          <circle
            cx={x}
            cy={
              x < 500
                ? 315 + Math.sin((x / 435) * Math.PI) * 50
                : 320 + Math.sin(((x - 1000) / 440) * Math.PI) * 40
            }
            r="3"
            fill="#ffe3a3"
          />
        </g>
      ))}
      <path
        d="M0 660Q220 550 370 680M1440 650Q1270 560 1150 700"
        stroke="#20473e"
        strokeWidth="45"
        fill="none"
      />
    </svg>
  );
}
