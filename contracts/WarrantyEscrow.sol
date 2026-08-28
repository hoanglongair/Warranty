// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IERC20
 * @dev Minimal ERC-20 interface for USDC payments.
 */
interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
}

/**
 * @title WarrantyEscrow
 * @dev Hợp đồng Ký Quỹ & Bảo Hành Công Việc Tự Do (Decentralized Freelance Escrow with Dispute Resolution).
 *
 * Phiên bản V2: Hỗ trợ cả native ETH (Arc mainnet/Ethereum) và USDC ERC-20 (Arc Testnet vì dùng USDC làm gas).
 * - Mạng có native ETH: gọi `createEscrowETH()` với msg.value
 * - Mạng chỉ có USDC gas (Arc Testnet): gọi `createEscrowUSDC()` sau khi approve token trước
 */
contract WarrantyEscrow {
    enum EscrowStatus { CREATED, FUNDED, COMPLETED, DISPUTED, REFUNDED }
    enum TokenType { ETH, USDC }

    struct Escrow {
        bytes32 jobId;
        address payable employer;
        address payable freelancer;
        address arbitrator;
        uint256 amount;
        uint256 deadline;
        EscrowStatus status;
        TokenType tokenType;
        address tokenAddress; // address(0) nếu ETH, USDC contract address nếu USDC
        uint256 createdAt;
    }

    mapping(bytes32 => Escrow) public escrows;
    address public owner;
    address public usdcToken; // USDC contract address (set bởi owner)

    event EscrowCreated(bytes32 indexed jobId, address indexed employer, address indexed freelancer, uint256 amount, uint256 deadline, TokenType tokenType, address tokenAddress);
    event PaymentReleased(bytes32 indexed jobId, address indexed freelancer, uint256 amount);
    event RefundIssued(bytes32 indexed jobId, address indexed employer, uint256 amount);
    event DisputeRaised(bytes32 indexed jobId, address indexed raisedBy);
    event DisputeResolved(bytes32 indexed jobId, uint256 freelancerAmount, uint256 employerAmount);
    event ExpiredRefunded(bytes32 indexed jobId, address indexed employer, uint256 amount);
    event UsdcTokenUpdated(address indexed oldToken, address indexed newToken);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    constructor(address _usdcToken) {
        owner = msg.sender;
        usdcToken = _usdcToken;
    }

    /**
     * @notice Cập nhật địa chỉ USDC contract (nếu cần thiết).
     */
    function setUsdcToken(address _usdcToken) external onlyOwner {
        emit UsdcTokenUpdated(usdcToken, _usdcToken);
        usdcToken = _usdcToken;
    }

    /**
     * @notice Nạp tiền ký quỹ ETH vào Smart Contract (mạng có native ETH).
     * @param _jobId ID duy nhất của job
     * @param _freelancer Địa chỉ ví freelancer (bắt buộc)
     * @param _arbitrator Địa chỉ trọng tài (mặc định = owner nếu address(0))
     * @param _durationDays Thời hạn escrow tính bằng ngày (1-365)
     */
    function createEscrowETH(
        bytes32 _jobId,
        address payable _freelancer,
        address _arbitrator,
        uint256 _durationDays
    ) external payable {
        require(msg.value > 0, "Amount must be greater than 0");
        _createEscrow(_jobId, _freelancer, _arbitrator, _durationDays, TokenType.ETH, address(0), msg.value);
    }

    /**
     * @notice Nạp tiền ký quỹ USDC vào Smart Contract (Arc Testnet).
     * @dev Caller phải approve USDC cho contract trước khi gọi hàm này.
     * @param _jobId ID duy nhất của job
     * @param _freelancer Địa chỉ ví freelancer (bắt buộc)
     * @param _arbitrator Địa chỉ trọng tài (mặc định = owner nếu address(0))
     * @param _durationDays Thời hạn escrow tính bằng ngày (1-365)
     * @param _amount Số USDC (đơn vị wei: 1 USDC = 1_000_000)
     */
    function createEscrowUSDC(
        bytes32 _jobId,
        address payable _freelancer,
        address _arbitrator,
        uint256 _durationDays,
        uint256 _amount
    ) external {
        require(usdcToken != address(0), "USDC token not configured");
        require(_amount > 0, "Amount must be greater than 0");

        IERC20 token = IERC20(usdcToken);
        require(token.allowance(msg.sender, address(this)) >= _amount, "Insufficient USDC allowance");
        require(token.transferFrom(msg.sender, address(this), _amount), "USDC transfer failed");

        _createEscrow(_jobId, _freelancer, _arbitrator, _durationDays, TokenType.USDC, usdcToken, _amount);
    }

    /**
     * @notice Hàm nội bộ xử lý logic chung cho cả ETH và USDC escrow.
     */
    function _createEscrow(
        bytes32 _jobId,
        address payable _freelancer,
        address _arbitrator,
        uint256 _durationDays,
        TokenType _tokenType,
        address _tokenAddress,
        uint256 _amount
    ) internal {
        require(escrows[_jobId].amount == 0, "Escrow already exists for this job");
        require(_freelancer != address(0), "Invalid freelancer address");
        require(_freelancer != msg.sender, "Freelancer cannot be employer");
        require(_durationDays > 0 && _durationDays <= 365, "Duration must be 1-365 days");

        address arbitrator = _arbitrator == address(0) ? owner : _arbitrator;
        require(arbitrator != msg.sender && arbitrator != _freelancer, "Arbitrator cannot be employer or freelancer");

        uint256 deadline = block.timestamp + (_durationDays * 1 days);

        escrows[_jobId] = Escrow({
            jobId: _jobId,
            employer: payable(msg.sender),
            freelancer: _freelancer,
            arbitrator: arbitrator,
            amount: _amount,
            deadline: deadline,
            status: EscrowStatus.FUNDED,
            tokenType: _tokenType,
            tokenAddress: _tokenAddress,
            createdAt: block.timestamp
        });

        emit EscrowCreated(_jobId, msg.sender, _freelancer, _amount, deadline, _tokenType, _tokenAddress);
    }

    /**
     * @notice Phê duyệt công việc & Giải ngân tiền cho Freelancer (Employer gọi)
     */
    function releasePayment(bytes32 _jobId) external {
        Escrow storage escrow = escrows[_jobId];
        require(escrow.status == EscrowStatus.FUNDED, "Escrow is not in funded status");
        require(msg.sender == escrow.employer, "Only employer can release payment");
        require(block.timestamp <= escrow.deadline, "Escrow expired, use expiredRefund");

        escrow.status = EscrowStatus.COMPLETED;
        uint256 amount = escrow.amount;

        _transferTo(escrow.freelancer, amount, escrow.tokenType, escrow.tokenAddress);

        emit PaymentReleased(_jobId, escrow.freelancer, amount);
    }

    /**
     * @notice Hoàn tiền lại cho Employer (Freelancer chấp nhận hoàn tiền)
     */
    function refundEmployer(bytes32 _jobId) external {
        Escrow storage escrow = escrows[_jobId];
        require(escrow.status == EscrowStatus.FUNDED, "Escrow is not in funded status");
        require(msg.sender == escrow.freelancer, "Only freelancer can issue refund");

        escrow.status = EscrowStatus.REFUNDED;
        uint256 amount = escrow.amount;

        _transferTo(escrow.employer, amount, escrow.tokenType, escrow.tokenAddress);

        emit RefundIssued(_jobId, escrow.employer, amount);
    }

    /**
     * @notice Kích hoạt Tranh chấp (Employer hoặc Freelancer gọi)
     */
    function raiseDispute(bytes32 _jobId) external {
        Escrow storage escrow = escrows[_jobId];
        require(escrow.status == EscrowStatus.FUNDED, "Escrow must be funded to dispute");
        require(msg.sender == escrow.employer || msg.sender == escrow.freelancer, "Unauthorized to raise dispute");

        escrow.status = EscrowStatus.DISPUTED;
        emit DisputeRaised(_jobId, msg.sender);
    }

    /**
     * @notice Trọng tài phân xử tranh chấp với tỷ lệ % (basis points 0-10000)
     */
    function resolveDispute(bytes32 _jobId, uint256 _freelancerShareBps) external {
        Escrow storage escrow = escrows[_jobId];
        require(escrow.status == EscrowStatus.DISPUTED, "Escrow is not in disputed status");
        require(msg.sender == escrow.arbitrator || msg.sender == owner, "Only arbitrator can resolve dispute");
        require(_freelancerShareBps <= 10000, "Share BPS cannot exceed 10000");

        escrow.status = EscrowStatus.COMPLETED;
        uint256 total = escrow.amount;

        uint256 freelancerAmount = (total * _freelancerShareBps) / 10000;
        uint256 employerAmount = total - freelancerAmount;

        if (freelancerAmount > 0) {
            _transferTo(escrow.freelancer, freelancerAmount, escrow.tokenType, escrow.tokenAddress);
        }
        if (employerAmount > 0) {
            _transferTo(escrow.employer, employerAmount, escrow.tokenType, escrow.tokenAddress);
        }

        emit DisputeResolved(_jobId, freelancerAmount, employerAmount);
    }

    /**
     * @notice Hoàn tiền khi escrow hết hạn (ai cũng có thể gọi sau deadline)
     */
    function expiredRefund(bytes32 _jobId) external {
        Escrow storage escrow = escrows[_jobId];
        require(escrow.status == EscrowStatus.FUNDED, "Escrow is not in funded status");
        require(block.timestamp > escrow.deadline, "Escrow has not expired yet");

        escrow.status = EscrowStatus.REFUNDED;
        uint256 amount = escrow.amount;

        _transferTo(escrow.employer, amount, escrow.tokenType, escrow.tokenAddress);

        emit ExpiredRefunded(_jobId, escrow.employer, amount);
    }

    /**
     * @notice Hàm nội bộ — chuyển tiền tới address theo token type.
     */
    function _transferTo(
        address payable _to,
        uint256 _amount,
        TokenType _tokenType,
        address _tokenAddress
    ) internal {
        if (_tokenType == TokenType.ETH) {
            (bool success, ) = _to.call{value: _amount}("");
            require(success, "ETH transfer failed");
        } else {
            require(_tokenAddress != address(0), "Token address not set");
            IERC20 token = IERC20(_tokenAddress);
            require(token.transfer(_to, _amount), "Token transfer failed");
        }
    }
}
