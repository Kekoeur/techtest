import { Component, OnInit, Inject  } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserService } from './user.service';
import { User } from './user.interface';
import { UserSupprComponent } from './suppr/user-suppr.component';

@Component({
  selector: 'users',
  imports:[ CommonModule, UserSupprComponent],
  standalone: true,
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})

export class UserListComponent implements OnInit{
  public users: User[] = [];

  constructor(public userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers()
  }

  loadUsers() {
    this.userService.getUsers().subscribe(users => {
      this.users = users.sort((a, b) => a.fullName.localeCompare(b.fullName));
    });
  }

  refreshUserList() {
    this.loadUsers();
  }
}
