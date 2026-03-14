export function getBaseUrl() {
  console.log(process.env.NEXTAUTH_URL);

  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }
}
