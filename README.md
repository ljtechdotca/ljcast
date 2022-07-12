# ljcast

What is ljcast?

It is a Node.js application I've programmed (over several iterations) to help automate certain tasks for my [Twitch stream](https://www.twitch.tv/ljtechdotca).

Here is a list of features:

- Auto refreshing access tokens.
- Colorful console logs.
- Fetch currently playing tracks from Spotify.
- Followers, redemptions, and bits listeners through Twitch PubSub.
- Fully customizable Twitch chat commands.
- Going LIVE Discord notifications.
- Subs, resubs, and sub gifts listeners through Twitch IRC.

## Basic Setup

### 1. Create a Twitch Application

### 2. Obtain an Access Token from Twitch

```md
https://id.twitch.tv/oauth2/authorize?client_id=<CLIENT_ID>
    &redirect_uri=<REDIRECT_URI>
    &response_type=code
    &scope=chat:read+chat:edit
```

```md
https://id.twitch.tv/oauth2/authorize?client_id=<CLIENT_ID>
    &redirect_uri=<REDIRECT_URI>
    &response_type=code
    &scope=bits:read+channel:moderate+channel:read:redemptions+channel:read:subscriptions+chat:edit+chat:read+user:read:follows
```

### 3. LOOKS LIKE THIS IS STILL A WIP, PLEASE CHECK BACK LATER!