const { Client, Collection, Util } = require("discord.js");
const { config } = require("dotenv");
const chalk = require("chalk");
const fs = require("fs");
const fetch = require("node-fetch");
const Discord = require("discord.js");
const { error } = require("console");
const { MessageEmbed } = require("discord.js");

const client = new Client({
   disableMentions: 'everyone'
});

client.commands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync("./commands/");
client.prefix = "n?"; // This prefix can be changed to whatever you'd like.

client.on('rateLimit', (...args) => console.log('[RATELIMIT]', ...args));
client.on('error', (...args) => console.error('[ERROR]', ...args));


client.on("ready", async () => {
   console.log("I am awake and beginning to start up!");

   // ----------------------------
   // STATUS

   const guild = client.guilds.cache.first();
   const activities = [`n?help`, `namemc.com`, `${guild.memberCount} members!`]; // These statuses can also be customised as you please.

   // Set a random activity first.
   let activity = activities[Math.floor(Math.random() * activities.length)];
   client.user.setActivity(activity, { type: "WATCHING" });

   setInterval(() => {
      let activity = activities[Math.floor(Math.random() * activities.length)];
      client.user.setActivity(activity, { type: "WATCHING" });
   }, 15000);

   console.log(
      chalk.green.bold(
         `Ready to follow orders!`
      )
   );

});

// ----------------------------
// Client events.

client.on("disconnect", () => {
   console.log(
      chalk.red.bgRed.bold(
         "i just disconnected, making sure you know, I will reconnect now..."
      )
   );
});

client.on("reconnecting", () => {
   console.log(chalk.yellow.bold("i am reconnecting now!"));
});

// ----------------------------
// Message handler.

client.on("message", async message => {
   const prefix = "n?"; // Change this as well if you'd like.

   let command = message.content.toLowerCase().split(" ")[0];
   command = command.slice(prefix.length);
   if (message.author.bot) return;
   if (!message.guild) return;
   if (!message.content.startsWith(prefix)) return;
   if (!message.member)
      message.member = await message.guild.members.fetch(message);

   const cmd =
      client.commands.get(command) ||
      client.commands.get(client.aliases.get(command));

   let replacefrom = (message.content.split(" ")[0]);

   let args = message.content.replace(replacefrom, "").split(" ");

   if (args.length == 1) {
      if (args[0] == "") {
         args = [];
      }
   } else {
      if (args[0] == "") {
         args.shift();
      }
   }

   if (cmd) {

      await cmd.run(client, message, args);
   }
}

);

// Message Listeners

client.on("message", message => {
   if (message.content.includes("namemc, how do i verify")) {
      const user = message.author;
      message.channel.send(new MessageEmbed()
         .setTitle("How To Claim: NameMC")
         .setDescription(`Hey ${user.username}, \n` +
            'To claim your NameMC account, please join the minecraft server `blockmania.com` and type `/namemc` when you have connected. \n' +
            '\n' +
            'Please note that joining BlockMania requires you to have a **Premium** Minecraft Account (you must have paid for Minecraft.) \n' +
            `If you cannot run the command /namemc, try joining on regular Minecraft (unmodded vanilla) as sometimes chat settings can be hidden by mods.`)
         .setColor("#90e78d")

      )
   }
});

// ----------------------------

function replaceAll(str, find, replace) {
   return str.replace(new RegExp(find, "g"), replace);
}

config({
   path: __dirname + "/.env"
});

["command"].forEach(handler => {
   require(`./handlers/${handler}`)(client);
});

function startLoadingBot() {
   console.log("Logging in...");

   client.login(process.env.TOKEN);

   console.log("Request sent to log in.");

}

startLoadingBot();
