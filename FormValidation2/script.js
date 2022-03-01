function Validator(options) {
	var selectorRules = {};

	function validate(inputElement, rule) {
		var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
		var errorMessage;
		// Take all rules of selector
		var rules = selectorRules[rule.selector];

		// Loop through each rule and check
		// If have any error, stop the loop
		for (var i = 0; i < rules.length; ++i) {
			errorMessage = rules[i](inputElement.value);
			if (errorMessage) break;
		}

		if (errorMessage) {
			errorElement.innerText = errorMessage;
			inputElement.parentElement.classList.add('invalid');
		} else {
			errorElement.innerText = '';
			inputElement.parentElement.classList.remove('invalid');
		}
	};

	var formElement = document.querySelector(options.form);
	if (formElement) {

		// Deal with submit form
		formElement.onsubmit = function(e) {
			e.preventDefault();

			options.rules.forEach(function(rule) {
				var inputElement = formElement.querySelector(rule.selector);
				validate(inputElement, rule);
			});
		}

		// Deal with event
		options.rules.forEach(function(rule) {
			
			// Save rule for each input
			if (Array.isArray(selectorRules[rule.selector])) {
				selectorRules[rule.selector].push(rule.test);
			} else {
				selectorRules[rule.selector] = [rule.test];
			}

			var inputElement = formElement.querySelector(rule.selector);

			if (inputElement) {
				// When blur out of input box
				inputElement.onblur = function() {
					validate(inputElement, rule);
				};

				// Insert in input box
				inputElement.oninput = function() {
					var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
					errorElement.innerText = '';
					inputElement.parentElement.classList.remove('invalid');

				};
			}
		});
	}
};

Validator.isRequired = function(selector, message) {
	return {
		selector: selector,
		test: function(value) {
			return value.trim() ? undefined : message || "Vui long nhap truong nay";
		}
	};
};

Validator.isEmail = function(selector, message) {
	return {
		selector: selector, 
		test: function(value) {
			var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
			return regex.test(value) ? undefined : message || "Truong nay phai la email";
		}
	};
};

Validator.minLength = function(selector, min, message) {
	return {
		selector: selector,
		test: function(value) {
			return value.length >= 6 ? undefined : message || `Vui long nhap vao ${min} ki tu`;
		}
	};
};

Validator.isConfirmed = function(selector, getConfirmValue, message) {
	return {
		selector: selector,
		test: function(value) {
			return value === getConfirmValue() ? undefined : message || 'Gia tri nhap vao khong chinh xac.';
		}
	};
};
