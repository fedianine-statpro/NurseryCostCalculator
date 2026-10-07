/* Optional editorial export; the game reads sound-data.js directly, with no build step. */
const fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.resolve(__dirname,'..'),sandbox={window:{}};vm.createContext(sandbox);
for(const name of ['story-data.js','sound-data.js'])vm.runInContext(fs.readFileSync(path.join(root,name),'utf8'),sandbox);
const {ARCHIVE_SOUND:manifest,MAGAZINE:story}=sandbox.window;
const resolvedScenes={};
for(const scene of story.scenes){
  resolvedScenes[scene.id]={...manifest.chapters[String(scene.chapter)],...manifest.scenes[scene.id],
    recordings:[...(story.sceneAudio[scene.id]||[]),...(story.bonusAudio[scene.id]?.clips||[]),...(scene.items||[]).filter(item=>item.audio).map(item=>item.audio)]};
}
const output={...manifest,canonicalSource:'sound-data.js; regenerate this JSON snapshot after editing that file or story-data.js.',resolvedScenes,familyRecordings:{...manifest.familyRecordings,clips:story.audioClips}};
fs.writeFileSync(path.join(root,'assets/audio/manifest.json'),JSON.stringify(output,null,2)+'\n');
console.log('Exported assets/audio/manifest.json');
