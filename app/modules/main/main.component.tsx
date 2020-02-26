import React from 'react';
import {connect} from 'helpers/connect';
import {RootController} from 'rootController';
import {AuthComponent} from 'modules/auth';
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
      mainController: {fetching},
      menuController: {changeAppMenuItem, selectedAppMenuItem}
    } = this.rootController;
    return (
      <div className={styles.container}>
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

  async componentDidMount() {
    await this.rootController.mainController.initialFetch();
  }

  private get currentView(): React.ReactNode {
    const {selectedAppMenuItem} = this.rootController.menuController;
    const mapper = {
      [AppMenuItem.ACCOUNT]: <AuthComponent/>,
      [AppMenuItem.SYNC]: <SettingsComponent/>,
      [AppMenuItem.INFO]: <InfoComponent/>
    };
    return mapper[selectedAppMenuItem];
  }

  private get menuItems(): MenuItems {
    const labelMapper = {
      [AppMenuItem.ACCOUNT]: 'Account',
      [AppMenuItem.INFO]: 'Info',
      [AppMenuItem.SYNC]: 'Sync'
    };
    const sortOrder = [
      AppMenuItem.SYNC,
      AppMenuItem.INFO,
      AppMenuItem.ACCOUNT
    ];
    return this.rootController.menuController.appMenuItems
      .map(item => ({
        id: item,
        label: labelMapper[item]
      }))
      .sort((item, another) =>
        sortOrder.indexOf(item.id) - sortOrder.indexOf(another.id)
      );
  }

  private get rootController(): RootController {
    return this.props as RootController;
  }
}
