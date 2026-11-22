# Gate A: the read

The first of the two gates in `SPEC.md` ("Proof before screens"). Before any
work on this game's own rules, the author reads about 3,000 words and answers
three questions. Divine Mismanagement used the same gate. No instrument can
judge it.

**Status: third draft, 2026-11-22, waiting on the author.** Two verdicts so
far, neither a pass.

- On the first draft: "It did not have enough dry wit, but I liked the way it
  was narrated. Keep the ai feel out of the prose, I beg you."
- On the second: "Make sure the choices are actually worth choosing. Every
  choice should lead in 3 different paths of the same story, not interruptive
  of those choices. And the first choice where you go into the door and choose
  starting kit should give 3 different approaches. This may be a choose your
  own adventure narrative, but I don't want it to ever feel predetermined".

## What the third draft changed: the choices

The second draft had four choices and followed one answer to each. Read
against the author's words, three of the four were not worth choosing:

| Choice in the second draft | What was wrong with it |
|---|---|
| The shed: fill your pockets / go now / drive back and call someone | One real answer, one the same with less in it, and one that refuses the story |
| The hill: what to tell the boy | All three led to the same fire and the same boy. Flavour |
| The hall: can you build it | Real, but only one answer was written, so it read as the right one |
| Aud: the note | Never answered |

The rule now, for every choice in the game (`CLAUDE.md`):

1. **Three roads through the same story.** Each answer is a way of going on.
   None is a refusal, a delay, a wrong answer or the same answer said rudely.
2. **Nothing later cancels it.** A road is not folded back into the others by
   the next scene. The same places and people come round, and they meet a
   different person: one with a trade, one who knows too much, one with
   something to give.
3. **No choice is offered where three roads cannot be written.** The hill has
   no choice in this draft. What happens there comes from what was carried.

This is read as "not interruptive": the story does not interrupt a road to
put the hero back on the one it had planned. If that is not what was meant,
the rule is wrong and should be said again.

How the sample shows it: there are two choices, and **all three answers to
each are written.** Nothing is in bold. The text that every road shares is
written once; where the roads part, each is headed by what was chosen.

**What this costs.** Three written roads at every choice is about three times
the prose at that point, and the roads cannot multiply for ever: two choices
here would be nine halls if nothing were shared. The sample shares the place
and the people and varies who the hero is to them, which is the only way 150
scenes stays 150 scenes. The SPEC's count was made before this rule and is now
too low by an amount not yet measured. The kit has a tool for the other half
(`npm run audit` lists every choice whose effect is flavour or nothing); it
goes into `npm run check` as a failure when this game's content starts.

## What the second draft changed: the prose

The narration is kept: second person, present tense, a narrator who stands
beside the hero and reports. The wit sits in the reporting and in what people
say, as understatement. These habits of the first draft read as generated and
are cut:

| Habit | From the first draft |
|---|---|
| A short line alone at the end of a paragraph, for effect | "Not who. What." "Nobody laughs at that." "You had not known there was a hum." |
| Telling the reader what they have just worked out | The last paragraph, which explained that the uncle had got home and gone again |
| Lists of three, and "no this, no that, no the other" | "No road cut, no tower, no contrail, no hum." |
| Two flat sentences where one with a turn in it would do | "It is dark, and it is enormous." |
| An echo for a closing beat | "It comes back." "It comes back." |
| "The way you would", again and again | Five times in 2,700 words |
| A line that is a joke and knows it | "Unkel once tried to milk the ram." |

They are rules for all prose in this game (`CLAUDE.md`), and go into the
style guide's lint lists when it is written.

## What was chosen to write it, and is not decided

The sample had to pick things the SPEC leaves open. None of these is a
decision until the author says so.

| Chosen for the sample | Why | Open? |
|---|---|---|
| Second person, present tense | Vikingr's voice, and the story engine's | Yes |
| The hero is a man who welds for a living and courts women | One setup had to be picked. A woman's arrival at the hall is a different scene, not this one with the pronouns changed, and is not written yet | The setup is the player's; the sample is one of them |
| "Now" is a machine shed two hours of gravel from a prairie town, unnamed | The door needed a workshop, and a long drive from the sea makes the smell of low tide do its work | Yes |
| The uncle is Walter; the hall hears "uncle" as his name, Unkel | He never told them another | Yes |
| The language conceit is a brass thing worn behind the ear, labelled "EAR. MOSTLY WORKS." | The SPEC asks for one conceit, stated once and left alone | Yes |
| The hall is Thorgrim Ketilsson's, a *hersir* (a local chieftain) on a western fjord. Aud Ketilsdóttir, his widowed sister, holds the keys. She is one of the two women | Invented people in a real place and year | Yes |
| The uncle left the hall six nights before the hero arrives, and the letter sat through one Saturday | It puts the hero one step behind, as the SPEC asks. How time runs between the two sides of the door is not designed | Yes |

History in the sample: fire steels and tinder fungus, turf roofs, tarred
clinker boats, water and a towel offered to a guest (it is in *Hávamál*), and
a woman of the house carrying its keys are from memory of well-attested
things and are not yet in `docs/HISTORY.md`. The king is mentioned once and
not named, because where Harald's power lay is disputed.

Sugar was not known in Norway in 870 and pepper was a rare thing from far
away; both from memory, not yet checked.

---

## 1. The shed

Your uncle Walter does not trust telephones, so the news comes by post, on one
page, in block capitals pressed hard enough to read from the back.

GOT IT WORKING. COME SATURDAY. BRING YOUR GOOD HELMET. DO NOT TELL YOUR MOTHER.

He has ended every letter that way since you were nine, including the
Christmas cards, which he addresses to her. He did not say which Saturday. You
let that carry you past the first one, and it is the second when you go.

It is two hours of gravel to his place. The yard light is on at noon and his
truck is in the yard with the flat you mentioned in April, when he said he was
aware of it. The shed door is rolled open a foot for the cat.

Inside, the heater is running for nobody. There is a cup of coffee on the
bench with a skin on it, and the radio is on low, where a man is reading out
the price of canola.

Bolted to the slab in the middle of the floor is a door frame, with no door in
it and no wall around it. It is seven feet of two-inch square tube, and cables
as thick as your wrist run from it to a rack of equipment you cannot name,
apart from one item, which is your old stick welder. He reported that stolen
four years ago and was very decent about it.

You look at the welds first, because you always do, and you would know them
anywhere. You gave him a summer of lessons and he gave it back. He has ground
every joint flat and painted it, and you know from experience what a man is
hiding when he goes to that trouble on a frame nobody will see. Whatever this
one does, it does on the strength of those.

Under a wrench on the bench is half a sheet of paper.

*Gone through. Back for supper. If I am not, DO NOT FOLLOW. W.*

He has underlined NOT twice. Beside the W is a thumbprint in something brown,
and you have left enough of your own on enough steel to know blood when it has
dried.

Beside the note is a foam-lined case cut for two of something. One place is
empty. In the other is a brass object about the size of a hearing aid, with a
hook to sit behind the ear, and a strip of masking tape on the lid reads EAR.
MOSTLY WORKS. The truck has a label like that on the dash.

Through the frame you can see the back wall of the shed, the pegboard and the
co-op calendar, all where they belong. The air inside it is a little darker
than the air outside it, though, as it is in any doorway, and a draught is
coming through that smells of woodsmoke and low tide. The nearest tide is
three days' drive from here.

The cat has taken the far wall, and from the state of the blanket it has had
the far wall for some time.

There is more tape on the frame itself, at eye height. ONE HAND'S WORTH. ASK
ME HOW I KNOW.

So you are going, it seems, and the question is what the hand is for. Your
tool bag is in the truck, since he asked for the helmet and you do not travel
with half of it. His notebook is on the bench beside the note, a black one
gone fat with use, with a rubber band round it. And over the kettle is a shelf
he has labelled TRADE, which holds a bag of sugar, a tin of pepper and three
cards of steel needles from the fabric shop in town. You had taken that for
groceries and a hobby.

> - Fetch the tool bag from the truck.
> - Take the notebook.
> - Empty the TRADE shelf into a feed sack.

*(Three ways to be a stranger: with a trade, with what he knew, or with
something to give. Each is written below.)*

You hook the brass thing behind your ear and find it warm, as if it had lately
been behind somebody else's. The note goes into your jacket, since a person
should have something to show the police. Your phone and your lighter are in
your pockets already, where they live.

You step through the frame as you would over an air hose, without looking
down, with your one hand's worth.

## 2. The hill

You are up to the shins in heather and the rain is coming in from the side.

The frame has not come with you, nor the shed. Behind you is a boulder about
the size of a grain truck, with a streak of white quartz down the face of it,
and you take a good look at that streak, since it is all the address you have.

Then you turn around, and it is some time before you do anything else.

The hill falls away below your boots in grey rock and rusty bracken, down to
water that lies a long way under you, black-green and so still that it holds
the mountains upside down. It runs inland between walls of rock that go up
into the cloud and do not come out again. Across from you a waterfall hangs on
the far wall, a white thread of it, too far off to hear.

There is no wire anywhere in the sky and no road cut into the other shore, and
it is quieter than you knew a place could be.

On a shelf of green by the water stands a building, longer than your uncle's
shed and much lower, bowed along its length like the hull of a boat turned
over. Grass is growing on the roof. Smoke leaks out along the ridge, having
found no chimney, and lies down flat in the rain. Smaller roofs stand about
it, and strips of field gone pale with stubble, and on the shingle below are
two boats drawn up side by side. Even from this height you know the line of
them, the long rise to the stem that somebody drew in one stroke.

The only other one you have seen was in a museum, black and cracked, propped
on steel behind glass. These two are the colour of dark honey and they are
wet. Whoever built them is very likely down there under the grass roof,
keeping dry, and could build you a third if you had anything to pay him with.

You try your phone, which has no service and sixty-one per cent, and put it
away.

By now you are cold enough to notice. You get into the lee of the boulder and
collect sticks, with some confidence, since setting things alight is the
better part of your trade. Wet heather held over the lighter gives off steam.
The bark of a small bent birch does no more. You take out the note and
consider it, and decide your uncle would want it kept. By the time the lighter
is too hot to hold you have produced a smell.

"Hvat ertu?"

A boy is standing a few yards up the hill with a dog and a stick. He might be
eleven. His wool is the colour of the hillside, which accounts for how near he
has got, and the dog beside him has plainly reached a decision about you and
is waiting for him to catch up.

The brass thing clicks twice behind your ear, like a relay closing.

"What are you?" he says again. This time it reaches you in English, half a
beat after his mouth has finished. He has asked what, you notice, and not who.

"Cold," you tell him, and your throat does something to the word on its way
out that you had no part in. He frowns as people do at a heavy accent. Then he
looks at your sticks, and at the lighter, which you are slow to cover.

He crouches down. Out of the pouch on his belt come a curl of steel, a flake
of stone and a pinch of black felted stuff, and with his back to the wind and
a knee on your sticks he has a flame going before you have the lighter back in
your pocket. He feeds it with bark he has been carrying inside his shirt,
where it keeps dry. His hands manage all this alone, because the rest of him
is studying your jacket.

"Can I?" he says, and has hold of the zip before you answer. He runs it down
and up and watches the teeth shut behind the tab, and does it again, eleven
times in all. You keep count, there being nothing else for you to do at your
own fire.

"Unkel had one of these," he says. "On his trousers."

"You know my uncle?"

"Everyone knows Unkel. He owes Thorgrim a ship."

After that he gets round to what you are carrying.

### If you brought the tool bag

He has it open before you can decide whether to stop him. The helmet he puts
on, and takes off again directly, having found that it makes the world dark.
The gloves he approves of. Then he comes to the file. He tries its edge with
his thumb and draws it once along the back of his fire-steel, where it lifts a
bright curl and leaves a flat, and he looks at the flat for some time.

"You are a smith," he says.

"More or less."

"Hrapp is our smith." He puts the file back with more care than he took it
out. "Hrapp is going to hate you."

He appears to be looking forward to it. He says he is called Kol, and he
carries the bag down the hill himself, shouting before the yard is in earshot
that there was a smith on the mountain and that it was he who found it.

### If you brought the notebook

It is open on your knee, where you had been hunting for a page about fire. The
page you have instead is headed PEOPLE, and the third line of it reads: *KOL.
Boy, about 11. Dog. Finds everything first, tells everyone.*

"You're Kol," you say.

The boy stops with his hand on the dog's neck. "Who gave you my name?"

You have no answer he would like, so you hold up the book. He looks at the
marks on the page as he might at the tracks of an animal he had only been told
about, and he does not come any nearer to them. Further down it says
*THORGRIM. Runs the place. Fair.* and *AUD. His sister. Do not bother lying to
her.* At the foot, in a box drawn twice round: *DON'T SHOW THEM THE LIGHTER.*

Kol goes down the hill well ahead of you and does not wait at the turns. When
you reach the yard on your own, a good while after him, a number of people
have found work to do near the door, and it is clear that the news has arrived
and that it was about the names.

### If you brought the feed sack

He looks into it and is not much struck. You tear a corner off the sugar and
shake some into his palm, and he takes it for salt and licks it up out of
manners.

He stands quite still. Then he cleans the palm thoroughly, looks into the sack
to see how much more of it there is, and ties the neck himself, with a knot
you would not care to have to undo.

"Do not give that to anybody on the way down," he says. "They will only want
it."

He lets you know that he is called Kol and that you may walk behind him. In
the yard he informs a woman carrying buckets, and after her the hens, that the
stranger is his, that he found him, and that nobody is to touch the sack.

## 3. Unkel's water

Your boots are rated for a dropped girder. Nobody rated them for wet moss, and
you make most of the descent sitting.

The door of the long building is cut for people who know where the lintel is.
You find out where it is.

Inside it is dark and far bigger than it looked from the hill. A fire burns in
a trench down the middle of the floor, a truck-length of it, and its light
climbs the posts and gives up before it reaches the roof. The posts are whole
trees. Somebody has carved every one of them, from the floor to as high as you
can see, with beasts that bite each other and are knotted so tight you could
not get a nail in between. The place smells of smoke and wet dog, of meat and
of a good many people, some thirty of whom have turned to look at you. The
talk stops one bench at a time, working up from the door to the far end, until
the fire is the loudest thing in the room.

Near the hearth sits a man with his sleeve pushed up and a cut across the heel
of his hand. An old woman has him by the wrist, and a girl is lifting a pot
off the fire between two sticks.

"Eighteen," the girl is saying. "Nineteen. Twenty. That is four."

"That is three," says the man with the hand.

"It is four, Bjorn. I have my thumb on it."

"Then your thumb moved."

They count it again to settle the matter. Only when the girl has reached
twenty does the old woman pour, and the man lets his breath out through his
teeth, and she ties up the hand in a cloth out of the same pot.

"Unkel's water," Kol says, in the tone of a boy with a slow pupil. "You boil
it for a hundred. Nobody is going to count a hundred for a pot, so we count
twenty, five times." He lifts his chin at the man. "Bjorn put an axe in his
own leg last winter and it should have come off. Unkel washed it in his water
every day and shouted at anybody who touched it, and Bjorn still has the leg.
So now we do it for everything. Cuts. Lambs. Ulf washed his sword in it before
he fought the man from Sogn."

"Did it help?"

"No. But nobody blames the water."

At the head of the fire, in the only seat with a back, a man of about fifty
has watched your arrival without moving anything but his eyes. He is built
along the same lines as the posts. He lifts one finger, and you go up the
hall.

*(His first words depend on what was carried.)*

- **The tool bag.** "Kol tells me he has found a smith," Thorgrim says. "The
  last man off that hill told me he was a smith as well."
- **The notebook.** "Kol tells me you had his name before he gave it,"
  Thorgrim says. "Have you mine?" You have, and you say it, and the people on
  the bench nearest you discover that there is room further along.
- **The feed sack.** You put the pepper and a card of needles on the board in
  front of him. He opens the tin and sneezes, and is pleased with it. "Unkel
  came with his hands empty and went away with them full," Thorgrim says. "You
  have it the other way about."

"You are his kin, though. You have his clothes, and you came through my door
head first, as he did." There is some laughing at this. "He ate at my fire
from hay-time until the leaves turned, and he ate well. He kept Bjorn's leg
on, and reminded us of it most evenings. I liked him. He said he could build
me a ship that would sail into the wind. I asked how, and he drew it in the
ashes, and it was a handsome drawing. I gave him half a pound of silver to buy
iron. Six nights ago he went up that hill with it and has not come down."

"What do you want with a ship that sails into the wind?"

"There is a king working his way along this coast," Thorgrim says, "and he
has the wind behind him. Tonight you are my guest. Tomorrow you are Unkel's
kin, and you have what Unkel owes. So tell me now, while I am still feeding
you. Can you build it?"

While he was speaking a woman has come down the hall and stopped at your
shoulder, and you did not hear her do it. She is about your age, in a dress of
the dark red that a gate goes when it has rusted properly, with the sleeves
shoved back from work she has not finished. A ring of keys hangs at her belt,
a dozen or more. People along the benches drew in their feet as she came. She
seems to want the answer as well.

> - Tell him you work iron and have never built a ship. Offer to work the debt off.
> - Tell him it can be built. You have seen boats that do it.
> - Tell him you will bring back his silver, and your uncle with it.

*(This is the game's standing decision, small: the era's own way, what you
know, or the uncle's trail. Any hero can give any answer. Each is written
below, and each is a different first meeting with her.)*

## 4. The keys

### If you offer to work it off

"I work iron," you say. "I have never built a ship. I will work off what he
owes."

"Hm," says Thorgrim, past your shoulder. "Is that true?"

She leaves the question where it is, takes your right hand and turns it palm
up, as she might a fish somebody was asking too much for.

She studies the callus. Then she pushes up your sleeve, a thing nobody has
done to you since you were six, and goes over the forearm: the shiny patches,
the small white pits where spatter came through a glove, and the long scar
from the day you leaned on a piece you had just cut. She puts her thumb along
that one. Her hands are colder than yours and a good deal harder.

"These are a smith's," she says.

"Yes."

"Unkel talked like a smith and had hands like a new cheese." She drops yours.
"So they sent the mouth first and the hands afterwards. I would have sent them
the other way about." Then, to her brother: "It is true. He has burned himself
more often than Hrapp has, and Hrapp is bad at it."

"I heard that," says a voice from the back.

"You were meant to."

Kol informs you, at no great pains to be quiet, that this is Aud, Thorgrim's
sister. Her husband went west with a ship three summers ago and the ship came
back without him. The keys have been hers since, along with whatever they
open.

A girl brings you a basin of water and a cloth and holds them out. You look at
the basin and then at the girl. It has been a long day, and you cannot
honestly say whether the water is for drinking. You settle it by wiping your
hands down your jeans, to show you mean well.

Aud watches the whole of this and her face stays exactly where it was. You
suspect that took some doing.

"Hands in the water," she says. "After that the cloth, and after that you eat.
Unkel had it by his second month."

You wash. She puts you on the bench nearest the door, among the dogs, where a
man sits until the hall has made up its mind about him. A bowl arrives with
something grey and hot in it, and barley in that. No spoon arrives. Along both
benches people are taking spoons out of belts and sleeves, having brought
their own, as people evidently do. You have brought no spoon.

She has noticed that as well. She unhooks a spoon of pale horn from her belt,
worn thin along one edge, and holds it out to you, and keeps hold of her end
when you take yours.

"I have had this longer than I had my husband," she says. "I want it back."

"You'll get it back."

She lets go. Then she speaks low enough for it to stay under the noise of the
hall. "He was bleeding when he went up the hill. It was his hand. He had it
wrapped in his shirt and would not say who had done it. Did he come home to
you bleeding?"

The note is in your jacket, with his thumb on it.

### If you say it can be built

"It can be built," you say. "I have seen boats that do it."

Thorgrim brings his hand down on the arm of his seat and has you moved four
places up the bench, into the warm. This costs a man with burned forearms his
seat, and he takes it quietly and badly. A horn of something is put into your
hand. Thorgrim wants to know how soon, and how much iron, and whether the
king's ships can do the same, and you answer him as well as a person can who
has watched sailing on television.

The woman lets him finish.

"Where?" she says.

"Where what?"

"Where have you seen them? I have stood on that shore every summer of my life
and seen every keel that came up this water, and my husband saw the ones in
the west and told me about them at length. Neither of us saw a ship do that."
She waits until she is satisfied that you have nothing ready. "It will keep.
Eat."

That is Aud, the man beside you says, who is Thorgrim's sister and holds the
keys. He adds, meaning it kindly, that he has never known her to forget to
come back to a thing.

### If you say you will bring him back

"I can't build it," you say. "I will bring back your silver, though, and him
with it."

"His family are great promisers," Thorgrim tells the hall, and the hall
enjoys it. "Where will you look? He went up and he did not come down. Kol has
been over that hill like a dog after a hare."

"He was bleeding," the woman says.

She has not raised her voice, and the benches go quiet for her faster than
they did for you. "It was his hand. He had it wrapped in his shirt. He went
by me in the yard at a walk that would rather have been a run, and when I
asked who had done it he said he had caught it on a nail. We do not leave
nails about."

Thorgrim asks the hall, pleasantly, whose knife it was, and gets no answer.
Toward the back a man with burned forearms has taken an interest in his bowl.

"You may have the boy, and you may have until the first snow," Thorgrim says.
"After that I will have my ship or the worth of it, and I will have it from
you."

Kol tells you, on the way to the bench by the door, that the woman was Aud,
Thorgrim's sister, who holds the keys, and that in six nights she had not said
one word of that to anybody.

---

## Where each road leaves the hero

Nothing here is a system yet; it is what the prose above already did.

| | The hall thinks you are | You have | You do not have |
|---|---|---|---|
| Tool bag | A smith, and Hrapp's problem | A trade on the first night | Anything to give, or any idea who these people are |
| Notebook | Something that knows names | The uncle's own account of the place | The hall's ease. They moved along the bench |
| Feed sack | Kol's find, and a guest who gives | Thorgrim's good humour and a boy who guards you | A use, once the sack is empty |

| | Where you sit | Aud | The uncle's trail |
|---|---|---|---|
| Work it off | By the door, with the dogs | Has read your hands, lent you her spoon, and told you privately | You know he bled. Nobody else knows you know |
| It can be built | Four places up, in the warm | Has a question and will come back to it | Nothing. She did not tell you |
| Bring him back | By the door | Said it to the whole hall, on your account | A man with burned forearms, a boy, and until the first snow |
