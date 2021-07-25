const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const get_data = require('./getData').get_data;
const Constants = require('./Constants');

const bot = new TelegramBot(Constants.TOKEN, {polling: true});

let deal_with_message = (msg) => {
    if (msg.text.includes(Constants.BOT_NAME)) {

        if (msg.text.length <= 90){
            let user_id = msg.from.id;
            //check if text message is properly formatted
            let user_name = msg.from.first_name;
            let current_chat = msg.chat.id;


            let input_array = msg.text.replace(Constants.BOT_NAME,'').split(/(\s+)/).filter( e => e.trim().length > 0);
            let temp = input_array.join(" "); //gets which command to run
            //console.log("main menu option= ",temp);

            switch (temp) {
                case 'all':
                    get_data('a', current_chat, bot, false);
                    break;
                case 'eu':
                    get_data(1, current_chat, bot, false);
                    break;
                case 'us east':
                    get_data(0, current_chat, bot, false);
                    break;    
                case 'sa east':
                    get_data(2, current_chat, bot, false);
                    break; 
                case 'ap southeast':
                    get_data(3, current_chat, bot, false);
                    break; 
                case 'us west':
                    get_data(4, current_chat, bot, false);
                    break;
                case 'help':
                    bot.sendMessage(current_chat, Constants.HELP_MESSAGE, {parse_mode: "HTML"});
                    break;                 
                default:
                    get_data(temp, current_chat, bot, false);
            }
        }else{
            bot.sendMessage(current_chat, "<b>"+user_name+" that query is too long what are you trying to do you smelly teapot?</b>", {parse_mode : "HTML"});
        }
    }else if(msg.text[0] === '/'){
        
    }
};


bot.on('message', (msg) => {
    //console.log(msg);
    // if(!Constants.APPROVED_CHANNELS.includes(parseInt(msg.chat.id) )){
    //     console.log("inside wrong channel leaving:", msg.chat.id, " ", msg.chat.title);
    //     return bot.leaveChat(msg.chat.id);
    // }
    if(msg.text){
        deal_with_message(msg);
    }
});

bot.on('polling_error', (error) => {
    if( error.code ){
        if(error.code !== 'EFATAL'){
            console.log("error code: ", error);
        }
    }else{
        console.log("error code: ", error);
    }
});


setTimeout( () => {
    process.exit();
},3600000);


