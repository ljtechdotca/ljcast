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

## Setup

### 1. Clone the Repository

Clone the repository locally using the following command: `git clone https://github.com/ljtechdotca/ljcast`

Navigate into the projects root directory and create a new `.env` file. Copy over the included `.env.example` as you will need to use the same field names.

### 2. Register Discord

Visit Discord's [Developer Portal Applications](https://discord.com/developers/applications) page and create a New Application and continue onto the Bot tab.

Click Add Bot, when its ready, click Reset Token. This will generate a token for your Discord bot, which you will want to copy this token to your `.env` file under the field `DISCORD_BOT_TOKEN`.

Now you can go back and customize your Discord application through the General Information tab if you wish to change its avatar, name, or description. The same goes for the bot through the corresponding Bot tab.

Once your bot is ready click on the OAuth2 tab > URL Generator, click the following scopes and bot permissions as shown below:

![Discord OAuth2 URL Generator Scopes](https://i.imgur.com/L82ZC8c.png)

![Discord OAuth2 URL Generator Bot Permissions](https://i.imgur.com/QxQTyqJ.png)

As you select your scopes and bot permissions a URL will be generated at the bottom of the page. This URL is used to invite your bot into Discord guilds. Once you are ready, copy the URL to a new browser tab.

Once you have successfully added your bot to your desired Discord guilds, you can continue.

### 3. Register Twitch

You will need to create two Twitch applications for a bot and user. If you wish for your chat bot to have a different name from your user account you must create a separate Twitch account as these applications inherit their creators name.

On the Applications tab of the [Twitch Developers page](https://dev.twitch.tv/console/apps), click the Register Your Application button. Fill in the name (has to be unique), select a category (doesn't matter) and add the following URL into the OAuth Redirect URLs list: `http://localhost:3000`.

Once you have created the Twitch application, you will be returned to the Applications tab on the Twitch Developers page. Manage your newly created application and click the New Secret button. Now copy the Client ID and Client Secret into your `.env` as shown in the `.env.example` reference file.

Using your applications Client IDs, go to the following URLs in a new browser tab:

```md
https://id.twitch.tv/oauth2/authorize?
client_id=<TWITCH_BOT_CLIENT_ID>
&redirect_uri=http://localhost:3000
&response_type=code
&scope=chat:read+chat:edit
```

```md
https://id.twitch.tv/oauth2/authorize?
client_id=<TWITCH_USER_CLIENT_ID>
&redirect_uri=http://localhost:3000
&response_type=code
&scope=bits:read+channel:moderate+channel:read:redemptions+channel:read:subscriptions+chat:edit+chat:read+user:read:follows
```

Once you visit the above URLs you will be prompted with a Twitch OAuth2 screen asking for access to your account. This screen will also give you a list of what is being authorized. Once you click Authorize it will attempt to redirect using the passed `redirect_uri`. Once it loads you may be met with a "This site cannot be reached", if you look closely however you should see an authorization code in the query your address bar as shown in the image below:

![Twitch Authorization Code](https://i.imgur.com/iWhkh2V.png)

This authorization code is required for fetching your initial access and refresh tokens. Once you have this code for the bot and user applications you can prepare the HTTP POST requests in Postman or your preferred API client:

```js
headers: {
	"Content-Type": "x-www-form-urlencoded",
}
```

The below snippet is an example of the parameters used in the body of the POST.

```md
https://id.twitch.tv/oauth2/token?
client_id=<CLIENT_ID>
&client_secret=<CLIENT_SECRET>
&code=<AUTHORIZATION_CODE>
&grant_type=authorization_code
&redirect_uri=http://localhost:3000
```

If this request succeeds it will return an access and refresh token. This access token may last up to 4 hours and can be refreshed at any time.

Copy the successful response data into a new `.json` file located inside your `data/tokens` directory. The file name must match either `twitch-bot.json` or `twitch-user.json`. Your token files should look something like this:

```json
{
  "access_token": "0123456789abcdefghijABCDEFGHIJ",
  "refresh_token": "eyJfaWQmNzMtNGCJ9%6VFV5LNrZFUj8oU231/3Aj",
  "expires_in": 14431,
  "obtainment_timestamp": 1657885613112
}
```

### 4. Register Spotify

Create a new application on Spotify's [Developer Dashboard](https://developer.spotify.com/dashboard/applications). Once you create a new app you will be redirected to an overview screen. Click on the Edit Settings button and add `http://localhost:3000` to the Redirect URIs field and hit Save. Now click Show Client Secret and copy this applications Client ID and Client Secret into your projects `.env` file as `SPOTIFY_USER_CLIENT_ID` and `SPOTIFY_USER_CLIENT_SECRET` respectively.

With this Client ID you can initiate the authorization request by visiting the following URL.

```md
https://accounts.spotify.com/authorize?
client_id=<SPOTIFY_USER_CLIENT_ID>
&redirect_uri=http://localhost:3000
&response_type=code
&scope=user-read-currently-playing
```

If successful you will be given a prompt to authorize to the application. Clicking Agree will redirect you and return a fresh authorization code inside the responses query just like before.

![Spotify Authorization Code](https://i.imgur.com/GuJnaYq.png)

With the authorization code we are now ready to request an access and refresh token from Spotify. Using Postman prepare the following HTTP POST request.

```js
headers: {
    "Authorization": "Basic <SPOTIFY_USER_CLIENT_ID>:<SPOTIFY_USER_CLIENT_SECRET>"
	"Content-Type": "x-www-form-urlencoded",
}
```

Here is the body of the POST.

```md
https://accounts.spotify.com/api/token
code=<AUTHORIZATION_CODE>
&grant_type=authorization_code
&redirect_uri=http://localhost:3000
```

Copy the response `access_token` and `refresh_token` into `data/tokens/spotify-tokens.json` file like before.

### 5. Final Configuration

Now that you have completed authorizing your Twitch and Spotify applications, you can tweak the config object found on line 26 of `src/index.ts`.

That's it! You should be able to start ljcast using `npm run start` and have spin up and connect each client using the values we've just set inside the `.env` file.
