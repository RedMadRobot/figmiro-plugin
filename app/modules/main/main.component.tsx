import React from 'react';
import cn from 'classnames';
import {connect} from 'helpers/connect';
import {RootController} from 'rootController';
import {AuthWrapComponent} from 'modules/auth-wrap';
import {SettingsComponent} from 'modules/settings';
import {InfoComponent} from 'modules/info';
import {AppMenuItem} from 'modules/menu';
import {Loader} from 'components/loader';
import {Layout, MenuItems} from 'components/layout';
import styles from './main.component.sass';

@connect
export class MainComponent extends React.Component {
  render(): React.ReactNode {
    const {
      settingsController: {fetching: syncFetching},
      mainController: {fetching},
      menuController: {changeAppMenuItem, selectedAppMenuItem}
    } = this.rootController;
    return (
      <div className={cn(styles.container, {[styles['is-sync']]: syncFetching})}>
        {fetching ?
          <Loader/> :
          <Layout
            menuItems={this.menuItems}
            onMenuItemClick={changeAppMenuItem}
            currentMenuItemId={selectedAppMenuItem}
          >
            {this.currentView}
          </Layout>
        }
      </div>
    );
  }

  async componentDidMount(): Promise<void> {
    const {
      authController,
      infoController,
      mainController: {initialFetch},
      menuController: {changeAppMenuItem}
    } = this.rootController;
    await initialFetch();

    if (!infoController.isInfoShown) {
      infoController.setInfoShownStatus();
      changeAppMenuItem(AppMenuItem.INFO);
      return;
    }

    if (authController.isAuth) {
      changeAppMenuItem(AppMenuItem.SYNC);
      return;
    }
  }

  private get currentView(): React.ReactNode {
    const {selectedAppMenuItem} = this.rootController.menuController;
    const mapper = {
      [AppMenuItem.ACCOUNT]: <AuthWrapComponent/>,
      [AppMenuItem.SYNC]: <SettingsComponent/>,
      [AppMenuItem.INFO]: <InfoComponent/>
    };
    return mapper[selectedAppMenuItem];
  }

  private get menuItems(): MenuItems {
    const {
      authController: {isAuth}
    } = this.rootController;
    const labelMapper = {
      [AppMenuItem.ACCOUNT]: 'Account',
      [AppMenuItem.INFO]: 'Info',
      [AppMenuItem.SYNC]: 'Sync'
    };
    const disabledIfUnauth = [
      AppMenuItem.SYNC
    ];
    const sortOrder = [
      AppMenuItem.SYNC,
      AppMenuItem.INFO,
      AppMenuItem.ACCOUNT
    ];
    return this.rootController.menuController.appMenuItems
      .map(item => ({
        id: item,
        label: labelMapper[item],
        isDisabled: !isAuth && disabledIfUnauth.includes(item)
      }))
      .sort((item, another) =>
        sortOrder.indexOf(item.id) - sortOrder.indexOf(another.id)
      );
  }

  private get rootController(): RootController {
    return this.props as RootController;
  }
}
