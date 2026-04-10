// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title KanakSetuAnchor
/// @notice Stores Merkle roots for donation batch proofs
/// @dev Minimal contract - stores batch roots, emits events, owner-gated

contract KanakSetuAnchor {
    address public owner;

    struct Anchor {
        bytes32 merkleRoot;
        uint256 timestamp;
    }

    mapping(uint256 => Anchor) public anchors; // batchId => Anchor
    uint256 public totalAnchors;

    event Anchored(uint256 indexed batchId, bytes32 merkleRoot, uint256 timestamp);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /// @notice Anchor a Merkle root for a batch
    /// @param batchId Unique batch identifier
    /// @param merkleRoot The Merkle root hash
    function anchor(uint256 batchId, bytes32 merkleRoot) external onlyOwner {
        require(anchors[batchId].timestamp == 0, "Batch already anchored");
        require(merkleRoot != bytes32(0), "Empty root");

        anchors[batchId] = Anchor({
            merkleRoot: merkleRoot,
            timestamp: block.timestamp
        });
        totalAnchors++;

        emit Anchored(batchId, merkleRoot, block.timestamp);
    }

    /// @notice Get anchor data for a batch
    function getAnchor(uint256 batchId) external view returns (bytes32 merkleRoot, uint256 timestamp) {
        Anchor memory a = anchors[batchId];
        return (a.merkleRoot, a.timestamp);
    }

    /// @notice Transfer ownership
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}
