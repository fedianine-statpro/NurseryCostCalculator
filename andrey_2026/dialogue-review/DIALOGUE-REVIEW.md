# Birthday quest: complete dialogue review

Approved review, implemented on 16 October 2026. The Before columns preserve the pre-rewrite game; the After columns record the approved proposal. Recording scripts have been regenerated for the implementation.

## What needs changing

Too often the current dialogue describes an absurd image, then the narrator describes why that image is absurd. Most people also speak in the same polished, knowing voice. Rewriting individual punchlines cannot fix either pattern.

The proposal gives people ordinary aims that collide: Andrey wants to share and reciprocate; Victor wants him to receive one gift; Danya wants his home intact; the vendor wants a straightforward sale; the keeper wants his rock to count as an attraction; the photographer judges photographs by rules that miss the point. Anya wants everyone in one family photograph. The daughters get a genuine part in that photograph, rather than questions whose only function is to cue adult jokes.

The narrator gets fewer appearances, but something to do: confidently predict a modest action, discover that it has gone wrong, or try to move the story along when the player stops. He does not supply an afterword to every other person’s punchline.

I would keep the paper/lamination complaint, the two-men-paying-each-other’s-half mechanism, the short item description “Contains downstairs”, and the rock’s skill table. Some navigation and memory captions should simply be clear or affectionate. Not every interaction should become a sketch.

## How I used the references

These are my craft conclusions, not rules quoted from the developers and not attempts to reproduce their characters or dialogue.

- **The Stanley Parable:** let the player’s action embarrass a narrator who has a personal investment in how events are supposed to go. The developers’ own playful [development showcase](https://www.gamedeveloper.com/design/the-stanley-parable-dev-showcase-secrets) makes control and competing intentions part of the joke; their [2013 AMA](https://www.reddit.com/r/Games/comments/1p095a/) also discusses discoveries from player behaviour and cutting material that did not work. Here, the narrator speaks before the house reveal and is surprised when the player sits down.
- **Portal 2:** build exchanges around relationships, a character’s self-image, and physical delivery. In [Erik Wolpaw’s interview](https://primagames.com/news/portal-2-lets-make-caddyshack-1352805), he discusses intimate character relationships, Wheatley’s idea of his own competence, and the importance of staging and performance. Here, the robot defends bad photos using the wrong success criteria; the vendor is trying to conduct business during a boss fight.
- **The Secret of Monkey Island:** let a player try an absurd action and let the other person respond from a sensible, specific position. In [Ron Gilbert’s interview](https://blog.playstation.com/2012/12/12/interview-monkey-island-creator-ron-gilbert-descends-into-the-cave/), he discusses the comic freedom of strange item combinations and a protagonist who remains relatable. Here, Danya worries about soup when his house goes into a bag, and the banker asks about a sandwich’s mortgage.

## Reading the proposals

**Before** reproduces the current conversation. In the main script, the active reward’s examination replaces its configuration token. Game messages are included where their placement affects a joke. **After** is the proposed version. Square brackets are staging or editing notes, not words to record. “Cut” means remove the beat, not replace it with an invisible ellipsis.

The timing notes matter. The current game often finishes an animation before starting the conversation; some proposed lines need to happen during the action. Newly required staging is identified rather than treated as implemented. Existing one-speaker portrait delivery can remain, but short ambient reactions and level-up labels should not all require a new portrait page.

The recently approved “Nope, you can’t” remains in its own optional branch. It has not been used as the general template.


## Main quest

### 1. Arrival in two parts

**Decision:** Rewrite. Source: `js/script.js: login`.

**Before**

> **Game:** {handle} has logged in.  
> **Game:** The rest of {handle} has logged in.  
> **Narrator:** There he is. We had to send him in two packets.

**After**

> **Game:** {handle} has logged in.  
> *[Only the legs have arrived. Wait a beat.]*  
> **Narrator:** We’ll start when the rest of him gets here.  
> *[The upper half arrives. No second explanation.]*

Let the incomplete character be the setup. The narrator is trying to begin his story and has been made to wait.

**Delivery / implementation:** Timing change: speak while the upper half is still absent. The current dialogue starts after the animation has finished.

### 2. The hat and the present

**Decision:** Rewrite. Source: `js/script.js: intro`.

**Before**

> **Banker:** Zero defence. Zero warmth. Worth more than this building.  
> **Andrey:** What does it actually do?  
> **Banker:** Makes people walk up and ask you for free stuff.  
> **Andrey:** Perfect.  
> **Narrator:** A hat with conversation attached. Of course he wanted one.  
> **Victor:** It’s your birthday present.  
> **Andrey:** How much was it?  
> **Victor:** You’re not being told.  
> **Andrey:** Who do I reimburse?  
> **Game:** Receiving Presents: 1  
> **Victor:** You told me you didn’t want anything.  
> **Andrey:** When?  
> **Victor:** 2006.  
> **Andrey:** How long have you been working on this?  
> **Victor:** Depends whether you count the first nineteen years.  
> **Victor:** Meet us at the shore. Lunch, one photo, then the hat. I’ve called it an expedition so you’ll actually come.  
> **Game:** Quest started: Just Accept the Hat.

**After**

> **Banker:** Zero defence. Zero warmth.  
> **Andrey:** And the price?  
> **Banker:** That’s its best stat.  
> *[Let the player look at the hat before Victor speaks.]*  
> **Victor:** It’s your birthday present.  
> **Andrey:** What do I owe you?  
> **Victor:** A thank-you.  
> **Andrey:** Can I pay in gold?  
> *[End the exchange here. No narrator explaining generosity.]*  
> **Victor:** Fries first. Pick up the camera from Danya’s, then meet us at the shore.  
> **Game:** Quest started: Just Accept the Hat.

Make the price a RuneScape joke, then establish the actual obstacle: Andrey treats a gift as a transaction. Remove the archive interrogation, twenty-year arithmetic, and commentary explaining his personality. The last instruction is ordinary navigation, separated from the joke.

**Delivery / implementation:** Text only, with a short pause between the two exchanges. Keep the display-hat / wrapped-present continuity clear in the art: the display shows the prize; the cracker is its delivery.

### 3. Optional attempt to skip the quest

**Decision:** Keep. Source: `js/script.js: skip`.

**Before**

> **Victor:** Nope, you can’t.

**After**

> *[Player choice: Can I skip straight to the present?]*  
> **Victor:** Nope, you can’t.

Keep the response you already chose and its single-use behaviour. It is a small optional refusal, not the model for everyone else’s dialogue.

**Delivery / implementation:** Keep the existing single-use flag.

### 4. Ordering the fries

**Decision:** Rewrite. Source: `js/script.js: lunchSetup`.

**Before**

> **Danya:** One portion. Five forks.  
> **Vendor:** Four of you can use the forks to watch the other one eat.  
> **Alex:** We used to split it.  
> **Vendor:** Of course. Wouldn’t want anyone accidentally having lunch.

**After**

> **Danya:** One portion of fries, please.  
> **Vendor:** Anything else?  
> **Alex:** Four extra forks.  
> **Vendor:** Anything to put on them?

The vendor is trying to complete an order. His repeated question changes meaning once he discovers the portion is for five people. Stop before another character explains the small lunch.

**Delivery / implementation:** Existing scene; dialogue change only.

### 5. Share the portion

**Decision:** Rewrite. Source: `js/script.js: lunch.share`.

**Before**

> **Game:** Split stack: 1 portion → 5 × 0.2 portion.  
> **Igor:** How many hitpoints did we get?  
> **Alex:** We’re sharing the hitpoint too.  
> **Vendor:** You could just take turns being alive.

**After**

> **Game:** 1 portion → 5 × 0.2 portion.  
> *[The five tiny servings are handed out.]*  
> **Igor:** Who got the hitpoint?  
> **Alex:** I thought you had it.

Keep the game-mechanic absurdity, but turn it into two friends trying to account for a missing hitpoint. Remove the vendor’s second, more elaborate version of the same joke.

**Delivery / implementation:** Existing scene; dialogue change only.

### 6. Try to eat the fries yourself

**Decision:** Rewrite. Source: `js/script.js: lunch.eat`.

**Before**

> **Danya:** You know the rules.  
> **Narrator:** Four bodyguards. All protecting the fries.  
> **Game:** The fries are shared. Five adventurers recover 0.2 hitpoints each.

**After**

> *[Andrey reaches for the portion. Four more forks arrive.]*  
> **Andrey:** I picked “Eat”.  
> **Danya:** So did we.  
> **Game:** The fries are shared.

The other people have their own intentions. The player’s menu choice is not a command that makes his friends stop wanting lunch.

**Delivery / implementation:** Timing adjustment: the extra forks must appear before the reply. The existing eating animation currently serves all five branches similarly.

### 7. Buy another portion

**Decision:** Rewrite. Source: `js/script.js: lunch.buy`.

**Before**

> **Game:** Heard there was food.  
> **Narrator:** I said double the portion. He doubled the party.  
> **Vendor:** Take it. This is becoming a crowd-control issue.  
> **Game:** Two trays shared. One symbolic lunch bill: 1 gp.

**After**

> *[Five additional guests appear when the extra food arrives.]*  
> **Andrey:** Another portion, please.  
> **Vendor:** How many people does this one come with?

Let the new arrivals establish the rule. The vendor has now learned that portions generate customers. No narrator needs to describe the multiplication.

**Delivery / implementation:** Existing scene; dialogue change only.

### 8. The clouds setup

**Decision:** Cut. Source: `js/script.js: cloudSetup`.

**Before**

> **Igor:** How are things up there in the clouds?

**After**

> *[Remove this exchange and the automatic cloud detour from the main path.]*

The familiar tall-person weather question takes time to set up a familiar answer. The split arrival has already made height visual, and the photo can use it naturally. This is a cut, not a claim that different wording will rescue it.

**Delivery / implementation:** Remove the cloud sequence call from the normal lunch continuation if this proposal is adopted.

### 9. After the fries: get the camera

**Decision:** Rewrite. Source: `js/script.js: cloud`.

**Before**

> **Andrey:** You tell me.  
> **Danya:** The camera’s at mine. There’s bread too. Make yourself a sandwich.  
> **Game:** You receive Bread and a Lunch bill. Nobody has paid yet.

**After**

> **Danya:** Camera’s at mine. There’s bread in the kitchen; make yourself a sandwich.  
> **Game:** You receive Bread and a Lunch bill.

Give the next action a clear invitation. Let the ordinary wording set up the extraordinary result, without a weather comeback or another reminder that everyone is unpaid.

**Delivery / implementation:** Reuse the existing handover; skip the cloud animation.

### 10. Making the house sandwich

**Decision:** Rewrite. Source: `js/script.js: house`.

**Before**

> **Game:** You make Danya’s sandwich.  
> **Game:** Cooking level: considerably more than was requested.  
> **Danya:** I meant IN my house.  
> **Andrey:** You said help myself.  
> **Danya:** To lunch, Andrey. You’ve helped yourself to real estate.  
> **Narrator:** Excellent. You’ve made a sandwich. Now put the neighbourhood back.

**After**

> **Narrator:** Andrey made himself a sandwich. Two slices of bread. Something in the middle. A simple recipe.  
> *[The bread closes around the whole house.]*  
> **Danya:** I’m in the middle.  
> **Narrator:** Strictly speaking, he has followed the recipe.  
> **Andrey:** I made enough for everyone.  
> **Danya:** Can everyone let me out first?  
> *[Offer the house choices.]*

The narrator starts with an apparently foolproof recipe, then protects his own account by insisting the result is technically correct. Andrey has a sincere reason for going too far; Danya has an urgent reason to reject both men’s logic. This is an argument between three people with different priorities, not a narrator describing the image after the joke.

**Delivery / implementation:** Timing change: the narrator’s first sentence must precede the reveal, and Danya must be visible at the window when he speaks. The current code plays all dialogue after the sandwich has formed.

### 11. Try eating the house

**Decision:** Rewrite. Source: `js/script.js: houseBranches.eat`.

**Before**

> **Danya:** At least let me get my shoes.  
> **Game:** One harmless bite of bread. The building remains intact.

**After**

> *[Andrey leans towards the bread. Danya appears with his suitcase.]*  
> **Danya:** Can I come out first?  
> *[Andrey takes a small bite of bread only. The house remains intact.]*

Danya has an immediate practical objection. His response belongs before the bite, not after it. The small bite and intact house are visible consequences, not a reassurance paragraph.

**Delivery / implementation:** Timing change: move the line into the existing bite / suitcase sequence. Do not show harm or actual destruction.

### 12. Divide the house sandwich

**Decision:** Rewrite. Source: `js/script.js: houseBranches.share`.

**Before**

> **Alex:** I’ll take the kitchen.  
> **Igor:** I’m not eating the bathroom.  
> **Danya:** Nobody is eating the bathroom!

**After**

> **Andrey:** Five equal pieces.  
> **Danya:** One of those is my bedroom.  
> **Andrey:** We can swap.

Andrey tries to solve the wrong problem helpfully. This is a new misunderstanding, rather than three people announcing which room would be unpleasant to eat.

**Delivery / implementation:** Existing scene; dialogue change only.

### 13. Pack the house

**Decision:** Rewrite. Source: `js/script.js: houseBranches.pack`.

**Before**

> **Danya:** You’ll never fit that in your bag.  
> **Game:** It fits perfectly.  
> **Narrator:** Twenty-eight slots. Finally, a sensible use for one of them.

**After**

> *[The house shrinks into the inventory.]*  
> **Danya:** Keep it upright. There’s soup on the stove.

Once the impossible has happened, Danya immediately worries about the ordinary contents of his house. Do not add an inventory-size explanation after the image.

**Delivery / implementation:** Existing packing animation; show the item before the line. No soup animation is required.

### 14. Put the house back

**Decision:** Rewrite. Source: `js/script.js: restored`.

**Before**

> **Danya:** Thank you. There are now crumbs in the basement.  
> **Game:** Danya hands over the DSLR camera and a miniature House sandwich souvenir.  
> **Narrator:** A lovely park path. A municipal drain. I have given him a choice, which was my first mistake.

**After**

> *[House restored. Danya hands over the camera outside.]*  
> **Danya:** Here’s the camera. I’ve brought it outside.  
> **Game:** You receive the camera and a miniature house sandwich.

Danya has learned something and changes his behaviour. Bringing the camera out is a practical response to the previous disaster. Drop the generic narrator announcement about having made a mistake.

**Delivery / implementation:** Existing scene; dialogue change only.

### 15. Choose the pipe

**Decision:** Rewrite. Source: `js/script.js: sewerSetup`.

**Before**

> **Keeper:** You know that’s a sewer?  
> **Andrey:** We used to go in there at school.  
> **Keeper:** For what?  
> **Andrey:** We were outdoorsy.  
> **Keeper:** You were underneath outdoors.  
> **Game:** You temporarily unequip Standing Up.

**After**

> **Keeper:** That’s a sewer.  
> **Andrey:** We used to go through it at school.  
> **Keeper:** Was it a sewer then?  
> **Andrey:** Yes.  
> **Keeper:** Just checking you had all the information.  
> *[Andrey folds himself into the pipe.]*  
> **Game:** You temporarily unequip Standing Up.

The keeper investigates whether this is ignorance, discovers that it is deliberate, and has to accept that. Keep the mechanical Standing Up gag as an unvoiced label over the crouch, not another conversational page.

**Delivery / implementation:** Existing scene; dialogue change only.

### 16. The underground wildlife tour

**Decision:** Rewrite. Source: `js/script.js: sewer`.

**Before**

> **Keeper:** Local wildlife. Guaranteed sighting.  
> **Andrey:** That’s a rock.  
> **Keeper:** And yet: guaranteed.  
> **Andrey:** That’s a penguin.  
> **Keeper:** That one’s not on my list.

**After**

> **Keeper:** Wildlife tour. One guaranteed sighting.  
> **Andrey:** A rock?  
> **Keeper:** Hasn’t missed a day.  
> **Andrey:** You put it there.  
> **Keeper:** And I’m prepared to do that for every customer.  
> *[A penguin passes. The keeper watches it go and says nothing.]*

The keeper sells reliability instead of wildlife, then turns the accusation that he planted the exhibit into a pledge of good customer service. The penguin undermines his tiny tour without requiring another verbal explanation.

**Delivery / implementation:** Keep the rock reveal. Staging change: the penguin needs to pass within the tour view; it is not currently an actor in the separate pipe-interior scene.

### 17. The park alternative

**Decision:** Rewrite. Source: `js/script.js: park`.

**Before**

> **Keeper:** You missed the underground safari.  
> **Andrey:** What did I miss?  
> **Keeper:** The same rock, with considerably worse lighting.  
> **Keeper:** Also, apparently, whatever that is.

**After**

> **Keeper:** You missed the sewer tour.  
> **Andrey:** What’s down there?  
> **Keeper:** This rock.  
> **Andrey:** It’s up here.  
> **Keeper:** You’ve seen the highlights, then.

Give this route its own exchange. The keeper refuses to admit that the player has lost nothing by declining the tour. The rock is the same exhibit on both routes.

**Delivery / implementation:** Existing scene; dialogue change only.

### 18. Meet the old companion

**Decision:** Rewrite. Source: `js/script.js: rock`.

**Before**

> **Andrey:** You’re still here?  
> **Rock:** …  
> **Narrator:** Same personality. Excellent health. Hasn’t once asked what you do for work.

**After**

> **Andrey:** You waited?  
> **Rock:** …  
> **Andrey:** Sorry. Come on.

Let recognition be affectionate and a little absurd. Apologising to the rock gives Andrey a reason to speak; a narrator discussing its personality and career does not. This is fictional continuity with the old display-name reference, not a claim that Andrey owned a real pet rock.

**Delivery / implementation:** Existing scene; dialogue change only.

### 19. The rock follows

**Decision:** Rewrite. Source: `js/script.js: adopt`.

**Before**

> **Game:** Your pet rock will now follow you.  
> **Narrator:** You’ll need to supply the following.  
> **Game:** You pick up Sweet, healthy, happy rock.

**After**

> **Game:** Your pet rock will now follow you.  
> *[Andrey walks a step. The rock does not.]*  
> **Andrey:** Right.  
> *[He goes back and picks it up.]*

The game makes a promise that the rock cannot fulfil. Let the player see the contradiction before Andrey supplies the missing movement. Remove the explanation built around the word “following”.

**Delivery / implementation:** Staging change: add one step and a pause before the existing pickup. The current animation jumps straight to carrying.

### 20. Get everyone into a photograph

**Decision:** Rewrite. Source: `js/script.js: photoSetup`.

**Before**

> **Anya:** One family photo. Then lunch.  
> **Andrey:** What about the light?  
> **Anya:** We got married during Victor’s lunch break. You can pick an aperture.  
> **Andrey:** Take a photo of Anya, Alisa, Arisha, and me.

**After**

> **Anya:** One family photo. Then the picnic.  
> **Andrey:** Let me check the light.  
> **Anya:** We got married during Victor’s lunch break. We can manage a photograph.  
> **Andrey:** Take a photo of Anya, Alisa, Arisha, and me.

Use the specific shared memory as an affectionate comparison. Avoid the writerly aperture comeback, and fix “then lunch” after the fries have already happened. Anya wants a photograph with everyone in it, not a chance to insult his hobby.

**Delivery / implementation:** Existing scene; dialogue change only.

### 21. The robot’s first photograph

**Decision:** Rewrite. Source: `js/script.js: robot`.

**Before**

> **Anya:** Why is the photographer in the photograph?  
> **Robot:** Family members: Anya. Alisa. Arisha. And me.  
> **Andrey:** Not you.  
> **Robot:** Name updated to Not You.

**After**

> *[The robot fills the photograph; the family is behind it.]*  
> **Andrey:** You’re in front of everyone.  
> **Robot:** Yes. Nobody’s blocking me.  
> **Anya:** Can you take one without yourself?  
> **Robot:** I can. You’ll lose the main subject.

Give the robot a consistent concern: its photograph is successful according to its own criteria. When offered a correction, it treats the client’s request as bad artistic judgement. Replace the “Not You” rename routine, which is a second literal-misunderstanding joke before the first image has landed.

**Delivery / implementation:** Supporting text/state change: stop renaming the robot “Not You”; call it Photographer. This proposal is not compatible with leaving the existing photo-menu name joke in place.

### 22. The cheese photograph

**Decision:** Rewrite. Source: `js/script.js: cheese`.

**Before**

> **Andrey:** That’s a sandwich.  
> **Robot:** Contains cheese. Instruction completed.  
> **Danya:** Please don’t put my kitchen on the menu.

**After**

> *[The photo shows the house sandwich.]*  
> **Andrey:** Why did you photograph the sandwich?  
> **Robot:** You asked for cheese.  
> **Danya:** Could you crop out my bedroom?

The robot defends the assignment; Danya worries about a very specific part of the subject. The photo must carry the first laugh. There is no need to announce that the instruction was completed.

**Delivery / implementation:** Existing scene; dialogue change only.

### 23. Zoom out

**Decision:** Rewrite. Source: `js/script.js: zoom`.

**Before**

> **Game:** Photographer: Palm Springs  
> **Andrey:** The lens. Zoom out the lens.  
> **Robot:** You should have said that before I crossed the county line.

**After**

> *[The photograph is now absurdly wide.]*  
> **Andrey:** We’re tiny.  
> **Robot:** I got all of you.

The robot protects one framing rule at the expense of the photograph’s usefulness. Cut the unexplained Palm Springs / county-line geography. The current wide image does not establish a journey to Palm Springs.

**Delivery / implementation:** Reuse the wide-photo renderer. Remove or replace the robot’s lateral walk and Palm Springs overhead caption so the physical action matches a framing error.

### 24. The good family photograph

**Decision:** Rewrite. Source: `js/script.js: family`.

**Before**

> **Alisa:** Did everyone fit in?  
> **Arisha:** Even the rock?  
> **Anya:** Especially the rock.  
> **Anya:** That one’s lovely.  
> **Andrey:** He’s got an eye.  
> **Narrator:** He doesn’t. That’s what makes this so upsetting.  
> **Game:** Your pet rock has advanced a Photography level. His Photography level is now 99.  
> **Alex:** gz rock  
> **Igor:** nice

**After**

> *[The rock presses the shutter. Show the family photograph.]*  
> **Alisa:** You’re in this one, Dad.  
> **Arisha:** Can we keep it?  
> **Anya:** Yes.  
> **Game:** Photography level: 99.  
> *[Alex: “gz rock”. Igor: “nice”. Show these over their heads only.]*

Make the success worth something to the family. Remove the narrator’s competing joke, and do not repeat the overhead congratulations as full portrait conversations. The rock model has visible eyes, so “he doesn’t” is also visually inconsistent.

**Delivery / implementation:** Existing scene; dialogue change only.

### 25. The first paying client

**Decision:** Rewrite. Source: `js/script.js: income`.

**Before**

> **Vendor:** I’ll give him a coin for that one. It can go on the menu.  
> **Game:** Rock’s first earnings: 1 gp.  
> **Narrator:** One photograph. First paying client. I am not narrating his entire career.

**After**

> *[If a sandwich picture already exists:] *  
> **Vendor:** I’ll give him a coin for the sandwich picture. For the menu.  
> *[If the player solved the photo directly instead:] *  
> **Vendor:** Could he take one of the sandwich for my menu?  
> *[One quick product shot. This alternative does not play the wrong-photo conversation.]*  
> **Game:** The rock earns 1 gp.

Make it unambiguous that the vendor buys a food picture, not the family portrait. This is a necessary story transaction; it does not need a joke about how employable the rock is.

**Delivery / implementation:** Small staging addition on the direct-solution route: show the product thumbnail being taken, rather than silently inserting a sandwich photo into the gallery. Both routes still award exactly one coin.

### 26. The lunch bill

**Decision:** Rewrite. Source: `js/script.js: duel`.

**Before**

> **Victor:** I’ve got this.  
> **Andrey:** No, I’ve got this.  
> **Game:** Victor has challenged you to a generosity duel.  
> **Narrator:** Two men enter. Both want to leave with less money.

**After**

> **Vendor:** One coin.  
> **Victor:** I’ll pay.  
> **Andrey:** So will I.  
> *[Duel music and the two insistence bars appear.]*  
> **Vendor:** It’s not an auction.

An ordinary transaction acquires wildly inappropriate combat presentation. The vendor tries to keep the sale ordinary. Remove the announcer describing how both men want less money.

**Delivery / implementation:** Existing scene; dialogue change only.

### 27. Insist on paying

**Decision:** Rewrite. Source: `js/script.js: tactics.insist`.

**Before**

> **Andrey:** NO, I INSIST!  
> **Victor:** YOU GOT IT LAST TIME!  
> **Andrey:** You’ve been using that line for twenty years.  
> **Victor:** Why change a winning strategy?

**After**

> **Andrey:** YOU PAID LAST TIME!  
> **Victor:** YOU SAY THAT EVERY TIME!  
> **Andrey:** AND YOU KEEP MAKING IT TRUE!  
> *[The insistence blast pushes Victor back. The bill remains unpaid.]*

The argument has a small circular logic: each man’s generosity supplies the other man’s excuse. The final line is Andrey’s attempt to win, not a general observation about twenty years of banter.

**Delivery / implementation:** Timing change: start the exchange before/during the blast, not after the entire attack.

### 28. Pay for everyone

**Decision:** Rewrite. Source: `js/script.js: tactics.everyone`.

**Before**

> **Narrator:** Area-of-effect generosity. He’s paying for people we haven’t introduced yet.  
> **Victor:** Fine. I’ll pay you back.  
> **Andrey:** Then I’ll pay you back for paying me back.  
> **Game:** Anya catches the coin. The robot prints an unsolicited receipt.

**After**

> **Andrey:** Everyone. My treat.  
> *[Coins fly beyond the picnic table.]*  
> **Vendor:** I meant this table.  
> **Andrey:** They can sit with us.

The escalation grows out of Andrey’s social generosity: his answer is to enlarge the table, not retract the offer. Cut “area-of-effect generosity”, which only labels the animation.

**Delivery / implementation:** Existing coin burst. A wave towards the nearby people helps the last line, but no new cast or second payment is required.

### 29. Try to pay secretly

**Decision:** Rewrite. Source: `js/script.js: tactics.secret`.

**Before**

> **Victor:** Nice try. I paid while you were choosing dialogue options.  
> **Game:** The vendor turns the receipt over: NICE TRY.  
> **Vendor:** The actual bill is still here.

**After**

> *[Andrey slides towards the vendor with his coin pouch.]*  
> **Vendor:** Your friend told me not to take your money.  
> **Andrey:** Good man. I told you not to take his.  
> *[The vendor turns over the NICE TRY sign.]*  
> **Game:** Lunch bill: 1 gp. Unpaid.

Andrey is pleased with Victor’s generosity while creating a mutual payment blockade. This also fixes a real contradiction: the old Victor says he already paid, but the state still requires the bill to be settled.

**Delivery / implementation:** Existing scene; dialogue change only.

### 30. Split the bill

**Decision:** Trim. Source: `js/script.js: tactics.split`.

**Before**

> **Anya:** Half each.  
> **Andrey:** I’ll pay his half.  
> **Victor:** I’ll pay his half.  
> **Game:** Andrey: 100%. Victor: 100%. The trade panel folds itself closed.  
> **Narrator:** Even the fractions have given up.

**After**

> **Anya:** Half each.  
> **Andrey:** I’ll pay his half.  
> **Victor:** I’ll pay his half.  
> *[Trade: Andrey 100%. Victor 100%. The panel closes.]*

Keep the actual joke. Remove the narrator’s “fractions have given up”: the arithmetic and the failed trade already provide the ending.

**Delivery / implementation:** Keep the existing trade graphic; remove duplicate spoken/overhead copies of the same line.

### 31. The rock pays

**Decision:** Rewrite. Source: `js/script.js: settled`.

**Before**

> **Game:** The vendor accepts the rock’s earned coin. Lunch bill settled.  
> **Andrey:** I’ll pay him back.  
> **Anya:** Why do you think he’s so quiet?  
> **Narrator:** For years, the rock has been practising the only defence that works.

**After**

> *[The vendor accepts the rock’s earned coin.]*  
> **Game:** Lunch bill settled.  
> **Andrey:** How much do I owe him?  
> **Anya:** Ask him.  
> **Rock:** …  
> *[A short silence. Move on to the present.]*

Let the rock’s silence defeat repayment. Anya gives Andrey an apparently reasonable next step. Cut the narrator’s explanation of why silence works.

**Delivery / implementation:** Hold the rock portrait for a short beat without a speech sound; do not turn the pause into several extra clicks.

### 32. Hand over the cracker

**Decision:** Replace with plain handover. Source: `js/script.js: crackerSetup`.

**Before**

> **Andrey:** A Christmas cracker? It’s November.  
> **Victor:** You asked for nothing. This is what happens when you leave me unsupervised.

**After**

> **Victor:** Here. You take that end.  
> *[Offer the partner choices.]*

Cut the calendar argument and the stock “leave me unsupervised” line. This is a transition into an interactive object with its own comic possibilities, not a separate sketch.

**Delivery / implementation:** Text only. Keep the cracker recognisable in the image and inventory.

### 33. Pull it alone

**Decision:** Rewrite. Source: `js/script.js: alone`.

**Before**

> **Narrator:** You’ve spent the whole quest collecting people. Borrow a pair of hands.

**After**

> *[Andrey stretches the cracker between his own hands. It does not open.]*  
> **Narrator:** You still only count as one person.

Use a light callback to the split arrival. Do not lecture the player about having spent the whole game collecting friends.

**Delivery / implementation:** Existing scene; dialogue change only.

### 34. Ask the rock to pull

**Decision:** Rewrite. Source: `js/script.js: rockCracker`.

**Before**

> **Andrey:** He’s been surprisingly useful today.  
> **Narrator:** Photography is one thing. We haven’t unlocked elbows.

**After**

> **Andrey:** Take the other end.  
> **Rock:** …  
> **Andrey:** Fair enough.

Andrey asks sincerely because the rock has already done two impossible-looking jobs. The absence of a response ends the attempt. Remove the generic “unlocked elbows” line.

**Delivery / implementation:** Put the instruction before the failed attempt. A brief silent rock portrait is enough.

### 35. Open with Victor

**Decision:** Rewrite. Source: `js/script.js: victorCracker`.

**Before**

> **Victor:** You take it.  
> **Andrey:** No, you take it.  
> **Narrator:** No. No, we’re not doing this again. You. Tall you. Hat. Now.

**After**

> **Victor:** If you win, you get the hat.  
> **Andrey:** And if you win?  
> **Victor:** You get the hat.  
> **Andrey:** That’s not fair.  
> *[Pull. Hat awarded and equipped. Victor has successfully rigged a game in Andrey’s favour.]*

Give the final dispute a fresh form: Andrey objects to a game that is unfairly generous to him. Victor’s strategy actually gets the present accepted. Remove “Tall you. Hat. Now.” and another repetition of “you take it”.

**Delivery / implementation:** Play the terms before the pull. The equipped-hat reveal should finish the scene.

### 36. Open with Anya, Alisa, or Arisha

**Decision:** Rewrite. Source: `js/script.js: familyCracker`.

**Before**

> **Andrey:** Can I at least pay for…  
> **Narrator:** No.

**After**

> *[Pull. The hat lands on Andrey’s head.]*  
> *[Chosen partner]|Happy birthday!*  
> **Andrey:** Thank you.

Let this choice produce a warm family moment. Andrey does not need to attempt another payment every time someone speaks, and the narrator does not need to interrupt his family.

**Delivery / implementation:** Use the selected partner’s name, portrait, and voice. This requires separate recordings for the three possible speakers, not a literal “chosen partner” voice. On this route, go straight to completion and the letter; do not immediately ask for a complaint after Andrey has said thank you.

### 37. After receiving the hat

**Decision:** Rewrite. Source: `js/script.js: complaint`.

**Before**

> **Victor:** Well? Going to complain?

**After**

> **Victor:** Well?  
> *[Offer the material complaint and a genuine “Thank you. It’s perfect.” option. Review the old extra complaint options below.]*

A shorter invitation lets the player choose the tone. Add a sincere response so the game does not force Andrey to complain in order to reach the letter.

**Delivery / implementation:** Existing scene; dialogue change only.

### 38. Quest complete

**Decision:** Trim. Source: `js/script.js: complete`.

**Before**

> **Game:** Just Accept the Hat: Quest complete.  
> **Game:** 1 rare hat · 1 quest point · Danya’s house restored · A family photo taken by a rock.  
> **Game:** New side quest: Pay Victor back.  
> **Anya:** Cancelled.

**After**

> **Game:** Just Accept the Hat: Quest complete.  
> **Game:** 1 rare hat · 1 quest point · Danya’s house restored · A family photo taken by a rock.  
> *[Fanfare. Let the player see the equipped hat. Continue to Victor’s letter when ready.]*

Keep the actual reward and remove the immediate new repayment quest. Restarting the same argument here weakens the acceptance that the cracker scene has just earned. The birthday letter needs a clean handover.

**Delivery / implementation:** No narrator or automatic voice line over the letter.

## Menus and repeated prompts

### 39. Opening narrator prompt

**Decision:** Rewrite. Source: `js/main.js: menu / stage 0`.

**Before**

> **Narrator:** An elegant plan: collect one birthday present. How difficult could it be?

**After**

> **Narrator:** The rare item had already been found. Unfortunately, Andrey was about to ask what he owed for it.

Introduce the specific conflict. Remove the generic “how difficult could it be?” forecast of things going wrong.

**Delivery / implementation:** Text only.

### 40. Choosing a route

**Decision:** Simplify. Source: `js/main.js: menu / stage 3`.

**Before**

> **Narrator:** The camera is safe. Choose your route to the shore.  
> *[Location label: G. Ross Park · Two perfectly sensible routes]*  
> *[Buttons: Park path / Visit tourist attraction]*

**After**

> **Game:** Choose a route to the shore.  
> *[Location label: G. Ross Park]*  
> *[Buttons: Park path / Sewer pipe]*

Navigation should tell the truth. Move the keeper’s sales pitch into the interaction, rather than making the interface disguise a destination.

**Delivery / implementation:** Text only.

### 41. House menu / repeated Danya line

**Decision:** Trim. Source: `js/main.js: houseMenu`.

**Before**

> **Danya:** There’s bread at mine. Make yourself a sandwich.  
> **Game:** A sandwich containing one entire house. Danya is at the window.  
> **Game:** Packed house sandwich. Contains downstairs.  
> **Game:** That is quite enough residential catering.

**After**

> *[Before the transformation: objective only, “Use bread at Danya’s house.” Do not replay Danya’s invitation.]*  
> *[After the transformation: show Eat / Share / Pack / Put it back. The image already shows Danya at the window.]*  
> *[After packing: “Put the house back.” Keep “Contains downstairs” as the item description.]*  
> *[After either other wrong choice: “Put the house back.”]*

Repeated menu copy currently re-performs an exchange and then describes what is visible. Keep choices and state clear, without adding another residential-catering joke.

**Delivery / implementation:** Text/UI simplification.

### 42. Repeated rock introduction

**Decision:** Trim. Source: `js/main.js: rockMenu / stage 4`.

**Before**

> **Game:** Sweet, healthy, happy rock. Same personality since 2004.  
> **Game:** Sweet, healthy, happy rock. Level 99: staying exactly where you left him.

**After**

> *[Name: Sweet, healthy, happy rock.]*  
> *[Actions: Pick up / Check skills / Mine.]*

The rock’s name carries the old reference. Do not surround the encounter with two more descriptions of its immobility.

**Delivery / implementation:** Text only; retain the adoption state transition.

### 43. Repeated photography prompt

**Decision:** Simplify. Source: `js/main.js: photoMenu`.

**Before**

> **Game:** The photographer is now called Not You. The camera still needs an operator.

**After**

> **Game:** Take a photograph with everyone in it.  
> *[Actions: Use rock on shutter / Say cheese / Zoom out / Review photographs.]*

An objective is useful; a recap of a discarded rename joke is not. Wrong-photo options remain single-use.

**Delivery / implementation:** Requires the rename removal proposed in the first robot scene.

### 44. Bill prompts and hint

**Decision:** Simplify. Source: `js/main.js: duelMenu / stages 6–7`.

**Before**

> **Game:** One lunch bill. Two insistence bars. No actual combat.  
> **Game:** The bill is still unpaid. Symbolic coins do not count.  
> **Game:** The rock has actual earnings. Perhaps let him try.  
> **Game:** The bill is settled. For once, nobody owes Victor anything.

**After**

> **Game:** Lunch bill: 1 gp.  
> *[After an attack: keep the bill visibly marked Unpaid.]*  
> *[After two attacks: highlight “Let the rock handle it.” Hint, if needed: “The rock earned a coin.”]*  
> **Game:** Bill settled. Open the present.

Let the animations create absurdity while the interface reports facts. Do not explain symbolic currency or insist that “nobody owes Victor” when he was not the one who paid.

**Delivery / implementation:** Keep the current three-attempt cap and early rock-settlement option.

## Reward replies

### 45. Paper hat complaint

**Decision:** Keep. Source: `js/main.js: complaintMenu / CONFIG.rewards.party`.

**Before**

> *[Choice: It’s made of paper.]*  
> **Victor:** At that price, you’d expect lamination.

**After**

> *[Choice: It’s made of paper.]*  
> **Victor:** At that price, you’d expect lamination.

Keep this one. Victor joins the complaint rather than scolding Andrey for it, and the contrast between cheap material and rare-item value belongs to this hat.

**Delivery / implementation:** Text unchanged.

### 46. “I wanted nothing” complaint

**Decision:** Cut. Source: `js/main.js: complaintMenu / nothing`.

**Before**

> *[Choice: I wanted nothing.]*  
> **Victor:** It gives zero defence. You basically got nothing.

**After**

> *[Remove this choice. The introduction has already used the zero-stats joke, and the present has now been accepted.]*

This repeats the opening’s premise and devalues the reward just as it should feel good. Do not invent a different joke about buying nothing to fill the same slot.

**Delivery / implementation:** Remove the option; no progression change.

### 47. Matching boots complaint

**Decision:** Replace with sincere option. Source: `js/main.js: complaintMenu / boots`.

**Before**

> *[Choice: Where are the matching boots?]*  
> **Victor:** Have a look under Leftovers. You made a house earlier.

**After**

> *[Replace this choice with: Thank you. It’s perfect.]*  
> **Victor:** Happy birthday, mate.

The old house-to-leftovers-to-boots connection is arbitrary. A sincere alternative makes the reward a choice the player can enjoy, instead of requiring another complaint.

**Delivery / implementation:** Add the sincere choice to the existing completion transition.

### 48. Santa hat alternative

**Decision:** Rewrite. Source: `js/config.js: rewards.santa`.

**Before**

> *[Choice: Does it come in blue?]*  
> **Victor:** That’s next year’s entire development budget.

**After**

> *[Choice: Does it come in blue?]*  
> **Victor:** I’m not explaining that to Santa.

The reply belongs to the object and the friendship. Remove the reference to the game’s production budget.

**Delivery / implementation:** Only used when CONFIG.reward is santa.

### 49. Examining the rare hats

**Decision:** Trim. Source: `js/config.js: rewards.*.examine`.

**Before**

> **Game:** Blue Party Hat: Zero defence. Zero warmth. Worth more than this building.  
> **Game:** Red Santa hat: Zero defence. Warm ears. Still worth more than this building.

**After**

> **Game:** Blue Party Hat: No protection. Do not get wet.  
> **Game:** Red Santa hat: No protection. Warm ears.

The banker now owns the price/stats joke. Give item examination its own compact description rather than repeating that exchange whenever the hat is clicked.

**Delivery / implementation:** Update the shared reward configuration, so bank examination and inventory inspection agree.

## Optional interactions

### 50. Height selector

**Decision:** Cut. Source: `js/main.js: height`.

**Before**

> *[Title: Height: 195 cm.]*  
> *[Buttons: Normal / Tall / We have found the problem.]*  
> **Game:** You cannot reroll your knees.

**After**

> *[Remove the fake settings choices. Keep “Height: 195 cm” in a small character profile if desired.]*

Three buttons with the same non-result feel like broken controls. The height is already used by the arrival and pipe; it does not need a separate knees joke.

**Delivery / implementation:** Remove the modal action; retain any factual profile text.

### 51. Try mining the rock

**Decision:** Trim. Source: `js/main.js: Mine`.

**Before**

> **Game:** You raise an imaginary pickaxe. The rock looks at you. You lower it.  
> **Game:** You cannot train Mining on your friends.

**After**

> **Game:** You cannot train Mining on your friends.

Keep the refusal. Remove the text pretending to animate a pickaxe that the scene does not actually show.

**Delivery / implementation:** Plain unvoiced game message; keep single-use behaviour.

### 52. The rock’s skills

**Decision:** Trim. Source: `js/main.js: rockSkills`.

**Before**

> **Game:** Sit: 99. Stay: 99. Recall: 1. Photography: 1 or 99.  
> **Game:** The Recall problem is being treated with a pocket.

**After**

> **Game:** Sit: 99. Stay: 99. Recall: 1. Photography: 1 or 99.  
> *[Recall tooltip: “You have to go and get him.”]*

The absurd stats already work. Make the Recall note a practical explanation with a small payoff, rather than a writer’s line about treating a problem.

**Delivery / implementation:** Keep the skills panel, not a voiced conversation.

### 53. Pet the rock

**Decision:** Simplify. Source: `js/main.js: Pet`.

**Before**

> **Game:** The rock moves two pixels.  
> **Narrator:** Easy. You’ll make him think he’s a dog.  
> *[Repeat: Sweet, healthy, happy rock. Still happy.]*

**After**

> **Game:** You pet the rock.  
> *[The rock has exactly the same expression. No spoken response.]*

Do not claim motion the player may not see, or explain the animal comparison. This is a small affectionate action; the unchanging rock is the result.

**Delivery / implementation:** Target the carried/tripod/picnic rock actually visible in the current state. The existing pet animation only shifts the picnic model.

### 54. Try selling the photographer

**Decision:** Replace interaction. Source: `js/main.js: sellRock`.

**Before**

> **Vendor:** Does he have a website?  
> **Andrey:** He’s a rock.  
> **Vendor:** So he’ll actually answer his emails.  
> **Game:** The rock remains with you.

**After**

> *[Replace “Try selling” with “More photo work?”]*  
> **Vendor:** Same sandwich next week?  
> **Danya:** No.

The email joke has no causal logic, and selling the companion cuts against Andrey’s affection. The new option lets the vendor want a repeat commission and gives Danya a concrete reason to shut it down.

**Delivery / implementation:** After the first commission only. Danya is at the picnic in this state. No new commission or coin is awarded.

### 55. Offer the sandwich souvenir to the bank

**Decision:** Rewrite. Source: `js/main.js: souvenirBank`.

**Before**

> **Banker:** We accept valuables.  
> **Andrey:** There’s a house in it.  
> **Banker:** Then why is it in Food?

**After**

> **Banker:** Any outstanding mortgage?  
> **Andrey:** It’s a sandwich.  
> **Banker:** That’s not a no.

The banker treats the impossible object as a normal property problem. Remove the reference to a Food category the actual inventory does not have.

**Delivery / implementation:** Keep this as a one-time examination gag; do not introduce a mortgage mechanic or remove the souvenir.

### 56. Kick the football

**Decision:** Simplify. Source: `js/main.js: football`.

**Before**

> *[Overhead: Igor — Moral support!]*  
> **Igor:** I was there for moral support.

**After**

> *[Kick the ball. Igor calls from the side:] *  
> **Igor:** Nice one!  
> *[No portrait dialogue or second comment.]*

The current line relies on a memory the player has not been shown. Let this remain an enjoyable football action and a friendly reaction. It does not need to become another sketch.

**Delivery / implementation:** Keep the existing kick. Play the short reaction over the world.

### 57. Examine the volleyball

**Decision:** Simplify. Source: `js/main.js: volleyball`.

**Before**

> **Game:** A sport for days when football wasn’t using enough of his arms.

**After**

> **Game:** A volleyball. Another reason to go outside.

Preserve the sporty personal reference without a laboured comparison of which limbs football uses.

**Delivery / implementation:** Small examination caption, not a portrait conversation.

### 58. Old oak grove

**Decision:** Cut spoken joke. Source: `js/main.js: oak`.

**Before**

> **Narrator:** A tree. No errands, no missing relatives, no request for twenty logs.

**After**

> **Game:** An old oak.

Cut generic fetch-quest satire. The larger map needs ordinary scenery too; otherwise every click demands another knowingly clever performance.

**Delivery / implementation:** Hover/examine caption only.

### 59. The village well

**Decision:** Simplify. Source: `js/main.js: well`.

**Before**

> **Game:** You see a tall adventurer looking back. Still no room for the hat in the reflection.

**After**

> **Game:** Clear water. A very long way down.

The old hat/reflection sentence does not describe a coherent physical problem. Use a clean environmental observation rather than forcing another tall/hat reference.

**Delivery / implementation:** Examine caption only.

### 60. Lakeside landing

**Decision:** Cut spoken joke. Source: `js/main.js: harbor`.

**Before**

> **Narrator:** The boat leaves after the birthday. For once, there is no urgent departure.

**After**

> **Game:** A quiet spot by the lake.

There is no boat or departure in the game. Remove the nonexistent event and let the optional view be a quiet place.

**Delivery / implementation:** Examine caption only.

### 61. The old watchtower

**Decision:** Cut joke. Source: `js/main.js: tower`.

**Before**

> **Game:** An old watchtower. Excellent defence against birthdays arriving unexpectedly.

**After**

> **Game:** A ruined watchtower overlooking the lake.

The original is a random juxtaposition rather than a joke emerging from an action or character. A larger world should contain ordinary ruins.

**Delivery / implementation:** Examine caption only.

### 62. Take a break

**Decision:** Rewrite. Source: `js/main.js: bench`.

**Before**

> **Narrator:** No quest. No loot. Nobody asking you to collect five cabbages.  
> **Narrator:** I can put some cabbages nearby if this is making you uncomfortable.

**After**

> *[Andrey sits. Hold the view for a moment.]*  
> **Narrator:** Andrey sat down for a moment. A brief rest would do him good.  
> *[Only if the player remains seated for a few seconds:] *  
> **Narrator:** He had now rested.  
> *[If the player still does not get up:] *  
> **Narrator:** I can’t make that any more past tense.  
> *[Silence. The player can get up at any point; there is no reward for waiting.]*

The narrator tries to make the player move by describing the rest as already finished. When that fails, his faith in the power of narration visibly strains. This needs the player’s continued decision to sit: it would be weaker as a fixed sequence of Next buttons.

**Delivery / implementation:** Requires an actual sitting pose and two interruptible delayed reactions; the current “Sit quietly” action only walks to the bench. Cancel the delayed lines immediately when the player leaves.

### 63. Santee memory

**Decision:** Keep reference; remove joke. Source: `js/main.js: sign`.

**Before**

> **Game:** Santee. Base camp. The sofa is mostly theoretical.

**After**

> **Game:** Santee. Home with Anya, Alisa, and Arisha.

This personal landmark can be affectionate without suggesting an invented domestic complaint about never getting to sit down.

**Delivery / implementation:** Unvoiced memory caption.

### 64. Mykonos memory

**Decision:** Keep reference; simplify. Source: `js/main.js: moped`.

**Before**

> **Game:** Anya rode with Andrey. The rest of us were trusted with our own steering.

**After**

> **Game:** Mykonos. Anya and Andrey shared a moped; the rest of us had our own.

The supplied memory is specific enough to matter. There is no need to imply anything about driving competence.

**Delivery / implementation:** Unvoiced memory caption.

### 65. South Africa memory

**Decision:** Simplify. Source: `js/main.js: penguin`.

**Before**

> **Game:** Safari equipment: camera, sensible shoes, room for an unexpected penguin.

**After**

> **Game:** South Africa. Yes, the penguins belong there.

The penguin’s presence in the little birthday village is the visual surprise. The tag can connect it to the real place instead of listing whimsical equipment.

**Delivery / implementation:** Unvoiced memory caption.

### 66. Rock examined too early

**Decision:** Rewrite. Source: `js/main.js: rock / before adoption`.

**Before**

> **Keeper:** A guaranteed sighting. Meet the others and collect the camera first.

**After**

> **Keeper:** He’ll still be here. Go and get the camera.

Give a useful hint that also suits the immovable exhibit. Do not spend the tour’s main line before the tour happens.

**Delivery / implementation:** Text only.

### 67. Return to Danya’s house

**Decision:** Rewrite. Source: `js/main.js: house / examination`.

**Before**

> **Danya:** Lunch first. Then we’ll get the camera.  
> *[After restoration:] Danya|Residential again. Thank you.*

**After**

> *[Before lunch:] Danya|Come and get some fries first.*  
> *[After restoration:] Danya|Please knock. With your hand.*

Before the scene, give a clear invitation. Afterwards, Danya has a specific concern about what the player might use on his house next.

**Delivery / implementation:** Text only.

### 68. Talk to Anya before the photo

**Decision:** Rewrite. Source: `js/main.js: photo / optional talk`.

**Before**

> **Anya:** Bring the camera. And yourself. We need both in roughly the same place.

**After**

> *[If the camera has not been collected:] Anya|Danya’s got the camera.*  
> *[If the player has it:] Anya|We’ve saved you a space.*

Make the hint depend on the actual problem. When the camera is present, the family wants Andrey included; that supports the later good-photo line rather than making another joke at his expense.

**Delivery / implementation:** Conditional hint text based on cameraOwned.

### 69. Talk to Victor before the present

**Decision:** Rewrite. Source: `js/main.js: picnic / optional talk`.

**Before**

> **Victor:** Lunch, one photo, then the hat. You don’t have to reimburse the itinerary.

**After**

> *[Before the camera:] Victor|Camera’s at Danya’s. We’ll meet you at the shore.*  
> *[Before the photograph:] Victor|Go on. They’ve left you a space.*  
> *[After the photo, before the bill:] Victor|Right. What do we owe for lunch?*

Use Victor for the next useful step. Drop the abstract itinerary joke. The payment conflict should begin when the bill arrives, not recur in every greeting.

**Delivery / implementation:** Choose the relevant line by quest state.

### 70. The robot’s remaining contribution

**Decision:** Rewrite. Source: `js/main.js: picnic / Robot receipt`.

**Before**

> **Game:** Photographic services: replaced by a rock. Remaining service: unsolicited receipts.

**After**

> **Robot:** Receipt. One family photograph.  
> **Andrey:** Taken by a rock.  
> **Robot:** Paperwork by me.

Complete the robot’s small character arc: it still finds a way to claim a useful contribution. This is more particular than describing it as an unsolicited-receipt machine.

**Delivery / implementation:** Text only.

### 71. Route hint when visited too early

**Decision:** Trim. Source: `js/main.js: route examination`.

**Before**

> **Keeper:** Both routes lead to the shore. Collect the camera at Danya’s first.

**After**

> **Keeper:** Both routes go to the shore. Danya’s got your camera.

Keep the useful information and speak it naturally. A hint does not have to be a punchline.

**Delivery / implementation:** Text only.

### 72. Examine the house souvenir

**Decision:** Keep. Source: `js/main.js: sandwich item`.

**Before**

> **Game:** Packed lunch. Contains downstairs.

**After**

> **Game:** Packed lunch. Contains downstairs.

Keep. It is short, tied to a specific object the player created, and does not require a spoken exchange.

**Delivery / implementation:** Unvoiced item examination.

### 73. Repeating an optional action

**Decision:** Cut self-commentary. Source: `js/main.js: repeated optional gag`.

**Before**

> **Game:** A fine joke. Still true.

**After**

> *[Do not replay the conversation. Use the ordinary action result or a short state message, e.g. “The rock stays with you.”]*

The game should not congratulate itself on having told a joke, especially when the player may simply be checking an interaction.

**Delivery / implementation:** Retain the seenOptionalGags guard; remove the self-reviewing toast.

## Captions and ending

### 74. Photo captions

**Decision:** Trim. Source: `js/main.js: captions`.

**Before**

> **Game:** Robot: Take a photo of Anya, Alisa, Arisha… and me.  
> **Game:** Cheese: House sandwich. Contains cheese. First paying client: Centerpoint Fries.  
> **Game:** Zoom: Photographer: Palm Springs. The family is technically in frame.  
> **Game:** Family: Anya, Alisa, Arisha, and Andrey. Photography by Sweet, healthy, happy rock.

**After**

> **Game:** Robot: The photographer. The family is behind him.  
> **Game:** Cheese, before sale: House sandwich.  
> **Game:** Cheese, after sale: House sandwich. Menu photo for Centerpoint Fries.  
> **Game:** Zoom: Everyone is in the picture.  
> **Game:** Family: Anya, Alisa, Arisha, and Andrey. Photography by Sweet, healthy, happy rock.

Keep captions distinct from the conversation. Remove Palm Springs and do not reveal the paying-client outcome before the commission occurs.

**Delivery / implementation:** Make the sandwich caption depend on whether the commission has happened. Keep the family caption unchanged.

### 75. Post-quest memories

**Decision:** Simplify. Source: `js/main.js: gallery / memories`.

**Before**

> **Game:** Las Vegas: Two families. Andrey considered this an outdoor activity.  
> **Game:** Salton Sea: We went to have a look. This explains most of our itinerary.  
> **Game:** Christmas in San Diego: Same friends. More stockings.

**After**

> **Game:** Las Vegas. Another trip with both families.  
> **Game:** Salton Sea. We went to have a look.  
> **Game:** Christmas in San Diego. More years, more Christmases together.

These should be personal memories, not three unrelated one-liners competing with Victor’s letter. They currently have no real photographs attached, so label them as memory notes.

**Delivery / implementation:** Unvoiced gallery notes. Avoid suggesting the generated quest picture documents those real trips.

### 76. Overhead lines during animations

**Decision:** Remove duplicates. Source: `js/world.js: overhead dialogue`.

**Before**

> *[Lunch: Heard there was food. / +0.2]*  
> *[House sharing: Alex — I’ll take the kitchen. Igor — Not the bathroom.]*  
> *[Robot: Family members: …and me. / Photographer: Palm Springs]*  
> *[Family: Alex — gz rock. Igor — nice.]*  
> *[Payment: NO, I INSIST! / EVERYONE! / … / I’ll pay his half.]*  
> *[Football: Moral support!]*

**After**

> *[Lunch: keep +0.2 as a game effect; let the new guests arrive silently.]*  
> *[House: use the proposed sharing exchange once, not additional kitchen/bathroom lines.]*  
> *[Robot: use the proposed photo dialogue; remove the two old overhead captions.]*  
> *[Family: keep gz rock / nice here only.]*  
> *[Payment: show the relevant proposed spoken line here if needed, but do not replay it afterwards in a second dialogue box.]*  
> *[Football: Igor — Nice one!]*

The same beat is currently often presented as an animation caption, then again as a portrait conversation. Pick one delivery. Numbers and ambient congratulations can remain overhead without demanding another click.

**Delivery / implementation:** Synchronise these with the scene text and voice. Do not play duplicate voice files.

### 77. Victor’s birthday letter

**Decision:** Keep. Source: `js/config.js: letter`.

**Before**

> **Victor:** Happy birthday, Andrey.  
> **Victor:** In 2006, I wished you good friends, a good job, a beautiful and smart wife, and plenty of happiness. Finding that old message made me smile.  
> **Victor:** From sharing fries in Toronto to spending Christmases together with our families in San Diego, I'm so glad we've kept adding chapters to this friendship. You're still curious, generous, and always ready for an adventure, now with Anya, Alisa, and Arisha alongside you.  
> **Victor:** Here's to many more adventures together.  
> **Victor:** Victor

**After**

> **Victor:** Happy birthday, Andrey.  
> **Victor:** In 2006, I wished you good friends, a good job, a beautiful and smart wife, and plenty of happiness. Finding that old message made me smile.  
> **Victor:** From sharing fries in Toronto to spending Christmases together with our families in San Diego, I'm so glad we've kept adding chapters to this friendship. You're still curious, generous, and always ready for an adventure, now with Anya, Alisa, and Arisha alongside you.  
> **Victor:** Here's to many more adventures together.  
> **Victor:** Victor

Keep the sincere letter. It has a different job from the comic quest: it names the friendship, the families, and the years together. No joke needs to be attached to it.

**Delivery / implementation:** Keep optional Listen playback; no narrator interruption or automatic gag over the letter.

## Scope check

All **38 main-script conversation entries** are covered, including every lunch, house, route, payment, and cracker alternative. The remaining **39 review entries** cover menu dialogue, all optional spoken interactions, reward alternatives, item jokes, overhead reactions, photo captions, post-quest memories, and the letter. Ordinary functional labels, loading errors, and sound-setting descriptions were read for context but are not rewritten as comedy.

The largest removals are the automatic weather detour, the old 2006 interrogation in the introduction, the robot’s name-change routine, repeated narrator explanations, and the immediate new payback quest. The genuine 2006 friendship reference remains in the letter. No new private biographical facts have been invented.

This is an editorial draft, not a claim that every line has been playtested or that a read-through establishes first-play duration. I would judge the principal scenes in sequence, with the pauses and images, before recording final voices.
