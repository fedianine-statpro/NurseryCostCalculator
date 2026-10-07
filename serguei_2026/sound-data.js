/* Audio asset manifest. Metadata only; no audio is loaded by this script.
 * All 29 local assets are supplied. Replacement briefs remain for future editing. */
window.ARCHIVE_SOUND = {
  version:2,
  direction:'Warm, tactile family archive. Restrained period-inspired instruments, no military spectacle, stereotypical Russian tunes, vocals, constant crackle or comedy loops.',
  motif:'Original shared motif in D major: D4–A4–F#4–E4 | D4–B3–A3–D4; leave breathing space between phrases. 64 BPM opening, adaptable to 3/4 or light syncopation. Compose supporting harmony without quoting existing songs.',
  delivery:{music:'Stereo Ogg Vorbis, 44.1 kHz, about 96–128 kbps; keep lossless masters separately. 60–90 s. Render an exact whole-bar loop with reverb wrapped into its start, no leader or fade baked into the loop, no abrupt harmonic change across its boundary. Target approximately -23 LUFS, true peak <= -3 dBTP.',ambient:'Stereo Ogg, 40–80 s seamless loop, sparse and unobtrusive; approximately -30 LUFS, true peak <= -8 dBTP. No constant vinyl/tape crackle.',effects:'Mono or narrow stereo WAV, 44.1 kHz, short trimmed one-shots with natural tails and 3 ms safety fades. Peaks <= -9 dBFS; match perceived loudness, no heavy sub-bass. Supply two variations where listed.',licence:'Supply original commissioned/generated assets with redistribution rights, or record the exact source URL, creator and licence here before enabling third-party files.'},
  assets:{
    'archive-theme':{layer:'music',src:'assets/audio/music/archive-theme.ogg',ready:true,loop:true,brief:'64 BPM D major. Intimate felt piano states the shared motif, soft fingerpicked nylon guitar answers it. Gentle tape-like warmth in the instruments, no hiss bed. Curious, affectionate, slightly mysterious; plenty of pauses.'},
    'childhood-theme':{layer:'music',src:'assets/audio/music/childhood-theme.ogg',ready:true,loop:true,brief:'Same motif and harmony, 72 BPM. Delicate plucked strings, quiet nylon guitar, occasional wooden percussion every several bars. Inventive homemade-magazine mood, no nursery-game chimes or persistent bouncing melody.'},
    'ledger-theme':{layer:'music',src:'assets/audio/music/ledger-theme.ogg',ready:true,loop:true,brief:'Same motif, 68 BPM. Dry understated pizzicato bass or cello pulse and sparse felt piano, rhythmically tidy but gentle. Editorial self-importance through restraint; no ticking clock, typing bed or comedy march.'},
    'army-theme':{layer:'music',src:'assets/audio/music/army-theme.ogg',ready:true,loop:true,brief:'Same motif, rubato feel inside a 64 BPM loop. Sparse fingerpicked acoustic guitar alone with occasional soft harmonic. Peaceful indoor evening; no drums, bugles, combat, dramatic minor-key swells or military themes.'},
    'wedding-theme':{layer:'music',src:'assets/audio/music/wedding-theme.ogg',ready:true,loop:true,brief:'Shared motif adapted to a slow gentle 3/4 waltz, about 66 BPM. Warm felt piano and nylon guitar with a barely present sustained string cushion. Carefully preserved family album; intimate rather than grand or sentimental.'},
    'cuba-theme':{layer:'music',src:'assets/audio/music/cuba-theme.ogg',ready:true,loop:true,brief:'Shared motif, about 76 BPM. Lightly syncopated nylon guitar, sparse soft brushed hand percussion, warm relaxed harmony. Sunlit correspondence, no horns, party beat, tourist stereotypes or busy lead melody.'},
    'canada-sparse':{layer:'music',src:'assets/audio/music/canada-sparse.ogg',ready:true,loop:true,brief:'Shared motif fragments on very sparse felt piano, 64 BPM grid with long rests of 4–8 bars. Neutral and dignified, no emotional crescendo, suspense, bleak drones or minor-key pressure. Most of this loop should be quiet.'},
    'home-theme':{layer:'music',src:'assets/audio/music/home-theme.ogg',ready:true,loop:true,brief:'Opening motif returns at 64 BPM on gentle guitar and felt piano. Gradual warmth, grounded and settled. No triumphant crescendo. Suitable for work found, house and continued hobbies.'},
    'finale-theme':{layer:'music',src:'assets/audio/music/finale-theme.ogg',ready:true,loop:true,brief:'Shared opening motif, 64 BPM. Fuller but still intimate felt piano, nylon guitar and restrained soft strings, affectionate family-table atmosphere. Leave space for voices; no drums or celebratory fanfare, no final cadence that reveals loop seam.'},
    'quiet-room':{layer:'ambient',src:'assets/audio/ambience/quiet-room.ogg',ready:true,loop:true,brief:'Still domestic room with subtle distant air and occasional almost imperceptible wooden-house creak. No speech, music, clock tick, electrical hum or constant crackling. Seamless and barely audible.'},
    'lake-air':{layer:'ambient',src:'assets/audio/ambience/lake-air.ogg',ready:true,loop:true,brief:'Quiet Canadian lakeside, gentle water against shore, soft breeze, just one or two distant natural bird calls per minute. No mosquitoes, loud splashes, crowded campsite or conspicuous repetitive bird motif.'},
    'page-a':{layer:'effects',src:'assets/audio/effects/page-a.wav',ready:true,brief:'0.45–0.7 s: one ivory paper sheet gently lifted and turned on a desk, close soft dry foley, no click or harsh crumple.'},
    'page-b':{layer:'effects',src:'assets/audio/effects/page-b.wav',ready:true,brief:'Second variation of page-a, slightly lighter single-sheet rustle; same perceived level and duration.'},
    'folder-a':{layer:'effects',src:'assets/audio/effects/folder-a.wav',ready:true,brief:'0.5–0.8 s: opening a worn cloth/cardboard archive folder on wood, soft hinge flex and paper movement, no metal latch.'},
    'folder-b':{layer:'effects',src:'assets/audio/effects/folder-b.wav',ready:true,brief:'Second variation of folder-a, a slightly thicker cardboard cover; restrained and dry.'},
    'document':{layer:'effects',src:'assets/audio/effects/document-slide.wav',ready:true,brief:'0.6 s: one paper document pulled smoothly from a cardboard sleeve, soft friction ending naturally, no swoosh.'},
    'photo':{layer:'effects',src:'assets/audio/effects/photo-place.wav',ready:true,brief:'0.35 s: stiff small photographic prints moved then placed onto paper, a delicate papery scrape. Accompanies the family photos overlapping the classification cards. No photo-flipping mechanic is added.'},
    'chess':{layer:'effects',src:'assets/audio/effects/chess-place.wav',ready:true,brief:'0.25 s: felt-bottom wooden chess knight placed on a wooden board, small warm midrange contact, no ringing click.'},
    'stamp-a':{layer:'effects',src:'assets/audio/effects/stamp-a.wav',ready:true,brief:'0.3 s: small rubber stamp pressed onto paper over wood then lifted, modest padded thud, not a gunshot.'},
    'stamp-b':{layer:'effects',src:'assets/audio/effects/stamp-b.wav',ready:true,brief:'Second variation of stamp-a, slightly different hand pressure, same modest level.'},
    'stamp-official':{layer:'effects',src:'assets/audio/effects/stamp-official.wav',ready:true,level:0.9,brief:'0.4 s: decisive larger rubber stamp, padded official thump with slight handle creak. Comic seriousness through timing, no booming impact or cartoon sound.'},
    'folder-scrape':{layer:'effects',src:'assets/audio/effects/flower-folder.wav',ready:true,brief:'0.65 s: secret cardboard case pulled across paper then opened, a quiet conspicuously careful scrape. Realistic close foley.'},
    'ledger':{layer:'effects',src:'assets/audio/effects/ledger-drop.wav',ready:true,level:0.85,brief:'0.3 s: thick accounting ledger landing on paper cards on wood. Heavy paper thump, soft and low enough not to startle, no bass enhancement.'},
    'pencil':{layer:'effects',src:'assets/audio/effects/pencil-correction.wav',ready:true,brief:'0.6 s: two quick red-pencil crossing strokes on paper, brief scratch then stop. No continuous writing.'},
    'warm-resolution':{layer:'effects',src:'assets/audio/effects/irina-resolution.wav',ready:true,level:0.6,brief:'1.4 s original acoustic-guitar harmonic with a soft felt-piano D-major resolution drawn from the shared motif. One tender acknowledgement for ИРИНА ОСТАЛАСЬ, no fanfare.'},
    'measure':{layer:'effects',src:'assets/audio/effects/measure-tape.wav',ready:true,brief:'0.8 s: cloth measuring tape drawn across paper then softly gathered back, faint spool friction, no cartoon stretch, metallic spring snap or ratchet barrage.'},
    'plop':{layer:'effects',src:'assets/audio/effects/water-plop.wav',ready:true,level:0.7,brief:'0.35 s: one tiny object making a modest plop into still water, a restrained fishing punchline. No large splash or cartoon bubbling.'},
    'transport-start':{layer:'effects',src:'assets/audio/effects/recorder-start.wav',ready:true,brief:'0.2 s: a softly pressed mechanical tape play key, muted plastic contact. Reserved for a future custom control; do not sound over native recording playback.'},
    'transport-stop':{layer:'effects',src:'assets/audio/effects/recorder-stop.wav',ready:true,brief:'0.2 s: soft release of a mechanical tape transport key, same restrained level as start. Reserved for future custom controls.'}
  },
  effects:{page:['page-a','page-b'],folder:['folder-a','folder-b'],stamp:['stamp-a','stamp-b']},
  chapters:{
    '0':{music:'archive-theme',ambient:'quiet-room'},'1':{music:'childhood-theme',ambient:'quiet-room'},
    '2':{music:'ledger-theme',ambient:'quiet-room'},'3':{music:'army-theme',ambient:'quiet-room'},
    '4':{music:'wedding-theme',ambient:'quiet-room'},'5':{music:'cuba-theme',ambient:'quiet-room'},
    '6':{music:'ledger-theme',ambient:'quiet-room'},'7':{music:'home-theme',ambient:'quiet-room'},
    '8':{music:'home-theme',ambient:'quiet-room'},'9':{music:'finale-theme',ambient:'quiet-room'}
  },
  scenes:{
    kindness:{music:null,ambient:null},natasha:{music:'wedding-theme',ambient:'quiet-room'},
    'canada-start':{music:'canada-sparse',ambient:null,musicLevel:0.45},
    'canada-search':{music:null,ambient:null},'canada-persistence':{music:null,ambient:null},'canada-callback':{music:null,ambient:null},
    apartment:{music:'canada-sparse',ambient:null,musicLevel:0.45},
    tent:{music:null,ambient:'lake-air',ambientLevel:0.45},fishing:{music:null,ambient:'lake-air',ambientLevel:0.45},'fish-result':{music:null,ambient:'lake-air',ambientLevel:0.45},
    montage:{music:'finale-theme',ambient:'quiet-room',musicLevel:0.75},
    'family-message':{music:'finale-theme',ambient:'quiet-room',musicLevel:0.5,ambientLevel:0.15}
  },
  cues:{prediction:[['ledger',320],['stamp-official',680]],irina:[['pencil',200]],'irina:reaction':[['warm-resolution',180]],'army:flower-open':[['folder-scrape',0]],'army:flower-close':[['stamp-official',100]],'fishing:measure':[['measure',60]],'fish-result:reaction':[['plop',380]],'achievement:reaction':[['photo',100]],kindness:[], 'canada-search':[], 'canada-persistence':[]},
  familyRecordings:{source:'Existing supplied family recordings in story-data.js; files unchanged by the sound-system implementation.',licence:'Private family-supplied material. No additional redistribution licence inferred.',loop:false,autoplay:false,processing:'None added. Preserve already prepared clips and native playback controls.'},
  provenance:{
  "thirdPartyAssets": [
    {
      "source": "assets/audio/LICENSES.md",
      "licence": "CC0-1.0",
      "creators": "Sam Gossner, Simon Dalzell, Roberto, Kenney, NachtmahrTV, AntumDeluge, Peludo, RandomMind, cMilan",
      "usage": "Recorded instrument samples, adapted foley and room/water field recordings; exact primary sources and derivatives in LICENSES.md."
    }
  ],
  "generatedOrRecordedAssets": [
    {
      "creator": "Original offline project arrangements",
      "assets": [
        "archive-theme",
        "childhood-theme",
        "ledger-theme",
        "army-theme",
        "wedding-theme",
        "cuba-theme",
        "canada-sparse",
        "home-theme",
        "finale-theme",
        "irina-resolution"
      ],
      "method": "Original deterministic scores rendered offline from recorded CC0 instruments, edited CC0 foley and field recordings. No oscillator beds or runtime synthesizer.",
      "score": "tools/produce-audio.cjs",
      "licence": "Original arrangements dedicated to CC0-1.0; underlying samples CC0-1.0."
    }
  ],
  "note": "All 29 assets supplied locally. Production measurements and hashes: assets/audio/production-report.json. Six family MP3 files unchanged. No runtime synthesis or streaming."
}
};
