import React, { useContext, useEffect, useState } from "react";

import Navbar from "../../components/Navbar";
import { DataGrid } from "@mui/x-data-grid";
import { idID } from "@mui/material/locale";
import Button from "../../components/Button";
import NewProduct from "../../components/NewProduct";
import ShowProduct from "../../components/ShowProduct";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { firebaseDatabase } from "../../firebase";
import { AuthContext } from "../../context/AuthContext";

// import { Container } from './styles';

type ProductData = {
  _id: string;
  name: string;
  price: number;
  discount: number;
  image: string;
  category: string;
  description: string;
};

const DashMenu: React.FC = () => {
  const productCollection = firebaseDatabase.collection("product");
  const { user } = useContext(AuthContext);
  const [newProductShow, setNewProductShow] = React.useState(false);
  const [showProduct, setShowProduct] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState();
  const [products, setProducts] = React.useState<ProductData[]>([]);
  const toReal = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const productsColumns = [
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
    {
      field: "info",
      headerName: "Detalhes",
      flex: 1,
      renderCell: (params) => (
        <div
          onClick={() => {
            setSelectedProduct(params.row);
            setShowProduct(true);
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

  const productsRows = products.map((product, index) => ({
    id: index + 1,
    _id: product._id,
    name: product.name,
    image: product.image,
    value: toReal(product.price),
    discount: product.discount + "%",
    categoria: product.category,
    info: product,
  }));

  useEffect(() => {
    (async () => {
      const { ["BringFast.user"]: userLoggedString } = parseCookies(null);
      let userLoggedObj = JSON.parse(userLoggedString);
      let data = await productCollection
        .where("created_by", "==", userLoggedObj?._id)
        .get();
      let prods = data.docs.map((item) => item.data());
      setProducts(prods);
    })();
  }, []);
  useEffect(() => {
    if (!newProductShow) {
      (async () => {
        const { ["BringFast.user"]: userLoggedString } = parseCookies(null);
        let userLoggedObj = JSON.parse(userLoggedString);
        let data = await productCollection
          .where("created_by", "==", userLoggedObj?._id)
          .get();
        let prods = data.docs.map((item) => item.data());
        setProducts(prods);
      })();
    }
  }, [newProductShow]);
  return (
    <>
      <NewProduct show={newProductShow} setShow={setNewProductShow} />
      <ShowProduct
        show={showProduct}
        setShow={setShowProduct}
        product={selectedProduct}
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
              Seu cardápio:
            </h2>
            <Button
              text="+Adicionar produto"
              callback={() => {
                setNewProductShow(true);
              }}
              width={180}
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

export default DashMenu;

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
