import type { RedisOptions, Redis } from 'ioredis';
import IORedis from 'ioredis';
export class RedisSubPub {
  public pubClient: Redis;
  public subClient: Redis;

  constructor(
    private redisConfig: RedisOptions,
    private channelPrefix: string = 'm-shop-channel#',
  ) {
    console.log(this.redisConfig, 'redisConfig');
    this.init();
  }
  public init() {
    console.log('init', this.redisConfig);

    const redisOptions: RedisOptions = {
      host: this.redisConfig.host,
      port: this.redisConfig.port,
    };
    if (this.redisConfig.password) {
      redisOptions.password = this.redisConfig.password;
    }

    const pubClient = new IORedis(redisOptions);
    const subClient = pubClient.duplicate();

    this.pubClient = pubClient;
    this.subClient = subClient;
  }

  public async public(event: string, data: any) {
    const channel = this.channelPrefix + event;
    const _data = JSON.stringify(data);
    await this.pubClient.publish(channel, _data);
  }
  private ctc = new Map<Function, (channel: string, message: string) => void>();

  public async subscribe(event: string, callback: (data: any) => void) {
    const myChannel = this.channelPrefix + event;
    this.subClient.subscribe(myChannel);
    const cb = (channel, message) => {
      if (channel === myChannel) {
        callback(JSON.parse(message));
      }
    };

    this.ctc.set(callback, cb);
    this.subClient.on('message', cb);
  }
  public async unsubscribe(event: string, callback: (data: any) => void) {
    const channel = this.channelPrefix + event;
    this.subClient.unsubscribe(channel);
    const cb = this.ctc.get(callback);
    if (cb) {
      this.subClient.off('message', cb);
      this.ctc.delete(callback);
    }
  }
}
