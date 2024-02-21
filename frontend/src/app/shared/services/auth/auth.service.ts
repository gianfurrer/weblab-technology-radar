import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject, catchError, merge, of, retry, shareReplay, tap } from "rxjs";
import { User } from "@shared/types/user";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  static URL_PREFIX = "/api/v1/auth";

  private headers = new HttpHeaders({
    "Content-Type": "application/json",
    Accept: "application/json",
  });

  private userSubject$ = new Subject<User>();
  public user$: Observable<User | null>;

  constructor(private http: HttpClient) {
    this.user$ = merge(this.userSubject$, this.http.get<User>(`${AuthService.URL_PREFIX}/user`)).pipe(
      catchError(() => {
        console.log("User not logged in");
        return of(null);
      }),
      retry({ delay: () => this.userSubject$.asObservable() }),
      shareReplay(1)
    );
  }

  public login(email: string, password: string): Observable<User> {
    const body = {
      email,
      password,
    };
    return this.http.post<User>(`${AuthService.URL_PREFIX}/login`, body, { headers: this.headers }).pipe(
      tap((user: User) => {
        this.userSubject$.next(user);
      })
    );
  }

  public logout(): Observable<void> {
    return this.http.post<void>(`${AuthService.URL_PREFIX}/logout`, {});
  }

  public getUser(): Observable<User | null> {
    return this.user$;
  }
}
