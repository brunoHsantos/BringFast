import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import CloseIcon from "@mui/icons-material/Close";
import dynamic from "next/dynamic";
const Avatar = dynamic(() => import("react-avatar-edit"), { ssr: false });

import { TextField } from "@mui/material";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import Button from "./Button";
import { firebaseDatabase } from "../firebase";
import { hashPassword } from "../utils/hashPassword";
import { parseCookies } from "nookies";

// import { Container } from './styles';

interface Props {
  show: boolean;
  setShow: any;
}

const NewEmployee: React.FC<Props> = (props: Props) => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const imageRead = (e: any) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(e[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/png": [],
      "image/jpeg": [],
    },
    onDrop: (acceptedFiles) => imageRead(acceptedFiles),
  });

  async function handleSubmit() {
    const employeeCollection = firebaseDatabase.collection("employees");
    const { ["BringFast.user"]: userLoggedString } = parseCookies(null);
    let userLoggedObj = JSON.parse(userLoggedString);
    console.log(name, email, phone, login, password, confirmPassword);

    //Validar campos
    if (
      !name ||
      !email ||
      !phone ||
      !login ||
      !password ||
      !confirmPassword ||
      !image
    )
      return window.alert("Preecha todos os campos!");

    if (password.length < 8)
      return window.alert("A senha deve conter um minimo de 8 caracteres!");

    if (password !== confirmPassword)
      return window.alert("A senhas não coincidem!");

    //Validar se existe funcionario com o mesmo login
    let data = await employeeCollection.where("login", "==", login).get();
    let employees = data.docs.map((item) => item.data());
    let employeesFromCompany = employees.filter(
      (item) => item.company === userLoggedObj._id
    );
    if (employeesFromCompany.length)
      return window.alert("Login já registrado. Tente novamente!");

    const doc = await employeeCollection.doc();

    let payload = {
      _id: doc.id,
      fullName: name,
      email,
      phone,
      login,
      password: await hashPassword(password),
      photo: image,
      company: userLoggedObj._id,
    };

    try {
      await doc.set(payload);
      setName("");
      setEmail("");
      setPhone("");
      setLogin("");
      setPassword("");
      setConfirmPassword("");
      setImage(null);
      window.alert("Funcionário cadastrado com sucesso!");
      props.setShow(false);
    } catch (error) {
      console.error(error);
      window.alert(
        "Não foi possivel cadastrar seu funcionário. Tente novamente!"
      );
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
          width: 800,
          height: 500,
          borderRadius: 10,
          backgroundColor: "#fff",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            height: 100,
            padding: "0 40px",
            borderBottom: "1px solid #ccc",
            color: "#2541B2",
          }}
        >
          <h2>Novo funcionário</h2>
          <CloseIcon
            onClick={() => props.setShow(false)}
            style={{
              cursor: "pointer",
              width: 35,
              height: 35,
            }}
          />
        </div>
        <div
          style={{
            overflowY: "auto",
            // display: "flex",
            // flexDirection: "column",
            width: "100%",
            // height: "100%"
          }}
        >
          <div
            style={{
              width: "100%",
              height: 80,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            <TextField
              style={{ width: "100%", margin: "0 30px" }}
              label="Nome"
              variant="standard"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div
            style={{
              width: "100%",
              height: 80,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            <TextField
              style={{ width: "100%", margin: "0 30px" }}
              label="E-mail"
              variant="standard"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              style={{ width: "100%", margin: "0 30px" }}
              label="Celular"
              variant="standard"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div
            style={{
              width: "100%",
              height: 80,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            <TextField
              style={{ width: "100%", margin: "0 30px" }}
              label="Login"
              variant="standard"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
          </div>
          <div
            style={{
              width: "100%",
              height: 80,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            <TextField
              style={{ width: "100%", margin: "0 30px" }}
              label="Senha"
              variant="standard"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
            />
            <TextField
              style={{ width: "100%", margin: "0 30px" }}
              label="Confirmar senha"
              variant="standard"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: 300,
              marginBottom: 20,
            }}
          >
            {image ? (
              <Avatar
                onCrop={(view) => {
                  setPreview(view);
                }}
                onClose={() => {
                  setImage(null);
                }}
                width={700}
                height={270}
                src={image}
              />
            ) : (
              <div
                {...getRootProps()}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "90%",
                  height: "90%",
                  border: "2px dashed #009FB7",
                  cursor: "pointer",
                }}
              >
                <input {...getInputProps()} />
                <ImageOutlinedIcon
                  style={{
                    width: 100,
                    height: 100,
                    color: "#009FB7",
                  }}
                />
                <h2 style={{ fontSize: 15, color: "#009FB7" }}>
                  Selecione ou arraste uma imagem
                </h2>
              </div>
            )}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: 100,
              margin: "10px 0",
            }}
          >
            <Button text="Confirmar" callback={handleSubmit} />
          </div>
        </div>
        <div
          style={{
            height: 50,
          }}
        />
      </div>
    </div>
  );
};

export default NewEmployee;
