Build a complete modern single-page web application called "PAAP DHOLO" — an anonymous Indian confession/social website.

I have provided TWO UI reference images.

IMPORTANT:
Use BOTH reference images as visual inspiration and create a UI that is a blend of the two.

Do NOT make it look AI-generated.
Do NOT make it look like a generic SaaS dashboard.
Do NOT make it look like a typical Reddit clone.
The final website should feel like a real, professionally designed, highly creative 2026 web experience.

==================================================
PROJECT CONCEPT
==================================================

The website is called:

PAAP DHOLO

Main tagline:

"AA GAYE
PAAP KARKE"

Secondary Hindi copy:

"जो किया, यहाँ लिख दो।
नाम नहीं पूछेंगे।"

Concept:

Paap Dholo is a completely anonymous internet confession box.

A person can visit the website without signing up or logging in and anonymously write something they did — a funny mistake, embarrassing moment, stupid decision, small lie, guilty pleasure, etc.

Other anonymous visitors can:
- Read confessions
- React/judge them
- Reply to confessions
- See replies from other anonymous users
- Submit their own confession

The overall experience should feel FUNNY, PLAYFUL, CHAOTIC, MEME-LIKE and CULTURALLY INDIAN — but still visually sophisticated and modern.

The website should make people want to scroll through random confessions.

The core loop is:

VISIT
→ READ A PAAP
→ LAUGH
→ JUDGE / REACT
→ READ REPLIES
→ CONFESS YOUR OWN PAAP
→ COME BACK

==================================================
TECH STACK
==================================================

Use:

- React
- JavaScript
- Tailwind CSS
- Firebase

Do NOT use TypeScript.

Do NOT introduce unnecessary frameworks or libraries unless genuinely useful.

The project should have clean component architecture and reusable components.

==================================================
IMPORTANT DEVELOPMENT STRATEGY
==================================================

For the FIRST VERSION, do NOT require Firebase to make the website work.

I want the application to be immediately testable without Firebase configuration.

Create a local/mock data layer first.

Use:
- localStorage
- predefined mock confession data
- predefined mock replies
- predefined reactions
- predefined anonymous avatars

The website should behave like a functional application using localStorage.

Later I will connect Firebase.

Therefore structure the data layer so that Firebase can replace the localStorage/mock implementation without rewriting the UI components.

Create a service abstraction such as:

services/confessionService.js

The UI should communicate with this service instead of directly manipulating localStorage.

For example:

getConfessions()
createConfession()
getReplies()
createReply()
addReaction()

Initially these functions should use localStorage/mock data.

Later they can be replaced with Firebase Firestore functions.

==================================================
ANONYMOUS USER SYSTEM
==================================================

There should be NO login and NO signup.

Every visitor automatically gets an anonymous identity.

Use localStorage to persist:

- anonymous user ID
- avatar ID
- anonymous display name

Example identities:

"Guilty Duck"
"Suspicious Rock"
"Confused Aloo"
"Sleepy Samosa"
"Shady Baba"
"Chaotic Monkey"

Do NOT ask for the user's name, email, phone number or account.

The anonymous identity should feel playful rather than technical.

The same anonymous identity should remain after page refresh using localStorage.

==================================================
AVATAR SYSTEM
==================================================

Use custom cartoon avatars.

The visual style should match the reference images:

- hand-drawn
- humorous
- expressive
- thick imperfect outlines
- slightly vintage/comic texture
- Indian/meme-inspired
- colorful
- personality-driven

Some example characters:

- Duck wearing sunglasses
- Rock with an unimpressed face
- Baba
- Confused Aloo/Potato
- Cat
- Monkey
- Samosa
- Bucket
- Onion
- Goat

For now, create the avatar system so avatar images can be stored in:

/public/avatars/

Use avatar IDs in the data rather than embedding images into the confession objects.

Example:

{
  avatarId: "duck",
  displayName: "Guilty Duck"
}

Do not create an unnecessarily complicated avatar management system yet.

==================================================
VISUAL DIRECTION
==================================================

The UI should combine the strongest qualities of BOTH supplied reference images.

REFERENCE IMAGE 1:
Use its:
- bold experimental typography
- yellow brush strokes
- black sections
- playful illustrations
- sticker-like elements
- handwritten/comic feeling
- visual chaos
- strong personality
- large Hindi typography
- funny microcopy

REFERENCE IMAGE 2:
Use its:
- cleaner website structure
- navigation
- confession feed
- card-based content
- sidebar information
- Karma Court
- Paap Dhulai
- more usable layout
- better content hierarchy
- actual web-app feel

The result should be a blend:

CREATIVE LANDING PAGE
+
FUNCTIONAL SOCIAL FEED
+
INDIAN MEME CULTURE
+
HAND-DRAWN EDITORIAL DESIGN

==================================================
COLOR PALETTE
==================================================

Primary colors:

Warm paper / cream:
#F5EEDF

Black:
#111111

Paap yellow:
#F5C400

Pink/red:
#F43F5E

Orange accent:
#F97316

White:
#FFFDF7

Use yellow and pink as strong accent colors.

Avoid excessive gradients.

Avoid modern SaaS blue/purple gradients.

Avoid glassmorphism.

Avoid excessive rounded cards.

The website should feel tactile and physical — almost like paper, stickers, posters, receipts and hand-drawn print material translated into a modern website.

==================================================
TYPOGRAPHY
==================================================

Typography is extremely important.

The hero should use HUGE bold typography.

Main hero:

AA GAYE

PAAP KARKE

The Hindi text should be visually dominant.

Use a strong bold display font for the Hindi headline.

Use a playful handwritten/comic font selectively for supporting copy.

Do NOT use too many fonts.

Keep typography intentional and editorial.

The typography should feel designed rather than generated.

==================================================
HEADER
==================================================

Create a modern responsive navbar.

Left:

Paap Dholo logo/brand.

Use the bucket + trident visual identity.

Navigation:

PAAP REGISTER
KARMA COURT
PAAP DHULAI
ABOUT

Right:

CONFESS button

The CONFESS button should be visually prominent.

On mobile, convert navigation into a clean mobile menu.

==================================================
HERO SECTION
==================================================

This is the most visually important section.

Create a highly expressive hero.

Large headline:

AA GAYE
PAAP KARKE

Supporting copy:

"जो किया, यहाँ लिख दो।
नाम नहीं पूछेंगे।"

Use yellow paint/brush texture behind portions of the typography.

Add hand-drawn decorative elements around the hero.

Use the supplied character illustrations / avatar style where appropriate.

The hero should feel like a contemporary Indian poster transformed into an interactive website.

On the right side, place the CONFESSION SLIP.

The confession slip should look like a physical paper document.

It should contain:

PAAP DHOLO
CONFESSION DEPARTMENT

YOUR PAAP

Textarea / input

HOW BAD WAS IT?

Use 5 humorous severity options:

😇
🙂
😐
😬
💀

Main CTA:

DHULA DO 🧼

Below:

"YOUR PAAP WILL BE PUBLIC.
YOUR NAME WILL NOT."

The form must actually work.

Submitting a confession should add it to localStorage and immediately appear in the feed.

==================================================
CONFESSION FORM UX
==================================================

Make the form fun.

Placeholder examples:

"Main mummy se bola library jaa raha hu...
aur mai Netflix dekh raha tha."

Other rotating examples:

"Main 5 minute ke liye phone chalane gaya tha..."

"Maine dost ka fries bina pooche kha liya..."

"Main meeting mein camera off karke so raha tha..."

"Main 'on the way' bolke abhi ghar pe hu..."

The form should have a character limit.

Show a subtle character counter.

Disable submission when empty.

After submitting, show a funny success state:

"PAAP REGISTERED."

Then something like:

"Bhagwan ko bata diya hai.
Ab jao, comments padho."

Use a small animation.

==================================================
PAAP REGISTER / FEED
==================================================

This is the main social content area.

Heading:

LATEST PAAP

Show a feed of confession cards.

Each card should contain:

- Anonymous avatar
- Anonymous display name
- Time
- Paap ID
- Severity
- Confession text
- Reaction counts
- Reply count
- Reply button

Example:

🦆 Guilty Duck
PAAP #48291
2h ago

"Main office bunk karke
poora din soya."

Severity:
🟡 Minor Paap

Reactions:

🙏 245
😂 612
💬 47

Cards should not all look identical.

Use subtle variations:
- cream cards
- yellow cards
- paper cards
- slightly rotated cards
- sticker-style cards

BUT maintain consistency and readability.

Do not make the feed chaotic to the point of poor usability.

==================================================
REACTIONS / JUDGEMENT
==================================================

Instead of generic "Like", make reactions funny.

Possible reactions:

🙏 Maaf Kiya
😂 Paap Bhari Comedy
😡 Sharam Kar
👀 Interesting
💀 Bhai Kya Kar Raha Hai

Users should be able to react without login.

Use localStorage to prevent unlimited repeated reactions from the same browser.

Reaction counts can initially be mock/local data.

==================================================
REPLIES
==================================================

Every confession should have a reply interaction.

Clicking:

💬 47

opens an expandable reply section or modal/drawer.

Show anonymous replies.

Example:

Guilty Duck:
"Main office bunk karke poora din soya."

Reply:

Anonymous Panda:
"Sleep is not a crime.
It's a talent."

Another:

Anonymous Aloo:
"At least you're honest."

Users can add their own anonymous reply.

No login.

Save replies locally for now.

Make the reply UI feel like a conversation rather than a traditional comment form.

==================================================
KARMA COURT
==================================================

Create a visually distinct section/sidebar.

Title:

KARMA COURT

Subtitle:

"Top judged paap of the week."

Display 3 popular confessions.

Use a courtroom/judgement aesthetic.

Ranking:

🥇
🥈
🥉

Show:
- avatar
- anonymous name
- confession
- judgement count

Use the playful illustrated style from the references.

==================================================
PAAP DHULAI
==================================================

Create a section called:

PAAP DHULAI

Subtitle:

"Most forgiven paap this week."

Create a leaderboard.

Example:

1. Sleepy Samosa 🙏 2.3K
2. Chill Penguin 🙏 1.9K
3. Confused Aloo 🙏 1.2K

This can initially use mock/local data.

==================================================
STATS
==================================================

Include a visually strong statistics strip.

Examples:

124,531
PAAP CONFESSED

89,712
JUDGEMENTS PASSED

12,008
MAAF KIYA GAYA

Use black/yellow visual treatment similar to the reference.

For initial version, use mock values.

==================================================
MICROCOPY
==================================================

The website should constantly have small humorous details.

Examples:

"No name.
No shame.
Only paap."

"Confess.
Get judged.
Feel better."

"Internet ka confession box."

"Karo paap,
paao shaanti.
(YA JUDGEMENT)"

"Bhagwan is typing..."

"Consulting karma database..."

"Paap successfully registered."

"Your identity is safe.
Your dignity is not."

Use these sparingly.

Do not overcrowd every section with jokes.

==================================================
ANIMATIONS
==================================================

Use subtle modern interactions.

Do NOT make everything bounce.

Recommended:

- Hero text reveal
- Brush-stroke reveal
- Confession card hover
- Slight card rotation on hover
- Reaction button animation
- Confession submission animation
- Smooth scrolling
- Modal transitions
- Small avatar hover interaction
- Sticky/floating CONFESS button

Animations should feel polished and intentional.

No excessive parallax.

No giant 3D effects.

No generic AI landing-page animations.

==================================================
RESPONSIVE DESIGN
==================================================

Desktop:

Use the editorial multi-column layout from the references.

Hero:
left = huge typography
right = confession slip

Feed:
main feed + Karma Court / sidebar

Mobile:

Completely redesign the layout rather than simply shrinking desktop.

Order:

1. Navbar
2. Hero headline
3. Short description
4. Confess CTA
5. Confession form
6. Latest Paap feed
7. Karma Court
8. Paap Dhulai
9. Stats
10. Footer

Cards should become full-width.

Sidebar content should move below the feed.

Typography must remain readable.

The website must feel excellent at:
- 320px
- 375px
- 768px
- 1024px
- 1440px+

==================================================
DATA ARCHITECTURE
==================================================

Create mock data with at least 10–15 confessions.

Each confession should have:

{
  id,
  text,
  avatarId,
  displayName,
  severity,
  createdAt,
  reactions: {
    forgive,
    funny,
    shame,
    interesting,
    dead
  },
  replies: []
}

Include realistic funny Indian/Hinglish confessions.

Examples:

"I told mummy I was going to the library.
Main Netflix dekh raha tha."

"Main 5 minute ke liye phone chalane gaya tha.
3 ghante baad wapas aaya."

"Maine dost ke fries kha liye aur bola mujhe pata nahi."

"Gym membership sirf t-shirt ke liye li."

"Main online tha but message ka reply nahi kiya."

Keep them harmless, funny and relatable.

==================================================
LOCALSTORAGE
==================================================

Create a clear localStorage structure.

For example:

paap_user
paap_confessions
paap_replies
paap_reactions

Seed mock data into localStorage on first load.

IMPORTANT:

Do not duplicate mock data every time the application reloads.

Check whether the data already exists before seeding.

If localStorage is cleared, the mock data should be seeded again.

==================================================
FIREBASE PREPARATION
==================================================

Prepare the project so Firebase can be added easily later.

Create:

firebase.js

and service functions that can eventually use:

Firestore
Firebase Storage if needed

But do NOT make Firebase configuration mandatory for the initial version.

Keep Firebase integration clearly separated from UI.

Do not hardcode Firebase secrets.

Use environment variables when Firebase is connected later.

==================================================
CODE QUALITY
==================================================

Create reusable components.

Suggested structure:

src/
  components/
    Navbar.jsx
    Hero.jsx
    ConfessionForm.jsx
    ConfessionCard.jsx
    ReactionBar.jsx
    ReplySection.jsx
    KarmaCourt.jsx
    PaapDhulai.jsx
    Stats.jsx
    Footer.jsx
    Avatar.jsx

  data/
    avatars.js
    mockConfessions.js

  services/
    confessionService.js
    firebaseService.js

  utils/
    anonymousUser.js

  pages/
    Home.jsx

Keep components clean and reasonably small.

Do not create one enormous App.jsx.

==================================================
DESIGN QUALITY RULES
==================================================

The final result MUST NOT look like:

- generic Tailwind template
- generic Reddit
- generic confession app
- generic SaaS dashboard
- excessive glassmorphism
- excessive gradients
- AI-generated landing page
- random decorative blobs
- overuse of rounded rectangles
- excessive shadows

Instead it should feel:

- handmade
- editorial
- Indian
- funny
- rebellious
- tactile
- modern
- highly intentional

The supplied reference images are the visual north star.

The website should look like something an experienced designer/developer deliberately created, not something assembled from UI components.

==================================================
FINAL PRODUCT FEEL
==================================================

When someone opens the website, the immediate reaction should be:

"WHAT IS THIS 😂"

Then:

"I want to confess something."

Then:

"Wait... what are other people confessing?"

Then they should start scrolling and judging confessions.

That emotional progression is more important than simply making the website visually attractive.

Build the first version as a polished, functional MVP with mock/localStorage data.

Do NOT wait for Firebase.

Make the website fully usable immediately after npm install + npm run dev.