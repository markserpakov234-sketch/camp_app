/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SHIFT_CODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
