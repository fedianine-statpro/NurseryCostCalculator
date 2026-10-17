import * as T from '../vendor/three.module.js';
import {MAP_WIDTH,MAP_HEIGHT,TARGETS,terrainAt} from './map-data.js';
const noise=(x,z)=>{const n=Math.sin(x*127.1+z*311.7)*43758.5453;return n-Math.floor(n);};
const palette={grass:0x677c3e,forest:0x536c37,path:0xa58f61,sand:0xb0a17b,water:0x547e89,bridge:0x8d7150,cobble:0x8e8c7a};
export function buildTerrain(w){
 const positions=[],colors=[],map=document.createElement('canvas');map.width=MAP_WIDTH;map.height=MAP_HEIGHT;const ctx=map.getContext('2d');
 const colorAt=(x,z)=>new T.Color(palette[terrainAt(Math.round(x),Math.round(z))]).multiplyScalar(.94+Math.sin(x*.32)*Math.cos(z*.25)*.06+noise(Math.floor(x/3),Math.floor(z/3))*.045);
 for(let z=0;z<MAP_HEIGHT;z++)for(let x=0;x<MAP_WIDTH;x++){
  const type=terrainAt(x,z),c=colorAt(x,z);ctx.fillStyle='#'+c.getHexString();ctx.fillRect(x,z,1,1);if(type==='water')w.blocked.add(x+','+z);
  for(const [dx,dz]of [[-.5,-.5],[-.5,.5],[.5,-.5],[.5,-.5],[-.5,.5],[.5,.5]]){
   positions.push(x+dx,type==='water'?-.06:0,z+dz);const shade=c.clone().multiplyScalar(1+noise(x+dx,z+dz)*.025);colors.push(shade.r,shade.g,shade.b);
  }
 }
 const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(positions,3));geo.setAttribute('color',new T.Float32BufferAttribute(colors,3));geo.computeVertexNormals();const uv=[];for(let n=0;n<positions.length;n+=3)uv.push(positions[n]/MAP_WIDTH,positions[n+2]/MAP_HEIGHT);geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));
 const grain=document.createElement('canvas');grain.width=grain.height=64;const pixels=grain.getContext('2d');pixels.fillStyle='#eeeeee';pixels.fillRect(0,0,64,64);for(let n=0;n<1200;n++){pixels.fillStyle=n%3?'#0000000a':'#ffffff16';pixels.fillRect(Math.floor(noise(n,1)*64),Math.floor(noise(n,2)*64),1,1);}const texture=new T.CanvasTexture(grain);texture.wrapS=texture.wrapT=T.RepeatWrapping;texture.repeat.set(16,16);texture.magFilter=T.NearestFilter;texture.colorSpace=T.SRGBColorSpace;
 w.root.add(new T.Mesh(geo,new T.MeshLambertMaterial({vertexColors:true,map:texture})));w.mapTexture=map;
 // Large surroundings keep the edge of the navigable village out of ordinary views.
 w.box(w.root,31.5,-.25,31.5,180,.3,180,0x586d3b);
}
function texturedMaterial(w,type){
 w.surfaceMaterials??={};if(w.surfaceMaterials[type])return w.surfaceMaterials[type];
 const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d');g.fillStyle=type==='stone'?'#a49f85':'#8c6741';g.fillRect(0,0,64,64);
 for(let y=0;y<64;y++)for(let x=0;x<64;x++){const n=noise(x,y);if(n>.68){g.fillStyle=n>.88?'#ffffff16':'#00000013';g.fillRect(x,y,1,1);}}
 g.strokeStyle=type==='stone'?'#625f4c':'#4c3827';g.lineWidth=1;
 if(type==='stone'){for(let y=0;y<64;y+=16){g.beginPath();g.moveTo(0,y);g.lineTo(64,y);g.stroke();for(let x=(y%32?0:16);x<64;x+=32){g.beginPath();g.moveTo(x,y);g.lineTo(x,y+16);g.stroke();}}}else{for(let x=4;x<64;x+=12){g.beginPath();g.moveTo(x,0);g.lineTo(x,64);g.stroke();}}
 const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;texture.magFilter=T.NearestFilter;texture.minFilter=T.NearestFilter;
 return w.surfaceMaterials[type]=new T.MeshLambertMaterial({map:texture,flatShading:true});
}
export function stone(w,parent,x,y,z,width,height,depth){const m=w.box(parent,x,y,z,width,height,depth,0xa49e86);m.material=texturedMaterial(w,'stone');if(height>1.8||y>2.3&&width>2)m.userData.occluder=true;return m;}
export function wood(w,parent,x,y,z,width,height,depth){const m=w.box(parent,x,y,z,width,height,depth,0x8c6741);m.material=texturedMaterial(w,'wood');return m;}
export function tree(w,parent,x,z,size=1,pine=false){
 const g=w.group(parent,x,0,z);g.scale.setScalar(size);w.cyl(g,0,1.05,0,.2,2.1,0x62482e,5);
 if(pine){for(let i=0;i<3;i++){const m=new T.Mesh(new T.ConeGeometry(1.25-i*.24,1.7,7),w.mat([0x3c5931,0x496338,0x55703d][i]));m.position.y=1.8+i*.75;g.add(m);}}
 else{for(const [dx,y,dz,r,col]of [[0,2.7,0,1.15,0x516935],[-.65,2.2,.25,.85,0x627c3b],[.6,2.35,-.1,.88,0x58723a]]){const m=w.sphere(g,dx,y,dz,r,col,1);m.scale.y=.78;}const branch=w.cyl(g,.32,1.6,0,.09,1.2,0x62482e,5);branch.rotation.z=-.7;}
 g.userData.occluder=true;return g;
}
export function enhanceScenery(w){
 const g=w.environment;
 const fence=(x,z,length,axis='x')=>{for(let n=0;n<=length;n+=1.5)wood(w,g,x+(axis==='x'?n:0),.5,z+(axis==='z'?n:0),.12,1,.12);for(const y of [.35,.75])wood(w,g,x+(axis==='x'?length/2:0),y,z+(axis==='z'?length/2:0),axis==='x'?length:.08,.1,axis==='z'?length:.08);};
 for(let i=0;i<25;i++)tree(w,g,-8+i*2.7,-5-noise(i,9)*6,1.3+noise(i,4)*.6,i%3!==0);
 for(let i=0;i<20;i++)tree(w,g,-3-noise(i,19)*5,6+i*3,1.3+noise(i,14)*.5,i%3===0);
 for(let i=0;i<12;i++){const h=w.sphere(g,-18+i*9,2,-23-noise(i,6)*8,5+noise(i,5)*4,0x647c55,1);h.scale.set(1.8,.7,1.2);}
 // Cluster vegetation between paths; clear approaches and building entrances are deliberate.
 for(let i=0;i<160;i++){
  const x=2+Math.floor(noise(i,33)*48),z=2+Math.floor(noise(i,81)*58),type=terrainAt(x,z);
  if(!['grass','forest'].includes(type)||Object.values(TARGETS).some(t=>Math.hypot(t.x-x,t.z-z)<2.5))continue;
  if([-1,0,1].some(dx=>[-1,0,1].some(dz=>w.blocked.has((x+dx)+','+(z+dz)))))continue;
  const t=tree(w,g,x,z,.85+noise(i,5)*.65,type==='forest'&&i%3!==0);t.userData.occluder=true;w.blockArea(x,z,1,1);
 }
 fence(4,24,2);fence(4,24,4,'z');fence(11,24,3);fence(16,28,3);fence(16,32,3);
 fence(2,37,5,'z');fence(3,11,3);fence(21,13,4);fence(27,39,3,'z');
 // Stone path edging, flower beds and modest village clutter give each district a scale.
 for(const [cx,cz]of [[9,12],[9,18],[9,24],[20,29],[24,37],[24,48]])for(const side of [-1,1])for(let i=0;i<4;i++){const m=w.sphere(g,cx+side*1.25,.1,cz+i*.6,.15,0x90917d);m.scale.y=.55;}
 for(let i=0;i<700;i++){
  const x=1+noise(i,3)*60,z=1+noise(i,8)*60,type=terrainAt(x,z);
  if(w.blocked.has(Math.round(x)+','+Math.round(z))||Object.values(TARGETS).some(t=>Math.hypot(t.x-x,t.z-z)<1.5))continue;
  if(type==='grass'||type==='forest'){const flower=noise(i,12)>.7;w.box(g,x,.11,z,.035,.22,.035,0x526c32);if(flower)w.sphere(g,x,.24,z,.065,[0xc6bb7d,0xb697ac,0xd8cfac][i%3]);}
  if(type==='sand')for(let n=0;n<3;n++){const reed=w.box(g,x+n*.12,.36,z,.045,.72,.045,0x87915a);reed.rotation.z=(n-1)*.12;}
  if(type==='water'&&noise(i,15)>.5){const line=w.box(g,x,-.035,z,.3+noise(i,2)*.9,.008,.035,0x759b9d);line.rotation.y=.2;}
 }
 for(const [x,z]of [[4,12],[12,18],[18,33],[22,39],[26,48],[34,22],[41,34]]){
  const patch=w.group(g,x,0,z);for(let i=0;i<5;i++){const m=w.sphere(patch,(i%3)*.26,.18,Math.floor(i/3)*.27,.22,0x697b47);m.scale.y=.7;}
 }
 for(const [x,z]of [[3.5,12],[5,18],[10.8,29.5],[14,32],[21.6,43],[24.5,50.5]]){w.cyl(g,x,.2,z,.25,.4,0x956c4c,6);w.sphere(g,x,.5,z,.34,0x768b44);for(let n=0;n<4;n++)w.sphere(g,x+Math.sin(n*2)*.2,.65,z+Math.cos(n*2)*.2,.08,0xd5bfa0);}
 for(const [x,z]of [[18,25],[21,35],[26,54],[36,33],[46,38]])for(let n=0;n<3;n++){const m=w.sphere(g,x+n*.4,.16,z+Math.sin(n)*.5,.3,0x8b8c77);m.scale.y=.6;}
 w.waterRipples=[];for(const [x,z]of [[30,44],[31,48],[32,35],[34,30],[30,18]]){const ring=new T.Mesh(new T.RingGeometry(.7,.73,24),new T.MeshBasicMaterial({color:0xa5c4bc,side:T.DoubleSide,transparent:true,opacity:.25,depthWrite:false}));ring.position.set(x,-.025,z);ring.rotation.x=-Math.PI/2;w.root.add(ring);w.waterRipples.push(ring);}
 batchScenery(g,[]);
}
function batchScenery(group,exclude){
 group.updateMatrixWorld(true);const buckets=new Map();
 group.traverse(o=>{if(!o.isMesh)return;let p=o;while(p&&p!==group){if(exclude.includes(p)||p.userData.occluder)return;p=p.parent;}const list=buckets.get(o.material)??[];list.push(o);buckets.set(o.material,list);});
 for(const [material,meshes]of buckets){if(meshes.length<2)continue;const pos=[],normal=[],uv=[];for(const mesh of meshes){const source=mesh.geometry.index?mesh.geometry.toNonIndexed():mesh.geometry.clone();source.applyMatrix4(mesh.matrixWorld);pos.push(...source.attributes.position.array);if(source.attributes.normal)normal.push(...source.attributes.normal.array);if(source.attributes.uv)uv.push(...source.attributes.uv.array);source.dispose();mesh.removeFromParent();mesh.geometry.dispose();}const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(pos,3));if(normal.length===pos.length)geometry.setAttribute('normal',new T.Float32BufferAttribute(normal,3));else geometry.computeVertexNormals();if(uv.length/2===pos.length/3)geometry.setAttribute('uv',new T.Float32BufferAttribute(uv,2));group.add(new T.Mesh(geometry,material));}
}

