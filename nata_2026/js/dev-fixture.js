import {initialState} from './state.js';
// Only the preview entry point imports this fixture. Production defaults stay false.
export function bridgeFixture(settings) {
  const s=initialState();
  s.mode='bridge-test';s.position={x:477,y:255};
  Object.assign(s.flags,{gateBriefed:true,rescueBriefed:true,rodGranted:true,bellRetrieved:true,boxMovedOnce:true,boxHeld:true,ladleTaken:true,bellHung:true,rangerRescued:true,keyReturned:true});
  s.inventory=['ladle'];
  if(settings) s.settings={...s.settings,...settings};
  return s;
}
