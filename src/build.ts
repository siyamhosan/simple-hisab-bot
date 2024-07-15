import { BuildCommands } from './utility/build.js'
import { Bot } from 'dtscommands'

const bot = new Bot({
  commandsDir: '',
  eventsDir: '',
  prefix: '',
  slashCommandsDir: '',
  uniCommandsDir: ''
})

async function main () {
  console.info(
    'Building commands, events, slash commands, and buttons. This may take a while...'
  )
  for (const of of ['events', 'commands', 'slashCommands', 'buttons']) {
    await BuildCommands(of)
  }
  console.info('Done building commands, events, slash commands, and buttons.')
}

main()
