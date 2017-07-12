import EventEmitter2 from 'eventemitter2'
import listenerFactory from '../../util/listenerFactory'

/**
 * The Model. Model stores items and notifies
 * observers about changes.
 * Remain the same functionality and the same
 * structure as in MVC
 */
class CounterModel {
    constructor() {
        this._count = 0;
        this._server = new EventEmitter2();
        // evt for presenters to listen
        this.changeEvt = listenerFactory('change', this._server);
        this.errorEvt = listenerFactory('error', this._server);
    }

    getCount() {
        return this._count;
    }

    // public methods for controller to call
    increase() {
        this._count += 1;
        this._server.emit('change');
    }

    decrease() {
        this._count -= 1;
        this._server.emit('change');
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