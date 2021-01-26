type ISystem = {
  name: string;
};

type ILogs = {
  sendErrorStackTrace: boolean;
}

type IDatabase = {
  isMongoCloudProvided: boolean;
  mongodbUrl: string;
  mongodbUsername: string;
  mongodbPassword: string;
  mongodbDatabaseName: string;
}

export interface IConfig {
  env: string;
  port: number;
  database: IDatabase;
  system: ISystem;
  logs: ILogs;
};
