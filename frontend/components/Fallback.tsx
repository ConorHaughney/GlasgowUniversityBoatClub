'use client';

import Image, { ImageProps } from "next/image";
import { useState } from "react";

type Props = Omit<ImageProps, "src"> & { src: string; fallbackSrc?: string };

export function ImageWithFallback({ src, fallbackSrc = "/committee/fallback.png", alt, ...rest }: Props) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      {...rest}
      alt={alt}
      src={imgSrc}
      onError={() => setImgSrc(fallbackSrc)}
    />
  );
}