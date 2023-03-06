import { expect, assert } from "chai";
import { ethers } from "hardhat";
import { CollectorChain } from "../typechain-types/contracts/CollectorChain"

describe("CollectorChain Beta", function () {
    let collectorChain: CollectorChain;

    beforeEach(async function () {
        [this.owner, this.addr1, ...this.addrs] = await ethers.getSigners(); // on recupère les addresses de la blockchain local hardhat (à lancer d'abord)
        const CollectorChain = await ethers.getContractFactory("CollectorChain");
        collectorChain = await CollectorChain.deploy();
    })

    describe("constructor testing", function () {
        it("should set the URI of the collection", async function () {
            let URI: string = await collectorChain.contractMetaDataURI()
            assert.equal(URI, "")
        })
    })

    describe("createMintProposal() testing", function () {
        it("should create a mint proposal", async function () {
            await collectorChain.createMintProposal("name", 1, "url");
            const mintProposal = await collectorChain.nftList(0)
            assert.equal(mintProposal.nftId.toString(), "0")
            assert.equal(mintProposal.minter, this.owner.address)
            assert.equal(mintProposal.nftName, "name")
            assert.equal(mintProposal.stockerId.toString(), "1")
            assert.equal(mintProposal.status.toString(), "0")// status proposed
            assert.equal(mintProposal.imageURL, "url")
            assert.equal(mintProposal.sharesQty.toString(), "1")
            await collectorChain.connect(this.addr1).createMintProposal("name", 1, "url");
            // additionnal test
            const mintProposalId1 = await collectorChain.nftList(1)
            assert.equal(mintProposalId1.minter, this.addr1.address)
        })
        it("should increment nftId counter", async function () {
            const counterBefore = await collectorChain._nftIdCounter()
            assert.equal(counterBefore.toString(), "0")
            await collectorChain.createMintProposal("name", 1, "url");
            const counterAfter = await collectorChain._nftIdCounter()
            assert.equal(counterAfter.toString(), "1")
        })
        it("should set isNftExist boolean to true for the used id", async function () {
            await collectorChain.createMintProposal("name", 1, "url");
            await collectorChain.createMintProposal("name", 1, "url");
            const boolId0: boolean = await collectorChain.isNftExist(0)
            const boolId1: boolean = await collectorChain.isNftExist(1)
            const boolId2: boolean = await collectorChain.isNftExist(2)
            assert.equal(boolId0, true)
            assert.equal(boolId1, true)
            assert.equal(boolId2, false)
        })
    })

    describe("setMintProposalStatus() testing", function () {
        it("should revert if not the owner", async function () {
            await expect(collectorChain.connect(this.addr1).setMintProposalStatus(true, 0)).to.be.revertedWith("Ownable: caller is not the owner")
        })
        it("should revert if the nft doesn't exist", async function () {
            await collectorChain.createMintProposal("name", 1, "url");
            await collectorChain.setMintProposalStatus(true, 0)
            await expect(collectorChain.setMintProposalStatus(true, 1)).to.be.revertedWith("nft doesn't exist")
        })
        it("should revert if the nft status is different of 'proposed'", async function () {
            await collectorChain.createMintProposal("name", 1, "url"); // id 0
            await collectorChain.createMintProposal("name", 1, "url"); // id 1
            await collectorChain.setMintProposalStatus(true, 0)
            await expect(collectorChain.setMintProposalStatus(true, 0)).to.be.revertedWith("NFT status is not proposed")
            await collectorChain.setMintProposalStatus(true, 1) // additionnal test to insure the result
        })
        it("should set the mint status to 'accepted' if _vote param is 'true'", async function () {
            await collectorChain.createMintProposal("name", 1, "url"); // id 0
            await collectorChain.createMintProposal("name", 1, "url"); // id 1
            await collectorChain.setMintProposalStatus(true, 0)
            const mintProposalId0 = await collectorChain.nftList(0)
            const mintProposalId1 = await collectorChain.nftList(1)
            assert.equal(mintProposalId0.status.toString(), "1")
            assert.equal(mintProposalId1.status.toString(), "0")
        })
        it("should set the mint status to 'rejected' if _vote param is 'false'", async function () {
            await collectorChain.createMintProposal("name", 1, "url"); // id 0
            await collectorChain.createMintProposal("name", 1, "url"); // id 1
            await collectorChain.setMintProposalStatus(false, 0)
            const mintProposalId0 = await collectorChain.nftList(0)
            const mintProposalId1 = await collectorChain.nftList(1)
            assert.equal(mintProposalId0.status.toString(), "2")
            assert.equal(mintProposalId1.status.toString(), "0")
        })
    })
})