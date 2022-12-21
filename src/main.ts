import { Client, GatewayIntentBits } from 'discord.js'
import { REST } from '@discordjs/rest'

import { Channel } from './infra/commands'

async function bootstrap() {
  const token = process.env.DISCORD_TOKEN
  if (!token) {
    throw new Error('DISCORD_TOKEN missing')
  }

  const clientId = process.env.DISCORD_CLIENT_ID
  if (!clientId) {
    throw new Error('DISCORD_CLIENT_ID missing')
  }

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildVoiceStates
    ]
  })

  const api = new REST({ version: '10' }).setToken(token)

  console.log('Started refreshing application (/) commands.')
  await Channel.loadCommands(api, clientId)
  console.log('Successfully reloaded application (/) commands.')

  await Channel.execute(client)

  client.on('ready', (event) => {
    console.log(`Logged in as ${event.user.tag}!`)
  })

  await client.login(token)
}

bootstrap()
