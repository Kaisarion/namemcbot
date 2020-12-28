const { MessageEmbed, Channel } = require("discord.js");
const { stripIndents } = require("common-tags");
const Discord = require("discord.js");

module.exports = {
    name: "modmail",
    category: "info",
    description: "Request assistance from the NameMC team.",
    usage: "[command | alias]",
    enabled: true,
    run: async (client, message, args) => {

            const modMailCh = client.channels.resolve('750466186654908506'); // gets modmailch for NameMC
            client.success = (channel, suc, msg) => {
                channel.send(`✅ **${suc}**\n${msg}`);
              };
            
              client.error = (channel, err, msg) => {
                channel.send(`❌ **${err}**\n${msg}`);
              };

            if (args.length === 0) {
                const initMsg = `Hello there, **${message.author.username}!** you've initiated modmail help for NameMC! I'll direct your next message to the NameMC support team. Please reply with your message.`;
                const dmCh = await message.author.createDM();
                if (message.guild) {
                    message.delete().catch((err) => console.error(err));
                    dmCh.send(initMsg)
                        .then(() => message.channel.send("I've sent you a DM."))
                        .catch((err) => {
                            client.error(message.channel, 'Error!', 'Failed to send a DM to you, do you have DMs off?');
                            return console.error(err);
                        });
                } else if (message.channel.type === 'dm') {
                    await dmCh.send(initMsg);
                }

                const filter = (m) => !m.author.bot;
                await dmCh.awaitMessages(filter, {max: 1, time: 180000, errors: ['time']})
                    .then(async (collected) => {
                        const attachments = collected.first().attachments.map((a) => a.url);
                        await modMailCh.send(`There's a new help request from **${message.author.tag}** (${message.author}): ${collected.first().content}`, {
                            split: true,
                            files: attachments
                        }).catch((err) => console.error(err));
                        await client.success(dmCh, 'Message sent!', 'I have successfully informed NameMC support for you! Please allow some time for a response.'); 
                    });
            } else {
                await message.channel.send(`I couldn't send your message to NameMC staff as you have to only do n?modmail and await my DM.`, {
                });
                // Remove the message from the guild chat as it may contain sensitive information.
                if (message.guild) {
                    message.delete().catch((err) => console.error(err));
                }
                 }
    }
}