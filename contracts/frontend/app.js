let provider;
let signer;
let contract;

const contractAddress = "0x27a7424e55B583F7AbC1D733e2eFbc77A61396FE";
const abi = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_rideId",
				"type": "uint256"
			}
		],
		"name": "acceptRide",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_rideId",
				"type": "uint256"
			}
		],
		"name": "completeRide",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_rideId",
				"type": "uint256"
			}
		],
		"name": "confirmArrival",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_rideId",
				"type": "uint256"
			}
		],
		"name": "fundRide",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_tariff",
				"type": "uint256"
			}
		],
		"name": "registerDriver",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_driver",
				"type": "address"
			}
		],
		"name": "requestRide",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "drivers",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "tariff",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isRegistered",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_driver",
				"type": "address"
			}
		],
		"name": "getDriver",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "tariff",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "isRegistered",
						"type": "bool"
					}
				],
				"internalType": "struct RideHailing.Driver",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getRidesCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "rides",
		"outputs": [
			{
				"internalType": "address",
				"name": "passenger",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "driver",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "enum RideHailing.RideStatus",
				"name": "status",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

// Fungsi untuk connect wallet
async function connect() {
  if (!window.ethereum) {
    alert("Silakan install MetaMask terlebih dahulu!");
    return;
  }

  try {
    console.log("Connecting to MetaMask...");
    
    // Request akun dari MetaMask
    const accounts = await window.ethereum.request({ 
      method: "eth_requestAccounts" 
    });
    
    console.log("Accounts:", accounts);

    // Setup provider & signer dengan ethers v6
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();

    // Setup contract
    contract = new ethers.Contract(contractAddress, abi, signer);

    const address = await signer.getAddress();
    const accountElement = document.getElementById("account");
    if (accountElement) {
      accountElement.innerText = "Connected: " + address.substring(0, 6) + "..." + address.substring(38);
    }
    
    console.log("✅ Connected successfully as:", address);
    console.log("✅ Contract initialized at:", contractAddress);
    
    // Check network
    const network = await provider.getNetwork();
    console.log("Network:", network.name, "Chain ID:", network.chainId.toString());
    
    // Enable buttons setelah connect
    enableButtons();
    
  } catch (err) {
    console.error("❌ Connection failed:", err);
    alert("Gagal connect wallet: " + err.message);
  }
}

// Enable semua buttons setelah connect
function enableButtons() {
  const buttons = ['registerBtn', 'requestBtn', 'checkDriverBtn', 'acceptBtn', 'fundBtn', 'confirmBtn', 'completeBtn'];
  buttons.forEach(btnId => {
    const btn = document.getElementById(btnId);
    if (btn) btn.disabled = false;
  });
}

/* ================= DRIVER FUNCTIONS ================= */
async function registerDriver() {
  if (!contract) {
    alert("Silakan connect wallet terlebih dahulu!");
    return;
  }

  try {
    const name = prompt("Masukkan nama driver:", "Driver Budi");
    if (!name) return;
    
    const tariff = prompt("Masukkan tarif per km (dalam ETH):", "0.01");
    if (!tariff) return;

    console.log("Registering driver:", name, "with tariff:", tariff, "ETH");
    
    const tx = await contract.registerDriver(
      name,
      ethers.parseEther(tariff)
    );
    
    console.log("Transaction sent:", tx.hash);
    alert("Transaksi dikirim! Hash: " + tx.hash);
    
    console.log("Waiting for confirmation...");
    const receipt = await tx.wait();
    
    console.log("✅ Transaction confirmed:", receipt);
    alert("Driver berhasil didaftarkan!");
    
  } catch (e) {
    console.error("❌ Register failed:", e);
    if (e.reason) {
      alert("Gagal register: " + e.reason);
    } else if (e.message) {
      alert("Gagal register: " + e.message);
    } else {
      alert("Gagal register driver");
    }
  }
}

async function checkDriver() {
  if (!contract) {
    alert("Silakan connect wallet terlebih dahulu!");
    return;
  }

  try {
    const address = await signer.getAddress();
    console.log("Checking driver status for:", address);
    
    const driver = await contract.getDriver(address);
    console.log("Driver info:", driver);
    
    if (driver.isRegistered) {
      const tariffInEth = ethers.formatEther(driver.tariff);
      alert(`Driver Info:\nName: ${driver.name}\nTariff: ${tariffInEth} ETH\nRegistered: Yes`);
    } else {
      alert("Anda belum terdaftar sebagai driver");
    }
  } catch (e) {
    console.error("❌ Check driver failed:", e);
    alert("Gagal cek status driver: " + e.message);
  }
}

/* ================= PASSENGER FUNCTIONS ================= */
async function requestRide() {
  if (!contract) {
    alert("Silakan connect wallet terlebih dahulu!");
    return;
  }

  try {
    const driverAddress = prompt("Masukkan address driver:");
    if (!driverAddress) return;

    console.log("Requesting ride from driver:", driverAddress);
    
    const tx = await contract.requestRide(driverAddress);
    console.log("Transaction sent:", tx.hash);
    alert("Transaksi dikirim! Hash: " + tx.hash);
    
    console.log("Waiting for confirmation...");
    const receipt = await tx.wait();
    
    console.log("✅ Transaction confirmed:", receipt);
    alert("Ride berhasil direquest!");
    
  } catch (e) {
    console.error("❌ Request failed:", e);
    if (e.reason) {
      alert("Gagal request ride: " + e.reason);
    } else if (e.message) {
      alert("Gagal request ride: " + e.message);
    } else {
      alert("Gagal request ride");
    }
  }
}

/* ================= RIDE MANAGEMENT ================= */
async function acceptRide() {
  if (!contract) {
    alert("Silakan connect wallet terlebih dahulu!");
    return;
  }

  try {
    const rideId = prompt("Masukkan Ride ID:");
    if (!rideId) return;

    console.log("Accepting ride:", rideId);
    
    const tx = await contract.acceptRide(rideId);
    console.log("Transaction sent:", tx.hash);
    alert("Transaksi dikirim! Hash: " + tx.hash);
    
    const receipt = await tx.wait();
    console.log("✅ Transaction confirmed:", receipt);
    alert("Ride berhasil diterima!");
    
  } catch (e) {
    console.error("❌ Accept failed:", e);
    alert("Gagal accept ride: " + (e.reason || e.message));
  }
}

async function fundRide() {
  if (!contract) {
    alert("Silakan connect wallet terlebih dahulu!");
    return;
  }

  try {
    const rideId = prompt("Masukkan Ride ID:");
    if (!rideId) return;
    
    const amount = prompt("Masukkan jumlah ETH untuk fund:", "0.01");
    if (!amount) return;

    console.log("Funding ride:", rideId, "with", amount, "ETH");
    
    const tx = await contract.fundRide(rideId, {
      value: ethers.parseEther(amount)
    });
    
    console.log("Transaction sent:", tx.hash);
    alert("Transaksi dikirim! Hash: " + tx.hash);
    
    const receipt = await tx.wait();
    console.log("✅ Transaction confirmed:", receipt);
    alert("Ride berhasil di-fund!");
    
  } catch (e) {
    console.error("❌ Fund failed:", e);
    alert("Gagal fund ride: " + (e.reason || e.message));
  }
}

async function confirmArrival() {
  if (!contract) {
    alert("Silakan connect wallet terlebih dahulu!");
    return;
  }

  try {
    const rideId = prompt("Masukkan Ride ID:");
    if (!rideId) return;

    console.log("Confirming arrival for ride:", rideId);
    
    const tx = await contract.confirmArrival(rideId);
    console.log("Transaction sent:", tx.hash);
    alert("Transaksi dikirim! Hash: " + tx.hash);
    
    const receipt = await tx.wait();
    console.log("✅ Transaction confirmed:", receipt);
    alert("Arrival berhasil dikonfirmasi!");
    
  } catch (e) {
    console.error("❌ Confirm failed:", e);
    alert("Gagal confirm arrival: " + (e.reason || e.message));
  }
}

async function completeRide() {
  if (!contract) {
    alert("Silakan connect wallet terlebih dahulu!");
    return;
  }

  try {
    const rideId = prompt("Masukkan Ride ID:");
    if (!rideId) return;

    console.log("Completing ride:", rideId);
    
    const tx = await contract.completeRide(rideId);
    console.log("Transaction sent:", tx.hash);
    alert("Transaksi dikirim! Hash: " + tx.hash);
    
    const receipt = await tx.wait();
    console.log("✅ Transaction confirmed:", receipt);
    alert("Ride berhasil diselesaikan!");
    
  } catch (e) {
    console.error("❌ Complete failed:", e);
    alert("Gagal complete ride: " + (e.reason || e.message));
  }
}

/* ================= INITIALIZATION ================= */
// Tunggu sampai DOM ready
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM loaded, initializing app...");
  
  // Event listeners untuk buttons
  const connectBtn = document.getElementById("connectBtn");
  const registerBtn = document.getElementById("registerBtn");
  const requestBtn = document.getElementById("requestBtn");
  const checkDriverBtn = document.getElementById("checkDriverBtn");
  const acceptBtn = document.getElementById("acceptBtn");
  const fundBtn = document.getElementById("fundBtn");
  const confirmBtn = document.getElementById("confirmBtn");
  const completeBtn = document.getElementById("completeBtn");
  
  if (connectBtn) {
    connectBtn.addEventListener("click", connect);
  }
  
  if (registerBtn) {
    registerBtn.addEventListener("click", registerDriver);
  }
  
  if (requestBtn) {
    requestBtn.addEventListener("click", requestRide);
  }
  
  if (checkDriverBtn) {
    checkDriverBtn.addEventListener("click", checkDriver);
  }
  
  if (acceptBtn) {
    acceptBtn.addEventListener("click", acceptRide);
  }
  
  if (fundBtn) {
    fundBtn.addEventListener("click", fundRide);
  }
  
  if (confirmBtn) {
    confirmBtn.addEventListener("click", confirmArrival);
  }
  
  if (completeBtn) {
    completeBtn.addEventListener("click", completeRide);
  }
  
  console.log("✅ App initialized successfully");
  
  // Listen untuk account changes
  if (window.ethereum) {
    window.ethereum.on('accountsChanged', function (accounts) {
      console.log("Account changed:", accounts[0]);
      if (accounts.length === 0) {
        alert("Please connect to MetaMask");
      } else {
        connect();
      }
    });
    
    window.ethereum.on('chainChanged', function (chainId) {
      console.log("Chain changed:", chainId);
      window.location.reload();
    });
  }
});