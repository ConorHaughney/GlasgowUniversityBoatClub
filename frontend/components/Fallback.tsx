'use client';

import Image, { ImageProps } from "next/image";
import { useState } from "react";

type Props = Omit<ImageProps, "src"> & { src?: string; fallbackSrc?: string };

export function ImageWithFallback({ src, alt, fallbackSrc = "/placeholder.png", ...rest }: Props) {
  const initial = typeof src === "string" && src.trim() ? src : (fallbackSrc?.trim() || undefined);
  const [imgSrc, setImgSrc] = useState<string | undefined>(initial);

  if (!imgSrc) return null;

  return (
    <Image
      {...(rest as ImageProps)}
      alt={typeof alt === "string" ? alt : String(alt ?? "")}
      src={imgSrc as string}
      onError={() => {
        if (imgSrc !== fallbackSrc) setImgSrc(fallbackSrc);
      }}
    />
  );
}