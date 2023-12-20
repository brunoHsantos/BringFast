import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { TextField } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import EditIcon from "@mui/icons-material/Edit";
import ChangeImage from "./ChangeImage";

// import { Container } from './styles';

interface Props {
  show: boolean;
  setShow: any;
  product: any;
}

const ShowProduct: React.FC<Props> = (props: Props) => {
  const [showChangeImage, setShowChangeImage] = React.useState(false);
  const [edit, setEdit] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState({
    id: 0,
    image: "",
    name: "",
    value: 0,
    details: {
      description: "",
      discount: 0,
      category: "",
    },
  });

  const categories = [
    {
      id: "1",
      name: "Lanches",
    },
    {
      id: "2",
      name: "Bebidas",
    },
  ];

  useEffect(() => {
    let prod = props.product;

    if (prod) {
      setSelectedProduct({
        id: prod.id,
        image: prod.image,
        name: prod.name,
        value: Number(prod.value.split("R$")[1].replace(",", ".")),
        details: {
          description: prod.info.description,
          discount: prod.info.discount,
          category: prod.info.category,
        },
      });
    }
  }, [props.product]);

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
        <p>Seu produto</p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-evenly",
            height: "100%",
          }}
        >
          {/* {
          edit ? <EditIcon
            style={{
              width: 35,
              height: 35,
              cursor: "pointer"
            }}
            onClick={()=>setEdit(!edit)}
          /> : <EditOutlinedIcon
            style={{
              width: 35,
              height: 35,
              cursor: "pointer"
            }}
            onClick={()=>setEdit(!edit)}
          />
        } */}
          <CloseIcon
            onClick={() => {
              setEdit(false);
              props.setShow(false);
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
              backgroundImage: selectedProduct.image
                ? `url(${selectedProduct.image})`
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
                value={selectedProduct.name}
                onChange={(e) => {
                  setSelectedProduct((old) => ({
                    ...old,
                    name: e.target.value.replaceAll(/[^a-zA-Z ]+$/g, ""),
                  }));
                }}
                label="Nome do produto"
                variant="standard"
                style={{ width: "100%", marginRight: 50 }}
              />
              <TextField
                disabled={!edit}
                value={selectedProduct.value}
                onChange={(e) => {
                  console.log(e.target.value);
                  if (!isNaN(Number(e.target.value))) {
                    setSelectedProduct((old) => ({
                      ...old,
                      value: e.target.value.replace(" ", ""),
                    }));
                  } else {
                    return;
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">R$</InputAdornment>
                  ),
                }}
                style={{ width: "100%" }}
                label="Preço"
                variant="standard"
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
                select
                value={selectedProduct.details.category}
                onChange={(e) => {
                  setSelectedProduct((old) => ({
                    ...old,
                    details: {
                      ...old.details,
                      category: e.target.value,
                    },
                  }));
                }}
                label="Categoria"
                variant="standard"
                style={{ width: "100%", marginRight: 50 }}
                SelectProps={{
                  native: true,
                }}
              >
                {categories.map((category) => {
                  return (
                    <option style={{ cursor: "pointer" }} value={category.name}>
                      {category.name}
                    </option>
                  );
                })}
              </TextField>
              <TextField
                disabled={!edit}
                value={selectedProduct.details.discount}
                onChange={(e) => {
                  if (
                    !isNaN(Number(e.target.value)) &&
                    Number(e.target.value) <= 100
                  ) {
                    setSelectedProduct((old) => ({
                      ...old,
                      details: {
                        ...old.details,
                        discount: Number(e.target.value),
                      },
                    }));
                  } else {
                    return;
                  }
                }}
                style={{ width: "100%" }}
                label="Desconto"
                variant="standard"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
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
        >
          <textarea
            disabled={!edit}
            value={selectedProduct.details.description}
            onChange={(e) =>
              setSelectedProduct((old) => ({
                ...old,
                details: {
                  ...old.details,
                  description: e.target.value,
                },
              }))
            }
            style={{
              width: "90%",
              margin: 20,
              height: 170,
              resize: "none",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ShowProduct;
