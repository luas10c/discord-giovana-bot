interface ChannelProps {
  channelId: string
  type: number
  password?: string
  ownerId: string
}

export class Channel {
  constructor(private props: ChannelProps) {}

  /**
   * get channelId
   * @returns {string}
   */
  public get channelId(): string {
    return this.props.channelId
  }

  /**
   * get type
   * @returns {string}
   */
  public get type(): number {
    return this.props.type
  }

  /**
   * get password
   * @returns {string}
   */
  public get password() {
    return this.props.password
  }

  /**
   * get onwerId
   * @returns {string}
   */
  public get ownerId(): string {
    return this.props.ownerId
  }
}
