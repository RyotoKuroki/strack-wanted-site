import Accessor from '../db.accessors/Accessor';
import { createConnection, BaseEntity, Connection, QueryRunner } from 'typeorm';

export default class Flow {
    public async Run(entities: Array<any>): Promise<Accessor> {
        const accessor = new Accessor();
        const config = accessor.GetConfig(entities);
        return await accessor.CreateConnection(config);
    }
}