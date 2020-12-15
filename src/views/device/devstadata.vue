<template>
  <div id="DevStaData" :style="{ width: '1400px', height: '900px' }"></div>
</template>
<script>
import echarts from "echarts";
// import resize from "./mixins/resize";
import store from "@/store";
import { getDevStaData } from "@/api/device";
import moment from "moment";

export default {
  name: "DevStaData",
  data() {
    return {
      chartData: {},
      seriesData: [],
      source: [],
    };
  },
  created() {
    this.getTolDevStaData();
  },
  //钩子函数
  mounted() {
    // this.$nextTick(() => {
    //   this.draw();
    // });
  },
  methods: {
    draw() {
      // 初始化echarts实例
      let DevStaData = echarts.init(document.getElementById("DevStaData"));

      // 绘制图表
      let option = {
        title: {
          text: "前7天设备数据统计查看",
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
            // data: this.chartData.xs, //接口有数据
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
        series: [
          {
            type: 'line'
          }
        ],
        dataset: {
          // 用 dimensions 指定了维度的顺序。直角坐标系中，
          // 默认把第一个维度映射到 X 轴上，第二个维度映射到 Y 轴上。
          // 如果不指定 dimensions，也可以通过指定 series.encode
          // 完成映射，参见后文。
          dimensions: ["time", "data"],
          source: this.source, //TODO
          // 这种形式就是最难使用的那种形式
        },
      };
      //防止越界，重绘canvas
      window.onresize = DevStaData.resize;
      DevStaData.setOption(option); //设置option
    },
    getTolDevStaData() {
      let deviceId = store.getters.currentDeviceId;
      let params = {
        deviceId: deviceId,
      };
      getDevStaData(params)
        .then((response) => {
          // console.log(response.data.row);
          //   console.log(this.source);
          this.$set(this, "source", response.data.row);
          // console.log(this.source); //证明赋值成功·
           this.draw();
        })
        .catch((error) => {});

    },
    setSeriesData() {
      let seriesData1 = [];
      const legend = this.chartData.legend;
      // console.log(legend);
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