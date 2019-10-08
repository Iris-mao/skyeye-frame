<template>
    <el-card :body-style="{ 'padding-bottom': '10px', 'height': '188px', 'font-size': '14px' }" style="margin-bottom: 20px;">
        <div class="header-container">
            <el-tooltip class="item" effect="dark" :content="params.cardTip" placement="bottom-end">
                <div class="card-info">
                    <i class="el-icon-info"></i>
                </div>
            </el-tooltip>
            <div class="card-title">{{ params.cardTitle }}</div>
            <div class="card-date">{{ params.date }} {{params.dateSub ? '|' : ''}} {{params.dateSub}}</div>
        </div>
        <div class="main-container">
            <div class="main-title">{{ params.titleLeft }}</div>
          <div class="main-number">{{ params.numLeft }} <span class="unit">{{params.unit}}</span></div>
        </div>
        <div class="main-container sub" :style="{display : params.displayRight}">
            <div class="main-title">{{ params.titleRight }}</div>
            <div class="main-number">{{ params.numRight }}</div>
        </div>
        <div class="foot-container">
            <div class="foot-part">
                <span class="foot-title">{{ params.titleBtLeft }}</span>
                <span v-show="typeof params.bottomLeft !== 'string'" :class="[ params.bottomLeft > 0 ? 'up-triangle' : 'down-triangle' ]" :style="{display : params.displayIcon}"></span>
                <span class="foot-number">{{ params.displayIcon === 'none'? params.bottomLeft : params.bottomLeftPercent }}</span>
            </div>
            <div class="foot-part text-right">
                <span class="foot-title">{{ params.titleBtRight }}</span>
                <span v-show="typeof params.bottomRight !== 'string'" :class="[ params.bottomRight > 0 ? 'up-triangle' : 'down-triangle' ]" :style="{display : params.displayIcon}"></span>
                <span class="foot-number">{{ params.displayIcon === 'none'? params.bottomRight : params.bottomRightPercent }}</span>
            </div>
        </div>
    </el-card>
</template>

<script>
import {toPercent} from '../common'

export default {
    components: {},
    props: [ 'params' ],
    data() {
        return {}
    },
    created() {},
    mounted() {},
    watch: {},
    computed: {
    },
    methods: {}
}
</script>
<style lang="scss">
.header-container {
    height: 25%;

    .card-title {
        font-size: 16px;
        font-weight: bold;
    }
    .card-date {
        color: #000000a5;
    }
    .card-info {
        float: right;
    }
}
.main-container {
    width: 50%;
    display: inline-block;
    height: 78px;
    padding: 10px 0;

    .main-title {
        color: #0000006d;
    }
    .main-number {
        font-size: 30px;
        color: #000000d8;
        white-space: nowrap;
    }

    &.sub {
        text-align: right;
        height: 58px;

        .main-number {
            font-size: 16px;
            color: #000000d8;
        }
    }
}

.unit{
  font-size: 16px;
  font-weight: normal;
}

.foot-container {
    border-top: 1px solid #e9e9e9;
    padding-top: 10px;
    height: 30px;

    .foot-part {
        width: 50%;
        display: inline-block;
        white-space: nowrap;

        .foot-title {
            color: #0000006d;
            margin-right: 5px;
        }

        .foot-number {
            color: #000000a5;
        }

        .up-triangle + .foot-number,
        .down-triangle + .foot-number {
            margin-left: 5px;
        }

        .up-triangle {
            position: relative;
            top: -13px;
            width: 0;
            height: 0;
            border-style: solid;
            border-width: 0 6px 6px 6px;
            border-color: transparent transparent #f5222d transparent;
        }

        .down-triangle {
            position: relative;
            top: 13px;
            width: 0;
            height: 0;
            border-style: solid;
            border-width: 6px 6px 0 6px;
            border-color: #52c41aa5 transparent transparent transparent;
        }

        &.text-right {
            text-align: right;
            white-space: nowrap;
        }
    }
}
</style>
