export default function html([first, ...strings], ...values) {
	return values.reduce((acc, curr) => acc.concat(curr, strings.shift()), [first])
	.filter(x => x && x !== true || x === 0)
	.join('');
}

export function createStore(reducer) {
	let state = reducer();
	const roots = new Map();

	function render() {
		for (const [root, component] of roots) {
			const output = component();
			
			root.innerHTML = output;
		}
	}

	// Store in react and redux have 3 main methods
	return {
		// attach is a key name with value is a function
		// Attach helps us push from view -> root html
		attach(component, root) {
			roots.set(root, component);
			render();
		},

		// Connect between store and view
		// Push data from store to view
		connect(selector = state => state) {
			return component => (props, ...args) => 
				component(Object.assign({}, props, selector(state), ...args))
		},

		// Connect between view and action
		// When user'screen touched -> call action
		dispatch(action, ...args) {
			state = reducer(state, action, args);
			render();
		}
	}
}
