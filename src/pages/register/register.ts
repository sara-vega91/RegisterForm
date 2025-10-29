import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import e from 'express';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
})
export class Register implements OnInit {

  private fb: FormBuilder = inject(FormBuilder);
  registerForm!: FormGroup;

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6), this.validateSamePassword()]],
      age: [''],
      birthDate: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      country: ['', [Validators.required]],
      FavouriteLanguajes: ['', { validators: [this.validateAtLeastOneLanguage()] }],
      profileImg: [null], //OPCIONAL PERO MOSTRAR NOMBRE DEL ARCHIVO
      acceptTerms: [true, [Validators.requiredTrue]],
    }, {
      validators: [this.validateSamePassword(), this.adultValidator(), this.validateAtLeastOneLanguage()],
    });


    // Escuchar cambios en el formulario
    //Cada vez que cambie cualquier campo del formulario, 
    // imprime si el formulario completo es válido.
    // Esto es útil para habilitar/deshabilitar el botón de envío en tiempo real.
    this.registerForm.valueChanges.subscribe(value => {
      console.log('Formulario válido:', this.registerForm.valid);

    });
  }


  // Función validadora personalizada para verificar que las contraseñas coincidan
  validateSamePassword(): ValidatorFn | null {
    return (control: AbstractControl): ValidationErrors | null => {
      const isSameValue = control.get('confirmPassword')?.value === control.get('password')?.value;
      if (isSameValue) {
        control.get('confirmPassword')?.setErrors(null);
        control.get('password')?.setErrors(null);
        return null;
      } else {
        control.get('confirmPassword')?.setErrors({ notSame: true });
        control.get('password')?.setErrors({ notSame: true });
        return { notSame: true };
      }
    };
  }

  //Función para validar que la fecha de nacimiento sea una fecha válida y que el usuario tenga al menos 18 años
  adultValidator(): ValidatorFn | null {
    return (control: AbstractControl): ValidationErrors | null => {
      const minAge = 18;


      //De todo el formulario, obtener age y birthDate
      let age = control.get('age')?.value;
      const birthDate = control.get('birthDate')?.value;

      // Si no hay birthDate o age, no hacer nada
      if (!birthDate || !age) return null;

      // Formatear la fecha de nacimiento
      const today = new Date();
      const birthDateFormated = new Date(birthDate);

      //Hacemos el cálculo de la edad
      let yearDiff = today.getFullYear() - birthDateFormated.getFullYear();
      const monthDiff = today.getMonth() - birthDateFormated.getMonth();
      const dayDiff = today.getDate() - birthDateFormated.getDate();

      let calculatedAge = yearDiff;
      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        calculatedAge--;
      }

      //Comparar la edad calculada con la edad introducida
      if (calculatedAge >= minAge) {
        control.get('age')?.setErrors(null);
        control.get('birthDate')?.setErrors(null);
        return null;
      } else if (calculatedAge !== minAge) {
        control.get('age')?.setErrors({ notSame: true });
        control.get('birthDate')?.setErrors({ notSame: true });
      } else {
        control.get('age')?.setErrors({ tooYoung: true });
        control.get('birthDate')?.setErrors({ tooYoung: true });
        return { tooYoung: true };
      }
      return null;
    }

  }

  //Función para validar que se elige al menos una opción en FavouriteLanguajes
  validateAtLeastOneLanguage(): ValidatorFn | null {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      //si es array, comprobar que al menos uno esté seleccionado
      if (Array.isArray(value) && value.length > 0) {
        return null;
      }
      //si no es array o está vacío, pero tiene algun valor, devolver null
      if (!Array.isArray(value) && value) {
        return null;
      }
      return { atLeastOne: true }; // Error si no hay nada seleccionado 
    };
  }

  profileImgName: string = ''; //variable para mostrar el nombre

  onFileChange(event: any): void {
    const file = event.target.files[0]; // Obtener el archivo seleccionado
    this.registerForm.get('profileImg')?.setValue(file || null);

    if (file) {
      this.registerForm.get('profileImg')?.setValue(file); // Actualizar el valor del formulario
    } else {
      this.registerForm.get('profileImg')?.setValue(null); // Si no hay archivo, limpiar el valor
    }
  }

  handleSubmit(): void {
    console.log(this.registerForm.value);
    this.registerForm.reset();
  }

}
