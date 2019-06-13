			jQuery(function($) {
				$(document).ready(function(){
					$('#selectStore').change(function(){
							//Selected value
							var inputValue = $(this).val();
							$('#storeid').val($(this).val());
							//Ajax for calling php function
							$.ajax({
									url: '/getStores',
									type: 'GET',
									dataType: 'json',
									data: {
										id: inputValue
									}
							})
							.done(function(data) {
			 					$('#desc').val(data.description);
								$('#date').datepicker('update', data.openingdate);
								$('#openingRegister').val(data.openingregister);
							})
							.fail(function() {
									console.log("error");
							});
					});
				});
				$.ajax({
						url: '/getStores?id=1',
						type: 'GET',
						dataType: 'json',
				})
				.done(function(data) {
 					$('#desc').val(data.description);
					$('#date').datepicker('update', data.openingdate);
					$('#openingRegister').val(data.openingregister);
					$('#storeid').val(1);
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
					 $('#selectStore').append(output);
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
						storeDesc: {
							required: true
						},
						date: {
							required: true
						},
						openingRegister: {
							required: true
						}
					},
					messages: {
						storeDesc: {
							required: "Please provide a name for the store."
						},
						date: {
							required: "Please specify a date."
						},
						openingRegister: {
							required: "Please provide a register opening amount."
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
