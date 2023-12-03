const hre = require('hardhat')
const { time } = require('@nomicfoundation/hardhat-toolbox/network-helpers')
const { assert, expect } = require('chai')

describe('SecurityDeposit', async () => {
    let securityDeposit
    let futureDate = Math.floor(Date.now() / 1000) + 10000
    const sendValue = hre.ethers.parseEther('1')

    beforeEach(async () => {
        securityDeposit = await hre.ethers.deployContract(
            'SecurityDeposit',
            [futureDate],
            {
                value: sendValue,
            },
        )

        await securityDeposit.waitForDeployment()
    })

    describe('constructor', async () => {
        it('sets the deposit withdraw time correctly', async () => {
            securityDeposit = await hre.ethers.deployContract(
                'SecurityDeposit',
                [futureDate],
                {
                    value: sendValue,
                },
            )

            await securityDeposit.waitForDeployment()
            updatedUnlocktime = await securityDeposit.unlockTime()
            assert(updatedUnlocktime, futureDate)
        })

        it('sets the deposit sum correctly', async () => {
            assert(
                await hre.ethers.provider.getBalance(securityDeposit.target),
                sendValue,
            )
        })
    })

    describe('withdraw', async () => {
        it('owner can withdraw', async () => {
            time.increaseTo(futureDate)

            const deployer = (await hre.ethers.getSigners())[0]
            const deployerConnected = await securityDeposit.connect(deployer)
            await expect(deployerConnected.withdraw()).not.to.be.reverted
        })

        it('not owner can not withdraw', async () => {
            time.increaseTo(futureDate)

            const accounts = await hre.ethers.getSigners()
            const attacker = await securityDeposit.connect(accounts[1])
            await expect(attacker.withdraw()).to.be.revertedWithCustomError(
                securityDeposit,
                'SecurityDeposit__NotOwner',
            )
        })

        it('can not withdrow before the set time', async () => {
            futureDate = futureDate + 1000
            securityDeposit = await hre.ethers.deployContract(
                'SecurityDeposit',
                [futureDate],
                {
                    value: sendValue,
                },
            )
            await securityDeposit.waitForDeployment()

            const deployer = (await hre.ethers.getSigners())[0]
            const deployerConnected = await securityDeposit.connect(deployer)
            await expect(
                deployerConnected.withdraw(),
            ).to.be.revertedWithCustomError(
                securityDeposit,
                'SecurityDeposit__CurrentlyLocked',
            )
        })
    })
})
