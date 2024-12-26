const App = {
  load: async () => {
    await App.loadWeb3();
    await App.loadAccount();
  },

  // Load Web3 instance and connect to Ethereum provider
  loadWeb3: async () => {
    if (typeof web3 !== "undefined") {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      window.alert("Please connect to Metamask.");
    }

    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum);
      try {
        // Request account access if needed
        await ethereum.request({ method: "eth_requestAccounts" });
      } catch (error) {
        console.log("User denied account access:", error);
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider;
      window.web3 = new Web3(web3.currentProvider);
    }
    // Non-dapp browsers...
    else {
      console.log(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  },

  // Load the current account connected to Metamask
  loadAccount: async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      App.account = accounts[0]; // Get the first account
      if (!App.account) {
        console.log("No accounts found. Please connect MetaMask.");
      } else {
        console.log("Current Account:", App.account);
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  }
};

$(document).ready(() => {
  $(window).on("load", async () => {
    await App.load();
  });
});
