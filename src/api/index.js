/*
 * @Author: y
 * @Date: 2025-06-09 17:11:15
 * @LastEditors: y
 * @LastEditTime: 2025-06-10 17:53:06
 * @Description: 接口地址
 */
import request from '../utils/request'

// 登录
export const login = (data) => request.post('/api/login', data)
// 列表
export const tableList = (data) => request.get('/api/table/list', data)
// 列表-删除
export const tableDelete = (data) => request.post('/api/table/delete', data)
// 列表-编辑
export const tableEdit = (data) => request.post('/api/table/edit', data)
// 列表-添加
export const tableAdd = (data) => request.post('/api/table/add', data)


// 客户管理列表
export const getCustomer = (data) => request.get('/api/getCustomer', data)
// 获取部门
export const getDepartCurrTree = (data) => request.get('/api/getDepartCurrTree', data)
// 客户管理表单-下拉数据
export const checkData = (data) => request.get('/api/checkData', data)
// 客户管理表单-检测公司是否重复
export const isRepetition = (data) => request.get('/api/isRepetition', data)
// 客户管理表单-添加
export const addCustomer = (data) => request.post('/api/addCustomer', data)
// 客户管理表单-编辑
export const editCustomer = (data) => request.post('/api/editCustomer', data)
// 客户管理表单-下载附件
export const downloadEnclosure = (data) => request.get('/api/customerEnclosure/downloadEnclosure', data)
// 客户管理表单-回显
export const getCustomerProjectById = (data) => request.get('/api/getCustomerProjectById', data)
// 客户管理表单-同步创成汇项目数据
export const getCrmSyncCchData = (data) => request.get('/api/getCrmSyncCchData', data)
// 客户管理表单-项目配合（获取项目配合人）
export const getDemandCoordinateUser = (data) => request.get('/api/getDemandCoordinateUser', data)
// 项目部项目配合提交
export const editProjectCoordinate = (data) => request.post('/api/editProjectCoordinate', data)
// 客户管理表单-同步落地-提交
export const editProjectSyncGround = (data) => request.post('/api/editProjectSyncGround', data)
// 客户管理表单-转移-请求员工下拉
export const getStaffByDept = (data) => request.get('/api/leave/getStaffByDept', data)
// 客户管理表单-转移-提交
export const transferCustomer = (data) => request.post('/api/leave/transferCustomer', data)
// 客户管理表单-转移-部门
export const getDeptTree = (data) => request.get('/api/leave/getDeptTree', data)
// 客户管理列表-表头-学历、融资轮次状态筛选数据
export const getSelectOption = (data) => request.get('/api/getSelectOption', data)

// 匹配-匹配记录
export const matchRecord = (data) => request.get('/api/matchRecord', data)