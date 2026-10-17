# Freakybat: Please Stop Farming Me
## Consolidated dialogue and implementation brief for Codex

Version: 4. Exported 17 October 2026.

This is the consolidated replacement manuscript: the revised jokes from the dialogue review, followed by the expanded Alex and family material. Where the two revisions overlap, the expanded family revision takes precedence. This document is self-contained. Implement the canonical scenes below, not earlier superseded versions of them.

This is an authoring and integration specification, not verified executable JavaScript. The full game project has not been inspected or tested for this export.

## 1. Task and creative direction

Implement this story and its event wiring in the existing game. Preserve its interface, RuneScape-style presentation, map, graphics, movement, controls, phone support, and audio presentation. Inspect the actual scene runner, script.js, main.js, and relevant callers before editing. Merely replacing strings in old events will leave the old quest in place.

The birthday announcement has accidentally advertised Andrey as a boss encounter. He registers under his existing alternate handle, Toldo, to claim his own partyhat. The banker knowingly accepts the alias because he only checks names. The family helps capture Andrey on camera. Andrey holds the banker to his wording, collects the hat, and returns to the family.

Anya, Alisa, and Arisha are central to the game, not a short stop on the way to the bank. Each has a substantial individual conversation and a role in the shared photograph and ending. Alex has his own conversation, not just reaction lines in Danya's scene. Keep the bank confrontation as the comic climax, but finish at the shore with the family and then Victor's sincere birthday message.

Humour principles:
- Use situational absurdity, literal quest rules, sharp comebacks, and personal callbacks.
- Let Andrey win exchanges, while allowing friends and family to tease him as equals.
- Anya is an affectionate partner in the scheme, not a recurring chores joke.
- The girls participate in the plot. Their comic roles here are writing choices, not verified personality descriptions.
- Avoid adding a line that explains the preceding joke.
- Plain connecting lines and useful hints need not be jokes.
- Preserve sincere moments. Do not add a punchline after the birthday letter.
- Do not introduce exhausted-parent jokes, a defeated-father photograph, death, actual danger, or combat.

Use the existing Banker, Keeper, Danya, Alex, Igor, Victor, Anya, Alisa, Arisha, Robot, camera, photograph, and partyhat. Do not require new models, illustrations, animations, follower behaviour, inventory systems, or UI panels. A spoken action can be represented by dialogue and the existing presentation. Hand-holding, bending down, and placing the hat do not require new animations.

The original 5–8 minute target predates the family expansion. Do not cut the new family scenes merely to meet that obsolete target. Measure the resulting duration in the actual game; shorten redundant waits and connecting text before cutting character moments. There is no player-facing timer.

## 2. Dialogue conventions and sequence

Dialogue blocks use `Speaker|Text`. Speaker names here should map to the game's established speaker identifiers. Preserve `{handle}` substitution. Do not display markdown headings or implementation instructions as dialogue.

A choice's selected line appears as the first line of its branch. Display it once, not once from the menu and again from the branch. Run only the selected branch, then the shared continuation. All choices progress. No guessing the author's preferred answer is required.

Canonical route:
1. Bank opening and bounty plan.
2. Keeper registration and Danya's camera scene, in either order.
3. Alex's cover-story rehearsal, triggered directly after Danya's scene so it cannot be missed.
4. Anya's individual scene at the shore.
5. Alisa and Arisha's individual scenes, in either order.
6. Shared family photograph once all three individual family scenes are complete.
7. Bank claim and one selected final-favour refusal.
8. Return to the shore for the family reunion, hat equip, matching cover-story callback, quest completion, and Victor's letter.

Use existing actor interactions and dialogue choices for progression. Reuse the current locations. At the final gathering Alex and Victor may speak through the existing scene dialogue system without requiring new movement or follower mechanics.

## 3. Bank opening

ID: `bounty_intro`. Run once at the opening/bank interaction.

```text
Game|{handle} has logged in.
Banker|One partyhat for whoever catches Freakybat.
Andrey|That's me.
Banker|The hunter or the giant?
Andrey|Whichever gets the hat.
Victor|It was supposed to be a birthday announcement.
Andrey|Read it to me.
Victor|"Freakybat. 195. Partyhat. Come and get him."
Andrey|Did "happy birthday" cost extra?
Victor|I thought "partyhat" covered it.
Banker|We assumed it was a rare drop.
Andrey|And 195 is my height.
Banker|Several people have already brought swords.
Andrey|For a hat?
Banker|A discontinued hat.
Andrey|Fine. I'll claim it myself.
Banker|You can't collect your own bounty.
```

Decision: `bounty_reaction`.

### A. What happens if nobody catches me?
```text
Andrey|What happens if nobody catches me?
Banker|I keep the hat.
Andrey|For how long?
Banker|I wish you a very long and healthy life.
```

### B. How much would it cost to buy it?
```text
Andrey|How much would it cost to buy it?
Banker|You can't afford it.
Andrey|You haven't checked.
Banker|You asked the price.
Andrey|You're right. I'll stick to robbing you legally.
```

### C. Can I come back when you're more helpful?
```text
Andrey|Can I come back when you're more helpful?
Banker|Certainly.
Andrey|When's that?
Banker|I'm on holiday in June.
```

Shared continuation: `bounty_plan`.
```text
Andrey|Put the claim under Toldo.
Banker|Have you hunted under that name before?
Andrey|Yes.
Banker|Fine. I only check names.
Victor|But you've just watched him...
Banker|If I checked everything I watched, we'd never close.
Andrey|What does Toldo need?
Banker|Register with the raid leader. Then bring a photograph of Freakybat and a witness confirming the capture.
Andrey|And that gets me the hat?
Banker|That gets Toldo the hat.
Andrey|I'm beginning to like him.
Game|Quest started: Please Stop Farming Me.
```

Completion: `bountyStarted = true`. Enable recruitment and camera collection in either order. The banker recognises Andrey; he deliberately accepts filed names as sufficient. Do not make him suddenly unable to recognise faces.

## 4. Keeper registration

ID: `raid_recruit`. Actor: Keeper at existing park position. Requires bounty started and not registered.

```text
Keeper|Name?
Andrey|Toldo.
Keeper|Good. We need a volunteer to catch the giant.
Andrey|Where will you be?
Keeper|Here. I have important duties.
Andrey|Such as?
Keeper|Recruiting the next volunteer.
```

Decision: `raid_tactics`.

### A. Lead the way.
```text
Andrey|Lead the way.
Keeper|Of course. You go first.
Andrey|That's following.
Keeper|Only if you look back.
```

### B. Why don't you catch him?
```text
Andrey|Why don't you catch him?
Keeper|I have never lost a fight.
Andrey|Have you been in one?
Keeper|I don't see why I should risk a perfect record.
```

### C. You're very brave from here.
```text
Andrey|You're very brave from here.
Keeper|Thank you. I chose this position carefully.
Andrey|You're behind the bank.
Keeper|Exactly. The giant would have to queue.
```

Spatial check: the last branch assumes the Keeper's current position can reasonably be described as behind the bank. Verify against the actual map. If it cannot, preserve the map and use this previously reviewed alternative branch instead:
```text
Andrey|You're very brave from here.
Keeper|Thank you. I considered that carefully when choosing where to stand.
```

Shared continuation:
```text
Keeper|You're registered. Take a camera to the shore and get your evidence.
Andrey|Do I get any equipment?
Keeper|What did you bring?
Andrey|My own clothes.
Keeper|Good. You're fully equipped.
Andrey|I'll return them to myself afterwards.
```

If the camera is missing, append:
```text
Keeper|Danya has your camera.
```

Completion: `raidJoined = true`. This choice creates no additional requirement or item. Keep this scene compact; do not add more Keeper material to the required route.

## 5. Danya: camera and cover story

ID: `camera_plan`. Existing house/camera interaction. Requires bounty started, camera not yet granted. Danya, Alex, and Igor may speak without moving their models.

```text
Andrey|Hand over my camera.
Danya|You have the manners of a beggar.
Andrey|I wanted to make sure you'd feel comfortable with me.
Alex|Definitely Andrey.
Andrey|Toldo.
Danya|Same face. Same voice. Still asking for your things back.
Andrey|What would convince you?
Danya|Say something Andrey would never say.
```

Decision: `cover_story`. Store this selection for a callback at the final family gathering.

### A. Someone else can pay.
```text
Andrey|Someone else can pay.
Danya|Excellent. You owe me for lunch.
Andrey|Andrey owes you for lunch.
Alex|He's getting quite good at this.
```
Set `coverStory = money`.

### B. I'd rather stay indoors this weekend.
```text
Andrey|I'd rather stay indoors this weekend.
Igor|Doing what?
Andrey|Planning a hike.
Igor|You lasted four words.
```
Set `coverStory = outdoors`.

### C. A phone is just as good as a DSLR.
```text
Andrey|A phone is just as good as a DSLR.
Danya|Great. I'll keep the camera.
Andrey|For making calls. I hadn't finished.
```
Set `coverStory = camera`.

Shared continuation:
```text
Danya|Here's your camera. Anya and the girls are at the shore.
Andrey|Will they believe I'm Toldo?
Alex|Your children will probably call you Dad.
Andrey|A third identity. This is getting out of hand.
Game|You receive your camera.
```

Grant existing camera once. Set `cameraOwned = true`. Continue directly into Alex's scene. No house transformation, bill item, sandwich, crafting, or disguise item.

## 6. Alex: rehearsing the interrogation

ID: `alex_rehearsal`. Run directly after the camera scene, once. A save interrupted between these scenes must resume the rehearsal before advancing the shore sequence.

```text
Alex|Before you go, we should test your cover story.
Andrey|The banker already accepted it.
Alex|Yes, but you haven't tried explaining it to your wife.
Andrey|Fine. Ask me something.
Alex|Name?
Andrey|Toldo.
Alex|Do you know Freakybat?
Andrey|Only personally.
Alex|How personally?
Andrey|We've never spent a night apart.
Alex|Let's try "we've met."
Alex|What will you do if somebody shouts "Andrey"?
Andrey|Ignore them.
Alex|Andrey, I'm buying lunch.
Andrey|Where?
Alex|Dead. Immediately.
Andrey|Nobody's dying. It's a birthday party.
Alex|You should put that on the invitation.
Andrey|We're receiving quite a lot of feedback about the invitation.
```

Decision: `alex_cover`.

### A. You could pretend to be Toldo.
```text
Andrey|You could pretend to be Toldo.
Alex|And collect your hat?
Andrey|Then give it to me.
Alex|Sorry. Do I know you?
Andrey|You're enjoying this far too much.
Alex|Only professionally.
```

### B. Just say you don't recognise me.
```text
Andrey|Just say you don't recognise me.
Alex|Never seen this man before.
Andrey|Good.
Alex|Although I recognise my camera strap.
Andrey|That's mine.
Alex|And we've found him again.
```

### C. I'll handle the questions.
```text
Andrey|I'll handle the questions.
Alex|What if the banker asks why you look exactly like Freakybat?
Andrey|Budget cuts.
Alex|...Actually, use that.
```

Shared continuation:
```text
Alex|You know you could just ask us for a birthday hat.
Andrey|Would you give me one?
Alex|Of course.
Andrey|Where is it?
Alex|In the bank. There's a procedure.
Andrey|I need better friends.
Alex|Too late. We know all your stories.
```

Set `alexTalked = true`. The "Dead. Immediately." line is mock interrogation banter, not a death event or combat mechanic.

## 7. Anya: she knows exactly whom she married

ID: `anya_conversation`. Existing shore position. Requires `raidJoined && cameraOwned && alexTalked`. Run once before the girls' individual scenes.

```text
Anya|There you are. How's your birthday going?
Andrey|I'm wanted, apparently.
Anya|I could have told you that without putting up posters.
Andrey|The banker won't give me my hat unless I catch myself.
Anya|And you agreed?
Andrey|I found a loophole.
Anya|Of course you did. What's your name now?
Andrey|Toldo.
Anya|Hello, Toldo. Are you married?
Andrey|Very.
Anya|Shame. I was going to invite you to my husband's birthday.
Andrey|I hear there's trouble with the invitations.
Anya|What exactly did the banker ask for?
Andrey|A photograph of Freakybat and a witness confirming the capture.
Anya|So we capture you on camera.
Andrey|That's what I was thinking.
Anya|Then why are you still standing outside the photograph?
Andrey|I was enjoying being wanted.
```

Decision: `anya_reply`.

### A. Will you be my witness?
```text
Andrey|Will you be my witness?
Anya|What am I agreeing to?
Andrey|Just confirming that I'm me.
Anya|I did that at our wedding.
Andrey|Apparently the bank needs a second opinion.
```

### B. You worked that out very quickly.
```text
Andrey|You worked that out very quickly.
Anya|I've had years of practice understanding your plans.
Andrey|My plans are clear.
Anya|You came here to arrest yourself under a false name.
Andrey|This one has some details.
```

### C. Would you still love me if I were Toldo?
```text
Andrey|Would you still love me if I were Toldo?
Anya|Same man?
Andrey|Same man.
Anya|Same terrible jokes?
Andrey|Improved branding.
Anya|Then yes. But I'm not learning another birthday.
```

Shared continuation:
```text
Anya|Go and speak to the girls. They've heard about the bounty.
Andrey|Are they worried?
Anya|They have questions.
Andrey|That sounds worse.
Anya|They're your children.
```

Set `anyaTalked = true`. Enable both daughters' individual scenes. Do not also run the superseded bags/alias family scene from the earlier manuscript.

## 8. Alisa: negotiating the bounty

ID: `alisa_conversation`. Requires Anya's scene complete. Run once, before photograph. May occur before or after Arisha's scene.

```text
Alisa|Dad, I found you.
Andrey|Well done.
Alisa|Where's my hat?
Andrey|What hat?
Alisa|The poster says whoever finds you gets a hat.
Andrey|Catches me.
Alisa|All right. Don't move.
Andrey|I'm already catching myself.
Alisa|You can't win your own game.
Andrey|That's what the banker said.
Alisa|He sounds sensible.
Andrey|Please don't join his team.
Alisa|If I help, can I wear the hat?
Andrey|Sometimes.
Alisa|First?
Andrey|It's my birthday.
Alisa|You can wear it next birthday.
Andrey|That's not "sometimes." That's an appointment.
```

Decision: `alisa_hat`.

### A. We could share it.
```text
Andrey|We could share it.
Alisa|I get it in the daytime. You get it at night.
Andrey|When I'm asleep?
Alisa|You won't have to wait for your turn.
Andrey|That is a very suspicious benefit.
```

### B. What would you do with a partyhat?
```text
Andrey|What would you do with a partyhat?
Alisa|Be in charge of the party.
Andrey|That's not how hats work.
Alisa|Then why do you want it so much?
Andrey|I preferred your first question.
```

### C. What if I give you a hug instead?
```text
Andrey|What if I give you a hug instead?
Alisa|I can get those for free.
Andrey|True. Very poor business model.
Alisa|I'll have one anyway.
```

Shared continuation:
```text
Alisa|You can wear it first.
Andrey|Thank you.
Alisa|But I'm putting it on you.
Andrey|Deal.
Alisa|You'll have to bend down. A lot.
Andrey|Finally. Someone read 195 correctly.
```

Set `alisaTalked = true`. The sharing agreement already exists in the common opening, regardless of selected branch. Its witness-statement and reunion callbacks are therefore valid for all choices. No hat transfer mechanic or hug animation is required.

## 9. Arisha: catching Dad properly

ID: `arisha_conversation`. Requires Anya's scene complete. Run once, before photograph. May occur before or after Alisa's scene.

```text
Arisha|Dad. You're caught.
Andrey|How?
Arisha|I'm holding your hand.
Andrey|I could escape.
Arisha|Go on, then.
Andrey|...
Arisha|See?
Andrey|Very effective trap.
Arisha|Thank you.
Andrey|What happens to prisoners?
Arisha|They stay here.
Andrey|Any food?
Arisha|Birthday cake.
Andrey|I withdraw my escape attempt.
```

Decision: `arisha_capture`.

### A. I'm actually Toldo.
```text
Andrey|I'm actually Toldo.
Arisha|You're Dad.
Andrey|How can you tell?
Arisha|Your face.
Andrey|Alex said that might be a problem.
```

### B. What if I need this hand?
```text
Andrey|What if I need this hand?
Arisha|You have another one.
Andrey|You've thought of everything.
Arisha|Give me that one too.
```

### C. Can I be released for good behaviour?
```text
Andrey|Can I be released for good behaviour?
Arisha|What's good behaviour?
Andrey|Being nice. Giving hugs.
Arisha|No. Then you have to stay longer.
Andrey|The rules here are excellent.
```

Shared continuation:
```text
Andrey|I do need to go and get the hat.
Arisha|Then come back.
Andrey|Straight back.
Arisha|Promise?
Andrey|Promise.
Arisha|All right. You can have your hand.
```

Set `arishaTalked = true`. No movement lock, follower, cake item, or capture mechanic. The dialogue conveys the interaction. Keep the ellipsis click-to-advance; do not create a lengthy forced pause.

## 10. Family photograph

ID: `family_capture`. Requires `anyaTalked && alisaTalked && arishaTalked && raidJoined && cameraOwned`. Run once. Trigger through the existing photograph interaction or Anya's ready-state interaction. Do not silently skip any individual family conversation.

```text
Anya|Right. We've found him, caught him, and negotiated custody of the hat. Photograph?
Andrey|This is a surprisingly organised bounty hunt.
Alisa|I'm in charge.
Andrey|You haven't got the hat yet.
Alisa|I'm practising.
Robot|Please identify the target.
Alisa|Dad.
Andrey|Freakybat.
Anya|Andrey.
Arisha|He's that one.
Robot|Thank you. One useful answer.
Andrey|Everyone look at the camera.
Anya|Including you.
Andrey|I'm checking the framing.
Anya|You can criticise it afterwards.
Andrey|I can do both.
Robot|Say cheese.
Arisha|Cheese.
Alisa|Partyhat.
Andrey|Is the focus...
Game|Photograph taken.
Anya|Perfect.
Andrey|I was talking.
Anya|Yes. It looks just like you.
Robot|Witness statement required.
Anya|We confirm that we caught him.
Alisa|And he promised to share the hat.
Andrey|That isn't relevant to the claim.
Alisa|Put it in anyway.
Robot|Added.
Arisha|And he's coming back.
Anya|Yes. He is.
Game|You receive: Freakybat, Captured.
```

At `Photograph taken`, trigger the existing shutter and family photograph presentation. Use the current image without requiring a talking expression, changed framing, or new pose. The robot only operates the camera and records the family's testimony.

Existing photo item:
- Name: `Freakybat, Captured`
- Description: `A family photograph. Freakybat is clearly visible and has made no attempt to escape the photograph.`
- Witness statement: `I confirm that Freakybat was captured on camera. He is still in the photograph. Signed, Anya. Additional statement from Alisa: Dad promised to share the hat. Additional statement from Arisha: He is coming back.`

Grant the photograph once. Set `photoTaken = true` and `witnessRecorded = true`. Attach testimony to the existing item description or quest journal. No additional witness item or new panel is needed. The robot does not follow the player to the bank.

## 11. The banker meets his own rules

ID: `bounty_claim`. Requires photograph and witness, hat not yet claimed.

```text
Banker|Toldo. Did you catch Freakybat?
Andrey|On camera. Here's the photograph and witness statement.
Banker|This is a family photograph.
Andrey|Yes. We caught several people. I'm only claiming for the tall one.
Banker|I meant captured. Unable to leave.
Andrey|Check the photograph.
Banker|What?
Andrey|Is he still in it?
Banker|Yes.
Andrey|Excellent camera.
Banker|The hunter and the target are the same person.
Andrey|Different names. You checked.
Banker|That isn't what I intended.
Andrey|Neither was the birthday announcement. Yet here we are.
Banker|I'll have to change the rules.
Andrey|For the next birthday. Hat, please.
Banker|Before you go, could you do me one small favour?
```

Decision: `final_favour`. Never starts another quest.

### A. No. I've played this game before.
```text
Andrey|No. I've played this game before.
Banker|It's just a short walk.
Andrey|To someone who needs a favour?
Banker|You have played it before.
```

### B. What's the reward?
```text
Andrey|What's the reward?
Banker|My gratitude.
Andrey|I'll give you mine if you do it yourself.
Banker|That's worthless.
Andrey|You set the price.
```

### C. Ask Toldo.
```text
Andrey|Ask Toldo.
Banker|You're Toldo.
Andrey|For payments. Complaints go to Freakybat.
```

Shared continuation:
```text
Banker|Take the hat.
Game|You receive a partyhat.
```

Grant the existing partyhat once and set `hatClaimed = true`. Preserve its colour and artwork. Delay equipping it until Alisa's reunion moment. If the engine currently combines grant and equip, separate those existing effects without creating a new inventory interface. Do not complete the quest or show the birthday letter at the bank.

Update objective to return to the family at the shore. No payment duel, cracker pull, new currency, or second reward.

## 12. Return to the family

ID: `family_reunion`. Requires `hatClaimed && !reunionDone`. Trigger at shore using an existing family interaction. Alex and Victor participate through dialogue; no new travel animation required.

```text
Arisha|You came back!
Andrey|I promised.
Alisa|Did you get it?
Andrey|One partyhat. Legally acquired.
Anya|That's an unusual thing to say about a birthday present.
Alex|You should have heard the rest of his defence.
Alisa|Bend down.
Andrey|As agreed.
```

Equip the already-owned partyhat here. Do not grant a second one. No new bending/hat-placement animation required.

```text
Alisa|There.
Arisha|Now you look like it's your birthday.
Andrey|What did I look like before?
Arisha|Dad.
Anya|Happy birthday, love.
Andrey|Thank you for helping me catch myself.
Anya|Any time. You're quite easy to find.
Andrey|Am I?
Anya|We just stand together. You turn up with a camera.
Alex|Shall I take one of all of you?
Andrey|Yes. The settings are...
Alex|I press this one?
Andrey|Yes, but...
Game|Photograph taken.
Anya|Another perfect one.
```

The second photograph is an ending beat: reuse the shutter/presentation if appropriate. It creates no second photo item, evidence, quest requirement, or altered artwork.

Then Victor speaks:
```text
Victor|Happy birthday, mate.
```

Play exactly one matching callback below. These callbacks have moved from the bank to the final family gathering.

### If `coverStory = money`
```text
Victor|Still letting someone else pay for lunch?
Andrey|No. Lunch is on me.
Victor|Welcome back.
Andrey|Danya's old bill is still Toldo's problem.
```

### If `coverStory = outdoors`
```text
Victor|Still staying indoors this weekend?
Andrey|There's a short walk I want to do.
Victor|How short?
Andrey|Why does everyone need numbers?
```

### If `coverStory = camera`
```text
Victor|Still think a phone is as good as a DSLR?
Andrey|Absolutely.
Victor|Really?
Andrey|You can use it to order a DSLR.
```

Then:
```text
Game|Quest complete: Please Stop Farming Me.
Game|Reward: 1 partyhat. 1 quest point. No further favours accepted.
```

Set `reunionDone = true` and complete the quest once. The reward line summarises the already-granted hat; it must not grant another. Award a quest point only if the existing game supports it; otherwise preserve the existing cosmetic reward text behaviour.

Allow a normal advance action before displaying Victor's message. Do not overlap it with optional chatter or an automatic interruption.

## 13. Victor's birthday letter

ID: `birthday_letter`. Use existing final-message surface after reunion and normal advance. Preserve the sincere wording. No age, narrator's final joke, or new quest afterwards.

> Andrey, happy birthday, mate.
>
> We started out sharing one portion of fries and spending our lunches at Danya's. Since then, we've shared islands, road trips, Christmases, and a lot of very good days.
>
> I love that you're still the person who makes friends everywhere and is always up for an adventure. Seeing you with Anya, Alisa, and Arisha makes me especially happy.
>
> I'm grateful we grew up together, and that we're still adding to the stories. Here's to the next one.
>
> Victor

Set `letterRead = true` when the message is closed, according to existing UI conventions. Closing it does not automatically begin another scene.

## 14. Optional conversations

Play once, only when sought out. No required detours or rewards. Afterward give the appropriate state hint when needed. Never interrupt the family finale or letter.

### Keeper: useful meditation
ID: `optional_meditation`. After recruitment, before photograph.

```text
Keeper|I'm meditating.
Andrey|On what?
Keeper|Doing nothing. Wanting nothing.
Andrey|Good. I need nothing from you.
Keeper|Then why are you here?
Andrey|Checking you could deliver.
```

### Igor: balanced teams
ID: `optional_football`. Use existing football interaction as dialogue, not a new match or timed challenge. The joke assumes the intended personal reference is that Andrey is good at football; do not expand that into invented biography.

```text
Igor|We're picking teams. You're on both.
Andrey|How does that work?
Igor|Whoever's losing gets you.
Andrey|So if I score, I switch sides?
Igor|We've finally found a way to stop you winning.
```

### Danya: next year's invitation
ID: `optional_after_party`. Only after the letter is closed.

```text
Danya|Next year, let me write the invitation.
Andrey|What will you put?
Danya|"Andrey. Birthday. No weapons."
Andrey|Put the last bit first.
```

## 15. Repeat interactions, early visits, and hints

Do not restart completed conversations. Prioritise accurate directions. These additional family-progress hints reconcile the expanded story with the earlier hint table.

| Actor/state | Exact line or routing |
| --- | --- |
| Any later interaction before opening | Victor: Come to the bank. I've slightly misadvertised your birthday. |
| Banker, bounty started and proof missing | Banker: A photograph and a witness statement. You've brought yourself again. |
| Keeper, recruited and camera missing | Keeper: Danya has your camera. Collect it, then head to the shore. |
| Keeper, recruited and camera owned | Keeper: Anya and the girls are at the shore. I'll secure this bit. |
| Danya, camera given but Alex scene incomplete | Resume/offer pending Alex rehearsal through existing dialogue flow. |
| Danya, Alex scene complete and raid not joined | Danya: Register with the raid leader at the park entrance. Remember: Toldo. |
| Danya, Alex scene complete and raid joined, photograph missing | Danya: Anya and the girls are at the shore. Try not to invent another name on the way. |
| Family, camera missing | Anya: Danya has your camera. We've supplied the family. |
| Family, camera owned and raid not joined | Anya: Register with the raid leader first. Apparently being yourself needs approval. |
| Family, prerequisites complete but Anya not spoken to | Run Anya's scene through her interaction; other family interactions direct to Anya first. |
| Anya, her scene complete and both girls pending | Anya: Go and speak to Alisa and Arisha. |
| Anya or completed daughter's repeat, only Alisa pending | Anya: Alisa wanted a word with you before the photograph. |
| Anya or completed daughter's repeat, only Arisha pending | Anya: Arisha wanted a word with you before the photograph. |
| All individual family scenes complete, photograph missing | Anya: Everyone's here. Let's take the photograph. Offer/trigger existing photo scene. |
| Family, proof ready and hat unclaimed | Anya: Take the photograph and witness statement to the bank. |
| Banker, hat claimed and reunion pending | Banker: If anyone asks, you got that somewhere else. Game/journal points to family at shore. |
| Family, hat claimed and reunion pending | Run family_reunion once. |
| Banker, reunion done | Banker: If anyone asks, you got that somewhere else. |
| Keeper, hat claimed | Keeper: Another successful raid under my leadership. Andrey: You're welcome. |
| Alex, rehearsal completed and no other pending scene | Use current objective as a short hint; do not replay rehearsal. |
| Family after letter closed | Anya: Happy birthday, love. Use a short repeat only; do not replay the finale. |

When multiple prerequisites are missing, give the earliest actionable objective. A daughter's pending individual scene should trigger on her actor, not be replaced by a generic hint. If existing actor interactions cannot directly support this, use the established conversation menu rather than adding a new interface.

For old decorative objects, benches, and shops without a story role, use their neutral examine text or a useful current hint. Do not transfer removed pet/narrator jokes to other objects.

## 16. State and event wiring

Use established project naming and persistence conventions. Suggested semantic fields:

```js
{
  storyVersion: 4,
  bountyStarted: false,
  raidJoined: false,
  cameraOwned: false,
  coverStory: null, // money | outdoors | camera
  alexTalked: false,
  anyaTalked: false,
  alisaTalked: false,
  arishaTalked: false,
  photoTaken: false,
  witnessRecorded: false,
  hatClaimed: false,
  hatEquipped: false, // use existing equipment state if already available
  reunionDone: false,
  letterRead: false,
  seenOptional: []
}
```

Use the engine's existing scene progress or atomic-completion behaviour to prevent reloads midway through a scene from duplicating rewards or skipping continuations. Do not invent a new save UI. If a save resumes after camera grant but before rehearsal, the rehearsal remains pending. If it resumes after hat grant but before reunion, the return-to-family objective remains pending. If it resumes after reunion but before the letter, the letter remains available through the existing final-message path.

| Scene | Prerequisite | Completion/effect |
| --- | --- | --- |
| bounty_intro + selected reaction + bounty_plan | New story | bountyStarted |
| raid_recruit + selected tactic | Bounty started | raidJoined |
| camera_plan + selected cover + continuation | Bounty started | cameraOwned; coverStory; camera granted once |
| alex_rehearsal + selected branch | Camera scene | alexTalked |
| anya_conversation + selected branch | Raid joined, camera, Alex scene | anyaTalked |
| alisa_conversation + selected branch | Anya scene | alisaTalked |
| arisha_conversation + selected branch | Anya scene | arishaTalked |
| family_capture | All three family conversations, raid and camera | photoTaken; witnessRecorded; one photo |
| bounty_claim + selected favour | Photo and witness | hatClaimed; one hat, not yet equipped |
| family_reunion + matching callback | Hat claimed | Equip existing hat; reunionDone; quest complete |
| birthday_letter | Reunion complete and normal advance | letterRead on close |

There are eight decisions with three branches each: bounty_reaction, raid_tactics, cover_story, alex_cover, anya_reply, alisa_hat, arisha_capture, final_favour. Only cover_story requires later choice-dependent dialogue. Other branches do not create requirements, fail states, items, or extra quests.

Journal copy:
1. Someone has advertised my birthday as a boss encounter. I intend to collect the bounty myself.
2. Register as Toldo at the park entrance. Get my camera from Danya. Check these off separately.
3. Alex wants to test my cover story. Apparently knowing my own name is not enough.
4. Meet Anya at the shore. Speak to Alisa and Arisha before the family photograph. Check both conversations separately.
5. Take the family photograph and record the witness statement.
6. Return to the bank. Remind the banker what he actually asked for.
7. Return to Anya and the girls at the shore. I promised.
8. Quest complete. Happy birthday, Freakybat.

Show only actionable journal steps. Alex's direct continuation must not hide outstanding registration if the camera was collected first.

The original attachment described exports named SCRIPT, OPTIONAL, and BENCH_LINES. Preserve the actual project API as needed, including Speaker|Text parsing and handle substitution. Bind the new scene IDs and progression conditions to the current engine and remove conflicting old callers.

Version old story saves into the existing new-story/restart path rather than retaining incompatible flags. Preserve unrelated preferences, including audio. Do not silently combine version-3 completion state with this expanded story.

Retire old hooks for the pet, house sandwich, wildlife tour, coin income, photography misfires, payment duel, cracker, exhausted-parent photograph, and ambient narrator. Retain ordinary scenery and presentation. No recruitment role, beach-versus-pool outing choice, defeat pose, or combat in this revision.

## 17. Integration and content checks

- Inspect existing engine and asset capabilities before implementing. Preserve unrelated work.
- Verify every canonical scene above is represented, including Alex and all three individual family conversations.
- Exercise recruitment-first and camera-first routes; Alex runs after camera collection in both.
- Exercise Alisa-first and Arisha-first routes. Both must complete before the photograph.
- Exercise all 24 decision branches. Only the selected branch runs, once, followed by its shared continuation.
- Verify all three cover-story callbacks at the reunion, not at the bank.
- Verify Keeper's spatial joke against the unchanged map; use the supplied fallback if necessary.
- Visit all main actors early and repeatedly. Hints must reflect actual outstanding objectives.
- Photograph evidence and witness testimony are granted once. The ending photograph grants nothing.
- Hat is granted at the bank once and equipped at the family reunion once.
- No quest completion or birthday letter at the bank. The reunion and sincere letter must remain reachable.
- Reload before/after camera, rehearsal, family conversations, photograph, hat grant, reunion, and letter. Check relevant boundary states rather than adding redundant tests of trivial strings.
- Do not replay reward, letter, or long scenes on subsequent clicks.
- Check desktop and phone text wrapping, choice labels, apostrophes, pauses, and click-to-advance.
- Check that no old narrator interruption, pet scene, misfire, defeated-face event, or old ending runs.
- Time a comfortable playthrough. Report actual duration instead of claiming the old short target is met.
- Report changes, checks performed, and any remaining engine or asset limitation honestly. This exported specification itself has not been runtime-tested.

## 18. Source and editorial notes (not player-visible)

This consolidates the uploaded manuscript with two subsequent dialogue revisions. The expanded family scenes supersede the earlier brief family scene, its family_alias choices, and its bags jokes. The reunion supersedes completing the game at the bank. Keep one canonical version of each scene, not both.

The manners exchange in Danya's opening is retained from the supplied manuscript, which attributes that short borrowed exchange to The Secret of Monkey Island. The revised Keeper record joke and "one small favour" exchange retain game-comedy references. Do not represent all dialogue as wholly original, and do not insert source notes into gameplay.

The uploaded manuscript included these source references; they are preserved here as provenance, not newly verified citations:
- https://gamefaqs.gamespot.com/pc/562681-the-secret-of-monkey-island/faqs/23891
- https://gamefaqs.gamespot.com/pc/29083-the-curse-of-monkey-island/faqs/26681
- https://runescape.fandom.com/wiki/Transcript%3ANPC_Contact

The earlier borrowed opening-hours and meditation lines are no longer in the canonical dialogue. No additional browsing or borrowed material is required to implement this file.
