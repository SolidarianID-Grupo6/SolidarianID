import neo4j, { Driver } from 'neo4j-driver';
import { Neo4jConfig } from '../interfaces/neo4j-config.interface';

export const createDriver = async (config: Neo4jConfig) => {
  const driver: Driver = neo4j.driver(
    `${config.scheme}://${config.host}:${config.port}`,
    neo4j.auth.basic(config.username, config.password),
    {
      encrypted: 'ENCRYPTION_OFF',
    },
  );

  await driver.getServerInfo();

  return driver;
};
