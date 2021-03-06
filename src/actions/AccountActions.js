import AccountConstants from '../constants/AccountConstants';
// import ApiPathConstants from '../constants/ApiPathConstants';
import _ from 'lodash';

let AccountActions = {
	loginRequest: function() {
		return {
			type: AccountConstants.LOGIN
		};
	},

	loginError: function(error) {
		return {
			error,
			type: AccountConstants.LOGIN_ERROR
		};
	},

	loginSuccess: function(response) {
		return {
			response,
			type: AccountConstants.LOGIN_SUCCESS
		};
	},

	login: function(data, cb){
		let _obj = this;
		return dispatch => {

            let res = null;
            console.log(data);
			if(data.Username === 'test' && data.Password === 'password'){
                res = {
                    token: 'sdfsdfsdfsdfsdfsdfsdfsdfsdfsdf',
                    message: 'successfully logged in.'
                };
                dispatch(_obj.loginSuccess(res));
                if(cb != null){
                    cb();
                }
            }else{
                res = {
                    error: "invalid_grant",
                    error_description: "The credentials are incocrrect"
                };
                dispatch(_obj.loginError(res));
                if(cb != null){
                    cb();
                }
            }

            // let _apiBody="grant_type=password&username="+data.Username+"&password="+data.Password;
			// fetch(ApiPathConstants.getApiPath() + '/token', {
			// 	method: 'POST',
			// 	headers: {
			// 		'Accept': 'application/json',
			// 		'Content-Type': 'application/json'
			// 	},
			// 	body: _apiBody
			// })
			// .then(response => {
			//
			// 	response.json().then(function(res) {
			// 		if(res.error !=null){
			// 			dispatch(_obj.loginError(res));
			// 			if(cb != null){
			// 				cb();
			// 			}
			// 		}else{
			// 			dispatch(_obj.loginSuccess(res));
			// 			if(cb != null){
			// 				cb();
			// 			}
			// 		}
        		// });
			// });

		};
	}

};

export default AccountActions;
