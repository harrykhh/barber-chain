			function detailFormatter(index, row) {
				var html = [];
				$.each(row.serviceSales.transaction, function (key, value) {
					html.push('<p><b>' + value.desc + '  :  </b>$ ' + value.amount + '</p>');
				});
				$.each(row.retailSales.transaction, function (key, value) {
					html.push('<p><b>' + value.desc + '  :  </b>$ ' + value.amount + '</p>');
				});
				$.each(row.adjustmentGrossSales.transaction, function (key, value) {
					html.push('<p><b>' + value.desc + '  :  </b>$ ' + value.amount + '</p>');
				});
				$.each(row.expense.transaction, function (key, value) {
					html.push('<p><b>' + value.desc + '  :  </b>$ ' + value.amount + '</p>');
				});
				return html.join('');
			}
			function priceFormatter(value) {
				var color = '#000000';
				if (parseFloat(value.toString()) < 0 )
					color = '#FF0000';
				return '<div  style="color: ' + color + '">' +
						'$' +
						value +
						'</div>';
			}
			function totalgr(data) {
				var total = 0;
				$.each(data, function (i, row) {
					total += +(row.grossRegister);
				});
				return '$' + total;
			}
			function totalss(data) {
				var total = 0;
				$.each(data, function (i, row) {
					total += +(row.serviceSales.total);
				});
				return '$' + total;
			}
			function totalrs(data) {
				var total = 0;
				$.each(data, function (i, row) {
					total += +(row.retailSales.total);
				});
				return '$' + total;
			}
			function totalgs(data) {
				var total = 0;
				$.each(data, function (i, row) {
					total += +(row.adjustmentGrossSales.total);
				});
				return '$' + total;
			}
			function totalns(data) {
				var total = 0;
				$.each(data, function (i, row) {
					total += +(row.netSales);
				});
				return '$' + total;
			}
			function totalexpense(data) {
				var total = 0;
				$.each(data, function (i, row) {
					total += +(row.expense.total);
				});
				return '$' + total;
			}
			function totalcertificates(data) {
				var total = 0;
				$.each(data, function (i, row) {
					total += +(row.certificates.total);
				});
				return '$' + total;
			}
			function totalcash(data) {
				var total = 0;
				$.each(data, function (i, row) {
					total += +(row.deposit.cash);
				});
				return '$' + total;
			}
			function totalcc(data) {
				var total = 0;
				$.each(data, function (i, row) {
					total += +(row.deposit.creditcard);
				});
				return '$' + total;
			}
			function totaldpp(data) {
				var total = 0;
				$.each(data, function (i, row) {
					total += +(row.deposit.dpp);
				});
				return '$' + total;
			}
			function totalleftover(data) {
				var color = '#000000';
				var total = 0;
				$.each(data, function (i, row) {
					total += +(row.deposit.leftover);
				});
				if (total < 0 )
					color = '#FF0000';
				return  '<div  style="color: ' + color + '">' +
						'$' +
						total +
						'</div>';
			}
			function totaldeposit(data) {
				var total = 0;
				$.each(data, function (i, row) {
					total += +(row.deposit.total);
				});
				return '$' + total;
			}
			function lastclosing(data) {
				var total = 0;
				$.each(data, function (i, row) {
					total = row.closing;
				});
				return '$' + total;
			}
			function lastopening(data) {
				var total = 0;
				$.each(data, function (i, row) {
					if (i == 0)
						total = row.opening;
				});
				return '$' + total;
			}
			function cb(start, end) {
				$('#date span').html(start.format('MM-DD-YYYY') + '   to   ' + end.format('MM-DD-YYYY'));
				$.ajax({
						url: '/getReportData',
						type: 'GET',
						dataType: 'json',
						data: {
							storeid: $('#storeid').val(),
							startdate: start.format('MM-DD-YYYY'),
							enddate: end.format('MM-DD-YYYY')
						}
				})
				.done(function(data) {
					$.each(data, function (i, row) {
						row.date = moment.utc(row.date).format('MM-DD-YYYY');
					});
					moment.utc(data.date).format('MM-DD-YYYY');
					$('#table').bootstrapTable("load", data);
				})
				.fail(function() {
						console.log("error");
				});
			}
			jQuery(function($) {
					$('#table').bootstrapTable({
						showExport: true,
						exportTypes: ['excel', 'xlsx', 'pdf'],
						exportOptions : { 
											fileName: $('.storeName').html() + ' Report ' + moment().format(),
											type:'pdf',
											jspdf: { 
													orientation: 'l',
													format: 'a4',
													margins: {left:10, right:10, top:20, bottom:20}
												  }
										},
						columns: [
						[ {
								title: 'Date',
								field: 'date',
								rowspan: 2,
								align: 'center',
								valign: 'middle',
								footerFormatter: 'Summary:',
								sortable: false
							}, {
								title: 'Register',
								colspan: 3,
								align: 'center'
							}, {
								title: 'Sales',
								colspan: 3,
								align: 'center'
							}, {
								title: 'Net Sales',
								field: 'netSales',
								rowspan: 1,
								colspan: 1,
								align: 'center',
								valign: 'middle'
							}, {
								title: 'Payouts',
								colspan: 2,
								align: 'center'
							}, {
								title: 'Deposits',
								colspan: 5,
								align: 'center'
							}
						],
						[
							{
								field: 'opening',
								title: 'Open',
								align: 'center',
								footerFormatter: 'lastopening',
								formatter: 'priceFormatter'
							}, {
								field: 'closing',
								title: 'Close',
								align: 'center',
								footerFormatter: 'lastclosing',
								formatter: 'priceFormatter'
							}, {
								field: 'grossRegister',
								title: 'Gross',
								align: 'center',
								footerFormatter: 'totalss',
								formatter: 'priceFormatter'
							}, {
								field: 'serviceSales.total',
								title: 'Service',
								align: 'center',
								footerFormatter: 'totalgr',
								formatter: 'priceFormatter'
							}, {
								field: 'retailSales.total',
								title: 'Retail',
								align: 'center',
								footerFormatter: 'totalrs',
								formatter: 'priceFormatter'
							}, {
								field: 'adjustmentGrossSales.total',
								title: 'Adj. Gross',
								align: 'center',
								footerFormatter: 'totalgs',
								formatter: 'priceFormatter'
							}, {
								title: 'Net Sales',
								field: 'netSales',
								align: 'center',
								footerFormatter: 'totalns',
								formatter: 'priceFormatter'
							},{
								field: 'expense.total',
								title: 'Exp.',
								align: 'center',
								footerFormatter: 'totalexpense',
								formatter: 'priceFormatter'
							}, {
								field: 'certificates.total',
								title: 'Cert.',
								align: 'center',
								footerFormatter: 'totalcertificates',
								formatter: 'priceFormatter'
							}, {
								field: 'deposit.cash',
								title: 'Cash',
								align: 'center',
								footerFormatter: 'totalcash',
								formatter: 'priceFormatter'
							}, {
								field: 'deposit.creditcard',
								title: 'CCards',
								align: 'center',
								footerFormatter: 'totalcc',
								formatter: 'priceFormatter'
							}, {
								field: 'deposit.dpp',
								title: 'DPP',
								align: 'center',
								footerFormatter: 'totaldpp',
								formatter: 'priceFormatter'
							}, {
								field: 'deposit.leftover',
								title: 'Overage',
								align: 'center',
								footerFormatter: 'totalleftover',
								formatter: 'priceFormatter'
							}, {
								field: 'deposit.total',
								title: 'Deposit',
								align: 'center',
								footerFormatter: 'totaldeposit',
								formatter: 'priceFormatter'
							}
						]
					]
					});
				$(document).ready(function(){
					$('#startdate').change(function(){
						$('#enddate').datepicker('setStartDate', $('#startdate').val());
					});
				});
			});
