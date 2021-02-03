import config from '../../src/config/config';
import MongoConnection from '../../src/config/mongo-connection';

export async function mochaGlobalSetup() {
  const mongoConnection = new MongoConnection(config.database.isMongoCloudProvided);
  before(async () => {
    await mongoConnection.connect(() => null);
  });

  after(async () => {
    await mongoConnection.close(() => null);
  });
}
