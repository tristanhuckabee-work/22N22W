// Instantiate router - DO NOT MODIFY
const express = require('express');
const router = express.Router();

// BASIC PHASE 1, Step A - Import model
const db = require('../db/models');
// Import Op to perform comparison operations in WHERE clauses
const { Op } = require('sequelize');

// BASIC PHASE 1, Step B - List of all trees in the database
router.get('/', async (req, res, next) => {
  let trees = [];

  trees = await db.Tree.findAll({
    attributes: ['heightFt', 'tree', 'id'],
    order: [['heightFt', 'DESC']]
  });

  res.json(trees);
});

// BASIC PHASE 1, Step C - Retrieve one tree with the matching id
router.get('/:id', async (req, res, next) => {
  let tree;

  try {
    tree = await db.Tree.findByPk(req.params.id);

    if (tree) {
      res.json(tree);
    } else {
      next({
        status: "not-found",
        message: `Could not find tree ${req.params.id}`,
        details: 'Tree not found'
      });
    }
  } catch (err) {
    next({
      status: "error",
      message: `Could not find tree ${req.params.id}`,
      details: err.errors ? err.errors.map(item => item.message).join(', ') : err.message
    });
  }
});

// BASIC PHASE 2 - INSERT tree row into the database
router.post('/', async (req, res, next) => {
  try {
    const {name, location, height, size} = req.body
    let newTree = await db.Tree.create({
      tree: name,
      location,
      heightFt: height,
      groundCircumferenceFt: size
    });

    res.json({
      data: newTree,
      status: "success",
      message: "Successfully created new tree",
    });
  } catch (err) {
    next({
      status: "error",
      message: 'Could not create new tree',
      details: err.errors ? err.errors.map(item => item.message).join(', ') : err.message
    });
  }
});

// BASIC PHASE 3 - DELETE a tree row from the database
router.delete('/:id', async (req, res, next) => {
  try {
    const tree = await db.Tree.findByPk(req.params.id);
    if (!tree) throw new Error();
    
    await tree.destroy();

    res.json({
      status: "success",
      message: `Successfully removed tree ${req.params.id}`,
    });
  } catch (err) {
    next({
      status: "not-found",
      message: `Could not remove tree ${req.params.id}`,
      details: 'Tree not found'
    });
  }
});

// INTERMEDIATE PHASE 4 - UPDATE a tree row in the database
router.put('/:id', async (req, res, next) => {
  try {
    // Your code here
    const bodyId = req.params.id;
    const {id, name, location, height, size} = req.body;
    if (bodyId != id) throw new Error('non matching ids');

    const tree = await db.Tree.findByPk(id);
    if (!tree) throw new Error('not found');

    await tree.update({
      tree: name,
      location: location,
      heightFt: height,
      groundCircumferenceFt: size
    });

    res.status(200);
    return res.json({
      status: 'success',
      message: 'Successfully updated tree',
      data: tree
    });
  } catch (err) {
    let errBody = {};
    if (err.message == 'non matching ids') {
      errBody = {
        status: "error",
        message: 'Could not update tree',
        details: `${req.params.id} does not match ${req.body.id}`
      }
    } else {
      errBody = {
        status: "not-found",
        message: `Could not update tree ${req.params.id}`,
        details: 'Tree not found'
      }
    }

    next(errBody);
  }
});

/**
 * INTERMEDIATE BONUS PHASE 1 (OPTIONAL), Step B:
 *   List of all trees with tree name like route parameter
 *
 * Path: /search/:value
 * Protocol: GET
 * Parameters: value
 * Response: JSON array of objects
 *   - Object properties: heightFt, tree, id
 *   - Ordered by the heightFt from tallest to shortest
 */
router.get('/search/:value', async (req, res, next) => {
  let trees = [];


  res.json(trees);
});

// Export class - DO NOT MODIFY
module.exports = router;