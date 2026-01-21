// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title RideHailing
 * @author Student
 * @notice Smart contract ride hailing sederhana dengan sistem escrow
 */
contract RideHailing {

    /* =======================================================
       ENUM
    ======================================================= */
    enum RideStatus {
        Requested,
        Accepted,
        Funded,
        CompletedByDriver,
        Finalized,
        Cancelled
    }

    /* =======================================================
       STRUCT
    ======================================================= */
    struct Driver {
        string name;
        uint256 tariff;        // biaya per ride (wei)
        bool isRegistered;
    }

    struct Ride {
        address passenger;
        address driver;
        uint256 price;
        RideStatus status;
    }

    /* =======================================================
       STORAGE
    ======================================================= */
    mapping(address => Driver) public drivers;
    Ride[] public rides;

    /* =======================================================
       DRIVER FUNCTIONS
    ======================================================= */

    /**
     * @notice Mendaftarkan pengemudi
     */
    function registerDriver(string memory _name, uint256 _tariff) external {
        require(!drivers[msg.sender].isRegistered, "Already registered");

        drivers[msg.sender] = Driver({
            name: _name,
            tariff: _tariff,
            isRegistered: true
        });
    }

    /**
     * @notice Melihat data pengemudi
     */
    function getDriver(address _driver)
        external
        view
        returns (Driver memory)
    {
        return drivers[_driver];
    }

    /* =======================================================
       RIDE FUNCTIONS
    ======================================================= */

    /**
     * @notice Passenger membuat pesanan perjalanan
     */
    function requestRide(address _driver) external {
        require(drivers[_driver].isRegistered, "Driver not registered");

        rides.push(
            Ride({
                passenger: msg.sender,
                driver: address(0),
                price: drivers[_driver].tariff,
                status: RideStatus.Requested
            })
        );
    }

    /**
     * @notice Driver menerima pesanan
     */
    function acceptRide(uint256 _rideId) external {
        Ride storage ride = rides[_rideId];

        require(drivers[msg.sender].isRegistered, "Not a driver");
        require(ride.status == RideStatus.Requested, "Invalid status");

        ride.driver = msg.sender;
        ride.status = RideStatus.Accepted;
    }

    /**
     * @notice Passenger membayar biaya perjalanan (escrow)
     */
    function fundRide(uint256 _rideId) external payable {
        Ride storage ride = rides[_rideId];

        require(msg.sender == ride.passenger, "Not passenger");
        require(ride.status == RideStatus.Accepted, "Invalid status");
        require(msg.value == ride.price, "Incorrect amount");

        ride.status = RideStatus.Funded;
    }

    /**
     * @notice Driver menyatakan perjalanan selesai
     */
    function completeRide(uint256 _rideId) external {
        Ride storage ride = rides[_rideId];

        require(msg.sender == ride.driver, "Not driver");
        require(ride.status == RideStatus.Funded, "Invalid status");

        ride.status = RideStatus.CompletedByDriver;
    }

    /**
     * @notice Passenger konfirmasi selesai & dana dibayarkan ke driver
     */
    function confirmArrival(uint256 _rideId) external {
        Ride storage ride = rides[_rideId];

        require(msg.sender == ride.passenger, "Not passenger");
        require(
            ride.status == RideStatus.CompletedByDriver,
            "Invalid status"
        );

        ride.status = RideStatus.Finalized;

        // Transfer dana ke driver menggunakan call (recommended)
        (bool success, ) = payable(ride.driver).call{value: ride.price}("");
        require(success, "Transfer to driver failed");
    }

    /* =======================================================
       VIEW FUNCTIONS
    ======================================================= */

    /**
     * @notice Mendapatkan jumlah total pesanan
     */
    function getRidesCount() external view returns (uint256) {
        return rides.length;
    }
}
