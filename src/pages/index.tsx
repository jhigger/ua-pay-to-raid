import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import MainPanel from "../components/MainPanel";

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
			<div className="relative h-screen w-screen">
				<Image
					src="/images/bg-1.jpg"
					alt="background"
					fill
					priority
					className="object-cover"
				/>
				<main className="absolute w-full leading-normal tracking-normal text-white">
					<div className="container mx-auto flex h-screen flex-col flex-wrap items-center justify-center py-8 px-4">
						<MainPanel />
					</div>
				</main>
			</div>
		</>
	);
};

export default Home;
