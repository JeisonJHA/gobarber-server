const dotenv = require('dotenv');

dotenv.config({
  path: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.production'
})

module.exports = [
  {
    "name": "default",
    "type": "postgres",
    "host": "localhost",
    "port": process.env.POSTGRES_PORT,
    "username": process.env.POSTGRES_USER,
    "password": process.env.POSTGRES_PASSWORD,
    "database": process.env.POSTGRES_DB,
    "entities": [
      process.env.TYPEORM_POSTGRES_ENTITIES
    ],
    "migrations": [
      process.env.TYPEORM_POSTGRES_MIGRATIONS
    ],
    "cli": {
      "migrationsDir": process.env.TYPEORM_POSTGRES_MIGRATIONS_DIR
    }
  },
  {
    "name": "mongo",
    "type": "mongodb",
    "host": "localhost",
    "username": process.env.MONGODB_USERNAME,
    "password": process.env.MONGODB_PASSWORD,
    "port": process.env.MONGODB_PORT,
    "database": process.env.MONGODB_DATABASE,
    "useUnifiedTopology": true,
    "entities": [
      process.env.TYPEORM_MONGO_ENTITIES
    ]
  }
]
