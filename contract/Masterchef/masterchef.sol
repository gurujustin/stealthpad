// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

import "./PunkSwapToken.sol";
import "./contract/Authorization.sol";
import "./contract/ReentrancyGuard.sol";
import "./contract/Ownable.sol";
import "./contract/SafeBEP20.sol";
import "./contract/IREFERRAL.sol";

// MasterChef is the master of Punk. He can make Punk and he is a fair guy.
//
// Note that it's ownable and the owner wields tremendous power. The ownership
// will be transferred to a governance smart contract once Punk is sufficiently
// distributed and the community can show to govern itself.
//
// Have fun reading it. Hopefully it's bug-free. God bless.
contract MasterChefV2 is Ownable, ReentrancyGuard, Authorization {
    using SafeMath for uint256;
    using SafeBEP20 for IBEP20;

    // Info of each user.
    struct UserInfo {
        uint256 amount;         // How many LP tokens the user has provided.
        uint256 rewardDebt;     // Reward debt. See explanation below.
        uint256 depositTime;    // The last time when the user deposit funds
    }

    // Info of each pool.
    struct PoolInfo {
        IBEP20 lpToken;           // Address of LP token contract.
        uint256 allocPoint;       // How many allocation points assigned to this pool. Punks to distribute per block.
        uint256 lastRewardBlock;  // Last block number that Punks distribution occurs.
        uint256 accTokenPerShare;   // Accumulated Punks per share, times 1e12. See below.
        uint16 depositFeeBP;      // Deposit fee in basis points
        uint16 withdrawFeeBP;
        uint256 lockTime;         // The time for lock funds
    }

    PunkSwapToken public punk;
    uint256 public totalStakedAmount;

    // Referral commission rate in basis points, 3% by default
    uint16 public referralCommissionRate = 300;
    // The STEALTH TOKEN!
    address public punkAddress;
    //Referrer Address
    address public referralAddress;
    // STEALTH tokens created per block.
    uint256 public tokenPerBlock;
    // Bonus muliplier for early token makers.
    uint256 public BONUS_MULTIPLIER = 1;
    // Deposit Fee address
    address public devAddress;
    // Burn address
    address public burnAddress = 0x000000000000000000000000000000000000dEaD;

    // Info of each pool.
    PoolInfo[] public poolInfo;
    // Info of each user that stakes LP tokens.
    mapping(uint256 => mapping(address => UserInfo)) public userInfo;
    // Total allocation points. Must be the sum of all allocation points in all pools.
    uint256 public totalAllocPoint = 0;
    // The block number when STEALTH mining starts.
    uint256 public startBlock;
    // The time for the lock funds
    uint256 public devRewardPercent = 500;
    uint256 lockTime;

    event Deposit(address indexed user, uint256 indexed pid, uint256 amount);
    event Withdraw(address indexed user, uint256 indexed pid, uint256 amount);
    event EmergencyWithdraw(address indexed user, uint256 indexed pid, uint256 amount);
    event SetDevAddress(address indexed user, address indexed newAddress);
    event UpdateEmissionRate(address indexed user, uint256 goosePerBlock);
    event setLockTime(address indexed user, uint256 lockTime);

    constructor(
        PunkSwapToken _punk,
        address _devAddress,
        uint256 _tokenPerBlock
    ) public {
        punkAddress = address(_punk);
        punk = _punk;
        devAddress = _devAddress;
        tokenPerBlock = _tokenPerBlock;
    }

    function poolLength() external view returns (uint256) {
        return poolInfo.length;
    }

    mapping(IBEP20 => bool) public poolExistence;
    modifier nonDuplicated(IBEP20 _lpToken) {
        require(poolExistence[_lpToken] == false, "nonDuplicated: duplicated");
        _;
    }

    function setStartBlock(uint256 _startBlock) external onlyOwner {
        require(block.number < _startBlock, "!_startBlock");
        startBlock = _startBlock;

        uint256 length = poolInfo.length;
        for (uint256 pid = 0; pid < length; ++pid) {
            poolInfo[pid].lastRewardBlock = _startBlock;
        }
    }

    // Add a new lp to the pool. Can only be called by the owner.
    function add(uint256 _allocPoint, IBEP20 _lpToken, uint16 _depositFeeBP, uint16 _withdrawFeeBP, uint256 _lockTime, bool _withUpdate) public onlyOwner nonDuplicated(_lpToken) {
        require(_depositFeeBP <= 10000, "add: invalid deposit fee basis points");
        require(_withdrawFeeBP <= 10000, "add: invalid deposit fee basis points");
        if (_withUpdate) {
            massUpdatePools();
        }
        uint256 lastRewardBlock = block.number > startBlock ? block.number : startBlock;
        totalAllocPoint = totalAllocPoint.add(_allocPoint);
        poolExistence[_lpToken] = true;
        poolInfo.push(PoolInfo({
            lpToken : _lpToken,
            allocPoint : _allocPoint,
            lastRewardBlock : lastRewardBlock,
            accTokenPerShare : 0,
            depositFeeBP : _depositFeeBP,
            withdrawFeeBP: _withdrawFeeBP,
            lockTime : _lockTime
        }));
    }

    // Update the given pool's Token allocation point and deposit fee. Can only be called by the owner.
    function set(uint256 _pid, uint256 _allocPoint, uint16 _depositFeeBP, uint16 _withdrawFeeBP, uint256 _lockTime, bool _withUpdate) public onlyOwner {
        require(_depositFeeBP <= 10000, "set: invalid deposit fee basis points");
        require(_withdrawFeeBP <= 10000, "set: invalid deposit fee basis points");
        if (_withUpdate) {
            massUpdatePools();
        }
        totalAllocPoint = totalAllocPoint.sub(poolInfo[_pid].allocPoint).add(_allocPoint);
        poolInfo[_pid].allocPoint = _allocPoint;
        poolInfo[_pid].depositFeeBP = _depositFeeBP;
        poolInfo[_pid].withdrawFeeBP = _withdrawFeeBP;
        poolInfo[_pid].lockTime = _lockTime;
    }

    function setDevAddress(address _fee) public onlyOwner {
        devAddress = _fee;
    }

    function setDevRewardPercent(uint256 _rewardPercent) public onlyOwner {
        devRewardPercent = _rewardPercent;
    }
 
    // Return reward multiplier over the given _from to _to block.
    function getMultiplier(uint256 _from, uint256 _to) public view returns (uint256) {
        return _to.sub(_from).mul(BONUS_MULTIPLIER);
    }

    // View function to see pending Tokens on frontend.
    function pendingToken(uint256 _pid, address _user) external view returns (uint256) {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][_user];
        uint256 accTokenPerShare = pool.accTokenPerShare;
        uint256 lpSupply = address(pool.lpToken) == address(punkAddress) ? totalStakedAmount : pool.lpToken.balanceOf(address(this));

        if (block.number > pool.lastRewardBlock && lpSupply != 0) {
            uint256 multiplier = getMultiplier(pool.lastRewardBlock, block.number);
            uint256 tokenReward = multiplier.mul(tokenPerBlock).mul(pool.allocPoint).div(totalAllocPoint);
            accTokenPerShare = accTokenPerShare.add(tokenReward.mul(1e12).div(lpSupply));
        }
        return user.amount.mul(accTokenPerShare).div(1e12).sub(user.rewardDebt);
    }

    // Update reward variables for all pools. Be careful of gas spending!
    function massUpdatePools() public {
        uint256 length = poolInfo.length;
        for (uint256 pid = 0; pid < length; ++pid) {
            updatePool(pid);
        }
    }

    // Update reward variables of the given pool to be up-to-date.
    function updatePool(uint256 _pid) public {
        PoolInfo storage pool = poolInfo[_pid];
        if (block.number <= pool.lastRewardBlock) {
            return;
        }
        uint256 lpSupply = pool.lpToken.balanceOf(address(this));
        if (lpSupply == 0 || pool.allocPoint == 0) {
            pool.lastRewardBlock = block.number;
            return;
        }
        uint256 multiplier = getMultiplier(pool.lastRewardBlock, block.number);
        uint256 tokenReward = multiplier.mul(tokenPerBlock).mul(pool.allocPoint).div(totalAllocPoint);
        uint256 devReward = tokenReward.mul(devRewardPercent).div(10000);
        uint256 burnAmount = tokenReward.add(devReward);
        punk.mint(address(this), tokenReward.add(burnAmount));
        punk.mint(devAddress, devReward);
        punk.burn(address(this), burnAmount);

        pool.accTokenPerShare = pool.accTokenPerShare.add(tokenReward.mul(1e12).div(lpSupply));
        pool.lastRewardBlock = block.number;
    }

    // Deposit LP tokens to MasterChef for Token allocation.
    function deposit(uint256 _pid, uint256 _amount, address _referrer) public nonReentrant {
        require(_referrer == address(_referrer),"deposit: Invalid referrer address");

        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        updatePool(_pid);

        // harvest before deposit new amount
        if (user.amount > 0) {
            uint256 pending = user.amount.mul(pool.accTokenPerShare).div(1e12).sub(user.rewardDebt);
            if (pending > 0) {
                safeTokenTransfer(msg.sender, pending);
                payReferralCommission(msg.sender, pending);
            }
        }
        if (_amount > 0) {

            if(_pid == 0) {
                totalStakedAmount = totalStakedAmount.sub(user.amount);
            }

            pool.lpToken.safeTransferFrom(address(msg.sender), address(this), _amount);
            user.depositTime = now;
            IREFERRAL(referralAddress).recordReferral(msg.sender, _referrer);
            if (pool.depositFeeBP > 0) {
                uint256 depositFee = _amount.mul(pool.depositFeeBP).div(10000);
                pool.lpToken.safeTransfer(devAddress, depositFee);
                user.amount = user.amount.add(_amount).sub(depositFee);
            } else {
                user.amount = user.amount.add(_amount);
            }

            if(_pid == 0) {
                totalStakedAmount = totalStakedAmount.add(user.amount);
            }

        }
        user.rewardDebt = user.amount.mul(pool.accTokenPerShare).div(1e12);
        emit Deposit(msg.sender, _pid, _amount);
    }

    // Withdraw LP tokens from MasterChef.
    function withdraw(uint256 _pid, uint256 _amount) public nonReentrant {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        require(user.amount >= _amount, "withdraw: not good");
        require(user.depositTime + pool.lockTime < now, "Can not withdraw in lock period");
        updatePool(_pid);
        uint256 pending = user.amount.mul(pool.accTokenPerShare).div(1e12).sub(user.rewardDebt);
        if (pending > 0) {
                safeTokenTransfer(msg.sender, pending);
                payReferralCommission(msg.sender, pending);
        }
        if (_amount > 0) {
            if(_pid == 0) {
                totalStakedAmount = totalStakedAmount.sub(user.amount);
            }
            if(pool.withdrawFeeBP > 0) {
                uint256 withdrawFee = _amount.mul(pool.withdrawFeeBP).div(10000);
                pool.lpToken.safeTransfer(devAddress, withdrawFee);
                pool.lpToken.safeTransfer(address(msg.sender), _amount.sub(withdrawFee));
            } else{
                pool.lpToken.safeTransfer(address(msg.sender), _amount);
            }
            if(_pid == 0) {
                totalStakedAmount = totalStakedAmount.add(user.amount);
            }
            user.amount = user.amount.sub(_amount);
        }
        user.rewardDebt = user.amount.mul(pool.accTokenPerShare).div(1e12);
        emit Withdraw(msg.sender, _pid, _amount);
    }

    // Withdraw without caring about rewards. EMERGENCY ONLY.
    function emergencyWithdraw(uint256 _pid) public nonReentrant {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        require(user.depositTime + pool.lockTime < now, "Can not withdraw in lock period");
        uint256 amount = user.amount;
        if(_pid == 0) {
            totalStakedAmount = totalStakedAmount.sub(user.amount);
        }
        user.amount = 0;
        user.rewardDebt = 0;
        pool.lpToken.safeTransfer(address(msg.sender), amount);
        emit EmergencyWithdraw(msg.sender, _pid, amount);
    }

    function updateEmissionRate(uint256 _tokenPerBlock) public onlyOwner {
        massUpdatePools();
        tokenPerBlock = _tokenPerBlock;
        emit UpdateEmissionRate(msg.sender, _tokenPerBlock);
    }

    function updateMultiplier(uint256 multiplierNumber) public onlyOwner {
        BONUS_MULTIPLIER = multiplierNumber;
    }

        // Pay referral commission to the referrer who referred this user.
    function payReferralCommission(address _user, uint256 _pending) internal {
        address referrer = IREFERRAL(referralAddress).getReferrer(_user);
        if (referrer != address(0) && referrer != _user && referralCommissionRate > 0) {
            uint256 commissionAmount = _pending.mul(referralCommissionRate).div(10000);
            punk.mint(referrer, commissionAmount);
            IREFERRAL(referralAddress).recordReferralCommission(referrer, commissionAmount);
        }
    }

    // Safe token transfer function, just in case if rounding error causes pool to not have enough Tokens.
    function safeTokenTransfer(address _to, uint256 _amount) internal {
        uint256 tokenBalance = punk.balanceOf(address(this));
        bool transferSuccess = false;
        if (_amount > tokenBalance) {
            transferSuccess = punk.transfer(_to, tokenBalance);
        } else {
            transferSuccess = punk.transfer(_to, _amount);
        }
        require(transferSuccess, "safeTokenTransfer: transfer failed");
    }

    function setReferralCommissionRate(uint16 _referralCommissionRate) external onlyOwner {
        referralCommissionRate = _referralCommissionRate;
    }

    function setReferralAddress(address _referralAddress) external onlyOwner {
        require(_referralAddress != address(0), "Zero address is not available.");
        referralAddress = _referralAddress;
    }

}