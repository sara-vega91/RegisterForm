import { JsonPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ErrorsComponent } from '../../app/components/errors-component/errors-component';





@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe, ErrorsComponent],
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
})





export class Register implements OnInit {

  private fb: FormBuilder = inject(FormBuilder);
  registerForm!: FormGroup;
  profileImgName: string = ''; //variable para mostrar el nombre

  errorMesages: { [key: string]: string } = {
    email: "error en el email",
    username: "debe contener mínimo 2 caracteres",
    password: "Debe contener mínimo 6 caracteres",
    confirmPassword: "debe coincidir con la contraseña",
    tooYoung: "debe tener mínimo 18 años",
    notSame: "la fecha de nacimiento debe coincidir con la edad introducida"
  };

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      age: ['', Validators.min(18)],
      birthDate: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      country: ['', [Validators.required]],
      FavouriteLanguajes: ['', { validators: [this.validateAtLeastOneLanguage()] }],
      profileImg: [null], //OPCIONAL PERO MOSTRAR NOMBRE DEL ARCHIVO
      acceptTerms: [true, [Validators.requiredTrue]],
    }, {
      validators: [
        this.validateSamePassword(),
        this.adultValidator(),
        this.validateAtLeastOneLanguage()
      ],
    });


    // Escuchar cambios en el formulario
    // Cada vez que cambie cualquier campo del formulario, 
    // imprime si el formulario completo es válido.
    // Esto es útil para habilitar/deshabilitar el botón de envío en tiempo real.
    this.registerForm.valueChanges.subscribe(value => {
      console.log('Formulario válido:', this.registerForm.valid);

    });
  }


  // Función validadora personalizada para verificar que las contraseñas coincidan
  private validateSamePassword(): ValidatorFn | null {
    return (control: AbstractControl): ValidationErrors | null => {
      const isSameValue = control.get('confirmPassword')?.value === control.get('password')?.value;

      control.get('confirmPassword')?.setErrors(isSameValue ? null : { notSame: true });

      return isSameValue ? null : { notSame: true };
    };
  }

  //Función para validar que la fecha de nacimiento sea una fecha válida y que el usuario tenga al menos 18 años
  private adultValidator(): ValidatorFn | null {
    return (control: AbstractControl): ValidationErrors | null => {
      const minAge = 18;

      //De todo el formulario, obtener age y birthDate
      const age = control.get('age')?.value;
      const birthDate = control.get('birthDate')?.value;

      // Si no hay birthDate o age, no hacer nada
      if (!birthDate || !age) return null;

      // Formatear la fecha de nacimiento
      const today = new Date();
      const birthDateFormated = new Date(birthDate);

      //Hacemos el cálculo de la edad
      const yearDiff = today.getFullYear() - birthDateFormated.getFullYear();
      const monthDiff = today.getMonth() - birthDateFormated.getMonth();
      const dayDiff = today.getDate() - birthDateFormated.getDate();

      let calculatedAge = yearDiff;
      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        calculatedAge--;
      }

      //Comparar la edad calculada con la edad introducida
      let errorToReturn;

      if (calculatedAge >= minAge) {
        errorToReturn = null;
      } else if (calculatedAge !== minAge) {
        errorToReturn = { notSame: true };
      } else {
        errorToReturn = { tooYoung: true };
      }
      control.get('age')?.setErrors(errorToReturn);
      control.get('birthDate')?.setErrors(errorToReturn);
      return errorToReturn;

    }
  }

  //Función para validar que se elige al menos una opción en FavouriteLanguajes
  private validateAtLeastOneLanguage(): ValidatorFn | null {
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

  public onFileChange(event: any): void {
    const file = event.target.files[0]; // Obtener el archivo seleccionado
    this.registerForm.get('profileImg')?.setValue(file || null);

    if (file) {
      this.registerForm.get('profileImg')?.setValue(file); // Actualizar el valor del formulario
    } else {
      this.registerForm.get('profileImg')?.setValue(null); // Si no hay archivo, limpiar el valor
    }
  }

  public handleSubmit(): void {
    console.log(this.registerForm.value);
    this.registerForm.reset();
  }

  public getMessages(field: string): { hasError: boolean, errors: string[] } | null {
    console.log('field:', field);
    const fieldForm = this.registerForm.get(field);
    if (fieldForm?.errors && fieldForm.touched) {
      console.log(fieldForm?.errors);
      const errorKeys = Object.keys(fieldForm.errors);
      const errorMessages: string[] = [];
      errorKeys.forEach((e: string) => {
        const message = this.errorMesages[e];
        if (message) {
          errorMessages.push(message)
        }
      });
      return { hasError: true, errors: errorMessages };
    } else {
      return null;
    }
  }

}
