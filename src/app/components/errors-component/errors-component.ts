import { Component, Input, OnInit } from '@angular/core';
import { Register } from '../../../pages/register/register';
import { pipe } from 'rxjs';

@Component({
  selector: 'app-errors-component',
  standalone: true,
  imports: [],
  templateUrl: './errors-component.html',
  styleUrl: './errors-component.scss',
})
export class ErrorsComponent {

  


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
