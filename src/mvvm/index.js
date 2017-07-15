/**
 * The constructor of the `MVVM` framework.
 * Mainly do the `VM` stuffs.
 */
import $ from 'jquery'
import compiler from './compiler'
import EventEmitter2 from 'eventemitter2'
import isFunction from '../util/isFunction'

class MVVM {
    constructor(config) {
        this.options = Object.assign({
            template: '',
            style: '',
            data: {},
            watch: {},
            // components: {}
        }, config);
        this.data = JSON.parse(JSON.stringify(this.options.data));

        Object.defineProperty(this, '_data', {
            enumerable: false,
            value: JSON.parse(JSON.stringify(this.data))
        });

        this._server = new EventEmitter2();
        Object.keys(this.options.watch).forEach((field) => {
            let evt = field + '_Changed';

            if (isFunction(this.options.watch[field])) {
                return this._server.on(evt, this.options.watch[field])
            }
        });
    }

    mount(element) {
        if (this.options.beforeMount && isFunction(this.options.beforeMount)) {
            this.options.beforeMount.apply(this);
        }

        $(element).append(compiler(this, this.options.template));

        if (this.options.afterMount && isFunction(this.options.afterMount)) {
            this.options.afterMount.apply(this);
        }
        return this;
    }

    _change(bindName, newData) {
        return this.data[bindName] = newData;
    }
}

export default MVVM