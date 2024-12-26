App = {
  loading: false,
  contracts: {},

  load: async () => {
    await App.loadWeb3();
    await App.loadAccount();
    await App.loadContract();
    await App.render();
  },

  loadWeb3: async () => {
    if (window.ethereum) {
      // Modern dapp browsers
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.request({ method: "eth_requestAccounts" });
        window.web3 = new Web3(window.ethereum);
        console.log("Web3 instance initialized:", window.web3);
      } catch (error) {
        console.error("User denied account access", error);
      }
    } else if (window.web3) {
      // Legacy dapp browsers
      App.web3Provider = window.web3.currentProvider;
      window.web3 = new Web3(window.web3.currentProvider);
      console.log("Legacy Web3 instance initialized:", window.web3);
    } else {
      // Non-dapp browsers
      console.log(
        "Non-Ethereum browser detected. Please install Metamask or another Ethereum provider."
      );
      alert("Non-Ethereum browser detected. Please install Metamask!");
    }
  },

  loadAccount: async () => {
    // Get the user's account
    const accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) {
      alert("No accounts found. Please connect your wallet.");
      return;
    }
    App.account = accounts[0];
    console.log("Current Account:", App.account);
  },

  loadContract: async () => {
    // Load the smart contract
    const todoList = await $.getJSON("TodoList.json");
    App.contracts.TodoList = TruffleContract(todoList);
    App.contracts.TodoList.setProvider(App.web3Provider);

    // Create a JavaScript version of the smart contract
    App.todoList = await App.contracts.TodoList.deployed();
    console.log("Contract loaded:", App.todoList);
  },

  render: async () => {
    // Prevent double render
    if (App.loading) {
      return;
    }

    // Update app loading state
    App.setLoading(true);

    // Display the user's account
    $("#account").html(App.account);

    // Render tasks from the blockchain
    await App.renderTasks();

    // Update loading state
    App.setLoading(false);
  },

  renderTasks: async () => {
    // Get the total number of tasks from the blockchain
    const taskCount = await App.todoList.taskCount();
    const $taskTemplate = $(".taskTemplate");

    // Loop through and render each task
    for (let i = 1; i <= taskCount; i++) {
      const task = await App.todoList.tasks(i);
      const taskId = task[0].toNumber();
      const taskContent = task[1];
      const taskCompleted = task[2];

      // Clone the task template and update its content
      const $newTaskTemplate = $taskTemplate.clone();
      $newTaskTemplate.find(".content").html(taskContent);
      $newTaskTemplate
        .find("input")
        .prop("name", taskId)
        .prop("checked", taskCompleted)
        .on("click", App.toggleCompleted);

      // Place the task in the correct list
      if (taskCompleted) {
        $("#completedTaskList").append($newTaskTemplate);
      } else {
        $("#taskList").append($newTaskTemplate);
      }

      // Display the task
      $newTaskTemplate.show();
    }
  },

  createTask: async () => {
    App.setLoading(true);
    const content = $("#newTask").val();
    await App.todoList.createTask(content, { from: App.account });
    window.location.reload();
  },

  toggleCompleted: async (e) => {
    App.setLoading(true);
    const taskId = e.target.name;
    await App.todoList.toggleCompleted(taskId, { from: App.account });
    window.location.reload();
  },

  setLoading: (boolean) => {
    App.loading = boolean;
    const loader = $("#loader");
    const content = $("#content");
    if (boolean) {
      loader.show();
      content.hide();
    } else {
      loader.hide();
      content.show();
    }
  }
};

$(() => {
  $(window).load(() => {
    App.load();
  });
});
