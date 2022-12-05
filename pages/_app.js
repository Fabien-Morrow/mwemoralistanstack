import { useState } from "react";
import { SessionProvider } from "next-auth/react";
import { WagmiConfig, createClient, configureChains, chain } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import {
  getDefaultWallets,
  RainbowKitProvider,
  midnightTheme,
} from "@rainbow-me/rainbowkit";
import { RainbowKitSiweNextAuthProvider } from "@rainbow-me/rainbowkit-siwe-next-auth";
import {
  QueryClient,
  QueryClientProvider,
  Hydrate,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Layout from "../components/Layout";

import "@rainbow-me/rainbowkit/styles.css";
import "../styles/globals.css";

const { chains, provider } = configureChains(
  [chain.goerli],
  [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY })]
);

const { connectors } = getDefaultWallets({
  appName: "Glimmers Of Hope Project",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  provider,
  connectors,
});
export default function App({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <WagmiConfig client={wagmiClient}>
      <SessionProvider session={pageProps.session} refetchInterval={0}>
        <RainbowKitSiweNextAuthProvider>
          <RainbowKitProvider
            chains={chains}
            theme={midnightTheme()}
            modalSize="compact"
          >
            <QueryClientProvider client={queryClient}>
              <Hydrate state={pageProps.dehydratedState}>
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </Hydrate>
              <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
          </RainbowKitProvider>
        </RainbowKitSiweNextAuthProvider>
      </SessionProvider>
    </WagmiConfig>
  );
}
