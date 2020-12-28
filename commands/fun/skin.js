const Discord = require('discord.js');
const axios = require('axios');

module.exports = {
   name: "skin",
   description: "Gets the skin of a Minecraft user.",
   category: "fun",
   aliases: ['mcskin'],
   enabled: true,
   run: async (client, message, args) => {

      const isValidNickname = string => NICKNAME_REGEX.test(string);
      const NICKNAME_REGEX = /^[a-zA-Z0-9_]{3,16}$/;

      if (args.length !== 1) {
         return message.reply(
            'Error! Only usernames are accepted for this command.'
         );
      }

      const nickname = args[0];

      if (!isValidNickname(nickname)) {
         return message.reply(
            'The username is too long! Minecraft usernames can only be 16 characters.'
         );
      }

      let baseurl = `https://api.mojang.com/users/profiles/minecraft/`

      await axios.get(`${baseurl}${nickname}`).then(function (minecraftuser) {
         let uuid = minecraftuser.data.id

         message.channel.send(
            new Discord.MessageEmbed()
               .setTitle(`${nickname}'s Skin`)
               .addField(`${nickname}'s UUID`, uuid)
               .setImage(`https://visage.surgeplay.com/full/${uuid.toString()}`)
         ).catch(err => {
            message.channel.send("An error occurred when executing this command. Invalid username?");
            console.error(err);
         })


      })
   }
};