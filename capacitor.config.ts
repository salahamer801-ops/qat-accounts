import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.mythex.qataccounts",
  appName: "حسابات القات",
  webDir: "dist",
  backgroundColor: "#f2f6f3",
  android: {
    allowMixedContent: true,
  },
};

export default config;
