const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const Constants = require("./Constants");
const {get_data} = require("./getData");

const bot = new TelegramBot(Constants.TOKEN, {polling: false});

let keep_track_of_Asgard = {
    name: "asgard",
    chat: process.env.NOTIFICATION_CHANNEL,
    check_every: 1000 * 60,
    status: false,
    notify: false
}

//keep track of Asgard
get_data(keep_track_of_Asgard.name, keep_track_of_Asgard.chat, bot, true, keep_track_of_Asgard);
setInterval( () => {
    get_data(keep_track_of_Asgard.name, keep_track_of_Asgard.chat, bot, true, keep_track_of_Asgard);
}, keep_track_of_Asgard.check_every);
