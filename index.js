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
            message.reply("Conectate PELOTUDO")
            return;
        }

        const commandBdy = message.content.slice(prefix.length);
        const args = commandBdy.split(' ');
        const command = args.shift().toLocaleLowerCase(); //shift revoca el primer item del array
        

        let pokeObj = {
            nombre:args[0],
            poderDeHabilidad:args[1],
            vida:args[2],
            //firstAttacker:true,
            critChance: Math.floor(Math.random() * 100),
            armadura: Math.floor(Math.random() * 60)
        };

        let pokeObj2 = {
            nombre:args[3],
            poderDeHabilidad:args[4],
            vida:args[5],
            critChance: Math.floor(Math.random() * 100),
            armadura: Math.floor(Math.random() * 60)
        };

        dict = {
            id : args
        };

        if(command === "ping"){
            for(let a = 0; a<7; a++){
                const tiempoTomado = Date.now() - message.createdTimestamp;
                message.reply(`QUE PASA PUT4 QUERÉS QUE TE LA PONGA? ${tiempoTomado} ms`);
            }
            return;
        }
        
        if(command === "add"){
            const numArgs = args.map(x => parseFloat(x)).reduce((counter,v) => counter += v);
            message.reply(`Resultado de la suma: ${numArgs} - pajin`);
            return;

        }
        
        if(command === "stackoverflow"){
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
                message.reply(`No puedes gastar más de lo que tienes, político estúpido!`);
                return
            }

            message.channel.send(`Apostaste! Te quedan ${cantidadEnMiBilletera} monedas!`);
            return;
        }

        if(command === "search"){
           /*
            fetch('https://carrito-jwt.herokuapp.com/api/user/register',{
               method: 'POST',
               window: 0,
               headers:{
                   'Content-type':'application/json'
               },
               body: JSON.stringify({
                   'name':'fererfererrer',
                   'email':'sdfsdfs@gmail.com',
                   'password':'45645645645645645645'
               })
           }).then( data => data.json()).then( elemento => console.log(elemento)).catch( err => console.log(err));
           message.reply(`Has publicado con éxito!`);
           
           
           ESTE FUNCIONA MUY BIEN, pero no se como hacer pet POST
           const url = "https://arquitectura2-api.herokuapp.com/customers";
           https.get(url, res => {
             let data = '';
             res.on('data', chunk => {
               data += chunk;
             });
             res.on('end', () => {
               data = JSON.parse(data);
               console.log(data);
             })
           }).on('error', err => {
             console.log(err.message);
           })
           */

           axios({
            method: args[1],
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
       
            if(cont >= 100){
                message.reply(`Invocador: has invocado a ${pokeObj.nombre} con:  
                    Poder: ${pokeObj.poderDeHabilidad} 
                    Vida: ${pokeObj.vida}
                    % Golpe crítico: ${pokeObj.critChance}
                    Armadura: ${pokeObj.armadura}`);

                message.reply(`Invocador: has invocado a ${pokeObj2.nombre} con: 
                    Poder: ${pokeObj2.poderDeHabilidad} 
                    Vida: ${pokeObj2.vida}
                    % Golpe crítico: ${pokeObj.critChance}
                    Armadura: ${pokeObj2.armadura}`);
                
                message.reply(`Preparándose para pelear!`);
                
                while(pokeObj.vida >= 0 && pokeObj2.vida >= 0){
                    
                    if(pokeObj.critChance > 50){
                        pokeObj.poderDeHabilidad += pokeObj.critChance;
                        message.reply(`${pokeObj.nombre} tuviste el orto de pegar un crítico!`); 
                    }

                    if(pokeObj2.critChance > 50){
                        pokeObj2.poderDeHabilidad += pokeObj.critChance; 
                        message.reply(`${pokeObj2.nombre} tuviste el orto de pegar un crítico!`);
                    }

                    pokeObj2.vida -= pokeObj.poderDeHabilidad - pokeObj2.armadura;

                    if(pokeObj2.vida <= 0){
                        return message.reply(`${pokeObj2.nombre} ha muerto en combate, la próxima ponele más armadura PLATITA`);
                    }
                    
                    pokeObj.vida -= pokeObj2.poderDeHabilidad - pokeObj.armadura;

                    if(pokeObj.vida <= 0){
                        return message.reply(`${pokeObj.nombre} ha muerto en combate, la próxima ponele más armadura PLATITA`);
                    }
                }
                cont = cont - 20;
            }else{
                message.reply(`Necesitás más monedas POBRE ;)`);
            }

            return;
        }


    }catch(err){
        console.log(err);
    }

});
