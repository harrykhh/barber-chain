			function available(date) {
			  dmy = moment.utc(date).format('MM-DD-YYYY');
			  if ($.inArray(dmy, availableDates) != -1) {
				return [true, 'ui-state-holiday', ''];
			  } else {
				return false;
			  }
			}
			jQuery(function($) {
				$('#fuelux-wizard-container')
				.ace_wizard({
					//step: 2 //optional argument. wizard will jump to step "2" at first
					//buttons: '.wizard-actions:eq(0)'
				})
				.on('actionclicked.fu.wizard' , function(e, info){
						if(!$('#report').valid() && info.step===3 && info.direction==='next')
							e.preventDefault();
				})
				//.on('changed.fu.wizard', function() {
				//})
				.on('finished.fu.wizard', function(e) {
					if(!$('#report').valid())
						$('.alert .alert-danger').removeClass('hidden');
					$("#report").submit();
				}).on('stepclick.fu.wizard', function(e){
					//e.preventDefault();//this will prevent clicking and selecting steps
				});


				//documentation : http://docs.jquery.com/Plugins/Validation/validate

				$('#report').validate({
					errorElement: 'div',
					errorClass: 'help-block',
					focusInvalid: true,
					ignore: "",
					rules: {
						date: {
							required: true
						},
						opening:{
							required: true
						},
						closing:{
							required: true
						},
						grosssales:{
							equalTo: "#grossregister"
						},
						netsales:{
							min:0
						}
					},

					messages: {
						date: {
							required: "Please provide a valid date."
						},
						password: {
							required: "Please specify a password."
						},
						grosssales:{
							equalTo: "<i class='ace-icon fa fa-times-circle'>Gross Sales does not match Gross Register Reading.</i>"
						}
					},


					highlight: function (e) {
						$(e).closest('.form-group').removeClass('has-info').addClass('has-error');
					},

					success: function (e) {
						$(e).closest('.form-group').removeClass('has-error');
						$(e).remove();
					},

					errorPlacement: function (error, element) {
						if(element.is('input[type=checkbox]') || element.is('input[type=radio]')) {
							var controls = element.closest('div[class*="col-"]');
							if(controls.find(':checkbox,:radio').length > 1) controls.append(error);
							else error.insertAfter(element.nextAll('.lbl:eq(0)').eq(0));
						}
						else if(element.is('.select2')) {
							error.insertAfter(element.siblings('[class*="select2-container"]:eq(0)'));
						}
						else if(element.is('.chosen-select')) {
							error.insertAfter(element.siblings('[class*="chosen-container"]:eq(0)'));
						}
						else error.insertAfter(element.parent());
					},

					submitHandler: function (form) {
						form.submit();
					},
					invalidHandler: function (form) {
					}
				});

			})
