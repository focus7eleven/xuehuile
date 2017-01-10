import React from 'react'
import {Icon,Input,Table,Button,Modal,Form,Spin} from 'antd'
import PermissionDic from '../../../utils/permissionDic'
import {getWorkspaceData,addSubject,editSubject} from '../../../actions/workspace'
import {fromJS,Map,List} from 'immutable'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import { findMenuInTree,findPath} from '../../../reducer/menu'
import styles from './SubjectPage.scss'
import _ from 'lodash'

const FormItem = Form.Item
const Search = Input.Search
const confirm = Modal.confirm


const SubjectPage = React.createClass({
  _currentMenu:Map({
    authList:List()
  }),

  contextTypes: {
    router: React.PropTypes.object
  },

  getInitialState(){
    return {
      searchStr:'',
      showAddSubjectModal: false,
      modalType: "",
    }
  },

  getDefaultProps(){
    return {}
  },
  componentWillMount(){
    if(!this.props.menu.get('data').isEmpty()){
      this._currentMenu = findMenuInTree(this.props.menu.get('data'),'subject')
    }
  },
  // componentWillReceiveProps(nextProps){
  //   if(!nextProps.menu.get('data').isEmpty()){
  //     this._currentMenu = findMenuInTree(nextProps.menu.get('data'),'subject')
  //   }
  // },
  getTableData(){
    let tableHeader = List()
    let tableBody = List()
    let authList = this._currentMenu.get('authList')
    tableHeader = fromJS([{
      title: '学科名称',
      dataIndex: 'subject_name',
      key: 'subject_name',
      className:styles.tableColumn,
    },{
      title: '学科短称',
      dataIndex: 'subject_short_name',
      key: 'subject_short_name',
      className:styles.tableColumn,
    },{
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      className:styles.tableColumn,
    }])
    tableHeader = tableHeader.concat(authList.filter(v => (v.get('authUrl').split('/')[2] != 'view')&&(v.get('authUrl').split('/')[2] != 'add')).map( v => {
      return {
        title: PermissionDic[v.get('authUrl').split('/')[2]],
        dataIndex: v.get('authUrl').split('/')[2],
        key: v.get('authUrl').split('/')[2],
        className:styles.editColumn,
        render:(text,record) => {
          return (
            <div>
              <Button data-action="edit" type="primary" style={{backgroundColor:'#30D18E',borderColor:'#30D18E'}} onClick={this.handleShowEditSubjectModal.bind(this,record.key)}>{PermissionDic[v.get('authUrl').split('/')[2]]}</Button>
              <Button type="primary" style={{backgroundColor:'#FD9B09',borderColor:'#FD9B09',marginLeft:'10px'}} onClick={this.handleShowDeleteModal.bind(this,record.key)}>删除</Button>
            </div>
          )
        }
      }
    }))
    tableBody = !this.props.workspace.get('data').isEmpty()?this.props.workspace.get('data').get('result').map( (v,key) => {
      return {
        key:key,
        ...(v.toJS())
      }
    }):List()
    return {
      tableHeader:tableHeader.toJS(),
      tableBody:tableBody.toJS(),
    }
  },

  handleShowEditSubjectModal(key){
    const {setFieldsValue} = this.props.form
    this._currentRow = this.props.workspace.get('data').get('result').get(key)
    setFieldsValue({
      'subjectName':this._currentRow.get('subject_name'),
      'subjectShortName':this._currentRow.get('subject_short_name'),
      'remark':this._currentRow.get('remark'),
    })
    this.setState({modalType:"edit",showAddSubjectModal:true})
  },

  handleEditSubject(){
    const {getFieldValue,getFieldError} = this.props.form
    let errors = [getFieldError('subjectName'),getFieldError('subjectShortName'),getFieldError('remark')]
    if(!errors.reduce((pre,cur)=>pre||cur,false)){
      this.props.editSubject({
        subjectName:getFieldValue('subjectName'),
        subjectShortName:getFieldValue('subjectShortName'),
        remark:getFieldValue('remark'),
        action:'edit',
        subjectId:this._currentRow.get('subject_id')
      })
    }
  },

  handleShowDeleteModal(key){
    const that = this
    const currentRow = this.props.workspace.get('data').get('result').get(key)
    confirm({
      title: '你先删除这条记录吗？',
      content: '删除后不可恢复',
      onOk() {
        that.props.editSubject({
          subjectName:currentRow.get('subject_name'),
          subjectId:currentRow.get('subject_id'),
          action:'delete'
        })
      },
      onCancel() {},
    });
  },

  handleShowAddSubjectModal(evt){
    this.props.form.resetFields();
    this.setState({modalType: "add",showAddSubjectModal:true})
  },

  handleHideAddSubjectModal(){
    this.setState({showAddSubjectModal:false})
  },

  handlePostSubject(){
    const {getFieldValue,getFieldError} = this.props.form
    if(getFieldValue('subjectName') && !(getFieldError('subjectName') || getFieldError('subjectShortName') || getFieldError('remark'))){
      this.props.addSubject({
        subjectName:getFieldValue('subjectName'),
        subjectShortName:getFieldValue('subjectShortName'),
        remark:getFieldValue('remark')
      })
      this.setState({
        showAddSubjectModal:false
      })
    }
  },

  //搜索框输入的change事件
  handleSearchTableData(value){
    this.props.getWorkspaceData('subject',this.props.workspace.get('data').get('nowPage'),this.props.workspace.get('data').get('pageShow'),value)
  },

  renderAddSubjectModal(){
    const { getFieldDecorator } = this.props.form;
    const { modalType, showAddSubjectModal } = this.state;
    return (
      <Modal title="添加学科" visible={showAddSubjectModal}
          onOk={modalType==="add"?this.handlePostSubject:this.handleEditSubject} onCancel={this.handleHideAddSubjectModal}
        >
        <div>
          <Form>
            {
              <FormItem
                label='学科名称'
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 12 }}
                key='subjectName'
              >
              {
                getFieldDecorator('subjectName', {
                  rules: [{ required: true, message: '请填写学科名称' },{
                    validator(rule, value, callback, source, options) {
                      var errors = [];
                      if(value.length > 15){
                        errors.push(
                          new Error('学科名称应不超过15个字')
                        )
                      }
                      callback(errors);
                    }
                  }],
                })(<Input placeholder='输入不超过15个字'/>)
              }
              </FormItem>
            }
            <FormItem
              label="学科短称"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 12 }}
              key='subjectShortName'
            >
            {
              getFieldDecorator('subjectShortName', {
                rules: [{
                  validator(rule, value, callback, source, options) {
                    var errors = [];
                    if(value.length > 5){
                      errors.push(
                        new Error('学科短称应不超过5个字')
                      )
                    }
                    callback(errors);
                  }
                }],
              })(<Input placeholder='输入不超过5个字'/>)
            }
            </FormItem>
            <FormItem
              label="备注"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 12 }}
              key='remark'
            >
            {
              getFieldDecorator('remark', {
                rules: [{max:40, message: '输入不超过40个字' }],
              })(<Input type="textarea" placeholder='输入不超过40个字' rows={3}/>)
            }
            </FormItem>
          </Form>
        </div>
      </Modal>
    )
  },

  render(){
    const tableData = this.getTableData()
    const {workspace} = this.props
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          {
            this._currentMenu.get('authList').find((v)=>v.get('authName')=='增加') ?
            <Button data-action="add" type="primary" style={{backgroundColor:'#FD9B09',borderColor:'#FD9B09'}} onClick={this.handleShowAddSubjectModal}>
              新建
            </Button>:null
          }
          <Search placeholder="请输入学科名称" value={this.state.searchStr} onChange={(e)=>{this.setState({searchStr:e.target.value})}} onSearch={this.handleSearchTableData} />
        </div>
        <div className={styles.body}>
          <div className={styles.wrapper}>
            <Table rowClassName={(record,index)=>index%2?styles.tableDarkRow:styles.tableLightRow} bordered columns={tableData.tableHeader} dataSource={tableData.tableBody}
            pagination={!this.props.workspace.get('data').isEmpty()?{
              total:this.props.workspace.get('data').get('totalCount'),
              pageSize:this.props.workspace.get('data').get('pageShow'),
              current:this.props.workspace.get('data').get('nowPage'),
              onChange:(page)=>{
                this.props.getWorkspaceData('subject',page,this.props.workspace.get('data').get('pageShow'),this.state.searchStr)
              },
              onShowSizeChange:(current,size)=>{
                this.props.getWorkspaceData('subject',this.props.workspace.get('data').get('nowPage'),size,this.state.searchStr)
              }
            }:null} />
            <div className={styles.tableMsg}>当前条目{workspace.get('data').get('start')}-{parseInt(workspace.get('data').get('start'))+parseInt(workspace.get('data').get('pageShow'))}/总条目{workspace.get('data').get('totalCount')}</div>
          </div>
        </div>
        {this.renderAddSubjectModal()}
      </div>
    )
  }
})

function mapStateToProps(state){
  return{
    menu:state.get('menu'),
    workspace:state.get('workspace')
  }
}
function mapDispatchToProps(dispatch){
  return {
    getWorkspaceData:bindActionCreators(getWorkspaceData,dispatch),
    addSubject:bindActionCreators(addSubject,dispatch),
    editSubject:bindActionCreators(editSubject,dispatch)
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Form.create()(SubjectPage))
