# Freakybat: Just Accept the Hat

## Revised Codex brief: comedy, quest, and implementation

Build a short, playable birthday quest for Andrey. The world resembles early RuneScape 2 around 2004, but its ordinary game verbs become increasingly unreliable when applied to an unusually tall, sociable, generous adventurer. Andrey and Victor played both original RuneScape Classic and early RuneScape 2; use the latter as the main appearance, with a small Classic-era callback.

**The goal:** collect a rare birthday hat.

**The problem:** Andrey would like to feed everyone, explore a sewer, improve the photograph, and personally reimburse whoever paid for his own present.

The quest is now built around large comic situations and their consequences. The house becomes a sandwich. The sewer has acquired a tour operator. A robot cannot understand a family photo. The payment argument becomes an actual duel. A silent old MSN pet rock turns out to be the most employable member of the party.

Deliver these as animations and interactions in a small explorable world. Dialogue sets them up, reacts, and gets to the next action quickly.

## 1. Fixed requirements

| Item | Requirement |
| --- | --- |
| Recipient | Andrey; primary gaming name freakybat; alternate toldo |
| Birthday | 20 November |
| Age | Unknown; omit the number |
| Language | English |
| Duration | Target a natural first play of 7–9 minutes; normal play must fit within 10 |
| Audience | Andrey playing; Anya and the daughters may watch |
| Devices | Desktop browser and phone, portrait and landscape |
| Delivery | Static HTML, CSS, JavaScript, local original images and sound; GitHub Pages |
| Visual target | Early RuneScape 2, approximately 2004; a small Classic-era callback |
| Main reward | Blue Party Hat; make the type configurable to a red Santa hat |
| Tone | Energetic absurdity, sharp exchanges, affectionate teasing, no swearing |
| Structure | One coherent quest, one small world, a completed reward, then Victor's sincere message |
| Other games | Comedy influences only; no characters, locations, or game crossover |
| Creation here | This document is the full plan; the game will be implemented later in Codex |

### Visual target clarified: early RuneScape 2 around 2004

Victor confirms that they played both original RuneScape Classic and the upgraded RuneScape 2 around 2004. Use early RuneScape 2 as the main visual target because it matches the supplied reference images' overall appearance: stone surround, parchment chat and dialogue, circular minimap, compact inventory, and low-poly 3D characters.

The screenshots are visual references, not proof that every depicted feature existed in 2004. Check individual skills, equipment, and client details against the chosen period. Exclude later skill capes, Hunter, Construction, Grand Exchange interfaces, and modern OSRS or RuneScape 3 additions. Do not copy later mechanics merely because a reference screenshot contains them.

Original Classic remains part of the personal nostalgia. Add a small optional Classic-avatar portrait on the login screen, using a simple 2D sprite. It is an illustrated callback, not a second playable mode or an alternate world renderer. The core game uses one coherent early-RS2 appearance throughout.

Before polishing all assets, capture one representative gameplay view and compare it with the references. Aim for the period's deliberately simple look rather than a modern remaster.

The rare paper crown and Santa hat are different items. The draft uses a Party Hat. Reward sprites, Examine text, and the two material-specific final lines must live in one configuration object.

## 2. What changes in this version

Every main scene has an action with a substantial consequence, a short escalation, and a payoff that affects a later scene.

| Comedy device | Application |
| --- | --- |
| The narrator predicts a sensible action and must react to what happens | A simple birthday outing becomes an argument with the game's nouns |
| A familiar action produces the wrong kind of correct result | Use bread on a house creates a house sandwich |
| A small situation expands beyond its original scale | Sharing one portion becomes a mathematical problem; a payment offer becomes area damage |
| Earnest characters respond to an absurd premise as though the details matter | Danya objects to having stairs in his lunch; the vendor demands sensible portions |
| Attractive wrong choices get their own short payoffs | Eat the house, split the house, instruct the robot, pay secretly |
| A supposedly useless character becomes disproportionately important | The pet rock takes the best photograph, gets paid, and settles the bill |
| Previous jokes return with a different consequence | Sandwich enters the photo; photo income ends the payment duel; the old complaint returns after the hat |

The relevant influences are The Stanley Parable's narrator negotiation, WHAT THE GOLF?'s surprising action results, McPixel's rewarding wrong choices, Chuchel's physical escalation, Frog Detective and The Darkside Detective's character exchanges, Later Alligator's expressive supporting cast, Say No! More's exaggerated social conflict, and Job Simulator's literal-minded robots. Little Inferno is useful for short item descriptions and rewarding combinations. These are interpretations of comedy structures, not copied dialogue or a claim that every example is those games' objectively funniest joke.

Use original writing, staging, sounds, and art. Keep everything visually inside this RuneScape-style quest.

### The narrator

An imaginary professional hired by Victor to keep the birthday on schedule.

He starts pleased with his elegant plan. At the house, he discovers the player can use items in ways he did not intend. In the pipe, he tries to salvage the expedition. By the payment duel, he is conducting damage control. At the cracker, he briefly abandons his professional voice.

He should have a reason to speak: prediction, correction, surprise, impatience, or a callback. Keep his best lines short. He is frustrated by the situation, never hostile to Andrey's family or mean about his real life.

Do not attach a generic wry observation to every footstep. Each actual dialogue exchange needs a payoff; clear navigation labels can simply say what the player should do.

## 3. Quest structure and pacing

| Scene | Action | Payoff and continuation | Budget |
| --- | --- | --- | --- |
| 0. Login | Start as freakybat | Andrey arrives in two instalments | 0:20 |
| 1. The present | See the rare hat and meet Victor | The problem is accepting the present, not acquiring money | 0:45 |
| 2. Lunch | Share the fries; use bread at Danya's | Fractional healing; the house becomes a sandwich; acquire camera | 1:45 |
| 3. Shortcut | Take the pipe or park path; meet the pet rock | Sewer tourism; old companion follows only when carried | 1:15 |
| 4. Photo | Instruct the robot; use rock on shutter | Wrong photographs; rock takes the perfect one and earns a coin | 1:35 |
| 5. The bill | Try payment attacks; let the rock settle it | A generosity duel escalates and is resolved by the photographer's income | 1:15 |
| 6. The hat | Open the cracker with someone; choose a complaint | Final generosity callback, real hat, quest complete | 0:40 |
| 7. Victor's message | Read the birthday letter | Sincere finish without narrator interruptions | 0:35 |
| Movement and pauses | Short walks, decisions, visual reactions | No filler travel | 0:40 |
| **Target** | | | **8:50** |

These times are estimates for implementation, not measured playtest results. Keep the main chosen path's spoken/read copy approximately 850–1,050 words, including the letter. Branches below are alternatives; never play all of them consecutively. Long inspection and deliberate idling are not a reason for a hard countdown.

Use one approximately 32 by 24 tile outdoor map and two very small interiors. The player can walk between the village, Danya's door, G. Ross Park, the shore, and picnic in a few seconds. The house transformation happens in place. The pipe interior is one short bend. No loading screen between every joke.

### Cast

- Andrey: capable, friendly, outdoorsy, generous, about 195 cm; unusually good at everything except letting someone else treat him.
- Victor: equally determined to pay, with a long history of birthday administration.
- Danya: host who would prefer his house to remain residential.
- Alex: understands the absurd plan before anyone fixes it.
- Igor: delivers the actual “How are things up in the clouds?” joke.
- Anya: full participant, sharp replies, knows how to stop the men arguing.
- Alisa and Arisha: present in the photo and finale; can help with the cracker.
- Vendor: trying to sell one ordinary portion of fries.
- Keeper: has turned a municipal pipe into a tourism business.
- Robot photographer: helpful in the least useful sense of the word.
- Pet rock: silent, healthy, happy, unexpectedly successful.
- Banker: provides the rare-hat preview and a restrained touch of RuneScape economics.

The new characters and dialogue are fictional. The children's particular actions are staging, not claims about their real personalities. Appearances are editable generic sprites until references are supplied.

## 4. Full revised script

Use click-to-continue pages, typically one exchange of 2–4 short lines. Major animation runs before the response appears, allowing the player to see what the characters are reacting to. Utility choices remain visible and usable; dialogue never vanishes before it can be read.

### Scene 0: The login that needs more room

Title: **Freakybat: Just Accept the Hat**

Button: **Log in as freakybat**

Small controls: sound, text size, optional alternate name toldo, and View Classic avatar. The Classic option shows a short nostalgic sprite portrait and returns to the same early-RS2 game. No actual login or password.

**Action:** The lower half of Andrey's low-poly model appears first. It stands at the spawn point. After 0.6 seconds the upper body and head appear, revealing the tall whole character. Toggle the upper-body model group for this gag; do not require a second sprite renderer.

Chat:

> freakybat has logged in.
>
> The rest of freakybat has logged in.

**Narrator:** “There he is. We had to send him in two packets.”

This is a fictional nostalgic loading gag, not a genuine slow download. Essential assets are already loaded. Reduced-motion mode simply shows the two short messages followed by the whole sprite. Use the chosen handle consistently if toldo is selected.

Optional click on **Height: 195 cm**:

**Menu choices:** Normal / Tall / We have found the problem

Selecting any keeps his actual height and adds:

> You cannot reroll your knees.

No permanent body transformation or configuration maze.

### Scene 1: The most expensive piece of paper

The rare hat is visible inside the banker's display. Player action: **Examine Party Hat**.

**Banker:** “Zero defence. Zero warmth. Worth more than this building.”

**Andrey:** “What does it actually do?”

**Banker:** “Makes people walk up and ask you for free stuff.”

**Andrey:** “Perfect.”

**Narrator:** “A hat with conversation attached. Of course he wanted one.”

For the Santa variant, use **Zero defence. Warm ears. Still worth more than this building.** Do not quote current real-world prices.

Victor arrives.

**Victor:** “It's your birthday present.”

**Andrey:** “How much was it?”

**Victor:** “You're not being told.”

**Andrey:** “Who do I reimburse?”

An early-RS2 parchment-style birthday skill notification appears:

> Receiving Presents: 1

**Victor:** “You told me you didn't want anything.”

**Andrey:** “When?”

**Victor:** “2006.”

**Andrey:** “How long have you been working on this?”

**Victor:** “Depends whether you count the first nineteen years.”

Brief archive tooltip, available through a small MSN icon, identifies the source: in the November 2006 conversation Andrey said he needed nothing and later said he would definitely complain. The main scene uses original new dialogue; the optional archive card is explicitly shortened and translated.

**Victor:** “Meet us at the shore. Lunch, one photo, then the hat. I've called it an expedition so you'll actually come.”

Quest: **Just Accept the Hat**

Objective: **Meet the others at Centerpoint Fries.**

**Optional choice: “Can I skip straight to the present?”**

**Victor:** “You can skip lunch and the photo.”

Andrey takes one step toward the display.

**Victor:** “You'll still have to let me give you something.”

Andrey pauses.

**Narrator:** “Yes. The long route it is.”

The hat remains the final reward. This choice is a small alternate exchange, not a hidden way to skip the game.

### Scene 2A: Five people, one hitpoint

Danya, Alex, Igor, and Victor gather at the stall.

**Danya:** “One portion. Five forks.”

**Vendor:** “Four of you can use the forks to watch the other one eat.”

**Alex:** “We used to split it.”

**Vendor:** “Of course. Wouldn't want anyone accidentally having lunch.”

Action menu: **Share with the party**, **Eat it yourself**, **Buy another portion**.

#### Main action: Share with the party

The familiar inventory **Split stack** interaction opens. Quantity 1 divides into five servings labelled **0.2 portion**. One tap confirms; never make the player type a decimal.

All five eat. Each health bar briefly shows **+0.2** and barely moves. This is a temporary visual effect, not a combat system or permanent fractional-health requirement.

**Igor:** “How many hitpoints did we get?”

**Alex:** “We're sharing the hitpoint too.”

**Vendor:** “You could just take turns being alive.”

#### Alternate first action: Eat it yourself

The four friends move into a neat escort formation, watching the fry travel toward Andrey's mouth. At the last moment, all four forks rise. Andrey lowers it and the share action completes.

**Danya:** “You know the rules.”

**Narrator:** “Four bodyguards. All protecting the fries.”

No lost food, death, or retry. Different staging; same lunchDone result.

#### Alternate first action: Buy another portion

Five anonymous friendly NPCs immediately arrive behind the existing group. Their overhead text says:

> Heard there was food.

**Narrator:** “I said double the portion. He doubled the party.”

Share both trays automatically. Extra guests are background decoration, not five additional quest targets. They later appear at the edge of the photo. This is a single-use branch with a fixed small sprite cap.

Each route produces an unpaid **Lunch bill** for a fictional 1 gp. On the extra-portion branch the vendor waves off the extra tray rather than creating an incompatible second bill:

**Vendor:** “Take it. This is becoming a crowd-control issue.”

The symbolic price is gameplay fiction, not a real historical price. No one actually pays until Scene 5.

#### Height callback

As everyone leaves, Igor asks:

**Igor:** “How are things up there in the clouds?”

**Action:** A tiny cloud issues rain at Andrey's head only. He lowers his head toward Igor; the cloud follows and rains on Igor instead.

**Andrey:** “You tell me.”

Then it dissipates. This is the main height joke. Keep the real player about 15% taller than the other adults; avoid making every scene a tall-person sketch.

### Scene 2B: Danya's sandwich

Danya's door is a few steps away.

**Danya:** “The camera's at mine. There's bread too. Make yourself a sandwich.”

A bread icon appears in inventory. The clearly highlighted primary action at the door is **Use bread at Danya's house**. Show the old-style item-target text:

> Use Bread → Danya's house

**Action:** Two giant bread slices slide around the entire building. The house becomes the filling of an enormous sandwich. Danya appears at an upstairs window.

Chat:

> You make Danya's sandwich.
>
> Cooking level: considerably more than was requested.

**Danya:** “I meant IN my house.”

**Andrey:** “You said help myself.”

**Danya:** “To lunch, Andrey. You've helped yourself to real estate.”

**Narrator:** “Excellent. You've made a sandwich. Now put the neighbourhood back.”

The image must carry this joke: visible bread, house wall, door, and Danya at a window. Do not reduce it to an item description.

Choices:

**“Eat.”**

Danya retreats from the window and reappears at the door with a suitcase. Andrey takes a harmless bite from a bread corner; the building is intact.

**Danya:** “At least let me get my shoes.”

**“Share.”**

Dashed cutting lines divide the house into rooms. Alex and Igor point at different rooms.

**Alex:** “I'll take the kitchen.”

**Igor:** “I'm not eating the bathroom.”

**Danya:** “Nobody is eating the bathroom!”

**“Pack it for later.”**

The entire sandwich shrinks toward an inventory slot. Danya runs out just before it lands.

**Danya:** “You'll never fit that in your bag.”

It fits perfectly.

**Narrator:** “Twenty-eight slots. Finally, a sensible use for one of them.”

**“Put it back.”**

Bread slides away. Danya checks the front step.

**Danya:** “Thank you. There are now crumbs in the basement.”

Each chosen branch ends with **Put the house back** as an obvious action. The Pack branch returns the item to the same location with one tap. Restore the building exactly once; then Danya hands over the DSLR camera and a small **House sandwich souvenir**. It is a harmless miniature, not the original house left permanently missing.

The souvenir persists and can reappear in the photo scene. Do not require choosing every branch, typing an object name, or guessing the specific command.

Objective: **Take the camera to the shore.**

### Scene 3: The municipal safari

Two labelled routes lead toward the same shore: **Park path** and **Sewer shortcut**. The pipe carries a small sign:

> G. Ross Park
>
> Not a tourist attraction

Hover/tap primary action on it:

> Visit tourist attraction

**Narrator:** “A lovely park path. A municipal drain. I have given him a choice, which was my first mistake.”

#### Sewer route

**Keeper:** “You know that's a sewer?”

**Andrey:** “We used to go in there at school.”

**Keeper:** “For what?”

**Andrey:** “We were outdoorsy.”

**Keeper:** “You were underneath outdoors.”

On Enter, the low-poly character crouches. Chat:

> You temporarily unequip Standing Up.

Inside, the Keeper has set up an absurd miniature guided tour. Use the existing pipe, one light, and simple placards rather than another elaborate level.

He switches on a spotlight illuminating a rock.

**Keeper:** “Local wildlife. Guaranteed sighting.”

**Andrey:** “That's a rock.”

**Keeper:** “And yet: guaranteed.”

A penguin waddles through the edge of the scene, carrying a small South Africa luggage tag.

**Andrey:** “That's a penguin.”

**Keeper:** “That one's not on my list.”

The penguin continues toward the picnic as background decoration. No penguin fetch quest or new map.

#### Park-path route

At the pipe exit the Keeper rolls out the same spotlight and rock:

**Keeper:** “You missed the underground safari.”

**Andrey:** “What did I miss?”

**Keeper:** “The same rock, with considerably worse lighting.”

The penguin then passes:

**Keeper:** “Also, apparently, whatever that is.”

This route gets its own short payoff. Do not play the sewer dialogue after a player deliberately chose the park.

#### Old companion

The rock is named **Sweet, healthy, happy rock**. A small MSN icon reveals Andrey's actual display-name text from 7 November 2004:

> My pet rock is so sweet, healthy and happy. I just love him.

**Andrey:** “You're still here?”

**Rock:** “...”

**Narrator:** “Same personality. Excellent health. Hasn't once asked what you do for work.”

Action: **Adopt**.

Chat:

> Your pet rock will now follow you.

The rock remains still for 0.8 seconds.

**Narrator:** “You'll need to supply the following.”

Andrey picks it up. This reunion is a main story beat. The rock is carried to the photo location; it cannot be lost or destroyed. Either route reaches the same rock.

Optional **Check skills** shows a small joke card:

| Birthday companion skill | Level |
| --- | --- |
| Sit | 99 |
| Stay | 99 |
| Recall | 1 |
| Photography | 1 |

**Narrator:** “The Recall problem is being treated with a pocket.”

Optional **Mine**:

Andrey raises an imaginary pickaxe; the rock's tiny face looks toward him. He lowers it.

> You cannot train Mining on your friends.

The rock is safe. No actual tool or damage system is needed.

### Scene 4: One good photograph

Anya, Alisa, and Arisha wait at the shore. Rollerblades are beside Anya. A small clockwork robot has been hired as an assistant photographer. It looks like a simple fantasy contraption, not a character from another game.

**Anya:** “One family photo. Then lunch.”

**Andrey:** “What about the light?”

**Anya:** “We got married during Victor's lunch break. You can pick an aperture.”

This is affectionate fiction based on the real wedding timing. It does not claim to quote Anya or describe the actual ceremony.

**Andrey to robot:** “Take a photo of Anya, Alisa, Arisha, and me.”

**Action:** The robot positions its own head very close to the lens. First photo: enormous robot face, family small but visible behind it.

**Anya:** “Why is the photographer in the photograph?”

**Robot:** “Family members: Anya. Alisa. Arisha. And me.”

**Andrey:** “Not you.”

**Robot:** “Name updated to Not You.”

The robot's overhead name really changes to **Not You** and persists for the rest of the quest.

Give the player a short action menu:

- **Say cheese.**
- **Zoom out.**
- **Use rock on shutter.**

#### Say cheese

Robot turns the camera toward the **House sandwich souvenir**. A tiny piece of cheese is visibly part of its filling. It takes a perfect product photo.

**Andrey:** “That's a sandwich.”

**Robot:** “Contains cheese. Instruction completed.”

**Danya, in background:** “Please don't put my kitchen on the menu.”

After this branch, offer Use rock on shutter prominently. The incorrect action gets one payoff, not a reset.

#### Zoom out

The robot walks away with the camera, rather than changing the lens. The image turns into a distant tiny group. A simple comic location label appears:

> Photographer: Palm Springs

**Andrey:** “The lens. Zoom out the lens.”

**Robot:** “You should have said that before I crossed the county line.”

This is a staged visual exaggeration. Do not build Palm Springs or actually move a critical actor off the playable map. Reset its staging position after the branch.

Again, offer Use rock on shutter.

#### Main solution: Use rock on shutter

Andrey puts the camera on a tripod and a rock on a simple shutter lever, then joins his family. A one-second self-timer finishes the action. All four family members are properly framed, with friends in the background. The robot is visible at the side with its new name.

**Anya:** “That one's lovely.”

**Andrey:** “He's got an eye.”

**Narrator:** “He doesn't. That's what makes this so upsetting.”

Early-RS2 parchment-style level notification:

> Your pet rock has advanced a Photography level.
>
> His Photography level is now 99.

A couple of background overhead messages:

> gz rock
>
> nice

Vendor approaches and points to the sandwich thumbnail, whether it was taken through Say cheese or appears as a small bonus thumbnail generated after the family photo.

**Vendor:** “I'll give him a coin for that one. It can go on the menu.”

A small 1 gp coin drops beside the rock. Store **Rock's first earnings: 1 gp**. This is the planted solution for the payment scene.

**Narrator:** “One photograph. First paying client. I am not narrating his entire career.”

Objective: **Join the picnic and collect the hat.**

If the player chooses Use rock immediately, skip both wrong-photo branches. The first robot-face shot, perfect family photo, level-up, and income still happen. If both wrong choices are sampled, each is available only once. Back/Reopen resumes the current step without repeating already seen gags.

### Scene 5: The generosity duel

The fries bill reaches the table. Both Andrey and Victor step toward it.

**Victor:** “I've got this.”

**Andrey:** “No, I've got this.”

Chat:

> Victor has challenged you to a generosity duel.

**Narrator:** “Two men enter. Both want to leave with less money.”

The small payment scene becomes a recognisable RPG encounter. Mock-dramatic music. Coin pouches instead of weapons. Two **Insistence** bars; no health loss.

Main commands:

- **I'll pay.**
- **Pay for everyone.**
- **Pay secretly.**
- **Split it.**
- **Let the rock handle it.**

Each command triggers a short visible action and its own exchange. After two unsuccessful tactics highlight the rock solution. After three, the rock pays automatically. No endless shouting, lost currency, or actual payment interface.

#### I'll pay

Andrey shouts **NO, I INSIST!** A yellow speech shockwave pushes Victor two tiles back.

Victor counterattacks with **YOU GOT IT LAST TIME!** and a coin-pouch parry.

**Andrey:** “You've been using that line for twenty years.”

**Victor:** “Why change a winning strategy?”

Their coins remain symbolic. The hit is to the argument, not the characters.

#### Pay for everyone

Andrey's coin wave expands to every nearby NPC. One coin reaches the anonymous guests, Keeper, penguin, and robot. The robot prints its own receipt.

**Narrator:** “Area-of-effect generosity. He's paying for people we haven't introduced yet.”

**Victor:** “Fine. I'll pay you back.”

**Andrey:** “Then I'll pay you back for paying me back.”

A tiny coin bounces back and forth between them three times, speeding up. Anya catches it in mid-flight.

#### Pay secretly

Andrey creeps sideways toward the vendor in an exaggerated stiff-legged early-RS2 sneak walk. Victor is already standing there with a stamped receipt.

**Victor:** “Nice try. I paid while you were choosing dialogue options.”

That receipt is a comically premature claim, not the authoritative bill state. The vendor turns it over to reveal **NICE TRY**. No branch may resolve the bill or award the hat until the rock's real payment or the automatic convergence.

#### Split it

**Anya:** “Half each.”

**Both men:** “I'll pay his half.”

The trade panel allocates both halves to each man: two cheerful green 100% labels. It folds itself closed in despair.

**Narrator:** “Even the fractions have given up.”

#### Let the rock handle it

The rock's earned coin rolls onto the bill. The vendor accepts it. Music cuts to one small coin clink.

Pause for 0.8 seconds. Both men look at the rock.

**Andrey:** “I'll pay him back.”

**Anya:** “Why do you think he's so quiet?”

**Narrator:** “For years, the rock has been practising the only defence that works.”

Quest state: billResolved. The rock's coin is consumed once. All pretend money effects vanish. The scene stays warm: no one has been injured, bankrupted, or told to stop being kind.

Optional tap on robot receipt afterwards:

> Photographic services: replaced by a rock.
>
> Remaining service: unsolicited receipts.

### Scene 6: Just accept the hat

Victor hands over the cracker.

**Andrey:** “A Christmas cracker? It's November.”

**Victor:** “You asked for nothing. This is what happens when you leave me unsupervised.”

Primary action: **Open with someone**. Choose Victor, Anya, Alisa, or Arisha; all award the same hat.

Optional **Pull alone**: cracker stretches and snaps back intact.

**Narrator:** “You've spent the whole quest collecting people. Borrow a pair of hands.”

Optional **Open with rock**: cracker rests beside a motionless rock.

**Andrey:** “He's been surprisingly useful today.”

**Narrator:** “Photography is one thing. We haven't unlocked elbows.”

Then return to the people choices. A wrong attempt never consumes the cracker.

#### Opening with Victor

They pull; the hat appears between them.

**Victor:** “You take it.”

**Andrey:** “No, you take it.”

**Narrator:** “No. No, we're not doing this again. You. Tall you. Hat. Now.”

The hat equips automatically.

#### Opening with Anya or a daughter

They pull; the hat appears. Andrey starts to speak.

**Andrey:** “Can I at least pay for...”

**Narrator:** “No.”

Hat equips automatically. The interruption is brief, readable, and happens only here.

Hat pose and a short reward flourish. It must be recognisable and genuinely satisfying.

**Victor:** “Well? Going to complain?”

Choices:

1. **It's made of paper.**
2. **I wanted nothing.**
3. **Where are the matching boots?**

Replies:

1. **Victor:** “At that price, you'd expect lamination.”
2. **Victor:** “It gives zero defence. You basically got nothing.”
3. **Victor:** “Have a look under Leftovers. You made a house earlier.”

For Santa hat, replace choice 1 with **Does it come in blue?** and reply **Victor: That's next year's entire development budget.** The other two can stay.

Completion panel:

> Just Accept the Hat: Quest complete
>
> 1 rare hat
>
> 1 quest point
>
> Danya's house restored
>
> A family photo taken by a rock

One small final chat line appears:

> New side quest: Pay Victor back.

Anya crosses it out:

> Cancelled by Anya.

Then stop comedy narration. Button: **One more thing**.

### Scene 7: The actual birthday message

Use this editable draft. No gag, robot sound, achievement, or narrator interruption appears on top of it.

> Happy birthday, Andrey.
>
> In 2006, I wished you good friends, a good job, a beautiful and smart wife, and plenty of happiness. Finding that old message made me smile.
>
> From sharing fries in Toronto to spending Christmases together with our families in San Diego, I'm so glad we've kept adding chapters to this friendship. You're still curious, generous, and always ready for an adventure, now with Anya, Alisa, and Arisha alongside you.
>
> Here's to many more adventures together.
>
> Victor

Buttons: **Back to the party**, **Our photo**, **Play again**.

The completed world stays playable with the equipped hat, rock, photographs, friends, and restored house. The message can be reopened through Victor. Replay confirms clearing quest progress but keeps sound/text settings.

## 5. Optional interactions worth keeping

Keep optional content concentrated: a good visual outcome or one short exchange. No long biography dialogue, travel museum, or compulsory postcard reading.

| Interaction | Outcome and copy |
| --- | --- |
| Kick football | Andrey makes a good shot; goalkeeper decides to applaud rather than attempt the save. “I was there for moral support.” |
| Examine volleyball | “A sport for days when football wasn't using enough of his arms.” |
| Pet rock | Rock moves two pixels. Full fanfare. “Easy. You'll make him think he's a dog.” |
| Examine house souvenir | “Packed lunch. Contains downstairs.” |
| Use souvenir on bank | Banker: “We accept valuables.” Andrey: “There's a house in it.” Banker: “Then why is it in Food?” |
| Try selling pet rock after photo | Vendor: “Does he have a website?” Andrey: “He's a rock.” Vendor: “So he'll actually answer his emails.” Rock remains with Andrey; no sale. |
| Use camera on hat | All friends lean into the frame. “The first thing he photographed without adjusting the lens.” |
| Examine Mykonos moped card | “Anya rode with Andrey. The rest of us were trusted with our own steering.” |
| Examine South Africa tag | “Safari equipment: camera, sensible shoes, room for an unexpected penguin.” |
| Sit on quiet bench | Narrator: “No quest. No loot. Nobody asking you to collect five cabbages.” After two seconds: “I can put some cabbages nearby if this is making you uncomfortable.” |
| Examine old MSN button | Display name « I are Freaky ». Small birthday stats: “Grammar: 1. Confidence: 99.” |
| Examine current home sign | “Santee. Base camp. The sofa is mostly theoretical.” |

“Try selling” only opens a comic conversation. It never actually sells the companion, even after completion. Likewise the house souvenir is a prop, not an item that can make the map inaccessible.

The optional bench lightly recognises his interest in self-discovery. An **India: possible future adventure** note can sit nearby; do not imply the ashram trip happened.

Las Vegas, Palm Springs, Salton Sea, and Christmas in San Diego can appear as a few optional thumbnails after the letter. Three brief captions:

- Las Vegas: “Two families. Andrey considered this an outdoor activity.”
- Salton Sea: “We went to have a look. This explains most of our itinerary.”
- Christmas in San Diego: “Same friends. More stockings.”

No new destinations or travel minigames. Omit the occasional cigar and the vulgar camping catchphrase. Use a tent prop without reproducing the phrase or portraying him as habitually drunk.

## 6. Comedy direction for implementation

### Staging

1. Show the ordinary setup clearly: house, bread, bill, camera, cracker.
2. Let the player choose or perform the familiar action.
3. Show the surprising consequence before explaining it.
4. Give the affected character the first reaction.
5. Use the narrator only for the stronger second reaction.
6. Preserve an outcome or souvenir so a later scene can refer to it.

The house should become a sandwich before Danya speaks. The robot should appear in its own photo before the explanation. Victor should already be at the till before his line. A menu label alone cannot substitute for those actions.

### Timing and repetition

- Use brief anticipation, generally 0.2–0.5 seconds, then the action.
- Give a major visual payoff roughly 0.6–1 second to register.
- Keep each action animation approximately 1–3 seconds total.
- Strong reactions use a manually advanced dialogue page; no unreadable rapid subtitle stream.
- On repeated clicking, do not replay a full scene. Repeat-safe short acknowledgements or ordinary movement are fine.
- Cap payment escalation at three non-resolving attempts; cap robot wrong branches at two; finish house after one branch.
- Do not add a button-mashing test, punitive failure, or hidden answer to force the joke.
- Major sounds underline events; they do not depend on loud jump scares.
- The family and companions are active contributors, not merely an audience for the narrator.

### Editorial pass

Read every exchange out loud. Remove the weakest narrator line in a sequence when the scene is already funny without it. Tighten setup rather than following it with an explanation of the joke.

Do not replace specific lines with “Well, that happened”, “Quest requirements updated”, “We have decided not to investigate”, or a generic bureaucratic remark. Do not keep a joke because it names a personal detail; the detail must cause something amusing.

Avoid an entire game made of puns, memes, snark, or literal word misunderstandings. The house uses literal item logic; the rock earns a payoff through surprising competence; the bill uses a real relationship dynamic; the finale uses escalating social callbacks.

Keep birthday skill notifications clearly fictional. Do not pretend the displayed skills are Andrey's actual historical account. Early RuneScape 2's real skill interface can remain in a small period-accurate panel; **Receiving Presents** and the rock's skills are special birthday overlays.

## 7. Art and assets

### Early-RS2 visual language, approximately 2004

Low-poly 3D characters with simple body shapes, angular scenery, muted olive grass, brown paths, flat blue water, and grey stone. Stiff, simple walking and interaction animations. Low-resolution textures where appropriate; restrained flat shading and basic lighting.

The desktop interface should immediately evoke the supplied screenshots: stone-textured client surround, world view toward the upper left, circular minimap toward the upper right, icon tabs and an inventory panel below it, parchment-coloured chat/dialogue beneath the world, and a simple bottom control row. Important dialogue is readable and manually advanced.

Use a **28-slot inventory arranged in four columns and seven rows**. Change the house-packing line to “Twenty-eight slots. Finally, a sensible use for one of them.” The 30-slot Classic inventory belongs only to the old version and is not used in the main game.

Use approximately **765 by 503 logical pixels for the desktop client**, with a roughly **512 by 334 world viewport**, as practical layout targets. Exact spacing should follow a chosen period-appropriate reference. On phones, reflow the panels rather than shrinking the entire desktop frame to unreadable size.

Avoid smooth high-detail characters, physically realistic surfaces, modern shadows/bloom, cinematic lighting, RuneScape HD, RuneScape 3 interfaces, and modern OSRS additions. The party should look like it could have been playing in the early 2004 client. The screenshots may be from nearby later years; copy their general visual language while checking period-specific content.

Andrey is approximately 15% taller than other adult models. Temporary exaggerations belong to a particular animation, not a permanent giant-monster model. Give characters simple editable appearances; do not claim facial accuracy without references.

### Required original assets

| Model, texture, or asset | Contents |
| --- | --- |
| Player model | Tall low-poly adult, hierarchical body parts, idle/walk, crouch, holding camera/rock, equipable hat |
| Friends/family models | Reusable adult rig and two smaller child templates; editable colours and hair |
| Supporting actor models | Vendor, Banker, Keeper, clockwork robot, penguin, pet rock |
| World models | Tile terrain, tree, stall, bank display, Danya's house, pipe, jetty, picnic, bench, goal |
| Comedy models/effects | Giant bread slices, room cutting marks, suitcase, cloud/rain, coin pouches, speech shockwave, receipts |
| Inventory/icon atlas | Fries, bread, camera, bill, house sandwich souvenir, rock, earned coin, cracker, hats |
| Photo recipes | Robot foreground, sandwich, distant group, perfect family group |
| UI textures/icons | Original stone frame, parchment, small readable icons/glyphs; all copy is real text |
| Classic cameo | One original 2D legacy-avatar portrait in the optional login card |
| Audio | Original music motifs, login notification, paper pull, shutter, coin, restrained fanfares |

Generate the simple 3D models in JavaScript where practical. Use small geometries, flat vertex colours, and uncomplicated body hierarchies. This avoids heavyweight modelling/export dependencies while retaining the correct 3D look. A few local model files are acceptable if useful, but no hosted model service is required.

Animate the house sandwich with two bread meshes surrounding the building. Draw cutting lines as an overlay; use scaling for the pack branch. Do not simulate destruction or procedurally cut geometry into arbitrary rooms.

The rain cloud follows a temporary head anchor, then dissolves. The payment coin waves are capped decorative instances or small billboards, not physical currency. These effects can use sprites without turning the actual characters back into Classic-style sprite people.

The photo is rendered from the game scene, not a fabricated real photograph of the family. Save compact camera/actor scene recipes so it can be reconstructed after refresh.

Use original code-drawn artwork for precise inventory icons, the small legacy portrait, and interface parts. Image generation may help with stone/parchment textures and decorative sheets; inspect and normalise them to the same palette and detail. Do not ask an image model to draw UI text, animated 3D character directions, or the entire walkable world as one painting.

## 8. Sound

Original MIDI-like village music, a short mock-dramatic payment variation, a warm quiet letter variation. No copied soundtrack or recognisable original MSN melody.

Start/resume Web Audio inside the Start-button gesture. Visible mute, independent music/effect gain, saved settings, graceful suspended-context handling. The entire story works silently.

A single disproportionately formal fanfare for the rock is funny; constant loud level-up jingles are tiring. Avoid replaying it when an action is repeated.

Text narrator is the baseline. Optional recorded original voice work can be added if suitable tools are available; do not imitate the actors from the reference games. Do not depend on browser text-to-speech to rescue the writing.

Pause active scheduling when hidden and resume without playing a backlog. Missing optional sound must never block the quest.

## 9. Technical plan

### Project

Static index.html, styles.css, native ES modules, locally vendored rendering-library files, local assets, README, and .nojekyll. No framework, runtime CDN, API, account, backend, or multiplayer service. A local JavaScript rendering library remains fully client side and compatible with GitHub Pages.

Suggested modules: main, config, world, render, input, quest, dialogue, audio, save. Keep them small. Store names, birthday, editable appearances, final letter, reward type, and material-specific copy in config.

Use a small WebGL scene through a locally vendored, pinned version of Three.js, plus HTML/CSS menus and chat. Import its ES modules from relative local paths and retain every required internal module file; include the library's licence. No runtime CDN or package service is used. A build tool is optional during development; the published output is static JavaScript and assets.

The elevated camera, actual low-poly character models, flat-colour terrain, and simple objects are central to the early-RS2 look. Use one restrained camera angle for the main quest; optional compass controls can rotate it after the core interactions work. No action requires camera manipulation. Raycast against simple enlarged interaction proxies and the ground, then use the same grid pathfinding as before. Hide roofs or make foreground walls unobtrusive inside the house/pipe. Bound geometry, effects, draw calls, and device pixel ratio; do not build a general RPG engine.

Most models can be generated directly in JavaScript from small flat-shaded geometries and hierarchical body parts. Animate those groups for walking, crouching, holding the rock, and coin-pouch movements. The fixed environment stays small; this is a visual recreation for one quest, not a recreation of the original client engine.

Use a grid for collision and A* or breadth-first pathfinding. Walk into interaction range before the primary action. New clicks cancel previous queued movement. Stop NPC wandering during dialogue. Followers and joke movements cannot block paths.

### Quest state

Use one serialisable, authoritative state.

| Field | Meaning |
| --- | --- |
| saveVersion | Versioned save schema |
| handle | freakybat or toldo, same player |
| region/playerPosition/facing | Restore in a valid region |
| introDone | Hat preview and invitation seen |
| lunchDone/lunchBranch | Friends fed; chosen first branch recorded |
| extraGuests | Fixed count of five if that branch was chosen |
| houseStep/houseBranch | Original, transformed, selected branch, restored |
| houseRestored/cameraOwned | Camera handoff after restoration |
| routeChoice | Sewer or path; different short dialogue |
| rockAdopted/rockLocation | Rock collected, later on shutter/at picnic |
| photoStep/photoWrongChoices | Resume without replaying old shots |
| photoDone/photoRecipes | Completed family photo and optional wrong shots |
| robotName | Permanently becomes Not You |
| rockCoin | 0 or 1; earned at photo and consumed at payment |
| billAttempts/seenPaymentTactics | Cap attempts; never replay the same full tactic |
| billResolved | Authoritative settlement, only by rock |
| crackerOpened/hatEquipped | Award once; reconstruct completed scene |
| letterSeen | Message can always be reopened after reward |
| settings/seenOptionalGags | Saved preferences and bounded repeats |

### Main transitions

1. Login and intro → lunch.
2. Any lunch branch completes feeding and produces the same 1 gp bill.
3. Transform house, select at most one optional response, restore → camera.
4. Either route → shared rock reunion, adopt → shore.
5. First robot shot → optional one/two wrong choices → rock-assisted group shot.
6. Group shot → vendor buys the sandwich thumbnail → rockCoin = 1.
7. Payment tactic(s) → rock settles bill → rockCoin = 0 and billResolved.
8. Cracker with a human → award and equip hat once.
9. Completion → sincere letter → completed world.

The direct rock-photo path creates the small product thumbnail automatically along with the family photograph, so it still earns the coin without requiring Say cheese. That dependency must be explicit in implementation.

The sandwich souvenir is decorative and non-destructible. Even if hidden from the inventory UI, its photo recipe can be reconstructed. It is not a real piece of the restored house.

### Atomic actions and resume

Commit a state-changing result once, then animate. Save immediately at stable transition points. If interrupted during house packing, resume with Put the house back available. During photo setup, resume at the current action menu. After rock income or payment, reconstruct exactly one earned/consumed coin. After the cracker, reconstruct exactly one hat.

Do not persist animation timers or a half-disabled input layer. Reconstruct visuals from the logical state. Validate loaded data, ignore incompatible/corrupt saves gracefully, and allow a full in-memory playthrough when local storage fails.

No plot-critical item can be destroyed, sold, or permanently dropped. Choosing a comic sale, mining, or eating action must not remove the camera, rock, bill, cracker, or reward.

Early visits give a character-specific useful line and a clear return action. No hidden skip to the hat. No arbitrary invisible walls or empty “not available” menus.

### Desktop and phone

Desktop: click ground to walk; click actor/object for primary action; right click for secondary actions; Escape closes optional menus; Enter/Space advances active dialogue. The main quest does not require keyboard movement.

Phone: tap to walk; tap actor/item to open a labelled action sheet. No hover, right click, precision drag, long press, or keyboard is necessary. Inventory shortcuts expose bread-at-house and rock-on-shutter actions directly.

Portrait: world above readable dialogue and bottom tabs. Landscape: world with a compact drawer beside it. At least 44 CSS-pixel action targets and approximately 16 CSS-pixel dialogue. Reflow large text. Phone rotation retains scene and selected item.

Use Pointer Events without duplicate mouse/touch activation. Prevent gestures only over the active canvas, not menus or the letter. No compulsory fullscreen or orientation lock.

Use accessible HTML buttons, visible keyboard focus, and an optional nearby-target list. Reduced-motion mode replaces big motions with clear static before/after images. It preserves clues and dialogue.

### GitHub Pages and performance

All imports, fonts if used, images, and sounds resolve relative to the repository path. Test a local HTTP server and a repository-style URL subpath; do not assume ES modules will work from a double-clicked file URL.

Use requestAnimationFrame, clamp long deltas, clear stuck input on blur, pause simulation/audio when hidden. Cache fixed scenery. Limit decorative particles/extra actors. Aim for about 5 MB initial assets where feasible.

Load essential images before Start; a failed critical asset needs a retry or useful error. Optional audio failure is harmless. No remote fetch is necessary once the static files are served.

Keep the original XML archives outside the public repository and shipped static directory. Only the selected clean status/translated lines belong in the game.

## 10. Development order and acceptance

1. Establish a faithful early-RS2 visual slice with walking, one low-poly character, a building, stone frame, minimap, and readable parchment chat. Compare to supplied screenshots and a period-appropriate 2004 reference. Keep the optional Classic portrait separate from the main look.
2. Implement the complete progression and letter with coherent provisional art.
3. Finish the major gag animations and actual branch reactions.
4. Finish original artwork/audio, especially the house sandwich, robot shots, duel, and real hat.
5. Verify every main action using taps only; check resize, rotation, larger text, mute, and reduced motion.
6. Add the bounded optional actions. Do not add a second campaign or more destinations.
7. Read the script aloud, do a natural first-play timing, and revise weak lines or slow transitions.
8. Deliver the GitHub Pages-ready static repository and a concise README. This task does not request a Sites deployment.

| Check | Must pass |
| --- | --- |
| First play | Recognisable game, understandable goals, normal completion within 10 minutes |
| Every lunch route | Same valid bill/progression; extra NPCs are decorative |
| Every house choice | Building can be restored, camera handed over, souvenir preserved |
| Both routes | Correct route-specific dialogue; same rock and shore |
| Direct photo solution | Works without wrong branches and still earns the rock's coin |
| Robot mistakes | Both are single-use, return to a usable menu, do not move critical actors off-map |
| Payment tactics | Distinct payoff, capped repetition, no false receipt settles the real bill |
| Rock settlement | Coin consumed once; bill resolved once; no other branch can skip it |
| Cracker attempts | Solo/rock preserve item; any human partner awards one hat |
| Refresh | House packing, photo setup, income, payment, and cracker all resume safely |
| Phone | Whole quest completed with taps; no inaccessible hover or tiny target |
| Hosting | Repository subpath works; rendering library and all assets load locally with no required remote dependency |
| Visual period | Early-RS2 low-poly characters, stone/parchment interface, and 28-slot inventory agree; later features are not imported from reference screenshots |
| Tone | No profanity; no humiliating private archive material; family are active and respected |
| Comedy | The promised visual consequences actually occur, and the narrator responds to the chosen actions |
| Ending | Reward is satisfying, narrator stops, Victor's message is uninterrupted |

Verification must distinguish implemented and actually tested behaviour from planned behaviour. A developer clicking fast does not establish first-play duration. The laughter cannot be playtested from the document; deliver the scenes, then judge the implemented reactions and timing with a real playthrough.

## 11. Source grounding

The personal foundation remains Victor's account: Odessa to Toronto; tall, sporty, friendly, generous Andrey; shared Centerpoint fries; lunches at Danya's; MSN; G. Ross Park pipes; football; the Toronto Islands rollerblading introduction to Anya; their wedding during Victor's lunch break; South Africa and penguins; Mykonos mopeds; DSLR photography; robotics; Santee with Anya, Alisa, and Arisha; family trips and Christmases; possible future India/ashram interest.

The four uploaded XML files are two duplicate pairs, containing two unique logs: 19 messages from November 2004, and 213 messages from June 2005 to December 2006. Not every message is from the same school year.

Verified archive hooks:
- Pet-rock status on 7 November 2004; playful display name, not evidence of owning a real pet rock.
- “I are Freaky” and “a beautiful mind” display-name variants.
- Birthday conversation on 21 November 2006: Andrey replied that his birthday was yesterday.
- “Honestly, I don't need anything” and “I'll definitely complain” are clean translations of his messages from that session.
- Victor's wish about friends, work, wife, happiness supports the final letter.

Everything involving talking game characters, a house sandwich, the tour operator, robot, rock career, symbolic payment combat, and new dialogue is original fictional comedy. It must not be labelled as a transcript or an actual historical event.

Victor further confirms that they played both RuneScape Classic and early RuneScape 2 around 2004. The main early-RS2 appearance is the design choice for this brief, based on that clarification and the supplied screenshots; Classic is represented by a small nostalgic portrait.

The birthday is 20 November. Do not infer an age, actual old account statistics, current job, daughters' ages, or physical likenesses.

## 12. Comedy research references

These are for the implementer. The techniques described above are our interpretations. The new script does not quote game jokes.

- [The Stanley Parable developers' playful showcase](https://www.gamedeveloper.com/design/the-stanley-parable-dev-showcase-secrets): useful for competing narrator/creator expectations and escalating corrections.
- [WHAT THE GOLF? developer press kit](https://triband.net/press/whatthegolf): action surprises and familiar play conventions changing meaning.
- [McPixel 3 creator's account](https://news.xbox.com/en-us/2023/03/17/new-mcpixel-3-levels-announced/): distinct outcomes for attempts, small rapid situations, rewarding experimentation.
- [Chuchel official site](https://amanita-design.net/games/chuchel.html): physical situations, animation, music, and expressive reactions.
- [Job Simulator official site](https://jobsimulatorgame.com/): a robot-mediated imitation of ordinary human activity.
- [Later Alligator developer page](https://pillowfight.itch.io/later-alligator): small character interactions, expressive supporting cast, comic situations.
- [Say No! More publisher page](https://thunderfulgames.com/games/say-no-more/): exaggerated social conflict represented as an action.
- [BattleBlock Theater narrator's development account](https://blog.thebehemoth.com/2013/06/07/will-stamper-the-voice-of-battleblock-theater/): whole-story planning, quicker delivery, reading lines aloud, relating reactions to events.
- [Little Inferno developers on writing and item descriptions](https://tomorrowcorporation.com/posts/hey-kids-little-inferno-sold-1-million-copies): compact humour in descriptions and combinations.
- [The Darkside Detective publisher's dialogue-development account](https://www.akuparagames.com/2022/04/20/twitter-campaign-darkside-dlc-case/): brief character responses tied to a developing situation.
- [Graphics history and early-RS2 distinctions](https://runescape.wiki/w/Graphics)
- [Original Classic overview and client references](https://classic.runescape.wiki/w/RuneScape_Classic): optional portrait reference only.
- [Inventory layout reference](https://runescape.fandom.com/wiki/Inventory): 28 slots for the main RS2-style inventory.
- [Three.js installation and static output](https://threejs.org/manual/pages/installation.html)
- [Three.js local module-path example](https://threejs.org/manual/pages/prerequisites.html)
- [GitHub Pages static-hosting documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
- [MDN Web Audio guidance](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices)
- [MDN Canvas optimisation](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas)

## 13. Prompt to give Codex

> Build the full client-side birthday game in this revised brief for GitHub Pages. Implement the actual comic consequences: split login, fractional fries, house sandwich with branches, park/sewer alternatives, the carried pet rock, the robot's wrong photos, the rock's photography income, payment attacks, cracker, rare hat, and sincere ending. Preserve the exact short exchanges where possible. Use early RuneScape 2 around 2004 as the main visual target: low-poly 3D characters, stone/parchment interface, circular minimap, and 28-slot inventory. Include only a small optional Classic-avatar portrait, with one world renderer. Keep English, no swearing, desktop and phone controls, local assets including the rendering library, saving, and 5–10 minute scope. All reference games are comedy influences only. Complete the quest before optional extras. Verify the acceptance checks you can run, report the rest accurately, and deliver a ready-to-host static repository. A line of dialogue is not an implementation of a visual gag.


