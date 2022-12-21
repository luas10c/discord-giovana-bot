import { Channel } from '../entities/channel.js'

import { ChannelRepository } from '../repositories/channel.js'

interface FindChannelByIdRequest {
  channelId: string
}

export class FindChannelById {
  constructor(private readonly channelRepository: ChannelRepository) {}

  async execute(request: FindChannelByIdRequest): Promise<Channel> {
    const { channelId } = request

    const data = await this.channelRepository.findById(channelId)
    return data
  }
}
