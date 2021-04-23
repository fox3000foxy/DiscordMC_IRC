import { Client, TextChannel } from 'discord.js';
import { config } from 'dotenv';
const client = new Client();
import { createBot } from 'mineflayer';
import { readFileSync } from 'fs';
config();
const TOKEN: string = process.env.TOKEN;
const CHANNEL_ID: string = process.env.CHANNEL_ID;
const MINEFLAYERCONFIG_HOST: string = process.env.MINEFLAYERCONFIG_HOST;
const MINEFLAYERCONFIG_USERNAME: string = process.env.MINEFLAYERCONFIG_USERNAME;
const MINEFLAYERCONFIG_PORT: number = parseInt(process.env.MINEFLAYERCONFIG_PORT);
const MINEFLAYERCONFIG_VERSION: string = process.env.MINEFLAYERCONFIG_VERSION;

const avatarException = JSON.parse(readFileSync("./data/avatarException.json", 'utf8'));
const bot = createBot({
  host: MINEFLAYERCONFIG_HOST,
  username: MINEFLAYERCONFIG_USERNAME,
  port: MINEFLAYERCONFIG_PORT,
  version: MINEFLAYERCONFIG_VERSION
});

bot.on('login', () => {
  //For cracked server
  /* → */bot.chat("/register IRCBot IRCBot");
  /* → */bot.chat("/login IRCBot");
  bot.chat("Hello there ! I'm the Discord IRC Bot !");
  console.log("IRC Bot spawned")
})

//Foe vanilla server
bot.on('chat', (username: string, message: string) => {
  if (username === bot.username) {
    return;
  }
  sendToDiscord(username, "", message);
})

client.on('ready', () => {
  console.log("Discord Connected !");
  client.on('message', (message) => {
    if (!message.webhookID && message.channel.id == CHANNEL_ID && !message.author.bot)
      bot.chat('/tellraw @a ["",{"text":"[Discord] ' + message.author.username + '#' + message.author.discriminator + ' :","color":"yellow"},{"text":" ' + message.content + '","color":"gold"}]');
  })
})

async function sendToDiscord(username: string, grade: string, message: string) {
  const channel = client.channels.cache.get(CHANNEL_ID)
  if (channel instanceof TextChannel) {
    let webhooks = await channel.fetchWebhooks();
    let webhook = webhooks.first();
    if (!webhook) {
      channel.createWebhook('IRC WebHook', {
        avatar: 'https://i.imgur.com/wSTFkRM.png',
      });
      setTimeout(() => { sendToDiscord(username, grade, message) }, 500);
      return;
    }
    let avatarURL = 'https://minotar.net/avatar/' + username + '.png';
    for (let i = 0; i < avatarException.length; i++) {
      if (avatarException[i].name === username) {
        avatarURL = avatarException[i].redirect;
      }
    }
    await webhook.send(message, {
      username: `${grade}${username}`,
      avatarURL: avatarURL
    });
  }
}

client.login(TOKEN);
