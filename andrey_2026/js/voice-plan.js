// Pitch and rate distinguish roles even on systems with only one English voice.
export const VOICE_PROFILES={
 Narrator:{pitch:.78,rate:.91,direction:'A confident storyteller who wants his plan to work. Measured and affectionate; defend the narration earnestly when events contradict it. Leave the pauses room.'},
 Andrey:{pitch:.92,rate:1.03,direction:'Warm, curious, sociable. A quick-witted birthday bounty hunter arguing his own case; affectionate and sincere with the family.'},
 Victor:{pitch:.76,rate:1.06,direction:'A familiar friend: relaxed, quick, amused, occasionally firm.'},
 Banker:{pitch:.65,rate:.87,direction:'Unhurried, matter-of-fact, treating the absurd as routine.'},
 Danya:{pitch:1.06,rate:1.1,direction:'An old friend, practical and dry. Enjoy the cover-story test without forcing the punchlines.'},
 Alex:{pitch:1.18,rate:.98,direction:'Light, understated, quick comic observations.'},
 Igor:{pitch:.84,rate:1.15,direction:'Sporty, playful, cheerful, short confident reactions.'},
 Vendor:{pitch:.69,rate:1.12,direction:'Brisk, businesslike, a little incredulous.'},
 Keeper:{pitch:1.04,rate:.89,direction:'A self-important raid recruiter who has chosen a very safe place to stand. Earnest, measured, never threatening.'},
 Anya:{pitch:1.22,rate:1.04,direction:'Warm, clear, practical; calmly cuts through the nonsense.'},
 Alisa:{pitch:1.36,rate:1.09,direction:'Bright and engaged. Natural delivery, no exaggerated baby voice.'},
 Arisha:{pitch:1.5,rate:.97,direction:'Curious and delighted. Natural delivery, no exaggerated baby voice.'},
 Robot:{pitch:.5,rate:.82,direction:'Calm, precise photographer and witness-statement clerk. Matter-of-fact, no wink or awareness of the joke.'},
 Rock:{pitch:.6,rate:.7,direction:'Silent. The ellipsis is a pause, not a spoken word.'}
};
export function recordingId(speaker,text){let hash=2166136261;for(const c of speaker+'|'+text){hash^=c.charCodeAt(0);hash=Math.imul(hash,16777619);}return speaker.toLowerCase().replace(/[^a-z0-9]+/g,'-')+'-'+(hash>>>0).toString(16).padStart(8,'0');}
