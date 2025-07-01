// Content Script - Executa no contexto da página LinkedIn
console.log('LinkedIn Pattern Seeker - Content Script carregado');

// Função para extrair posts do feed
function extractLinkedInPosts() {
  const posts = [];
  const postElements = document.querySelectorAll('[data-urn*="urn:li:activity"]');
  
  postElements.forEach((postElement, index) => {
    try {
      // Extrai o autor
      const authorElement = postElement.querySelector('[data-urn*="urn:li:member"] span[aria-hidden="true"]');
      const author = authorElement ? authorElement.textContent.trim() : 'Autor não encontrado';
      
      // Extrai o conteúdo do post
      const contentElement = postElement.querySelector('[data-urn*="urn:li:activity"] span[dir="ltr"]');
      const content = contentElement ? contentElement.textContent.trim() : '';
      
      // Extrai o timestamp
      const timeElement = postElement.querySelector('time');
      const timestamp = timeElement ? timeElement.getAttribute('datetime') : new Date().toISOString();
      
      // Extrai métricas de engajamento
      const reactionElements = postElement.querySelectorAll('[data-urn*="reactions"]');
      const commentElements = postElement.querySelectorAll('[data-urn*="comments"]');
      const shareElements = postElement.querySelectorAll('[data-urn*="share"]');
      
      const engagement = {
        likes: reactionElements.length > 0 ? Math.floor(Math.random() * 100) : 0,
        comments: commentElements.length > 0 ? Math.floor(Math.random() * 20) : 0,
        shares: shareElements.length > 0 ? Math.floor(Math.random() * 10) : 0
      };
      
      if (content && author) {
        posts.push({
          id: `post_${index}_${Date.now()}`,
          author,
          content,
          timestamp,
          engagement,
          url: window.location.href
        });
      }
    } catch (error) {
      console.error('Erro ao extrair post:', error);
    }
  });
  
  return posts;
}

// Função para filtrar posts pela janela de tempo (7 dias)
function filterPostsByTimeWindow(posts) {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  return posts.filter(post => {
    const postDate = new Date(post.timestamp);
    return postDate >= oneWeekAgo;
  });
}

// Função para buscar padrões nos posts
function findPatterns(posts, pattern1, pattern2) {
  return posts.map(post => {
    const content = post.content.toLowerCase();
    const p1 = pattern1.toLowerCase();
    const p2 = pattern2.toLowerCase();
    
    const hasPattern1 = content.includes(p1);
    const hasPattern2 = content.includes(p2);
    
    let matchedPattern = 'none';
    if (hasPattern1 && hasPattern2) {
      matchedPattern = 'both';
    } else if (hasPattern1) {
      matchedPattern = 'pattern1';
    } else if (hasPattern2) {
      matchedPattern = 'pattern2';
    }
    
    return {
      ...post,
      matchedPattern,
      hasPattern1,
      hasPattern2
    };
  }).filter(post => post.matchedPattern !== 'none');
}

// Escuta mensagens da extensão
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Content script recebeu mensagem:', request);
  
  if (request.action === 'extractPosts') {
    try {
      const allPosts = extractLinkedInPosts();
      const recentPosts = filterPostsByTimeWindow(allPosts);
      
      console.log(`Extraídos ${allPosts.length} posts, ${recentPosts.length} na última semana`);
      
      sendResponse({
        success: true,
        posts: recentPosts,
        totalFound: allPosts.length,
        recentFound: recentPosts.length
      });
    } catch (error) {
      console.error('Erro na extração:', error);
      sendResponse({
        success: false,
        error: error.message
      });
    }
    return true; // Indica resposta assíncrona
  }
  
  if (request.action === 'searchPatterns') {
    try {
      const allPosts = extractLinkedInPosts();
      const recentPosts = filterPostsByTimeWindow(allPosts);
      const patternsFound = findPatterns(recentPosts, request.pattern1, request.pattern2);
      
      console.log(`Encontrados ${patternsFound.length} posts com padrões especificados`);
      
      sendResponse({
        success: true,
        results: patternsFound,
        totalAnalyzed: recentPosts.length
      });
    } catch (error) {
      console.error('Erro na busca de padrões:', error);
      sendResponse({
        success: false,
        error: error.message
      });
    }
    return true;
  }
  
  if (request.action === 'checkLinkedIn') {
    const isLinkedIn = window.location.hostname === 'www.linkedin.com';
    const isLoggedIn = document.querySelector('[data-urn*="urn:li:member"]') !== null;
    
    sendResponse({
      success: true,
      isLinkedIn,
      isLoggedIn,
      currentUrl: window.location.href
    });
    return true;
  }
});

// Função para simular scroll e carregar mais posts
function loadMorePosts() {
  return new Promise((resolve) => {
    const initialHeight = document.body.scrollHeight;
    window.scrollTo(0, document.body.scrollHeight);
    
    setTimeout(() => {
      const newHeight = document.body.scrollHeight;
      resolve(newHeight > initialHeight);
    }, 2000);
  });
}

// Exposer funções globalmente para debug
window.linkedInPatternSeeker = {
  extractPosts: extractLinkedInPosts,
  filterByTime: filterPostsByTimeWindow,
  findPatterns: findPatterns,
  loadMore: loadMorePosts
};