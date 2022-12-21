import { PrismaClient } from '@prisma/client'
import { SlashCommandBuilder } from '@discordjs/builders'
import { REST } from '@discordjs/rest'
import { Routes } from '@discordjs/core'

import { CreateChannel } from '../../domain/use-cases/create-channel.js'
import { FindChannelByOwnerId } from '../../domain/use-cases/find-channel-by-owner-id.js'

import { PrismaChannelRepository } from '../database/repositories/prisma-channel-repository.js'

import { AutomaticRemove } from './automatic-remove.js'

import {
  CreateChannelCommand,
  InviteMemberChannel,
  AllowMemberChannel,
  DenyMemberChannel,
  PrivateChannel
} from './subcommands/index.js'
import { FindChannelById } from '../../domain/use-cases/find-channel-by-id.js'
import { RemoveChannel } from '../../domain/use-cases/remove-channel.js'

const commands = new SlashCommandBuilder()
  .setName('channel')
  .setDescription('Controll your voice channel')
  .addSubcommand((subcommand) => {
    return subcommand.setName('create').setDescription('Create your channel')
  })
  .addSubcommand((subcommand) => {
    return subcommand
      .setName('invite')
      .setDescription('Invite a friend to your channel')
      .addUserOption((option) => {
        return option
          .setName('member')
          .setDescription('Search member by username')
      })
  })
  .addSubcommand((subcommand) => {
    return subcommand
      .setName('allow')
      .setDescription('Allow member on channel')
      .addUserOption((option) => {
        return option
          .setName('member')
          .setDescription('Search member by username')
      })
  })
  .addSubcommand((subcommand) => {
    return subcommand
      .setName('deny')
      .setDescription('Deny member on channel')
      .addUserOption((option) => {
        return option
          .setName('member')
          .setDescription('Search member by username')
      })
  })
  .addSubcommand((subcommand) => {
    return subcommand
      .setName('private')
      .setDescription('Make your channel private to everyone')
      .addStringOption((option) => {
        return option
          .setName('turn')
          .setDescription('Turn on or off')
          .setChoices(
            { name: 'on', value: 'on' },
            { name: 'off', value: 'off' }
          )
      })
  })

const prisma = new PrismaClient()
const channelRepository = new PrismaChannelRepository(prisma)
const createChannel = new CreateChannel(channelRepository)
const findChannelByOnwerId = new FindChannelByOwnerId(channelRepository)
const findChannelById = new FindChannelById(channelRepository)
const removeChannel = new RemoveChannel(channelRepository)
const createChannelCommand = new CreateChannelCommand(
  findChannelByOnwerId,
  createChannel
)
const inviteMemberChannelCommand = new InviteMemberChannel(findChannelByOnwerId)
const allowMemberChannelCommand = new AllowMemberChannel(findChannelByOnwerId)
const denyMemberChannelCommand = new DenyMemberChannel(findChannelByOnwerId)
const privateChannel = new PrivateChannel(findChannelByOnwerId)

const automaticRemove = new AutomaticRemove(findChannelById, removeChannel)

export class Channel {
  static async loadCommands(api: REST, clientId: string) {
    await api.post(Routes.applicationCommands(clientId), {
      body: commands
    })
  }

  static async execute(client) {
    client.on('interactionCreate', async (interaction) => {
      if (!interaction.isCommand()) {
        return
      }

      if (interaction.commandName !== 'channel') {
        return
      }

      const subCommand = interaction.options.getSubcommand()
      if (subCommand === 'create') {
        createChannelCommand.execute(interaction, client)
      }

      if (subCommand === 'invite') {
        inviteMemberChannelCommand.execute(interaction)
      }

      if (subCommand === 'allow') {
        allowMemberChannelCommand.execute(interaction)
      }

      if (subCommand === 'deny') {
        denyMemberChannelCommand.execute(interaction)
      }

      if (subCommand === 'private') {
        privateChannel.execute(interaction)
      }
    })

    client.on('voiceStateUpdate', async (oldState, newState) => {
      if (!oldState) {
        return
      }

      if (!oldState.channel) {
        return
      }

      const oldChannel = await oldState.channel.fetch(true)
      automaticRemove.execute(oldChannel)
    })
  }
}
