import { Metadata } from "next";

const meta_data: { [key: string]: Metadata } = {
  "gm-deploy": {
    title: "GM Deploy | ZNS Connect",
    description:
      "GM Deploy - Your deployment hub for good mornings on ZNS Connect.",
    keywords: "GM Deploy, Good Morning, Deployment, ZNS Connect",
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
    applicationName: "ZNS Connect Name Service",
    title: title,
    description: description,
    keywords: keywords,
    openGraph: {
      type: "website",
      url: "https://v3.znsconnect.io/",
      siteName: "ZNS Connect",
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
