import _ from 'underscore'

const baseURL = "http://139.224.194.45:8080"

// App config the for development and deployment environment.
const isProduction = process.env.NODE_ENV === "production"

const config = _.extend({
	// common config
	debug: !isProduction,
},{
	// dev config
	api:{
		key:{
			get:`${baseURL}/key`
		},
		user:{
			login:{
				post:`${baseURL}/LoginWithToken`
			},
			logout:{
				post:`${baseURL}/account/logout`
			}
		},
		menu:{
			get:`${baseURL}/getMenuWithTreeFormat`
		},
		workspace:{
			baseInfo:{
				baseData:{
					get:(type,currentPage,pageShow,search) => `${baseURL}/${type}/page?currentPage=${currentPage}&search=${search}&pageShow=${pageShow}`
				}
			}
		},
		phase:{
			post:`${baseURL}/phase/add`,
			update:`${baseURL}/phase/edit`,
			phaseList:{
				get:`${baseURL}/phase/phaseList`,
			},
			subjectList:{
				get:(phaseCode)=>`${baseURL}/phase/subject?phaseCode=${phaseCode}`,
				update:`${baseURL}/phase/subject/set`
			}
		},
		subject:{
			post: `${baseURL}/subject/add`,
			update: `${baseURL}/subject/edit`,
			subjectList:{
				get:`${baseURL}/subject/list`
			}
		},
		grade:{
			post:`${baseURL}/grade/add`,
			update:`${baseURL}/grade/edit`,
		},
		dict:{
			post:`${baseURL}/dict/add`,
			update:`${baseURL}/dict/edit`,
		}
	}
})

export default config
