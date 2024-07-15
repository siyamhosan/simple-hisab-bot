import { WebhookClient } from 'discord.js'

export default class WarnHook extends WebhookClient {
  constructor () {
    super({
      url: process.env.WARNHOOK || ''
    })
  }

  async sendWarn (message: string) {
    await this.send({
      content: '`' + message + '`'
    })
  }
}
