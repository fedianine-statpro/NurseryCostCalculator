// Matching pixel portraits for the personal cast and fictional speakers.
// Dialogue and voice IDs stay stable; code-drawn portraits remain as fallbacks.
export const PORTRAITS={
 Andrey:'assets/portraits/andrey.png',Victor:'assets/portraits/victor.png',
 Danya:'assets/portraits/danya.png',Alex:'assets/portraits/alex.png',Igor:'assets/portraits/igor.png',
 Anya:'assets/portraits/anya.png',Alisa:'assets/portraits/alisa.png',Arisha:'assets/portraits/arisha.png',
 Banker:'assets/portraits/banker.png',Vendor:'assets/portraits/vendor.png',Keeper:'assets/portraits/keeper.png',
 Robot:'assets/portraits/robot.png',Rock:'assets/portraits/rock.png',Narrator:'assets/portraits/narrator.png'
};
export function customPortrait(name){return PORTRAITS[name]?new URL('../'+PORTRAITS[name],import.meta.url).href:null;}
