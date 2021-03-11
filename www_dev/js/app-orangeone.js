/*
 * Modal OrangeOne Controller
 */

var _FormSubmitUrl = 'https://campaigns.ing.com.au/resource/api/OrangeOne/Register';
var _FormSubmitErrorDefault = 'Sorry, we should be up and running again shortly.';

(function() {
	'use strict';

	angular
		.module('ING-App')
		.controller('ModalOrangeOneController', ModalOrangeOneController);

	ModalOrangeOneController.$inject = ['$scope', '$http', '$timeout'];
	function ModalOrangeOneController($scope, $http, $timeout) {

		var pageRegister = "orangeOneModalTemplateRegister.html";
		var pageForm = "orangeOneModalTemplateForm.html";
		var pageThanks = "orangeOneModalTemplateThanks.html";

		var vm = this;
		vm.templateUrl = pageRegister;
		vm.customerInfo = {
			email: '',
			givenName: '',
			familyName: '',
		};
		vm.patternInfo = {
			email: /^(\w[-._+\w]*\w@\w[-._\w]*\w\.\w{2,3})$/
		};
		vm.errorMessage = '';
		vm.showNewFormView = showNewFormView;
		vm.showThanksView = showThanksView;
		vm.closeModal = closeModal;
		vm.submitOrangeOneForm = submitOrangeOneForm;

		$('#orangeOneModal').on('hidden.bs.modal', function(e) {
			$timeout(function() {
				vm.templateUrl = pageRegister;
				vm.customerInfo = {
					givenName: '',
					familyName: '',
					email: ''
				};
			});
		});

		function showNewFormView() {
			vm.templateUrl = pageForm;
			$timeout(function() {
				$('#orangeOneFormFirstField').focus();
			});
		}

		function showThanksView() {
			vm.templateUrl = pageThanks;
		}

		function closeModal() {
			$('#orangeOneModal').modal('hide');
			resetForm();
		}

		function submitOrangeOneForm(form) {
			if (form.$valid) {
				vm.isSubmitting = true;
				$http({
					method: "POST",
					url: _FormSubmitUrl,
					headers: { 'Content-Type': 'application/json;charset=UTF-8' },
					data: {
						FirstName: vm.customerInfo.givenName,
						LastName: vm.customerInfo.familyName,
						Email: vm.customerInfo.email,
					}
				})
				.success( function( response ) {
					showThanksView();
					resetForm();
				})
				.error( function( error ) {
					vm.errorMessage = _FormSubmitErrorDefault;
					vm.isSubmitting = false;
				})
				.finally( function() {
				});
			}
		}

		function resetForm(form) {
			$timeout(function() {
				vm.isSubmitting = false;
				vm.errorMessage = '';
				vm.customerInfo = {
					givenName: '',
					familyName: '',
					email: ''
				};
				if (form != undefined) {
					form.$setPristine();
					form.$setUntouched();
				}
			}, 500)
		}
	}

})();
