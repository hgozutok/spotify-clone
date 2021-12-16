import Head from "next/head";
import SideBar from "../components/SideBar";

export default function Home() {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <Head>
        <title>Spotify </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <SideBar />
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t">
        Powered by{" hgozutok "}
      </footer>
    </div>
  );
}
