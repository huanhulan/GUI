import EventEmitter2 from 'eventemitter2'
import listenerFactory from '../../util/listenerFactory'

/**
 * The Model. Model stores items and notifies
 * observers about changes.
 */
class CounterModel {
    constructor() {
        this._count = 0;
        this._server = new EventEmitter2();
        // evt for views to listen
        this.decreaseEvt = listenerFactory('decrease', this._server);
        this.increaseEvt = listenerFactory('increase', this._server);
        this.changeEvt = listenerFactory('change', this._server);
        this.errorEvt = listenerFactory('error', this._server);
    }

    getCount() {
        return this._count;
    }

    // public methods for controller to call
    increase() {
        this._count += 1;
        this._server.emit('increase');
    }

    decrease() {
        this._count -= 1;
        this._server.emit('decrease');
    }

    error(str) {
        this._server.emit('error', str);
    }

    change(input) {
        let tmp = +input;
        if (Number.isInteger(tmp)) {
            this._count = tmp;
            return this._server.emit('change');
        } else {
            return this.error(`${input} is not an integer`);
        }
    }
}

export default CounterModel