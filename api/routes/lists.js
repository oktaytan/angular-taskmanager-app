const express = require('express');
const router = express.Router();

// Load in the mongoose models
const { List, Task } = require('../db/models/index.js');

/**
 * GET /lists
 * Purpose: Get all lists
 */
router.get('/', (req, res) => {
	// We want to an array of all the lists in the database
	List.find({})
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
 * POST /lists
 * Purpose: Create a list
 */
router.post('/', (req, res) => {
	// We want to create a new list and return the new list document back to the user (which includes the id)
	// The list information (fields) will be passed in via the JSON request body
	let title = req.body.title;

	let newList = new List({
		title,
	});

	newList
		.save()
		.then((listDoc) => {
			// The full list document is returned
			res.status(201).json(listDoc);
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
		{ _id: req.params.id },
		{
			$set: req.body,
		}
	)
		.then(() => {
			res.sendStatus(200);
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
	})
		.then((removedList) => {
			res.json(removedList);
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
 * POST /lists/:listId/tasks
 * Purpose: Create a new task in a specific list
 */
router.post('/:listId/tasks', (req, res) => {
	// We want to create a new task in a list specified by listId
	let newTask = new Task({
		title: req.body.title,
		_listId: req.params.listId,
	});

	newTask
		.save()
		.then((newTaskDoc) => {
			res.status(201).json(newTaskDoc);
		})
		.catch((err) => {
			res.status(500).send({
				success: false,
				msg: err,
			});
		});
});

/**
 * PATCH /lists/:listId/tasks/:taskId
 * Purpose: Update an existing task
 */
router.patch('/:listId/tasks/:taskId', (req, res) => {
	// We want to update an existing task (specified by taskId)

	Task.findOneAndUpdate(
		{
			_id: req.params.taskId,
			_listId: req.params.listId,
		},
		{
			$set: req.body,
		}
	)
		.then(() => {
			res.status(201).json({ success: true, message: 'Updated successfully.' });
		})
		.catch((err) => {
			res.status(500).send({
				success: false,
				msg: err,
			});
		});
});

/**
 * DELETE /lists/:listId/tasks/:taskId
 * Purpose: Delete a task
 */
router.delete('/:listId/tasks/:taskId', (req, res) => {
	Task.findOneAndRemove({
		_id: req.params.taskId,
		_listId: req.params.listId,
	})
		.then((removedTaskDoc) => {
			res.json(removedTaskDoc);
		})
		.catch((err) => {
			res.status(500).send({
				success: false,
				msg: err,
			});
		});
});

module.exports = router;
