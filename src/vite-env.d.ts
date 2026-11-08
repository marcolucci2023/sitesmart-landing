/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PADDLE_CLIENT_TOKEN?: string;
  readonly VITE_PADDLE_PRICE_STARTER?: string;
  readonly VITE_PADDLE_PRICE_PRO?: string;
  readonly VITE_PADDLE_PRICE_BUSINESS?: string;
  readonly APP_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  Paddle?: {
    Environment: {
      set: (env: 'sandbox' | 'production') => void;
    };
    Initialize: (options: { token?: string }) => void;
    Checkout: {
      open: (options: {
        items: Array<{ priceId: string; quantity?: number }>;
        customer?: { email?: string };
        settings?: Record<string, unknown>;
      }) => void;
    };
  };
}
