// Injected Script - Executa no contexto da página
console.log('LinkedIn Pattern Seeker - Injected Script carregado');

// Função para extrair dados adicionais da página se necessário
window.linkedInPatternSeekerInjected = {
  version: '1.0.0',
  extractPageData: function() {
    return {
      url: window.location.href,
      title: document.title,
      timestamp: new Date().toISOString()
    };
  }
};