const todoList = artifacts.require("./todoList.sol");

module.exports = function (deployer) {
  deployer.deploy(todoList);
};
