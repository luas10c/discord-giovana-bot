import { ChannelRepository } from '../repositories/channel'

interface RemoveChannelRequest {
  channelId: string
}

export class RemoveChannel {
  constructor(private readonly channelRepository: ChannelRepository) {}

  async execute(request: RemoveChannelRequest) {
    const { channelId } = request

    const channel = await this.channelRepository.findById(channelId)
    if (!channel) {
      return null
    }

    await this.channelRepository.remove(channelId)

    return channel
  }
}
