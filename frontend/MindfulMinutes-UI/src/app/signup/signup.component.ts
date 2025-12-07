import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { CustomModule } from '../custom.module';
import { JsonPipe } from '@angular/common';
import { Signup } from '../models/signup';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { DataService } from '../shared/data.service';
import { AppService } from '../shared/app.service';
import { count, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    HeaderComponent,
    CustomModule,
    JsonPipe,
    HttpClientModule
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
    private apiUrl = environment.apiUrl;
    signedupUserId: string | null = '';
    userName = '';
    signupUser: Signup = { name: "", email: "", password: ""};
    isLogin: boolean = false; // Variable to toggle between signup and login forms
    loginError = false;
    dayCount!: number;
    currentDate!: Date | null;
    lastCompletedDate?: Date | null;
    signupError: boolean = false;

    constructor(private http: HttpClient, private router: Router, private dataService: DataService, private appService: AppService) { }

    ngOnInit() {
        this.currentDate = new Date()
    }

    toggleForm() {
        this.isLogin = !this.isLogin; // Method to toggle the form
        this.loginError = false;
    }

    onSubmit() {
        if (this.isLogin) {
            this.login();
        } else {
            this.signup();
        }
    }

    signup() {
        this.http.post<{ message: string, username: string, userId: string }>(`${this.apiUrl}/api/users/register`, this.signupUser).subscribe(response => {
            // Handle successful signup
            console.log('signup successful: ', response);
            this.signedupUserId = response.userId;
            this.userName = response.username;
            this.dataService.setUserId(this.signedupUserId!);
            this.dataService.setUserName(this.userName)
            // this.appService.getDateCount(this.signedupUserId)
            this.appService.getDateCount(this.signedupUserId).subscribe(count => {
                this.dayCount = count;
                this.dataService.setDayCount(this.dayCount)
            })
            this.router.navigate(['/dashboard']); // Replace with the actual route
        }, error => {
            // Handle error
            this.signupError = true;
            console.error('Signup error', error);
        });
    }

    login() {
        this.http.post<{ token: string, userId: string, username: string }>(`${this.apiUrl}/api/users/login`, { email: this.signupUser.email, password: this.signupUser.password }).subscribe(response => {
            // Handle successful login
            console.log('Login successful:', response);
            localStorage.setItem('token', response.token);
            this.signedupUserId = response.userId;
            this.userName = response.username;
            this.dataService.setUserId(this.signedupUserId);
            this.dataService.setUserName(this.userName)
            // new change - no deletion after completion of 30 days
            this.appService.getDateCount(this.signedupUserId!)?.subscribe(count => {
                this.dayCount = count;
                this.dataService.setDayCount(this.dayCount)
            })
            this.appService.getLastCompletedDate(this.signedupUserId!)?.subscribe(day => {
                this.lastCompletedDate = day;
                const diffInDays = Math.floor((this.currentDate!.getTime() - this.lastCompletedDate!.getTime()) / (1000 * 60 * 60 * 24));
                if (this.lastCompletedDate && this.dayCount < 30) {
                    if (diffInDays > 1) {
                        this.appService.deleteAllCompletedQuotes(this.signedupUserId!).subscribe({
                            next: () => {
                                console.log('All completed quotes deleted')
                            }
                        });
                        this.appService.deleteAllCompletedBreathingExercises(this.signedupUserId!).subscribe({
                            next: () => {
                                console.log('All completed breathing exercises deleted')
                            }
                        });
                        this.appService.deleteAllCompletedJournals(this.signedupUserId!).subscribe({
                            next: () => {
                                console.log('All completed journals deleted')
                            }
                        });
                    }
                    else {
                        this.appService.getDateCount(this.signedupUserId!)?.subscribe(count => {
                            this.dayCount = count;
                            this.dataService.setDayCount(this.dayCount)
                        })
                    }
                }
            })
            
            // this.dataService.setDayCount(this.dayCount);
            this.router.navigate(['/dashboard']); // Replace with the actual route
        }, error => {
            // Handle error
            console.error('Login error', error);
            this.loginError = true;
        });
    }
}
