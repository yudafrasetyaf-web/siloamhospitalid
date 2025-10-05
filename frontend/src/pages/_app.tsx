import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import '@/styles/globals.css';
import Layout from '@/components/Layout';
import { AccessibilityProvider } from '@/components/AccessibilityProvider';

function App({ Component, pageProps }: AppProps) {
  return (
    <AccessibilityProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AccessibilityProvider>
  );
}

export default appWithTranslation(App);
