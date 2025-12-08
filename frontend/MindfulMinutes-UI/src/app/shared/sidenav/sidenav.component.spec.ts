import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidenavComponent } from './sidenav.component';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { NgClass } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';

class MockDataService {
  dayCount$ = of(10);
  sidenavState$ = of(true);

  setCompletedDataState = jasmine.createSpy('setCompletedDataState');
}

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;
  let dataService: DataService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidenavComponent, NgClass],
      providers: [
        { provide: DataService, useClass: MockDataService },
        { provide: Router, useClass: MockRouter }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;
    dataService = TestBed.inject(DataService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get day count from DataService', () => {
    expect(component.day_count).toBe(10);
  });

  it('should get sidenav open state from DataService', () => {
    expect(component.isSidenavOpen).toBeTrue();
  });

  it('should navigate and set data state to quotes', () => {
    component.openCompletedQuotes();

    expect(router.navigate).toHaveBeenCalledWith(['/completedData']);
    expect(dataService.setCompletedDataState).toHaveBeenCalledWith('quotes');
  });

  it('should navigate and set data state to exercises', () => {
    component.openCompletedExercises();

    expect(router.navigate).toHaveBeenCalledWith(['/completedData']);
    expect(dataService.setCompletedDataState).toHaveBeenCalledWith('exercises');
  });

  it('should navigate and set data state to journals', () => {
    component.openCompletedJournals();

    expect(router.navigate).toHaveBeenCalledWith(['/completedData']);
    expect(dataService.setCompletedDataState).toHaveBeenCalledWith('journals');
  });
});
