import React, { useState } from 'react';
import TextInput from './TextInput';
import PersonIcon from '@mui/icons-material/Person';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';

const RegisterForm2: React.FC = () => {
  const [code, setCode] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [nickname, setNickname] = useState('')
  const [codeError, setCodeError] = useState(false)

  return (
    <>
       <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            height: 370,
        }}>
        <p style={{
            fontSize: 24,
            margin: "10px 0 20px"
            }}>Dados da empresa</p>
        <TextInput 
            value={code}
            masked={true}
            mask={"00.000.000/0000-00"}
            callback={(value) => {
                setCode(value.replace(/[^0-9]/g, ''))
                if(value.replace(/[^0-9]/g, '').length === 14 || value.replace(/[^0-9]/g, '').length === 0){
                    setCodeError(false);
                }
                else if(value.replace(/[^0-9]/g, '').length != 0 && value.replace(/[^0-9]/g, '').length < 14){
                    setCodeError(true);
                }
            }}
            placeholder="CNPJ"
            margin="0 0 30px"
            icon={<BadgeOutlinedIcon style={{
            width: 30,
            height: 30,
            }}/>}
        />
        <TextInput
            value={companyName}
            callback={(e)=>setCompanyName(e.target.value)}
            error={codeError}
            placeholder="Razão social"
            margin="0 0 30px"
            icon={<BadgeOutlinedIcon style={{
            width: 30,
            height: 30,
            }}/>}
        />
        <TextInput
            value={nickname}
            callback={(e)=>{setNickname(e.target.value)}}
            placeholder="Nome fantasia"
            margin="0 0 30px"
            icon={<PersonIcon style={{
            width: 30,
            height: 30,
            }}/>}
        />
        </div>
    </>
  );
}

export default RegisterForm2;