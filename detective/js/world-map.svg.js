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

  <!-- North America -->
  <path class="continent" d="
    M 80 110 L 140 80 L 220 90 L 270 140 L 260 200 L 240 250 L 200 280 L 180 270
    L 160 250 L 140 230 L 120 200 L 100 180 Z" />
  <!-- Central America / Caribbean strip -->
  <path class="continent" d="
    M 200 270 L 230 290 L 250 280 L 260 260 L 240 250 Z" />

  <!-- South America -->
  <path class="continent" d="
    M 270 310 L 320 300 L 350 330 L 360 380 L 340 430 L 310 470 L 290 460
    L 280 420 L 275 370 Z" />

  <!-- Europe -->
  <path class="continent" d="
    M 440 130 L 500 100 L 560 105 L 600 130 L 595 175 L 560 195 L 520 205
    L 480 215 L 460 200 L 445 175 Z" />
  <!-- Iceland blob -->
  <path class="continent" d="M 470 80 L 510 75 L 510 105 L 470 110 Z" />
  <!-- British Isles -->
  <path class="continent" d="M 450 130 L 480 130 L 475 165 L 455 165 Z" />
  <!-- Scandinavia -->
  <path class="continent" d="M 545 70 L 580 70 L 595 130 L 555 130 Z" />

  <!-- Africa -->
  <path class="continent" d="
    M 460 220 L 540 220 L 610 240 L 620 290 L 605 350 L 580 410 L 560 430
    L 540 410 L 510 360 L 480 300 L 465 260 Z" />

  <!-- Middle East / Asia Minor -->
  <path class="continent" d="
    M 595 175 L 660 175 L 690 200 L 700 240 L 670 260 L 620 250 L 600 225 Z" />

  <!-- Asia (main mass) -->
  <path class="continent" d="
    M 660 130 L 760 110 L 850 120 L 920 140 L 940 180 L 920 220 L 870 230
    L 800 240 L 740 245 L 690 235 L 670 200 Z" />

  <!-- India / SE Asia -->
  <path class="continent" d="
    M 700 240 L 740 245 L 760 280 L 740 310 L 710 300 L 700 270 Z" />
  <path class="continent" d="
    M 790 250 L 850 260 L 840 295 L 810 305 L 795 285 Z" />

  <!-- Japan / Korea -->
  <path class="continent" d="M 860 170 L 885 165 L 895 195 L 875 215 L 860 200 Z" />
  <path class="continent" d="M 895 175 L 925 175 L 920 220 L 895 215 Z" />

  <!-- Australia -->
  <path class="continent" d="
    M 850 380 L 920 370 L 945 405 L 920 430 L 870 425 L 855 405 Z" />

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
