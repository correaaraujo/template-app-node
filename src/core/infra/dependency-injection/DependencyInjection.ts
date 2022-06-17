import 'reflect-metadata'
import { container } from 'tsyringe'
import { Logger } from '@infra/logger'

/**
 * Centralized logic for dependency injection container
 */
class DependencyInjection {
  static setup = (): void => {
    container.registerSingleton('Logger', Logger)
  }
}

export default DependencyInjection
