import React, { FC } from "react";
import NextImage, { ImageProps as NextImageProps } from "next/image";

type ImageProps = ComponentProps & NextImageProps & {};

const Image: FC<ImageProps> = ({ ...props }) => {
  return <NextImage {...props} />;
};

export default Image;
