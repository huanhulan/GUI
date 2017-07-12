/**
 * Created by huanhulan on 2017/7/12.
 */
import counterModel from './models'
import counterView from './views'
import counterPresenter from './presenters'

const MountApp = (element) => {
    let view = new counterView(element),
        model = new counterModel(),
        presenter = new counterPresenter(model, view);
    console.log('---MVP---');
    console.log('before app mount!');
    presenter.init();
    return console.log('app mounted successfully!');
};

export default MountApp