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
      username: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: [''],
      confirmPassword: [''],
      age: [''],
      birthDate: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      country: ['', [Validators.required]],
      FavouriteLanguajes: [''],
      profileImg: [''],
      acceptTerms: [false, [Validators.required]],
    });
  }







}
