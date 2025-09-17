process.env.NODE_CONFIG = JSON.stringify({
  env: 'development',
});

import { generateJWT, verifyJWT } from './core/jwt';

function messWithPayload(jwt: string) {
  const [header, payload, signature] = jwt.split('.');
  const parsedPayload = JSON.parse(
    Buffer.from(payload!, 'base64url').toString(),
  );

  // make me admin please ^^
  parsedPayload.roles.push('admin');

  const newPayload = Buffer.from(
    JSON.stringify(parsedPayload),
    'ascii',
  ).toString('base64url');
  return [header, newPayload, signature].join('.');
}

async function main() {
  const fakeUser = {
    id: 1,
    name: 'Thomas',
    surname: 'Aelbrecht',
    email: 'thomas.aelbrecht@hogent.be',
    roles: ['user'],
    password_hash: 'ongeldigehash',
  };

  const jwt = await generateJWT(fakeUser);
  // copy and paste the JWT in the textfield on https://jwt.io
  // inspect the content
  console.log('The JWT:', jwt);

  let valid = await verifyJWT(jwt);
  console.log('This JWT is', valid ? 'valid' : 'incorrect');
  console.log('\n');

  // Let's mess with the payload
  const messedUpJwt = messWithPayload(jwt);
  console.log('Messed up JWT:', messedUpJwt);

  try {
    console.log('Verifying this JWT will throw an error:');
    valid = await verifyJWT(messedUpJwt);
  } catch (err: any) {
    console.log('We got an error:', err.message);
  }
}

main();
