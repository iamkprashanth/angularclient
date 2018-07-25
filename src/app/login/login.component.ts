import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Errors, UserService } from '../core';

@Component({
  selector: 'app-login-page',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  errors: Errors = { errors: {} };
  errorMessage : String;
  authForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    // use FormBuilder to create a form group
    this.authForm = this.fb.group({
      usernameOrEmail: ['prashanthppk', [Validators.required, Validators.minLength(4), Validators.maxLength(15)]],
      password: ['prashanthppk', Validators.required]
    });
  }

  ngOnInit() { }

  submitForm() {
    console.log(this.authForm.value);

    this.errors = { errors: {} };

    const credentials = this.authForm.value;
    this.userService
      .attemptAuth(credentials)
      .subscribe(
        data => { 
          this.userService.setAuth(data)
            .subscribe(
              data => this.router.navigateByUrl('/'),
              err => {
                console.log('err',err);
                this.errors = err; }
            );
        },
        err => {        
          this.errors = err;
          console.log('error',err );
          if(err.status == 401 && err.error== "Unauthorized"){
            this.errorMessage='Bad credentials';
          } 
        }
      );
  }
}
