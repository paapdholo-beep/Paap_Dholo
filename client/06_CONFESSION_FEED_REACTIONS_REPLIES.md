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
