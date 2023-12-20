import Router from "next/router";
import { parseCookies, setCookie } from "nookies";
import { createContext, useEffect, useState } from "react";
import { firebaseDatabase } from "../firebase";
import generateJWT from "../utils/generateJWT";
import { comparePassword, hashPassword } from "../utils/hashPassword";

type AuthContextType = {
  signIn: (data: SignInData) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  user: UserType;
};
type SignInData = {
  login: string;
  password: string;
};
type SignUpData = {
  login: string;
  password: string;
};

type UserType = {
  _id: string;
  nickname: string;
  name: string;
  contacts: {
    email: string;
    phone: string;
  };
  login: string;
  company_name: string;
  code: string;
  address: {
    road: string;
    code: string;
    number: string;
    city: string;
  };
  company_code: string;
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }) {
  const [user, setUser] = useState<UserType | null>(null);
  const companyCollection = firebaseDatabase.collection("companies");

  const signIn = async ({ login, password }: SignInData) => {
    let data = await companyCollection.where("login", "==", login).get();
    let user = data.docs.map((item) => item.data())[0];

    if (!user) return window.alert("Nenhum usuário encontrado!");

    if (await comparePassword(password, user.password)) {
      delete user.password;
      console.log(user);
      let token = generateJWT({ _id: user._id });
      let loggedUser: UserType = {
        _id: user._id,
        nickname: user.nickname,
        name: user.name,
        contacts: {
          email: user.contacts.email,
          phone: user.contacts.phone,
        },
        login: user.login,
        company_name: user.company_name,
        code: user.code,
        address: {
          road: user.address.road,
          code: user.address.code,
          number: user.address.number,
          city: user.address.city,
        },
        company_code: user.company_code,
      };
      setUser(loggedUser);
      setCookie(null, "BringFast.token", token, {
        maxAge: 60 * 60 * 24, // 24 horas
      });
      setCookie(null, "BringFast.user", JSON.stringify(loggedUser), {
        maxAge: 60 * 60 * 24, // 24 horas
      });
      Router.push("/DashHome");
    } else {
      return window.alert("Usuário ou senha incorretos. Tente novamente!");
    }
  };
  const signUp = async ({ login, password }: SignUpData) => {
    let companyCollection = firebaseDatabase.collection("companies");
    let data = await companyCollection.where("login", "==", login).get();
    let companies = data.docs.map((item) => item.data());
    if (companies.length)
      return window.alert("Login já registrado. Tente novamente!");
    let newDoc = companyCollection.doc();

    let user = {
      _id: newDoc.id,
      name: localStorage.getItem("name"),
      code: localStorage.getItem("person_code"),
      contacts: {
        email: localStorage.getItem("email"),
        phone: localStorage.getItem("phone"),
      },
      nickname: localStorage.getItem("nickname"),
      company_code: localStorage.getItem("code"),
      company_name: localStorage.getItem("company_name"),
      address: {
        city: localStorage.getItem("city"),
        road: localStorage.getItem("road"),
        number: localStorage.getItem("house_number"),
        code: localStorage.getItem("postal_code"),
      },
      login,
      password: await hashPassword(password),
    };
    await newDoc.set(user);
    signIn({ login, password });
  };

  return (
    <AuthContext.Provider value={{ signIn, signUp, user }}>
      {children}
    </AuthContext.Provider>
  );
}
