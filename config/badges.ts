import { Badges } from "@prisma/client";

export enum BadgeStatus {
  "Claimed" = "Claimed",
  "NotAvaliable" = "Not Avaliable",
  "Ready" = "Claim",
}

export type BadgeDataType = {
  amount: number | string | null;
  status: BadgeStatus;
};

export type BadgeConfigType = {
  type: Badges;
  title: string;
  description: string;
  banner: string;
  rule: "follow" | "length" | "domains";
  value: number;
  data?: BadgeDataType;
};

export type BadgeType = BadgeConfigType & {
  data: BadgeDataType;
  size: "md" | "lg";
};

export const getBadgeItem = (type: Badges) => {
  return badges.find((item) => item.type === type);
};

export const getBadgeData = (
  domains: string[],
  followers: number,
  userBadges: Badges[]
) => {
  return badges.map((item) => {
    let data: BadgeDataType = {
      amount: null,
      status: BadgeStatus.NotAvaliable,
    };
    const userEarned = userBadges.includes(item.type);

    if (item.rule === "domains") {
      if (domains.length >= item.value) {
        data = { amount: domains.length, status: BadgeStatus.Ready };
      } else {
        data = { amount: domains.length, status: BadgeStatus.NotAvaliable };
      }
    } else if (item.rule === "follow") {
      if (followers >= item.value) {
        data = { amount: followers, status: BadgeStatus.Ready };
      } else {
        data = { amount: followers, status: BadgeStatus.NotAvaliable };
      }
    } else if (item.rule === "length") {
      if (domains.map((item) => item.length).includes(item.value)) {
        data = { amount: null, status: BadgeStatus.Ready };
      } else {
        data = { amount: null, status: BadgeStatus.NotAvaliable };
      }
    }

    if (userEarned) {
      data.status = BadgeStatus.Claimed;
    }

    return { ...item, data };
  });
};

export const badges: BadgeConfigType[] = [
  {
    type: Badges.Followers100Badge,
    title: "100 followers",
    description: "Connected with 100 Followers",
    banner: "/img/badge/follow-1.png",
    rule: "follow",
    value: 100,
  },
  {
    type: Badges.Followers500Badge,
    title: "500 followers",
    description: "Connected with 500 Followers",
    banner: "/img/badge/follow-2.png",
    rule: "follow",
    value: 500,
  },
  {
    type: Badges.Followers1000Badge,
    title: "1000 followers",
    description: "Connected with 1000 Followers",
    banner: "/img/badge/follow-3.png",
    rule: "follow",
    value: 1000,
  },
  {
    type: Badges.Followers10000Badge,
    title: "10000 followers",
    description: "Connected with 10000 Followers",
    banner: "/img/badge/follow-4.png",
    rule: "follow",
    value: 10000,
  },
  {
    type: Badges.DomainL1Badge,
    title: "1 Letter Domain",
    description: "Owning one 1-letter domain",
    banner: "/img/badge/letter-1.png",
    rule: "length",
    value: 1,
  },
  {
    type: Badges.DomainL2Badge,
    title: "2 Letter Domain",
    description: "Owning one 2-letter domain",
    banner: "/img/badge/letter-2.png",
    rule: "length",
    value: 2,
  },
  {
    type: Badges.DomainL3Badge,
    title: "3 Letter Domain",
    description: "Owning one 3-letter domain",
    banner: "/img/badge/letter-3.png",
    rule: "length",
    value: 3,
  },
  {
    type: Badges.DomainL4Badge,
    title: "4 Letter Domain",
    description: "Owning one 4-letter domain",
    banner: "/img/badge/letter-4.png",
    rule: "length",
    value: 4,
  },
  {
    type: Badges.Domain2Badge,
    title: "2 Domains",
    description: "Own 2 domains on ZNS",
    banner: "/img/badge/domain-1.png",
    rule: "domains",
    value: 2,
  },
  {
    type: Badges.Domain5Badge,
    title: "5 Domains",
    description: "Own 5 domains on ZNS",
    banner: "/img/badge/domain-2.png",
    rule: "domains",
    value: 5,
  },
  {
    type: Badges.Domain20Badge,
    title: "20 Domains",
    description: "Own 20 domains on ZNS",
    banner: "/img/badge/domain-3.png",
    rule: "domains",
    value: 20,
  },
  {
    type: Badges.Domain100Badge,
    title: "100 Domains",
    banner: "/img/badge/domain-4.png",
    rule: "domains",
    value: 100,
    description: "Own 100 domains on ZNS",
  },
];
