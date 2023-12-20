import React, {useState} from 'react';
import TextInput from './TextInput';
import PersonIcon from '@mui/icons-material/Person';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import Button from './Button';

// import { Container } from './styles';

interface Props {
  trigger: any
}

const RegisterForm1: React.FC<Props> = (props: Props) => {
  const [name, setName] = useState('');
  const [personCode, setPersonCode] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [personCodeError, setPersonCodeError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);

  const validateEmail = (email) => {
    let validation = /[a-zA-Z0-9]+@[a-zA-Z0-9.-]+\.[a-z]{2,8}(\.[a-z]{2,8})?/;
    if (validation.test(email)) {
      return true;
    } else {
      return false;
    }
  };

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
        value={name}
        callback={(e) => setName(e.target.value)}
        placeholder="Nome completo"
        margin="0 0 30px"
        icon={<PersonIcon style={{
          width: 30,
          height: 30,
        }}/>}
      />
      <TextInput
        value={personCode}
        masked={true}
        mask={"000.000.000-00"}
        callback={(value)=>{
          setPersonCode(value.replace(/[^0-9]/g, ''));
          if(value.replace(/[^0-9]/g, '').length === 11 || value.replace(/[^0-9]/g, '').length === 0){
            setPersonCodeError(false);
          }
          else if(value.replace(/[^0-9]/g, '').length != 0 && value.replace(/[^0-9]/g, '').length < 11){
            setPersonCodeError(true);
          }
        }}
        error={personCodeError}
        placeholder="CPF"
        margin="0 0 30px"
        icon={<BadgeOutlinedIcon style={{
          width: 30,
          height: 30,
        }}/>}
      />
      <TextInput
        value={email}
        callback={(e)=>{
          setEmail(e.target.value);
          if(validateEmail(e.target.value)){
            setEmailError(false);
          }
          else{
            setEmailError(true)
          }
        }}
        error={emailError}
        placeholder="E-mail"
        margin="0 0 30px"
        icon={<MailOutlineIcon style={{
          width: 30,
          height: 30,
        }}/>}
      />
      <TextInput
        value={phone}
        masked={true}
        mask={"(00) 00000-0000"}
        callback={(value)=>{
          setPhone(value.replace(/[^0-9]/g, ''));
          if(value.replace(/[^0-9]/g, '').length === 11 || value.replace(/[^0-9]/g, '').length === 0){
            setPhoneError(false);
          }
          else if(value.replace(/[^0-9]/g, '').length != 0 && value.replace(/[^0-9]/g, '').length < 11){
            setPhoneError(true);
          }
        }}
        error={phoneError}
        placeholder="Celular"
        margin="0 0 30px"
        icon={<PhoneIphoneIcon style={{
          width: 30,
          height: 30,
        }}/>}
      />
    </div>
    <Button text="Avançar" callback={()=>props.trigger(2)}/>
    <Button text="Voltar" color="#009FB7" margin={10}/>
  </>
  )
}

export default RegisterForm1;