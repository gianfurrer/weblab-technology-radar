import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Technology } from "../../types/technology";

@Injectable({
  providedIn: "root",
})
export class TechnologyService {
  static URL_PREFIX = "/api/v1/technologies";

  constructor(private http: HttpClient) {}

  public getTechnologies(): Observable<Technology[]> {
    return this.http.get<Technology[]>(TechnologyService.URL_PREFIX);
  }

  public addTechnology(technology: Technology): Observable<Technology> {
    return this.http.post<Technology>(TechnologyService.URL_PREFIX, technology);
  }

  public editTechnology(technology: Technology): Observable<Technology> {
    return this.http.put<Technology>(TechnologyService.URL_PREFIX, technology);
  }
}
