import fetch from "node-fetch";
import { createHash } from "crypto";

import config from "./config";
import { PaymentData } from "./init";

type PaymentState = {
  Success: boolean;
  Status: PaymentData["Status"];
  ErrorCode: string;
  Message: string;
  Details: string;
};

const getState = async (
  paymentId: PaymentData["PaymentId"],
  terminalKey: PaymentData["TerminalKey"]
): Promise<PaymentState> => {
  const PaymentId = paymentId;
  const TerminalKey = terminalKey;

  const tokenData = [PaymentId, TerminalKey].join("");
  const token = createHash("sha256").update(tokenData).digest("hex");

  const res = await fetch(`${config.tinkoffApiUrl}/GetState`, {
    method: "POST",
    body: JSON.stringify({ PaymentId, TerminalKey, Token: token }),
    headers: { "Content-Type": "application/json" },
  });

  return res.json();
};

export default getState;
