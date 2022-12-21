import { Channel } from '../entities/channel'

import { ChannelRepository } from '../repositories/channel'

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
