import React, { PropsWithChildren } from "react";

import { twMerge } from "tailwind-merge";

import Image from "../image";

// chains
import DogeChain from "/public/img/chains/dogechain.svg";
import NeonEVM from "/public/img/chains/neon-evm.svg";
import Polygon from "/public/img/chains/polygon.svg";
import OKX from "/public/img/chains/okx.svg";
import Tabi from "/public/img/chains/tabi.svg";
import blast from "/public/img/chains/blast.svg";
import scroll from "/public/img/chains/scroll.svg";
import xlayer from "/public/img/chains/xlayer.svg";
import boba from "/public/img/chains/boba.svg";
import Athene from "/public/img/chains/athene.svg";
import Mint from "/public/img/chains/mint.svg";
import Plume from "/public/img/chains/plume.svg";
import Soneium from "/public/img/chains/soneium.svg";
import Sonic from "/public/img/chains/sonic.svg";
import CreatorChain from "/public/img/chains/creatorchain.svg";
import Unichain from "/public/img/chains/unichain.svg";

// partners
import Alltoscan from "/public/img/partners/alltoscan.svg";
import Arthera from "/public/img/partners/arthera.svg";
import Berachain from "/public/img/partners/berachain.svg";
import BNB from "/public/img/partners/bnb.svg";
import Eesee from "/public/img/partners/eesee.svg";
import FoxWallet from "/public/img/partners/fox-wallet.svg";
import GateWeb3 from "/public/img/partners/gate-web3.svg";
import Galxe from "/public/img/partners/galxe.svg";
import Hominids from "/public/img/partners/hominids.svg";
import Hybrid from "/public/img/partners/hybrid.svg";
import Intract from "/public/img/partners/intract.svg";
import KiloEx from "/public/img/partners/kilo-ex.svg";
import Layer3 from "/public/img/partners/layer3.svg";
import Micro3 from "/public/img/partners/micro3.svg";
import Nft2Me from "/public/img/partners/nft2me.svg";
import NftFeed from "/public/img/partners/nft-feed.svg";
import OkxWeb3 from "/public/img/partners/okx-web3.svg";
import OpBnb from "/public/img/partners/opbnb.svg";
import ParisBlockchainWeek from "/public/img/partners/paris-blockchain-week.svg";
import Port3Network from "/public/img/partners/port3-network.svg";
import Rainbow from "/public/img/partners/rainbow.svg";
import StarkFinance from "/public/img/partners/stark-finance.svg";
import Taiko from "/public/img/partners/taiko.svg";
import TokenPocket from "/public/img/partners/token-pocket.svg";
import XDefi from "/public/img/partners/xdefi.svg";

// web3 names
import Blockscout from "/public/img/web3-names/blockscout.svg";
import DmailAI from "/public/img/web3-names/dmail-ai.svg";

import DefiLlama from "/public/img/defillama.svg";
import Debank from "/public/img/debank.svg";

const svgs = {
  // chains
  arthera: Arthera,
  bnb: BNB,
  doge: DogeChain,
  neon: NeonEVM,
  okx: OKX,
  polygon: Polygon,
  tabi: Tabi,
  athene: Athene,
  plume: Plume,
  mint: Mint,
  soneium: Soneium,
  sonic: Sonic,
  creatorchain: CreatorChain,
  unichain: Unichain,
  // partners
  alltoscan: Alltoscan,
  berachain: Berachain,
  eesee: Eesee,
  foxwallet: FoxWallet,
  gateweb3: GateWeb3,
  hominids: Hominids,
  hybrid: Hybrid,
  intract: Intract,
  kiloex: KiloEx,
  layer3: Layer3,
  micro3: Micro3,
  nft2me: Nft2Me,
  nftfeed: NftFeed,
  okxweb3: OkxWeb3,
  opbnb: OpBnb,
  parisblockchainweek: ParisBlockchainWeek,
  port3network: Port3Network,
  rainbow: Rainbow,
  starkfinance: StarkFinance,
  taiko: Taiko,
  tokenpocket: TokenPocket,
  xdefi: XDefi,

  blast: blast,
  scroll: scroll,
  xlayer: xlayer,
  boba: boba,
  blockscout: Blockscout,
  dmailai: DmailAI,
  galxe: Galxe,

  defillama: DefiLlama,
  debank: Debank,
};

export interface ExtraTWClassProps {
  className?: string;
}

export type ComponentProps = PropsWithChildren<ExtraTWClassProps>;

export interface SVGProps extends ComponentProps {
  name: keyof typeof svgs;
  width: number;
  height: number;
}

export default function SVG({ name, width, height, className }: SVGProps) {
  if (!svgs[name]) {
    return null;
  }

  return (
    <Image
      src={svgs[name]}
      alt={name.toString()}
      width={width}
      height={height}
      className={twMerge("", className)}
    />
  );
}
