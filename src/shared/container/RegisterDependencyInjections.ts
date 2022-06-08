import { container } from 'tsyringe'

import WinstonLogger from '@infra/Logger/Winston/WinstonLogger'

container.registerSingleton('Logger', WinstonLogger)
