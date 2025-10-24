import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Register } from '../pages/register/register';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Register],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  protected readonly title = ('form-register');
}
