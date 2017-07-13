/**
 * binder for updating node and corresponding model
 * which declared by `m-model` in template.
 */
export default (bindName, node, mvvm, type) => {
    let evtName = `${bindName}_Changed`;

    mvvm._server.on(evtName, (v) => {
        node.value = mvvm._data[bindName] = (type === 'number' ? +v : v);
    });

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
    })
}