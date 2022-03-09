function Validator(options) {
	var selectorRules = {};

	function removeInvalidEffect(inputElement) {
		var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
		inputElement.parentElement.classList.remove('invalid');
		errorElement.innerText = '';
	};

	function validate(inputElement, rule) {
		var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
		var errorMessage;
		var rules = selectorRules[rule.selector];

		for (var i = 0; i < rules.length; ++i) {
			errorMessage = rules[i](inputElement.value);
			if (errorMessage) break;
		}

		if (errorMessage) {
			errorElement.innerText = errorMessage;
			inputElement.parentElement.classList.add('invalid');
		} else {
			removeInvalidEffect(inputElement);
		}

		return !errorMessage;
	};

	var formElement = document.querySelector(options.form);
	if (formElement) {

		// When user submit form
		formElement.onsubmit = function(e) {
			e.preventDefault();		

			var isFormValid = true;
			options.rules.forEach(function(rule) {
				var inputElement = formElement.querySelector(rule.selector);
				var isValid = validate(inputElement, rule);
				if (!isValid) {
					isFormValid = false;
				}
			});

			if (isFormValid) {
				if (typeof options.onSubmit === "function") {
					var enableInputs = formElement.querySelectorAll('[name]:not([disabled])');
					var formValue = Array.from(enableInputs).reduce(function(values, input){
						values[input.name] = input.vlaue;
						return values;
					}, {});
					options.onSubmit(formValue);
				} else {
					formElement.submit();
				}
			}
		};

		// Events dealer
		options.rules.forEach(function(rule) {
			var inputElement = formElement.querySelector(rule.selector);

			// Create a stack for easier validate
			if (Array.isArray(selectorRules[rule.selector])) {
				selectorRules[rule.selector].push(rule.test);
			} else {
				selectorRules[rule.selector] = [rule.test];
			}

			if (inputElement) {
				inputElement.onblur = function() {
					validate(inputElement, rule);
				};

				inputElement.oninput = function() {
					removeInvalidEffect(inputElement);
				};
			}
		});
	};
};

Validator.isRequired = function(selector, message) {
	return {
		selector: selector,
		test: function(value) {
			return value.trim() ? undefined : "Vui long nhap truong nay";
		}
	};
};

Validator.isEmail = function(selector, message) {
	return {
		selector: selector,
		test: function(value) {
			var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
			return regex.test(value) ? undefined : "Truong nay phai la email";
		}
	};
};

Validator.minLength = function(selector, min, message) {
	return {
		selector: selector,
		test: function(value) {
			return value.length >= min ? undefined : message || `Vui long nhap toi thieu ${min} ki tu`;
		}
	};
};

Validator.isConfirmed = function(selector, getConfirmValue, message) {
	return {
		selector: selector,
		test: function(value) {
			return value === getConfirmValue() ? undefined : message || "Gia tri nhap vao khong chinh xac";
		}
	};
};
