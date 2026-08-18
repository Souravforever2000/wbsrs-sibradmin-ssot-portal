import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginPage {
  private readonly router = inject(Router);
  username = '';
  password = '';
  login(): void { this.router.navigateByUrl('/'); }
}

// Keep the generated test and downstream imports compatible while the routed page uses a descriptive name.
export { LoginPage as Login };
