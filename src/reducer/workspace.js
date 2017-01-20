import {
  CHANGE_CURRENT_PATH,
  GET_WORKSPACEDATA,
  SEARCH_TEXTBOOK,
  GET_ALL_RESOURCES,
  GET_ALL_AREAS,
  GET_PHASE_LIST,
  GET_GRADE_LIST,
  GET_SCHOOL_USERLIST,
  GET_LEADER_LIST,
  GET_MEMBER_LIST,
  SEARCH_SCHOOL,
} from '../actions/workspace'
import {findPath} from '../reducer/menu'

import {fromJS} from 'immutable'

const initialState = fromJS({
  data:[],
  loading:true,
  otherMsg:fromJS({}),
  allResourcesList:[],
  allAreasList: [],
  phaseList: [],
  gradeList: [],
  schoolUserList: [],
  leaderList: [],
  memberList: [],
})

export default (state = initialState,action)=>{
  switch (action.type) {
    case GET_WORKSPACEDATA[0]:
      return state.set('loading',true)
    case GET_WORKSPACEDATA[1]:
      return state.set('data',fromJS(action.data)).set('loading',false)
    case SEARCH_TEXTBOOK[0]:
      return state.set('loading',true)
    case SEARCH_TEXTBOOK[1]:
      return state.set('data',fromJS(action.data.mainData)).set('loading',false).set('otherMsg',fromJS(action.data.otherMsg))
    case GET_ALL_RESOURCES[1]:
      return state.set('allResourcesList',action.data)
    case GET_ALL_AREAS[1]:
      return state.set('allAreasList',action.data)
    case GET_PHASE_LIST[1]:
      return state.set('phaseList',action.data)
    case GET_GRADE_LIST[1]:
      return state.set('gradeList',action.data)
    case GET_SCHOOL_USERLIST[1]:
      return state.set('schoolUserList',action.data)
    case GET_LEADER_LIST[1]:
      return state.set('leaderList',action.data)
    case GET_MEMBER_LIST[1]:
      return state.set('memberList',action.data)
    case SEARCH_SCHOOL[0]:
      return state.set('loading',true)
    case SEARCH_SCHOOL[1]:
      return state.set('data',fromJS(action.data.mainData)).set('loading',false).set('otherMsg',fromJS(action.data.otherMsg))
    default:
      return state
  }
}
