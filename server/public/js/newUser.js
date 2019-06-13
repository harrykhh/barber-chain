			jQuery(function($) {
				$(document).ready(function(){
					$('#admin').change(function(){
						if ($('#admin').prop('checked')) {
								$('#storesselect').hide();
						} else {
								$('#storesselect').show();
						}
					});
			  });
				$.ajax({
						url: '/getStores',
						type: 'GET',
						dataType: 'json',
				})
				.done(function(data) {
						var output = '';
					 $.each(data, function(index, el) {
							 output += '<option class="results" value="'+el.id+'">'+el.desc+'</option>';
					 });
					 $('#duallist').append(output);
					 $('#duallist').bootstrapDualListbox({
						 nonSelectedListLabel: 'Non-selected Stores',
					   selectedListLabel: 'Selected Stores',
					 });
				})
				.fail(function() {
						console.log("error");
				});
				var $validation = false;
				$('#validate-form').validate({
					errorElement: 'div',
					errorClass: 'help-block',
					focusInvalid: true,
					ignore: "",
					rules: {
						username: {
							required: true
						},
						email: {
							required: true,
							email:true
						},
						password: {
							required: true,
							minlength: 5
						},
						password2: {
							required: true,
							minlength: 5,
							equalTo: "#password"
						}
					},
					messages: {
						email: {
							required: "Please provide a valid email.",
							email: "Please provide a valid email."
						},
						password: {
							required: "Please specify a password.",
							minlength: "Please specify a secure password."
						},
						password2: {
							equalTo: "Passwords do not match, plesase verify both passwords and try again."
						}
					},


					highlight: function (e) {
						$(e).closest('.form-group').removeClass('has-info').addClass('has-error');
						$('button[type="submit"]').attr('disabled',true);
					},

					success: function (e) {
						$(e).closest('.form-group').removeClass('has-error');//.addClass('has-info');
						$('button[type="submit"]').attr('disabled',false);
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
			});
