import { Client } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import { Follwing } from "../models/modelsFunctions/modelsTypes";

const client = new Client({
  // Add your client options here
});
export const startWhatsapp = () => {
  client.on("ready", () => {
    console.log("Client is ready!");
  });

  client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
  });

  client.initialize();
};
export const sendMessage = (
  to: [Follwing],
  message: string,
  options?: { customName?: boolean }
) => {
  to.forEach((contact) => {
    const newMessage = options?.customName
      ? "hi " + contact.name + "!\n" + message
      : message;
    client.sendMessage(newMessage, contact.phone);
  });
};
