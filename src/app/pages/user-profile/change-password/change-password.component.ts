import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../user.service';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  changePasswordForm: FormGroup;
  currentUser: string;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private session: LocalStorageService
  ) {
    this.changePasswordForm = this.formBuilder.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.currentUser = this.session.retrieve('logged-in');
    if (!this.currentUser) {
      this.router.navigate(['/login']);
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (newPassword !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  onSubmit(): void {
    if (this.changePasswordForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formData = this.changePasswordForm.value;

      // First verify the current password
      this.userService.getUserByUsername(this.currentUser).subscribe(
        res => {
          if (res.status === 200 && res.body[0].password === formData.currentPassword) {
            // Update the password
            this.updatePassword(formData.newPassword);
          } else {
            this.errorMessage = 'Current password is incorrect';
            this.isLoading = false;
          }
        },
        err => {
          console.log(err);
          this.errorMessage = 'Error verifying current password';
          this.isLoading = false;
        }
      );
    }
  }

  updatePassword(newPassword: string): void {
    // Get current user data and update password
    this.userService.getUserByUsername(this.currentUser).subscribe(
      res => {
        if (res.status === 200) {
          const userData = res.body[0];

          this.userService.updateUser(
            userData.username,
            userData.email,
            newPassword, // new password
            userData.profile.bio,
            userData.image,
            userData.profile.interests,
            userData.profile.friends,
            userData.profile.pending_friends || [],
            userData.profile.fandoms || [],
            userData.profile.subscribed || []
          ).subscribe(
            updateRes => {
              this.isLoading = false;
              this.successMessage = 'Password changed successfully!';
              this.changePasswordForm.reset();

              // Redirect back to profile after a short delay
              setTimeout(() => {
                this.router.navigate(['/profile'], { queryParams: { user: this.currentUser } });
              }, 2000);
            },
            updateErr => {
              console.log(updateErr);
              this.isLoading = false;
              this.errorMessage = 'Error updating password. Please try again.';
            }
          );
        }
      },
      err => {
        console.log(err);
        this.isLoading = false;
        this.errorMessage = 'Error retrieving user data';
      }
    );
  }

  onCancel(): void {
    this.router.navigate(['/profile'], { queryParams: { user: this.currentUser } });
  }
}
