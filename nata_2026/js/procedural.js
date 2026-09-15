// Original, deterministic pixel effects. All positions use the 640×328 world.
const canvas=(w,h)=>{const a=document.createElement('canvas');a.width=w;a.height=h;return a;};
export function polygon(c,points){c.moveTo(...points[0]);for(const p of points.slice(1))c.lineTo(...p);c.closePath();}
export function waterPath(scene){const path=new Path2D();for(const p of scene.water||[])polygon(path,p);return path;}
const waterMasks=new WeakMap();
export function water(c,scene,time,still){
  if(still||!scene.water?.length)return;
  if(!waterMasks.has(scene))waterMasks.set(scene,waterPath(scene));
  c.save();c.clip(waterMasks.get(scene));c.fillStyle='#c3ece16a';
  for(let i=0;i<76;i++){const x=Math.round((i*73+time*(3+i%4))%640),y=108+(i*17)%133;c.fillRect(x,y,3+i%6,1);}
  c.restore();
}
// The clean window plate contains the fixed plants; only this alpha fabric moves.
export function curtain(c,image,time,still){
  if(!image)return;
  c.save();c.beginPath();polygon(c,[[0,0],[166,0],[166,179],[40,191],[0,195]]);c.clip();
  c.imageSmoothingEnabled=false;
  // Keep the hanging top pinned. Two-pixel strips give the hem a gentle breeze.
  for(let y=0;y<194;y+=2){
    const sway=still?0:Math.sin(time*.8-y*.018)*2*(y/194)**1.5;
    c.drawImage(image,38,y*220/194,149,2*220/194,Math.round(sway),y,166,2);
  }
  c.restore();
}
let vapour;
export function steamSprite(){
  if(vapour)return vapour;vapour=canvas(64,64);const c=vapour.getContext('2d');
  // Sparse stipple, no blur/filter or per-frame random noise.
  for(let y=2;y<62;y++)for(let x=2;x<62;x++){
    const d=((x-32)/26)**2+((y-34)/28)**2,n=(x*73+y*151+x*y*17)%101;
    if(d<1&&n<29){c.fillStyle=`rgba(226,219,192,${(1-d)*.23})`;c.fillRect(x,y,1,1);}
  }return vapour;
}
export function steam(c,scene,time,still,faces=[]){
  if(still)return;
  for(const e of scene.steam||[]){
    c.save();c.beginPath();c.rect(...e.clip);c.clip();
    // Subtract faces even if an actor walks into an emitter's bounded area.
    c.beginPath();c.rect(...e.clip);for(const r of faces)c.rect(r[0],r[1],r[2],Math.min(35,r[3]));c.clip('evenodd');
    for(let i=0;i<4;i++){const age=(time*.18+i*.25)%1,size=22+age*24;
      c.globalAlpha=Math.sin(age*Math.PI)*.8;
      c.drawImage(steamSprite(),Math.round(e.x-size/2+Math.sin(age*5+i)*4),Math.round(e.y-age*51-size/2),size,size);
    }c.restore();
  }
}
export function rescueGeometry(scene,action){
  const a=scene.rope,p=action?.progress||0,pull=action?.type==='rescue'?p:0;
  const boat=[a.boat[0]+pull*a.pull[0],a.boat[1]+pull*a.pull[1]];
  let end=[...a.ground],sag=20;
  if(action?.type==='throw_rope'){end=boat.map((n,i)=>n+(a.ground[i]-n)*p);end[1]-=Math.sin(p*Math.PI)*64;sag=12*p;}
  if(action?.type==='rescue'){const grab=Math.min(1,p*5);end=a.ground.map((n,i)=>n+(a.hand[i]-n)*grab);sag=20*(1-grab)+2;}
  return {boat,end,control:[(boat[0]+end[0])/2,(boat[1]+end[1])/2+sag],pull};
}
export function rope(c,scene,action){
  const {boat,end,control}=rescueGeometry(scene,action);c.save();
  c.lineCap='round';c.beginPath();c.moveTo(...boat);c.quadraticCurveTo(...control,...end);
  c.strokeStyle='#59462c';c.lineWidth=3;c.stroke();c.strokeStyle='#dcc593';c.lineWidth=1;c.stroke();
  // The same fixed attachment collar remains on the boat throughout the pull.
  c.fillStyle='#806746';c.fillRect(Math.round(boat[0])-2,Math.round(boat[1])-1,4,3);c.restore();
}
export function evening(c,scene,amount){
  c.save();c.fillStyle=`rgba(94,53,30,${amount*.24})`;c.fillRect(0,0,640,328);
  for(const light of scene.finalLight||[]){c.beginPath();polygon(c,light.polygon);c.fillStyle=`rgba(255,191,91,${amount*light.opacity})`;c.fill();}
  c.restore();
}
let stamp;
export function stampSprite(){
  if(stamp)return stamp;stamp=canvas(48,32);const c=stamp.getContext('2d');
  // Broad, squat oval of Pryg's underside; fixed small scallops retain ink texture.
  for(let y=2;y<30;y++)for(let x=2;x<46;x++){
    const d=((x-24)/21)**2+((y-16)/12)**2,edge=1+(((x*7+y*11)%9)-4)*.018;
    if(d<edge&&(x*17+y*31)%97!==0){c.fillStyle=(x*3+y*7)%23===0?'#46516e':'#273555';c.fillRect(x,y,1,1);}
  }return stamp;
}
let signs;
export function signSprite(){
  if(signs)return signs;signs=canvas(160,80);const c=signs.getContext('2d');
  c.fillStyle='#3a2c20';c.fillRect(1,3,158,74);c.fillStyle='#927347';c.fillRect(3,5,154,70);
  for(let y=9;y<74;y+=8){c.fillStyle=y%3?'#a18452':'#826139';c.fillRect(5,y,150,1);}
  c.fillStyle='#dfc28b';c.fillRect(5,7,150,1);c.fillStyle='#403523';for(const x of [9,149])for(const y of [11,67])c.fillRect(x,y,2,2);
  return signs;
}
export function drawSigns(c,scene){
  for(const sign of scene.signs||[]){const [x,y,w,h]=sign.rect;c.drawImage(signSprite(),x,y,w,h);c.save();
    c.fillStyle='#211d16';c.textAlign='center';c.textBaseline='middle';c.font=`bold ${sign.font||9}px Georgia, serif`;
    sign.lines.forEach((line,i)=>c.fillText(line,x+w/2,y+h*(i+1)/(sign.lines.length+1),w-8));c.restore();}
}
let cursorSheet;
const cursorCache={};
export function cursors(){
  if(cursorSheet)return cursorSheet;cursorSheet=canvas(96,24);const c=cursorSheet.getContext('2d');
  const cells=[
    ['    ####    ','  ##....##  ',' #...##...# ','#...####...#',' #...##...# ','  ##....##  ','    ####    '],
    [' ########## ',' #........# ',' #.######.# ',' #........# ',' #.####...# ',' #........# ',' ####..#### ','   #..#     ','   ###      '],
    ['    ##      ','   #..#     ','   #..#     ','   #..###   ','   #..#..## ',' ###......# ','#..#......# ',' #........# ','  #......#  ','  ########  '],
    ['      #     ','      ##    ',' ######.#   ',' #.......#  ',' #........# ',' #.......#  ',' ######.#   ','      ##    ','      #     ']
  ];
  cells.forEach((rows,i)=>rows.forEach((row,y)=>[...row].forEach((v,x)=>{if(v===' ')return;c.fillStyle=v==='#'?'#23362b':'#f4dfac';c.fillRect(i*24+x*2,2+y*2,2,2);})));return cursorSheet;
}
export function pixelCursor(kind){
  if(!cursorCache[kind]){const cell=canvas(24,24),i=['eye','speech','hand','exit'].indexOf(kind);cell.getContext('2d').drawImage(cursors(),Math.max(i,0)*24,0,24,24,0,0,24,24);cursorCache[kind]=`url("${cell.toDataURL()}") 12 12, pointer`;}
  return cursorCache[kind];
}
export function actionPose(action){return ({lower_book:0,lower_pad:0,take_ladle:1,kick_box:2,retrieve_bell:action?.progress<.4?1:3,rescue:3,hang_bell:4,signal:4,wash_ladle:5,candy:1,gift:1})[action?.type];}
// Foreground cuts reuse the exact approved background, not unmatched fg artwork.
export function foreground(c,image,scene){if(!image)return;for(const p of scene.foreground||[]){c.save();c.beginPath();polygon(c,p);c.clip();c.drawImage(image,0,0,640,328);c.restore();}}
