const { ethers } = require("hardhat");

const main = async () => {
  let addressList = [
    "0x012F70A63578045aCb880d4C675888594BC12959",
    "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",
    "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db",
    "0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB",
    "0x617F2E2fD72FD9D5503197092aC168c91465E7f2"
  ];

  // deploy contract
  const ClamingContractFactory = await ethers.getContractFactory("ClamingContract");
  const clamingContract = await ClamingContractFactory.deploy(
    "ABC Token",
    "ABCT",
    addressList
  );
  await clamingContract.deployed();
  console.log("Contract deployed to:", clamingContract.address);
};

main(true)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
