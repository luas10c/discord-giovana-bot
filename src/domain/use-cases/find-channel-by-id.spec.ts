import { faker } from '@faker-js/faker'

import { Channel } from '../entities/channel.js'

import { ChannelRepository } from '../repositories/channel.js'

import { FindChannelById } from './find-channel-by-id.js'
import { CreateChannel } from './create-channel.js'

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

describe('FindChannelById', () => {
  it('should be able return null', async () => {
    const findChannel = new FindChannelById(channelRepository)

    const channel = await findChannel.execute({ channelId: '100000' })
    expect(channel).toBeNull()
  })

  it('should be able return channel', async () => {
    const createChannel = new CreateChannel(channelRepository)
    const findChannel = new FindChannelById(channelRepository)

    const channelId = faker.random.numeric()
    const newChannel = {
      channelId,
      type: 2,
      ownerId: faker.random.numeric()
    }

    await createChannel.execute(newChannel)

    const channel = await findChannel.execute({ channelId })
    expect(channel).toStrictEqual(expect.objectContaining(newChannel))
  })
})
