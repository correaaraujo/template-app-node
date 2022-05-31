import { PrismaClient } from "@prisma/client";

export abstract class BaseRepository {
    protected repository: any = new PrismaClient();
}