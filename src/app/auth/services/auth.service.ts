import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environments } from '../../environments/environments';
import { User } from '../interfaces/user.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl: string = environments.baseUrl;
  private user?: User;

  constructor(private httpClient: HttpClient) {}

  public get currentUser(): User | undefined {
    if (this.user) return structuredClone(this.user);
    return undefined;
  }

  public login(email: string, password: string): Observable<User> {
    let user$: Observable<User> = this.httpClient
      .get<User>(`${this.baseUrl}/users/1`)
      .pipe(
        tap((user) => (this.user = user)),
        tap((user) => localStorage.setItem('token', '4fa4f6a54d5fad'))
      );

    return user$;
  }

  public logout() {
    this.user = undefined;
    localStorage.clear();
  }

  public checkAuth(): Observable<boolean> {
    if (!localStorage.getItem('token')) return of(false);

    return this.httpClient.get<User>(`${this.baseUrl}/users/1`).pipe(
      tap((user) => (this.user = user)),
      map((user) => !!user),
      catchError((err) => of(false))
    );
  }
}
