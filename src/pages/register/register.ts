import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [],
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
})
export class Register {

  registerForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: [''], //falta
      age: ['', [Validators.min(1)]],
      birthDate: ['', [Validators.required]], //falta
      gender: ['', [Validators.required]],
      country: ['', [Validators.required]],
      FavouriteLanguajes: [''],
      profileImg: [''],
      acceptTerms: [false, [Validators.required]],
    });
  }







}
