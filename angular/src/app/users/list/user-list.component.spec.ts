import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { UserListComponent } from './user-list.component';
import { UserService } from '../user.service';
import { User } from '../user.interface';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('UserService', ['getUsers']);
    
    await TestBed.configureTestingModule({
      imports: [UserListComponent],
      providers: [{ provide: UserService, useValue: spy }]
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;

    const mockUsers: User[] = [
      { id: 1, firstName: 'Christopher', lastName: 'Gauthier', fullName: 'Christopher Gauthier' },
      { id: 2, firstName: 'Caroline', lastName: 'Gauthier', fullName: 'Caroline Gauthier' }
    ];
    userServiceSpy.getUsers.and.returnValue(of(mockUsers));

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve and sort the list of users on init', () => {
    component.ngOnInit();

    expect(component.users.length).toBe(2);
    expect(component.users[0].firstName).toBe('Caroline');
  });

  it('should render users list sort in the template', () => {
    component.ngOnInit();

    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const userListItems = compiled.querySelectorAll('li');

    expect(userListItems.length).toBe(2);
    expect(userListItems[0].textContent).toContain('Caroline Gauthier');
    expect(userListItems[1].textContent).toContain('Christopher Gauthier');
  });
});
