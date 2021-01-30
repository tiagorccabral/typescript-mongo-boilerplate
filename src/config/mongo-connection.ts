import mongoose, { ConnectionOptions } from 'mongoose';
import logger from './logger';
import config from './config';

(<any>mongoose).Promise = global.Promise;

/** Callback for establishing or re-stablishing mongo connection */
interface IOnConnectedCallback {
  (): void;
}

export default class MongoConnection {
  /** Control to access cloud or local mongo service */
  private readonly isMongoCloudProvided: boolean;

  /** Callback when mongo connection is established or re-established */
  private onConnectedCallback: IOnConnectedCallback;

  /**
   * Internal flag to check if connection established for
   * first time or after a disconnection
   */
  private isConnectedBefore: boolean = false;

  /** Mongo connection options to be passed Mongoose */
  private readonly mongoConnectionOptions: ConnectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  };

  /**
   * Start mongo connection
   * @param isMongoCloudProvided Control to connect to local Mongo or Cloud provided URL
   * @param onConnectedCallback callback to be called when mongo connection is successful
   */
  constructor(isMongoCloudProvided: boolean) {
    if (process.env.NODE_ENV === 'development') {
      mongoose.set('debug', true);
    }

    this.isMongoCloudProvided = isMongoCloudProvided;
    mongoose.connection.on('error', this.onError);
    mongoose.connection.on('disconnected', this.onDisconnected);
    mongoose.connection.on('connected', this.onConnected);
    mongoose.connection.on('reconnected', this.onReconnected);
  }

  /** Close mongo connection */
  public close(onClosed: (err: any) => void) {
    logger.log({
      level: 'info',
      message: 'Closing the MongoDB connection'
    });
    // noinspection JSIgnoredPromiseFromCall
    mongoose.connection.close(onClosed);
  }

  /** Start mongo connection */
  public connect(onConnectedCallback: IOnConnectedCallback) {
    this.onConnectedCallback = onConnectedCallback;
    this.startConnection();
  }

  private startConnection = () => {
    if (this.isMongoCloudProvided) {
      logger.log({
        level: 'info',
        message: `Connecting to MongoDB at ${config.database.mongodbUrl}`
      });
      mongoose.connect(
        `mongodb+srv://${config.database.mongodbUsername}:${config.database.mongodbPassword}@${config.database.mongodbUrl}/${config.database.mongodbDatabaseName}?retryWrites=true&w=majority`,
        this.mongoConnectionOptions
      ).catch();
    } else {
      logger.log({
        level: 'info',
        message: `Connecting to MongoDB at mongodb://${config.database.mongodbUsername}:${config.database.mongodbPassword}@${config.database.mongodbUrl}:27017/${config.database.mongodbDatabaseName}?authSource=admin`
      });
      mongoose.connect(
        `mongodb://${config.database.mongodbUsername}:${config.database.mongodbPassword}@${config.database.mongodbUrl}:27017/${config.database.mongodbDatabaseName}?authSource=admin`,
        this.mongoConnectionOptions
      ).catch();
    }
  }

  /**
   * Handler called when mongo connection is established
   */
  private onConnected = () => {
    logger.log({
      level: 'info',
      message: `Connected to MongoDB at ${config.database.mongodbUrl}`
    });
    this.isConnectedBefore = true;
    this.onConnectedCallback();
  };

  /** Handler called when mongo gets re-connected to the database */
  private onReconnected = () => {
    logger.log({
      level: 'info',
      message: 'Reconnected to MongoDB'
    });
    this.onConnectedCallback();
  };

  /** Handler called for mongo connection errors */
  private onError = () => {
    logger.log({
      level: 'error',
      message: `Could not connect to ${config.database.mongodbUrl}`
    });
    setTimeout(() => {
      this.startConnection();
    }, 2000);
  };

  /** Handler called when mongo connection is lost */
  private onDisconnected = () => {
    if (!this.isConnectedBefore) {
      setTimeout(() => {
        this.startConnection();
      }, 2000);
      logger.log({
        level: 'info',
        message: 'Retrying mongo connection'
      });
    }
  };
}
