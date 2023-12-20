const jwt = require("jsonwebtoken");
const authConfig =
  "asdasiudhasd89298daidjaskdbkasudjaisudasubdasidhasdasbkdjasda"; // Mudar para um .env

export default function (params = {}) {
  return jwt.sign(params, authConfig, {
    expiresIn: 60 * 60 * 24, // 24 horas
  });
}
