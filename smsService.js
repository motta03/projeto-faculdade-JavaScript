export async function enviarSMS(telefone, mensagem) {
  const TWILIO_SID = "AC74cd0f319a9a000faf3dee66b1446f52";
  const TWILIO_AUTH = "0f2d9b59b47136f0baab6f28c2389e2c";

  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`;

  const payload = new URLSearchParams();
  payload.append("To", telefone);
  payload.append("From", "+SEU_NUMERO_TWILIO");
  payload.append("Body", mensagem);

  const authString = btoa(`${TWILIO_SID}:${TWILIO_AUTH}`);

  const resposta = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${authString}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: payload.toString(),
  });

  return resposta;
}