import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const cherryPickedKeys: string[] = [
  "REACT_APP_API_KEY",
  "REACT_APP_AUTH_DOMAIN",
  "REACT_APP_DATA_BASE_URL",
  "REACT_APP_PROJECT_ID",
  "REACT_APP_STORAGE_BUCKET",
  "REACT_APP_MESSAGING_SENDER_ID",
  "REACT_APP_APP_ID",
];

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const processEnv: Record<string, string> = {}; // Definir um tipo para processEnv

  cherryPickedKeys.forEach(key => {
    if (env[key]) processEnv[key] = env[key];
  });

  return {
    define: {
      'process.env': processEnv
    },
    plugins: [react()],
  }
})
