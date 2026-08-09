// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title WarrantyEscrow
 * @dev Hợp đồng Ký Quỹ & Bảo Hành Công Việc Tự Do (Decentralized Freelance Escrow with Dispute Resolution)
 */
contract WarrantyEscrow {
    enum EscrowStatus { CREATED, FUNDED, COMPLETED, DISPUTED, REFUNDED }

    struct Escrow {
        bytes32 jobId;
        address payable client;
        address payable freelancer;
        address arbitrator;
        uint256 amount;
        EscrowStatus status;
        uint256 createdAt;
    }

    mapping(bytes32 => Escrow) public escrows;
    address public owner;

    event EscrowCreated(bytes32 indexed jobId, address indexed client, address indexed freelancer, uint256 amount);
    event PaymentReleased(bytes32 indexed jobId, address indexed freelancer, uint256 amount);
    event RefundIssued(bytes32 indexed jobId, address indexed client, uint256 amount);
    event DisputeRaised(bytes32 indexed jobId, address indexed raisedBy);
    event DisputeResolved(bytes32 indexed jobId, uint256 freelancerAmount, uint256 clientAmount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Nạp tiền ký quỹ cho công việc (Client gọi)
     */
    function createEscrow(
        bytes32 _jobId,
        address payable _freelancer,
        address _arbitrator
    ) external payable {
        require(msg.value > 0, "Amount must be greater than 0");
        require(escrows[_jobId].amount == 0, "Escrow already exists for this job");
        require(_freelancer != address(0), "Invalid freelancer address");

        address arbitrator = _arbitrator == address(0) ? owner : _arbitrator;

        escrows[_jobId] = Escrow({
            jobId: _jobId,
            client: payable(msg.sender),
            freelancer: _freelancer,
            arbitrator: arbitrator,
            amount: msg.value,
            status: EscrowStatus.FUNDED,
            createdAt: block.timestamp
        });

        emit EscrowCreated(_jobId, msg.sender, _freelancer, msg.value);
    }

    /**
     * @notice Phê duyệt công việc & Giải ngân tiền cho Freelancer (Client gọi)
     */
    function releasePayment(bytes32 _jobId) external {
        Escrow storage escrow = escrows[_jobId];
        require(escrow.status == EscrowStatus.FUNDED, "Escrow is not in funded status");
        require(msg.sender == escrow.client, "Only client can release payment");

        escrow.status = EscrowStatus.COMPLETED;
        uint256 amount = escrow.amount;

        (bool success, ) = escrow.freelancer.call{value: amount}("");
        require(success, "Transfer to freelancer failed");

        emit PaymentReleased(_jobId, escrow.freelancer, amount);
    }

    /**
     * @notice Hoàn tiền lại cho Client (Freelancer chấp nhận hoàn tiền)
     */
    function refundClient(bytes32 _jobId) external {
        Escrow storage escrow = escrows[_jobId];
        require(escrow.status == EscrowStatus.FUNDED, "Escrow is not in funded status");
        require(msg.sender == escrow.freelancer, "Only freelancer can issue refund");

        escrow.status = EscrowStatus.REFUNDED;
        uint256 amount = escrow.amount;

        (bool success, ) = escrow.client.call{value: amount}("");
        require(success, "Transfer to client failed");

        emit RefundIssued(_jobId, escrow.client, amount);
    }

    /**
     * @notice Kích hoạt Tranh chấp khi có mâu thuẫn (Client hoặc Freelancer gọi)
     */
    function raiseDispute(bytes32 _jobId) external {
        Escrow storage escrow = escrows[_jobId];
        require(escrow.status == EscrowStatus.FUNDED, "Escrow must be funded to dispute");
        require(msg.sender == escrow.client || msg.sender == escrow.freelancer, "Unauthorized to raise dispute");

        escrow.status = EscrowStatus.DISPUTED;
        emit DisputeRaised(_jobId, msg.sender);
    }

    /**
     * @notice Trọng tài phân xử Tranh chấp và chia số tiền theo tỷ lệ % (Phần vạn - basis points 0 - 10000)
     */
    function resolveDispute(bytes32 _jobId, uint256 _freelancerShareBps) external {
        Escrow storage escrow = escrows[_jobId];
        require(escrow.status == EscrowStatus.DISPUTED, "Escrow is not in disputed status");
        require(msg.sender == escrow.arbitrator || msg.sender == owner, "Only arbitrator can resolve dispute");
        require(_freelancerShareBps <= 10000, "Share BPS cannot exceed 10000");

        escrow.status = EscrowStatus.COMPLETED;
        uint256 total = escrow.amount;

        uint256 freelancerAmount = (total * _freelancerShareBps) / 10000;
        uint256 clientAmount = total - freelancerAmount;

        if (freelancerAmount > 0) {
            (bool s1, ) = escrow.freelancer.call{value: freelancerAmount}("");
            require(s1, "Transfer to freelancer failed");
        }

        if (clientAmount > 0) {
            (bool s2, ) = escrow.client.call{value: clientAmount}("");
            require(s2, "Transfer to client failed");
        }

        emit DisputeResolved(_jobId, freelancerAmount, clientAmount);
    }
}
