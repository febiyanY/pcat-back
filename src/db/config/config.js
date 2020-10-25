module.exports = {
  development: {
    username: "postgres",
    password: "dbss040",
    database: "attendance",
    host: "127.0.0.1",
    dialect: "postgres",
    define: {
      timestamps: false
    },
    logging: false
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql"
  },
  production: {
    username: "root",
    password: null,
    database: "database_production",
    host: "127.0.0.1",
    dialect: "mysql",
    use_env_variable: 'DATABASE_URL'
  }
}
