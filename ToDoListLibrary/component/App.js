import html from '../core.js';
import Header from '../component/Header.js';
import { connect } from '../store.js';
import ToDoList from '../component/ToDoList.js';
import Footer from '../component/Footer.js';

function App({ todos }) {
	return html`
		<section class="todoapp">
			${Header()}
			${todos.length > 0 && ToDoList()}
			${todos.length > 0 && Footer()}
		</section>
	`;
}

export default connect()(App);
