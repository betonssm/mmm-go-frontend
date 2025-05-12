
// src/lib/TonWalletConnect.tsx

import React from "react";
import { TonConnectUIProvider, TonConnectButton } from "@tonconnect/ui-react";

const manifestUrl = "https://mmmgo-frontend.onrender.com/tonconnect-manifest.json";

export const TonConnectWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      {children}
    </TonConnectUIProvider>
  );
};

export const TonConnectButtonUI = () => {
  return <TonConnectButton />;
};