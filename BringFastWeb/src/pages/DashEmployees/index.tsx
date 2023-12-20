import React, { useEffect, useState } from "react";

import Navbar from "../../components/Navbar";
import { DataGrid } from "@mui/x-data-grid";
import { idID } from "@mui/material/locale";
import Button from "../../components/Button";
import NewEmployee from "../../components/NewEmployee";
import ShowEmployee from "../../components/ShowEmployee";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { firebaseDatabase } from "../../firebase";

// import { Container } from './styles';

const DashEmployees: React.FC = () => {
  const [newProductShow, setNewProductShow] = React.useState(false);
  const [showEmployee, setShowEmployee] = React.useState(false);
  const [selectedEmployee, setSelectedEmployee] = React.useState();
  const [employees, setEmployees] = React.useState([]);

  const phoneFormating = (phoneNumber: number) => {
    let phone = phoneNumber.toString();
    return (
      "(" +
      phone.slice(0, 2) +
      ")" +
      phone.slice(2, 7) +
      "-" +
      phone.slice(7, 11)
    );
  };

  // const employees = [
  //   {
  //     id: 1,
  //     name: "Fernando Souza de Foliassa",
  //     image:
  //       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqtI3fkj833EYPDDNfb2iyJRj2A6zY-F1Bdw&usqp=CAU",
  //     email: "fernandimgameplay@gmail.com",
  //     phone: 99999999999,
  //     description:
  //       "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quidem.",
  //     auth: {
  //       login: "Nando Junior",
  //       password: "discordo123",
  //     },
  //   },
  //   {
  //     id: 2,
  //     image:
  //       "https://images.tcdn.com.br/img/img_prod/671591/bola_futebol_de_society_extra_32_gomos_azure_05816_14615_1_3f7282f510322eccf7706847fe482987_20220519183414.jpg",
  //     name: "Jonas Jonico Jonase",
  //     email: "jonas@jonas.jonas",
  //     phone: 16997687163,
  //     description:
  //       "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quidem.",
  //     auth: {
  //       login: "jonase",
  //       password: "123456",
  //     },
  //   },
  //   {
  //     id: 3,
  //     image:
  //       "https://i.pinimg.com/originals/25/bd/8b/25bd8b7f6e57cdfd17747b25d753b2ce.jpg",
  //     name: "Gigus Chadus II",
  //     email: "canyouhearthesilence@gmail.com",
  //     phone: 11985163548,
  //     description:
  //       "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quidem.",
  //     auth: {
  //       login: "RedPill",
  //       password: "canyouseethedark",
  //     },
  //   },
  // ];

  const productsColumns = [{ field: "id", headerName: "Id", flex: 1 },
    {
      field: "image",
      headerName: "Imagem",
      flex: 1,
      renderCell: (params) => {
        return (
          <div
            style={{
              backgroundImage: `url(${params.value})`,
              backgroundSize: "cover",
              width: 40,
              height: 40,
              borderRadius: "50%",
            }}
          />
        );
      },
    },
    { field: "name", headerName: "Nome", flex: 1 },
    { field: "email", headerName: "E-mail", flex: 1 },
    { field: "phone", headerName: "Telefone", flex: 1 },
    {
      field: "info",
      headerName: "Detalhes",
      flex: 1,
      renderCell: (params) => (
        <div
          onClick={() => {
            setSelectedEmployee(params.value);
            setShowEmployee(true);
          }}
          style={{
            width: 150,
            height: 30,
            backgroundColor: "#009FB7",
            color: "#fff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 5,
            cursor: "pointer",
          }}
        >
          Ver detalhes
        </div>
      ),
    },
  ];

  const productsRows = employees.map((employee, index) => ({
    id: index + 1,
    name: employee.fullName,
    email: employee.email,
    phone: phoneFormating(employee.phone),
    image: employee.photo,
    info: employee,
  }));

  useEffect(() => {
    (async () => {
      const employeeCollection = firebaseDatabase.collection("employees");
      const { ["BringFast.user"]: userLoggedString } = parseCookies(null);
      let userLoggedObj = JSON.parse(userLoggedString);
      let data = await employeeCollection
        .where("company", "==", userLoggedObj._id)
        .get();
      let employeesByCompany = data.docs.map((item) => item.data());
      setEmployees(employeesByCompany);
    })();
  }, []);

  useEffect(() => {
    if (!newProductShow) {
      (async () => {
        const employeeCollection = firebaseDatabase.collection("employees");
        const { ["BringFast.user"]: userLoggedString } = parseCookies(null);
        let userLoggedObj = JSON.parse(userLoggedString);
        let data = await employeeCollection
          .where("company", "==", userLoggedObj?._id)
          .get();
        let emp = data.docs.map((item) => item.data());
        setEmployees(emp);
      })();
    }
  }, [newProductShow]);
  return (
    <>
      <NewEmployee show={newProductShow} setShow={setNewProductShow} />
      <ShowEmployee
        show={showEmployee}
        setShow={setShowEmployee}
        employee={selectedEmployee}
      />
      <div
        style={{
          overflow: "hidden",
          backgroundColor: "#E3F2FD",
          display: "flex",
          flexDirection: "column",
          width: "100vw",
          height: "100vh ",
          alignItems: "center",
        }}
      >
        <Navbar />
        <div
          style={{
            padding: 100,
            width: "100vw",
            height: "100%",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              height: 50,
              marginBottom: 25,
              alignItems: "center",
            }}
          >
            <h2
              style={{
                fontSize: 25,
              }}
            >
              Funcionários:
            </h2>
            <Button
              text="+Adicionar funcionário"
              callback={() => {
                setNewProductShow(true);
              }}
              width={200}
              height={35}
              fontSize={15}
            />
          </div>
          <DataGrid
            style={{
              margin: 0,
              padding: 0,
              width: "100%",
              height: 500,
              backgroundColor: "#fff",
            }}
            rows={productsRows}
            columns={productsColumns}
          />
        </div>
      </div>
    </>
  );
};

export default DashEmployees;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ["BringFast.token"]: token } = parseCookies(ctx);
  if (!token) {
    return {
      redirect: {
        destination: "/Login",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};
