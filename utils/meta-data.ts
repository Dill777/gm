import { Metadata } from "next";

const meta_data: { [key: string]: Metadata } = {
  home: {
    title: "GM.Cheap - Say GM On-Chain, Earn Rewards & Deploy Smart Contracts",
    description:
      "GM.Cheap is a Web3 engagement platform where users say GM on-chain, earn XP, and climb the on-chain leaderboard across multiple EVM networks. It's also the easiest way to use a smart contract deployment tool without coding, giving anyone access to custom contracts and Web3 utilities. With multi-chain support, GM.Cheap connects communities, projects, and developers in a fun and rewarding way. Users can invite friends to earn referral rewards in crypto, participate in campaigns, and integrate GM into their own dApps. Whether you're a newcomer or a seasoned builder, GM.Cheap turns a simple GM crypto greeting into a gateway to Web3.",
    keywords:
      "GM crypto greeting, Say GM on-chain, Web3 engagement platform, On-chain leaderboard, Smart contract deployment tool, Multi-chain Web3 app, EVM blockchain engagement, Web3 utilities, crypto referral rewards, dApp integration, blockchain communities, custom smart contracts, no-code deployment",
  },
};

export const getMetaData = ({
  title,
  description,
  keywords,
}: {
  title: string;
  description: string;
  keywords: string;
}) => {
  return {
    applicationName: "GM.Cheap",
    title: title,
    description: description,
    keywords: keywords,
    openGraph: {
      type: "website",
      url: "https://cheap.gm/",
      siteName: "GM.Cheap",
      title: title,
      description: description,
      //   images: metaImage,
    },
    twitter: {
      site: "WebSite",
      title: title,
      description: description,
      //   images: metaImage,
    },
  };
};

export const getMetaDataByName = (page: string): Metadata => {
  if (meta_data[page]) {
    return meta_data[page];
  } else {
    return {};
  }
};
