import {RedisConnector} from "./common/redisConnection";


export const handleStopKeyword = async (from: string, to: string, text?: string) => {
    let redisConnector = new RedisConnector();
        await redisConnector.set('STOP'+from+':'+to, 'true', 4*60*60);
}

export const setFromForOutbound = async (from: string) => {
    let timeStamp = new Date().toISOString();
    let redisConnector = new RedisConnector();
    await redisConnector.set(from+':'+timeStamp, 'true', 60*60);
}

export const isSmsAllowed = async (from: string, to: string, text?: string): Promise<boolean> => {
    let redisConnector = new RedisConnector();
    let value: string =  await redisConnector.get('STOP'+from+':'+to);
    if(value === 'true') {
        return Promise.resolve(false);
    } else {
        return Promise.resolve(true);
    }
}

export const isSmsLimitReached = async (from: string): Promise<boolean> => {
    let redisConnector = new RedisConnector();
    let values: string[] =  await redisConnector.getAllKeysWithRegex(from+':*');
    if(values.length > 50) {
        return Promise.resolve(false);
    } else {
        return Promise.resolve(true);
    }
}

