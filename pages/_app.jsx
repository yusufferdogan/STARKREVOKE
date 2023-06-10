import '../styles/globals.css';
import { useState, useEffect } from 'react';
import { StarknetConfig, InjectedConnector } from '@starknet-react/core';

const connectors = [
  new InjectedConnector({ options: { id: 'braavos' } }),
  new InjectedConnector({ options: { id: 'argentX' } }),
];
function MyApp({ Component, pageProps }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <StarknetConfig connectors={connectors}>
      <Component {...pageProps} />
    </StarknetConfig>
  );
}

export default MyApp;
