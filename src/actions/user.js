import {actionNames} from "action-utils";
import config from "../config";
import _ from "underscore";
import security from '../utils/security'
import {notification} from 'antd'

// 声明登录的action操作
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const login = (user,password)=>{
  return dispatch => {
    return fetch(config.api.key.get,{
      headers:{
        'from':'nodejs'
      },
      method:'get'
    }).then(res => res.json()).then( res => {
      let publicKey = security.RSAUtils.getKeyPair(res.exponent,'',res.modulus)
      let encryptedPassword = security.RSAUtils.encryptedString(publicKey,password)
      let formData = new FormData()
      formData.append('username',user)
      formData.append('password',encryptedPassword)
      fetch(config.api.user.login.post,{
        method:'POST',
        headers:{
          'from':'NODEJS',
        },
        body: formData
      }).then(res => res.json()).then(res => {
        if(res.title==='Success'){
          sessionStorage.setItem('accessToken',res.resultData.accessToken)
          fetch(config.api.user.info.getUserId,{
            method: 'GET',
            headers: {
              'from': 'NODEJS',
              'token':sessionStorage.getItem('accessToken'),
            },
          }).then(res => res.json()).then(res => {
            dispatch({
              type:LOGIN_SUCCESS,
              isAuth: true,
              userId: Number.parseInt(res.userId),
            })
          })
      }else{
          notification.error({
            message:'失败',
            description:'账号与密码不匹配'
          })
        }
      })
    })
  }
}

// 声明登出的action操作
export const LOGOUT = 'LOGOUT'
export const logout = () =>{
  return dispatch => {
    return fetch(config.api.user.logout.post,{
      method:'POST',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken')
      }
    }).then(res => res.json()).then(res => {
      sessionStorage.removeItem('accessToken')
      dispatch({
        type:LOGOUT
      })
    })
  }
}

export const GET_USER_ROLES = actionNames('GET_USER_ROLES')
export function getUserRoles(){
  return {
    types:GET_USER_ROLES,
    callAPI:()=>{
      return fetch(config.api.staff.getAllAreas,{
        method:'GET',
        headers:{
          'from':'nodejs',
          'token':sessionStorage.getItem('accessToken'),
        }
      }).then(res => res.json())
    }
  }
}
