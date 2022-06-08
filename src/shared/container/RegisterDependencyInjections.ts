import { container } from 'tsyringe'

import Logger from '@infra/Logger/Logger'

container.registerSingleton('Logger', Logger)
