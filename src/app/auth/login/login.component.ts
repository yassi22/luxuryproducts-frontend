import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { AuthResponse } from '../auth-response.model';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {PopupComponent} from "../../popup/popup.component";

@Component({
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, PopupComponent], // Voeg PopupComponent toe aan imports
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    public loginForm: FormGroup = new FormGroup({});
    public errorMessage: string | null = null;
    public successMessage: string | null = null;
    public showPopup: boolean = false;
    public popupType: 'success' | 'warning' | 'danger' | 'info' = 'info';

    constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

    ngOnInit() {
        this.loginForm = this.fb.group({
            email: ['', [Validators.email, Validators.required, Validators.maxLength(64), Validators.minLength(5)]],
            password: ['', [Validators.minLength(8), Validators.maxLength(128)]]
        });
    }

    public onSubmit() {
        this.errorMessage = null;
        this.successMessage = null;
        this.showPopup = false;

        this.authService
            .login(this.loginForm.value)
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    this.errorMessage = 'Er is een fout opgetreden bij het inloggen';
                    this.popupType = 'warning';
                    this.showPopup = true;
                    return throwError(() => error);
                })
            )
            .subscribe({
                next: (authResponse: AuthResponse) => {
                    this.successMessage = 'U are now logged in';
                    this.popupType = 'success';
                    this.showPopup = true;
                    setTimeout(() => {
                        this.router.navigate(['/products']);
                    }, 1000);
                },
                error: (error) => {
                    console.error('Login failed:', error);
                    this.errorMessage = 'Fill the right credentials in';
                    this.popupType = 'danger';
                    this.showPopup = true;
                }
            });
    }

    public closePopup() {
        this.showPopup = false;
    }
}
