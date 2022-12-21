import { faker } from '@faker-js/faker'

import { Channel } from '../entities/channel'

import { ChannelRepository } from '../repositories/channel'
import { RemoveChannel } from './remove-channel'
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

describe('RemoveChannel', () => {
  it('should be able return null', async () => {
    const removeChannel = new RemoveChannel(channelRepository)

    await expect(
      removeChannel.execute({ channelId: '123456' })
    ).resolves.toBeNull()
  })

  it('should be able remove channel', async () => {
    const createChannel = new CreateChannel(channelRepository)
    const removeChannel = new RemoveChannel(channelRepository)

    const channelId = faker.random.numeric()
    await createChannel.execute({
      channelId,
      type: 2,
      ownerId: faker.random.numeric()
    })

    await expect(removeChannel.execute({ channelId })).resolves.toStrictEqual(
      expect.objectContaining({ channelId })
    )
  })
})
