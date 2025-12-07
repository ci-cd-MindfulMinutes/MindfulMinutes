import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, map, Observable, tap } from 'rxjs';
import { DataService } from './data.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private apiUrl = environment.apiUrl;
  // dateCount: number = 0;
  userId: string | null = null;
  constructor(private http: HttpClient, private router: Router, private dataService: DataService) { }

  ngOnInit() {
    this.dataService.userId$.subscribe(id => {
      this.userId = id
    })
  }

  getDateCount(userId: string): Observable<number> {
    return forkJoin({
      quotes: this.http.get<any[]>(`${this.apiUrl}/api/completedQuotes/${userId}`),
      breathing: this.http.get<any[]>(`${this.apiUrl}/api/completedBreathingExercises/${userId}`),
      journals: this.http.get<any[]>(`${this.apiUrl}/api/completedJournal/${userId}`)
    }).pipe(
      map(({ quotes, breathing, journals }) => {
        // Convert dates into day (DD) sets for fast lookup
        const quoteDays = new Set(quotes.map(q => new Date(q.date_completed).getUTCDate()));
        const breathingDays = new Set(breathing.map(b => new Date(b.date_completed).getUTCDate()));
        const journalDays = new Set(journals.map(j => new Date(j.date_completed).getUTCDate()));
  
        // Find common days where all activities are completed
        const completedAllDays = [...quoteDays]
          .filter(day => breathingDays.has(day) && journalDays.has(day))
          // .sort((a, b) => a - b); // Sort numerically (by day)
  
        if (completedAllDays.length === 0) return 0; // No streak if no full days exist
  
        // Streak Calculation
        let streak = 1; // Start with 1 if at least one valid day exists
        if (completedAllDays[completedAllDays.length - 1] != Array.from(quoteDays).pop())
          streak = 0;
        else {
          for (let i = 0; i <= completedAllDays.length; i++) {
            if (completedAllDays[i] === completedAllDays[i + 1] - 1 || completedAllDays[i] === completedAllDays[i + 1] + 29 || completedAllDays[i] === completedAllDays[i + 1] + 30) {
              streak++; // Continue streak if days are consecutive
            }
            else if (completedAllDays[i] !== completedAllDays[i + 1] - 1 && i === completedAllDays.length - 2) {
              streak = 0;
            }
            // else {
            //   streak = 0;
            // }
          }
        }
        return streak;
      })
    );
  }

  getLastCompletedDate(userId: string): Observable<Date | null> {
    return forkJoin({
      quotes: this.http.get<any[]>(`${this.apiUrl}/api/completedQuotes/${userId}`),
      breathing: this.http.get<any[]>(`${this.apiUrl}/api/completedBreathingExercises/${userId}`),
      journals: this.http.get<any[]>(`${this.apiUrl}/api/completedJournal/${userId}`)
    }).pipe(
      map(({ quotes, breathing, journals }) => {
        // Convert dates into day (DD) sets for fast lookup
        const quoteDays = new Set(quotes.map(q => new Date(q.date_completed).toISOString().split('T')[0]));
        const breathingDays = new Set(breathing.map(b => new Date(b.date_completed).toISOString().split('T')[0]));
        const journalDays = new Set(journals.map(j => new Date(j.date_completed).toISOString().split('T')[0]));
  
        // Find common days where all activities are completed
        const completedAllDays = [...quoteDays]
          .filter(date => breathingDays.has(date) && journalDays.has(date))
          .sort((a, b) => new Date(a).getTime() - new Date(b).getTime()); // Sort numerically (by date)
        
          return completedAllDays.length > 0 ? new Date(completedAllDays[completedAllDays.length - 1]) : null;
      })
    );
  }
  
  getQuote(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/quotes/`);
  }
  getBreathingExercise(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/breathingExercise/`);
  }
  postJournal(user_id: string, journalData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/completedJournal/${user_id}`, journalData);
  }
  getCompletedQuotes(user_id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/completedQuotes/${user_id}`);
  }
  getCompletedBreathingExercises(user_id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/completedBreathingExercises/${user_id}`);
  }
  getCompletedJournals(user_id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/completedJournal/${user_id}`);
  }
  markQuoteAsCompleted(user_id: string, quoteId: string, quote: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/completedQuotes/${user_id}`, { quoteId, quote }).pipe(
      tap(response => console.log(response, "-- Quote marked as completed")));
  }
  markBreathingExerciseAsCompleted(user_id: string, exercise_title: string, videoUrl: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/completedBreathingExercises/${user_id}`, {exercise_title, videoUrl }).pipe(
      tap(response => console.log(response, "-- Breathing exercise marked as completed")));
  }
  deleteAllCompletedQuotes(user_id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/completedQuotes/${user_id}`);
  }
  deleteAllCompletedBreathingExercises(user_id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/completedBreathingExercises/${user_id}`);
  }
  deleteAllCompletedJournals(user_id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/completedJournal/${user_id}`);
  }
}
