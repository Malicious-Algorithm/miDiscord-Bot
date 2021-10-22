require('dotenv').config();
const discord = require('discord.js');
const config = require('./botToken.json');
const YouTube = require('youtube-node');

const client = new discord.Client();
const youtube = new YouTube();

client.login(config.process.env.BOT_TOKEN);

const prefix = "+";


client.on("message", (message) => {
    try{

        if(message.author.bot) return; //no le respondemos/procesamos/usamos comandos de otros bots
        if(!message.content.startsWith(prefix)) return;

        if(message.member.voice.channel == null){
            message.reply("Conectate PELOTUDO")
            return;
        }

        const commandBdy = message.content.slice(prefix.length);
        const args = commandBdy.split(' ');
        const command = args.shift().toLocaleLowerCase(); //shift revoca el primer item del array

        if(command === "ping"){
            for(let a = 0; a<7; a++){
                const tiempoTomado = Date.now() - message.createdTimestamp;
                message.reply(`QUE PASA PUT4 QUERÉS QUE TE LA PONGA? ${tiempoTomado} ms`);
            }
        }else if(command === "add"){
            const numArgs = args.map(x => parseFloat(x)).reduce((counter,v) => counter += v);
            message.reply(`Resultado de la suma: ${numArgs} - pajin`);

        }else if(command === "button"){
            message.channel.send(`https://es.stackoverflow.com/search?q=${args}`.replace(/,/g,'+'));

        }else if(command === "song"){
            message.member.voice.channel.join();
            message.channel.send(`https://www.youtube.com/results?search_query=${args}`.replace(/,/g,'+'));

        }
     
    }catch(err){
        console.log(err);
    }

});