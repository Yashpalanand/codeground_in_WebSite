$(document).ready(function(){
	var baseUrl = "../code4";
	var onGoingRequestButtonText = "Contacting Codeground....";
	var onGoingRequestButtonText_registeration = "Registering you....";
	var defaultButtonText = "Yes I want a demo";
	var defaultButtonText_registration = "Proceed";
	var cantSendMailErrorText = "Can't contact codeground at this moment. Please try after some time.";
	var passwordNotMatchingErrorText = "Passwords do not match";
	var msgForEmailAlreadyRegistered = "Email address already registered, please use another one";
	//To Handle demo-form
	var registerUser = {};
	var getFormDataAsJsonBySelector = function(formSelector){
		var formData = $(formSelector).serializeArray();
		var formDataJson = {}
		for(var i = 0;i < formData.length ; i++){
			var d = formData[i];
			formDataJson[d.name] = d.value;
		}
		return formDataJson;
	}
	$("#buttonClose").click(function(){
		$("#demoFormSucess").modal("hide");
	});
	$("#demoForm").submit(function(event) {
		event.preventDefault();
		$("#demoFormAlert").css({"display": "none"});
		$("#demoFormButton").addClass("onGoingRequestButton");
		$("#demoFormButton").html(onGoingRequestButtonText);
		var data = getFormDataAsJsonBySelector("#demoForm");
		data.company = {};
		data.company.companyName = data.organisation;
		delete data.pageName;
		delete data.organisation;
		//console.log(JSON.stringify(data));
		$.ajax({
		    type: "POST",
		    url: baseUrl+"/ajax/recruiter/requestDemo",
		    data: JSON.stringify(data),
		    contentType: "application/json",
		    dataType: "json",
		    success: function(data, status, header){
		    	$("#demoFormButton").removeClass("onGoingRequestButton");
		    	$("#demoFormButton").html(defaultButtonText);
		    	console.log(arguments);
		    	console.log(data);
		    	$("#register-demo-modal").modal("hide");
		    	$("#demoFormSucess").modal();
		    },
		    error: function(jqXHR, textStatus, errorThrown) {
		    	$("#demoFormButton").removeClass("onGoingRequestButton");
		    	$("#demoFormButton").html(defaultButtonText);
		    	var status = jqXHR.status;
		    	var data = JSON.parse(jqXHR.responseText);
		    	$("#demoFormAlert").css({"display": "block"});
			 	switch(status){
			 		case CUSTOM_RESPONSE_STATUS.InvalidResource:
			 			$("#demoFormAlertText").html(data);
			 			break;
			 		default:
			 			$("#demoFormAlertText").html(cantSendMailErrorText);
			 	}
			}
		});
	});
	$("#startFreeTrialForm").submit(function(event){
		event.preventDefault();
		$("#start-free-trial-alert").css({"display": "none"});
		registerUser = getFormDataAsJsonBySelector("#startFreeTrialForm");
		registerUser.company = {};
		registerUser.company.companyName = registerUser.organisation;
		delete registerUser.organisation;
		$("#start-free-trial-modal").modal();
	});
	$("#start-free-trial-modal-form").submit(function(event){
		event.preventDefault();
		$("#start-free-trial-modal-alert").css({"display": "none"});
		data = getFormDataAsJsonBySelector("#start-free-trial-modal-form");
		//console.log(data.password+"::"+data.retypePassword);
		if(data.password !== data.retypePassword){
			$("#start-free-trial-modal-alert").css({"display":"block"});
			$("#start-free-trial-modal-alert-text").html(passwordNotMatchingErrorText);
			return;
		}
		registerUser.role = "Hr";
		registerUser.password = data.password;
		console.log(JSON.stringify(registerUser));
		$("#start-free-trial-modal-form-button").addClass("onGoingRequestButton");
		$("#start-free-trial-modal-form-button").html(onGoingRequestButtonText_registeration);	
		$.ajax({
		    type: "POST",
		    url: baseUrl+"/ajax/user/register",
		    data: JSON.stringify(registerUser),
		    contentType: "application/json",
		    dataType: "json",
		    success: function(data, status, header){
		    	$("#start-free-trial-modal-form-button").removeClass("onGoingRequestButton");
		    	$("#start-free-trial-modal-form-button").html(defaultButtonText_registration);
		    	//console.log(arguments);
		    	//console.log(data);
		    	$("#start-free-trial-modal").modal("hide");
		    	$("#start-free-trial-success").modal();
		    },
		    error: function(jqXHR, textStatus, errorThrown) {
		    	$("#start-free-trial-modal-form-button").removeClass("onGoingRequestButton");
		    	$("#start-free-trial-modal-form-button").html(defaultButtonText_registration);
		    	var status = jqXHR.status;
		    	var data = JSON.parse(jqXHR.responseText);
			 	switch(status){
					case CUSTOM_RESPONSE_STATUS.GoogleServerNotResponding:
			 			$("#start-free-trial-modal").modal("hide");
			 			$("#start-free-trial-alert").css({"display": "block"});
			 			$("#start-free-trial-alert-text").html(data);
			 			break;
			 		case CUSTOM_RESPONSE_STATUS.HibernateDataValidation:
			 			$("#start-free-trial-modal").modal("hide");
			 			$("#start-free-trial-alert").css({"display": "block"});
			 			$("#start-free-trial-alert-text").html(data.message);
			 			break;	
			 		case 401:
			 		case 403:
			 			$("#start-free-trial-modal").modal("hide");
			 			$("#start-free-trial-alert").css({"display": "block"});
			 			$("#start-free-trial-alert-text").html(msgForEmailAlreadyRegistered);
			 			break;
			 		case CUSTOM_RESPONSE_STATUS.InvalidResource:
			 		case CUSTOM_RESPONSE_STATUS.CaptchaNotVerified:
			 			$("#start-free-trial-modal-alert").css({"display":"block"});
			 			$("#start-free-trial-modal-alert-text").html(data);
			 			break;			
			 		default:
			 			$("#start-free-trial-modal-alert").css({"display":"block"});
			 			$("#start-free-trial-modal-alert-text").html(cantSendMailErrorText);
			 	}
			}
		});
	});
});