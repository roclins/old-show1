<template>
  <el-container style="width: 100%-220px">
    <el-container>
      <el-aside width="50%"
        ><ve-gauge-chart :data="chartData" :settings="chartSettings" />
        <div class="rate-text">昨日评分</div></el-aside
      >
      <el-main class="userindex-main">
        <div class="alert-display">
          <font class="alert-number">{{ alertcount }}</font>
          次
        </div>
        <div class="warning-text">上周警告</div>
      </el-main>
    </el-container>
    <el-footer class="userindex-footer">
      <font class="userindex-status-title">{{old}}当前认知状态</font>
      <font class="userindex-status-status">
        {{cognitionState}}
      </font>
    </el-footer>
  </el-container>
</template>

<script>
module.exports = {
  name: "userIndex",
  data() {
    return {
      chartSettings: {
        axisLine: {
          lineStyle: {
            color: [
              [0.2, "#f35352"],
              [0.8, "#ffd600"],
              [1, "#5282e4"],
            ],
          },
        },
      },
      chartData: {
        measures: [
          {
            name: "昨日评分",
            data: [
              {
                name: "昨日评分",
                value: (Math.random() * 100).toFixed(2) - 0,
              },
            ],
          },
        ],
      },
      alertcount: "12",
      old:"userA",
      cognitionState:"正常"
    };
  },
};
</script>
<style lang="scss">
.userindex-main {
  padding: 0;
}
.alert-display {
  height: 400px;
  line-height: 400px;
  font-size: 30px;
  text-align: center;
}
.alert-number {
  font-size: 100px;
  color: aquamarine;
}
.warning-text {
  text-align: center;
  color: #ddd;
}
.rate-text {
  text-align: center;
  color: #ddd;
}
.userindex-footer {
  text-align: center;
  margin-top: 90px;
  font-size: 30px;
  color: #ddd;
}
</style>