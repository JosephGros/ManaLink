declare namespace NodeJS {
    interface ProcessEnv {
      MONGODB_URI: string;
      NEXT_PUBLIC_API_URL?: string;
      NODE_ENV: 'development' | 'production' | 'test';
    }
  }
  