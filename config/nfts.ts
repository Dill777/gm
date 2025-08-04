import { NETWORKS } from "./chains";

export enum NFTS {
  HONEY = "HONEY",
  CUBE = "CUBE",
  GULID_PIN = "GULID_PIN",
  EYE_SEEKER = "EYE_SEEKER",
}

export interface NFT_TYPE {
  id: string;
  icon: string;
  name: string;
  xp: number;
  link?: string;
}

export const NFT_LIST: NFT_TYPE[] = [
  {
    id: NFTS.HONEY,
    icon: "/img/nft/HoneyLordZNS.jpeg",
    name: "Honey Lords",
    xp: 200,
    link: "https://magiceden.io/collections/berachain/0x67879c4d26c096da0dacfde89306af500fb16144?activeTab=myItems",
  },
  {
    id: NFTS.CUBE,
    icon: "/img/nft/layer3.jpg",
    name: "Layer3 CUBE",
    xp: 10,
    link: "https://app.layer3.xyz/quests/cubes-on-ink",
  },
  {
    id: NFTS.GULID_PIN,
    icon: "/img/nft/ink.jpg",
    name: "Gulid Pin",
    xp: 10,
    link: "#",
  },
  {
    id: NFTS.EYE_SEEKER,
    icon: "/img/nft/EyeSeeker.png",
    name: "Eye of the Seeker",
    xp: 10,
    link: "#",
  },
];
