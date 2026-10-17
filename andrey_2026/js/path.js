import {MAP_WIDTH,MAP_HEIGHT} from './map-data.js';
export function findPath(start,end,blocked,width=MAP_WIDTH,height=MAP_HEIGHT){
 const key=(x,z)=>`${x},${z}`;const sx=Math.round(start.x),sz=Math.round(start.z),ex=Math.round(end.x),ez=Math.round(end.z);
 if(ex<0||ez<0||ex>=width||ez>=height||blocked.has(key(ex,ez)))return [];
 const queue=[[sx,sz]],parents=new Map([[key(sx,sz),null]]);let i=0;
 while(i<queue.length){const [x,z]=queue[i++];if(x===ex&&z===ez){const out=[];let k=key(x,z);while(parents.get(k)!==null){out.push(k.split(',').map(Number));k=parents.get(k);}return out.reverse().map(([x,z])=>({x,z}));}for(const [dx,dz] of [[0,1],[1,0],[0,-1],[-1,0]]){const nx=x+dx,nz=z+dz,k=key(nx,nz);if(nx<0||nz<0||nx>=width||nz>=height||blocked.has(k)||parents.has(k))continue;parents.set(k,key(x,z));queue.push([nx,nz]);}}
 return [];
}
export function approachPath(start,target,blocked,width=MAP_WIDTH,height=MAP_HEIGHT){
 for(let r=1;r<=4;r++){
  const candidates=[];
  for(let dx=-r;dx<=r;dx++)for(let dz=-r;dz<=r;dz++){
   if(Math.max(Math.abs(dx),Math.abs(dz))!==r)continue;
   const p={x:Math.round(target.x)+dx,z:Math.round(target.z)+dz};
   if(p.x<0||p.z<0||p.x>=width||p.z>=height||blocked.has(`${p.x},${p.z}`))continue;
   const path=findPath(start,p,blocked,width,height);
   if(path.length||Math.hypot(start.x-p.x,start.z-p.z)<.8)candidates.push(path);
  }
  if(candidates.length)return candidates.sort((a,b)=>a.length-b.length)[0];
 }
 return null;
}
