export function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

export const NODE_ENVIRONMENT = {
  PROD: 'production',
  DEV: 'development',
};

export function getNodeEnv() {
  return process.env.NODE_ENV || NODE_ENVIRONMENT.DEV;
}

const japaneseDb = 'japanese';

export function getMongoConnectionString() {
  const mongoHost = process.env.MONGO_HOST;

  if (getNodeEnv() === NODE_ENVIRONMENT.PROD) {
    const username = process.env.MONGO_USERNAME;
    const password = process.env.MONGO_PASSWORD;
    return `mongodb://${username}:${password}@${mongoHost}/${japaneseDb}?authSource=admin`;
  }

  return `mongodb://${mongoHost}/${japaneseDb}`;
}

export function getHost() {
  return getNodeEnv() === NODE_ENVIRONMENT.PROD
    ? 'www.oskarlindgren.se'
    : `localhost:${process.env.PORT}`;
}
