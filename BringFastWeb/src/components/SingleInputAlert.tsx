import React, { useState } from "react";
import dynamic from "next/dynamic";
import CloseIcon from "@mui/icons-material/Close";

import { TextField } from "@mui/material";
import { parseCookies } from "nookies";
import Button from "./Button";
import { firebaseDatabase } from "../firebase";

// import { Container } from './styles';

interface Props {
  show: boolean;
  setShow: any;
}

const SingleInputAlert: React.FC<Props> = (props: Props) => {
  const [name, setName] = useState<string>("");
  const placeCollection = firebaseDatabase.collection("places");
  async function handleSubmit() {
    //Verificar se o nome n e vazio
    if (!name) return window.alert("Preencha todos os campos!");

    //Verificar se existe uma mesa com o mesmo id("Name")

    const { ["BringFast.user"]: userLoggedString } = parseCookies(null);
    let userLoggedObj = JSON.parse(userLoggedString);
    let data = await placeCollection
      .where("created_by", "==", userLoggedObj._id)
      .get();
    let placesCreatedByUser = data.docs.map((item) => item.data());
    let placesWithSameId = placesCreatedByUser.filter(
      (place) => place.id == name
    );
    if (placesWithSameId.length)
      return window.alert(
        "Você já possui uma mesa cadastrada com esse identificador!"
      );

    let doc = placeCollection.doc();

    let payload = {
      _id: doc.id,
      id: name,
      created_by: userLoggedObj._id,
      status: 1,
      active_order: "",
    };

    try {
      await doc.set(payload);
      console.log(payload);
      window.alert("Mesa cadastrada com sucesso!");
      setName("");
      props.setShow(false);
    } catch (error) {
      console.log(error);
      window.alert("Não foi possivel cadastrar sua mesa. Tente novamente!");
    }
  }
  return (
    <div
      style={{
        zIndex: 99,
        position: "absolute",
        top: 0,
        left: 0,
        display: props.show ? "flex" : "none",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: 500,
          height: 300,
          borderRadius: 10,
          backgroundColor: "#fff",
        }}
      >
        <div
          style={{
            backgroundColor: "#2541B2",
            color: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flex: 0.4,
            fontSize: 24,
            padding: "0 25px",
            borderRadius: "10px 10px 0 0",
          }}
        >
          <p>Nomeie a mesa:</p>
          <CloseIcon
            onClick={() => props.setShow(false)}
            style={{
              cursor: "pointer",
              width: 30,
              height: 30,
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          }}
        >
          <TextField
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "80%",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flex: 0.5,
            paddingBottom: 20,
          }}
        >
          <Button callback={handleSubmit} text="Confirmar" />
        </div>
      </div>
    </div>
  );
};

export default SingleInputAlert;
