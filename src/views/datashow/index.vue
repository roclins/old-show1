<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.idCard"
        placeholder="身份证号"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.name"
        placeholder="姓名"
        style="width: 150px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.nursingGrade"
        placeholder="护理等级"
        clearable
        style="width: 150px"
        class="filter-item"
      >
        <el-option
          v-for="item in calendarNursingOptions"
          :key="item.key"
          :label="item.key"
          :value="item.display_name"
        />
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </el-button>
      <!-- <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        Add
      </el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >
        Export
      </el-button> -->
      <!-- <el-checkbox
        v-model="showReviewer"
        class="filter-item"
        style="margin-left: 15px"
        @change="tableKey = tableKey + 1"
      >
        reviewer
      </el-checkbox> -->
    </div>
    <!-- 上面是控件 -->

    <!-- 下面是列表 -->
    <el-table-bar>
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%"
        @sort-change="sortChange"
      >
        <el-table-column
          label="序号"
          prop="id"
          sortable="custom"
          align="center"
          width="80"
          :class-name="getSortClass('id')"
        >
          <template slot-scope="{ $index }">
            <span>{{ $index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="姓名" width="80px" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.name }}</span>
            <!-- parseTime('{y}-{m}-{d} {h}:{i}') -->
          </template>
        </el-table-column>
        <!-- <el-table-column label="性别" width="80px" align="center">
        <template slot-scope="{ row }">
          <span @click="handleUpdate(row)">{{ row.gender }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出生日期" width="110px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.birthday | dateFilter("YYYY-MM-DD") }}</span>
        </template>
      </el-table-column> -->
        <!-- <el-table-column label="年龄" width="80px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.age }}</span>
        </template>
      </el-table-column>
      <el-table-column label="身份证号" width="200px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.idCard }}</span>
        </template>
      </el-table-column> -->
        <el-table-column label="护理等级" align="center" width="95">
          <template slot-scope="{ row }">
            <span>{{ row.nursingGrade }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="床号"
          class-name="status-col"
          width="100"
          align="center"
        >
          <template slot-scope="{ row }">
            <span>{{ row.bedNumber }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="身高" width="80px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.height }}</span>
        </template>
      </el-table-column>
      <el-table-column label="体重" width="80px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.weight }}</span>
        </template>
      </el-table-column> -->
        <el-table-column label="认知评分" width="80px" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.reconize }}</span>
          </template>
        </el-table-column>
        <el-table-column label="认知状态" width="80px" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.oldStatus }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="personId"
          width="80px"
          align="center"
          v-if="false"
        >
          <template slot-scope="{ row }">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="900"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{ row, $index }">
            <!-- <el-button type="primary" size="mini" @click="handleUpdate(row)">
            Edit
          </el-button> -->
            <el-button type="primary" @click="handleBehRowData(row, $index)">
              查看原始行为数据
            </el-button>
            <el-button type="primary" @click="handleAlaRowData(row, $index)">
              查看原始告警数据
            </el-button>
            <el-button type="primary" @click="handleRecRowData(row, $index)">
              查看原始评分数据
            </el-button>
            <el-button type="primary" @click="handleBehStaData(row, $index)">
              查看统计行为数据
            </el-button>
            <el-button type="primary" @click="handleAlaStaData(row, $index)">
              查看统计告警数据
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-table-bar>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <!-- 增加老人信息的弹窗 label:字段名字 prop：需要校验就加入prop -->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      class="dialogBox-container"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="80px"
        class="addSingleOldDialog-container"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <!-- <el-input v-model="temp.gender" /> -->
          <el-select
            v-model="temp.gender"
            class="filter-item addSingleOldDialog-input"
            placeholder="Please select"
          >
            <el-option
              v-for="item in calendarGenderOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="出生日期" prop="birthday">
          <el-date-picker
            v-model="temp.birthday"
            type="date"
            placeholder="Please pick a date"
          />
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="temp.age" />
        </el-form-item>
        <el-form-item label="身份证号" prop="idCard">
          <el-input v-model="temp.idCard" />
        </el-form-item>
        <el-form-item label="体重" prop="weight">
          <el-input v-model="temp.weight" />
        </el-form-item>
        <el-form-item label="身高" prop="height">
          <el-input v-model="temp.height" />
        </el-form-item>
        <el-form-item label="护理等级" prop="nursingGrade">
          <el-select
            v-model="temp.nursingGrade"
            class="filter-item addSingleOldDialog-input"
            placeholder="Please select"
          >
            <el-option
              v-for="item in calendarNursingOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="床号" prop="bedNumber">
          <el-input v-model="temp.bedNumber" />
        </el-form-item>
        <el-form-item label="认知状态" prop="status">
          <el-input v-model="temp.status" />
        </el-form-item>
        <el-form-item label="绑定账号" prop="account">
          <el-input v-model="temp.account" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> Cancel </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          Confirm
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table
        :data="pvData"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false"
          >Confirm</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getList,
  addSingleOld,
  updateSingleOld,
  deleteSingleOld,
  getOldList,
} from "@/api/datashow";
import store from "@/store";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import moment from "moment";
import user from "@/store/modules/user";

const calendarGenderOptions = [
  { key: "男", display_name: "男" },
  { key: "女", display_name: "女" },
];

const calendarNursingOptions = [
  { key: "一级照护", display_name: "一级照护" },
  { key: "二级照护", display_name: "二级照护" },
  { key: "三级照护", display_name: "三级照护" },
  { key: "普通照护", display_name: "普通照护" },
];

// arr to obj, such as { CN : "China", US : "USA" }
// const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
//   acc[cur.key] = cur.display_name;
//   return acc;
// }, {});

export default {
  name: "DataShowIndex",
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger",
      };
      return statusMap[status];
    },
    // typeFilter(type) {
    //   return calendarTypeKeyValue[type];
    // },
    dateFilter: function (input, fmtstring) {
      return moment(input).format(fmtstring);
    },
  },
  data() {
    return {
      isShowPage: false,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        sort: "",
        idCard: "",
        name: "",
        limit: 10,
        page: 1,
      },
      importanceOptions: [1, 2, 3],
      calendarGenderOptions,
      calendarNursingOptions,
      sortOptions: [
        { label: "ID Ascending", key: "+id" },
        { label: "ID Descending", key: "-id" },
      ],
      statusOptions: ["published", "draft", "deleted"],
      showReviewer: false,
      temp: {
        name: "",
        age: "",
        birthday: "", //使用时间框
        idCard: "",
        height: "",
        weight: "",
        status: "",
        nursingGrade: "", //使用下拉框
        bedNumber: "",
        gender: "", //使用下拉框
        account: "",
        persionId: "",
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "修改老人信息",
        create: "添加老人信息",
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        name: [{ required: true, message: "请填入姓名", trigger: "change" }],
        birthday: [
          { required: true, message: "请填入出生年月", trigger: "change" },
        ],
        gender: [{ required: true, message: "请填入性别", trigger: "change" }],
        age: [{ required: true, message: "请填入年龄", trigger: "change" }],
        idCard: [
          { required: true, message: "请填入身份证号码", trigger: "change" },
        ],
        height: [{ required: true, message: "请填入身高", trigger: "change" }],
        weight: [{ required: true, message: "请填入体重", trigger: "change" }],
        nursingGrade: [
          { required: true, message: "请选择照护等级", trigger: "change" },
        ],
        bedNumber: [
          { required: true, message: "请填入房间号", trigger: "change" },
        ],
        status: [
          { required: true, message: "请填入认知状态", trigger: "change" },
        ],
        account: [
          { required: true, message: "请填入绑定账号", trigger: "change" },
        ],
      },
      downloadLoading: false,
    };
  },
  created() {
    this.getList();
  },
  computed: {
    currentOldId() {
      return store.state.datashow.currentOldId;
    },
  },
  watch: {
    currentOldId: function (val) {
      this.getList();
    },
  },
  methods: {
    getList() {
      this.listLoading = true;
      getOldList(this.listQuery).then((response) => {
        this.list = response.data.oldInfo;
        this.total = response.data.total;

        // console.log(this.list, this.total);

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 0.8 * 1000);
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    sortChange(data) {
      const { prop, order } = data;
      if (prop === "id") {
        this.sortByID(order);
      }
    },
    sortByID(order) {
      if (order === "ascending") {
        this.listQuery.sort = "+id";
      } else {
        this.listQuery.sort = "-id";
      }
      this.handleFilter();
    },
    resetTemp() {
      this.temp = {
        name: "linjianguang ",
        age: 23,
        birthday: "", //使用时间框
        idCard: "441702199606173833",
        height: 173,
        weight: 65,
        status: "正常",
        nursingGrade: "一级照护", //使用下拉框
        bedNumber: "202-1",
        gender: "男", //使用下拉框
        account: "userD",
      };
    },
    // 点击add之后的逻辑
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    // 点击确认后的逻辑
    /*
      现在确认后的逻辑如下：
      1.调用接口，然后后调
          */
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          let personInfo = this.temp;
          personInfo.age = parseInt(this.temp.age);
          personInfo.height = parseInt(this.temp.height);
          personInfo.weight = parseInt(this.temp.weight);
          // console.log(this.temp);

          addSingleOld(personInfo)
            .then((response) => {
              this.dialogFormVisible = false;
              this.$notify({
                title: "Success",
                message: "Created Successfully",
                type: "success",
                duration: 2000,
              });
            })
            .catch(() => {});
          // createArticle(this.temp).then(() => {
          //   // this.list.unshift(this.temp);  把新加入的数据呈现在前端的页面中
          //   this.dialogFormVisible = false;
          //   this.$notify({
          //     title: "Success",
          //     message: "Created Successfully",
          //     type: "success",
          //     duration: 2000,
          //   });
          // });
        }
      });
    },
    // 点击修改按钮后的逻辑
    handleUpdate(row) {
      //TODO
      console.log(row.id);
      this.temp = Object.assign({}, row); // copy obj
      // this.temp.timestamp = new Date(this.temp.timestamp);
      console.log(this.temp);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },

    // 点击comfirm 后的逻辑
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          let personInfo = tempData;
          personInfo.age = parseInt(tempData.age);
          personInfo.height = parseInt(tempData.height);
          personInfo.weight = parseInt(tempData.weight);
          updateSingleOld(tempData.oldId, tempData)
            .then((response) => {
              this.dialogFormVisible = false;
              this.$notify({
                title: "Success",
                message: "Update Successfully",
                type: "success",
                duration: 2000,
              });
            })
            .catch(() => {});
          // console.log(tempData)
          // tempData.timestamp = +new Date(tempData.timestamp); // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          // updateArticle(tempData).then(() => {
          //   const index = this.list.findIndex((v) => v.id === this.temp.id);
          //   this.list.splice(index, 1, this.temp);
          //   this.dialogFormVisible = false;
          // this.$notify({
          //   title: "Success",
          //   message: "Update Successfully",
          //   type: "success",
          //   duration: 2000,
          // });
          // });
        }
      });
    },
    handleBehRowData(row, index) {
      this.isShowPage = true;
      // console.log(this.$router);
      store.commit("SET_CURRENTOLDID", row.oldId);
      store.commit("SET_CURRENTOLDNAME", row.name);
      this.$router.push({
        name: "BehRowData",
      });
    },
    // handleBehRowData(row, index) {
    //   store.commit("SET_CURRENTOLDID", row.oldId);
    //   store.commit("SET_CURRENTOLDNAME", row.name);
    //   this.$router.push({
    //     name: "BehRowData",
    //     params: {
    //       oldId: row.oldId,
    //       oldName: row.name,
    //     },
    //   });
    // },
    handleAlaRowData(row, index) {
      this.isShowPage = true;
      store.commit("SET_CURRENTOLDID", row.oldId);
      store.commit("SET_CURRENTOLDNAME", row.name);
      this.$router.push({
        name: "AlaRowData",
      });
    },
    handleRecRowData(row, index) {
      this.isShowPage = true;
      store.commit("SET_CURRENTOLDID", row.oldId);
      store.commit("SET_CURRENTOLDNAME", row.name);
      this.$router.push({
        name: "RecRowData",
        params: {
          oldId: row.oldId,
          oldName: row.name,
        },
      });
    },
    handleBehStaData(row, index) {
      this.isShowPage = true;
      store.commit("SET_CURRENTOLDID", row.oldId);
      store.commit("SET_CURRENTOLDNAME", row.name);
      this.$router.push({
        name: "BehStaData",
      });
    },
    handleAlaStaData(row, index) {
      this.isShowPage = true;
      store.commit("SET_CURRENTOLDID", row.oldId);
      store.commit("SET_CURRENTOLDNAME", row.name);
      this.$router.push({
        name: "AlaStaData",
      });
    },
    handleFetchPv(pv) {
      fetchPv(pv).then((response) => {
        this.pvData = response.data.pvData;
        this.dialogPvVisible = true;
      });
    },
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = ["timestamp", "title", "type", "importance", "status"];
        const filterVal = [
          "timestamp",
          "title",
          "type",
          "importance",
          "status",
        ];
        const data = this.formatJson(filterVal);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "table-list",
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal) {
      return this.list.map((v) =>
        filterVal.map((j) => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },
    getSortClass: function (key) {
      const sort = this.listQuery.sort;
      return sort === `+${key}` ? "ascending" : "descending";
    },
  },
  watch: {
    isShowPage() {
      // console.log(this.$router.options.routes[4].children)
      // let len = this.$router.options.routes[4].children.length;
      // for(let i=1;i<len;i++){
      //   this.$router.options.routes[4].children[i].hidden = true
      //   console.log(this.$router.options.routes[4].children[i].hidden)
      // }
      // // this.$root.reload()
      // console.log(this.$router.options.routes[4].children[2].hidden)
    },
  },
};
</script>

<style>
.addSingleOldDialog-container {
  width: 300px;
  margin: 0 auto;
}
.addSingleOldDialog-input {
  width: 220px;
}
.dialogBox-container {
  width: 1500px;
  margin: 0 auto;
}
</style>

