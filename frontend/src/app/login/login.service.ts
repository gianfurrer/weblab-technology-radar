import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class LoginService {
  private headers = new HttpHeaders({
    "Content-Type": "application/json",
    Accept: "application/json",
  });

  constructor(private http: HttpClient) {}

  public login(email: string, password: string): Observable<string> {
    const body = {
      email,
      password,
    };
    return this.http.post<string>("/api/v1/auth/login", body, { headers: this.headers });
  }
}
