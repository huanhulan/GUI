import $ from 'jquery'
import EventEmitter2 from 'eventemitter2'
import listenerFactory from '../../util/listenerFactory'

class CounterView {
    constructor(model, element) {
        this._model = model;
        this._element = element;
        this._server = new EventEmitter2();
        // evt for controller to listen
        this.inputChangeEvt = listenerFactory('inputChange', this._server);
        this.increaseBtnClickEvt = listenerFactory('increaseBtnClickEvt', this._server);
        this.decreaseBtnClickEvt = listenerFactory('decreaseBtnClickEvt', this._server);
        this.tmpl = `<div class="counter">
                        <input type="number" name="counter">
                        <div class="btn-group">
                        <button data-name="decrease" class="btn-group__btn btn-group__btn--decrease">-</button>
                        <button data-name="increase" class="btn-group__btn btn-group__btn--increase">+</button></div></div>`
    }

    mount() {
        $(this._element).html(this.tmpl);
        this.refresh();
        this.bindEvt();
        this.attachListener();
    }

    refresh() {
        let input = $(this._element).find('input'),
            count = this._model.getCount();
        input.val(count);
    }

    handleError(str) {
        return window.alert(str);
    }

    attachListener() {
        this._model.decreaseEvt(this.refresh.bind(this));
        this._model.increaseEvt(this.refresh.bind(this));
        this._model.changeEvt(this.refresh.bind(this));
        this._model.errorEvt(this.handleError.bind(this));
    }

    bindEvt() {
        let decreaseBtn = $(this._element).find('button:first'),
            increaseBtn = $(this._element).find('button:last'),
            input = $(this._element).find('input');

        decreaseBtn.click(() => {
            this._server.emit('decreaseBtnClickEvt')
        });
        increaseBtn.click(() => {
            this._server.emit('increaseBtnClickEvt')
        });
        input.change((e) => {
            this._server.emit('inputChange', e.target.value);
        });
    }
}

export default CounterView