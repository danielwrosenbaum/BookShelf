export default function decodeToken(token) {
  const [, encodedPayload] = token.split('.');
  const jsonPayload = atob(encodedPayload);
  const payload = JSON.parse(jsonPayload);
  return payload;
}

// atob decodes a base-64 encoded string
