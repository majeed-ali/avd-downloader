"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

const ADSTERRA_NATIVE_SRC =
  "https://pl30684929.profitableratecpmnetwork.com/4ef3dd7b8121704064301be90d861f05/invoke.js";

const ADSTERRA_NATIVE_CONTAINER_ID =
  "container-4ef3dd7b8121704064301be90d861f05";

export const ADSTERRA_SMARTLINK_URL =
  "https://www.profitableratecpmnetwork.com/p46j2c2n9e?key=62106653e66b16b2dbf15a39c9985ad7";

export const ADSTERRA_BANNER_728X90_SRC =
  "https://www.highrevenueformat.com/e822da9f0846cb978f11b9541b285926/invoke.js";

export const ADSTERRA_BANNER_728X90_KEY =
  "e822da9f0846cb978f11b9541b285926";

type AdBannerProps =
  | {
      type: "placeholder";
      label?: string;
      className?: string;
    }
  | {
      type: "image";
      imageSrc: string;
      imageAlt: string;
      href?: string;
      className?: string;
    }
  | {
      type: "adsterra-native";
      className?: string;
    }
  | {
      type: "adsterra-728x90";
      className?: string;
    }
  | {
      type: "adsterra-banner-728x90";
      className?: string;
    };

function Adsterra728x90Banner() {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = bannerRef.current;
    if (!container) return;

    container.innerHTML = "";

    const confScript = document.createElement("script");
    confScript.type = "text/javascript";
    confScript.text = `atOptions = {
      'key' : '${ADSTERRA_BANNER_728X90_KEY}',
      'format' : 'iframe',
      'height' : 90,
      'width' : 728,
      'params' : {}
    };`;

    const invokeScript = document.createElement("script");
    invokeScript.type = "text/javascript";
    invokeScript.src = ADSTERRA_BANNER_728X90_SRC;

    container.appendChild(confScript);
    container.appendChild(invokeScript);
  }, []);

  return (
    <div
      ref={bannerRef}
      className="mx-auto flex min-h-[90px] w-full max-w-[728px] items-center justify-center overflow-hidden"
    />
  );
}

export function AdBanner(props: AdBannerProps) {
  const containerClassName = [
    "mx-auto flex w-full max-w-5xl items-center justify-center",
    "overflow-hidden rounded-2xl",
    props.className || "",
  ]
    .filter(Boolean)
    .join(" ");

  if (props.type === "image") {
    const banner = (
      <Image
        src={props.imageSrc}
        alt={props.imageAlt}
        width={1200}
        height={250}
        className="h-auto w-full object-cover"
        sizes="(max-width: 1024px) 100vw, 1024px"
      />
    );

    return (
      <aside
        className={containerClassName}
        aria-label="Advertisement"
      >
        {props.href ? (
          <a
            href={props.href}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="block w-full"
          >
            {banner}
          </a>
        ) : (
          banner
        )}
      </aside>
    );
  }

  if (props.type === "adsterra-native") {
    return (
      <aside
        className={containerClassName}
        aria-label="Advertisement"
      >
        <div className="w-full">
          <div className="mb-1 text-center text-[10px] uppercase tracking-widest text-slate-400">
            Advertisement
          </div>

          <div
            id={ADSTERRA_NATIVE_CONTAINER_ID}
            className="min-h-[90px] w-full"
          />

          <script
            async
            data-cfasync="false"
            src={ADSTERRA_NATIVE_SRC}
          />
        </div>
      </aside>
    );
  }

  if (
    props.type === "adsterra-728x90" ||
    props.type === "adsterra-banner-728x90"
  ) {
    return (
      <aside
        className={containerClassName}
        aria-label="Advertisement"
      >
        <div className="w-full">
          <div className="mb-1 text-center text-[10px] uppercase tracking-widest text-slate-400">
            Advertisement
          </div>

          <Adsterra728x90Banner />
        </div>
      </aside>
    );
  }

  if (props.type === "placeholder") {
    return (
      <AdPlaceholder
        className={containerClassName}
        label={props.label}
      />
    );
  }

  return null;
}

function AdPlaceholder({
  className,
  label = "Advertisement space",
}: {
  className: string;
  label?: string;
}) {
  return (
    <aside
      className={`${className} min-h-[120px] border-2 border-dashed border-slate-300 bg-slate-100/70 p-6 dark:border-slate-700 dark:bg-slate-900/50`}
      aria-label="Advertisement placeholder"
    >
      <div className="text-center">
        <div className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          Advertisement
        </div>

        <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {label}
        </div>
      </div>
    </aside>
  );
}