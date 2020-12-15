  <template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker
        v-model="listQuery.time"
        type="date"
        placeholder="查询时间"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        Search
      </el-button>
    </div>

    <ve-donut-chart :data="chartData" :settings="chartSettings" class="behavior-detail-chart"/>
  </div>
</template>  

<script>
export default {
  name: "BehaviorDetail",
  data() {
    return {
      listQuery: {
        time: new Date(),
      },
    };
  },
  methods: {
    handleFilter() {
      this.getList();
    },
    getList() {},
  },
  created() {
    this.chartData = {
      dimensions: {
        name: "活动",
        data: ["吃饭", "睡觉", "洗漱", "厕所", "运动", "看电视", "聊天", "其他"],
      },
      measures: [
        {
          name: "单位:小时",
          data: [1, 8.5, 0.5, 0.5, 1, 2, 2, 8.5],
        },
      ],
    };
    this.chartSettings = {
      radius: ["35%", "55%"],
    };
  },
};
</script>
 
 <style>
 .behavior-detail-chart {
   margin-top: 80px;
 }
 </style>