import { getSession } from "next-auth/react";
import Head from "next/head";
import Center from "../components/Center";
import Player from "../components/Player";
import SideBar from "../components/SideBar";
import Songs from "../components/Songs";

export default function Home() {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <Head>
        <title>Spotify </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex">
        <SideBar />
        <Center />
      </main>
      <div className="sticky bottom-0">
        <Player />
      </div>

      <footer className="flex items-center justify-center w-full h-24 border-t">
        Powered by{" hgozutok "}
      </footer>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: {
      session,
    },
  };
}
