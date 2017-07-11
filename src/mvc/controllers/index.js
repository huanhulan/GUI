/**
 * The Controller. Controller responds to user actions and
 * invokes changes on the model.
 */
class CounterController {
    constructor(model, view) {
        this._model = model;
        this._view = view;

        // listen events from view
        this._view.inputChangeEvt(this.handleChange.bind(this));
        this._view.increaseBtnClickEvt(this.handleIncrease.bind(this));
        this._view.decreaseBtnClickEvt(this.handleDecrease.bind(this));
    }

    handleIncrease() {
        this._model.increase();
    }

    handleDecrease() {
        this._model.decrease();
    }

    handleChange(input) {
        console.log(input)
        this._model.change(input);
    }
}

export default CounterController