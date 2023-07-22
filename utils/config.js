const dotenv = require("dotenv");

dotenv.config();

const mongodb_uri = process.env.mongodb_uri;
const OAUTH_CLIENT_ID = process.env.OAUTH_CLIENT_ID;
const OAUTH_CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;
const PORT = process.env.PORT;
const HOST = process.env.HOST;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
const EMAIL_FROM = process.env.EMAIL_FROM;
const GMAIL = process.env.GMAIL;
const GMAIL_PASSWORD = process.env.GMAIL_PASSWORD;

module.exports = {mongodb_uri, OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET, PORT, HOST, JWT_EXPIRES_IN, JWT_SECRET, EMAIL_FROM, GMAIL, GMAIL_PASSWORD};