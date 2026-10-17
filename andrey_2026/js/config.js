export const CONFIG = {
  saveKey: 'freakybat-birthday-v1', saveVersion: 4, birthday: '20 November', reward: 'party',
  rewards: {
    party: { name:'Blue Party Hat', color:0x496be0, examine:'No protection. Do not get wet.', complaint:"It's made of paper.", reply:"At that price, you'd expect lamination." },
    santa: { name:'Red Santa hat', color:0xc63c32, examine:'No protection. Warm ears.', complaint:'Does it come in blue?', reply:"I’m not explaining that to Santa." }
  },
  appearances: {
    Andrey:{shirt:0x688b51,pants:0x544331,hair:0x3f3025,skin:0xc79871,eyes:0x677f89,height:1.15,beard:true},
    Victor:{shirt:0x72628b,pants:0x454751,hair:0x332b23,skin:0xd0a27e,eyes:0x4a3226},
    Danya:{shirt:0xa27147,pants:0x414c3c,hair:0x4e3828,skin:0xd0a27e,eyes:0x5b4a2f},
    Alex:{shirt:0x527c8d,pants:0x48413b,hair:0x29241e,skin:0xd0a27e,eyes:0x352a23,goatee:true},
    Igor:{shirt:0x9f5e52,pants:0x45473b,hair:0x62452d,skin:0xd0a27e,eyes:0x697b7c},
    Anya:{shirt:0x9e6579,pants:0x4a5363,hair:0xbaa477,skin:0xd4a37d,eyes:0x6b5732,longHair:true},
    Alisa:{shirt:0xc49559,pants:0x586281,hair:0x806038,skin:0xd4a37d,eyes:0x6b4529,height:.62,longHair:true},
    Arisha:{shirt:0x8298a6,pants:0x755979,hair:0xa78e64,skin:0xd4a37d,eyes:0x82969d,height:.54,ponytail:true},
    Vendor:{shirt:0xa6a58b,pants:0x58503b,hair:0x514533,skin:0xbe916e},
    Banker:{shirt:0x765d48,pants:0x4e4439,hair:0x807e6e,skin:0xc39879},
    Keeper:{shirt:0x748255,pants:0x514e37,hair:0x6a5a3d,skin:0xc39879}
  },
  letter: [
  "Andrey, happy birthday, mate.",
  "We started out sharing one portion of fries and spending our lunches at Danya's. Since then, we've shared islands, road trips, Christmases, and a lot of very good days.",
  "I love that you're still the person who makes friends everywhere and is always up for an adventure. Seeing you with Anya, Alisa, and Arisha makes me especially happy.",
  "I'm grateful we grew up together, and that we're still adding to the stories. Here's to the next one.",
  "Victor"
]
};
export const REWARD = CONFIG.rewards[CONFIG.reward];
export const OBJECTIVES=['Read the bounty at the bank.','Register as Toldo and collect the camera.','Rehearse the cover story with Alex.','Meet Anya at the shore.','Speak to Alisa and Arisha.','Take the family photograph.','Claim the partyhat at the bank.','Return to the family at the shore.','Victor has a birthday message for you.','Quest complete. Happy birthday, Freakybat.'];

