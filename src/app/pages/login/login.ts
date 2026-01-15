import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { ActivatedRoute, Router, RouterModule } from '@angular/router'
import { AuthService } from '../../services/auth.service'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  loginForm!: FormGroup;
  registerForm!: FormGroup;
  isLoginMode = true;
  loading = false;
  submitted = false;
  errorMessage = '';
  returnUrl = '/my-pet';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/my-pet';

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { 
      validators: this.passwordMatchValidator 
    });
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  get lf() {
    return this.loginForm.controls;
  }

  get rf() {
    return this.registerForm.controls;
  }

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
    this.submitted = false;
  }

  onLoginSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    this.authService.login(this.loginForm.value).subscribe({
      next: (user) => {
        this.loading = false;
        this.router.navigate([this.returnUrl]);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Invalid email or password. Try admin@pet.com / password';
        console.error('Login error:', error);
      }
    });
  }

  onRegisterSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;

    const { username, email, password } = this.registerForm.value;

    this.authService.register({ username, email, password }).subscribe({
      next: (user) => {
        this.loading = false;
        this.router.navigate([this.returnUrl]);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Registration failed. Please try again.';
        console.error('Register error:', error);
      }
    });
  }

  get loginEmail() {
  return this.loginForm.get('email')
}

  get loginPassword() {
    return this.loginForm.get('password')
  }

  get registerUsername() {
    return this.registerForm.get('username')
  }

  get registerEmail() {
    return this.registerForm.get('email')
  }

  get registerPassword() {
    return this.registerForm.get('password')
  }

  get registerConfirmPassword() {
    return this.registerForm.get('confirmPassword')
  }
}