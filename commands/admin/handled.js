const { MessageEmbed, Channel } = require("discord.js");
const Discord = require("discord.js");

module.exports = {
   name: "handled",
   category: "admin",
   description: "Handles a help request. only people with the manage messages permission can use this command, and it is ONLY to reply to help requests.",
   aliases: ['helpreply'],
   usage: "n?handled (@mentionuser or ID) (help desk reply here)",
   enabled: true,
   run: async (client, message, args) => {

      let channel = message.channel;

      if (!message.member.roles.cache.has('755940381862002730')) { // Check for the Modmail Mod role in NameMC.
         message.channel.send("You do not have permission to run this command. If this is in error, contact REDRUM#0001.");
         return;
      }

      // Defines success and error to await before sending success/error message
      client.success = (channel, suc, msg) => {
         channel.send(`✅ **${suc}**\n${msg}`);
      };

      client.error = (channel, err, msg) => {
         channel.send(`❌ **${err}**\n${msg}`);
      };

      // Get mentioned user in the beginning argument.
      const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

      // If no user is mentioned, return
      if (args.length === 0 || member === undefined) {
         return message.reply("❌ **ERROR!** you need to mention a user to reply to.");
      }

      let msgreply = args.slice(1).join(" ");

      // DM the mentioned user the text after mentioned
      const replyMsg = new Discord.MessageEmbed()
         .setTitle(`${message.author.tag} has replied to your request.`)
         .setDescription(`Hello, **${member.user.username}!**\n` +
            `**${message.author}** has responded to your modmail: ${msgreply}`)
         .setColor('#39308f')
         .setFooter('You cannot reply to this message. Please re-initiate a help request if you have any further questions.')
      if (message.guild) {
         message.delete().catch((err) => console.error(err));
         member.send(replyMsg)
            .then(() => message.channel.send(`I've replied to ${member.user.tag} for you, **${message.author.username}!**`))
            .then(() => message.channel.send(`**${message.author}** has replied to **${member.user}'s help request:** \n` +
               `**${message.author}** said: ${msgreply}`))
            .catch((err) => {
               client.error(message.channel, 'Error!', 'I failed to send a DM to them! Are their DMs off?');
               return console.error(err);
            });
      }

   }
}
