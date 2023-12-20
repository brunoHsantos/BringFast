import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { DataGrid } from "@mui/x-data-grid";
import { idID } from "@mui/material/locale";
import ShowOrder from "../../components/ShowOrder";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { firebaseDatabase } from "../../firebase";

// import { Container } from './styles';

const DashHome: React.FC = () => {
  const [showOrder, setShowOrder] = React.useState(false);
  const [selectedOrder, setSelectedOrder] = React.useState();
  const [orders, setOrders] = React.useState([]);

  useEffect(() => {
    (async () => {
      //Buscar pedidos da empresa
      const ordersCollection = firebaseDatabase.collection("orders");
      const { ["BringFast.user"]: userLoggedString } = parseCookies(null);
      let userLoggedObj = JSON.parse(userLoggedString);
      console.log(userLoggedObj._id);
      let data = await ordersCollection
        .where("company", "==", userLoggedObj._id)
        .get();
      let orderCreatedByUser = data.docs.map((item) => item.data());
      setOrders(orderCreatedByUser);
    })();
  }, []);

  const toReal = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const columns = [
    { field: "id", headerName: "Id", flex: 1 },
    { field: "value", headerName: "Valor", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => {
        if (params.value === 0) {
          return (
            <div
              style={{
                width: 150,
                height: 30,
                backgroundColor: "#009FB7",
                color: "#fff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 5,
              }}
            >
              Finalizado
            </div>
          );
        } else if (params.value === 2) {
          return (
            <div
              style={{
                width: 150,
                height: 30,
                backgroundColor: "#FF0000",
                color: "#fff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 5,
              }}
            >
              Cancelado
            </div>
          );
        } else {
          return (
            <div
              style={{
                width: 150,
                height: 30,
                backgroundColor: "#FFA500",
                color: "#fff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 5,
              }}
            >
              Aberto
            </div>
          );
        }
      },
    },
    {
      field: "info",
      headerName: "Detalhes",
      flex: 1,
      renderCell: (params) => (
        <div
          onClick={() => {
            setSelectedOrder(params.value);
            setShowOrder(true);
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

  const rows = orders.map((order, key) => ({
    id: key + 1,
    _id: order._id,
    employee: order.employee,
    value: toReal(order.value),
    status: order.status,
    info: order,
  }));

  return (
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
      {showOrder && (
        <ShowOrder
          show={showOrder}
          setShow={setShowOrder}
          order={selectedOrder}
        />
      )}

      <div
        style={{
          padding: 100,
          width: "100vw",
          height: "100%",
          overflowY: "auto",
        }}
      >
        <h2
          style={{
            marginBottom: 25,
          }}
        >
          Seus pedidios:
        </h2>
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
        />
      </div>
    </div>
  );
};

export default DashHome;

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
