const { MessageEmbed, Channel } = require("discord.js");
const Discord = require("discord.js");

module.exports = {
   name: "role",
   category: "admin",
   description: "adds mentioned role to mentioned user.",
   usage: "n?role [user] (role id or name)",
   aliases: ['assignrole', 'addrole'],
   enabled: true,
   run: async (client, message, args) => {

      let channel = message.channel;

      // Check for permissions first.
      if (!message.member.hasPermission("MANAGE_ROLES")) return message.channel.send('❌ **ERROR !** \n' +
         'You do not have permissions to use this command. If you believe this is in error, contact the NameMC staff team.')
      if (!message.guild.me.hasPermission("MANAGE_ROLES")) return message.channel.send('❌ **ERROR !** \n' +
         'I don\'t have the right permissions! if you believe this is in error, please check my role permissions.')

      if (!args[0]) {
         return message.channel.send("Please provide a user and the role you would like to assign/remove from them.");
      }

      // Handling the member lookup.
      let mentioned = message.mentions.members.first() || message.guild.members.cache.find(m => m.user.tag === args[0]) || message.guild.members.cache.get(args[0])
      if (!mentioned) return message.channel.send("ERROR! Please provide a valid user/user ID.")

      // Rolestr would be the role name after the user.
      let rolestr = "";

      for (let i = 1; i < args.length; i++) {
         if (i === (args.length - 1)) {
            rolestr += args[i];
         } else {
            rolestr += args[i] + " ";
         }
      }

      let role = message.guild.roles.cache.find(r => r.name.includes(rolestr)) || message.guild.roles.cache.find(r => r.id == rolestr) || message.mentions.roles.first()
      if (!role) return message.channel.send("ERROR! Please include a role name or ID. If you did include a role, it may be invalid.")

      const addsuccess = new Discord.MessageEmbed()
         .setDescription(`✅ Changed roles for ${mentioned.displayName}, +${role.name}`)
         .setFooter("Run the same command to remove the role.")
         .setColor('#b0aceb');

      const removesuccess = new Discord.MessageEmbed()
         .setDescription(`✅ Changed roles for ${mentioned.displayName}, -${role.name}`)
         .setFooter("Run the same command to add the role back.")
         .setColor('#b0aceb');

      // Loop to check if the user has it or not.
      if (mentioned.roles.cache.has(role.id)) {
         await mentioned.roles.remove(role.id).catch(e => console.log(e.message))
         message.channel.send(removesuccess)
      } else {
         await mentioned.roles.add(role.id).catch(e => console.log(e.message))
         message.channel.send(addsuccess)
      }

   }
}