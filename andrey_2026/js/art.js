const paths={
 fries:'<path fill="#a54528" d="M8 16h24l-4 20H12z"/><path stroke="#e9c36a" stroke-width="4" d="M12 20 10 5m7 16V3m6 18 2-16m3 17 4-13"/>',
 bread:'<path fill="#9b6232" d="M7 16C-2 0 42-1 34 16v19H7z"/><path fill="#e4c891" d="M10 16C2 4 38 3 31 16v16H10z"/>',
 camera:'<path fill="#353c37" d="M4 11h31v23H4zM11 6h12v7H11z"/><circle cx="21" cy="23" r="10" fill="#84958b"/><circle cx="21" cy="23" r="7" fill="#273945"/><circle cx="19" cy="21" r="2" fill="#b3c9c8"/><path stroke="#dfd4a8" stroke-width="2" d="M7 16h4"/>',
 bill:'<path fill="#e0d1aa" d="M10 3h22v34l-4-3-4 3-4-3-4 3-6-3z"/><path stroke="#746643" stroke-width="2" d="M14 10h14m-14 6h14m-14 6h8m-8 7h14"/>',
 sandwich:'<path fill="#bd8c4c" d="m3 18 18-11 17 10-18 12z"/><path fill="#8b5941" d="m3 22 17 11 18-12v-4L20 28 3 18z"/><path fill="#a0a357" d="m3 24 17 11 18-12v-3L20 31 3 21z"/><path fill="#e0b96e" d="m3 26 17 11 18-12v-3L20 33 3 23z"/><path fill="#8d8a75" d="M16 17v-6l5-4 5 4v6z"/>',
 rock:'<path fill="#87877b" d="m6 31-2-13L13 7l14 1 9 12-3 13-18 3z"/><path fill="#a3a491" d="m5 18 8-10 14 1-7 13z"/><circle cx="15" cy="24" r="1.5" fill="#222b20"/><circle cx="25" cy="23" r="1.5" fill="#222b20"/>',
 coin:'<ellipse fill="#a67a27" cx="20" cy="21" rx="14" ry="16"/><ellipse fill="#e3c65d" cx="18" cy="19" rx="12" ry="14"/><path stroke="#a67a27" stroke-width="2" d="M18 9v20m-4-17 4-3 4 3m-9 14h10"/>',
 cracker:'<path fill="#a64d41" d="m2 10 9 4 7-1 7 5 9-2 4 8-10 1-7 6-7-4-7 2z"/><path stroke="#dfc267" stroke-width="3" d="m12 14 8 14m5-10 4 7"/>',
 party:'<path fill="#395ec0" d="M4 7 11 18 16 5 22 18 28 6 31 18 38 8 34 34H8z"/><path fill="#6f8deb" d="m8 30 26-2v6H8z"/>',
 santa:'<path fill="#bb443c" d="M7 29C8 5 18-1 28 8l6 13-7 2-7-10-2 16z"/><path stroke="#ece6d0" stroke-width="8" d="M6 31h20"/><circle fill="#ece6d0" cx="34" cy="23" r="5"/>',
 photo:'<path fill="#e7dabb" d="M2 5h36v31H2z"/><path fill="#839a8d" d="M6 9h28v20H6z"/><path fill="#57694c" d="m6 23 10-10 6 8 7-4 5 8v4H6z"/><circle cx="27" cy="14" r="3" fill="#e8d399"/>',
 msn:'<circle fill="#7eac75" cx="15" cy="12" r="7"/><path fill="#5b9860" d="M4 33V23c0-11 22-11 22 0v10z"/><circle fill="#72a0b4" cx="28" cy="14" r="6"/><path fill="#52869d" d="M25 33V23c0-8 12-8 12 0v10z"/>',
 football:'<circle fill="#e0dbc0" cx="20" cy="20" r="17"/><path fill="#4b4e41" d="m20 11 8 6-3 9H15l-3-9zM8 7l4 10-8 5-1-8m30-7-5 10 8 6 2-9M9 33l6-7 6 10-6 1m16-4-6-7-4 10 5 1"/>'
};
export function svgIcon(name){return `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">${paths[name]??paths.rock}</svg>`;}
export function iconURL(name){return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svgIcon(name));}
export function classicURL(){return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="70" height="80" viewBox="0 0 70 80"><path fill="#596749" d="M0 0h70v80H0z"/><ellipse fill="#3d4935" cx="35" cy="72" rx="18" ry="5"/><path fill="#483e2e" d="M25 45h9v26h-9zm12 0h9v26h-9z"/><path fill="#71985c" d="M22 24h26v25H22zM16 28h7v23h-7zm32 0h7v23h-7z"/><path fill="#ca9d72" d="M27 8h17v17H27zM16 48h7v7h-7zm32 0h7v7h-7z"/><path fill="#5b432c" d="M26 7h19v7H26z"/><path fill="#292c23" d="M29 17h2v2h-2zm11 0h2v2h-2z"/></svg>');}
