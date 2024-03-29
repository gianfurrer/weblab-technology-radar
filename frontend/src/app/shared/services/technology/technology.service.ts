import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PublishDetails, Technology } from "@shared/types/technology";

@Injectable({
  providedIn: "root",
})
export class TechnologyService {
  static URL_PREFIX = "/api/v1/technologies";

  constructor(private http: HttpClient) {}

  public getTechnologies(onlyPublished = true): Observable<Technology[]> {
    const options = { params: new HttpParams().set("onlyPublished", onlyPublished) };
    return this.http.get<Technology[]>(TechnologyService.URL_PREFIX, options);
  }

  public getTechnology(id: string): Observable<Technology> {
    return this.http.get<Technology>(`${TechnologyService.URL_PREFIX}/${id}`);
  }

  public addTechnology(technology: Technology): Observable<Technology> {
    return this.http.post<Technology>(TechnologyService.URL_PREFIX, technology);
  }

  public editTechnology(technology: Technology): Observable<Technology> {
    return this.http.put<Technology>(TechnologyService.URL_PREFIX, technology);
  }

  public publishTechnology(details: PublishDetails): Observable<Technology> {
    return this.http.post<Technology>(`${TechnologyService.URL_PREFIX}/publish`, details);
  }
}
