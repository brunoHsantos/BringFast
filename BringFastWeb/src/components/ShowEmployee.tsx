import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { TextField } from "@mui/material";
import InputMask from "react-input-mask";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import EditIcon from "@mui/icons-material/Edit";
import ChangeImage from "./ChangeImage";

// import { Container } from './styles';

interface Props {
  show: boolean;
  setShow: any;
  employee: any;
}

const ShowEmployee: React.FC<Props> = (props: Props) => {
  const [edit, setEdit] = React.useState(false);
  const [showChangeImage, setShowChangeImage] = React.useState(false);
  const [selectedEmployee, setSelectedEmployee] = React.useState<any>({
    id: 0,
    name: "",
    image: "",
    email: "",
    phone: 0,
    description: "",
    auth: {
      login: "",
      password: "",
      passconfirm: "",
    },
  });

  useEffect(() => {
    let emp = props.employee;
    console.log(props.employee);

    if (emp) {
      setSelectedEmployee({
        _id: emp._id,
        name: emp.fullName,
        email: emp.email,
        phone: emp.phone,
        image: emp.photo,
        auth: {
          login: emp.login,
          password: emp.password,
          passconfirm: "",
        },
      });
    }
  }, [props.employee]);

  return (
    <div
      style={{
        display: props.show ? "flex" : "none",
        flexDirection: "column",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 999,
        width: "100vw",
        height: "100vh",
        backgroundColor: "#fff",
      }}
    >
      <ChangeImage show={showChangeImage} setShow={setShowChangeImage} />
      <div
        style={{
          backgroundColor: "#2541B2",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          height: 75,
          padding: "0 50px",
          borderRadius: "0 0 10px 10px",
          color: "#fff",
          fontSize: 20,
        }}
      >
        <p>Funcionário:</p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-evenly",
            height: "100%",
          }}
        >
          {/* {edit ? (
            <EditIcon
              style={{
                width: 35,
                height: 35,
                cursor: "pointer",
              }}
              onClick={() => setEdit(!edit)}
            />
          ) : (
            <EditOutlinedIcon
              style={{
                width: 35,
                height: 35,
                cursor: "pointer",
              }}
              onClick={() => setEdit(!edit)}
            />
          )} */}
          <CloseIcon
            onClick={() => {
              props.setShow(false);
              setEdit(false);
            }}
            style={{
              width: 40,
              height: 40,
              color: "#fff",
              cursor: "pointer",
              marginLeft: 20,
            }}
          />
        </div>
      </div>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flex: 1.5,
            width: "100%",
            justifyContent: "space-around",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 200,
              height: 200,
              margin: 25,
              backgroundImage: selectedEmployee.image
                ? `url(${selectedEmployee.image})`
                : "",
              backgroundSize: "cover",
              borderRadius: "50%",
            }}
          >
            <div
              onClick={() => setShowChangeImage(true)}
              style={{
                cursor: "pointer",
                display: edit ? "flex" : "none",
                alignItems: "center",
                justifyContent: "center",
                width: 200,
                height: 200,
                backgroundColor: "rgb(0,0,0,0.5)",
                borderRadius: "50%",
              }}
            >
              <span style={{ fontSize: 20, color: "#fff" }}>
                Alterar imagem
              </span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "70%",
              margin: 25,
            }}
          >
            <div
              style={{
                display: "flex",
                width: "100%",
              }}
            >
              <TextField
                disabled={!edit}
                value={selectedEmployee.name}
                onChange={(e) => {
                  setSelectedEmployee((old) => ({
                    ...old,
                    name: e.target.value.replaceAll(/[^a-zA-Z ]+$/g, ""),
                  }));
                }}
                label="Nome do produto"
                variant="standard"
                style={{ width: "100%", marginRight: 50 }}
              />
              {/* <InputMask 
            mask="(99)99999-9999" 
            value={selectedEmployee.phone} 
            onChange={(e)=>{
              setSelectedEmployee((old)=>({
                ...old,
                phone: e.target.value
              }))
            }}> */}
              <TextField
                value={selectedEmployee.phone}
                disabled={!edit}
                label="Telefone"
                variant="standard"
                style={{ width: "100%", marginRight: 50 }}
                onChange={(e) => {
                  setSelectedEmployee((old) => ({
                    ...old,
                    phone: e.target.value,
                  }));
                }}
              />
              {/* </InputMask> */}
              <TextField
                disabled={!edit}
                value={selectedEmployee.auth.login}
                onChange={(e) =>
                  setSelectedEmployee((old) => ({
                    ...old,
                    auth: {
                      ...old.auth,
                      login: e.target.value,
                    },
                  }))
                }
                label="Login"
                variant="standard"
                style={{ width: "100%" }}
              />
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 20,
                width: "100%",
              }}
            >
              <TextField
                disabled={!edit}
                value={selectedEmployee.email}
                onChange={(e) =>
                  setSelectedEmployee((old) => ({
                    ...old,
                    email: e.target.value,
                  }))
                }
                label="E-mail"
                variant="standard"
                style={{ width: "100%", marginRight: edit ? 50 : 0 }}
              />
              <TextField
                disabled={!edit}
                value={selectedEmployee.auth.password}
                onChange={(e) =>
                  setSelectedEmployee((old) => ({
                    ...old,
                    auth: {
                      ...old.auth,
                      password: e.target.value,
                    },
                  }))
                }
                label="Senha"
                variant="standard"
                type="password"
                style={{
                  width: "100%",
                  marginRight: 50,
                  display: edit ? "flex" : "none",
                }}
              />
              <TextField
                disabled={!edit}
                value={selectedEmployee.auth.passconfirm}
                onChange={(e) =>
                  setSelectedEmployee((old) => ({
                    ...old,
                    auth: {
                      ...old.auth,
                      passconfirm: e.target.value,
                    },
                  }))
                }
                label="Confirme sua senha"
                variant="standard"
                type="password"
                style={{ width: "100%", display: edit ? "flex" : "none" }}
              />
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            flex: 1,
          }}
        ></div>
      </div>
    </div>
  );
};

export default ShowEmployee;
