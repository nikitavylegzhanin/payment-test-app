import fetch from "node-fetch";
import { createHash } from "crypto";
import nodeRsa from "node-rsa";

import config from "./config";
import { PaymentData } from "./init";

type FinishAutorizeResponse = {
  TerminalKey: string;
  OrderId: string;
  Success: boolean;
  Status: "3DS_CHECKING" | "AUTHORIZED";
  Amount: number;
  PaymentId: number;
  ErrorCode: string;
  Message: string;
  Details: string;
  CardId: string;
};

type CardData = {
  PAN: number;
  ExpDate: number; // MMYY
  CardHolder: string;
  CVV: string;
};

const FinishAutorize = async (
  paymentId: PaymentData["PaymentId"],
  terminalKey: PaymentData["TerminalKey"],
  cardData: CardData
): Promise<FinishAutorizeResponse> => {
  const PaymentId = paymentId;
  const TerminalKey = terminalKey;
  const cardDataStr = `PAN=${cardData.PAN};ExpDate=${cardData.ExpDate};CardHolder=${cardData.CardHolder};CVV=${cardData.CVV}`;

  const rsaKey = new nodeRsa({ b: 512 });

  const CardData = rsaKey.encrypt(cardDataStr, "base64");

  const tokenData = [PaymentId, TerminalKey].join("");
  const Token = createHash("sha256").update(tokenData).digest("hex");

  const res = await fetch(`${config.tinkoffApiUrl}/FinishAuthorize`, {
    method: "POST",
    body: JSON.stringify({ PaymentId, TerminalKey, CardData, Token }),
    headers: { "Content-Type": "application/json" },
  });

  return res.json();
};

export default FinishAutorize;
