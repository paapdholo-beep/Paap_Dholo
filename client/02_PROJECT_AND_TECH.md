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
