import { FindChannelById } from '#/domain/use-cases/find-channel-by-id'
import { RemoveChannel } from '#/domain/use-cases/remove-channel'

export class AutomaticRemove {
  constructor(
    private readonly findChannelById: FindChannelById,
    private readonly removeChannel: RemoveChannel
  ) {}

  async execute(oldChannel) {
    const ownedChannel = await this.findChannelById.execute({
      channelId: oldChannel.id
    })

    if (!ownedChannel) {
      return
    }

    if (oldChannel.id !== ownedChannel.channelId) {
      return
    }

    const members = oldChannel.members.reduce((total: number) => total + 1, 0)
    if (members !== 0) {
      return
    }

    await this.removeChannel.execute({ channelId: ownedChannel.channelId })
    await oldChannel.delete()
  }
}
