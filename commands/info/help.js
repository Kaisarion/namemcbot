const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

module.exports = {
   name: "help",
   aliases: ["h", "commands", "?"],
   category: "info",
   description: "Returns all commands, or one specific command info.",
   usage: "(<command>)",
   enabled: true,
   run: async (client, message, args) => {

      if (args.length == 0) {
         let categoryString = [];

         for (let com of client.commands.array()) {

            let msg = "";

            // If it shouldn't be hidden from n?help.
            if (!com.hidefromhelp) {
               // If it has a category within the command
               if (categoryString[com.category]) {
                  // Start the message off with the category name.
                  msg = categoryString[com.category];

                  // Add command to category.
                  msg += "n?" + com.name + "\n";
               } else {
                  msg += "n?" + com.name + "\n";
               }

               categoryString[com.category] = msg;
            }
         }

         const embed = new MessageEmbed()
            .setThumbnail('https://i.imgur.com/VJSOSm5.jpg')
            .setTitle('Help Menu')
            .setColor("#BBA2F7")
            .setFooter('NameMC prefix = n?')
            .setURL("https://namemc.com");

         for (let cat of client.categories) {
            embed.addField(cat, categoryString[cat], true);
         }

         message.channel.send(embed);
      } else if (args.length == 1) {
         const cmd = client.commands.get(args[0]) || client.commands.get(client.aliases.get(args[0]));

         if (!cmd) {

            const embed = new MessageEmbed()
               .setThumbnail('https://i.imgur.com/VJSOSm5.jpg')
               .setTitle('Help Menu - ' + cmd.name)
               .setDescription('This command does not exist.')
               .setColor("#BBA2F7")
               .setFooter('NameMC prefix = n?')
               .setURL("https://namemc.com");

            return message.channel.send(embed);
         }

         if (!cmd.hidefromhelp) {


            let stri = "";
            let count = 0;

            if (cmd.aliases) {
               for (let ali of cmd.aliases) {
                  stri += "`" + ali + "`" + "\n";
               }
            }

            const embed = new MessageEmbed()
               .setThumbnail('https://i.imgur.com/VJSOSm5.jpg')
               .setTitle('Help Menu - ' + cmd.name)
               .setColor("#BBA2F7")
               .setFooter('NameMC prefix = n?')
               .setURL("https://namemc.com");

            embed.addField("Description", cmd.description, false);
            if (stri !== "") {
               embed.addField("Aliases", stri, false);
            } else {
               embed.addField("Aliases", "None set.", false);
            }
            embed.addField("Category", cmd.category, false);
            if (cmd.usage !== undefined) {
               embed.addField("Usage", cmd.usage, false);
            } else {
               embed.addField("Usage", "None set.", false);
            }
            embed.addField("Enabled", cmd.enabled, false);

            message.channel.send(embed);
         } else {
            const embed = new MessageEmbed()
               .setThumbnail('https://i.imgur.com/VJSOSm5.jpg')
               .setTitle('Help Menu - ' + cmd.name)
               .setDescription('This command does not exist.')
               .setColor("#BBA2F7")
               .setFooter('NameMC prefix = n?')
               .setURL("https://namemc.com");

            return message.channel.send(embed);
         }
      }
   }
} 