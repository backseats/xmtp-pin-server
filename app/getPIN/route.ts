import getPINWithTimestamp from '../getPINWithTimestamp';

export async function OPTIONS(req: Request) {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { secret } = body;

  try {
    const timestamp = Date.now();
    const pin = await getPINWithTimestamp(secret, timestamp);

    return new Response(JSON.stringify({ pin }), {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });

  } catch (error) {
    console.error('e', error);

    return Response.json({
      code: 500,
      error: "There was an error generating your PIN."
    })
  }
}
