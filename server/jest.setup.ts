const LOCAL_SERVER = 'http://localhost:3001'; // Make sure you have the server running
const REMOTE_SERVER = 'https://kasca-server.dulapahv.dev';

const serverArg = process.argv.find((arg) => arg.startsWith('--server='));
if (!serverArg) {
  console.warn('⚠️ Server not specified. Defaulting to local server.');
}
const SERVER_URL = serverArg === 'remote' ? REMOTE_SERVER : LOCAL_SERVER;

console.log(`ℹ️ Running tests against server: ${SERVER_URL}`);

process.env.SERVER_URL = SERVER_URL;
