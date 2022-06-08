import ILogger from '@infra/Logger/protocols'
import WinstonLogger from '@infra/Logger/winston'
import { container } from 'tsyringe'

container.registerSingleton<ILogger>(
  'Logger',
  WinstonLogger
)
