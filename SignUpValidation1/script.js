function Validator(options) {
	var selectorRules = {};

	function getParent(element, selector) {
		while (element.parentElement) {
			if (element.parentElement.matches(selector)) {
				return element.parentElement;
			}
			element = element.parentElement;
		}
	};

	function validate(inputElement, rule) {
		var formGroupElement = getParent(inputElement, options.formGroupSelector);
		var errorElement = formGroupElement.querySelector(options.errorSelector);
		var errorMessage;
		var rules = selectorRules[rule.selector];

		for (var i = 0; i < rules.length; ++i) {
			switch(inputElement.type) {
				case 'checkbox':
				case 'radio':
					errorMessage = rules[i](
						formElement.querySelector(rule.selector + ':checked')
					);
					break;
				default: 
					errorMessage = rules[i](inputElement.value);
			};
			if (errorMessage) break;
		}

		if (errorMessage) {
			errorElement.innerText = errorMessage;
			formGroupElement.classList.add('invalid');
		} else {
			errorElement.innerText = '';
			formGroupElement.classList.remove('invalid');
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
				// Don't need to loops through all 3 genders
				// Because validate func will solve that problems
				var inputElement = formElement.querySelector(rule.selector);
				var isValid = validate(inputElement, rule);
				if (!isValid) {
					isFormValid = false;
				}
			});

			if (isFormValid) {
				if (typeof options.onSubmit === "function") {
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
					options.onSubmit(formValues);
				} else {
					formElement.submit();
				}
			}
		};

		// Events dealer
		options.rules.forEach(function(rule) {
			var inputElements = formElement.querySelectorAll(rule.selector);

			// Create a stack for easier validate
			if (Array.isArray(selectorRules[rule.selector])) {
				selectorRules[rule.selector].push(rule.test);
			} else {
				selectorRules[rule.selector] = [rule.test];
			}

			Array.from(inputElements).forEach(function(inputElement) {
				inputElement.onblur = function() {
					validate(inputElement, rule);
				};

				inputElement.oninput = function() {
                    var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
                    errorElement.innerText = '';
                    getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
				};
			});
		});
	}
};

Validator.isRequired = function(selector, message) {
	return {
		selector: selector,
		test: function(value) {
			var checkHTML = /^/;

			//if (checkHTML.test(value)) {
				//return undefined;
			//} else if (value == null || value === "") {
				//return message || "Vui long nhap truong nay";
			//} else {
				//return undefined;
			//}
			return value ? undefined : message || "Vui long nhap truong nay";
		}
	};
};

Validator.isEmail = function(selector, message) {
	return {
		selector: selector,
		test: function(value) {
			var checkEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
			return checkEmail.test(value) ? undefined : message || "Truong nay phai la email";
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
