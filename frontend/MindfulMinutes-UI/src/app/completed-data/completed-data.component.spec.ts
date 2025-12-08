import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompletedQuotesComponent } from './completed-data.component';
import { DataService } from '../shared/data.service';
import { AppService } from '../shared/app.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA, Component } from '@angular/core';

// Mock Data
const mockCompletedQuotes = [
  { date_completed: '2025-03-20', day_number: 'Day 1', quote: 'Test Quote 1', user_id: '123' },
  { date_completed: '2025-03-21', day_number: 'Day 2', quote: 'Test Quote 2', user_id: '123' }
];

const mockCompletedExercises = [
  { date_completed: '2025-03-20', day_number: 'Day 1', exercise_title: 'Test Exercise 1', user_id: '123' },
  { date_completed: '2025-03-21', day_number: 'Day 2', exercise_title: 'Test Exercise 2', user_id: '123' }
];

const mockCompletedJournals = [
  { date_completed: '2025-03-20', day_number: 'Day 1', journal_content: 'Test Journal 1', user_id: '123' },
  { date_completed: '2025-03-21', day_number: 'Day 2', journal_content: 'Test Journal 2', user_id: '123' }
];

// Mock Services
class MockDataService {
  completedDataState$ = of('quotes'); // Default state
  userId$ = of('123');
  toggleSidenav = jasmine.createSpy('toggleSidenav');
  dayCount$ = of(1);
  sidenavState$ = of(false); // Mock sidenavState$
  userName$ = of('John Doe');
}

class MockAppService {
  getCompletedQuotes = jasmine.createSpy('getCompletedQuotes').and.returnValue(of(mockCompletedQuotes));
  getCompletedBreathingExercises = jasmine.createSpy('getCompletedBreathingExercises').and.returnValue(of(mockCompletedExercises));
  getCompletedJournals = jasmine.createSpy('getCompletedJournals').and.returnValue(of(mockCompletedJournals));
}

// Mock SidenavComponent
@Component({ selector: 'app-sidenav', template: '', standalone: true })
class MockSidenavComponent {}

describe('CompletedQuotesComponent', () => {
  let component: CompletedQuotesComponent;
  let fixture: ComponentFixture<CompletedQuotesComponent>;
  let dataService: DataService;
  let appService: AppService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompletedQuotesComponent, MockSidenavComponent], // Add MockSidenavComponent to imports
      providers: [
        { provide: DataService, useClass: MockDataService },
        { provide: AppService, useClass: MockAppService }
      ],
      schemas: [NO_ERRORS_SCHEMA] // Ignore unknown elements and components
    }).compileComponents();

    fixture = TestBed.createComponent(CompletedQuotesComponent);
    component = fixture.componentInstance;
    dataService = TestBed.inject(DataService);
    appService = TestBed.inject(AppService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with completed quotes data', () => {
    // Verify that the component fetches and sets completed quotes data
    expect(appService.getCompletedQuotes).toHaveBeenCalledWith('123');
    expect(component.completedQuotesData).toEqual(mockCompletedQuotes);
  });

  it('should initialize with completed breathing exercises data', () => {
    // Verify that the component fetches and sets completed breathing exercises data
    expect(appService.getCompletedBreathingExercises).toHaveBeenCalledWith('123');
    expect(component.completedBreathingExercisesData).toEqual(mockCompletedExercises);
  });

  it('should initialize with completed journals data', () => {
    // Verify that the component fetches and sets completed journals data
    expect(appService.getCompletedJournals).toHaveBeenCalledWith('123');
    expect(component.completedJournalsData).toEqual(mockCompletedJournals);
  });

  it('should set completedDataState based on DataService', () => {
    // Verify that the component sets the completedDataState based on DataService
    expect(component.completedDataState).toBe('quotes');
  });

  it('should toggle sidenav when toggleSidenav() is called', () => {
    // Call the toggleSidenav method
    component.toggleSidenav();

    // Verify that the DataService's toggleSidenav method was called
    expect(dataService.toggleSidenav).toHaveBeenCalled();
  });

  it('should load completed quotes into component state', () => {
    component.completedDataState = 'quotes';
    fixture.detectChanges();

    expect(component.completedQuotesData.length).toBe(2);
    expect(component.completedQuotesData[0].quote).toBe('Test Quote 1');
  });

  it('should display exercises when completedDataState is "exercises"', () => {
    component.completedDataState = 'exercises';
    fixture.detectChanges();

    // Verify that the exercises are displayed
    const exerciseElements = fixture.nativeElement.querySelectorAll('.list-box');
    expect(exerciseElements.length).toBe(2); // 2 mock exercises
    expect(exerciseElements[0].querySelector('.title').textContent).toBe('Test Exercise 1');
    expect(exerciseElements[1].querySelector('.title').textContent).toBe('Test Exercise 2');
  });

  it('should display journals when completedDataState is "journals"', () => {
    // Set the completedDataState to 'journals'
    component.completedDataState = 'journals';
    fixture.detectChanges();

    // Verify that the journals are displayed
    const journalElements = fixture.nativeElement.querySelectorAll('.list-box');
    expect(journalElements.length).toBe(2); // 2 mock journals
    expect(journalElements[0].querySelector('.title').textContent).toBe('Test Journal 1');
    expect(journalElements[1].querySelector('.title').textContent).toBe('Test Journal 2');
  });
});