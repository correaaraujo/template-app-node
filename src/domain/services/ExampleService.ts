import { ExampleRepository } from './../../infra/repository/ExampleRepository';

export default class ExampleService {
    repository: ExampleRepository;

    constructor() {
        this.repository = new ExampleRepository();
    }

    getAll = () => this.repository.getAll();

}