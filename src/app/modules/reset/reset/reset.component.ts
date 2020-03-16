import { Component } from '@angular/core';
import { APIService } from '../../../services/api.service';
import { AlertService } from '../../../services/alert.service';
import { SettingsService } from '../../../services/settings.service';
import { ResetPasswordGQL } from '../../../generated/graphql';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss'],
})
export class ResetComponent {
  resetModel = { email: '' };

  constructor(
    private apiService: APIService,
    private alertService: AlertService,
    private settingsService: SettingsService,
    private resetPasswordGQL: ResetPasswordGQL
  ) {
    this.settingsService.modPageMeta('Reset Password', 'Reset your account\'s password');
  }

  sendReset({ email }) {
    this.resetPasswordGQL.mutate({
      email
    }).subscribe(
      ({ data }) => {
        this.apiService.sendResetEmail(email, data.resetPassword.string).subscribe(
          (data) => {
            const abc = data as any;
            if (abc.result === 'Forgot email sent') {
              this.alertService.alert(
                'Email Sent',
                `Your password reset email has been sent. Please check your inbox for the new password.
                  It might take a minute or two to send.`
              );
            }
          }
        );
      },
      ({ message }) => {
        switch (message) {
          case 'GraphQL error: permission denied for function reset_password':
            this.alertService.alert('Error', 'Cannot reset password while user is logged in');
            break;
          case 'GraphQL error: column "user does not exist" does not exist':
            this.alertService.alert('Error', 'That email doesn\t exist. Check what you entered and try again');
            break;
          default:
            this.alertService.alert('Error', 'Something went wrong. Check your email address and try again');
        }
      }
    );
  }
}
