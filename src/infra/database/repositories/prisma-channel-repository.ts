import type { PrismaClient } from '@prisma/client'

import { Channel } from '../../../domain/entities/channel.js'
import { ChannelRepository } from '../../../domain/repositories/channel.js'
import { FindByIdMapper } from '../mappers/find-by-id.js'
import { RemoveMapper } from '../mappers/remove.js'

export class PrismaChannelRepository implements ChannelRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(channelId: string): Promise<Channel | null> {
    const data = await this.prisma.channel.findUnique({
      where: {
        channelId
      }
    })

    if (!data) {
      return null
    }

    const channel = FindByIdMapper.toDomain(data)
    return channel
  }

  async findByOwnerId(ownerId: string): Promise<Channel | null> {
    const data = await this.prisma.channel.findUnique({
      where: {
        ownerId
      }
    })

    if (!data) {
      return null
    }

    const channel = FindByIdMapper.toDomain(data)
    return channel
  }

  async create(data: Channel): Promise<void> {
    await this.prisma.channel.create({
      data: {
        channelId: data.channelId,
        type: data.type,
        password: data.password,
        ownerId: data.ownerId
      }
    })
  }

  async remove(channelId: string): Promise<Channel> {
    const data = await this.prisma.channel.delete({
      where: {
        channelId
      }
    })

    const channel = RemoveMapper.toDomain(data)

    return channel
  }
}
