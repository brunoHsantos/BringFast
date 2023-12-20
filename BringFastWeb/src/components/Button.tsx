import React from 'react';

interface Props {
    color?: string
    width?: string | number
    height?: string | number
    margin?: string | number
    fontSize?: string | number
    hidden?: boolean
    callback?: any
    text: string
}

const Button: React.FC<Props> = (props: Props) => {
  return <input 
    onClick={props.callback}
    type="button" 
    value={props.text}
    style={{
        display: props.hidden ? "none" : "block",
        backgroundColor: props.color ? props.color : "#2541B2",
        width: props.width ? props.width : 350,
        height: props.height ? props.height : 42,
        margin: props.margin ? props.margin : 0,
        border: 0,
        borderRadius: 7,
        fontSize: props.fontSize ? props.fontSize : 28,
        color: "#fff",
        cursor: "pointer",
    }}
  />;
}

export default Button;