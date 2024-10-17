import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserService } from '../user.service'


@Component({
  selector: 'user-suppr',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './user-suppr.component.html',
  styleUrl: './user-suppr.component.css'
})

export class UserSupprComponent {
  @Input() userId!: number;
  @Output() userDeleted: EventEmitter<void> = new EventEmitter<void>();
  
  showModal: boolean = false;

  constructor(public userService: UserService) {}

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  deleteUser() {
    this.userService.SupprUser(this.userId.toString()).subscribe({
      next: (newUserList) => {
        //console.log('Utilisateur supprimé avec succès', newUserList);
        this.userService.users = newUserList;
        this.userDeleted.emit();
        this.closeModal();
      },
      error: (error) => {
        console.error('Erreur lors de la suppression :', error);
      }
    });
  }
}
