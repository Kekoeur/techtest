import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { NavigationComponent } from './navigation.component';

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;
  let mockRouter: { events: BehaviorSubject<any>; url: string; navigate: jasmine.Spy };

  beforeEach(async () => {
    mockRouter = {
      events: new BehaviorSubject<NavigationEnd>(new NavigationEnd(0, '/', '/')),
      url: '/',
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      imports: [NavigationComponent],
      providers: [{ provide: Router, useValue: mockRouter }]
    }).compileComponents();

    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize currentRoute with the router url', () => {
    expect(component.currentRoute).toBe('/');
  });

  it('should display correct buttons for the home route and navigate to corresponding route', () => {
    mockRouter.url = '/';
    mockRouter.events.next(new NavigationEnd(0, '/', '/'));
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('.navigation button');
    const buttonList = buttons[0];
    buttonList.click();
    const buttonAdd = buttons[1];
    buttonAdd.click();
    
    expect(buttons.length).toBe(2);
    expect(buttonList.textContent).toContain('Liste des utilisateurs');
    expect(buttonAdd.textContent).toContain('Ajouter un utilisateur');

    expect(mockRouter.navigate).toHaveBeenCalledTimes(2);
    expect(mockRouter.navigate.calls.argsFor(0)).toEqual([['/users']]);
    expect(mockRouter.navigate.calls.argsFor(1)).toEqual([['/user/add']]);
  });

  it('should display correct buttons for the /users route and navigate to corresponding route', () => {
    mockRouter.url = '/users';
    mockRouter.events.next(new NavigationEnd(0, '/users', '/users'));
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    const buttonHome = buttons[0];
    buttonHome.click();
    const buttonAdd = buttons[1];
    buttonAdd.click();

    expect(buttons.length).toBe(2);
    expect(buttonHome.textContent).toContain('Acceuil');
    expect(buttonAdd.textContent).toContain('Ajouter un utilisateur');

    expect(mockRouter.navigate).toHaveBeenCalledTimes(2);
    expect(mockRouter.navigate.calls.argsFor(0)).toEqual([['/']]);
    expect(mockRouter.navigate.calls.argsFor(1)).toEqual([['/user/add']]);
  });

  it('should display correct buttons for the /user/add route', () => {
    mockRouter.url = '/user/add';
    mockRouter.events.next(new NavigationEnd(0, '/user/add', '/user/add'));
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    const buttonHome = buttons[0];
    buttonHome.click();
    const buttonList = buttons[1];
    buttonList.click();

    expect(buttons.length).toBe(2);
    expect(buttonHome.textContent).toContain('Acceuil');
    expect(buttonList.textContent).toContain('Liste des utilisateurs');

    expect(mockRouter.navigate).toHaveBeenCalledTimes(2);
    expect(mockRouter.navigate.calls.argsFor(0)).toEqual([['/']]);
    expect(mockRouter.navigate.calls.argsFor(1)).toEqual([['/users']]);
  });

  afterEach(() => {
    fixture.destroy();
  });
});
