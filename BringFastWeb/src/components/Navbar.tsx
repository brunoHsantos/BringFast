import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import PersonIcon from "@mui/icons-material/Person";
import ExitToApp from "@mui/icons-material/ExitToApp";
import { outlinedInputClasses } from "@mui/material";
import { Tooltip } from "@mui/material";
import { destroyCookie } from "nookies";
import Logo from '../../public/images/Logo.svg'

const Navbar: React.FC = () => {
  const router = useRouter();

  const user = {
    image:
      "https://static1.minhavida.com.br/articles/5e/41/c5/51/cereal-matinal-cafe-da-manha-orig-1.jpg",
  };

  return (
    <div
      style={{
        backgroundColor: "#2541B2",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100vw",
        height: 100,
        paddingInline: 40,
      }}
    >
      <div><Image src={Logo} width={150}/></div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          margin: 20,
        }}
      >
        <span
          onClick={() => router.push("/DashHome")}
          style={{
            color: "#fff",
            marginRight: 20,
            cursor: "pointer",
          }}
        >
          Home
        </span>
        <span
          onClick={() => router.push("/DashMenu")}
          style={{
            color: "#fff",
            marginRight: 20,
            cursor: "pointer",
          }}
        >
          Cardapio
        </span>
        <span
          onClick={() => router.push("/DashTables")}
          style={{
            color: "#fff",
            marginRight: 20,
            cursor: "pointer",
          }}
        >
          Mesas
        </span>
        <span
          onClick={() => router.push("/DashEmployees")}
          style={{
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Funcionários
        </span>

        <Tooltip title="Sair">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: 50,
              height: 50,
              borderRadius: "50%",
              margin: "0 20px",
              cursor: "pointer",
            }}
            onClick={() => {
              destroyCookie(undefined, "BringFast.user");
              destroyCookie(undefined, "BringFast.token");
              router.push("/Login");
            }}
          >
            <ExitToApp
              style={{
                width: 30,
                height: 30,
                color: "#fff",
              }}
            />
          </div>
        </Tooltip>
      </div>
    </div>
  );
};

export default Navbar;
