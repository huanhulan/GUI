/**
 * Created by huanglei13 on 2017/7/11.
 */
import counterModel from './models'
import counterView from './views'
import counterController from './controllers'

function mountApp(element) {
    console.log('before app mount!');
    let model = new counterModel(),
        view = new counterView(model,element),
        controller = new counterController(model,view);
    return view.mount();
    console.log('app mounted successfully!');
}

export default mountApp