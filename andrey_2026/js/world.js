import * as T from '../vendor/three.module.js';
import {CONFIG,REWARD} from './config.js';
import {findPath,approachPath} from './path.js';
import {MAP_WIDTH,MAP_HEIGHT,TARGETS,targetAction,terrainAt} from './map-data.js';
import {buildTerrain,enhanceScenery,tree} from './scenery.js';
import {buildVillage} from './village.js';
import {makeHuman} from './characters.js';
export {MAP_WIDTH,MAP_HEIGHT,TARGETS} from './map-data.js';
const V=(x=0,y=0,z=0)=>new T.Vector3(x,y,z);
export class World{
 constructor(canvas,{onTarget,onGround,onArrive}){
  this.canvas=canvas;this.onTarget=onTarget;this.onGround=onGround;this.onArrive=onArrive;this.scene=new T.Scene();this.scene.background=new T.Color(0x8caaa5);this.scene.fog=new T.Fog(0x8caaa5,43,90);
  this.renderer=new T.WebGLRenderer({canvas,antialias:false,alpha:false,powerPreference:'low-power'});this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));this.renderer.outputColorSpace=T.SRGBColorSpace;
  this.camera=new T.PerspectiveCamera(36,1,.1,160);this.focus=V(9,0,9);this.desiredFocus=this.focus.clone();this.zoom=16;this.yaw=.45;this.pitch=.93;this.hovered=null;this.activeSpeaker=null;this.camera.position.set(23,24,29);this.camera.lookAt(this.focus);
  this.scene.add(new T.AmbientLight(0xdde9e2,1.25));const light=new T.DirectionalLight(0xffe5b7,1.9);light.position.set(-8,20,10);this.scene.add(light);
  this.root=new T.Group();this.scene.add(this.root);this.fx=new T.Group();this.scene.add(this.fx);this.photoRoot=new T.Group();this.scene.add(this.photoRoot);this.photoRoot.visible=false;
  this.actors={};this.proxies=[];this.blocked=new Set();this.labels=[];this.ray=new T.Raycaster();this.pointer=new T.Vector2();this.walk=[];this.pending=null;this.time=0;this.waiters=[];this.seated=null;this.sequence=null;this.materials=new Map();this.build();this.bind();this.resize();
 }
 mat(color){if(!this.materials.has(color))this.materials.set(color,new T.MeshLambertMaterial({color,flatShading:true}));return this.materials.get(color);}
 box(parent,x,y,z,w,h,d,c){const m=new T.Mesh(new T.BoxGeometry(w,h,d),this.mat(c));m.position.set(x,y,z);parent.add(m);return m;}
 cyl(parent,x,y,z,r,h,c,sides=8){const m=new T.Mesh(new T.CylinderGeometry(r,r,h,sides),this.mat(c));m.position.set(x,y,z);parent.add(m);return m;}
 sphere(parent,x,y,z,r,c,detail=0){const m=new T.Mesh(new T.IcosahedronGeometry(r,detail),this.mat(c));m.position.set(x,y,z);parent.add(m);return m;}
 group(parent,x=0,y=0,z=0){const g=new T.Group();g.position.set(x,y,z);parent.add(g);return g;}
 sign(text,x,z,width=2,parent=this.root,y=1.65){const c=document.createElement('canvas');c.width=512;c.height=128;const g=c.getContext('2d');g.fillStyle='#493b28';g.fillRect(0,0,512,128);g.strokeStyle='#b1a071';g.lineWidth=6;g.strokeRect(5,5,502,118);g.fillStyle='#fff0c7';g.textAlign='center';g.font='bold 42px Georgia';g.fillText(text,256,81,480);const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;tex.magFilter=T.NearestFilter;const m=new T.Mesh(new T.PlaneGeometry(width,width/4),new T.MeshBasicMaterial({map:tex,side:T.DoubleSide}));m.position.set(x,y,z);parent.add(m);return m;}
 label(actor,text,kind='actor'){this.labels.push({actor,text,kind});}
 human(name,x,z,options={}){return makeHuman(this,name,x,z,options);}
 hat(parent,kind=CONFIG.reward){const g=this.group(parent,0,2.18,0);if(kind==='santa'){const cap=new T.Mesh(new T.ConeGeometry(.34,.6,7),this.mat(0xc63c32));cap.position.y=.17;cap.rotation.z=-.28;g.add(cap);this.cyl(g,0,-.05,0,.35,.14,0xe5e0cb);this.sphere(g,.15,.46,0,.11,0xe5e0cb);}else{const vertices=[];for(let i=0;i<12;i++){const a=i*Math.PI/6,b=(i+1)*Math.PI/6,x=Math.sin(a)*.33,z=Math.cos(a)*.33,xx=Math.sin(b)*.33,zz=Math.cos(b)*.33,h=i%2?.04:.36,hh=(i+1)%2?.04:.36;vertices.push(x,-.13,z,xx,-.13,zz,x,h,z,xx,-.13,zz,xx,hh,zz,x,h,z);}const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(vertices,3));geometry.computeVertexNormals();const material=this.mat(REWARD.color);material.side=T.DoubleSide;g.add(new T.Mesh(geometry,material));}return g;}
 buildRobot(parent,x=0,z=0){const g=this.group(parent,x,0,z);this.box(g,0,.87,0,.65,.65,.4,0x8a8a72);this.box(g,0,1.5,0,.75,.53,.55,0xa3a48d);for(const side of [-1,1]){this.box(g,side*.22,1.55,.29,.15,.13,.06,0xeadb88);this.box(g,side*.42,.8,0,.15,.6,.2,0x756f51);this.box(g,side*.2,.3,0,.18,.5,.23,0x756f51);}this.cyl(g,0,1.86,0,.07,.2,0x8d7544);return g;}
 cameraModel(parent,x=0,y=1.2,z=0){const g=this.group(parent,x,y,z);this.box(g,0,0,0,.55,.38,.27,0x303b36);const lens=this.cyl(g,0,0,.2,.14,.2,0x87958a);lens.rotation.x=Math.PI/2;for(const side of [-1,1]){const leg=this.box(g,side*.2,-.63,0,.04,1.1,.04,0x5c5c4d);leg.rotation.z=side*.16;}return g;}
 build(){
  buildTerrain(this);buildVillage(this);enhanceScenery(this);
  const ctx=this.mapTexture.getContext('2d');for(const key of this.blocked){const [x,z]=key.split(',').map(Number);if(terrainAt(x,z)!=='water'){ctx.fillStyle='#4d5140';ctx.fillRect(x,z,1,1);}}
  this.occluders=[];this.root.traverse(o=>{if(o.userData.occluder)this.occluders.push(o);});
  for(const [id,t]of Object.entries(TARGETS)){const p=new T.Mesh(new T.CylinderGeometry(id==='house'?1.4:.7,id==='house'?1.4:.7,2.5,8),new T.MeshBasicMaterial({visible:false}));p.position.set(t.x,1,t.z);p.userData.target=id;this.root.add(p);this.proxies.push(p);}
  this.questMarker=new T.Mesh(new T.RingGeometry(.85,1,24),new T.MeshBasicMaterial({color:0xf3d462,side:T.DoubleSide,transparent:true,opacity:.8}));this.questMarker.rotation.x=-Math.PI/2;this.root.add(this.questMarker);
  this.destinationMarker=new T.Mesh(new T.RingGeometry(.22,.32,4),new T.MeshBasicMaterial({color:0xffe29b,side:T.DoubleSide,depthWrite:false}));this.destinationMarker.rotation.x=-Math.PI/2;this.destinationMarker.visible=false;this.root.add(this.destinationMarker);
  this.ground=new T.Mesh(new T.PlaneGeometry(MAP_WIDTH,MAP_HEIGHT),new T.MeshBasicMaterial({visible:false}));this.ground.rotation.x=-Math.PI/2;this.ground.position.set((MAP_WIDTH-1)/2,.05,(MAP_HEIGHT-1)/2);this.root.add(this.ground);
 }
 blockArea(cx,cz,width,depth){for(let x=Math.ceil(cx-width/2);x<=Math.floor(cx+width/2);x++)for(let z=Math.ceil(cz-depth/2);z<=Math.floor(cz+depth/2);z++)this.blocked.add(`${x},${z}`);}
 bind(){
  const pointers=new Map();let gesture=null;
  this.canvas.addEventListener('pointerdown',e=>{if(e.button!==0)return;this.canvas.setPointerCapture(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pointers.size===1)gesture={x:e.clientX,y:e.clientY,lastX:e.clientX,moved:false};else if(pointers.size===2){gesture.moved=true;const [a,b]=[...pointers.values()];gesture.distance=Math.hypot(a.x-b.x,a.y-b.y);gesture.angle=Math.atan2(b.y-a.y,b.x-a.x);}});
  this.canvas.addEventListener('pointermove',e=>{
   if(pointers.has(e.pointerId)&&gesture){pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pointers.size===2){const [a,b]=[...pointers.values()],d=Math.hypot(a.x-b.x,a.y-b.y),angle=Math.atan2(b.y-a.y,b.x-a.x);if(!this.sequence){this.setZoom(this.zoom*(gesture.distance/Math.max(d,1)));this.yaw+=Math.atan2(Math.sin(angle-gesture.angle),Math.cos(angle-gesture.angle));}gesture.distance=d;gesture.angle=angle;}
    else{if(Math.hypot(e.clientX-gesture.x,e.clientY-gesture.y)>8)gesture.moved=true;if(gesture.moved&&!this.sequence)this.yaw-=(e.clientX-gesture.lastX)*.008;gesture.lastX=e.clientX;}if(gesture.moved)return;
   }this.hover(e);
  });
  const release=e=>{const click=gesture&&!gesture.moved&&pointers.size===1&&e.type==='pointerup';pointers.delete(e.pointerId);if(!pointers.size)gesture=null;if(click)this.pick(e);};
  this.canvas.addEventListener('pointerup',release);this.canvas.addEventListener('pointercancel',release);
  this.canvas.addEventListener('pointerleave',()=>{this.hovered=null;this.canvas.style.cursor='default';document.querySelector('#hoverHint').textContent='';});
  this.canvas.addEventListener('wheel',e=>{e.preventDefault();if(!this.sequence)this.setZoom(this.zoom+Math.sign(e.deltaY)*1.1);},{passive:false});
  this.canvas.addEventListener('contextmenu',e=>{e.preventDefault();this.pick(e,true);});
  this.canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();document.querySelector('#loading').style.display='grid';document.querySelector('#loading').textContent='Graphics paused. Reload to restore your saved quest.';});
  this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(this.canvas.parentElement);
 }
 setZoom(value){this.zoom=Math.max(11,Math.min(29,value));}
 markTarget(id){this.questTarget=id;const t=TARGETS[id];this.questMarker.visible=!!t;if(t)this.questMarker.position.set(t.x,.035,t.z);}
 hitTarget(){const actors=Object.values(this.actors).filter(a=>a!==this.player&&a.visible);for(const hit of this.ray.intersectObjects([...this.proxies,...actors],true)){let o=hit.object;if(o.userData.target)return o.userData.target;while(o&&!o.userData.name)o=o.parent;if(o?.userData.name)return this.actorTarget(o);}return null;}
 hover(e){const hint=document.querySelector('#hoverHint');if(this.dialogueActive){this.canvas.style.cursor=this.dialogueReady?'pointer':'default';hint.textContent='';return;}if(this.sequence||!this.state?.started){this.canvas.style.cursor='default';hint.textContent='';return;}const r=this.canvas.getBoundingClientRect();this.pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);this.ray.setFromCamera(this.pointer,this.camera);const id=this.hitTarget();this.hovered=id;if(id){this.canvas.style.cursor='pointer';hint.textContent=targetAction(id,this.state)+' · '+TARGETS[id].name;return;}const h=this.ray.intersectObject(this.ground)[0];const clear=h&&!this.blocked.has(Math.round(h.point.x)+','+Math.round(h.point.z));this.canvas.style.cursor=clear?'crosshair':'not-allowed';hint.textContent=clear?'Walk here':'You cannot walk here';}
 pick(e,secondary=false){if(this.dialogueActive)return;if(this.sequence||!this.state?.started)return;const r=this.canvas.getBoundingClientRect();this.pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);this.ray.setFromCamera(this.pointer,this.camera);const id=this.hitTarget();if(id){this.onTarget(id,secondary);return;}const h=this.ray.intersectObject(this.ground)[0];if(h)this.onGround({x:Math.round(h.point.x),z:Math.round(h.point.z)});}
 resize(){const w=this.canvas.clientWidth,h=this.canvas.clientHeight;if(!w||!h)return;this.renderer.setSize(w,h,false);this.camera.aspect=w/h;this.camera.updateProjectionMatrix();this.updateCamera();}
 updateCamera(){const distance=this.zoom/(2*Math.tan(T.MathUtils.degToRad(this.camera.fov/2)));this.camera.position.copy(this.focus).add(V(Math.sin(this.yaw)*Math.cos(this.pitch)*distance,Math.sin(this.pitch)*distance,Math.cos(this.yaw)*Math.cos(this.pitch)*distance));this.camera.lookAt(this.focus);}
 sync(s){this.state=s;this.reduced=s.settings.reducedMotion;this.player.position.set(s.playerPosition.x,0,s.playerPosition.z);this.player.rotation.y=s.facing;
  if(this.blocked.has(Math.round(s.playerPosition.x)+','+Math.round(s.playerPosition.z))){outer:for(let r=1;r<9;r++)for(let x=-r;x<=r;x++)for(let z=-r;z<=r;z++){const p={x:Math.round(s.playerPosition.x)+x,z:Math.round(s.playerPosition.z)+z};if(p.x>=0&&p.z>=0&&p.x<MAP_WIDTH&&p.z<MAP_HEIGHT&&!this.blocked.has(p.x+','+p.z)){this.player.position.set(p.x,0,p.z);break outer;}}}
  this.labels.find(l=>l.actor===this.player).text=s.handle;this.playerHat.visible=s.hatEquipped;this.displayHat.visible=!s.hatClaimed;if(this.seated)this.applySeatedPose();
 }
 focusOn(id){const t=typeof id==='string'?TARGETS[id]:id;if(t)this.desiredFocus.set(t.x,0,t.z);}
 go(point,pending=null){this.walk=findPath(this.player.position,point,this.blocked,MAP_WIDTH,MAP_HEIGHT);this.pending=pending;if(this.walk.length){this.destinationMarker.position.set(point.x,.035,point.z);this.destinationMarker.visible=true;}return !!this.walk.length;}
 approach(id,callback){this.walk=[];this.pending=null;const t=TARGETS[id];if(Math.hypot(this.player.position.x-t.x,this.player.position.z-t.z)<2.7){callback();return true;}const p=approachPath(this.player.position,t,this.blocked,MAP_WIDTH,MAP_HEIGHT);if(p===null){this.onArrive?.('That path is blocked. Choose a clear patch nearby.');return false;}this.walk=p;this.pending=callback;if(p.length){const end=p.at(-1);this.destinationMarker.position.set(end.x,.035,end.z);this.destinationMarker.visible=true;}if(!p.length){this.pending=null;callback();}return true;}
 stop(){this.walk=[];this.pending=null;if(this.destinationMarker)this.destinationMarker.visible=false;}
 setSpeaker(name){this.activeSpeaker=name;const actor=this.actors[name];if(actor&&actor!==this.player){const d=this.player.position.clone().sub(actor.position);if(d.length()<7)actor.rotation.y=Math.atan2(d.x,d.z);}}
 wait(seconds){return new Promise(resolve=>this.waiters.push({at:this.time+seconds,resolve}));}
 sit(){this.stop();this.seated={position:this.player.position.clone(),rotation:this.player.rotation.y};this.applySeatedPose();this.focusOn('bench');}
 applySeatedPose(){this.player.position.set(TARGETS.bench.x,-.3,TARGETS.bench.z);this.player.rotation.y=0;this.player.userData.legs.forEach(l=>l.rotation.x=-Math.PI/2);this.player.userData.arms.forEach(a=>a.rotation.x=-.2);}
 stand(){if(!this.seated)return;this.player.position.copy(this.seated.position);this.player.rotation.y=this.seated.rotation;this.seated=null;this.player.userData.legs.forEach(l=>l.rotation.x=0);this.player.userData.arms.forEach(a=>a.rotation.x=0);}
 celebrate(){this.bubble(this.player,'Happy birthday!',3);}
 bubble(actor,text,life=2.4,kind='effect'){const a=typeof actor==='string'?this.actors[actor]:actor;this.labels.push({actor:a??this.player,text,kind,expires:this.time+life});}
 animate(name,duration=1){this.stop();if(this.sequence)return Promise.resolve();const cameraBefore={zoom:this.zoom,yaw:this.yaw,pitch:this.pitch},snapshots=new Map();let update=()=>{},cleanup=()=>{};
  if(name==='family'){for(const [name,x,z]of [['Andrey',24,42],['Anya',25,42],['Alisa',25.8,42.4],['Arisha',26.5,42.4]]){const a=this.actors[name];snapshots.set(a,{p:a.position.clone(),r:a.rotation.clone()});a.position.set(x,0,z);a.rotation.y=0;}this.focusOn({x:25,z:43});this.setZoom(12);this.yaw=.05;}
  if(name.startsWith('discover-')){const id=name.slice(9);this.focusOn(id);this.setZoom(['tower','lookout'].includes(id)?22:13);update=t=>{if(!this.reduced)this.yaw=cameraBefore.yaw+Math.sin(t*Math.PI)*.15;if(id==='well')this.wellBucket.position.y=.95-Math.sin(t*Math.PI)*.55;};cleanup=()=>{this.wellBucket.position.y=.95;};}
  return new Promise(resolve=>{this.sequence={elapsed:0,duration:this.reduced?.12:duration,update,finish:()=>{cleanup();for(const [a,s]of snapshots){a.position.copy(s.p);a.rotation.copy(s.r);}this.zoom=cameraBefore.zoom;this.yaw=cameraBefore.yaw;this.pitch=cameraBefore.pitch;this.desiredFocus.copy(this.player.position);this.sequence=null;resolve();}};});
 }
 disposeGroup(g){g.traverse(o=>{o.geometry?.dispose();if(o.material&&!this.materials.has(o.material.color?.getHex())){if(o.material.map)o.material.map.dispose();o.material.dispose();}});}
 tick(dt){this.time+=dt;const ready=this.waiters.filter(waiter=>waiter.at<=this.time);this.waiters=this.waiters.filter(waiter=>waiter.at>this.time);for(const waiter of ready)waiter.resolve();if(this.sequence){const a=this.sequence;a.elapsed+=dt;const t=Math.min(1,a.elapsed/a.duration);a.update(t);if(t===1)a.finish();}if(this.walk.length&&!this.sequence){const p=this.walk[0],d=V(p.x,0,p.z).sub(this.player.position),len=d.length(),speed=5*dt;if(len<=speed){this.player.position.set(p.x,0,p.z);this.walk.shift();if(!this.walk.length){const cb=this.pending;this.pending=null;cb?.();}}else{this.player.position.addScaledVector(d,speed/len);this.player.rotation.y=Math.atan2(d.x,d.z);}if(!this.reduced){this.player.userData.legs.forEach((l,i)=>l.rotation.x=Math.sin(this.time*11+i*Math.PI)*.45);this.player.userData.arms.forEach((a,i)=>a.rotation.x=Math.sin(this.time*11-i*Math.PI)*.3);}this.desiredFocus.set(this.player.position.x,0,this.player.position.z);}else if(!this.sequence&&!this.seated){this.player.userData.legs.forEach(l=>l.rotation.x=0);this.player.userData.arms.forEach(a=>a.rotation.x=0);}
  if(this.seated)this.applySeatedPose();
  if(!this.sequence&&!this.reduced){for(const [name,a]of Object.entries(this.actors)){if(!a.userData.head||a===this.player&&(this.walk.length||this.seated))continue;const speaking=name===this.activeSpeaker;a.userData.head.rotation.x=speaking?Math.sin(this.time*7)*.045:Math.sin(this.time*1.5+a.id)*.012;if(a!==this.player)a.userData.arms[0].rotation.x=speaking?-.22-Math.sin(this.time*5)*.1:Math.sin(this.time*1.6+a.id)*.025;}}
  this.destinationMarker.visible=!!this.walk.length;this.destinationMarker.rotation.z=this.time*.7;
  if(this.boat&&!this.reduced)this.boat.rotation.z=Math.sin(this.time*.7)*.025;
  if(!this.reduced)for(const [i,r]of (this.waterRipples??[]).entries()){const t=(this.time*.17+i*.21)%1;r.scale.setScalar(.5+t*2);r.material.opacity=(1-t)*.2;}
  this.focus.lerp(this.desiredFocus,this.reduced?1:1-Math.exp(-dt*5));this.updateCamera();this.updateOcclusion();this.labels=this.labels.filter(l=>!l.expires||l.expires>this.time);this.renderer.render(this.scene,this.camera);
 }
 updateOcclusion(){
  if(this.time<(this.occlusionAt??0))return;this.occlusionAt=this.time+.15;
  this.occlusionRay??=new T.Raycaster();const faded=new Set(),points=[this.player];
  const speaker=this.actors[this.activeSpeaker];if(speaker&&speaker!==this.player&&speaker.position.distanceTo(this.player.position)<10)points.push(speaker);
  if(!this.sequence&&this.root.visible)for(const actor of points){const point=actor.position.clone().add(V(0,1.3,0)),d=point.clone().sub(this.camera.position);this.occlusionRay.set(this.camera.position,d.clone().normalize());this.occlusionRay.far=d.length();for(const hit of this.occlusionRay.intersectObjects(this.occluders,true)){let o=hit.object;while(o&&!this.occluders.includes(o))o=o.parent;if(o)faded.add(o);}}
  for(const group of this.occluders)group.traverse(o=>{if(!o.isMesh)return;if(!o.userData.fadeMaterial){o.material=o.material.clone();o.userData.fadeMaterial=true;}o.material.transparent=true;o.material.opacity=faded.has(group)?.2:1;o.material.depthWrite=!faded.has(group);});
 }
 drawLabels(container){const r=this.canvas.getBoundingClientRect(),occupied=[];container.replaceChildren();const list=[...this.labels].sort((a,b)=>(a.kind==='actor')-(b.kind==='actor'));for(const l of list){if(!l.actor?.visible||!this.root.visible)continue;const near=l.actor.position.distanceTo(this.player.position)<3.3,spoken=l.actor.userData.name===this.activeSpeaker;if(l.kind==='actor'&&l.actor!==this.player&&!near&&!spoken&&!(this.hovered&&this.actorTarget(l.actor)===this.hovered))continue;const p=l.actor.getWorldPosition(V());p.y+=(l.kind==='actor'?2.25:2.8)*(l.actor.userData.height??1);p.project(this.camera);if(p.x<-.95||p.x>.95||p.y<-.95||p.y>.98||p.z>1)continue;const x=(p.x+1)*r.width/2;let y=(1-p.y)*r.height/2;for(let i=0;i<3&&occupied.some(q=>Math.abs(q.x-x)<60&&Math.abs(q.y-y)<16);i++)y-=17;occupied.push({x,y});const el=document.createElement('span');el.className='overhead '+l.kind+(l.actor===this.player?' player':'');el.textContent=l.text;el.style.left=x+'px';el.style.top=y+'px';container.append(el);}}
 actorTarget(actor){return ({Banker:'bank',Keeper:'park',Vendor:'fries',Victor:'bank',Danya:'house',Alex:'alex',Igor:'football',Anya:'photo',Alisa:'alisa',Arisha:'arisha',Robot:'photo'})[actor.userData.name]??'bank';}
 drawMap(canvas){const ctx=canvas.getContext('2d'),sx=canvas.width/MAP_WIDTH,sz=canvas.height/MAP_HEIGHT;ctx.imageSmoothingEnabled=false;ctx.drawImage(this.mapTexture,0,0,canvas.width,canvas.height);for(const [id,t]of Object.entries(TARGETS)){ctx.fillStyle=id===this.questTarget?'#ffe373':(this.state.discoveries??[]).includes(id)?'#a3d38d':'#e5d4ab';ctx.fillRect(t.x*sx-1.5,t.z*sz-1.5,id===this.questTarget?5:3,id===this.questTarget?5:3);}const p=this.player.position;ctx.fillStyle='#fff9df';ctx.beginPath();ctx.arc(p.x*sx,p.z*sz,3,0,Math.PI*2);ctx.fill();const direction=this.player.rotation.y;ctx.strokeStyle='#fff9df';ctx.beginPath();ctx.moveTo(p.x*sx,p.z*sz);ctx.lineTo(p.x*sx+Math.sin(direction)*7,p.z*sz+Math.cos(direction)*7);ctx.stroke();}
 photo(recipe){
  const sharedGeometry=new Set(),sharedMaterial=new Set();this.scene.traverse(o=>{if(o.geometry)sharedGeometry.add(o.geometry);if(o.material)sharedMaterial.add(o.material);});
  const scene=new T.Scene();scene.background=new T.Color(0xa3b2a0);scene.add(new T.AmbientLight(0xffffff,1.9));const light=new T.DirectionalLight(0xffeed4,1.7);light.position.set(-3,6,8);scene.add(light);
  const group=this.group(scene);this.box(group,0,-.1,0,90,.2,90,0x718253);this.box(group,0,-.015,-7,60,.1,10,0x608996);this.box(group,0,-.01,-2.5,30,.1,1.1,0xb0a17b);
  for(const [x,z]of [[-7,-4],[7,-4],[-10,-1]]){const trunk=this.group(group,x,0,z);this.cyl(trunk,0,1,0,.2,2,0x62482e,5);this.sphere(trunk,0,2.7,0,1.35,0x536d39,1);}
  const clones=[];for(const [name,x,z]of [['Andrey',-1.05,0],['Anya',0,0],['Alisa',.75,.35],['Arisha',1.35,.35],['Victor',-2.4,-1.3],['Danya',2.5,-1.3],['Alex',-3.5,-1.6],['Igor',3.5,-1.6]]){
   const actor=this.actors[name].clone(true);actor.position.set(x,0,z);actor.rotation.set(0,0,0);actor.visible=true;actor.traverse(o=>{if(o.isGroup)o.rotation.set(0,0,0);if(o.name==='birthday-hat')o.visible=false;});actor.userData={};group.add(actor);clones.push(actor);
  }
  const robot=this.buildRobot(group,4.4,-.8);robot.visible=false;
  const camera=new T.PerspectiveCamera(45,1.6,.1,120);camera.position.set(0,recipe==='zoom'?12:3,recipe==='zoom'?36:10);camera.lookAt(0,1,recipe==='robot'?3:0);
  const target=new T.WebGLRenderTarget(800,500),old=this.renderer.getRenderTarget();
  try{
   this.renderer.setRenderTarget(target);this.renderer.render(scene,camera);const bytes=new Uint8Array(800*500*4);this.renderer.readRenderTargetPixels(target,0,0,800,500,bytes);
   const c=document.createElement('canvas');c.width=800;c.height=500;const ctx=c.getContext('2d'),data=ctx.createImageData(800,500);for(let y=0;y<500;y++)data.data.set(bytes.subarray((499-y)*800*4,(500-y)*800*4),y*800*4);ctx.putImageData(data,0,0);return c.toDataURL('image/png');
  }finally{
   this.renderer.setRenderTarget(old);target.dispose();const cachedMaterials=new Set(this.materials.values());scene.traverse(o=>{if(o.geometry&&!sharedGeometry.has(o.geometry))o.geometry.dispose();if(o.material&&!sharedMaterial.has(o.material)&&!cachedMaterials.has(o.material))o.material.dispose();});
  }
 }
}



