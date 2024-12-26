// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract todoList{
    uint public taskCount = 0;

    struct Task {
        uint id;
        string content;
        bool completed;
    }

   mapping(uint => Task) public tasks;

   constructor() public {
    createTask("check out this eth-todo-app");
   }

   function createTask(string memory _content) public{
    taskCount ++;
    tasks[taskCount] = Task(taskCount, _content, false);
   }

}