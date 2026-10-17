import {SCRIPT,DECISIONS,OPTIONAL} from './script.js';
export const PHOTO_NAME='Freakybat, Captured';
export const PHOTO_DESCRIPTION='A family photograph. Freakybat is clearly visible and has made no attempt to escape the photograph.';
export const WITNESS='I confirm that Freakybat was captured on camera. He is still in the photograph. Signed, Anya. Additional statement from Alisa: Dad promised to share the hat. Additional statement from Arisha: He is coming back.';
export function sceneDefinition(id,s){
 const make=(opening,decision,continuation,event=id,next=null)=>({opening,decision,continuation,event,next});
 switch(id){
 case 'bounty':return make(SCRIPT.bounty_intro,'bounty_reaction',SCRIPT.bounty_plan);
 case 'raid':return make(SCRIPT.raid_recruit,'raid_tactics',[...SCRIPT.raid_done,...(!s.cameraOwned?SCRIPT.camera_hint:[])]);
 case 'camera':return make(SCRIPT.camera_plan,'cover_story',SCRIPT.camera_done,'camera','alex');
 case 'alex':return make(SCRIPT.alex_rehearsal,'alex_cover',SCRIPT.alex_done);
 case 'anya':return make(SCRIPT.anya_conversation,'anya_reply',SCRIPT.anya_done);
 case 'alisa':return make(SCRIPT.alisa_conversation,'alisa_hat',SCRIPT.alisa_done);
 case 'arisha':return make(SCRIPT.arisha_conversation,'arisha_capture',SCRIPT.arisha_done);
 case 'capture':return make(SCRIPT.family_capture,null,[],'photo');
 case 'claim':return make(SCRIPT.bounty_claim,'final_favour',SCRIPT.claim_done,'hat');
 case 'reunion':return make([...SCRIPT.reunion_open,...SCRIPT.reunion_family,...SCRIPT.reunion_victor,...SCRIPT.callbacks[s.coverStory],...SCRIPT.complete],null,[],'reunion');
 default:if(OPTIONAL[id])return make(OPTIONAL[id],null,[],'optional');throw Error('Unknown scene: '+id);
 }
}
export function sceneSteps(id,s,choice=null){
 const def=sceneDefinition(id,s),branch=def.decision&&choice?DECISIONS[def.decision].find(c=>c.id===choice):null;
 return [...def.opening,...(def.decision?[{decision:def.decision},...(branch?.lines??[])]:[]),...def.continuation];
}

