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
        this.data = $.extend({}, this.options.data);
        Object.defineProperty(this, '_data', {
            enumerable: false,
            value: Object.create(null)
        });
        this._server = new EventEmitter2();
        Object.keys(this.options.watch).forEach((evt) => {
            if (isFunction(this.options.watch[evt])) {
                return this._server.on(evt, this.options.watch[evt])
            }
        });
    }

    mount(element) {
        $(element).append(compiler(this, this.options.template));
        if (this.options.ready && isFunction(this.options.ready)) {
            return this.options.ready.apply(this);
        }
    }
}

export default MVVM