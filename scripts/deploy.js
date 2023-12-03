const hre = require('hardhat')

const { developmentChains } = require('../helper-hardhat-config')
const { verify } = require('../utils/verify')

async function main() {
    // const { getNamedAccounts, deployments, network } = hre
    // const { deploy } = deployments
    // const { deployer } = await getNamedAccounts()
    const currentTimestamp = Math.floor(Date.now() / 1000)
    const secureValue = ethers.parseEther('1') 

    // const securityDeposit = await deploy('SecurityDeposit', {
    //     from: deployer,
    //     args: [currentTimestamp + 10],
    //     log: true,
    //     waitConfirmations: network.config.blockConfirmations || 1,
    // })

    const securityDeposit = await hre.ethers.deployContract(
        'SecurityDeposit',
        [currentTimestamp + 10],
        {
            value: secureValue,
        },
    )

    await securityDeposit.waitForDeployment()

    if (!developmentChains.includes(network.name)) {
        await verify(securityDeposit.getAddress(), [])
    }

    console.log('Security Deposit Deployed!')
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err)
        process.exit(1)
    })
