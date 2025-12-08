import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { DataService } from '../shared/data.service';
import { AppService } from '../shared/app.service';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { NgIf, NgClass } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';


const mockCompletedQuotes = [
  { date_completed: new Date().toISOString(), quote: 'Test Quote', _id: 'q1' }
];

const mockCompletedExercises = [
  { date_completed: new Date().toISOString(), exercise_title: 'Test Exercise' }
];

const mockCompletedJournals = [
  { date_completed: new Date().toISOString(), journal_content: 'Test Journal' }
];


class MockDataService {
  userId$ = of('123');
  userName$ = of('Test User');
  dayCount$ = of(1);
  sidenavState$ = of(false);

  toggleSidenav = jasmine.createSpy('toggleSidenav');
  setDayCount = jasmine.createSpy('setDayCount');
}

class MockAppService {
  getCompletedQuotes = jasmine.createSpy().and.returnValue(of(mockCompletedQuotes));
  getCompletedBreathingExercises = jasmine.createSpy().and.returnValue(of(mockCompletedExercises));
  getCompletedJournals = jasmine.createSpy().and.returnValue(of(mockCompletedJournals));

  getQuote = jasmine.createSpy().and.returnValue(of([
    { quote_text: 'Test Quote', _id: 'q1' }
  ]));

  getBreathingExercise = jasmine.createSpy().and.returnValue(of([
    {
      exercise_title: 'Test Exercise',
      exercise_description: 'Test Description',
      video_url: 'test-url'
    }
  ]));

  markQuoteAsCompleted = jasmine.createSpy().and.returnValue(of({}));
  markBreathingExerciseAsCompleted = jasmine.createSpy().and.returnValue(of({}));
  postJournal = jasmine.createSpy().and.returnValue(of({}));
  getDateCount = jasmine.createSpy().and.returnValue(of(1));
}


describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let dataService: DataService;
  let appService: AppService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DashboardComponent,
        FormsModule,
        NgIf,
        NgClass
      ],
      providers: [
        { provide: DataService, useClass: MockDataService },
        { provide: AppService, useClass: MockAppService },
        DomSanitizer
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    dataService = TestBed.inject(DataService);
    appService = TestBed.inject(AppService);

    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize user data from DataService', () => {
    expect(component.userId).toBe('123');
    expect(component.username).toBe('Test User');
    expect(component.day_count).toBe(1);
  });

  it('should check completion status on init', () => {
    expect(appService.getCompletedQuotes).toHaveBeenCalledWith('123');
    expect(appService.getCompletedBreathingExercises).toHaveBeenCalledWith('123');
    expect(appService.getCompletedJournals).toHaveBeenCalledWith('123');
  });


  it('should toggle sidenav', () => {
    component.toggleSidenav();
    expect(dataService.toggleSidenav).toHaveBeenCalled();
  });

  it('should open quote popup and fetch quote successfully', () => {
  component.quoteCompletedToday = false;
  component.day_count = 1;

  component.openPopup('quote');

  expect(appService.getQuote).toHaveBeenCalled();
  expect(component.isQuote).toBeTrue();
  expect(component.isPopupOpen).toBeTrue();
});

it('should mark quote as completed on closePopup', () => {
  component.isQuote = true;
  component.isQuoteFetched = true;
  component.quoteCompletedToday = false;

  component.quoteData = {
    _id: 'q1',
    quote_text: 'Test Quote'
  };

  component.closePopup();

  expect(appService.markQuoteAsCompleted)
    .toHaveBeenCalledWith('123', 'q1', 'Test Quote');

  expect(component.quoteCompletedToday).toBeTrue();
});

it('should open breathing exercise popup successfully', () => {
  component.exerciseCompletedToday = false;
  component.day_count = 1;

  component.openPopup('exercise');

  expect(appService.getBreathingExercise).toHaveBeenCalled();
  expect(component.isBreathingExercise).toBeTrue();
  expect(component.isPopupOpen).toBeTrue();
});

it('should mark exercise as completed on closePopup', () => {
  component.isBreathingExercise = true;
  component.isExerciseFetched = true;
  component.exerciseCompletedToday = false;

  component.exerciseData = {
    exercise_title: 'Test Exercise',
    videoUrl: 'test-url'
  };

  component.closePopup();

  expect(appService.markBreathingExerciseAsCompleted)
    .toHaveBeenCalledWith('123', 'Test Exercise', 'test-url');

  expect(component.exerciseCompletedToday).toBeTrue();
});

it('should show 30-day completion message when day_count >= 30', () => {
  component.day_count = 30;

  component.openPopup('quote');

  expect(component.popupTitle).toBe('Already Completed');
  expect(component.isPopupOpen).toBeTrue();
});


  it('should open journal popup', () => {
    component.journalCompletedToday = false;
    component.openPopup('journal');

    expect(component.isPopupOpen).toBeTrue();
    expect(component.isJournal).toBeTrue();
  });


  it('should submit journal successfully', () => {
    component.journalEntry = 'My journal note';

    component.submitJournal();

    expect(appService.postJournal).toHaveBeenCalledWith('123', {
      journal_content: 'My journal note'
    });

    expect(component.journalCompletedToday).toBeTrue();
  });
});
