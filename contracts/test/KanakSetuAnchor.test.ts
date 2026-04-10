import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('KanakSetuAnchor', function () {
  it('Should anchor a merkle root and retrieve it', async function () {
    const Factory = await ethers.getContractFactory('KanakSetuAnchor');
    const contract = await Factory.deploy();
    await contract.waitForDeployment();

    const root = ethers.keccak256(ethers.toUtf8Bytes('test-root-123'));
    await contract.anchor(1, root);

    const [stored, timestamp] = await contract.getAnchor(1);
    expect(stored).to.equal(root);
    expect(timestamp).to.be.greaterThan(0);
    expect(await contract.totalAnchors()).to.equal(1);
  });

  it('Should reject duplicate batch anchoring', async function () {
    const Factory = await ethers.getContractFactory('KanakSetuAnchor');
    const contract = await Factory.deploy();
    await contract.waitForDeployment();

    const root = ethers.keccak256(ethers.toUtf8Bytes('root'));
    await contract.anchor(1, root);
    await expect(contract.anchor(1, root)).to.be.revertedWith('Batch already anchored');
  });

  it('Should reject non-owner calls', async function () {
    const [, other] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory('KanakSetuAnchor');
    const contract = await Factory.deploy();
    await contract.waitForDeployment();

    const root = ethers.keccak256(ethers.toUtf8Bytes('root'));
    await expect(contract.connect(other).anchor(1, root)).to.be.revertedWith('Not owner');
  });
});
