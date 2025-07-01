// Declarações de tipo para Chrome Extension API
declare global {
  interface Window {
    chrome?: typeof chrome;
  }
}

interface ChromeResponse {
  success: boolean;
  isLinkedIn?: boolean;
  isLoggedIn?: boolean;
  currentUrl?: string;
  posts?: any[];
  results?: any[];
  totalFound?: number;
  recentFound?: number;
  totalAnalyzed?: number;
  error?: string;
}

interface ChromeMessage {
  action: string;
  pattern1?: string;
  pattern2?: string;
  [key: string]: any;
}

interface ChromeRuntime {
  sendMessage: (message: ChromeMessage, callback?: (response: ChromeResponse) => void) => void;
  id?: string;
}

interface Chrome {
  runtime: ChromeRuntime;
  tabs: {
    query: (queryInfo: any, callback: (tabs: any[]) => void) => void;
    sendMessage: (tabId: number, message: ChromeMessage, callback?: (response: ChromeResponse) => void) => void;
  };
  action: {
    openPopup: () => void;
  };
  storage: {
    local: {
      set: (items: any) => void;
      get: (keys: string | string[] | null, callback: (items: any) => void) => void;
    };
  };
}

declare const chrome: Chrome;

export type { ChromeResponse, ChromeMessage };