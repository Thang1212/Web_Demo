function Validator(formSelector) {
	var _this = this;

	function getParent(element,selector) {
		while (element.parentElement) {
			if (element.parentElement.matches(selector)) {
				return element.parentElement;
			}
			element = element.parentElement;
		}
	}

	var formRules = {};
	var formElement = document.querySelector(formSelector);

	var validatorRules = {
		required: function (value) {
			return value ? undefined : 'Vui long nhap truong nay';
		},
		email: function (value) {
			var checkEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
			return checkEmail.test(value) ? undefined : 'Vui long nhap email';
		},
		min: function (min) {
			return function (value) {
				return value.length >= min ? undefined : `Vui long nhap toi thieu ${min} ki tu`;
			}
		},
		max: function (max) {
			return function (value) {
				return value.length <= max ? undefined : `Vui long nhap it hon ${max} ki tu`;
			}
		}
	};

	if (formElement) {
		var inputs = formElement.querySelectorAll('[name][rules]');
		for (var input of inputs) {
			var rules = input.getAttribute('rules').split('|');
			for (var rule of rules) {
				var ruleInfo;
				var isRuleHasValue = rule.includes(':');

				if (isRuleHasValue) {
					ruleInfo = rule.split(':');
					rule = ruleInfo[0];
				}

				var ruleFunc = validatorRules[rule];
				if (isRuleHasValue) {
					ruleFunc = ruleFunc(ruleInfo[1]);
				}

				if (Array.isArray(formRules[input.name])) {
					formRules[input.name].push(ruleFunc);
				} else {
					formRules[input.name] = [ruleFunc];
				}
			}

			// Event dealer
			input.onblur = handleValidate;
			input.oninput = handleClearError;
		}

		function handleValidate(event) {
			var rules = formRules[event.target.name];
			var errorMessage;

			for (var rule of rules) {
				errorMessage = rule(event.target.value);
				if (errorMessage) break;
			}

			if (errorMessage) {
				var formGroup = getParent(event.target, '.form__group');
				if (formGroup) {
					var formMessage = formGroup.querySelector('.form__message');
					if (formMessage) {
						formGroup.classList.add('invalid');
						formMessage.innerText = errorMessage;
					}
				}
			}

			return !errorMessage;
		}

		function handleClearError(error) {
			var formGroup = getParent(event.target, '.form__group');
			var formMessage = formGroup.querySelector('.form__message');
			
			if (formGroup.classList.contains('invalid')) {
				formGroup.classList.remove('invalid');

				if (formMessage) {
					formMessage.innerText = '';
				}
			}
		}
	}

	formElement.onsubmit = function(event) {
		event.preventDefault();
		var inputs = formElement.querySelectorAll('[name][rules]');
		var isValid = true;
		for (var input of inputs) {
			if (!handleValidate({target: input})) {
				isValid = false;
			}

		}

		if (isValid) {
			if (typeof _this.onSubmit === 'function') {
				var enableInputs = formElement.querySelectorAll('[name]:not([disabled])');
				var formValues = Array.from(enableInputs).reduce(function(values, input){
					switch(input.type) {
						case 'radio':
							values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value;
							break;
						case 'checkbox':
							if (!input.matches(':checked')) {
								values[input.name] = '';
								return values;
							}
							if (!Array.isArray(values[input.name])) {
								values[input.name] = [];
							}
							values[input.name].push(input.value);
							break;
						case 'file':
							values[input.name] = input.files;
							break;
						default:
							values[input.name] = input.value;
					};
					return values;
				}, {});
				_this.onSubmit(formValues);
			} else {
				this.submit();
			}
		}
	}
}
