import { type NextPage } from "next";
import Head from "next/head";
import HistoryPanel from "../components/HistoryPanel";
import MainPanel from "../components/MainPanel";
import Navbar from "../components/Navbar";

const Home: NextPage = () => {
	return (
		<>
			<Head>
				<title>Utility APE | Pay To Raid</title>
				<meta
					name="description"
					content="Community, Utility, and Security for the Solana ecosystem through our advanced Discord bots & web3 integrations."
				/>
				<link rel="icon" href="/images/utilityape.png" />
			</Head>
			<div className="min-h-screen bg-[url('/images/bg-1.jpg')] bg-cover bg-center bg-no-repeat">
				<main className="w-full leading-normal tracking-normal text-white">
					<Navbar />
					<div className="container mx-auto flex min-h-screen flex-col flex-wrap items-center justify-center gap-8 py-8 px-4">
						<MainPanel />
						<HistoryPanel />
					</div>
				</main>
			</div>
		</>
	);
};

export default Home;
