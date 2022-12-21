import { Channel as RawChannel } from '@prisma/client'

import { Channel } from '../../../domain/entities/channel.js'

export class RemoveMapper {
  static toDomain(channel: RawChannel) {
    const data = new Channel({
      channelId: channel.channelId,
      type: channel.type,
      password: channel.password,
      ownerId: channel.ownerId
    })

    return data
  }
}
