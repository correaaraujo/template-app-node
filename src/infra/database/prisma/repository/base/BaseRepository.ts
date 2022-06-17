import { PrismaClient } from '@prisma/client'

export class BaseRepository {
  public repository: any = new PrismaClient()
}
