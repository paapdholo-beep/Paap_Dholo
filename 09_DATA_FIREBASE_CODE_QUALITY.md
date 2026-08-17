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
