import { Channel } from '../entities/channel.js'

import { ChannelRepository } from '../repositories/channel.js'

interface FindChannelByOwnerIdRequest {
  ownerId: string
}

export class FindChannelByOwnerId {
  constructor(private readonly channelRepository: ChannelRepository) {}

  async execute(request: FindChannelByOwnerIdRequest): Promise<Channel> {
    const { ownerId } = request

    const data = await this.channelRepository.findByOwnerId(ownerId)
    return data
  }
}
