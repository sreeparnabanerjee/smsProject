import {Connection, createConnection, getConnection} from "typeorm";

export class DBConnection {
  constructor() {
  }
  public async createConnection(): Promise<any> {
    let connection: Connection;
    try {
      connection = await getConnection('sms');
    } catch (ex) {
      connection = await createConnection({
        "name": process.env.CONNECTION_NAME,
        "schema": process.env.SCHEMA,
        "type": "postgres",
        "host": process.env.HOST,
        "port": parseInt(process.env.PORT),
        "synchronize": true,
        "username": process.env.USERNAME,
        "password": process.env.PASSWORD,
        "database": process.env.DATABASE,
        "entities": [".compiled/entity/*"]
      });
    }
    return connection;
  }
}