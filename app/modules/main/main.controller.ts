import {observable, action} from 'mobx';
import {IController} from 'utils/Controller';
import {RootController} from 'rootController';

export class MainController implements IController {
  @observable fetching = false;
  constructor(private readonly rootController: RootController) {}

  @action.bound async initialFetch(): Promise<void> {
    try {
      this.fetching = true;
      await Promise.all([
        this.rootController.authController.checkToken(),
        this.rootController.iconsController.fetchIcons()
      ]);
    } catch (e) {
      console.log(e);
    } finally {
      this.fetching = false;
    }
  }

  reset(): void {
    this.fetching = false;
  }
}
