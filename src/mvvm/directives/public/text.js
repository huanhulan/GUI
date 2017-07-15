/**
 * binder for updating text node and corresponding model
 * which wrapped with double quote in template.
 */
export default (bindName, node, mvvm) => {
    let evtName = `${bindName}_Changed`;
    let type = typeof mvvm.data[bindName];
    let constructor = type === 'number' ? Number : String;

    mvvm._server.on(evtName, (v) => {
        mvvm._change(bindName, constructor(v));
        return node.textContent = v;
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