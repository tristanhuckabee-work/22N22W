'use strict';

const db = require('../models');
const { Insect, Tree, InsectTree } = require('../models');

const insectTrees = [
  {
    insect: { name: "Western Pygmy Blue Butterfly" },
    trees: [
      { tree: "General Sherman" },
      { tree: "General Grant" },
      { tree: "Lincoln" },
      { tree: "Stagg" },
    ],
  },
  {
    insect: { name: "Patu Digua Spider" },
    trees: [
      { tree: "Stagg" },
    ],
  },
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    for (let i = 0; i < insectTrees.length; i++) {
      const insectTree = insectTrees[i];

      const { insect, trees } = insectTree;
      const foundInsect = await Insect.findOne({
        where: insect
      });

      for (let j = 0; j < trees.length; j++) {
        const tree = trees[j];

        const foundTree = await Tree.findOne({
          where: tree
        });
        await InsectTree.create({
          treeId: foundTree.id,
          insectId: foundInsect.id
        });
      }
    };
  },
  async down(queryInterface, Sequelize) {
    for (let i = 0; i < insectTrees; i++) {
      const insectTree = insectTrees[i]
      const { insect, trees } = insectTree;
      const foundInsect = await Insect.findOne({
        where: { ...insect }
      });
      for (let j = 0; j < trees.length; j++) {
        const tree = trees[j];

        const foundTree = await Tree.findOne({
          where: tree
        });
        const foundInsectTree = await InsectTree.findOne({
          where: {
            insectId: foundInsect.id,
            treeId: foundTree.id
          }
        });
        await foundInsectTree.destroy();
      };
    }
  }
};
