import crypto from "crypto";

const interval = parseInt(process.env.SECONDS_IN_INTERVAL || '10');

// Rounding to nearest seconds * interval
function getTimestamp(value = Date.now()): number {
  return Math.floor(value / (interval * 1000)) * interval * 1000;
}

// Gets a PIN code for a specific secret
export default async function getPINWithTimestamp(secret: string, timestamp: number) {
  const time = getTimestamp(timestamp);

  if (!secret) {
      throw new Error('No secret provided');
  }

  // Ensures PIN never starts with a 0
  let pin = "0000";
  while (pin.startsWith('0')) {
    const preImage = `${time}-${secret}-${pin}`;
    const hash = crypto.createHash('sha256').update(preImage).digest();
    const hashArray: number[] = Array.from(new Uint8Array(hash));
    const hashHex: string = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    const numericalHash: string = hashHex.replace(/\D/g, '');
    pin = numericalHash.slice(-4);
  }

  return pin;
}
