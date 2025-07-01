// Background Service Worker
console.log('LinkedIn Pattern Seeker - Background Script carregado');

// Gerencia instalação da extensão
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extensão instalada:', details.reason);
  
  // Configurações padrão
  chrome.storage.local.set({
    settings: {
      autoScan: false,
      scanInterval: 300000, // 5 minutos
      maxPosts: 100
    }
  });
});

// Gerencia cliques no ícone da extensão
chrome.action.onClicked.addListener((tab) => {
  console.log('Ícone da extensão clicado na aba:', tab.url);
  
  // Verifica se está no LinkedIn
  if (tab.url && tab.url.includes('linkedin.com')) {
    // Abre popup automaticamente
    chrome.action.openPopup();
  } else {
    // Redireciona para LinkedIn se não estiver
    chrome.tabs.create({
      url: 'https://www.linkedin.com/feed/'
    });
  }
});

// Função para verificar status do LinkedIn
async function checkLinkedInStatus(tabId) {
  try {
    const response = await chrome.tabs.sendMessage(tabId, {
      action: 'checkLinkedIn'
    });
    return response;
  } catch (error) {
    console.error('Erro ao verificar status do LinkedIn:', error);
    return { success: false, error: error.message };
  }
}

// Função para extrair posts
async function extractPosts(tabId) {
  try {
    const response = await chrome.tabs.sendMessage(tabId, {
      action: 'extractPosts'
    });
    return response;
  } catch (error) {
    console.error('Erro ao extrair posts:', error);
    return { success: false, error: error.message };
  }
}

// Função para buscar padrões
async function searchPatterns(tabId, pattern1, pattern2) {
  try {
    const response = await chrome.tabs.sendMessage(tabId, {
      action: 'searchPatterns',
      pattern1,
      pattern2
    });
    return response;
  } catch (error) {
    console.error('Erro ao buscar padrões:', error);
    return { success: false, error: error.message };
  }
}

// Escuta mensagens do popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background recebeu mensagem:', request);
  
  if (request.action === 'getCurrentTab') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        sendResponse({ tabId: tabs[0].id, url: tabs[0].url });
      } else {
        sendResponse({ error: 'Nenhuma aba ativa encontrada' });
      }
    });
    return true;
  }
  
  if (request.action === 'checkStatus') {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs[0]) {
        const result = await checkLinkedInStatus(tabs[0].id);
        sendResponse(result);
      } else {
        sendResponse({ success: false, error: 'Aba não encontrada' });
      }
    });
    return true;
  }
  
  if (request.action === 'extractPosts') {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs[0]) {
        const result = await extractPosts(tabs[0].id);
        sendResponse(result);
      } else {
        sendResponse({ success: false, error: 'Aba não encontrada' });
      }
    });
    return true;
  }
  
  if (request.action === 'searchPatterns') {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs[0]) {
        const result = await searchPatterns(tabs[0].id, request.pattern1, request.pattern2);
        sendResponse(result);
      } else {
        sendResponse({ success: false, error: 'Aba não encontrada' });
      }
    });
    return true;
  }
});

// Expor funções para debug
self.linkedInPatternSeeker = {
  checkStatus: checkLinkedInStatus,
  extractPosts: extractPosts,
  searchPatterns: searchPatterns
};