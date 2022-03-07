function Validator(options) {
	function removeInvalidAffect(inputElement) {
		inputElement.parentElement.classList.remove('invalid');
	};

	function validate(inputElement, rule) {
		var errorElement = inputElement.parentElement.querySelector(options.errorSelector);	
		var errorMessage = rule.test(inputElement.value);
		if (errorMessage) {
			errorElement.innerText = errorMessage;
			inputElement.parentElement.classList.add('invalid');
		} else {
			removeInvalidAffect(inputElement);
		}
	};

	var formElement = document.querySelector(options.form);
	if (formElement) {
		options.rules.forEach(function(rule) {
			var inputElement = formElement.querySelector(rule.selector);
			if (inputElement) {
				// If user input done and out
				inputElement.onblur = function() {
					validate(inputElement, rule);
				};

				// If user input things again (user experience)
				inputElement.oninput = function() {
					removeInvalidAffect(inputElement);
				};
			} 
		});
	}
};

Validator.isRequired = function(selector) {
	return {
		selector: selector,
		test: function(value) {
			return value.trim() ? undefined : "Vui long nhap truong nay";
		}
	};
}

Validator.isEmail = function(selector) {
	return {
		selector: selector,
		test: function(value) {
			var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
			return regex.test(value) ? undefined : "Truong nay phai la email";
		}
	};
}

Validator.minLength = function(selector, min) {
	return {
		selector: selector,
		test: function(value) {
			return value.length >= min ? undefined : `Vui long nhap vao it nhat ${min} ki tu`;
		}
	};
}
