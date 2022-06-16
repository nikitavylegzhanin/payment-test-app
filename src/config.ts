const hostname = "localhost";
const port = 8000;

const config = {
  tinkoffApiUrl: "https://securepay.tinkoff.ru/v2",
  hostname,
  port,
  appUrl: `http://${hostname}:${port}`,
};

export default config;
