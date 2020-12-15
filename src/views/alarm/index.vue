<template>
  <div id="alaStaData"></div>
</template>
<script>
import echarts from "echarts";
// import resize from "./mixins/resize";
import store from "@/store";
import { getAlaStaData } from "@/api/datashow";
import moment from "moment";

export default {
  name: "AlaStaDataForUser",
  data() {
    return {
      chartData: {},
      seriesData: [],
    };
  },
  created() {
    this.getTolAlaStaData();
  },
  //钩子函数
  mounted() {
    this.draw();
  },
  methods: {
    draw() {
      //   console.log(this.seriesData); //没数据
      let alaStaData = echarts.init(document.getElementById("alaStaData"));
      // 绘制图表
      let option = {
        title: {
          text: "老人前7天告警数据统计查看",
          top: "20px",
          // subtext: "纯属虚构",
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: this.chartData.legend, //axios
          top: "20px",
        },
        toolbox: {
          show: true,
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "bar"] },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        calculable: true,
        xAxis: [
          {
            type: "category",
            data: this.chartData.xs, //接口有数据
            axisTick: {
              //刻度
              show: false, //不显示刻度线
            },
            axisLine: {
              //坐标线
              lineStyle: {
                type: "solid",
                color: "#e7e7e7", //轴线的颜色
                // width: "2", //坐标线的宽度
              },
            },
            axisLabel: {
              textStyle: {
                color: "#3a6186", //坐标值的具体的颜色
              },
            },
            splitLine: {
              show: false, //去掉分割线
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            axisLine: {
              //线
              show: false,
            },
            axisTick: {
              //刻度
              show: false,
            },
            axisLabel: {
              textStyle: {
                color: "#3a6186", //坐标值的具体的颜色
              },
            },
            splitLine: {
              lineStyle: {
                color: ["#e7e7e7"], //分割线的颜色
              },
            },
          },
        ],
        series: this.seriesData,
      };

      //防止越界，重绘canvas
      window.onresize = alaStaData.resize;
      alaStaData.setOption(option); //设置option
    },
    async getTolAlaStaData() {
      //   let oldId = store.getters.currentOldId;
      let oldId = "5face7e9439dd2363a520501";
      const response = await getAlaStaData(oldId);
      this.chartData = response.showData;
      this.setSeriesData();
      this.draw();
    },
    setSeriesData() {
      let seriesData1 = [];
      const legend = this.chartData.legend;
      this.chartData.xs.forEach((element, index, array) => {
        array[index] = moment(element).format("YYYY-MM-DD");
      });
      const data = this.chartData.series;
      for (let i = 0; i < legend.length; i++) {
        let seriesItem = {};
        seriesItem.name = legend[i];
        seriesItem.type = "bar";
        seriesItem.data = data[i];
        seriesData1.push(seriesItem);
      }
      this.seriesData = seriesData1;
    },
  },
};
</script>
<style lang="scss">
#alaStaData {
  width: calc(100%-210px);
  // height: calc(100vh-80px);
  height: 90vh;
}
</style>