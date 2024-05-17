import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Hero } from '../interfaces/hero.interface';
import { Observable } from 'rxjs/internal/Observable';
import { environments } from '../../environments/environments';
import { catchError, map, of } from 'rxjs';

@Injectable({providedIn: 'root'})
export class HeroesService {

  private baseUrl: string = environments.baseUrl;

  constructor(private httpClient: HttpClient) { }

  public getHeroes(): Observable<Hero[]> {
    return this.httpClient.get<Hero[]>(`${this.baseUrl}/heroes`);
  }

  public getById(id: string): Observable<Hero | undefined>{
      return this.httpClient
      .get<Hero>(`${this.baseUrl}/heroes/${id}`)
      .pipe(
        catchError(error => of(undefined))
      );
  }

  public getSuggestions(query: string): Observable<Hero[]>{
      let heroes: Observable<Hero[]> =
          this.httpClient.get<Hero[]>(`${this.baseUrl}/heroes?q=${query}&_limit=6`);
      return heroes;
  }

  public addHero(hero: Hero): Observable<Hero>{
    let observable: Observable<Hero> = this.httpClient.post<Hero>(`${this.baseUrl}/heroes`, hero);
    return observable;
  }

  public updateHero(hero: Hero): Observable<Hero>{
    if(!hero.id) throw new Error('El id es requerido');
    let observable: Observable<Hero> = this.httpClient.patch<Hero>(`${this.baseUrl}/heroes/${hero.id}`, hero);
    return observable;
  }

  public deleteHerobyId(id: string): Observable<boolean>{
    if(!id) throw new Error('El id es requerido');
    let observable: Observable<boolean> = this.httpClient
      .delete<Hero>(`${this.baseUrl}/heroes/${id}`)
      .pipe(
        map(resp => true),
        catchError(err => of(false))
      )
    return observable;
  }
}
