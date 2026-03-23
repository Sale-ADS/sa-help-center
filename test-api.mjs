// Test the chat API directly

const testPayload = {
  message: '¿Qué es SaleAds.ai?',
  locale: 'es',
  history: [],
  pageContext: {
    title: 'Inicio',
    description: 'Centro de ayuda de SaleAds.ai',
    url: '/es/docs/primeros-pasos/crear-cuenta'
  }
};

async function testAPI() {
  console.log('Testing Chat API...\n');
  console.log('Request:', JSON.stringify(testPayload, null, 2));
  console.log('\n---\n');
  
  try {
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testPayload)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ API Response:');
      console.log('Answer:', data.answer);
      console.log('\nSources:', data.sources);
      console.log('\nSuggestions:', data.suggestions);
    } else {
      console.error('❌ API Error:', data.error);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\nMake sure the dev server is running: npm run dev');
  }
}

testAPI();
