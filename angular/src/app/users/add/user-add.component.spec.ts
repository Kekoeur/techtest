import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { UserAddComponent } from './user-add.component';
import { UserService } from '../user.service';

describe('UserAddComponent', () => {
  let component: UserAddComponent;
  let fixture: ComponentFixture<UserAddComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('UserService', ['addUser']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, UserAddComponent],
      providers: [{ provide: UserService, useValue: spy }]
    }).compileComponents();

    fixture = TestBed.createComponent(UserAddComponent);
    component = fixture.componentInstance;
    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with controls', () => {
    expect(component.addUserForm.contains('firstName')).toBeTruthy();
    expect(component.addUserForm.contains('lastName')).toBeTruthy();
  });

  it('should mark form as invalid when empty', () => {
    expect(component.addUserForm.valid).toBeFalsy();
  });

  it('should call addUser from UserService when form is valid and submitted', () => {
    const mockUser = { id: 1, firstName: 'Christopher', lastName: 'Gauthier', fullName: 'Christopher Gauthier' };
    
    component.addUserForm.setValue({firstName: mockUser.firstName, lastName: mockUser.lastName});
    userServiceSpy.addUser.and.returnValue(of(mockUser));
    component.onSubmit();

    expect(userServiceSpy.addUser).toHaveBeenCalledWith({firstName: mockUser.firstName, lastName: mockUser.lastName});
    expect(component.text).toBe(`L'utilisateur Christopher Gauthier a été ajouté.`);
  });

  it('should handle user already exists error (409)', () => {
    const mockUser = { id: 2, firstName: 'Caroline', lastName: 'Gauthier', fullName: 'Caroline Gauthier' };

    component.addUserForm.setValue({firstName: mockUser.firstName, lastName: mockUser.lastName});
    userServiceSpy.addUser.and.returnValue(throwError({ status: 409 }));
    component.onSubmit();

    expect(component.text).toBe('Cet utilisateur existe déjà.');
  });

  it('should handle server error (500)', () => {
    const mockUser = { id: 2, firstName: 'Caroline', lastName: 'Gauthier', fullName: 'Caroline Gauthier' };

    component.addUserForm.setValue({firstName: mockUser.firstName, lastName: mockUser.lastName});
    userServiceSpy.addUser.and.returnValue(throwError({ status: 500 }));
    component.onSubmit();

    expect(component.text).toBe('Une erreur est survenue lors de l\'ajout de l\'utilisateur.');
  });

  it('should reset the form after submission', () => {
    const mockUser = { id: 2, firstName: 'Caroline', lastName: 'Gauthier', fullName: 'Caroline Gauthier' };

    component.addUserForm.setValue({firstName: mockUser.firstName, lastName: mockUser.lastName});
    userServiceSpy.addUser.and.returnValue(of(mockUser));
    component.onSubmit();

    expect(component.addUserForm.value).toEqual({firstName: '', lastName: ''});
  });
});
