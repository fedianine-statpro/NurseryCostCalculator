# Character recording scripts

One document per character for Please Stop Farming Me, story version 4. The scripts include main scenes, all decision branches, optional interactions, hints, and Victor’s final letter. System messages and player choice labels are not spoken. Characters with no current lines need no recording.

- [Narrator](Narrator.md)
- [Andrey](Andrey.md)
- [Victor](Victor.md)
- [Banker](Banker.md)
- [Danya](Danya.md)
- [Alex](Alex.md)
- [Igor](Igor.md)
- [Vendor](Vendor.md)
- [Keeper](Keeper.md)
- [Anya](Anya.md)
- [Alisa](Alisa.md)
- [Arisha](Arisha.md)
- [Robot](Robot.md)
- [Rock](Rock.md)

## Replace browser voices with your recordings

1. Record each quoted line separately. Keep the exact ID/filename. Victor’s letter is one continuous recording.
2. Place exported clips in the indicated `assets/voices/<character>/` folder.
3. Add each finished clip to `RECORDINGS` in `js/recordings.js`, using the ID as its key and the game-relative path as its value.
4. Enable Sound and Character voices in game settings. Recorded clips take priority; unrecorded lines use browser voices.

Example (replace with a real ID from your document):

```js
export const RECORDINGS = {
  'victor-12345678': 'assets/voices/victor/victor-12345678.mp3',
};
```

No backend or API key is needed. Upload the MP3 files with the rest of the static site to GitHub Pages. Browser voices depend on the player’s browser and installed voices; some systems use an online speech service. Text always remains visible.

After dialogue changes, run `node tools/build-recording-scripts.mjs`. Unchanged lines keep their IDs. `lines.json` is the full checklist; it is not loaded by the game. The alternate toldo handle only occurs in unvoiced system messages.
