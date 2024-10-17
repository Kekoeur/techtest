import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { UserService } from '../user.service';
import { UserSupprComponent } from './user-suppr.component';

describe('UserSupprComponent', () => {
  let component: UserSupprComponent;
  let fixture: ComponentFixture<UserSupprComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['SupprUser']);

    await TestBed.configureTestingModule({
      imports: [UserSupprComponent],
      providers: [{ provide: UserService, useValue: userServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(UserSupprComponent);
    component = fixture.componentInstance;
    component.userId = 1;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should open the modal', () => {
    component.openModal();
    expect(component.showModal).toBeTrue();
  });

  it('should close the modal', () => {
    component.openModal();
    component.closeModal();
    expect(component.showModal).toBeFalse();
  });

  it('should remove the user from the user list after deletion', () => {
    const initialUserList = [
      { id: 1, firstName: 'Christopher', lastName: 'Gauthier', fullName: 'Christopher Gauthier' },
      { id: 2, firstName: 'Caroline', lastName: 'Gauthier', fullName: 'Caroline Gauthier' }
    ];
  
    userServiceSpy.users = initialUserList;
  
    const mockNewUserList = [{ id: 2, firstName: 'Caroline', lastName: 'Gauthier', fullName: 'Caroline Gauthier' }];
  
    userServiceSpy.SupprUser.and.returnValue(of(mockNewUserList));
  
    component.deleteUser();
  
    expect(userServiceSpy.SupprUser).toHaveBeenCalledWith('1');
    expect(userServiceSpy.users).toEqual(mockNewUserList);
    expect(userServiceSpy.users).not.toContain({ id: 1, firstName: 'Christopher', lastName: 'Gauthier', fullName: 'Christopher Gauthier' });
  });
  

  it('should call deleteUser and emit userDeleted on successful deletion', () => {
    const mockNewUserList = [{ id: 2, firstName: 'Caroline', lastName: 'Gauthier', fullName: 'Caroline Gauthier' }];

    userServiceSpy.SupprUser.and.returnValue(of(mockNewUserList));

    spyOn(component.userDeleted, 'emit');

    component.deleteUser();

    expect(userServiceSpy.SupprUser).toHaveBeenCalledWith('1');
    expect(component.userService.users).toEqual(mockNewUserList);
    expect(component.userDeleted.emit).toHaveBeenCalled();
    expect(component.showModal).toBeFalse();
  });

  it('should handle error during deletion', () => {
    const errorResponse = { status: 500, message: 'Erreur lors de la suppression' };
    userServiceSpy.SupprUser.and.returnValue(throwError(errorResponse));

    spyOn(console, 'error');

    component.deleteUser();

    expect(userServiceSpy.SupprUser).toHaveBeenCalledWith('1');
    expect(console.error).toHaveBeenCalledWith('Erreur lors de la suppression :', errorResponse);
  });
});
