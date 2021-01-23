interface ISystem {
  name: string;
};

interface ILogs {
  sendErrorStackTrace: boolean;
}

export interface IConfig {
  env: string;
  port: number;
  system: ISystem;
  logs: ILogs;
};
