"use client";

import { Suspense, lazy } from "react";
import {
  ArrowRight,
  Archive,
  BookOpen,
  Check,
  ChevronRight,
  Clock,
  Lightbulb,
  MapPin,
  Sparkles,
  TicketPercent,
  Zap,
  PackageCheck,
  Coins,
  Unlock,
  MousePointerClick,
} from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
// import { SidebarAd } from "@/components/ads/SidebarAd";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";
import type { ModuleLinkMap } from "@/lib/buildModuleLinkMap";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

// Conditionally render text as a link or plain span
function LinkedTitle({
  linkData,
  children,
  className,
  locale,
}: {
  linkData: { url: string; title: string } | null | undefined;
  children: React.ReactNode;
  className?: string;
  locale: string;
}) {
  if (linkData) {
    const href = locale === "en" ? linkData.url : `/${locale}${linkData.url}`;
    return (
      <Link
        href={href}
        className={`${className || ""} hover:text-[hsl(var(--nav-theme-light))] hover:underline decoration-[hsl(var(--nav-theme-light))/0.4] underline-offset-4 transition-colors`}
        title={linkData.title}
      >
        {children}
      </Link>
    );
  }
  return <>{children}</>;
}

// Module eyebrow badge (small labeled pill above each module heading)
function ModuleEyebrow({ icon, text }: { icon: string; text: string }) {
  return (
    <div
      className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-4
                    bg-[hsl(var(--nav-theme)/0.1)]
                    border border-[hsl(var(--nav-theme)/0.3)]"
    >
      <DynamicIcon
        name={icon}
        className="h-4 w-4 text-[hsl(var(--nav-theme-light))]"
      />
      <span className="text-xs font-medium uppercase tracking-wide md:text-sm">
        {text}
      </span>
    </div>
  );
}

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  moduleLinkMap: ModuleLinkMap;
  locale: string;
}

export default function HomePageClient({
  latestArticles,
  moduleLinkMap,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.brasshellwiki.wiki";

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "BRASS HELL Wiki",
        description:
          "Complete BRASS HELL Wiki covering beginner guides, ammo crafting, factory upgrades, shipments, mastery, hidden documents, game passes, and updates for the Roblox incremental factory simulator.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1600,
          height: 900,
          caption: "BRASS HELL - Roblox Incremental Factory Simulator",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "BRASS HELL Wiki",
        alternateName: "BRASS HELL Wiki",
        url: siteUrl,
        description:
          "Unofficial BRASS HELL Wiki resource hub for beginner guides, ammo crafting, factory upgrades, shipments, mastery, and hidden documents",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1600,
          height: 900,
          caption: "BRASS HELL Wiki - Roblox Incremental Factory Simulator",
        },
        sameAs: [
          "https://www.roblox.com/games/104347694974983",
          "https://www.youtube.com/results?search_query=BRASS+HELL+Roblox",
        ],
      },
      {
        "@type": "VideoGame",
        name: "BRASS HELL",
        gamePlatform: ["PC", "Roblox", "Mobile"],
        applicationCategory: "Game",
        genre: ["Incremental", "Simulation", "Factory", "Co-op"],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 4,
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: "https://www.roblox.com/games/104347694974983",
        },
      },
      {
        "@type": "VideoObject",
        name: "Running A Bullet Factory Kind Of... Sucks (Brass Hell - Roblox)",
        description:
          "BRASS HELL gameplay video featuring ammo crafting, crate packing and factory shifts in the snowbound Roblox incremental simulator.",
        uploadDate: "2026-10-29",
        thumbnailUrl: "https://i.ytimg.com/vi/sOucCOzK52Q/hqdefault.jpg",
        embedUrl: "https://www.youtube.com/embed/sOucCOzK52Q",
        url: "https://www.youtube.com/watch?v=sOucCOzK52Q",
      },
    ],
  };

  // Codes module card icons (one distinct icon per card)
  const codeCardIcons = [TicketPercent, Clock, Archive];
  // Upgrade tier icons (one distinct icon per tier card)
  const tierIcons = [Zap, PackageCheck, Coins, Unlock, MousePointerClick];

  const mobileBannerAd = getPreferredMobileBannerSelection();

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-6"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-[1.05]">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <button
                onClick={() => scrollToSection("beginner-guide")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://www.roblox.com/games/104347694974983"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-base md:text-lg transition-colors"
              >
                {t.hero.playOnRobloxCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* Video Section */}
      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="sOucCOzK52Q"
              title="Running A Bullet Factory Kind Of... Sucks (Brass Hell - Roblox)"
            />
          </div>
        </div>
      </section>

      {/* Tools Grid - 8 Navigation Cards */}
      <section className="px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
            {t.tools.cards.map((card: any, index: number) => {
              // 映射卡片索引到 section ID（与下文 8 个模块锚点一一对应）
              const sectionIds = [
                "beginner-guide",
                "codes",
                "best-upgrades",
                "calibers-bullets",
                "crafting-shipment",
                "rank-mastery",
                "documents-secrets",
                "updates-events",
              ];
              const sectionId = sectionIds[index];

              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(sectionId)}
                  className="scroll-reveal group rounded-xl border border-border p-4 md:p-6
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12
                                  bg-[hsl(var(--nav-theme)/0.1)]
                                  flex items-center justify-center
                                  group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                  transition-colors"
                  >
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm md:text-base font-semibold">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest Updates Section (紧跟 Tools Grid 之下) */}
      <LatestGuidesAccordion
        articles={latestArticles}
        locale={locale}
        max={12}
      />

      {/* 广告位 2: 首屏内容之后再加载广告 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端优先使用方形，桌面端保留横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Module 1: Beginner Guide */}
      <section id="beginner-guide" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <ModuleEyebrow icon="BookOpen" text="Getting Started" />
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              <LinkedTitle
                linkData={moduleLinkMap["brassHellBeginnerGuide"]}
                locale={locale}
              >
                {t.modules.brassHellBeginnerGuide.title}
              </LinkedTitle>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.brassHellBeginnerGuide.intro}
            </p>
          </div>

          {/* Steps */}
          <div className="scroll-reveal space-y-3 md:space-y-4 mb-8 md:mb-10">
            {t.modules.brassHellBeginnerGuide.steps.map(
              (step: any, index: number) => (
                <div
                  key={index}
                  className="flex gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                    <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                      <LinkedTitle
                        linkData={
                          moduleLinkMap[
                            `brassHellBeginnerGuide::steps::${index}`
                          ]
                        }
                        locale={locale}
                      >
                        {step.title}
                      </LinkedTitle>
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>

          {/* Quick Tips */}
          <div className="scroll-reveal p-4 md:p-6 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <Lightbulb className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <h3 className="font-bold text-base md:text-lg">Quick Tips</h3>
            </div>
            <ul className="space-y-2">
              {t.modules.brassHellBeginnerGuide.quickTips.map(
                (tip: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground text-sm">{tip}</span>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </section>

      {/* 广告位 4: 第一模块之后的阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 2: Codes */}
      <section
        id="codes"
        className="scroll-mt-24 px-4 py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <ModuleEyebrow icon="Ticket" text="Codes" />
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              <LinkedTitle
                linkData={moduleLinkMap["brassHellCodes"]}
                locale={locale}
              >
                {t.modules.brassHellCodes.title}
              </LinkedTitle>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.brassHellCodes.intro}
            </p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-3 gap-4">
            {t.modules.brassHellCodes.items.map(
              (item: any, index: number) => {
                const CardIcon = codeCardIcons[index] ?? TicketPercent;
                return (
                  <div
                    key={index}
                    className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--nav-theme)/0.1)]">
                        <CardIcon className="h-5 w-5 text-[hsl(var(--nav-theme-light))]" />
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] font-medium">
                        {item.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg mb-2">
                      <LinkedTitle
                        linkData={
                          moduleLinkMap[`brassHellCodes::items::${index}`]
                        }
                        locale={locale}
                      >
                        {item.title}
                      </LinkedTitle>
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {item.description}
                    </p>
                  </div>
                );
              },
            )}
          </div>
          <div className="scroll-reveal mt-6 flex items-start gap-3 p-4 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <Lightbulb className="w-5 h-5 text-[hsl(var(--nav-theme-light))] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              {t.modules.brassHellCodes.tip}
            </p>
          </div>
        </div>
      </section>

      {/* Module 3: Best Upgrades */}
      <section id="best-upgrades" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <ModuleEyebrow icon="Factory" text="Workshop Upgrades" />
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              <LinkedTitle
                linkData={moduleLinkMap["brassHellBestUpgrades"]}
                locale={locale}
              >
                {t.modules.brassHellBestUpgrades.title}
              </LinkedTitle>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.brassHellBestUpgrades.intro}
            </p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.modules.brassHellBestUpgrades.tiers.map(
              (tier: any, index: number) => {
                const TierIcon = tierIcons[index] ?? Zap;
                const badgeClass =
                  tier.tier === "S"
                    ? "bg-[hsl(var(--nav-theme))] text-white"
                    : tier.tier === "A"
                      ? "bg-[hsl(var(--nav-theme)/0.25)] text-[hsl(var(--nav-theme-light))]"
                      : "bg-[hsl(var(--nav-theme)/0.1)] text-muted-foreground";
                return (
                  <div
                    key={index}
                    className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-lg font-bold text-base ${badgeClass}`}
                      >
                        {tier.tier}
                      </span>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-[hsl(var(--nav-theme-light))]">
                          {tier.label}
                        </p>
                        <h3 className="font-bold">
                          <LinkedTitle
                            linkData={
                              moduleLinkMap[
                                `brassHellBestUpgrades::tiers::${index}`
                              ]
                            }
                            locale={locale}
                          >
                            {tier.name}
                          </LinkedTitle>
                        </h3>
                      </div>
                      <TierIcon className="w-5 h-5 text-[hsl(var(--nav-theme-light))] ml-auto" />
                    </div>
                    <p className="text-muted-foreground text-sm mb-3">
                      {tier.description}
                    </p>
                    <div className="space-y-1.5 text-xs">
                      <p className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">
                          {tier.recommendedFor}
                        </span>
                      </p>
                      <p className="flex items-start gap-2">
                        <ChevronRight className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">
                          {tier.benefit}
                        </span>
                      </p>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </div>
      </section>

      {/* Module 4: Calibers & Bullets */}
      <section
        id="calibers-bullets"
        className="scroll-mt-24 px-4 py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <ModuleEyebrow icon="Crosshair" text="Ammunition" />
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              <LinkedTitle
                linkData={moduleLinkMap["brassHellCalibersBullets"]}
                locale={locale}
              >
                {t.modules.brassHellCalibersBullets.title}
              </LinkedTitle>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.brassHellCalibersBullets.intro}
            </p>
          </div>
          <div className="scroll-reveal overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-[hsl(var(--nav-theme)/0.1)]">
                  <th className="px-4 py-3 font-semibold">
                    {t.modules.brassHellCalibersBullets.tableHeaders.caliber}
                  </th>
                  <th className="px-4 py-3 font-semibold">
                    {t.modules.brassHellCalibersBullets.tableHeaders.stage}
                  </th>
                  <th className="px-4 py-3 font-semibold">
                    {t.modules.brassHellCalibersBullets.tableHeaders.value}
                  </th>
                  <th className="px-4 py-3 font-semibold">
                    {t.modules.brassHellCalibersBullets.tableHeaders.bestFor}
                  </th>
                  <th className="px-4 py-3 font-semibold">
                    {t.modules.brassHellCalibersBullets.tableHeaders.tip}
                  </th>
                </tr>
              </thead>
              <tbody>
                {t.modules.brassHellCalibersBullets.rows.map(
                  (row: any, index: number) => (
                    <tr
                      key={index}
                      className="border-b border-border last:border-b-0 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <LinkedTitle
                          linkData={
                            moduleLinkMap[
                              `brassHellCalibersBullets::rows::${index}`
                            ]
                          }
                          locale={locale}
                        >
                          <span className="flex items-center gap-2 font-semibold">
                            <DynamicIcon
                              name={row.icon}
                              className="h-4 w-4 text-[hsl(var(--nav-theme-light))] flex-shrink-0"
                            />
                            {row.caliber}
                          </span>
                        </LinkedTitle>
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">
                        {row.stage}
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] whitespace-nowrap">
                          {row.value}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">
                        {row.bestFor}
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">
                        {row.tip}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Module 5: Crafting & Shipment */}
      <section id="crafting-shipment" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <ModuleEyebrow icon="Package" text="Factory Operations" />
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              <LinkedTitle
                linkData={moduleLinkMap["brassHellCraftingShipment"]}
                locale={locale}
              >
                {t.modules.brassHellCraftingShipment.title}
              </LinkedTitle>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.brassHellCraftingShipment.intro}
            </p>
          </div>
          <div className="scroll-reveal space-y-3 md:space-y-4">
            {t.modules.brassHellCraftingShipment.steps.map(
              (step: any, index: number) => (
                <div
                  key={index}
                  className="p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex gap-3 md:gap-4">
                    <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                      <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                        <LinkedTitle
                          linkData={
                            moduleLinkMap[
                              `brassHellCraftingShipment::steps::${index}`
                            ]
                          }
                          locale={locale}
                        >
                          {step.title}
                        </LinkedTitle>
                      </h3>
                      <p className="text-sm md:text-base text-muted-foreground mb-3">
                        {step.description}
                      </p>
                      <div className="flex items-start gap-2 text-sm">
                        <Lightbulb className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                        <span className="text-[hsl(var(--nav-theme-light))]">
                          {step.tip}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 6: Rank & Mastery */}
      <section
        id="rank-mastery"
        className="scroll-mt-24 px-4 py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <ModuleEyebrow icon="TrendingUp" text="Progression Systems" />
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              <LinkedTitle
                linkData={moduleLinkMap["brassHellRankMastery"]}
                locale={locale}
              >
                {t.modules.brassHellRankMastery.title}
              </LinkedTitle>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.brassHellRankMastery.intro}
            </p>
          </div>
          <div className="scroll-reveal overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-[hsl(var(--nav-theme)/0.1)]">
                  <th className="px-4 py-3 font-semibold">
                    {t.modules.brassHellRankMastery.tableHeaders.system}
                  </th>
                  <th className="px-4 py-3 font-semibold">
                    {t.modules.brassHellRankMastery.tableHeaders.purpose}
                  </th>
                  <th className="px-4 py-3 font-semibold">
                    {t.modules.brassHellRankMastery.tableHeaders.how}
                  </th>
                  <th className="px-4 py-3 font-semibold">
                    {t.modules.brassHellRankMastery.tableHeaders.pass}
                  </th>
                </tr>
              </thead>
              <tbody>
                {t.modules.brassHellRankMastery.systems.map(
                  (sys: any, index: number) => (
                    <tr
                      key={index}
                      className="border-b border-border last:border-b-0 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <LinkedTitle
                          linkData={
                            moduleLinkMap[
                              `brassHellRankMastery::systems::${index}`
                            ]
                          }
                          locale={locale}
                        >
                          <span className="flex items-center gap-2 font-semibold whitespace-nowrap">
                            <DynamicIcon
                              name={sys.icon}
                              className="h-4 w-4 text-[hsl(var(--nav-theme-light))] flex-shrink-0"
                            />
                            {sys.name}
                          </span>
                        </LinkedTitle>
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">
                        {sys.purpose}
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">
                        {sys.how}
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">
                        {sys.pass}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Module 7: Documents & Secrets */}
      <section id="documents-secrets" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <ModuleEyebrow icon="FileSearch" text="Exploration & Lore" />
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              <LinkedTitle
                linkData={moduleLinkMap["brassHellDocumentsSecrets"]}
                locale={locale}
              >
                {t.modules.brassHellDocumentsSecrets.title}
              </LinkedTitle>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.brassHellDocumentsSecrets.intro}
            </p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.brassHellDocumentsSecrets.cards.map(
              (card: any, index: number) => (
                <div
                  key={index}
                  className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--nav-theme)/0.1)]">
                      <DynamicIcon
                        name={card.icon}
                        className="h-5 w-5 text-[hsl(var(--nav-theme-light))]"
                      />
                    </span>
                    <div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] font-medium">
                        {card.zone}
                      </span>
                      <h3 className="font-bold mt-1">
                        <LinkedTitle
                          linkData={
                            moduleLinkMap[
                              `brassHellDocumentsSecrets::cards::${index}`
                            ]
                          }
                          locale={locale}
                        >
                          {card.title}
                        </LinkedTitle>
                      </h3>
                    </div>
                  </div>
                  <p className="flex items-start gap-2 text-sm text-muted-foreground mb-3">
                    <MapPin className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                    {card.location}
                  </p>
                  <ul className="space-y-1.5 mb-3">
                    {card.clues.map((clue: string, ci: number) => (
                      <li
                        key={ci}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <ChevronRight className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                        {clue}
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm border-t border-border pt-3 text-muted-foreground">
                    {card.storyRole}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 8: Updates & Events */}
      <section
        id="updates-events"
        className="scroll-mt-24 px-4 py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <ModuleEyebrow icon="Megaphone" text="News & Release History" />
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              <LinkedTitle
                linkData={moduleLinkMap["brassHellUpdatesEvents"]}
                locale={locale}
              >
                {t.modules.brassHellUpdatesEvents.title}
              </LinkedTitle>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.brassHellUpdatesEvents.intro}
            </p>
          </div>
          <div className="scroll-reveal relative pl-6 border-l-2 border-[hsl(var(--nav-theme)/0.3)] space-y-8">
            {t.modules.brassHellUpdatesEvents.entries.map(
              (entry: any, index: number) => (
                <div key={index} className="relative">
                  <div className="absolute -left-[1.4rem] w-4 h-4 rounded-full bg-[hsl(var(--nav-theme))] border-2 border-background" />
                  <div className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] font-medium">
                        {entry.label}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))]">
                        {entry.status}
                      </span>
                      <Clock className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <h3 className="font-bold mb-1">
                      <LinkedTitle
                        linkData={
                          moduleLinkMap[
                            `brassHellUpdatesEvents::entries::${index}`
                          ]
                        }
                        locale={locale}
                      >
                        {entry.title}
                      </LinkedTitle>
                    </h3>
                    <p className="text-muted-foreground text-sm mb-3">
                      {entry.summary}
                    </p>
                    <ul className="space-y-1.5">
                      {entry.details.map((detail: string, di: number) => (
                        <li
                          key={di}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* 广告位 6: 移动端横幅 320×50 */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://www.roblox.com/games/104347694974983"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.robloxGame}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/results?search_query=BRASS+HELL+Roblox"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.youtubeGameplay}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
