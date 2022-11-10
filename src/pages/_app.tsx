import { type AppType } from "next/dist/shared/lib/utils";
import dynamic from "next/dynamic";

import "../styles/globals.css";

require("@solana/wallet-adapter-react-ui/styles.css");

const WalletConnectionProvider = dynamic(
	() => import("../providers/WalletConnectionProvider"),
	{
		ssr: false,
	}
);

const MyApp: AppType = ({ Component, pageProps }) => {
	return (
		<WalletConnectionProvider>
			<Component {...pageProps} />
		</WalletConnectionProvider>
	);
};

export default MyApp;
