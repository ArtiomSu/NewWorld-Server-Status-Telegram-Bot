# NewWorld-Server-Status-Telegram-Bot
Telegram Bot that keeps track of servers. Updates channel when status changes and provides UI to look at the status of all severs.

The bot is split into two processes so that you can only run the tracker or only run the interactive bot or both.

# Setup
1. create a `.env` file in project directory
```
BOT_TOKEN={your telegram bot token from bot father}
NOTIFICATION_CHANNEL={the id of the channel or group you want to post updates to}
BOT_NAME={the name of your bot with @ attached eg. @newworldbot}
```
2. `npm install`
3. `npm start`

# Setup Tracker
1. Edit `keepTrack.js` you will see the `keep_track_of_Asgard` object.
2. By default this will check the status of Asgard server every minute. 
3. If you want to track more than one server copy from line 8 to 20 and paste at the bottom of file and edit appropriately.
4. `npm install`
5. `npm run track`
