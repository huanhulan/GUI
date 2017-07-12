/**
 * Presenters perform any work to do with user requests
 * and pass data back to them.
 * In this respect, they retrieve data, manipulate it
 * and determine how the data should be displayed in the view.
 */
class CounterPresenter {
    constructor(model, view) {
        this._model = model;
        this._view = view;
    }

    init() {
        this._view.setPresenter(this);
        this._view.mount();
        this.observeModel();
        this.setCount();
    }

    onDecreaseBtnClick() {
        this._model.decrease();
    }

    onIncreaseBtnClick() {
        this._model.increase();
    }

    onChange(e) {
        return this._model.change(+this._view.getValue());
    }

    observeModel() {
        return this._model.changeEvt(() => {
            this.setCount();
        })
    }

    setCount() {
        this._view.setValue(this._model.getCount());
    }
}

export default CounterPresenter