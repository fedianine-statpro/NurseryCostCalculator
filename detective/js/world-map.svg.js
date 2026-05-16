// Stylized world map. NOT geographically accurate — these are rough silhouettes
// that read as continents. ViewBox is 1000 x 500. City coordinates in cities.js
// are aligned to this grid.

export const WORLD_MAP_SVG = `
<svg viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
      <path d="M 50 0 L 0 0 0 50" fill="none" class="grid-line" />
    </pattern>
  </defs>
  <rect width="1000" height="500" fill="url(#grid)" />

  <!-- North America (with Mexico tail extended south) -->
  <path class="continent" d="
    M 80 110 L 140 80 L 220 90 L 270 140 L 260 200 L 245 250 L 220 285 L 200 290
    L 185 275 L 165 255 L 145 235 L 125 205 L 100 180 Z" />
  <!-- Central America / Caribbean strip -->
  <path class="continent" d="
    M 215 285 L 250 295 L 265 280 L 260 260 L 240 250 Z" />

  <!-- South America (with Brazilian bulge eastward to include Rio) -->
  <path class="continent" d="
    M 270 310 L 320 300 L 360 320 L 395 360 L 390 400 L 365 430 L 330 465
    L 305 470 L 285 450 L 280 420 L 275 370 Z" />

  <!-- Europe (southern boundary lowered, with Greek/Italian peninsula bulge) -->
  <path class="continent" d="
    M 440 130 L 500 100 L 560 105 L 600 130 L 605 165 L 595 200 L 575 225 L 555 230
    L 525 220 L 485 220 L 460 205 L 445 180 Z" />
  <!-- Iceland blob -->
  <path class="continent" d="M 470 80 L 510 75 L 510 105 L 470 110 Z" />
  <!-- British Isles -->
  <path class="continent" d="M 450 130 L 480 130 L 475 165 L 455 165 Z" />
  <!-- Scandinavia -->
  <path class="continent" d="M 545 70 L 580 70 L 595 130 L 555 130 Z" />

  <!-- Africa (top moved down to make room for new southern Europe; east edge bumped) -->
  <path class="continent" d="
    M 470 240 L 540 240 L 615 250 L 628 300 L 615 355 L 585 410 L 560 432 L 540 412
    L 510 360 L 480 305 L 465 270 Z" />

  <!-- Middle East / Asia Minor -->
  <path class="continent" d="
    M 595 175 L 660 175 L 690 200 L 700 240 L 670 260 L 620 250 L 600 225 Z" />

  <!-- Asia (main mass) -->
  <path class="continent" d="
    M 660 130 L 760 110 L 850 120 L 920 140 L 940 180 L 920 220 L 870 230
    L 800 240 L 740 245 L 690 235 L 670 200 Z" />

  <!-- India / South Asia -->
  <path class="continent" d="
    M 700 240 L 740 245 L 760 280 L 740 310 L 710 300 L 700 270 Z" />
  <!-- SE Asia mainland (extended north for Vietnam) -->
  <path class="continent" d="
    M 790 250 L 845 240 L 858 270 L 840 305 L 810 310 L 795 285 Z" />
  <!-- Indonesian/Malay arc -->
  <path class="continent" d="
    M 815 320 L 870 320 L 870 345 L 820 350 Z" />

  <!-- Japan / Korea -->
  <path class="continent" d="M 860 170 L 885 165 L 895 195 L 875 215 L 860 200 Z" />
  <path class="continent" d="M 895 175 L 925 175 L 920 220 L 895 215 Z" />

  <!-- Australia -->
  <path class="continent" d="
    M 850 380 L 920 370 L 945 405 L 920 430 L 870 425 L 855 405 Z" />
  <!-- New Zealand (two-island blob) -->
  <path class="continent" d="M 955 405 L 985 410 L 985 425 L 970 435 Z" />
  <path class="continent" d="M 960 440 L 985 442 L 980 460 L 962 458 Z" />

  <!-- Decorative compass rose -->
  <g transform="translate(60, 460)" opacity="0.5">
    <circle r="18" fill="none" stroke="#8a5a1f" stroke-width="0.6" />
    <path d="M 0 -16 L 3 0 L 0 16 L -3 0 Z" fill="#8a5a1f" />
    <path d="M -16 0 L 0 -3 L 16 0 L 0 3 Z" fill="#8a5a1f" opacity="0.6" />
    <text y="-22" text-anchor="middle" fill="#8a5a1f" font-size="9" font-family="monospace">N</text>
  </g>

  <g id="city-layer"></g>
</svg>
`;
