import * as T from '../vendor/three.module.js';
import {CONFIG} from './config.js';

// Original, jointed low-poly characters. Appearance data also drives temporary portraits.
export function makeHuman(w,name,x,z,options={}){
 const a={shirt:0x857451,pants:0x5a5141,hair:0x514330,skin:0xc49c77,height:1,...CONFIG.appearances[name],...options};
 const g=w.group(w.root,x,0,z);g.scale.setScalar(a.height);const body=w.group(g,0,.85,0);
 const torso=new T.Mesh(new T.CylinderGeometry(.32,.24,.66,6),w.mat(a.shirt));torso.scale.z=.69;torso.position.y=.37;body.add(torso);
 w.box(body,0,.64,.01,.64,.15,.35,a.shirt);w.cyl(body,0,.79,0,.095,.19,a.skin,5);
 // A faceted jaw and shaped hair replace the sphere-and-cap construction.
 const head=w.group(body,0,1.02,0),face=w.cyl(head,0,0,0,.235,.41,a.skin,6);face.scale.z=.87;face.rotation.y=Math.PI/6;
 w.box(head,0,-.035,.205,.075,.095,.08,a.skin);w.box(head,0,-.115,.184,.1,.015,.012,0x81533b);
 for(const side of [-1,1]){w.box(head,side*.09,.04,.187,.035,.027,.012,a.eyes??0x343027);w.box(head,side*.088,.09,.18,.075,.025,.015,a.hair);}
 const hair=w.cyl(head,0,.2,-.015,.25,.16,a.hair,6);hair.scale.z=.9;
 const style=a.style??name;
 if(['Andrey','Alex','Banker'].includes(style)){const sweep=w.box(head,-.055,.24,.06,.34,.12,.28,a.hair);sweep.rotation.z=-.14;}
 if(['Victor','Igor'].includes(style)){w.box(head,.12,.16,.04,.11,.16,.29,a.hair);}
 if(style==='Danya'){for(let i=0;i<3;i++)w.sphere(head,-.14+i*.14,.27,0,.12,a.hair);}
 if(a.longHair){w.box(head,0,-.03,-.17,.43,.62,.14,a.hair);for(const side of [-1,1])w.box(head,side*.23,-.1,0,.09,.45,.19,a.hair);}
 if(a.ponytail){w.sphere(head,0,-.12,-.23,.13,a.hair);const tail=w.cyl(head,0,-.3,-.26,.085,.3,a.hair,5);tail.rotation.x=.25;}
 if(a.beard){const beard=new T.Mesh(new T.ConeGeometry(.235,.42,6),w.mat(a.hair));beard.rotation.z=Math.PI;beard.scale.z=.58;beard.position.set(0,-.23,.12);head.add(beard);w.box(head,0,-.095,.25,.12,.06,.025,a.skin);w.box(head,0,-.065,.266,.17,.035,.02,a.hair);w.box(head,0,-.11,.269,.1,.018,.015,0x81533b);}
 if(a.goatee){w.box(head,0,-.17,.19,.09,.07,.03,a.hair);w.box(head,0,-.085,.232,.11,.018,.02,a.hair);}
 const belt=w.cyl(body,0,.02,0,.26,.09,0x59462e,6);belt.scale.z=.7;w.box(body,0,.02,.185,.1,.08,.04,0xb49b56);
 const arms=[];for(const side of [-1,1]){const arm=w.group(body,side*.35,.65,0);const upper=w.cyl(arm,0,-.16,0,.115,.34,a.shirt,5);upper.rotation.z=side*.08;w.cyl(arm,side*.02,-.44,0,.08,.25,a.skin,5);w.box(arm,side*.02,-.6,.015,.14,.17,.14,a.skin);arms.push(arm);}
 const legs=[];for(const side of [-1,1]){const leg=w.group(g,side*.145,.85,0);w.cyl(leg,0,-.2,0,.125,.4,a.pants,5);w.cyl(leg,0,-.52,0,.095,.28,a.pants,5);w.box(leg,0,-.75,.055,.22,.23,.35,0x44372b);legs.push(leg);}
 if(['Banker','Keeper'].includes(style)){const collar=w.cyl(body,0,.7,0,.2,.07,0xc5b88b,6);collar.scale.z=.75;}
 if(style==='Banker'){w.box(body,0,.35,.235,.06,.53,.025,0x342d22);for(const y of [.18,.36,.54])w.box(body,.1,y,.24,.035,.035,.015,0xd6ba68);}
 if(style==='Vendor'){w.box(body,0,.21,.235,.42,.57,.025,0xc3b792);w.box(body,0,.19,.26,.25,.15,.02,0xa69b7a);}
 if(style==='Victor')w.box(body,0,.49,.24,.15,.25,.035,0xbda575);
 if(style==='Alex'){w.box(body,0,.5,.25,.1,.29,.025,0xc8c0a0);w.box(body,0,.59,.25,.3,.06,.025,0xc8c0a0);}
 if(style==='Igor')for(const side of [-1,1])w.box(body,side*.2,.4,.22,.055,.53,.035,0xcbb58c);
 const shadow=new T.Mesh(new T.CircleGeometry(.39,10),new T.MeshBasicMaterial({color:0x26341e,transparent:true,opacity:.22,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.y=.012;g.add(shadow);
 for(const joint of [body,head,...arms,...legs])batchParts(joint);
 g.userData={name,height:a.height,body,head,arms,legs,shadow};w.actors[name]=g;w.label(g,name);return g;
}
function batchParts(parent){
 const groups=new Map();for(const m of parent.children.filter(o=>o.isMesh)){const list=groups.get(m.material)??[];list.push(m);groups.set(m.material,list);}
 for(const [material,meshes]of groups){if(meshes.length<2)continue;const positions=[],normals=[];for(const m of meshes){m.updateMatrix();const geometry=m.geometry.index?m.geometry.toNonIndexed():m.geometry.clone();geometry.applyMatrix4(m.matrix);positions.push(...geometry.attributes.position.array);normals.push(...geometry.attributes.normal.array);geometry.dispose();m.geometry.dispose();parent.remove(m);}const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.setAttribute('normal',new T.Float32BufferAttribute(normals,3));parent.add(new T.Mesh(geometry,material));}
}
