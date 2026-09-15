// Scene-specific staging; shares the existing Canvas2D renderer and sprite anchors.
import {water,steam,rope,rescueGeometry,evening,actionPose,foreground} from './procedural.js';
export function drawWorld(r,s,v,time) {
  const c=r.ctx,g=r.scene,f=s.flags,a=v.action,p=a?.progress||0;
  c.imageSmoothingEnabled=false;c.fillStyle='#18251f';c.fillRect(0,0,640,400);c.save();c.translate(0,24);
  r.sprite(`bg_${s.scene}`,0,0,640,328);
  water(c,g,time,s.settings.reducedMotion);
  const draw=(key,rect,frame=0)=>r.sprite(key,...rect,frame);
  if(s.scene==='shore') {
    draw('chess',[549,175,73,35]);draw('cherries',[578,215,40,28]);draw('ashtray',[582,251,32,24]);
    draw('ranger_boat',[71,165,90,45]);
    if(!s.inventory.includes('rod'))draw('fishing_rod',[489,115,25,124]);
    if(!f.bellRetrieved){const lift=a?.type==='retrieve_bell'?p:0;draw('float',[253,209-lift*45,28,28]);c.strokeStyle='#a99663';c.lineWidth=2;c.beginPath();c.moveTo(316,218);c.lineTo(267,224-lift*45);c.stroke();if(lift>.4)draw('bell',[269+(lift-.4)*65,231-lift*47,28,28]);if(lift>0&&lift<.4){c.strokeStyle='#795629';c.beginPath();c.moveTo(328,215);c.lineTo(261,186);c.stroke();}}
    draw('lizard',[337+(a?.type==='lizard'?p*55:0),216,32,32],a?.type==='lizard'?Math.min(5,Math.floor(p*6)):0);
  }
  if(s.scene==='camp') {
    if(!f.rangerRescued){const {pull}=rescueGeometry(g,a),[dx,dy]=g.rope.pull;draw('ranger_boat',[260+pull*dx,146+pull*dy,92,46]);draw('sprite_ranger',[279+pull*dx,110+pull*dy,42,63],a?.type==='throw_rope'?1:0);}
    if(f.bellHung)draw('bell_hung',[151,138,38,51]);
    if(a?.type==='hang_bell')draw('bell',[175-p*24,203-p*65,38,51]);
    if(a?.type==='signal'){const strike=Math.sin(Math.min(1,(p*2.1%0.65)/.2)*Math.PI);draw('ladle',[182-strike*9,154,14,28]);}
    draw('fire',[409,166,48,48],s.settings.reducedMotion?0:Math.floor(time*5)%4);
    draw('sketch_map',[516,262,74,42]);
    if(f.ropeThrown&&!f.rangerRescued||a?.type==='throw_rope'||a?.type==='rescue')rope(c,g,a);
    if(f.rangerRescued)draw('sprite_ranger',[271,167,56,84]);
  }
  if(s.scene==='home') {
    draw('radio',[305,148,48,32]);draw('sweets',[52,187,40,28]);draw('cards',[15,187,36,28]);
    draw('kitchen_dishes',[85,184,60,30]);draw('sugar_candy',[104,180,32,32],s.seenBlocks.includes('home/candy')?1:0);
    if(!f.finaleStarted){
      const shift=f.boxHeld?42:a?.type==='kick_box'?-Math.sin(p*Math.PI)*26:0;
      draw('potato_box',[176+shift,275,84,45]);
      if(a?.type==='take_ladle'||f.ladleTaken){c.fillStyle='#29352d';c.fillRect(174,221,29,69);c.strokeStyle='#7b9681';c.strokeRect(161,220,13,69);}
      if(a?.type==='take_ladle')draw('ladle',[176+p*70,236-p*30,18,36]);
    }
    if(v.line?.block==='fort'||v.line?.block==='fort_again'){c.fillStyle='#30271b';c.fillRect(298,45,268,172);draw('fort_memory',[304,51,256,160]);}
  }
  let people=Object.entries(g.people).map(([id,rect])=>({id,rect:[...rect]}));
  if(f.finaleStarted){
    people=[{id:'linochka',rect:[86,126,56,84]},{id:'victor',rect:[206,139,56,84]},{id:'irina',rect:[264,152,56,84]},
      ...['sergey','anton','danka','sanka','sasha','alsu','katya','vinnik'].map((id,i)=>({id,rect:[357+(i%4)*28,150+Math.floor(i/4)*46,30,45]}))];
    if(!f.evening)draw('final_table',[4,180,235,98]);
    if(!f.evening){draw('chess',[427,191,42,21]);if(a?.type==='dinner'){const dx=Math.sin(p*Math.PI*2)*32;draw('potato_box',[145+dx,263,50,27]);}}
    draw('kitchen_dishes',[542,191,65,33]);
    // The supplied washing pose already contains the ladle and its bucket.
    if(s.seenBlocks.includes('finale/dinner')&&!f.evening)draw('gift',[162,191,40,32]);
  }
  let pos=v.position||s.position;
  if(f.finaleStarted)pos=a?.type==='wash_ladle'?{x:537,y:292}:{x:319,y:285};
  people.push({id:'nata',rect:[pos.x-32,pos.y-96,64,96]});
  steam(c,g,time,s.settings.reducedMotion,people.map(p=>p.rect));
  people.sort((a,b)=>a.rect[1]+a.rect[3]-b.rect[1]-b.rect[3]);
  for(const person of people){let frame=person.id==='nata'?(v.walking?Math.floor(time*9)%4+(v.direction==='up'?8:v.direction==='down'?4:0):4):v.speaker===person.id?1:0;
    if(a?.type==='dance'&&['nata','vinnik'].includes(person.id)){const beat=Math.floor(p*16);person.rect[0]+=Math.sin(p*Math.PI*8)*6;person.rect[1]-=Math.sin(p*Math.PI*16)**2*2;frame=person.id==='nata'?4+beat%4:beat%2;}
    const pose=person.id==='nata'&&!v.walking?actionPose(a):undefined;
    const flip=person.id==='nata'&&(['rescue','kick_box','retrieve_bell','take_ladle'].includes(a?.type)||v.direction==='left');
    const paint=()=>r.sprite(pose===undefined?`sprite_${person.id}`:'nata_actions',...person.rect,pose??frame,flip);
    if(person.id==='nata'&&a?.type==='wash_ladle')person.paint=paint;else paint();}
  foreground(c,r.images[`bg_${s.scene}`],g);
  // Washing happens in front of the stove apron, not behind its foreground mask.
  people.find(person=>person.paint)?.paint();
  if(a?.type==='wash_ladle'){c.fillStyle='#80bfcc';c.fillRect(536+Math.round(Math.sin(p*12)*2),273,10,1);}
  if(s.scene==='home'&&f.finaleStarted){
    // Bring the front of the meal table back over seated legs.
    if(!f.evening)draw('final_table',[4,185,235,90]);
    else {draw('kitchen_dishes',[70,185,76,38]);}
    if(!f.evening&&s.seenBlocks.includes('finale/dinner')){const handed=a?.type==='gift'?p:v.line?.block==='gift'||s.seenBlocks.includes('finale/gift')?1:0;draw('gift',[192+102*handed,169+71*handed,40,32]);}
    if(f.evening||a?.type==='evening')evening(c,g,f.evening?1:p);
  }
  c.restore();
}
