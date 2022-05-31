import { BaseRepository } from "./base/BaseRepository";
import { ExampleModel } from "../../domain/model/ExampleModel";


export class ExampleRepository extends BaseRepository {

  public getAll = async (): Promise<Array<ExampleModel>> =>
    await this.repository.example.findMany();
}