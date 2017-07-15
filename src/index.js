/**
 * Created by huanhulan on 2017/7/11.
 */
import mvc from './mvc'
import mvp from './mvp'
import mvvm from './mvvm'
import $ from 'jquery'
import './style/index.scss'

$(() => {
    mvc($('#mvc'));
    mvp($('#mvp'));

    let app = new mvvm({
        template: `<div class="counter">
            <input type="number" name="counter" class="counter__input" m-model="count">
            <div class="btn-group">
                <button @click="handleMinusClick" class="btn-group__btn btn-group__btn--decrease" :style="color">-</button>
                <button @click="handlePlusClick" class="btn-group__btn btn-group__btn--increase" :style="color">+</button>
            </div>
        </div>
        <p>{{count}}</p>`,
        data: {
            count: 0,
            color: 'background-color:red'
        },
        beforeMount(){
            console.log('---MVVM---');
        },
        afterMount(){
            console.log('app mounted successfully!');
        },
        methods: {
            handleMinusClick(e){
                this.data.count -= 1;
            },
            handlePlusClick(e){
                this.data.count += 1;
            }
        },
        watch: {
            count(newValue){
                console.log('new count value is:', newValue);
            }
        }

    });
    app.mount('#mvvm');
});