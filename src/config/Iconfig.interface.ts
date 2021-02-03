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

type IJwt = {
  secret: string;
  expDate: number;
}

export interface IConfig {
  env: string;
  port: number;
  jwt: IJwt;
  database: IDatabase;
  system: ISystem;
  logs: ILogs;
};
