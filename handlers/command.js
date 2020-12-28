const { readdirSync } = require("fs");
const ascii = require("ascii-table");
let table = new ascii("Commands");
table.setHeading("Command", "Load status");

module.exports = client => {
   readdirSync("./commands/").forEach(dir => {
      const commands = readdirSync(`./commands/${dir}/`).filter(file =>
         file.endsWith(".js")
      );

      for (let file of commands) {
         let pull = require(`../commands/${dir}/${file}`);

         // Check if it has a name first to make sure it exists
         if (pull.name) {

            client.commands.set(pull.name, pull);

            // Check if it is actually enabled.
            if (pull.enabled) {
               table.addRow(file, "✔️");
            } else {
               table.addRow(file, `⚠️`);
            }

         } else {
            table.addRow(file, `❌`);
            continue;
         }

         if (pull.aliases && Array.isArray(pull.aliases))
            pull.aliases.forEach(alias => client.aliases.set(alias, pull.name));
      }
   });

   // Log the table on startup.
   console.log(table.toString());
};
