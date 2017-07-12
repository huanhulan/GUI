/**
 * Created by huanglei13 on 2017/7/11.
 */
import mvc from './mvc'
import mvp from './mvp'
import $ from 'jquery'
import './style/index.scss'

$(() => {
    mvc($('#mvc'));
    mvp($('#mvp'));
});