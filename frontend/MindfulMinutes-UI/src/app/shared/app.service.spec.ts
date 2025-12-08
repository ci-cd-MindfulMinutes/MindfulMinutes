import { TestBed } from '@angular/core/testing';
import { AppService } from './app.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DataService } from './data.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('AppService', () => {
  let service: AppService;
  let httpMock: HttpTestingController;

  const mockDataService = {
    userId$: of('123')
  };

  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AppService,
        { provide: DataService, useValue: mockDataService },
        { provide: Router, useValue: mockRouter }
      ]
    });

    service = TestBed.inject(AppService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should calculate streak correctly (getDateCount)', () => {
    const mockQuotes = [{ date_completed: '2025-03-20' }];
    const mockBreathing = [{ date_completed: '2025-03-20' }];
    const mockJournals = [{ date_completed: '2025-03-20' }];

    service.getDateCount('123').subscribe(count => {
      expect(count).toBe(1);
    });

    httpMock.expectOne('http://localhost:4000/api/completedQuotes/123').flush(mockQuotes);
    httpMock.expectOne('http://localhost:4000/api/completedBreathingExercises/123').flush(mockBreathing);
    httpMock.expectOne('http://localhost:4000/api/completedJournal/123').flush(mockJournals);
  });

  it('should return last completed date', () => {
  const sameDate = '2025-03-21';

  const mockQuotes = [
    { date_completed: sameDate }
  ];
  const mockExercises = [
    { date_completed: sameDate }
  ];
  const mockJournals = [
    { date_completed: sameDate }
  ];

  service.getLastCompletedDate('123').subscribe(result => {
    expect(result instanceof Date).toBeTrue();
    expect(result?.toISOString().split('T')[0]).toBe(sameDate);
  });

  const qReq = httpMock.expectOne('http://localhost:4000/api/completedQuotes/123');
  const bReq = httpMock.expectOne('http://localhost:4000/api/completedBreathingExercises/123');
  const jReq = httpMock.expectOne('http://localhost:4000/api/completedJournal/123');

  qReq.flush(mockQuotes);
  bReq.flush(mockExercises);
  jReq.flush(mockJournals);
});

  it('should fetch quotes', () => {
    service.getQuote().subscribe();

    const req = httpMock.expectOne('http://localhost:4000/api/quotes/');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should fetch breathing exercises', () => {
    service.getBreathingExercise().subscribe();

    const req = httpMock.expectOne('http://localhost:4000/api/breathingExercise/');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should post journal data', () => {
    const payload = { text: 'test journal' };

    service.postJournal('123', payload).subscribe();

    const req = httpMock.expectOne('http://localhost:4000/api/completedJournal/123');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should fetch completed quotes', () => {
    service.getCompletedQuotes('123').subscribe();

    const req = httpMock.expectOne('http://localhost:4000/api/completedQuotes/123');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should fetch completed breathing exercises', () => {
    service.getCompletedBreathingExercises('123').subscribe();

    const req = httpMock.expectOne('http://localhost:4000/api/completedBreathingExercises/123');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should fetch completed journals', () => {
    service.getCompletedJournals('123').subscribe();

    const req = httpMock.expectOne('http://localhost:4000/api/completedJournal/123');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should mark quote as completed', () => {
    service.markQuoteAsCompleted('123', 'q1', 'test quote').subscribe();

    const req = httpMock.expectOne('http://localhost:4000/api/completedQuotes/123');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should mark breathing exercise as completed', () => {
    service.markBreathingExerciseAsCompleted('123', 'exercise', 'video').subscribe();

    const req = httpMock.expectOne('http://localhost:4000/api/completedBreathingExercises/123');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should delete all completed quotes', () => {
    service.deleteAllCompletedQuotes('123').subscribe();

    const req = httpMock.expectOne('http://localhost:4000/api/completedQuotes/123');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should delete all completed breathing exercises', () => {
    service.deleteAllCompletedBreathingExercises('123').subscribe();

    const req = httpMock.expectOne('http://localhost:4000/api/completedBreathingExercises/123');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should delete all completed journals', () => {
    service.deleteAllCompletedJournals('123').subscribe();

    const req = httpMock.expectOne('http://localhost:4000/api/completedJournal/123');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

});
