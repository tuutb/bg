<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="500px" @close="close">
    <el-form ref="form" label-width="80px" :model="form" :rules="rules">
      <el-form-item label="标题" prop="title">
        <el-input v-model.trim="form.title" autocomplete="off" />
      </el-form-item>
      <el-form-item label="作者" prop="author">
        <el-input v-model.trim="form.author" autocomplete="off" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { tableAdd, tableEdit } from '@/api/index'

export default {
    props: ["isEdit"],
    name: 'TableEdit',
    data () {
        return {
            form: {
                title: '',
                author: '',
                id: 0
            },
            rules: {
                title: [{ required: true, trigger: 'blur', message: '请输入标题' }],
                author: [{ required: true, trigger: 'blur', message: '请输入作者' }],
            },
            title: '',
            dialogFormVisible: false,
        }
    },
    created () { },
    methods: {
        showEdit (row) {
            if (!row) {
                this.title = '添加'
            } else {
                this.title = '编辑'
                let obj = {
                    title: row.title,
                    author: row.author,
                    id: row.id
                }
                this.form = Object.assign({}, obj)
            }
            this.dialogFormVisible = true
        },
        close () {
            this.$refs['form'].resetFields()
            this.form = this.$options.data().form
            this.dialogFormVisible = false
        },
        save () {
            this.$refs['form'].validate(async (valid) => {
                if (valid) {
                    let res = this.isEdit ? await tableEdit(this.form) : await tableAdd(this.form)
                    if (res.status == 200) {
                        this.$baseMessage(res.msg, 'success')
                        this.$refs['form'].resetFields()
                        this.dialogFormVisible = false
                        this.$emit('fetch-data')
                        this.form = this.$options.data().form//重新初始化当前组件实例的 form 数据对象，恢复为默认初始值。
                    }
                } else {
                    return false
                }
            })
        },
    },
}
</script>
