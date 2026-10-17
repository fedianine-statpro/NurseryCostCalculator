import * as T from '../vendor/three.module.js';
import {stone,wood,tree} from './scenery.js';
export function buildVillage(w){
 const g=w.group(w.root);w.environment=g;
 const cottage=(x,z,color=0xb6aa88,roofColor=0x805b44,width=4,depth=3.6)=>{
  const c=w.group(g,x,0,z);c.userData.occluder=true;
  w.box(c,0,1.35,0,width,2.7,depth,color);stone(w,c,0,.25,0,width+.2,.5,depth+.2);
  for(const side of [-1,1]){const r=w.box(c,side*width*.25,3.05,0,width*.64,.2,depth+.8,roofColor);r.rotation.z=side*.58;}
  for(const px of [-width*.46,width*.46])wood(w,c,px,1.4,depth/2+.03,.13,2.7,.12);
  wood(w,c,0,2.5,depth/2+.04,width,.14,.12);wood(w,c,0,.85,depth/2+.08,.78,1.7,.13);
  w.box(c,-width*.29,1.6,depth/2+.08,.65,.7,.1,0x536c69);wood(w,c,-width*.29,1.6,depth/2+.15,.04,.73,.04);
  stone(w,c,width*.28,3.2,-.6,.5,1.8,.5);w.blockArea(x,z,width,depth);return c;
 };
 const barrel=(x,z)=>{w.cyl(g,x,.45,z,.35,.9,0x795a36,8);for(const y of [.16,.7])w.cyl(g,x,y,z,.36,.075,0x4e5243,8);};
 const crate=(x,z)=>{wood(w,g,x,.34,z,.65,.68,.65);for(const y of [.1,.58])wood(w,g,x,y,z+.33,.68,.06,.05);const brace=wood(w,g,x,.34,z+.34,.06,.75,.04);brace.rotation.z=.75;};
 const lamp=(x,z)=>{wood(w,g,x,1.3,z,.12,2.6,.12);w.box(g,x,2.55,z,.4,.5,.4,0x5e654d);w.box(g,x,2.57,z+.21,.25,.3,.025,0xf1d08d);};
 const bank=w.group(g,9,0,5.8);bank.userData.occluder=true;
 stone(w,bank,0,1.8,-1.7,8,3.6,.6);for(const x of [-3.8,3.8])stone(w,bank,x,1.65,0,.6,3.3,4);
 stone(w,bank,0,3.65,0,8.6,.4,4.7);for(let i=0;i<8;i++)stone(w,bank,-3.7+i*1.05,4,-1.6,.55,.4,.65);
 wood(w,bank,0,1,1.6,6,.3,.8);w.blockArea(9,5.8,8,4);w.sign('BANK OF BIRTHDAYS',9,8.05,5,undefined,3.3);
 w.box(g,10.4,.7,8.6,1.3,1.4,.8,0x6c5b3d);w.displayHat=w.hat(w.root);w.displayHat.position.set(10.4,1.65,8.6);
 const glass=new T.Mesh(new T.BoxGeometry(1.3,1.1,.8),new T.MeshBasicMaterial({color:0xc7e1da,transparent:true,opacity:.12,wireframe:true}));glass.position.set(10.4,1.9,8.6);g.add(glass);
 w.sign('FREAKYBAT · 195',5.4,9,2.8,undefined,1.8);wood(w,g,5.4,.85,9,.13,1.7,.13);
 for(const [x,z]of [[4,7],[13.5,7],[5,11],[13.5,11]])lamp(x,z);
 w.stall=w.group(g,7,0,15.5);wood(w,w.stall,0,.65,0,3,1.3,1.5);for(const x of [-1.45,1.45])wood(w,w.stall,x,1.5,0,.13,3,.13);
 for(let i=0;i<8;i++)w.box(w.stall,-1.4+i*.4,3,0,.39,.12,2.4,i%2?0xc9b98b:0x6d7951);
 w.sign('CENTERPOINT FRIES',7,16.55,3.4,undefined,2.4);w.blockArea(7,15.5,3,1);
 for(let i=0;i<12;i++)w.box(w.stall,-.8+(i%6)*.25,1.4,.4+Math.floor(i/6)*.2,.12,.3,.12,0xe1bc62);
 for(const [x,z]of [[4.5,15],[4.4,17],[11,16],[5,27],[11,26],[38,29]])barrel(x,z);
 for(const [x,z]of [[10,15],[11,15],[5,28],[12,27],[36,29],[39,30]])crate(x,z);
 cottage(3,19,0xb3a27f,0x7a5841,3,3);cottage(15,13,0xa99b7a,0x65766a,4,4);
 w.house=cottage(8,26.8,0xbdb08c,0x855c41,4.4,4);w.sign('DANYA’S',8,29.5,2,undefined,2.5);
 cottage(3,34,0xb4a37f,0x706349,3.4,3.5);cottage(13,35,0xa4a17f,0x766050,3.2,3);
 for(const x of [21.6,24.4])stone(w,g,x,1.25,16,.45,2.5,.65);wood(w,g,23,2.6,16,3.5,.25,.7);w.sign('G. ROSS PARK',23,16.45,3,undefined,2.3);
 w.sign('RAID REGISTRATION',25,18,2.6,undefined,1.3);wood(w,g,25,.5,18,1.5,1,1);
 for(const [name,x,z]of [['Andrey',9,13],['Banker',8,8.7],['Victor',11.5,11],['Vendor',7,17],['Danya',8,30],['Alex',12,32],['Igor',13,21],['Keeper',23,18],['Anya',25,43],['Alisa',22,41],['Arisha',27,46]])w.human(name,x,z);
 w.player=w.actors.Andrey;w.playerHat=w.hat(w.player);w.playerHat.name='birthday-hat';w.playerHat.visible=false;
 w.robot=w.buildRobot(w.root,23.5,45);w.robot.userData.name='Robot';w.actors.Robot=w.robot;w.label(w.robot,'Photographer');w.tripod=w.cameraModel(w.root,25,1.2,46.5);w.tripod.rotation.y=Math.PI;
 w.picnic=w.group(g,23,0,49);wood(w,w.picnic,0,.9,0,3.2,.18,1.5);for(const x of [-1.2,1.2])wood(w,w.picnic,x,.45,0,.18,.9,1.2);for(const z of [-1,1])wood(w,w.picnic,0,.5,z,3.4,.15,.4);
 for(const x of [-.9,0,.9])w.cyl(w.picnic,x,1.02,0,.22,.03,0xd4c9a9,12);w.cyl(w.picnic,.45,1.15,.2,.3,.26,0xd3ae72,12);for(let i=0;i<5;i++)w.box(w.picnic,.25+i*.1,1.4,.2,.035,.22,.035,0xe5d6a5);
 w.sign('BIRTHDAY PICNIC',23,50.3,3.2,undefined,1.8);w.blockArea(23,49,3,1);
 w.bench=w.group(g,20,0,38);wood(w,w.bench,0,.55,0,2,.15,.65);wood(w,w.bench,0,1,-.3,2,.7,.1);for(const x of [-.75,.75])wood(w,w.bench,x,.25,0,.12,.5,.5);
 w.sign('SANTEE · BASE CAMP',17,36,2.6);w.sign('THE SHORE →',20,34,2.5);w.sign('← SOUTH VILLAGE',21,27,2.8);
 w.ball=w.sphere(w.root,13,.25,22,.27,0xe2dcca);for(const x of [11,15])wood(w,g,x,.9,24,.12,1.8,.12);wood(w,g,13,1.8,24,4.1,.12,.12);for(let i=0;i<8;i++)w.box(g,11+i*.55,.02,19,.35,.025,.06,0xc4b98b);
 w.sign('MYKONOS',37,28,2,undefined,1.2);
 w.penguin=w.group(g,28,0,35);w.sphere(w.penguin,0,.48,0,.42,0x313d36).scale.set(.8,1.3,.7);w.sphere(w.penguin,0,.48,.19,.25,0xd7d5b9);w.sphere(w.penguin,0,.95,0,.23,0x313d36);w.box(w.penguin,0,.9,.25,.13,.1,.2,0xc39c4d);for(const side of [-1,1])w.box(w.penguin,side*.16,.04,.1,.18,.08,.3,0xc39c4d);
 w.cyl(g,6,.45,25,.8,.9,0x8a8979,8);w.cyl(g,6,.92,25,.57,.05,0x303b38,8);w.blockArea(6,25,1,1);
 for(const x of [5.3,6.7])wood(w,g,x,1.15,25,.12,2.3,.12);wood(w,g,6,2.25,25,2,.16,1.6);wood(w,g,6,1.5,25,1.5,.12,.12);
 w.wellBucket=w.group(w.root,6,.95,25);w.cyl(w.wellBucket,0,0,0,.18,.3,0x806847,6);w.cyl(w.wellBucket,0,.35,0,.018,.55,0xc1ae7b,4);
 for(const x of [28,30,32])for(const z of [24.7,26.3])wood(w,g,x,.65,z,.13,1.3,.13);for(const z of [24.7,26.3])wood(w,g,30,1.1,z,6,.12,.12);
 for(let i=0;i<12;i++)wood(w,g,37,.16,28+i*.3,2,.18,.27);
 w.boat=w.group(w.root,38.5,.05,31);wood(w,w.boat,0,0,0,.9,.16,2.4);for(const side of [-1,1])wood(w,w.boat,side*.44,.22,0,.1,.4,2.3);for(const z of [-.7,.6])wood(w,w.boat,0,.3,z,.9,.1,.25);
 stone(w,g,40,1.5,20,2.7,3,2.7);for(const x of [39,40,41])for(const z of [19,21])stone(w,g,x,3.2,z,.5,.5,.5);w.blockArea(40,20,2,2);
 for(let row=0;row<4;row++){w.box(g,16.4+row*.55,.025,30,.35,.05,3.2,0x51452c);for(let n=0;n<8;n++)w.sphere(g,16.4+row*.55,.16,28.6+n*.4,.13,row%2?0x68813f:0x87964a).scale.y=.6;}
 w.sign('KITCHEN GARDEN',17,32.2,2.5);tree(w,g,10,45,1.9);w.blockArea(10,45,1,1);w.sign('OLD OAK WOOD',10,42,2.3);
 for(let i=0;i<7;i++){const a=i*Math.PI*2/7,m=w.sphere(g,14+Math.sin(a)*2.6,.7,55+Math.cos(a)*2.6,.6,0x8a8c78);m.scale.set(.65,1.8,.7);m.rotation.z=Math.sin(i)*.2;}w.sign('REEDWATER',27,50,2.2);
}

