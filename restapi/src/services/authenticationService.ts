import * as db from '@src/database/database';
import { Account } from '@src/types/authentication.types';

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export async function login(email: string, password: string): Promise<Account> {
  const accounts: Account[] = await db.executeSQL(
    'SELECT id, email, role FROM account WHERE email = $1 and password = crypt( $2 , password )',
    email,
    password
  );
  if (accounts.length === 0) {
    throw new AuthenticationError('Unable to login: email or password is invalid.');
  } else if (accounts.length > 1) {
    throw new AuthenticationError('Unable to login: mutliple matching accounts found, this is a system error.');
  }

  return accounts[0];
}
