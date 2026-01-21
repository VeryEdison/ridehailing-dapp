RideHailing DApp
Decentralized Ride-Hailing Application on Ethereum Sepolia Testnet using Web3.js

Project Information
Tugas Blockchain - Deployment Smart Contract dengan Web3.js

Student Name: Very Edison
Student ID (NIM): 2702302800

Deployment Information

Network: Sepolia Testnet
Chain ID: 11155111 (0xaa36a7)
Contract Address: 0x27a7424e55B583F7AbC1D733e2eFbc77A61396FE
Blockchain Explorer: View on Sepolia Etherscan
RPC Provider: Public Sepolia RPC (https://rpc.sepolia.org)


Project Description
RideHailing DApp adalah aplikasi terdesentralisasi (Decentralized Application) untuk layanan ride-hailing yang dibangun di atas blockchain Ethereum. Aplikasi ini menggunakan smart contract untuk mengelola transaksi antara pengemudi (driver) dan penumpang (passenger) dengan sistem escrow yang aman.
Key Features:
✅ Escrow Payment System - Dana penumpang ditahan di smart contract hingga perjalanan selesai
✅ Transparent Transactions - Semua transaksi tercatat di blockchain
✅ No Middleman - Peer-to-peer antara driver dan passenger
✅ Automated Payment Release - Pembayaran otomatis dikirim ke driver setelah konfirmasi
✅ Immutable Records - Data perjalanan tidak bisa diubah atau dihapus

Features
Driver Features

Register Driver - Mendaftar sebagai driver dengan nama dan tarif per km
Accept Ride - Menerima pesanan perjalanan dari penumpang
Complete Ride - Menandai perjalanan sebagai selesai setelah sampai tujuan

Passenger Features

Request Ride - Membuat pesanan perjalanan dengan memilih driver
Fund Ride (Escrow) - Membayar biaya perjalanan yang akan ditahan di smart contract
Confirm Arrival - Mengonfirmasi kedatangan dan melepaskan pembayaran ke driver

View Features

Driver List - Menampilkan daftar driver terdaftar dengan tarif
Rides List - Menampilkan semua perjalanan dengan status real-time
Transaction History - Melihat riwayat transaksi di blockchain


Architecture
Smart Contract (Blockchain Layer)
Language: Solidity ^0.8.0
Network: Ethereum Sepolia Testnet
Contract Structure:
solidity- Driver (struct)
  - name: string
  - tariff: uint256
  - isRegistered: bool

- Ride (struct)
  - passenger: address
  - driver: address
  - price: uint256
  - status: RideStatus (enum)

- RideStatus (enum)
  - Requested (0)
  - Accepted (1)
  - Funded (2)
  - Completed (3)
  - Confirmed (4)
Main Functions:

registerDriver(string _name, uint256 _tariff) - Driver registration
requestRide(address _driver) - Create ride request
acceptRide(uint256 _rideId) - Accept ride request
fundRide(uint256 _rideId) payable - Pay to escrow
completeRide(uint256 _rideId) - Mark as completed
confirmArrival(uint256 _rideId) - Confirm and release payment

View Functions:

getDriver(address) - Get driver information
getRidesCount() - Get total rides
getRide(uint256) - Get ride details
getContractBalance() - Get contract balance

Frontend (User Interface Layer)
Technology Stack:

HTML5 - Structure
CSS3 - Styling with gradient design
JavaScript (ES6+) - Logic and Web3 integration
Web3.js v1.10.0 - Blockchain interaction library

UI Components:

Connection Status Panel
Driver Action Buttons
Passenger Action Buttons
Registered Drivers List (Grid Layout)
Rides List with Status Badges
Real-time Information Panel

Design Features:

Responsive design
Modern gradient UI
Status badges with color coding
Real-time transaction updates
MetaMask integration

 How to Run
Prerequisites

MetaMask Browser Extension

Install from: https://metamask.io/download/
Create wallet or import existing


Sepolia Testnet ETH

Get free testnet ETH from faucet:
https://sepoliafaucet.com
https://www.alchemy.com/faucets/ethereum-sepolia
Minimum: 0.05 ETH for testing


Web Browser

Chrome, Firefox, or Brave (with MetaMask installed)



Installation Steps

Download or Clone Repository

bash   git clone https://github.com/[your-username]/ridehailing-dapp.git
   cd ridehailing-dapp

Open Application

Navigate to frontend folder
Open index.html in web browser
Or double-click index.html


Connect to Sepolia Network

Click "🔄 Switch to Sepolia" button
Approve network switch in MetaMask
Or manually switch to Sepolia in MetaMask


Connect Wallet

Click "🔌 Connect MetaMask" button
Approve connection in MetaMask popup
Wait for confirmation


Start Using

Application is ready to use!
Follow workflow below




User Workflow
For Drivers (Pengemudi):
Step 1: Register as Driver

Click "📝 Register as Driver"
Enter your name (e.g., "Driver Budi")
Enter tariff per km in ETH (e.g., "0.01")
Confirm transaction in MetaMask
Wait for blockchain confirmation (~15 seconds)
Success! You are now a registered driver

Step 2: Accept Ride Requests

Wait for ride request notification
Click "✅ Accept Ride"
Enter the Ride ID
Confirm transaction in MetaMask
Ride status changes to "ACCEPTED"

Step 3: Complete Ride

After arriving at destination
Click "🏁 Complete Ride"
Enter the Ride ID
Confirm transaction
Status changes to "COMPLETED"
Wait for passenger confirmation

For Passengers (Penumpang):
Step 1: Request Ride

Click "🚗 Request Ride"
Enter driver's wallet address
Confirm transaction in MetaMask
Ride created with status "REQUESTED"

Step 2: Fund Ride (Pay to Escrow)

Wait for driver to accept
Click "💰 Fund Ride (Escrow)"
Enter Ride ID
Enter payment amount in ETH
Confirm transaction (ETH will be deducted)
Money is now held in smart contract
Status changes to "FUNDED"

Step 3: Confirm Arrival

After driver completes ride
Click "✔️ Confirm Arrival"
Enter Ride ID
Confirm transaction
Payment automatically released to driver!
Status changes to "CONFIRMED"


Security Features
Escrow System

Passenger's payment is held in smart contract
Driver cannot access funds until passenger confirms
Protects both parties from fraud

Access Control

Only assigned driver can accept specific ride
Only passenger can fund and confirm their ride
Only driver can complete their assigned ride

Status Validation

Each action requires correct previous status
Prevents out-of-order execution
Example: Cannot fund before driver accepts

Transaction Transparency

All transactions recorded on blockchain
Immutable and verifiable
Public audit trail on Etherscan

