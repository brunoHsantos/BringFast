import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { TextField } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid } from "@mui/x-data-grid";
import { firebaseDatabase } from "../firebase";
import { parseCookies } from "nookies";

// import { Container } from './styles';

interface Props {
  show: boolean;
  setShow: any;
  order: any;
}

const ShowProduct: React.FC<Props> = (props: Props) => {
  const [edit, setEdit] = useState(false);
  const [employee, setEmployee] = useState<any>({});
  const [products, setProducts] = useState<any>([]);
  const [places, setPlaces] = useState<any>({});

  useEffect(() => {
    (async () => {
      //Buscar funcionario
      const employeesCollections = firebaseDatabase.collection("employees");
      const productCollections = firebaseDatabase.collection("product");
      const placesCollections = firebaseDatabase.collection("places");
      let employeeSnap = await employeesCollections
        .doc(props.order.employee)
        .get();
      let placesSnap = await placesCollections.doc(props.order.place).get();
      let prodsArray = [];
      for (let prod of props.order.products) {
        let prodSnap = await productCollections.doc(prod).get();
        prodsArray.push(prodSnap.data());
      }
      setPlaces(placesSnap.data());
      setProducts(prodsArray);
      setEmployee(employeeSnap.data());
    })();
  }, []);

  const toReal = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const handleStatus = (statusnum: number) => {
    let status = {
      name: "",
      color: "",
    };

    switch (statusnum) {
      case 0:
        status = {
          name: "Finalizado",
          color: "#009FB7",
        };
        break;
      case 1:
        status = {
          name: "Aberto",
          color: "#FFA500",
        };
        break;
    }

    return status;
  };

  const columns = [
    { field: "id", headerName: "Id", flex: 1 },
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
    { field: "value", headerName: "Preço", flex: 1 },
    { field: "discount", headerName: "Desconto", flex: 1 },
  ];

  const rows = products.map((order, key) => ({
    id: key + 1,
    _id: order._id,
    name: order.name,
    image: order.image,
    value: toReal(order.price),
    discount: order.discount + "%",
    info: order,
  }));

  return (
    <>
      <style jsx>
        {`
          .body-container {
            width: 100%;
            height: 100%;
          }

          .main-container {
            display: flex;
            width: 100%;
            min-height: 400px;
            padding: 0 50px 30px;
            overflow: auto;
          }

          .left-main {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }

          @media (min-width: 650px) {
            .body-container {
              overflow-y: hidden;
            }

            .left-main {
              flex: 1;
              font-size: 24px;
            }
          }

          @media (max-width: 650px) {
            .body-container {
              overflow-y: auto;
            }

            .main-container {
              flex-direction: column;
              height: 100%;
            }

            .left-main {
              flex: 0.5;
              font-size: 16px;
            }

            .product-table {
              margin-top: 50px;
            }
          }
        `}
      </style>
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
          overflowY: "hidden",
        }}
      >
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
          <p>Detalhes do pedido</p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-evenly",
              height: "100%",
            }}
          >
            <CloseIcon
              onClick={() => props.setShow(false)}
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
        <div className="body-container">
          <div
            style={{
              display: "flex",
              width: "100%",
              height: 80,
              margin: "50px 0",
              padding: "0 50px",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: 24,
            }}
          >
            <h2>Informações básicas:</h2>
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <p style={{ marginRight: 10 }}>Status: </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: 16,
                  height: 35,
                  padding: "0 20px",
                  borderRadius: 5,
                  color: "#fff",
                  backgroundColor: handleStatus(props.order.status).color,
                }}
              >
                <p>{handleStatus(props.order.status).name}</p>
              </div>
            </div>
          </div>
          <div className="main-container">
            <div className="left-main">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    boxSizing: "border-box",
                    marginBottom: 50,
                  }}
                >
                  <p style={{ marginRight: 10 }}>Funcionário:</p>
                  <p style={{ marginRight: 10 }}>{employee?.fullName}</p>
                </div>
                <div
                  style={{
                    display: "flex",
                    boxSizing: "border-box",
                    marginBottom: 50,
                  }}
                >
                  <p style={{ marginRight: 10 }}>Mesa:</p>
                  <p style={{ marginRight: 10 }}>{places.id}</p>
                </div>
                <div
                  style={{
                    display: "flex",
                    boxSizing: "border-box",
                    marginBottom: 50,
                  }}
                >
                  <p style={{ marginRight: 10 }}>Cliente:</p>
                  <p style={{ marginRight: 10 }}>
                    {props.order.client ? props.order.client : "Anônimo"}
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    boxSizing: "border-box",
                    marginBottom: 50,
                  }}
                >
                  <p style={{ marginRight: 10 }}>Data:</p>
                  <p style={{ marginRight: 10 }}>
                    {new Date(props.order.initial_date).toLocaleDateString()}
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    boxSizing: "border-box",
                    marginBottom: 50,
                  }}
                >
                  <p style={{ marginRight: 10 }}>Horário:</p>
                  <p style={{ marginRight: 10 }}>
                    {new Date(props.order.initial_date).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  boxSizing: "border-box",
                  marginBottom: 10,
                }}
              >
                <h2 style={{ marginRight: 10 }}>Valor total:</h2>
                <h2 style={{ marginRight: 10 }}>{toReal(props.order.value)}</h2>
              </div>
            </div>
            <div
              className="product-table"
              style={{
                boxSizing: "border-box",
                display: "flex",
                flex: 1,
              }}
            >
              <DataGrid
                style={{
                  margin: 0,
                  padding: 0,
                  width: "80%",
                  height: "100%",
                  backgroundColor: "#fff",
                }}
                columns={columns}
                rows={rows}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShowProduct;
