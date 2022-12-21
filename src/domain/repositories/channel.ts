import type { Channel } from '../entities/channel'

export abstract class ChannelRepository {
  abstract findById(channelId: string): Promise<Channel>
  abstract findByOwnerId(ownerId: string): Promise<Channel>
  abstract create(data: Channel): Promise<void>
}
