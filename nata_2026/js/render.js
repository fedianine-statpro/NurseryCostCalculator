import {drawWorld} from './render-world.js';
import {maskSprite} from './sprite-masks.js';
import {water,drawSigns,stampSprite,actionPose,foreground} from './procedural.js';
const sceneAssets={
  gate:['bg_gate','sprite_keeper','sprite_ranger','portrait_keeper','portrait_ranger','pryg','pryg_friends','bridge_gate','open_book','ink_pad'],
  shore:['bg_shore','sprite_sergey','portrait_sergey','chess','cherries','ashtray','ranger_boat','fishing_rod','float','bell','lizard'],
  camp:['bg_camp','sprite_ranger','portrait_ranger','ranger_boat','bell','bell_hung','ladle','fire','sketch_map',...['anton','danka','sanka','sasha','alsu','katya','vinnik'].flatMap(k=>[`sprite_${k}`,`portrait_${k}`])],
  home:['bg_home','curtain','radio','sweets','cards','kitchen_dishes','sugar_candy','potato_box','ladle','fort_memory','final_table','chess','gift',...['linochka','victor','irina'].flatMap(k=>[`sprite_${k}`,`portrait_${k}`])]
};
export class ImageLoader {
  constructor(manifest){this.assets=manifest.assets;this.images={};this.pending=new Map();}
  load(keys){return Promise.all(this.assets.filter(a=>a.path.startsWith('assets/')&&(!keys||keys.has(a.key))).map(a=>{
    if(this.images[a.key])return;
    if(!this.pending.has(a.key))this.pending.set(a.key,new Promise(resolve=>{const img=new Image();img.onload=()=>{this.images[a.key]=maskSprite(img,a);resolve();};img.onerror=()=>{this.pending.delete(a.key);resolve();};img.src=new URL(`../${a.path}`,import.meta.url).href;}));
    return this.pending.get(a.key);
  }));}
  keys(scene,finale=false){return new Set(['sprite_nata','portrait_nata','nata_actions',...(sceneAssets[scene]||[]),...(finale?Object.values(sceneAssets).flat():[])]);}
  ready(scene,finale=false){const keys=this.keys(scene,finale);return this.assets.filter(a=>keys.has(a.key)).every(a=>this.images[a.key]);}
  ensure(scene,finale=false){return this.load(this.keys(scene,finale));}
  preload(){const run=async()=>{for(const scene of ['camp','shore','home']){await this.ensure(scene);await new Promise(resolve=>setTimeout(resolve,0));}};return run();}
}
export async function loadImages(manifest){const loader=new ImageLoader(manifest);await loader.load();return loader.images;}
export function prygPosition(state,scene) {return state.flags.prygDeparted?scene.friends[0]:state.flags.signed?scene.prygSigned:state.flags.prygInked?scene.prygInked:scene.prygStart;}
export class Renderer {
  constructor(canvas,images,manifest,scene) {this.ctx=canvas.getContext('2d');this.images=images;this.assets=Object.fromEntries(manifest.assets.map(a=>[a.key,a]));this.scene=scene;}
  sprite(key,x,y,w,h,frame=0,flip=false,context=this.ctx) {
    const img=this.images[key],a=this.assets[key];
    context.save();context.imageSmoothingEnabled=false;context.translate(Math.round(x+(flip?w:0)),Math.round(y));if(flip)context.scale(-1,1);
    if(img) {
      const cw=a.cell?.[0]||img.width,ch=a.cell?.[1]||img.height,cols=Math.round(img.width/cw);
      context.drawImage(img,(frame%cols)*cw,Math.floor(frame/cols)*ch,cw,ch,0,0,Math.round(w),Math.round(h));
    } else {
      // Deliberately schematic temporary shapes; same box and anchor as real art.
      context.fillStyle=key.includes('pryg')?'#7a9441':'#876d49';context.fillRect(w*.18,h*.12,w*.64,h*.88);
      context.strokeStyle='#f4d087';context.setLineDash([3,3]);context.strokeRect(1,1,w-2,h-2);
      context.fillStyle='#f9ecd2';context.font='10px sans-serif';context.fillText('?',w/2-3,h/2);
    }
    context.restore();
  }
  portrait(key,canvas) {
    const ctx=canvas.getContext('2d');ctx.clearRect(0,0,128,128);
    if(key==='young_victor'||key==='siblings'){
      ctx.fillStyle='#3c5144';ctx.fillRect(0,0,128,128);
      for(const x of key==='siblings'?[22,72]:[47]){ctx.fillStyle='#d3ad76';ctx.fillRect(x,29,30,35);ctx.fillStyle='#69472c';ctx.fillRect(x-2,23,34,14);ctx.fillStyle='#29352d';ctx.fillRect(x+7,43,3,3);ctx.fillRect(x+20,43,3,3);ctx.fillStyle=x===72?'#a6654c':'#506c83';ctx.fillRect(x-7,65,44,52);}return;
    }
    if(['narrator','young_victor','siblings'].includes(key)) {
      ctx.fillStyle='#3c5144';ctx.fillRect(0,0,128,128);ctx.fillStyle='#dec89a';ctx.fillRect(24,48,38,46);ctx.fillRect(66,48,38,46);ctx.fillStyle='#907b51';ctx.fillRect(62,48,4,46);ctx.fillStyle='#bfac80';for(let y=58;y<90;y+=8){ctx.fillRect(31,y,23,2);ctx.fillRect(74,y,23,2);}return;
    }
    this.sprite(`portrait_${key}`,0,0,128,128,0,false,ctx);
  }
  draw(s,visual,time) {
    if(s.scene!=='gate'){drawWorld(this,s,visual,time);return;}
    const c=this.ctx,g=this.scene,f=s.flags,still=s.settings.reducedMotion;
    c.imageSmoothingEnabled=false;c.fillStyle='#1a2b22';c.fillRect(0,0,640,400);c.save();c.translate(0,24);
    this.sprite('bg_gate',0,0,640,328);
    water(c,g,time,still);drawSigns(c,g);
    for(let i=0;i<2;i++) {const p=g.friends[i];this.sprite('pryg_friends',p[0]-10,p[1]-19,20,20,i);}
    this.sprite('bridge_gate',...g.gate,f.bridgeOpen || visual.action?.type==='open_gate' && visual.action.progress>.55?1:0);
    this.sprite('sprite_keeper',...g.keeper,visual.speaker==='keeper'?1:0);
    // Repaint the existing desk in front of the keeper so his legs stay behind it.
    const bg=this.images.bg_gate;if(bg)c.drawImage(bg,495,163,119,55,495,163,119,55);
    let book=f.bookDown?g.bookGround:g.bookTop,pad=f.padDown?g.padGround:g.padTop;
    const a=visual.action;
    if(a?.type==='lower_book') book=g.bookTop.map((v,i)=>v+(g.bookGround[i]-v)*a.progress);
    if(a?.type==='lower_pad') pad=g.padTop.map((v,i)=>v+(g.padGround[i]-v)*a.progress);
    this.sprite('open_book',...book);this.sprite('ink_pad',...pad);
    if(f.signed)c.drawImage(stampSprite(),book[0]+30,book[1]+11,24,16);
    let pp=[...prygPosition(s,g)],prygFrame=0,prygScale=f.prygDeparted ? .43 : 1;
    if(a && ['jump_pad','jump_book'].includes(a.type)) {
      const dest=a.type==='jump_pad'?g.prygInked:g.prygSigned;
      pp=a.from.map((v,i)=>v+(dest[i]-v)*a.progress);pp[1]-=Math.sin(a.progress*Math.PI)*35;
      prygFrame=Math.min(5,Math.floor(a.progress*6));
    }
    // A premature request shows his clean underside; it never stains the page.
    if(a?.type==='wrong_book'){pp=[...a.from];prygFrame=a.progress>.2&&a.progress<.8?3:0;pp[1]-=Math.sin(a.progress*Math.PI)*8;}
    if(a?.type==='depart') {
      const scaled=a.progress*(g.departure.length-1),n=Math.min(g.departure.length-2,Math.floor(scaled)),p=scaled-n;
      pp=g.departure[n].map((v,i)=>v+(g.departure[n+1][i]-v)*p);pp[1]-=Math.sin(p*Math.PI)*14;
      prygScale=1-a.progress*.57;prygFrame=Math.floor(p*6)%6;
    }
    const nata=visual.position||s.position;
    const people=[...(f.rangerRescued?[{y:g.ranger[1]+96,draw:()=>this.sprite('sprite_ranger',...g.ranger,visual.speaker==='ranger'?1:0)}]:[]),
      {y:nata.y,draw:()=>{const pose=actionPose(a),frame=visual.walking?(Math.floor(time*9)%4)+(visual.direction==='up'?8:visual.direction==='down'?4:0):4;this.sprite(pose===undefined?'sprite_nata':'nata_actions',nata.x-32,nata.y-96,64,96,pose??frame,visual.direction==='left');}},
      {y:pp[1],draw:()=>{const size=48*prygScale;this.sprite('pryg',pp[0]-size/2,pp[1]-size,size,size,prygFrame);if(f.prygInked&&!f.prygDeparted){c.fillStyle='#293659';c.fillRect(Math.round(pp[0]-9*prygScale),Math.round(pp[1]-4*prygScale),Math.round(18*prygScale),2);}}}];
    people.sort((a,b)=>a.y-b.y).forEach(p=>p.draw());
    foreground(c,bg,g);
    if(!still && !a && !f.prygDeparted) {c.fillStyle='#f4deb040';const x=327+Math.sin(time*.65)*8,y=140+Math.cos(time*.4)*16;c.fillRect(Math.round(x),Math.round(y),2,2);}
    c.restore();
  }
}
