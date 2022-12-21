import { faker } from '@faker-js/faker'

import { CreateChannel } from './create-channel'

import { ChannelRepository } from '../repositories/channel'
import { Channel } from '../entities/channel'

const channels: Channel[] = []

class InMemoryChannelRepository implements ChannelRepository {
  async findById(channelId: string): Promise<Channel | null> {
    const data = channels.find((item) => item.channelId === channelId)

    if (!data) {
      return null
    }

    return data
  }
  async findByOwnerId(ownerId: string): Promise<Channel> {
    const data = channels.find((item) => item.ownerId === ownerId)

    if (!data) {
      return null
    }

    return data
  }
  async create(data: Channel): Promise<void> {
    const channel = new Channel({
      channelId: data.channelId,
      type: data.type,
      password: data.password,
      ownerId: data.ownerId
    })

    channels.push(channel)
  }

  async remove(channelId: string): Promise<Channel | null> {
    const removedChannel = channels.find(
      (channel) => channel.channelId === channelId
    )

    if (!removedChannel) {
      return null
    }

    const data = channels.filter((channel) => channel.channelId !== channelId)
    channels.length = 0

    channels.push(...data)

    return removedChannel
  }
}

const channelRepository = new InMemoryChannelRepository()

describe('CreateVoiceChannel', () => {
  it('should be able create voice channel', async () => {
    const createChannel = new CreateChannel(channelRepository)

    const channelId = faker.random.numeric()

    await expect(
      createChannel.execute({
        channelId,
        type: 2,
        ownerId: faker.random.numeric()
      })
    ).resolves.not.toThrow()
  })
})
