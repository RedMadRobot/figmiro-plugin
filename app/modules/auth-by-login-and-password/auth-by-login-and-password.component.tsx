import React from 'react';
import cn from 'classnames';
import {resize} from 'helpers/resize';
import {connect} from 'helpers/connect';
import {getErrorMessage} from 'helpers/getErrorMessage';
import {RootController} from 'rootController';
import {Input} from 'components/input';
import {Button, ButtonMode} from 'components/button';
import {AuthByLoginAndPasswordErrorType} from './auth-by-login-and-password.errors';
import styles from './auth-by-login-and-password.component.sass';
import {Link} from 'components/link/link.component';

const INITIAL_HEIGHT = 320;

@connect
export class AuthByLoginAndPasswordComponent extends React.Component {
  render(): React.ReactNode {
    const {
      fetching,
      changeEmail,
      changePassword,
      isLoginDisabled
    } = this.controller;
    return (
      <form
        className={cn(styles.container, {
          [styles['is-email-error']]: this.isEmailError,
          [styles['is-common-error']]: this.isCommonError
        })}
        onSubmit={this.onSubmit}
      >
        <Input
          placeholder="Email"
          onChange={changeEmail}
          className={cn(styles.input, styles['email-input'])}
          isError={this.isEmailError || this.isCommonError}
        />
        <div className={cn(styles.error, styles['email-error'])}>{this.error}</div>
        <Input
          placeholder="Password"
          type="password"
          onChange={changePassword}
          className={styles.input}
          isError={this.isCommonError}
        />
        <div className={styles.mention}>
          To get or recover a password, go to <Link href="https://miro.com/recover/"/>
        </div>
        <div className={cn(styles.error, styles['common-error'])}>{this.error}</div>
        <Button
          type="submit"
          mode={ButtonMode.PRIMARY}
          disabled={isLoginDisabled}
          fetching={fetching}
        >
          Login
        </Button>
      </form>
    );
  }

  componentDidMount(): void {
    resize({height: INITIAL_HEIGHT});
  }

  componentDidUpdate(): void {
    if (this.isCommonError) {
      resize({height: 352});
    } else if (this.isEmailError) {
      resize({height: 328});
    } else {
      resize({height: INITIAL_HEIGHT});
    }
  }

  private onSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    await this.controller.login();
  };

  private get error(): string | undefined {
    const {error} = this.controller;
    if (!error) return;
    return getErrorMessage<AuthByLoginAndPasswordErrorType>(
      {
        [AuthByLoginAndPasswordErrorType.EMAIL_IS_NOT_CORRECT]: 'Email is incorrect',
        [AuthByLoginAndPasswordErrorType.AUTHORIZATION_FAILED]: 'Authorization failed, check your email and password',
        [AuthByLoginAndPasswordErrorType.PASSWORD_NOT_SET]: 'User password is not set'
      },
      error
    );
  }

  private get isEmailError(): boolean {
    return !!this.error && this.controller.isEmailError;
  }

  private get isCommonError(): boolean {
    return !!this.error && !this.controller.isEmailError;
  }

  private get controller() {
    return (this.props as RootController).authByLoginAndPasswordController;
  }
}