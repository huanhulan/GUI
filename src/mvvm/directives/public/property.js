/**
 * binder for updating a node's property and corresponding model
 * which declared by `:*` in template.
 */
export default (bindName, node, mvvm, propertyName) => {
    let evtName = `${bindName}_Changed`;

    mvvm._server.on(evtName, (v) => {
        node.setAttribute(propertyName, v);
        return mvvm._change(bindName, v);
    });

    Object.defineProperty(mvvm.data, bindName, {
        get(){
            return mvvm._data[bindName];
        },
        set(v){
            if (v === mvvm._data[bindName]) return;
            mvvm._server.emit(evtName, v);
        }
    });

    return mvvm._server.emit(evtName, mvvm._data[bindName]);
}