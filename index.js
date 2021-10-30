require('dotenv').config();
const discord = require('discord.js');
const config = require('./botToken.json');
const https = require('https');
const axios = require('axios');
const { Response } = require('cross-fetch');
const { randomInt } = require('crypto');

const client = new discord.Client();

client.login(config.BOT_TOKEN);

const prefix = "+";

let cont = 0;
var dict = {};

client.on("message", (message) => {
    try{

        if(message.author.bot) return; //no le respondemos/procesamos/usamos comandos de otros bots
        if(!message.content.startsWith(prefix)) return;

        if(message.member.voice.channel == null){
            message.reply("Conectate antes de usarlo")
            return;
        }

        const commandBdy = message.content.slice(prefix.length);
        const args = commandBdy.split(' ');
        const command = args.shift().toLocaleLowerCase(); //shift revoca el primer item del array

        dict = {
            id : args
        };

        if(command === "ping"){
            for(let a = 0; a<7; a++){
                const tiempoTomado = Date.now() - message.createdTimestamp;
                message.reply(`Tu ping es de: ${tiempoTomado} ms`);
            }
            return;
        }
        
        if(command === "add"){
            const numArgs = args.map(x => parseFloat(x)).reduce((counter,v) => counter += v);
            message.reply(`Resultado de la suma: ${numArgs} `);
            return;

        }
        
        if(command === "button"){
            message.channel.send(`https://es.stackoverflow.com/search?q=${args}`.replace(/,/g,'+'));
            return;

        } 
        
        if(command === "song"){
            message.member.voice.channel.join();
            message.channel.send(`https://www.youtube.com/results?search_query=${args}`.replace(/,/g,'+'));
            return;

        } 
        
        if(command === "darmoneda"){
            let id = message.member.user.id;
            //el .map it's not suitable in this case, but gets the job done.
            cont += dict.id.map(x => parseFloat(x)).reduce((contador, num) => contador += num || 0, 0);
            message.reply(`Tienes ${cont} monedas!`);
            return;

        }
        
        if(command === "apostar"){
            var cantidadEnMiBilletera = cont - args || 0;
            
            if(cantidadEnMiBilletera < 0){
                message.reply(`No puedes gastar más de lo que tienes`);
                return
            }

            message.channel.send(`Apostaste! Te quedan ${cantidadEnMiBilletera} monedas!`);
            return;
        }

        if(command === "search"){

           axios({
            method: 'POST',
            url: args[0].toString(), 
            window:0,
            data: JSON.stringify({
                "nickname":"bbbbbbbbbbbb",
                "email":"aaaaaaaaaa@gmail.com",
                "password":"1231233333333333"
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          },).then(function (res) { 
                message.reply(`Tu token de usuario es: ${JSON.stringify(res.data)}`);
                
            })
          .catch(error =>
            console.log("Error", error)
           );

           return;
        }

        if(command === "summoneame"){

            const pokeObj = {
                nombre:args[0],
                poderDeHabilidad:args[1],
                elemento:args[2],
                vida:args[3],
                armadura:args[4],
                critChance: randomInt(100)
            };

            if(pokeObj.vida >= 1200 && pokeObj.poderDeHabilidad >= 300){
                const a = pokeObj.armadura = 20
                message.reply(`Tu personaje no puede llevar tanta armadura, sino el juego se rompe, por eso le pusimos ${a}`);
            }

       
            message.reply(`Tu personaje tiene estas caracteristicas: 
                Nombre: ${pokeObj.nombre} 
                Poder: ${pokeObj.poderDeHabilidad} 
                Elemento: ${pokeObj.elemento}
                Vida: ${pokeObj.vida}
                Armadura: ${pokeObj.armadura}
                Crit chance: ${pokeObj.critChance}%`);

                return;
        }



    }catch(err){
        console.log(err);
    }

});
