import { PropaneSharp } from '@mui/icons-material';
import React, {useState, useEffect} from 'react';
import { IMaskInput } from 'react-imask';

interface Props {
    height?: string | number
    width?: string | number
    icon?: JSX.Element
    margin?: string | number
    placeholder?: string
    masked?: boolean
    mask?: string
    error?: boolean
    type?: string
    blur?: any
    value: string
    callback: any
}

const TextInput: React.FC<Props> = (props: Props) => {
  const [icon, setIcon] = useState(<></>);

  useEffect(() => {
    if (props.icon) {
      setIcon(props.icon);
    }
  },[props.icon]);

  return <div style={{
      display: "flex",
      alignItems: "center",
      border: `1px solid ${props.error ? "#ff4d6d" : "#0f0f0f"}`,
      borderRadius: 7,
      height: props.height ? props.height : 42,
      width: props.width ? props.width : 350,
      margin: props.margin ? props.margin : 0
  }}>
      <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          width: "50px",
      }}>
        {icon}
      </div>
      {props.masked 
      ? <IMaskInput
        type={props.type ? props.type : "text"}
        mask={props.mask}
        value={props.value}
        style={{
          outline: 0,
          border: 0,
          flex: 5,
          fontSize: 20,
          height: 30,
        }}
        placeholder={props.placeholder ? props.placeholder : ""}
        onAccept={props.callback}
      />
      : <input 
        value={props.value}
        style={{
          outline: 0,
          border: 0,
          flex: 5,
          fontSize: 20,
          height: 30,
        }} 
        type={props.type ? props.type : "text"}
        placeholder={props.placeholder ? props.placeholder : ""}
        onChange={props.callback}
        onBlur={props.blur}
      />}
  </div>;
}

export default TextInput;