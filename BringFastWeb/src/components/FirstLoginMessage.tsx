import React, { useState, useEffect } from "react";
import Button from "./Button";

interface Props {
  show: Boolean;
}

const FirstLoginMessage: React.FC<Props> = (props: Props) => {
  const [stage, setStage] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    switch (stage) {
      case 0:
        setMessage(
          "Toda equipe presente na BringFast recebe nossos clientes com a melhar agilidade, " +
            "segurança e conforto. Tudo para levar nossas habilidades para complementar suas necessidades"
        );
        break;
      case 1:
        setMessage("Toda equipe dao possui uma conta? ");
        break;
      default:
        break;
    }
  }, [stage]);

  if (false) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 999,
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: 700,
            height: 400,
            padding: "10px 30px 40px 30px",
            backgroundColor: "#fff",
            borderRadius: 10,
          }}
        >
          <h2
            style={{
              flex: 1,
              fontSize: 28,
              fontWeight: "bold",
            }}
          >
            Seja bem vindo!
          </h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flex: 6,
              width: "100%",
              height: "100%",
              padding: 10,
              border: "2px solid #2541B2",
              borderRadius: 10,
            }}
          >
            <p
              style={{
                flex: 8,
                marginTop: 10,
                width: "80%",
                height: "100%",
              }}
            >
              {message}
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flex: 1,
                width: "100%",
              }}
            >
              <Button
                fontSize={20}
                text="Ir para perfil"
                width="200px"
                height="30px"
              />
              <Button
                callback={() => {
                  setStage((old) => (old += 1));
                }}
                fontSize={20}
                text="Avançar"
                width="200px"
                height="30px"
                color="#009FB7"
              />
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
};

export default FirstLoginMessage;
