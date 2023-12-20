import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import dynamic from 'next/dynamic';
import CloseIcon from '@mui/icons-material/Close';
const Avatar = dynamic(
    () => import("react-avatar-edit"),
    {ssr: false}
)
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import Button from "./Button";

// import { Container } from './styles';

interface Props {
    show: boolean;
    setShow: any;
    image?: any;
}

const ChangeImage: React.FC<Props> = (props: Props) => {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    useEffect(()=>{
        setImage(props.image)
    },[props.image])

    const imageRead = (e: any) => {
        const reader = new FileReader();
        reader.onload = () => {
                setImage(reader.result);
        }
        reader.readAsDataURL(e[0]);
    }

    const {getRootProps, getInputProps} = useDropzone({
        accept: {
            'image/png': [],
            'image/jpeg': [],
        },
        onDrop: acceptedFiles => imageRead(acceptedFiles),
    });

  return <div style={{
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
  }}>
    <div style={{
        display: "flex",
        flexDirection: "column",
        width: 500,
        height: 550,
        borderRadius: 10,
        backgroundColor: "#fff",
    }}>
        <div style={{
            display: "flex",
            flex: 0.25,
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            padding: "10px 20px",
            backgroundColor: "#2541B2",
            borderRadius: "10px 10px 0 0",
            color: "#fff",
            fontSize: 24,
        }}>
            <p>Alterar imagem</p>
            <CloseIcon 
            onClick={()=>props.setShow(false)}
            style={{
                cursor: "pointer",
                width: 35,
                height: 35,
            }}/>
        </div>
        <div>
        <div 
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",    
                alignItems: "center",
                width: "100%",
                height: 450,
                marginBottom: 20,
                paddingTop: 40,
            }}>
                {image ? <Avatar
                onCrop={(view) => {setPreview(view)} }
                onClose={() => {setImage(null)} }
                width={450} 
                height={270}
                src={image}
                />: <div 
                {...getRootProps()}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 450,
                    height: 270,
                    border: "2px dashed #009FB7",
                    cursor: "pointer",
                }}>
                    <input {...getInputProps()} />
                    <ImageOutlinedIcon style={{
                        width: 100,
                        height: 100,
                        color: "#009FB7",
                    }} />
                    <h2 style={{fontSize: 15, color: "#009FB7"}}>Selecione ou arraste uma imagem</h2>
                </div>}
                <Button text="Confirmar"/>
            </div>
        </div>
    </div>
  </div>;
}

export default ChangeImage;