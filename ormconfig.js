const dotenv = require('dotenv');

dotenv.config({
  path: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.production'
})

module.exports = [
  {
    "name": "default",
    "type": "postgres",
    "host": "localhost",
    "port": 5432,
    "username": "postgres",
    "password": "docker",
    "database": "gostack_gobarber",
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
    "port": 27017,
    "database": "gostack_gobarber",
    "useUnifiedTopology": true,
    "entities": [
      process.env.TYPEORM_MONGO_ENTITIES
    ]
  }
]
