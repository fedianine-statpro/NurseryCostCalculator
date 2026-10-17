// One continuous village, woodland, shore and island. Shared by the renderer and navigation.
export const MAP_WIDTH=64,MAP_HEIGHT=64;
export const TARGETS={
 bank:{x:9,z:9,name:'Bank of Birthdays',district:'Bank square'},
 fries:{x:7,z:17,name:'Centerpoint market',district:'Market lane'},
 house:{x:8,z:30,name:'Danya’s house',district:'South village'},
 alex:{x:12,z:32,name:'Alex',district:'South village'},
 park:{x:23,z:18,name:'Keeper · Park entrance',district:'G. Ross Park'},
 photo:{x:25,z:43,name:'Anya · Family photograph',district:'Lakeshore'},
 alisa:{x:22,z:41,name:'Alisa',district:'Lakeshore'},arisha:{x:27,z:46,name:'Arisha',district:'Lakeshore'},
 picnic:{x:23,z:49,name:'Birthday picnic',district:'Lakeshore'},
 football:{x:13,z:21,name:'Igor · Football green',district:'Market lane'},
 bench:{x:20,z:38,name:'Lakeside bench',district:'Lakeshore'},
 sign:{x:17,z:36,name:'Santee · Base camp',district:'Lakeshore'},moped:{x:37,z:28,name:'Mykonos landing',district:'Watchtower island'},penguin:{x:28,z:35,name:'South Africa lookout',district:'Lakeshore'},
 oak:{x:10,z:45,name:'Old oak grove',discovery:true},well:{x:6,z:25,name:'Village well',discovery:true},
 harbor:{x:37,z:31,name:'Lakeside landing',discovery:true},tower:{x:40,z:20,name:'Old watchtower',discovery:true},
 garden:{x:17,z:30,name:'Kitchen garden',discovery:true},stones:{x:14,z:55,name:'Standing stones',discovery:true},
 cove:{x:28,z:51,name:'Reedwater cove',discovery:true},lookout:{x:46,z:38,name:'Island lookout',discovery:true}
};
export const discoveryIds=Object.keys(TARGETS).filter(id=>TARGETS[id].discovery);
export function questTarget(s){
 if(!s.bountyStarted)return 'bank';
 if(s.cameraOwned&&!s.alexTalked)return 'alex';
 if(!s.raidJoined)return 'park';
 if(!s.cameraOwned)return 'house';
 if(!s.anyaTalked)return 'photo';
 if(!s.alisaTalked)return 'alisa';
 if(!s.arishaTalked)return 'arisha';
 if(!s.photoTaken)return 'photo';
 if(!s.hatClaimed)return 'bank';
 if(!s.reunionDone)return 'photo';
 return null;
}
export function targetAction(id,s){
 const actions={bank:!s.bountyStarted?'Read bounty':s.photoTaken&&!s.hatClaimed?'Claim the partyhat':'Talk to Banker',house:!s.cameraOwned?'Collect camera':'Talk to Danya',alex:!s.alexTalked?'Rehearse cover story':'Talk to Alex',park:!s.raidJoined?'Register as Toldo':'Talk to Keeper',photo:s.hatClaimed&&!s.reunionDone?'Return to the family':s.anyaTalked&&s.alisaTalked&&s.arishaTalked&&!s.photoTaken?'Take family photograph':'Talk to Anya',alisa:'Talk to Alisa',arisha:'Talk to Arisha',picnic:s.reunionDone?'Enjoy the birthday picnic':'Examine picnic',football:'Talk to Igor',fries:'Visit the market',bench:'Sit on bench',sign:'Read base camp sign',moped:'Read Mykonos card',penguin:'Watch penguin',oak:'Rest beneath the oak',well:'Look into well',harbor:'Watch the water',tower:'Look from watchtower',garden:'Inspect kitchen garden',stones:'Visit standing stones',cove:'Watch the reeds',lookout:'Look across the island'};
 return actions[id]??'Examine';
}
const segments=[[[9,9],[9,21]],[[9,21],[8,30]],[[9,14],[23,18]],[[13,21],[9,21]],[[8,30],[17,30]],[[17,30],[23,18]],[[17,30],[24,37]],[[24,37],[25,43]],[[25,43],[23,49]],[[23,49],[28,51]],[[24,37],[28,35]],[[25,43],[22,41]],[[25,43],[27,46]],[[17,30],[12,39]],[[12,39],[10,45]],[[10,45],[14,55]],[[17,30],[27,26]],[[27,26],[38,26]],[[38,19],[38,34]],[[38,34],[46,38]],[[17,30],[17,36]],[[20,38],[24,37]],[[6,25],[9,25]]];
function distance(x,z,a,b){const dx=b[0]-a[0],dz=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz)));return Math.hypot(x-a[0]-dx*t,z-a[1]-dz*t);}
export function terrainAt(x,z){
 const shore=29+Math.sin(z*.17)*1.5+Math.sin(z*.43)*.6;
 const island=((x-39)/8.8)**2+((z-27)/15.5)**2<1||((x-45)/5)**2+((z-37)/5)**2<1;
 const bridge=x>=26&&x<=38&&z>=25&&z<=26;
 if(x>shore&&!island&&!bridge)return 'water';
 if(bridge&&x<34)return 'bridge';
 if(Math.hypot(x-9,z-9)<4.3)return 'cobble';
 const d=Math.min(...segments.map(([a,b])=>distance(x,z,a,b)));
 if(d<.85+Math.sin(x*1.2+z*.8)*.12)return 'path';
 if(Math.abs(x-shore)<1.3||island&&((x-39)/8.1)**2+((z-27)/14.8)**2>.94)return 'sand';
 return z>36||x>19&&z<25?'forest':'grass';
}
export function regionAt(x,z){if(x>32)return 'Watchtower island';if(z>39&&x>18)return 'Reedwater · Family shore';if(z>38)return 'Old oak woodland';if(z>26)return x>20?'Lakeside walk':'South village & gardens';if(x>18)return 'G. Ross Park';if(z>13)return 'Centerpoint · Market lane';return 'Birthday village · Bank square';}

