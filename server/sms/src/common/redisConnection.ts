import * as redis from 'redis';
import {promisify} from 'util';
import * as log from 'winston';
// // import {createHandyClient} from 'handy-redis';
// import * as redis from 'promise-redis';
export class RedisConnector {

    constructor() {
    }

    public async get(key: string): Promise<string> {
        let client = redis.createClient(6379, 'sreesmsproject.alkesz.ng.0001.usw2.cache.amazonaws.com');

        const getAsync = promisify(client.get).bind(client);
        return await getAsync(key);

    }

    public async set(key: string, value: string, ttl: number) {
        let client = redis.createClient(6379, 'sreesmsproject.alkesz.ng.0001.usw2.cache.amazonaws.com');

        client.on('connect', function () {
            client.set(key, value, function (err, reply) {
                client.expire(key, ttl);
            });
        });

        client.on('error', function () {
            log.info('error');

        });
    }

    public async getAllKeysWithRegex(regex: string): Promise<string[]> {

        let client = redis.createClient(6379, 'sreesmsproject.alkesz.ng.0001.usw2.cache.amazonaws.com');
        const keysAsync = promisify(client.keys).bind(client);
        return await keysAsync(regex);

    }
}
