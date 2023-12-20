import React, { useContext, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import dynamic from "next/dynamic";
import CloseIcon from "@mui/icons-material/Close";
const Avatar = dynamic(() => import("react-avatar-edit"), { ssr: false });

import { TextField } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import Button from "./Button";
import { firebaseDatabase } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { parseCookies } from "nookies";
// import { Container } from './styles';

interface Props {
  show: boolean;
  setShow: any;
}

type CategoryData = {
  name: string;
  id: string;
  _id: string;
};

type ProductData = {
  _id: string;
  name: string;
  price: number;
  discount: number;
  image: string;
  category: string;
  description: string;
  created_by: string;
};

const NewProduct: React.FC<Props> = (props: Props) => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const { user } = useContext(AuthContext);
  const [selected, setSelected] = useState("");
  const [productValue, setProductValue] = useState<number | null>();
  const [discount, setDiscount] = useState(0);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState<CategoryData[] | any[]>([]);
  const productCategoryCollection =
    firebaseDatabase.collection("product_category");
  const productCollection = firebaseDatabase.collection("product");
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

  useEffect(() => {
    (async () => {
      const data = await productCategoryCollection.get();
      let productCategories = data.docs.map((item) => item.data());
      setCategories(productCategories);
    })();
  }, []);

  const handleSubmit = async () => {
    //Validar dados do input aqui
    try {
      const { ["BringFast.user"]: userLoggedString } = parseCookies(null);
      let userLoggedObj = JSON.parse(userLoggedString);
      let newDoc = productCollection.doc();

      let payload: ProductData = {
        _id: newDoc.id,
        name,
        price: productValue,
        discount,
        image,
        category: selected,
        description,
        created_by: userLoggedObj._id,
      };
      console.log(payload);
      await newDoc.set(payload);
      setImage(null);
      setPreview(null);
      setSelected("");
      setProductValue(0);
      setDescription("");
      setDiscount(0);
      setName("");
      props.setShow(false);
      window.alert("Produto cadastrado com sucesso!");
    } catch (error) {
      console.log("error");
      console.log(error);
      window.alert(
        "Ocorreu um erro no cadastro do seu produto. Tente novamente!"
      );
    }
  };

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
          <h2>Novo produto</h2>
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
              value={name}
              onChange={(e) => {
                setName(e.target.value.replaceAll(/[^a-zA-Z ]+$/g, ""));
              }}
              style={{ width: "100%", margin: "0 30px" }}
              label="Nome completo"
              variant="standard"
            />
            <TextField
              value={productValue}
              onChange={(e) => {
                console.log(e.target.value);
                if (!isNaN(Number(e.target.value))) {
                  setProductValue(Number(e.target.value.replace(" ", "")));
                } else {
                  return;
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">R$</InputAdornment>
                ),
              }}
              style={{ width: "100%", margin: "0 30px" }}
              label="Preço"
              variant="standard"
            />
          </div>
          <div
            style={{
              width: "100%",
              height: 150,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            <textarea
              placeholder="Descrição"
              style={{
                resize: "none",
                width: "100%",
                height: 100,
                margin: "0 50px",
                padding: 10,
                fontSize: 15,
              }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              label="Categoria"
              variant="standard"
              select
              SelectProps={{
                native: true,
              }}
              value={selected}
              onChange={(e) => {
                if (e.target.value !== "default") {
                  setSelected(e.target.value);
                }
              }}
            >
              <option value="default">Selecione uma categoria</option>
              {categories.map((category) => {
                return (
                  <option style={{ cursor: "pointer" }} value={category._id}>
                    {category.name}
                  </option>
                );
              })}
            </TextField>
            <TextField
              value={discount}
              onChange={(e) => {
                if (
                  !isNaN(Number(e.target.value)) &&
                  Number(e.target.value) <= 100
                ) {
                  setDiscount(Number(e.target.value.replace(".", "")));
                } else {
                  return;
                }
              }}
              style={{ width: "100%", margin: "0 30px" }}
              label="Desconto"
              variant="standard"
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
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
            <Button callback={handleSubmit} text="Confirmar" />
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

export default NewProduct;
