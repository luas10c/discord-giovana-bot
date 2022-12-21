import { Channel } from '../entities/channel.js'

import { ChannelRepository } from '../repositories/channel.js'

interface CreateVoiceChannelRequest {
  channelId: string
  type: number
  password?: string
  ownerId: string
}

export class CreateChannel {
  constructor(private readonly voiceChannelRepository: ChannelRepository) {}

  async execute(request: CreateVoiceChannelRequest) {
    const { type, channelId, ownerId } = request

    const channel = new Channel({
      type,
      channelId,
      ownerId
    })

    await this.voiceChannelRepository.create(channel)
  }
}
