import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { UserService } from '../user.service';
import { User } from '../user.interface';

@Component({
  selector: 'user-add',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-add.component.html',
  styleUrl: './user-add.component.css'
})

export class UserAddComponent {
  addUserForm: FormGroup;
  result: boolean | undefined;
  text: string = "";
  isSubmitting: boolean = false;

  constructor(private userService: UserService, private fb: FormBuilder) {
    this.addUserForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern('^[a-zA-ZÀ-ÿ\\- \']*')]],
      lastName: ['', [Validators.required, Validators.pattern('^[a-zA-ZÀ-ÿ\\- \']*')]]
    });
  }

  onSubmit(): void {
    if (this.addUserForm.valid) {
      const { firstName, lastName } = this.addUserForm.value;

      this.userService.addUser({ firstName, lastName }).subscribe({
        next: (newUser: User) => {
          //console.log('Utilisateur ajouté:', newUser);
          this.text = `L'utilisateur ${newUser.firstName} ${newUser.lastName} a été ajouté.`;
          this.result = true;
        },
        error: (error: any) => {
          //console.log(error.message)
          if (error.status === 409) {
            this.text = 'Cet utilisateur existe déjà.';
          } else if (error.status === 500) {
            this.text = 'Une erreur est survenue lors de l\'ajout de l\'utilisateur.';
          } else {
            this.text = 'Une erreur inattendue est survenue.';
          }
          this.result = false;
        },
        complete: () => {
          this.addUserForm.reset({ firstName: '', lastName: '' })
          this.isSubmitting = false;
        }
      });
    }
  } 
}
