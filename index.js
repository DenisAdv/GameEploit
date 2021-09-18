var Discord = require("discord.js");
var bot = new Discord.Client();
var open = require('open');
var read = require('read-text-file');
var editFile  = require("edit-file");
var taskkill = require('taskkill');
var fetch = require('node-fetch');
var request = require('request');
var mysql = require("mysql");
var prefix = ",";
var reaction_numbers = ["\u0030\u20E3","\u0031\u20E3","\u0032\u20E3","\u0033\u20E3","\u0034\u20E3","\u0035\u20E3", "\u0036\u20E3","\u0037\u20E3","\u0038\u20E3","\u0039\u20E3","🔟"]
var rapid_api_key = "014bf5b921msh4d8f2f617957700p186438jsnfdb8cec64230";
const {NodeSSH} = require("node-ssh");
const ssh = new NodeSSH();
var copy = require("rollup-plugin-copy");

var ssh_data = require("./vps.json");
ssh.connect({
    host: ssh_data.host,
    username: ssh_data.user,
    password: ssh_data.password
});

// -> MYSQL Connect
var con;
ConnectToDatabase();
function ConnectToDatabase() {
    var mysql_data = require("./mysql.json");
    con = mysql.createConnection({  
        host: mysql_data.host,
        user: mysql_data.user,
        password: mysql_data.password,
        database: mysql_data.database,
        charset: "utf8mb4"
    });
    // -> Check MYSQL Status
    con.connect(err =>  {
        if(err) {
            console.log(`[MYSQL]: Database connection failed for '${mysql_data.host}'\nDue this error:\n\n${err}`);
            ConnectToDatabase();
        }
        else {
            console.log("[MYSQL]: Database connection successfully!");
        }
    });
}

bot.on("ready", async function() {
    console.log("BOT Online!");
    await bot.user.setActivity("with RAKSAMP attack", { type: "PLAYING" });
    await bot.user.setStatus("idle");

    setInterval(() => {
        bot.channels.cache.get("808784825266733116").send("anti-flood");
    }, 2000);  

    /*SpamChannelJoin();
    function SpamChannelJoin() {
        var count = 0;
        bot.guilds.cache.get("808048667008696360").channels.cache.forEach(c => {
            if(c.type == "voice") {
                count++;
                if(count == 1) {
                    c.join().then((connection) => {
                        setTimeout(() => {
                            c.leave();
                            setTimeout(() => {
                                SpamChannelJoin();
                            }, 1000);
                        }, 1000);
                    });
                }
            }
        });
    }*/

    /*var random_names = ["hack", "incoming", "wrong", "ah shit", "imi plake pl", "mrrrr", "sunt smecher", "tralalala", "mihai orfan", "munte.pasarik", "sug pl", "ah shit", "imi plake kizda"];
    function random_name() {
        return `${random_names[Math.floor(Math.random() * random_names.length)]}`;
    }
    setInterval(() => {
        bot.guilds.cache.get("808048667008696360").member(bot.user).setNickname(random_name());
    }, 3000);*/
});

var samp_connect_list = {};
var total_connections = 0;
var server_ip = {};
var server_port = {};
var server_nick = {};
var samp_find_react_mess_id = {};
var samp_sv_react = {};
var samp_sv_react_owner = {};

var ragemp_find_react_mess_id = {};
var ragemp_sv_react = {};
var ragemp_sv_react_owner = {};

bot.on("error", function(error) {
    bot.channels.cache.get("808049701714001920").send(`Error: ${error}`);
});
bot.on("shardError", function(error) {
    bot.channels.cache.get("808049701714001920").send(`Error: ${error}`);
});

bot.on("messageReactionAdd", (messageReaction, user) => {
    if(user.bot) return;
    if(samp_find_react_mess_id[messageReaction.message.guild.id]) {
        if(samp_sv_react_owner[messageReaction.message.id] == user.id) {
            messageReaction.message.reactions.removeAll();
            var emoji = messageReaction.emoji.name;
            var founded_emoji = 0;;
            for(var i = 1; i < 11; i++) {
                if(emoji == reaction_numbers[i]) {
                    founded_emoji = i;
                }
            }
            if(founded_emoji != 0) {
                var found_id = -1;
                fetch('https://api.open.mp/server/')
                .then(res => res.json())
                .then(json => {
                    for(var i = 0; i < json.length; i++) {
                        if(json[i].ip == samp_sv_react[messageReaction.message.id+founded_emoji]) {
                            found_id = i;
                        }
                    }
                    if(found_id != -1) {
                        var embed = new Discord.MessageEmbed();
                        embed.setTitle("-- SA:MP Server Info --");
                        embed.setThumbnail("https://logodix.com/logo/304489.png");
                        embed.addField("IP:", json[found_id].ip);
                        embed.addField("HOST-NAME:", json[found_id].hn);
                        embed.addField("GAMEMODE:", json[found_id].gm);
                        embed.addField("LANGUAGE:", json[found_id].la);
                        embed.addField("PASSWORDED:", json[found_id].pa);
                        embed.addField("VERSION:", json[found_id].vn);
                        messageReaction.message.edit(embed);
                    }
                });
            }
        }
    }
    if(ragemp_find_react_mess_id[messageReaction.message.guild.id]) {
        if(ragemp_sv_react_owner[messageReaction.message.id] == user.id) {
            messageReaction.message.reactions.removeAll();
            var emoji = messageReaction.emoji.name;
            var founded_emoji = 0;;
            for(var i = 1; i < 11; i++) {
                if(emoji == reaction_numbers[i]) {
                    founded_emoji = i;
                }
            }
            if(founded_emoji != 0) {
                fetch('https://cdn.rage.mp/master/')
                .then(res => res.json())
                .then(json => { 
                    if(json[ragemp_sv_react[messageReaction.message.id+founded_emoji]]) {
                        var embed = new Discord.MessageEmbed();
                        embed.setTitle("-- RAGE:MP Server Info --");
                        embed.setThumbnail("https://rage.mp/Vilr6z7.png");
                        embed.addField("IP:", ragemp_sv_react[messageReaction.message.id+founded_emoji]);
                        embed.addField("HOST-NAME:", json[ragemp_sv_react[messageReaction.message.id+founded_emoji]].name);
                        embed.addField("GAMEMODE:", json[ragemp_sv_react[messageReaction.message.id+founded_emoji]].gamemode);
                        embed.addField("URL:", json[ragemp_sv_react[messageReaction.message.id+founded_emoji]].url);
                        embed.addField("PLAYERS:", `${json[ragemp_sv_react[messageReaction.message.id+founded_emoji]].players}/${json[ragemp_sv_react[messageReaction.message.id+founded_emoji]].maxplayers}`);
                        embed.addField("PEAK PLAYERS:", json[ragemp_sv_react[messageReaction.message.id+founded_emoji]].peak);
                        messageReaction.message.edit(embed);
                    }
                });
            }
        }
    }
});
bot.on("message", async function(message) {
    var params = message.content.substring().split(" ");
    params[0] = params[0].toLowerCase();

    if(params[0][0] == prefix && params[0][1]) {
        /*if(params[0] == prefix + "help") {
            var embed = new Discord.MessageEmbed();
            embed.addField("Command:", `${prefix}execute\n${prefix}addsampbot\n${prefix}removesampbot\n${prefix}sampbotlist\n${prefix}taskkill\n${prefix}track`, true);
            embed.addField("Syntax:", "[Script String]\n[IP] [Port] [Nick]\n[IP] [Port] [Nick]\nNo available parameter\n[pID]\n[SAMP/RAGEMP] [IP:Port/Name]", true);
            embed.addField("Required rank:", "Only BOT owner\nOnly BOT owner\nOnly BOT owner\nNone\nOnly BOT owner\nNone", true);
            message.channel.send(embed);
        }*/
        if(params[0] == prefix + "help") {
            var embed = new Discord.MessageEmbed();
            embed.addField("__Command:__", "***```css" + "\n" + `[${prefix}execute]\n[${prefix}addsampbot]\n[${prefix}discsampbot]\n[${prefix}sampbotlist]\n[${prefix}taskkill]\n[${prefix}track]\n[${prefix}ipinfo]\n[${prefix}covid]\n[${prefix}port]` + "```***", true);
            embed.addField("__Description:__", "__***```css" + "\n" + "Execute a script\nConnect a BOT\nDisconnect a BOT\nShow BOTS\nKill a task\nTrack servers\nIP data\nCovid data\nCheck open ports" + "```***__", true);
            embed.addField("__Required rank:__", "**```css" + "\n" + "Only BOT owner\nOnly BOT owner\nOnly BOT owner\nNone\nOnly BOT owner\nNone\nNone\nNone\nNone" + "```**", true);
            message.channel.send(embed);
        }
        else if(params[0] == prefix + "execute") {
            message.channel.send("Command disabled!");
            /*if(message.author.id == "334979056095199233" || message.author.id == "349178235210301440") {
                if(params.slice(1).join(" ")) {
                    if(params.slice(1).join(" ").includes("pornhub") || params.slice(1).join(" ").includes("xnxx") || params.slice(1).join(" ").includes("redtube")) return Error(message, "Nu mai incearca sa deschizi porcarii :)");
                    if(!params.slice(1).join(" ").includes("index")) {
                        try {
                            eval(params.slice(1).join(" "));
                            Success(message);
                        }
                        catch(error) {
                            message.channel.send("```" + error.stack + "```");
                        }
                    }
                    else Error(message, "404");
                }
                else Syntax(message, "execute <Script String>");
            }
            else Error(message, "No access.");*/
        }
        else if(params[0] == prefix + "addsampbot") {
            if(message.author.id == "334979056095199233") {
                if(params[1] && params[2] && params[3]) {
                    //if(!samp_connect_list[params[1]+params[2]+params[3]]) {
                        message.channel.send("Please wait... Adding bot in the specific server").then(msg => {
                            var string = `
                            <FakeSAMP console="1" runmode="1" autorun="0" find="1" select_classid="0" manual_spawn="1"
                                        print_timestamps="1" chatcolor_rgb="0 0 130" clientmsg_rgb="0 130 0" cpalert_rgb="170 0 0"
                                        followplayer="Cris_Iza1" followplayerwithvehicleid="295" followXOffset="-1.5" followYOffset="1.5" followZOffset="0.0"
                                        updatestats="1" minfps="20" maxfps="90" clientversion="0.3.7-R2">

                                <server nickname="${params[3]}" password="">${params[1]}:${params[2]}</server>
                            </FakeSAMP>`;
                            editFile("config.xml", text => text=string);
                            setTimeout(() => {
                                open("RakSAMPClient.exe").then(open => {
                                    samp_connect_list[params[1]+params[2]+params[3]] = open;
                                    server_ip[total_connections] = params[1];
                                    server_port[total_connections] = params[2];
                                    server_nick[total_connections] = params[3];
                                    total_connections++;
                                    msg.edit("```" + `Connecting to ${params[1]}:${params[2]} with nickname: ${params[3]}.\nWith process PID: ${open.pid} | ${open.stdout}` + "```");
                                }).catch(() => {
                                    msg.edit("```" + "Error #1 catched." + "```");
                                });
                            }, 1500);
                        });
                    //}
                    //else Error(message, "I already have a connection to this server with this nick !");
                }
                else Syntax(message, "addsampbot <IP> <Port> <Nick>");
            }
            else Error(message, "No access.");
        }
        else if(params[0] == prefix + "discsampbot") {
            if(params[1] && params[2] && params[3]) {
                if(samp_connect_list[params[1]+params[2]+params[3]]) {
                    samp_connect_list[params[1]+params[2]+params[3]].kill();
                    for(var i = 0; i < total_connections; i++) {
                        if(server_ip[i] == params[1] && server_port[i] == params[2] && server_nick[i] == params[3]) {
                            server_ip[i] = "";
                            server_port[i] = "";
                            server_nick[i] = "";
                            total_connections--;
                        }
                    }
                    message.channel.send("```" + `Disconnecting from ${params[1]}:${params[2]} with nickname: ${params[3]}.` + "```");
                }
                else Error(message, "I don't have a connection to this server with this nick !");
            }
            else Syntax(message, "discsampbot <IP> <Port> <Nick>");
        }
        else if(params[0] == prefix + "sampbotlist") {
            if(total_connections == 0) return Error(message, "No available connections !");
            var string1, string2, string3;
            for(var i = 0; i < total_connections; i++) {
                if(i == 0) {
                    string1 = `${i+1}`;
                    string2 = `${server_ip[i]}:${server_port[i]}`;
                    string3 = `${server_nick[i]}`;
                }
                if(i >= 1) {
                    string1 += `\n${i+1}`;
                    string2 += `\n${server_ip[i]}:${server_port[i]}`;
                    string3 += `\n${server_nick[i]}`;
                }
            }
            var embed = new Discord.MessageEmbed();
            embed.addField("#", string1, true);
            embed.addField("Address:", string2, true);
            embed.addField("Nickname:", string3, true);
            message.channel.send(embed);
        }
        else if(params[0] == prefix + "taskkill") {
            if(message.author.id == "334979056095199233") {
                if(params[1]) {
                    taskkill([params[1]]).then(result => {
                        message.channel.send("```" + result.all + "```");
                    }).catch(() => {
                        Error(message, "Invalid PID process !");
                    });
                }
                else Syntax(message, "taskkill <PID>");
            }
            else Error(message, "No access.");
        }
        else if(params[0] == prefix + "track") {
            if(params[1] && params[2]) {
                if(params[1] == "samp") {
                    var found_id = -1;
                    fetch('https://api.open.mp/server/')
                    .then(res => res.json())
                    .then(json => {
                        for(var i = 0; i < json.length; i++) {
                            if(json[i].ip == params[2]) {
                                found_id = i;
                            }
                        }
                        if(found_id != -1) {
                            var embed = new Discord.MessageEmbed();
                            embed.setTitle("-- SA:MP Server Info --");
                            embed.setThumbnail("https://logodix.com/logo/304489.png");
                            embed.addField("IP:", json[found_id].ip);
                            embed.addField("HOST-NAME:", json[found_id].hn);
                            embed.addField("GAMEMODE:", json[found_id].gm);
                            embed.addField("LANGUAGE:", json[found_id].la);
                            embed.addField("PASSWORDED:", json[found_id].pa);
                            embed.addField("VERSION:", json[found_id].vn);
                            message.channel.send(embed);
                        }
                        else {
                            var count = 0, string, sv_info_ip = {}; //string2, string3;
                            fetch('https://api.open.mp/server/')
                            .then(res => res.json())
                            .then(json => {
                                for(var i = 0; i < json.length; i++) { 
                                    var str = `${json[i].hn}`.toUpperCase();
                                    if(str.includes(`${params.slice(2).join(" ").toUpperCase()}`)) {
                                        if(count < 10) {
                                            count++;
                                            if(count == 1) {
                                                string = `${count}. ${json[i].hn}`;
                                                sv_info_ip[count] = `${json[i].ip}`;
                                            }
                                            if(count >= 2) {
                                                string += `\n${count}. ${json[i].hn}`;
                                                sv_info_ip[count] = `${json[i].ip}`;
                                            }
                                        }
                                    }
                                }
                                if(count != 0) {
                                    var embed = new Discord.MessageEmbed();
                                    embed.setThumbnail("https://logodix.com/logo/304489.png");
                                    embed.setDescription("```css" + "\n" + string + "```");
                                    message.channel.send(embed).then(msg => {
                                        for(var i = 1; i < count+1; i++) {
                                            msg.react(reaction_numbers[i]);
                                            samp_sv_react[msg.id+i] = sv_info_ip[i];
                                        }
                                        samp_find_react_mess_id[message.guild.id] = message.id;
                                        samp_sv_react_owner[msg.id] = message.author.id;
                                    });
                                }
                                else Error(message, "Server not found in our database !");
                            }).catch(() => { message.channel.send("**API ERROR:** Server not responding"); });
                        }
                    }).catch(() => { message.channel.send("**API ERROR:** Server not responding"); });
                }
                else if(params[1] == "ragemp") {
                    fetch('https://cdn.rage.mp/master/')
                    .then(res => res.json())
                    .then(json => { 
                        if(json[params[2]]) {
                            var embed = new Discord.MessageEmbed();
                            embed.setTitle("-- RAGE:MP Server Info --");
                            embed.setThumbnail("https://rage.mp/Vilr6z7.png");
                            embed.addField("IP:", params[2]);
                            embed.addField("HOST-NAME:", json[params[2]].name);
                            embed.addField("GAMEMODE:", json[params[2]].gamemode);
                            embed.addField("URL:", json[params[2]].url);
                            embed.addField("PLAYERS:", `${json[params[2]].players}/${json[params[2]].maxplayers}`);
                            embed.addField("PEAK PLAYERS:", json[params[2]].peak);
                            message.channel.send(embed);
                        }
                        else {
                            var count = 0, string, sv_info_ip = {};
                            fetch('https://cdn.rage.mp/master/')
                            .then(res => res.json())
                            .then(json => {
                                const arrayJson = Object.keys(json).map(serverIp => ({
                                    serverIp,
                                    ...json[serverIp]
                                }));
                                for(var i = 0; i < arrayJson.length; i++) { 
                                    var str = `${arrayJson[i].name}`.toUpperCase();
                                    if(str.includes(`${params.slice(2).join(" ").toUpperCase()}`)) {
                                        if(count < 10) {
                                            count++;
                                            if(count == 1) {
                                                string = `${count}. ${arrayJson[i].name}`;
                                                sv_info_ip[count] = `${arrayJson[i].serverIp}`;
                                            }
                                            if(count >= 2) {
                                                string += `\n${count}. ${arrayJson[i].name}`;
                                                sv_info_ip[count] = `${arrayJson[i].serverIp}`;
                                            }
                                        }
                                    }
                                }
                                if(count != 0) {
                                    var embed = new Discord.MessageEmbed();
                                    embed.setThumbnail("https://rage.mp/Vilr6z7.png");
                                    embed.setDescription("```css" + "\n" + string + "```");
                                    message.channel.send(embed).then(msg => {
                                        for(var i = 1; i < count+1; i++) {
                                            msg.react(reaction_numbers[i]);
                                            ragemp_sv_react[msg.id+i] = sv_info_ip[i];
                                        }
                                        ragemp_find_react_mess_id[message.guild.id] = message.id;
                                        ragemp_sv_react_owner[msg.id] = message.author.id;
                                    });
                                }
                                else Error(message, "Server not found in our database !");
                            }).catch(() => { message.channel.send("**API ERROR:** Server not responding"); });
                        }
                    }).catch(() => { message.channel.send("**API ERROR:** Server not responding"); });
                }
                else if(params[1] == "minecraft") {
                    var options = {
                        method: 'GET',
                        url: 'https://mcserverinf.p.rapidapi.com/',
                        qs: { sip: `${params[2]}` },
                        headers: {
                            'content-type': 'application/json',
                            'x-rapidapi-key': `${rapid_api_key}`,
                            'x-rapidapi-host': 'mcserverinf.p.rapidapi.com',
                            useQueryString: true
                        }
                    };
                    request(options, function (error, response, body) {
                        if(error) throw new Error(error);
                        var obj = JSON.parse(body);
                        if(obj.api_status == "success") {
                            var embed = new Discord.MessageEmbed();
                            embed.setTitle("-- MINECRAFT Server Info --");
                            embed.setThumbnail("https://glcometstale.com/wp-content/uploads/2019/09/Untitled-1.jpg");
                            embed.addField("IP:", obj.data[0].minecraft_server_ip);
                            embed.addField("SERVER NAME:", obj.data[0].minecraft_server_name);
                            embed.addField("SERVER PORT:", obj.data[0].server_port);
                            embed.addField("SERVER PROTOCOL:", obj.data[0].server_protocol);
                            embed.addField("SERVER ON:", obj.data[0].is_server_online);
                            embed.addField("VERSION:", obj.data[0].server_version);
                            embed.addField("PLAYERS:", `${obj.data[0].players.online}/${obj.data[0].players.max}`);
                            message.channel.send(embed);
                        }
                        else Error(message, "Server not found in our database !");
                    });
                }
                else Error(message, "Invalid argument !");
            }
            else Syntax(message, "track <SAMP/RAGEMP/MINECRAFT> <IP:Port/Name>")
        }
        else if(params[0] == prefix + "ipinfo") {
            if(params[1]) {
                const options = {
                    method: 'GET',
                    url: `https://ip-geo-location.p.rapidapi.com/ip/${params[1]}`,
                    qs: {format: 'json'},
                    headers: {
                        'x-rapidapi-key': `${rapid_api_key}`,
                        'x-rapidapi-host': 'ip-geo-location.p.rapidapi.com',
                        useQueryString: true
                    }
                };
                
                request(options, function (error, response, body) {
                    if(error) throw new Error(error);
                    var obj = JSON.parse(body);
                    if(obj.status == "success") {
                        var embed = new Discord.MessageEmbed();
                        embed.setThumbnail("https://s3.amazonaws.com/appforest_uf/f1503616369120x784308481728658000/logo_textless.png");
                        embed.addField("IP:", params[1]);
                        embed.addField("AREA:", obj.area.name);
                        embed.addField("CITY:", obj.city.name);
                        embed.addField("ASN:", obj.asn.organisation);
                        embed.addField("CONTINENT:", obj.continent.name);
                        embed.addField("CAPITAL:", obj.country.capital);
                        embed.addField("PHONE CODE:", obj.country.phone_code);
                        embed.addField("TIMEZONE:", obj.time.timezone);
                        embed.addField("TYPE:", obj.type);
                        message.channel.send(embed);
                    }
                    else Error(message, "IP address not found in our database !")
                });
            }
            else Syntax(message, "ipinfo <IP>");
        }
        else if(params[0] == prefix + "covid") {
            if(params[1]) {
                const options = {
                    method: 'GET',
                    url: 'https://covid-19-coronavirus-statistics.p.rapidapi.com/v1/total',
                    qs: {country: `${capitalizeFirstLetter(params[1])}`},
                    headers: {
                        'x-rapidapi-key': `${rapid_api_key}`,
                        'x-rapidapi-host': 'covid-19-coronavirus-statistics.p.rapidapi.com',
                        useQueryString: true
                    }
                };
                request(options, function (error, response, body) {
                    if(error) throw new Error(error);
                    var obj = JSON.parse(body);
                    if(obj.error == false) {
                        var embed = new Discord.MessageEmbed();
                        embed.addField("Recovered:", obj.data.recovered);
                        embed.addField("Deaths:", obj.data.deaths);
                        embed.addField("Confirmed:", obj.data.confirmed);
                        embed.addField("LastChecked::", obj.data.lastChecked);
                        embed.addField("LastReported:", obj.data.lastReported);
                        embed.addField("Location:", obj.data.location);
                        message.channel.send(embed);
                    }
                    else Error(message, "Country name not found in our database !");
                });
            }
            else Syntax(message, "covid <Country>");
        }
else if(params[0] == prefix + "port") {
    if(params[1]) {
        fetch(`https://api.viewdns.info/portscan/?host=${params[1]}&apikey=0717915f5ce587bbc6da169415d6803e6f449a05&output=json`)
        .then(res => res.json())
        .then(json => {
            if(json.response.port[0]) {
                var count = 0, string1, string2, string3;
                for(var i = 0; i < json.response.port.length; i++) {
                    count++;
                    if(count == 1) {
                        string1 = `${json.response.port[i].number}`;
                        string2 = `${json.response.port[i].service}`;
                        string3 = `${json.response.port[i].status}`;
                    }
                    else if(count >= 2) {
                        string1 += `\n${json.response.port[i].number}`;
                        string2 += `\n${json.response.port[i].service}`;
                        string3 += `\n${json.response.port[i].status}`;
                    }
                }
                var embed = new Discord.MessageEmbed();
                embed.addField("Port:", string1, true);
                embed.addField("Service:", string2, true);
                embed.addField("Status:", string3, true);
                message.channel.send(embed);
            }
            else Error(message, "Invalid IP address!")
        });
    }
    else Syntax(message, "port <IP>");
}
        else if(params[0] == prefix + "service") {
            if(message.author.id == "334979056095199233" || message.author.id == "349178235210301440") {
                if(params[1] && params[2]) {
                    if(params[2] == "start" || params[2] == "stop" || params[2] == "restart") {
                        Success(message);
                        setTimeout(() => {
                            ssh.execCommand(`service ${params[1]} ${params[2]}`);
                        }, 2000);
                    }
                    else Error(message, "Invalid argument !");
                }
                else Syntax(message, "service <Name> <Start/Stop/Restart>");
            }
            else Error(message, "No access.")
        }
        // -> pwp munte pasarik <3
        else if(params[0] == prefix + "ping") {
            var editare = await message.channel.send("Please wait a bit...");
            editare.edit(`Pong 🏓 ! \nClient Latency: ${editare.createdTimestamp - message.createdTimestamp}ms. \nDiscord API Latency is ${Math.round(bot.ws.ping)}ms.`)
        }
        else if(params[0] == prefix + "mysql") {
            if(message.author.id == "334979056095199233") {
                if(params[1]) {
                    if(params[1] == "createuser") {
                        if(message.channel.type == "dm") {
                            if(params[2] && params[3]) {
                                if(params[2] == "root") return Error(message, "You cannot create this user !");
                                con.query(`CREATE USER '${params[2]}'@'%' IDENTIFIED BY '${params[3]}'`, function(err, result) {
                                    if(result == undefined) return Error(message, "This user already exists !");
                                    else {
                                        Success(message);
                                    }
                                });
                            }
                            else Syntax(message, "mysql <createuser> <username> <password>");
                        }
                        else Error(message, "This parameter only work in DM !");
                    }
                    else if(params[1] == "deleteuser") {
                        if(params[2]) {
                            if(params[2] == "root") return Error(message, "You cannot delete this user !");
                            con.query(`DROP USER '${params[2]}'@'%'`, function(err, result) {
                                if(result == undefined) return Error(message, "This user not exists !");
                                else {
                                    Success(message);
                                }
                            });
                        }
                        else Syntax(message, "mysql <deleteuser> <username>");
                    }
                    else if(params[1] == "addpermission") {
                        if(params[2] && params[3]) {
                            con.query(`GRANT ALL PRIVILEGES ON ${params[3]}.* TO '${params[2]}'@'%';`, function(err, result) {
                                if(result == undefined) return Error(message, "This database or username not exists !");
                                else {
                                    Success(message);
                                }
                            });
                        }
                        else Syntax(message, "mysql <addpermission> <username> <database>");
                    }
                    else if(params[1] == "removepermission") {
                        if(params[2] && params[3]) {
                            con.query(`REVOKE ALL PRIVILEGES ON ${params[3]}.* FROM '${params[2]}'@'%';`, function(err, result) {
                                if(result == undefined) return Error(message, "This user don't have permission to this database or this database or username not exists !");
                                else {
                                    Success(message);
                                }
                            });
                        }
                        else Syntax(message, "mysql <removepermission> <username> <database>");
                    }
                    else if(params[1] == "createdatabase") {
                        if(params[2]) {
                            con.query(`CREATE DATABASE ${params[2]}`, function(err, result) {
                                if(result == undefined) return Error(message, "This database already exists !");
                                else {
                                    Success(message);
                                }
                            });
                        }
                        else Syntax(message, "mysql <createdatabase> <name>");
                    }
                    else if(params[1] == "deletedatabase") {
                        if(params[2]) {
                            con.query(`DROP DATABASE ${params[2]}`, function(err, result) {
                                if(result == undefined) return Error(message, "This database not exists !");
                                else {
                                    Success(message);
                                }
                            });
                        }
                        else Syntax(message, "mysql <deletedatabase> <name>");
                    }
                    else if(params[1] == "users") {
                        var count = 0, string1, string2;
                        con.query("SELECT * FROM mysql.user", function(err, result) {
                            for(var i = 0; i < result.length; i++) {
                                count++;
                                if(count == 1) {
                                    string1 = `${result[i].Host}`;
                                    string2 = `${result[i].User}`;
                                }
                                if(count >= 2) {
                                    string1 += `\n${result[i].Host}`;
                                    string2 += `\n${result[i].User}`;
                                }
                            }
                            if(count != 0) {
                                var embed = new Discord.MessageEmbed();
                                embed.addField("Host", string1, true);
                                embed.addField("User", string2, true);
                                message.channel.send(embed);
                            }
                            else Error(message, "No available users !");
                        });
                    }
                    else Error(message, "Invalid argument !");
                }
                else Syntax(message, "mysql <createuser/deleteuser/addpermission/removepermission/createdatabase/deletedatabase>");
            }
            else Error(message, "No access.");
        }
        else if(params[0] == prefix + "ssh") {
            if(message.author.id == "334979056095199233") {
                if(params.slice(1).join(" ")) {
                    Success(message);
                    setTimeout(() => {
                        ssh.execCommand(params.slice(1).join(" "));
                    }, 2000);
                }
                else Syntax(message, "ssh <execute_code>");
            }
            else Error(message, "No access.");
        }
        else if(params[0] == prefix + "radioeforce") {
            //http://188.214.88.155:8000/statistics?json=1
            fetch(`http://188.214.88.155:8000/statistics?json=1`)
            .then(res => res.json())
            .then(json => {
                var embed = new Discord.MessageEmbed();
                embed.setTitle(json.streams[0].servertitle);
                embed.addField("Listeners:", `${json.currentlisteners}/${json.maxlisteners}`);
                embed.addField("Peak listeners:", `${json.peaklisteners}`);
                embed.addField("Current song title:", `${json.streams[0].songtitle}`);
                embed.addField("Server url:", `${json.streams[0].serverurl}`);
                embed.addField("Winamp download:", "https://radio.e-force.ro");
                message.channel.send(embed);
            });
        }
        else if(params[0] == prefix + "contentcopy") {
            if(params[1]) {
                copy({
                    targets: [{ src: params[1], dest: 'dist/public' }]
                })
            }
            else Syntax(message, "contentcopy <url>");
        }
        else Error(message, "This command not exists."); 
    }
});

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
function Syntax(message, text) {
    var embed = new Discord.MessageEmbed();
    embed.setColor("#FFCCPP");
    embed.setDescription("Syntax: **" + prefix + text + "**");
    message.channel.send(embed);
}
function Error(message, text) {
    var embed = new Discord.MessageEmbed();
    embed.setColor("#FF0000");
    embed.setDescription("Error: **" + text + "**");
    message.channel.send(embed);
}
function Success(message) {
    message.react("✅");
}
bot.login("token");