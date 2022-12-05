import { QueryClient, useQuery, dehydrate } from "@tanstack/react-query";
import { GLIMMERS_OPENSEA_BASE_API } from "../constants";
import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/evm-utils";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const chain = EvmChain.GOERLI;

async function getOwners() {
  await Moralis.start({ apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY });
  const response = await Moralis.EvmApi.nft.getNFTOwners({
    address: "0xFD40F65401088fD4c3Db1b42d8cc0CCaAd90274f",
    chain,
  });
  const json = JSON.stringify(response);
  console.log("getOwners : ", json);
  return json;
}

async function getStats() {
  const options = { method: "GET", headers: { accept: "application/json" } };
  const res = await fetch(GLIMMERS_OPENSEA_BASE_API + "stats", options);
  const result = await res.json();
  return result.stats;
}

async function getBAYCStats() {
  const options = { method: "GET", headers: { accept: "application/json" } };
  const res = await fetch(
    "https://api.opensea.io/api/v1/collection/boredapeyachtclub/stats",
    options
  );
  const result = await res.json();
  return result.stats;
}

const queryClient = new QueryClient();
const STALE_TIME = 10000;

export async function getServerSideProps(context) {
  await queryClient.prefetchQuery(["getStats"], getStats, {
    staleTime: STALE_TIME,
  });
  await queryClient.prefetchQuery(["getBAYCStats"], getBAYCStats, {
    staleTime: STALE_TIME,
  });
  await queryClient.prefetchQuery(["getOwners"], getOwners, {
    staleTime: STALE_TIME,
  });
  console.log(queryClient);
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export default function Home() {
  const { data: stats } = useQuery(["getStats"], getStats, {
    staleTime: STALE_TIME,
  });
  const { data: BAYCStats } = useQuery(["getBAYCStats"], getBAYCStats, {
    staleTime: STALE_TIME,
  });
  const { data: rawOwners } = useQuery(["getOwners"], getOwners, {
    staleTime: STALE_TIME,
  });
  console.log(rawOwners, BAYCStats, stats);
  return (
    <div>
      <ConnectButton />
    </div>
  );
}
