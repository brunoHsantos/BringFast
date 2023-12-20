import React, { useState } from "react";
import { useRouter } from "next/router";
import Button from "../../components/Button";
import TextInput from "../../components/TextInput";
import PersonIcon from "@mui/icons-material/Person";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import consultarCNPJ from "consultar-cnpj";

// import { Container } from './styles';

const RegisterCompanyInfo: React.FC = () => {
  const [code, setCode] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [nickname, setNickname] = useState("");
  const [codeError, setCodeError] = useState(false);

  const router = useRouter();

  const handleNext = () => {
    if (nickname.length === 0 || code.length < 14 || companyName.length === 0) {
      window.alert("Todos os campos devem ser preenchidos corretamente");
      return;
    }

    localStorage.setItem("nickname", nickname);
    localStorage.setItem("code", code);
    localStorage.setItem("company_name", companyName);
    router.push("/RegisterAdress");
  };
  async function getCNPJ(cnpj) {
    try {
      // O Token é opcional
      const empresa = await consultarCNPJ(cnpj);
      console.log(empresa);
      return empresa;
    } catch (e) {
      console.log(e);
      return e;
    }
  }
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        backgroundColor: "#E3F2FD",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#fff",
          width: 1000,
          height: 650,
          padding: 30,
          borderRadius: 10,
          boxShadow: "0 0 20px rgba(0, 0, 0, 0.5)",
        }}
      >
        <h2
          style={{
            fontSize: 38,
            fontWeight: "bold",
          }}
        >
          Cadastre-se
        </h2>
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <p
            style={{
              margin: "14px 0",
              fontSize: 16,
            }}
          >
            Já possui uma conta?
          </p>
          <span
            onClick={() => router.push("/Login")}
            style={{
              textDecoration: "underline",
              color: "#009FB7",
              marginLeft: 12,
              cursor: "pointer",
            }}
          >
            Login
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            height: 370,
          }}
        >
          <p
            style={{
              fontSize: 24,
              margin: "10px 0 20px",
            }}
          >
            Dados da empresa
          </p>
          <TextInput
            value={code}
            masked={true}
            mask={"00.000.000/0000-00"}
            callback={async (value) => {
              setCode(value.replace(/[^0-9]/g, ""));
              if (
                value.replace(/[^0-9]/g, "").length === 14 ||
                value.replace(/[^0-9]/g, "").length === 0
              ) {
                setCodeError(false);

                let data: any = await getCNPJ(value);
                console.log(data);
                setCompanyName(data.razao_social);
                setNickname(
                  data?.estabelecimento?.nome_fantasia
                    ? data?.estabelecimento?.nome_fantasia
                    : ""
                );
              } else if (
                value.replace(/[^0-9]/g, "").length != 0 &&
                value.replace(/[^0-9]/g, "").length < 14
              ) {
                setCodeError(true);
              }
            }}
            placeholder="CNPJ"
            margin="0 0 30px"
            icon={
              <BadgeOutlinedIcon
                style={{
                  width: 30,
                  height: 30,
                }}
              />
            }
          />
          <TextInput
            value={companyName}
            callback={(e) => setCompanyName(e.target.value)}
            placeholder="Razão social"
            margin="0 0 30px"
            icon={
              <BadgeOutlinedIcon
                style={{
                  width: 30,
                  height: 30,
                }}
              />
            }
          />
          <TextInput
            value={nickname}
            callback={(e) => {
              setNickname(e.target.value);
            }}
            placeholder="Nome fantasia"
            margin="0 0 30px"
            icon={
              <PersonIcon
                style={{
                  width: 30,
                  height: 30,
                }}
              />
            }
          />
        </div>
        <Button text="Avançar" callback={() => handleNext()} />
        <Button
          text="Voltar"
          color="#009FB7"
          margin={10}
          callback={() => router.push("/RegisterPersonInfo")}
        />
      </div>
    </div>
  );
};

export default RegisterCompanyInfo;
