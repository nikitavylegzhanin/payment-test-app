import fetch from "node-fetch";
import { createHash } from "crypto";

import config from "./config";

export type PaymentData = {
  Success: boolean;
  ErrorCode: string;
  TerminalKey: string;
  Status: "NEW" | "FORM_SHOWED" | "DEADLINE_EXPIRED" | "CANCELED";
  OrderId: string;
  PaymentId: string;
  PaymentURL: string;
  Amount: number;
};

const init = async (orderId: string, amount: number): Promise<PaymentData> => {
  const OrderId = orderId;
  const Amount = amount.toString();
  const TerminalKey = "TinkoffBankTest"; // Invalid value

  const data = {
    OrderId,
    Amount,
    TerminalKey,
    NotificationURL: `${config.appUrl}/notification`,
    SuccessURL: `${config.appUrl}/success`,
    FailURL: `${config.appUrl}/fail`,
    // PayType: "O",
  };

  const tokenData = [Amount, OrderId, "TinkoffBankTest", TerminalKey].join("");
  const token = createHash("sha256").update(tokenData).digest("hex");

  const res = await fetch(`${config.tinkoffApiUrl}/Init`, {
    method: "POST",
    body: JSON.stringify({ ...data, Token: token }),
    headers: { "Content-Type": "application/json" },
  });

  return res.json();
};

export default init;
