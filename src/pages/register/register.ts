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
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      age: ['', [Validators.min(18)]],
      birthDate: ['', [Validators.required]], //falta VALIDADOR ADICIONAL
      gender: ['', [Validators.required]],
      country: ['', [Validators.required]],
      FavouriteLanguajes: [''], //MINIMO 1 SELECCIONADO
      profileImg: [''], //OPCIONAL PERO MOSTRAR NOMBRE DEL ARCHIVO
      acceptTerms: [false, [Validators.requiredTrue]],
    }, {
      validators: [this.validateSamePassword(), this.adultValidator(18)],
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
  // Validador personalizado
  adultValidator(minAge: number): ValidatorFn | null {
    return (control: AbstractControl): ValidationErrors | null => {
      console.log(control.value);
      //obtener la fecha de nacimiento del formulario
      const birthDate = new Date(control.value);
      if (!control.value) return null;

      //Calculamos la edad retandola a la fecha actual
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear(); //año
      const monthDff = today.getMonth() - birthDate.getMonth(); //mes
      if (monthDff < 0 || (monthDff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      //Devolver el error si es demasiado joven 
      return age >= minAge ? null : { tooYoung: true };
    }
  }

  handleSubmit(): void {
    console.log(this.registerForm.value);
    this.registerForm.reset();
  }

}
