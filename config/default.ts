export default {
  port: process.env.PORT,
  dbUri: process.env.MONGODB,
  logLevel: "info",
  accessTokenPrivateKey: "",
  refreshTokenPrivateKey: "",
  smtp: {
    user: 'xavierlamar17@gmail.com',
    pass: 'hqhpabqbkooskbwh',
    host: "gmail",
    port: 465,
    secure: true,
  },
};
