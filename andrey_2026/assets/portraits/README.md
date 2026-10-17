# Character portraits

Fourteen final pixel portraits were created with the **built-in image_gen tool**. The eight personal characters use the supplied photographs as likeness references; the six fictional speakers have original designs based on their game roles and appearances. Andrey's portrait is the style reference for the complete set: warm pixel illustration, olive backdrop, natural proportions, and simple fantasy clothing matching each world character.

[View the full portrait set](index.html).

| Speaker | Portrait | References / design |
| --- | --- | --- |
| Andrey | [andrey.png](andrey.png) | andrei1, andrei2, andrei3 |
| Victor | [victor.png](victor.png) | victor1, victor2, victor3 |
| Anya | [anya.png](anya.png) | anna2, anna3, anna1 |
| Alisa | [alisa.png](alisa.png) | alisa1, alisa2 |
| Arisha | [arisha.png](arisha.png) | arisha1, arisha3 |
| Alex | [alex.png](alex.png) | alex3, alex1, alex2 |
| Danya | [danya.png](danya.png) | danya3, danya4 |
| Igor | [igor.png](igor.png) | igor2, embedded JPEG preview of igor1.nef |
| Keeper | [keeper.png](keeper.png) | Original wildlife tour guide, moss-green tunic |
| Vendor | [vendor.png](vendor.png) | Original food vendor, canvas apron |
| Banker | [banker.png](banker.png) | Original older clerk, grey hair and brown tunic |
| Robot / Photographer | [robot.png](robot.png) | Square grey-metal head, yellow eyes and brass antenna matching the world model |
| Rock | [rock.png](rock.png) | Quiet grey pet rock with two dot eyes |
| Narrator | [narrator.png](narrator.png) | Parchment and quill, retaining the unseen storyteller motif |

The source filenames `andrei` and `anna` map to the game speakers **Andrey** and **Anya**. The original photographs stay in the separate source collection. Runtime assets are the generated PNGs listed above.

[generation-prompts.json](generation-prompts.json) contains the exact prompt set, reference roles, output filenames, and generation method. Each person was generated separately with their own identity references. `andrey.png` was used only as a style reference for subsequent characters.

`js/portraits.js` registers all fourteen images. Their display size adapts between 64 and 120 CSS pixels; the square framing preserves the full face. A missing or failed PNG falls back to the code-drawn portrait; voice and dialogue IDs are unaffected. `Game` lines remain brief system captions rather than a separate speaking character.

To replace a portrait later, add the revised PNG or WebP here and update its registered path. The NEF helper can extract an embedded JPEG without changing the RAW file: `node tools/extract-nef-preview.mjs input.nef output.jpg`.
