export async function POST(request) {
  const body = await request.json();
  const { firstName, email } = body;
  
  const GC_API_KEY = process.env.GC_API_KEY;
  
  // Direct pass-through to GC
  const gcResponse = await fetch('https://api.globalcontrol.io/api/ai/contacts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': GC_API_KEY
    },
    body: JSON.stringify({
      firstName: firstName,
      email: email
    })
  });
  
  const gcData = await gcResponse.json();
  
  return Response.json({
    received: { firstName, email },
    sentToGC: { firstName, email },
    gcResponse: gcData
  }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  });
}
