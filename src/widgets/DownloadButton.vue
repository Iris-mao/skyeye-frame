<template>
    <div class="download-con" @click="downExcel"><i class="el-icon-download"></i></div>
</template>

<script>
  export default {
    props: ['data','sheetName','title'],
    data() {
      return {
        popoverShow: false,
      }
    },
    methods: {
      downExcel() {
        this.$toExcel(this.data,this.sheetName,this.title)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .download-con {
    position: absolute;
    top: -20px;
    right: 5%;
    z-index: 101;

    .el-icon-download {
      color: #bbb;
      cursor: pointer;
    }
  }

  .switch-con {
    color: #bbb;
    font-size: 15px;
    width: 20px;
    text-align: center;
    height: 20px;
    cursor: pointer;

    .el-icon-arrow-down {
      transition: transform 0.3s ease;
    }

    .popover {
      position: absolute;
      background-color: rgba(64, 74, 89, 0.9);
      padding: 5px 0;
      top: 20px;
      right: 0;
      font-size: 14px;
      line-height: 25px;
      border-radius: 8px;
      opacity: 1;
      color: #fff;
      text-align: left;

      li {
        width: 70px;
        padding: 0 17px;
        transition: all 0.3s ease;
      }

      li:hover {
        color: #E6A23C;
      }
    }
  }

  .download-con .el-icon-download[data-v-1d849773]{
    font-size: 20px;
  }
</style>
