import { faker } from '@faker-js/faker'

import { Channel } from './channel.js'

describe('VoiceChannel', () => {
  it('should be able create voice channel', () => {
    const channelId = faker.random.numeric()

    const channel = new Channel({
      channelId,
      type: 2,
      ownerId: faker.random.numeric()
    })

    expect(channel.channelId).toBe(channelId)
  })
})
