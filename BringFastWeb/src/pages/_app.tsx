import { AuthProvider } from "../context/AuthContext";
import "../style/main.css";
function MyApp({ Component, pageProps }) {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;800&display=swap"
        rel="stylesheet"
      ></link>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </>
  );
}

export default MyApp;
//teste
