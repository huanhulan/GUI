import $ from 'jquery'

/**
 * binder for updating node and corresponding model
 * which declared by `m-model` in template.
 */
export default (bindName, node, mvvm, type) => {
    let evtName = `${bindName}_Changed`;

    mvvm._server.on(evtName, (v) => {
        mvvm._data[bindName] = (type === 'number' ? Number(v) : v);
        return $(node).val(v);
    });

    // also, we need the the keyUp Event
    $(node).on('keyup', (e) => {
        let v = e.target.value;

        // view pass call to the VM
        return mvvm._change(bindName, (type === 'number' ? +v : v));
    }).val(mvvm.data[bindName]);

    Object.defineProperty(mvvm.data, bindName, {
        get(){
            return mvvm._data[bindName];
        },
        set(v){
            if ((type === 'number' &&
                (+v === mvvm._data[bindName])) || (v === mvvm._data[bindName])) {
                return;
            }
            mvvm._server.emit(evtName, v);
        }
    });

    return mvvm._server.emit(evtName, mvvm._data[bindName]);
}