import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join((process.cwd(), '.env')) });

export default {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  default_pass: process.env.DEFAULT_PASS,
  bcrypt_salt_round: process.env.BCRYPT_SALT_ROUND,
  NODE_ENV: process.env.NODE_ENV,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  reset_pass_ui_link: process.env.RESET_PASS_UI_LINK,
  email_app_password: process.env.EMAIL_APP_PASSWORD,
  email_sent_from: process.env.EMAIL_SENT_FROM,
  cloud_name: process.env.CLOUD_NAME,
  cloud_api_key: process.env.CLOUD_API_KEY,
  cloud_api_secret: process.env.CLOUD_API_SECRET,
  super_admin_pass: process.env.SUPER_ADMIN_PASS,
  super_admin_email: process.env.SUPER_ADMIN_EMAIL,
  super_admin_ID: process.env.SUPER_ADMIN_ID
};
