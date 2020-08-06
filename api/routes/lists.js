const express = require('express');
const router = express.Router();

// Load in the mongoose models
const { List, Task } = require('../db/models/index.js');

/**
 * GET /lists
 * Purpose: Get all lists
 */
router.get('/', (req, res) => {
	// We want to an array of all the lists that belong to the authenticated user
	List.find({
		_userId: req.user_id,
	})
		.then((lists) => {
			res.status(200).send(lists);
		})
		.catch((err) => {
			res.status(500).send({
				success: false,
				msg: err,
			});
		});
});

/**
 * GET /lists/:d
 * Purpose: Get the list by id
 */
router.get('/:id', (req, res) => {
	// We want to an array of all the lists that belong to the authenticated user
	List.findOne({
		_userId: req.user_id,
		_id: req.params.id,
	})
		.then((list) => {
			res.status(200).send(list);
		})
		.catch((err) => {
			res.status(500).send({
				success: false,
				msg: err,
			});
		});
});

/**
 * POST /lists
 * Purpose: Create a list
 */
router.post('/', (req, res) => {
	// We want to create a new list and return the new list document back to the user (which includes the id)
	// The list information (fields) will be passed in via the JSON request body
	let title = req.body.title;

	let newList = new List({
		title,
		_userId: req.user_id,
	});

	newList
		.save()
		.then((listDoc) => {
			// The full list document is returned
			res.status(201).send(listDoc);
		})
		.catch((err) => {
			res.status(500).send({
				success: false,
				msg: err,
			});
		});
});

/**
 * PATCH /lists/:id
 * Purpose: Update a specified list
 */
router.patch('/:id', (req, res) => {
	// We want to update the specified list with the new values
	List.findOneAndUpdate(
		{ _id: req.params.id, _userId: req.user_id },
		{
			$set: req.body,
		}
	)
		.then(() => {
			res.send({ message: 'Updated successfully.' });
		})
		.catch((err) => {
			res.status(500).send({
				success: false,
				msg: err,
			});
		});
});

/**
 * DELETE /lists/:id
 * Purpose: Delete a list
 */
router.delete('/:id', (req, res) => {
	// We want to delete the specified list
	List.findOneAndRemove({
		_id: req.params.id,
		_userId: req.user_id,
	})
		.then((removedList) => {
			res.send(removedList);

			// delete all the tasks that are in the deleted list
			deleteTasksFromList(removedList._id);
		})
		.catch((err) => {
			res.status(500).send({
				success: false,
				msg: err,
			});
		});
});

/**
 * GET /lists/:listId/tasks
 * Purpose: Get all tasks in a specific list
 */
router.get('/:listId/tasks', (req, res) => {
	// We want to return all tasks that belong to a specific list (specified by listId)
	Task.find({
		_listId: req.params.listId,
	})
		.then((tasks) => {
			res.send(tasks);
		})
		.catch((err) => {
			res.status(500).send({
				success: false,
				msg: err,
			});
		});
});

/**
 * GET /lists/:listId/tasks/:taskId
 * Purpose: Get the task by id in a specific list
 */
router.get('/:listId/tasks/:taskId', (req, res) => {
	Task.findOne({
		_listId: req.params.listId,
		_id: req.params.taskId,
	})
		.then((task) => {
			res.send(task);
		})
		.catch((err) => {
			res.status(500).send({
				success: false,
				msg: err,
			});
		});
});

/**
 * POST /lists/:listId/tasks
 * Purpose: Create a new task in a specific list
 */
router.post('/:listId/tasks', (req, res) => {
	// We want to create a new task in a list specified by listId

	List.findOne({
		_id: req.params.listId,
		_userId: req.user_id,
	})
		.then((list) => {
			if (list) {
				// list object with the specified conditions was found
				// therefore the currently authenticated user can create new tasks
				return true;
			}

			// else - the list object is undefined
			return false;
		})
		.then((canCreateTask) => {
			if (canCreateTask) {
				let newTask = new Task({
					title: req.body.title,
					_listId: req.params.listId,
				});
				newTask.save().then((newTaskDoc) => {
					res.send(newTaskDoc);
				});
			} else {
				res.sendStatus(404);
			}
		});
});

/**
 * PATCH /lists/:listId/tasks/:taskId
 * Purpose: Update an existing task
 */
router.patch('/:listId/tasks/:taskId', (req, res) => {
	// We want to update an existing task (specified by taskId)
	List.findOne({
		_id: req.params.listId,
		_userId: req.user_id,
	})
		.then((list) => {
			if (list) {
				// list object with the specified conditions was found
				// therefore the currently authenticated user can make updates to tasks within this list
				return true;
			}

			// else - the list object is undefined
			return false;
		})
		.then((canUpdateTasks) => {
			if (canUpdateTasks) {
				// the currently authenticated user can update tasks
				Task.findOneAndUpdate(
					{
						_id: req.params.taskId,
						_listId: req.params.listId,
					},
					{
						$set: req.body,
					}
				).then(() => {
					res.send({ message: 'Updated successfully.' });
				});
			} else {
				res.sendStatus(404);
			}
		});
});

/**
 * DELETE /lists/:listId/tasks/:taskId
 * Purpose: Delete a task
 */
router.delete('/:listId/tasks/:taskId', (req, res) => {
	List.findOne({
		_id: req.params.listId,
		_userId: req.user_id,
	})
		.then((list) => {
			if (list) {
				// list object with the specified conditions was found
				// therefore the currently authenticated user can make updates to tasks within this list
				return true;
			}

			// else - the list object is undefined
			return false;
		})
		.then((canDeleteTasks) => {
			if (canDeleteTasks) {
				Task.findOneAndRemove({
					_id: req.params.taskId,
					_listId: req.params.listId,
				}).then((removedTaskDoc) => {
					res.send(removedTaskDoc);
				});
			} else {
				res.sendStatus(404);
			}
		});
});

/* HELPER METHODS */
let deleteTasksFromList = (_listId) => {
	Task.deleteMany({
		_listId,
	}).then(() => {
		console.log('Tasks from ' + _listId + ' were deleted!');
	});
};

module.exports = router;
