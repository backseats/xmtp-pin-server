import getPINWithTimestamp from '../getPINWithTimestamp';

// Import secrets from a local JSON file
import jsonSecrets from '../../secrets.js';

const interval = parseInt(process.env.SECONDS_IN_INTERVAL || '10');
const numIntervals = parseInt(process.env.VALID_INTERVALS_COUNT || '15');

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function POST(req: Request) {
  const body = await req.json();
  const { pin, databaseType } = body;

  // A default array of secrets to generate PINs
  const secretsArray = ["test005", "test006"];

  // Secrets imported form other data sources
  // if (databaseType === 'airtable') {
  //   const { data, error } = await getSecret();

  //   if (error) {
  //     return Response.json({
  //       statusCode: 422,
  //       error: "Invalid PIN, try again."
  //     });
  //   } else {
  //     secretsArray.push(data!.secret as string);
  //   }
  // } else {
  //   // TODO
  // }

  // Grab secrets from an env var
  const pinSecrets = process.env.PIN_SECRETS;
  if (pinSecrets && typeof pinSecrets === 'string') {
    const parsedSecrets = JSON.parse(pinSecrets) as string[]
    for (let i = 0; i < parsedSecrets.length; i++) {
      secretsArray.push(parsedSecrets[i]);
    }
  }

  // Grab secrets from a local JSON file
  const secrets = jsonSecrets as string[];
  for (let i = 0; i < secrets.length; i++) {
    secretsArray.push(secrets[i]);
  }

  if (!Array.isArray(secretsArray)) {
      throw new Error('PIN_SECRETS must be a JSON array'); // Error handling for invalid secrets array
  }

  const results: Record<string, string> = {};
  const currentTime = Date.now();
  for (let secret of secretsArray) { // Looks at each secret at every possible interval
      secret = secret.trim();
      for (let i = 0; i < numIntervals; i++) {
          const timestamp = currentTime - i * interval * 1000;
          const PIN: string = await getPINWithTimestamp(secret, timestamp);
          results[PIN] = secret;
      }
  }

  const isValid = pin in results;
  const secretUsed = isValid ? results[pin] : null;

  // if (databaseType === 'airtable') {
  //   const { data } = await getFirstOpenRecord();

  //   if (data) {
  //     const { code } = data!;

  //     const { success, error } = await updateRowWithTimestamp(data!.id);

  //     if (success && isValid) {
  //       return Response.json({
  //         statusCode: 200,
  //         message: 'Success!',
  //         pinUsed: pin,
  //         secretUsed: secretUsed,
  //         code
  //       }, { headers })

  //     } else {
  //       console.log('Airtable update error:', error)
  //       // TODO: error
  //     }
  //   }
  // }

  if (isValid) {
    return Response.json({
      statusCode: 200,
      message: 'Success!',
      pinUsed: pin,
      secretUsed: secretUsed
    }, { headers });

  } else {
    return Response.json({
      statusCode: 422,
      error: 'Invalid PIN, try again.'
    }, { headers });
  }
}
