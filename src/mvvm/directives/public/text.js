import $ from 'jquery'
/**
 * binder for updating text node and corresponding model
 * which wrapped with double quote in template.
 */
export default (bindName, node, mvvm) => {
    let evtName = `${bindName}_Changed`;

    mvvm._server.on(evtName, (v) => {
        mvvm._data[bindName] = v;
        $(node).text(v);
    });

    Object.defineProperty(mvvm.data, bindName, {
        get(){
            return mvvm._data[bindName];
        },
        set(v){
            if (v === mvvm._data[bindName]) return;
            mvvm._server.emit(evtName, v);
        }
    })
}