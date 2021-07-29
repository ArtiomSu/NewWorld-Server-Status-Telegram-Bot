const cloudscraper = require('cloudscraper');
const cheerio = require('cheerio');
const Constants = require('./Constants');

get_data = (options, current_chat, bot, keep_track, keep_track_object) => {
    cloudscraper({ method: 'GET', url: 'https://www.newworld.com/en-us/support/server-status'})
        .then( (htmlString) => {
            let servers = {};
            const cheerio$ = cheerio.load(htmlString);
            let counter = 0;
            cheerio$('.ags-ServerStatus-content-responses-response--centered').each( (i, region) => { //loop through each region
                let severStatuses = [];
                cheerio$(region).children().each( (i, server_info) =>{
                    let server = cheerio$(server_info).children();
                    let cssClass = cheerio$(server).attr('class');
                    if(cssClass === 'ags-ServerStatus-content-responses-response-hr-sprite'){
                        //skip
                    }else if(cssClass.includes('ags-ServerStatus-content-responses-response-server-status--down')){
                        severStatuses.push({name: server.text().trim(), status: false});
                    }else if(cssClass.includes('ags-ServerStatus-content-responses-response-server-status--up')){
                        severStatuses.push({name: server.text().trim(), status: true});
                    }
                });
                servers[Constants.SERVER_REGIONS[counter]] = severStatuses;
                counter++;
            });

            const last_updated = cheerio$('.ags-ServerStatus-content-lastUpdated').text().trim();

            let outString = "";
            if(options === 'a'){
                outString += "All Server Statuses";
                for(region in servers){
                    outString += "<pre>\n</pre>";
                    outString += "<strong>"+region+"</strong>";
                    outString += "<pre>\n</pre>";
                    let servers_found = "";
                    for(server in servers[region]){
                        servers_found += servers[region][server].name+" ";
                        servers_found += servers[region][server].status ? "✔": "❌";
                        servers_found += "\n";
                    }
                    outString += "<pre>" + servers_found + "</pre>";
                }
            }
            else if(options >= 0 && options < Constants.SERVER_REGIONS.length){
                outString += "<b>" + Constants.SERVER_REGIONS[options]+" Server Statuses</b>";
                outString += "<pre>\n</pre>";
                let servers_found = "";
                for(server in servers[Constants.SERVER_REGIONS[options]]){
                    servers_found += servers[Constants.SERVER_REGIONS[options]][server].name+" ";
                    servers_found += servers[Constants.SERVER_REGIONS[options]][server].status ? "✔": "❌";
                    servers_found += "\n";
                }
                outString += "<pre>" + servers_found + "</pre>";

            }
            else{
                let found = false;
                outString += "<b>Search Results for " + options + "</b>";
                outString += "<pre>\n</pre>";
                for(region in servers){
                    let servers_found = "";
                    for(server in servers[region]){
                        if(servers[region][server].name.toLowerCase().includes(options)){
                            found = true;
                            if(keep_track){
                                if(keep_track_object.status !== servers[region][server].status){
                                    keep_track_object.status = servers[region][server].status;
                                    outString = Constants.NOTIFY_USERS + "<pre>\n</pre>";
                                    outString += "<b>Status for "+keep_track_object.name+" Changed</b>";
                                    keep_track_object.notify = true;
                                    outString += "<pre>\n";
                                    outString += servers[region][server].name+" ";
                                    outString += servers[region][server].status ? "✔": "❌";
                                    outString += "</pre>";
                                }
                            }else{
                                servers_found += servers[region][server].name+" ";
                                servers_found += servers[region][server].status ? "✔": "❌";
                                servers_found += "\n";
                            }

                        }
                    }
                    outString += "<pre>" + servers_found + "</pre>"
                }
                if(!found){
                    outString = "Could not find " + options +" see bellow for options";
                    outString += "<pre>\n</pre>";
                    outString += Constants.HELP_MESSAGE;
                }
            }
            outString += "<pre>\n</pre>";
            outString += "<i>"+ last_updated + "</i>";
            if(keep_track){
                if(keep_track_object.notify){
                    keep_track_object.notify = false;
                    console.log("keep track CHANGED for", keep_track_object.name, keep_track_object.status, last_updated);
                    bot.sendMessage(current_chat,outString, {parse_mode: "HTML"});
                }else{
                    console.log("keep track unchanged for", keep_track_object.name, keep_track_object.status, last_updated);
                }
            }else{
                bot.sendMessage(current_chat,outString, {parse_mode: "HTML"});
            }
        })
        .catch( (err) => {
            console.log(err)
        });
}

module.exports = {
    get_data: get_data
};