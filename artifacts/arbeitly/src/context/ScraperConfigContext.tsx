import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type ScraperSource = "linkedin" | "indeed" | "stepstone" | "xing";
export type ScraperCadence = "daily" | "every-48h" | "weekly" | "manual";

export type ScraperConfig = {
  candidateId: string;
  isActive: boolean;
  sources: ScraperSource[];
  targetRoles: string;
  locations: string;
  industries: string;
  jobType: string;
  keywords: string;
  cadence: ScraperCadence;
  lastRunAt?: string;
  nextRunAt?: string;
};

type ScraperConfigContextType = {
  configs: ScraperConfig[];
  getConfig: (candidateId: string) => ScraperConfig | undefined;
  upsertConfig: (config: ScraperConfig) => void;
  deleteConfig: (candidateId: string) => void;
};

const STORAGE_KEY = "arbeitly_scraper_configs";

const SEED_CONFIGS: ScraperConfig[] = [
  {
    candidateId: "seed_cust_001",
    isActive: true,
    sources: ["linkedin", "indeed", "stepstone"],
    targetRoles: "Senior Software Engineer, Tech Lead, Software Architect",
    locations: "Berlin, Munich, Hamburg",
    industries: "Technology, Software, SaaS",
    jobType: "Full-time",
    keywords: "React, Node.js, TypeScript, Cloud",
    cadence: "daily",
    lastRunAt: new Date(Date.now() - 86400000).toISOString(),
    nextRunAt: new Date(Date.now() + 86400000).toISOString(),
  },
  {
    candidateId: "seed_cust_002",
    isActive: true,
    sources: ["linkedin", "xing", "stepstone"],
    targetRoles: "Senior Financial Analyst, Finance Manager, FP&A Manager",
    locations: "Frankfurt, Düsseldorf, Munich",
    industries: "Finance, Banking, Investment",
    jobType: "Full-time",
    keywords: "Excel, SAP, Financial Modelling, FP&A",
    cadence: "every-48h",
    lastRunAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    nextRunAt: new Date(Date.now() + 86400000).toISOString(),
  },
];

const ScraperConfigContext = createContext<ScraperConfigContextType | null>(null);

export function ScraperConfigProvider({ children }: { children: ReactNode }) {
  const [configs, setConfigs] = useState<ScraperConfig[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
      return SEED_CONFIGS;
    } catch {
      return SEED_CONFIGS;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
  }, [configs]);

  const getConfig = (candidateId: string) => configs.find((c) => c.candidateId === candidateId);

  const upsertConfig = (config: ScraperConfig) => {
    setConfigs((prev) => {
      const exists = prev.findIndex((c) => c.candidateId === config.candidateId);
      if (exists >= 0) {
        const updated = [...prev];
        updated[exists] = config;
        return updated;
      }
      return [...prev, config];
    });
  };

  const deleteConfig = (candidateId: string) => {
    setConfigs((prev) => prev.filter((c) => c.candidateId !== candidateId));
  };

  return (
    <ScraperConfigContext.Provider value={{ configs, getConfig, upsertConfig, deleteConfig }}>
      {children}
    </ScraperConfigContext.Provider>
  );
}

export function useScraperConfig() {
  const ctx = useContext(ScraperConfigContext);
  if (!ctx) throw new Error("useScraperConfig must be used within ScraperConfigProvider");
  return ctx;
}
