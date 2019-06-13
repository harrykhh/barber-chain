			jQuery(function($) {
				$(document).ready(function(){
					$('#admin').change(function(){
						if ($('#admin').prop('checked')) {
								$('#storesselect').hide();
						} else {
								$('#storesselect').show();
						}
					});
					$('#selectUser').change(function(){
							//Selected value
							var inputValue = $(this).val();
							$('#storeid').val($(this).val());
							//Ajax for calling php function
							$.ajax({
									url: '/getUsers',
									type: 'GET',
									dataType: 'json',
									data: {
										username: inputValue
									}
							})
							.done(function(data) {
			 					$('#username').val(data.username);
								$('#email').val(data.email);
								$('#admin').prop('checked',data.admin);
								$('#duallist').val(data.stores);
								$("#duallist .results").attr("selected", false);
								$.each(data.stores, function(index, element) {
									$('#duallist .results[value=' + element +']').attr("selected", "selected")
								});
								$('#duallist').bootstrapDualListbox('refresh');
								if (data.username == 'admin'){
									$('#isadmin').hide();
									$('#storesselect').hide();
								}else{
									$('#isadmin').show();
									$('#storesselect').show();
								}
								if (data.admin)
									$('#storesselect').hide();
							})
							.fail(function() {
									console.log("error");
							});
					});
				});
				$.ajax({
						url: '/getUsers?username=admin',
						type: 'GET',
						dataType: 'json',
				})
				.done(function(data) {
					$('#username').val(data.username);
					$('#email').val(data.email);
					$('#admin').prop('checked',data.admin);
					$('#isadmin').hide();
					$('#storesselect').hide();
					$('#duallist').val(data.stores);
				})
				.fail(function() {
						console.log("error");
				});

				$.ajax({
						url: '/getUsers',
						type: 'GET',
						dataType: 'json',
				})
				.done(function(data) {
						var output = '';
					 $.each(data, function(index, el) {
							 output += '<option class="results" value="'+el.id+'">'+el.id+'</option>';
					 });
					 $('#selectUser').append(output);
				})
				.fail(function() {
						console.log("error");
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
				$('#validate-form').validate({
					errorElement: 'div',
					errorClass: 'help-block',
					focusInvalid: true,
					ignore: "",
					rules: {
						email: {
							required: true,
							email:true
						},
						password: {
							minlength: 5
						},
						password2: {
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
