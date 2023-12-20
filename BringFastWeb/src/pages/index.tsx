import { GetServerSideProps } from "next";

export default function Home() {
  return <div></div>;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    redirect: {
      destination: "/Login",
      permanent: false,
    },
  };
};
