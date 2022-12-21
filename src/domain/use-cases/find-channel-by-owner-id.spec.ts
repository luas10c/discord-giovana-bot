import { faker } from '@faker-js/faker'

import { ChannelRepository } from '../repositories/channel'

import { Channel } from '../entities/channel'

import { FindChannelByOwnerId } from './find-channel-by-owner-id'
import { CreateChannel } from './create-channel'

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

describe('FindChannelByOwnerId', () => {
  it('should be able return null', async () => {
    const findChannel = new FindChannelByOwnerId(channelRepository)

    const channel = await findChannel.execute({ ownerId: '100000' })
    expect(channel).toBeNull()
  })

  it('should be able return channel', async () => {
    const createChannel = new CreateChannel(channelRepository)
    const findChannel = new FindChannelByOwnerId(channelRepository)

    const ownerId = faker.random.numeric()
    const newChannel = {
      channelId: faker.random.numeric(),
      type: 2,
      ownerId
    }

    await createChannel.execute(newChannel)

    const channel = await findChannel.execute({ ownerId })
    expect(channel).toStrictEqual(expect.objectContaining(newChannel))
  })
})
