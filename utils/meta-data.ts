import { Metadata } from "next";

const meta_data: { [key: string]: Metadata } = {
  "gm-deploy": {
    title: "GM Deploy | CheapGM",
    description:
      "GM Deploy - Your deployment hub for good mornings on CheapGM.",
    keywords: "GM Deploy, Good Morning, Deployment, CheapGM",
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
    applicationName: "CheapGM",
    title: title,
    description: description,
    keywords: keywords,
    openGraph: {
      type: "website",
      url: "https://cheapgm.xyz/",
      siteName: "CheapGM",
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
