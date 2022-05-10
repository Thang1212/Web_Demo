var users = [
	{
		id: 1,
		name: 'Co Duy Thang'
	},
	{
		id: 2,
		name: 'Pham Tu Uyen'
	},
	{
		id: 3,
		name: 'Le Thi Hien'
	}
];

var comments = [
	{
		id: 1,
		user_id: 1,
		content: 'Anh Son chua ra video :('
	},
	{
		id: 2,
		user_id: 2,
		content: 'Vua ra xong em oi'
	}
];

function getComments() {
	return new Promise(function (resolve) {
		setTimeout(function () {
			resolve(comments);
		}, 1000);
	})
};

function getUserByIds(userIds) {
	return new Promise(function (resolve) {
		var results = users.filter(function (user) {
			return userIds.include(user.id);
		});

		setTimeout(function () {
			resolve(results);
		}, 1000);
	});
}

getComments()
	.then(function (comments) {
		var userIds = comments.map(function (comment) {
			return comment.user_id;
		})

		return getUserByIds(userIds)
			.then(function (users) {
				return users;
			})
	})
	
	.then(function (data) {
		console.log(data);
	});
