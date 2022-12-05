import { QueryClient, useQuery, dehydrate } from "@tanstack/react-query";
import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/evm-utils";

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

const queryClient = new QueryClient();
const STALE_TIME = 10000;

export async function getServerSideProps(context) {
  await queryClient.prefetchQuery(["getOwners"], getOwners, {
    staleTime: STALE_TIME,
  });
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export default function Home() {
  const { data: rawOwners } = useQuery(["getOwners"], getOwners, {
    staleTime: STALE_TIME,
  });
  console.log(rawOwners);
  return <div>hello world</div>;
}
