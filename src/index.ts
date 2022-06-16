import { createServer } from "http";

import config from "./config";
import init from "./init";
import getState from "./getState";
import finishAutorize from "./finishAuthorize";

let orderId: string;

const server = createServer(async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  console.log(req.url);

  if (req.url === "/") {
    orderId = Math.random().toString(36).substring(7);
    // Создаем платеж
    const paymentData = await init(orderId, 666);

    // Перенаправляем на страницу оплаты -> Error: Ошибка оплаты
    res.writeHead(302, {
      location: paymentData.PaymentURL,
    });

    // Отправляем форму вручную -> Error 508: Неверный номер карты
    const autorizeData = await finishAutorize(
      paymentData.PaymentId,
      paymentData.TerminalKey,
      {
        PAN: 0, // 4300000000000777
        ExpDate: 0, // 0519
        CardHolder: "NIKITA VYLEGZHANIN",
        CVV: "", // 111
      }
    );
    console.log("autorizeData:", autorizeData);

    // Пробуем получить состояние платежа -> Error 204: Неверный токен. Проверьте пару TerminalKey/SecretKey
    setTimeout(async () => {
      const paymentState = await getState(
        paymentData.PaymentId,
        paymentData.TerminalKey
      );

      console.log(`Payment ${paymentData.PaymentId} state:`, paymentState);
    }, 1000);

    return res.end();
  }

  if (req.url === "/notification") {
    console.log("notification");

    // Здесь, как я понимаю, должны приходить данные AUTHORIZED -> CONFIRMED / REJECTED
    // при отправке формы с https://securepay.tinkoff.ru/new/
  }

  if (req.url === "/success") {
    console.log("successed");
  }

  if (req.url === "/fail") {
    console.log("fail");
  }

  return res.end();
});

server.listen(config.port, config.hostname, () => console.log(config.appUrl));
