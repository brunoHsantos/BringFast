import React, { useEffect, useState } from "react";

import Navbar from "../../components/Navbar";
import { DataGrid } from "@mui/x-data-grid";
import { idID } from "@mui/material/locale";
import Button from "../../components/Button";
import NewProduct from "../../components/NewProduct";
import ShowProduct from "../../components/ShowProduct";
import SingleInputAlert from "../../components/SingleInputAlert";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { firebaseDatabase } from "../../firebase";

// import { Container } from './styles';

const DashTables: React.FC = () => {
  const [newTableShow, setNewTableShow] = React.useState(false);
  const [tablesToList, setTablesToList] = React.useState([]);

  const toReal = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const columns = [
    {
      field: "id",
      headerName: "Identificador",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
  ];

  const rows = tablesToList.map((table) => ({
    id: table.id,
  }));

  useEffect(() => {
    (async () => {
      const placeCollection = firebaseDatabase.collection("places");
      const { ["BringFast.user"]: userLoggedString } = parseCookies(null);
      let userLoggedObj = JSON.parse(userLoggedString);
      let data = await placeCollection
        .where("created_by", "==", userLoggedObj._id)
        .get();
      let placesCreatedByUser = data.docs.map((item) => item.data());
      setTablesToList(placesCreatedByUser);
    })();
  }, []);
  useEffect(() => {
    if (!newTableShow) {
      (async () => {
        const placeCollection = firebaseDatabase.collection("places");
        const { ["BringFast.user"]: userLoggedString } = parseCookies(null);
        let userLoggedObj = JSON.parse(userLoggedString);
        let data = await placeCollection
          .where("created_by", "==", userLoggedObj?._id)
          .get();
        let places = data.docs.map((item) => item.data());
        setTablesToList(places);
      })();
    }
  }, [newTableShow]);
  return (
    <>
      <SingleInputAlert show={newTableShow} setShow={setNewTableShow} />
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
              Suas mesas:
            </h2>
            <Button
              text="+Adicionar Mesa"
              callback={() => {
                setNewTableShow(true);
              }}
              width={170}
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
            rows={rows}
            columns={columns}
            onRowClick={(e) => console.log(e)}
          />
        </div>
      </div>
    </>
  );
};

export default DashTables;

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
