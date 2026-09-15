import {pixelCursor} from './procedural.js';
export function logicalPoint(canvas,event) {const r=canvas.getBoundingClientRect();return {x:(event.clientX-r.left)*640/r.width,y:(event.clientY-r.top)*400/r.height-24};}
const inside=(p,r)=>p.x>=r[0]&&p.x<=r[0]+r[2]&&p.y>=r[1]&&p.y<=r[1]+r[3];
export function zones(s,g) {
  if(s.scene!=='gate') {
    if(s.flags.finaleStarted)return [];
    return [...g.objects.filter(o=>(o.id!=='rope'||s.flags.ropeThrown&&!s.flags.rangerRescued)&&(o.id!=='ranger'||!s.flags.rangerRescued)&&(o.id!=='box'||!s.flags.ladleTaken)),
      ...Object.entries(g.people).map(([id,rect])=>({id,label:({sergey:'Сергей',linochka:'Линочка',victor:'Виктор',irina:'Ирина',anton:'Антон',danka:'Данька',sanka:'Санька',sasha:'Саша',alsu:'Алсу',katya:'Катя',vinnik:'Катя Винник'})[id],rect,cursor:'speech'})),
      {id:'path',label:'Лесная тропа',rect:[5,260,52,58],cursor:'exit'}];
  }
  const p=s.flags.signed?g.prygSigned:s.flags.prygInked?g.prygInked:g.prygStart;
  return [
    {id:'book',label:'Журнал посетителей',rect:s.flags.bookDown?g.bookGround:g.bookTop,cursor:'hand'},
    {id:'pad',label:'Штемпельная подушка',rect:s.flags.padDown?g.padGround:[g.padTop[0],g.padTop[1]-2,35,28],cursor:'hand'},
    ...(!s.flags.prygDeparted?[{id:'pryg',label:'Прыг',rect:[p[0]-24,p[1]-44,48,48],cursor:'hand'}]:[]),
    {id:'keeper',label:'Смотритель',rect:[519,105,64,58],cursor:'speech'},
    ...(s.flags.rangerRescued?[{id:'ranger',label:'Лесничий',rect:g.ranger,cursor:'speech'}]:[]),
    {id:'mug',label:'Кружка смотрителя',rect:[608,151,28,28],cursor:'eye'},
    {id:'gate',label:s.flags.bridgeOpen?'Открытая калитка':'Калитка моста',rect:g.gateHit,cursor:'hand'},
    {id:'desk',label:'Высокий стол',rect:g.desk,cursor:'eye'},
    {id:'river',label:'Река',rect:g.river,cursor:'eye'},
    {id:'friends',label:'Сородичи Прыга',rect:[150,106,49,31],cursor:'eye'},
    {id:'path',label:'Лесная тропа',rect:[40,241,38,65],cursor:'exit'}
  ];
}
export function hitTest(point,s,g) {return zones(s,g).find(z=>inside(point,z.rect));}
export function setupInput(canvas,getState,g,handlers) {
  canvas.addEventListener('pointermove',e=>{const p=logicalPoint(canvas,e),s=getState();if(!s)return;const z=hitTest(p,s,typeof g==='function'?g():g);canvas.style.cursor=z?pixelCursor(handlers.looking()?'eye':z.cursor):'default';handlers.hover(z?.label||'');});
  canvas.addEventListener('pointerleave',()=>handlers.hover(''));
  canvas.addEventListener('pointerdown',e=>{if(e.button!==0)return;const s=getState();if(!s)return;const p=logicalPoint(canvas,e);if(p.y<0||p.y>328)return;handlers.click(hitTest(p,s,typeof g==='function'?g():g),p);});
}
