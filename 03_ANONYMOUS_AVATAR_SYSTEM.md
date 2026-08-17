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
