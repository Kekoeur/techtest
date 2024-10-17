import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';

import { User } from './user.interface';

@Injectable({
  providedIn: 'root',
})

export class UserService {
  private http = inject(HttpClient);
  public users: User[] = [];
  readonly url = 'http://localhost:3000';

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}/users`).pipe(
      map(users => {
        const usersWithFullName = users.map(user => ({
          ...user,
          fullName: `${user.firstName} ${user.lastName}`
        }));
        return usersWithFullName;
      })
    );
  }

  SupprUser(userId: string): Observable<User[]> {
    return this.http.post<User[]>(`${this.url}/suppruser`, { userId });
  }

  addUser(user: { firstName: string; lastName: string }): Observable<User> {
    return this.http.post<User>(this.url+"/users", user).pipe(
      tap(newUser => {
        const userWithFullName = { ...newUser, fullName: `${newUser.firstName} ${newUser.lastName}` };
        this.users.push(userWithFullName);
      })
    );
  }
}
