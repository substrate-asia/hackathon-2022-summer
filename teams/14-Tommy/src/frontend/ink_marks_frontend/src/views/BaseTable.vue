<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> List contracts
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <!-- <div class="handle-box">
                <el-select v-model="query.address" placeholder="地址" class="handle-select mr10">
                    <el-option key="1" label="广东省" value="广东省"></el-option>
                    <el-option key="2" label="湖南省" value="湖南省"></el-option>
                </el-select>
                <el-input v-model="query.name" placeholder="用户名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div> -->
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="name" label="Name"></el-table-column>
                <!-- <el-table-column label="账户余额">
                    <template #default="scope">￥{{ scope.row.money }}</template>
                </el-table-column>
                <el-table-column label="头像(查看大图)" align="center">
                    <template #default="scope">
                        <el-image class="table-td-thumb" :src="scope.row.thumb" :preview-src-list="[scope.row.thumb]">
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="address" label="地址"></el-table-column> -->
                <el-table-column label="State" align="center">
                    <template #default="scope">
                        <el-tag :type="
                                scope.row.state === 'done'
                                    ? 'success'
                                    : scope.row.state === 'auditing'
                                    ? 'warning'
                                    : ''
                            ">{{ scope.row.state }}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="created_at" label="Created_at"></el-table-column>
                <el-table-column label="Op" width="230" align="center">
                    <template #default="scope">
                        <el-button v-if="scope.row.state === 'auditing'" type="text" icon="el-icon-edit" @click="clickEdit(scope.$index, scope.row)">Audit
                        </el-button>
                        <!-- <el-button v-if="scope.row.state === 'done'" type="text" class="green" icon="el-icon-download" @click="Download(scope.$index, scope.row)">Download
                        </el-button> -->
                        <a href="/example.pdf" class="green" v-if="scope.row.state === 'done'" download>Download </a>
                        <el-button type="text" icon="el-icon-delete" class="red"
                            @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex"
                    :page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" v-model="editVisible" width="30%">
            <el-form label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveEdit">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { fetchData } from "../api/index";
import axios from 'axios';

export default {
    name: "basetable",
    methods:{
        getData: function() {
            axios.get('http://127.0.0.1:8888/inkcontracts').then((res) => {
                tableData.value = res.data;
            });
        }
    },
    methods: {
        clickEdit(index, row) {
            this.$router.push({
                name: 'audit',
                query: { redirect: '/audit', id: row.id },
            });
        },
        Download(index, row) {
            axios({
                url: 'http://127.0.0.1:8888/inkcontracts/'+row.id+'/download',
                method: 'GET',
                responseType: 'blob',
            }).then((response) => {
                 var fileURL = window.URL.createObjectURL(new Blob([response.data]));
                 var fileLink = document.createElement('a');
                 fileLink.href = fileURL;
                 fileLink.setAttribute('download', 'file.pdf');
                 document.body.appendChild(fileLink);
                 fileLink.click();
            });
        },
    },
    setup() {
        const query = reactive({
            address: "",
            name: "",
            pageIndex: 1,
            pageSize: 10,
        });
        const tableData = ref([]);
        const pageTotal = ref(0);
        // 获取表格数据
        const getData = () => {
            axios.get('http://127.0.0.1:8888/inkcontracts').then((res) => {
                tableData.value = res.data;
            });
        };
        getData();

        // 查询操作
        const handleSearch = () => {
            query.pageIndex = 1;
            getData();
        };
        // 分页导航
        const handlePageChange = (val) => {
            query.pageIndex = val;
            getData();
        };

        // 删除操作
        const handleDelete = (index, row) => {
            // 二次确认删除
            ElMessageBox.confirm("确定要删除吗？", "提示", {
                type: "warning",
            })
                .then(() => {
                    axios.delete("http://127.0.0.1:8888/inkcontracts/"+row.id).then((res) => {
                        getData();
                        ElMessage.success("删除成功");
                    });
                })
                .catch(() => {});
        };

        // 表格编辑时弹窗和保存
        const editVisible = ref(false);
        let form = reactive({
            name: "",
            address: "",
        });
        let idx = -1;
        const handleEdit = (index, row) => {
            idx = index;
            Object.keys(form).forEach((item) => {
                form[item] = row[item];
            });
            editVisible.value = true;
        };
        const saveEdit = () => {
            editVisible.value = false;
            ElMessage.success(`修改第 ${idx + 1} 行成功`);
            Object.keys(form).forEach((item) => {
                tableData.value[idx][item] = form[item];
            });
        };

        return {
            query,
            tableData,
            pageTotal,
            editVisible,
            form,
            handleSearch,
            handlePageChange,
            handleDelete,
            handleEdit,
            saveEdit,
        };
    },
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}

.green {
    color:  green;
}

.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
