/**
 * Created by huanhulan on 2017/7/11.
 */
import counterModel from './models'
import counterView from './views'
import counterController from './controllers'

function mountApp(element) {
    console.log('---MVC---');
    console.log('before app mount!');
    let model = new counterModel(),
        view = new counterView(model, element),
        controller = new counterController(model, view);

    view.mount();
    return console.log('app mounted successfully!');
}

export default mountApp