import * as db from "@src/database/database";
import { Account } from "@src/types/authentication.types";

export async function login(email: string, password: string): Promise<Account> {
  console.log(email, password);
  const accounts: Account[] = await db.executeSQL(
    "SELECT id, email, role FROM account WHERE email = $1 and password = crypt( $2 , password )",
    email,
    password
  );
  if (accounts.length === 0) {
    throw Error("Unable to login: email or password is invalid.");
  } else if (accounts.length > 1) {
    throw Error("Unable to login: mutliple matching accounts found, this is a system error.");
  }

  return accounts[0];
}
