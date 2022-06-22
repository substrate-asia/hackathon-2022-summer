//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

import "./interfaces/IRandomScience.sol";
import "./interfaces/IBunnyArmy.sol";

import "hardhat/console.sol";

interface IConfig {

    struct Config{
        uint256 bunnyId;
        uint256 group;
        uint256 rarity; //[1, 2, 3, 4]
        uint256 maxLevel;
        uint256 evolveLevel; 
        uint256 evolveTo; 
        uint256 evolveCost; 
        uint256 isFirstForm;
    }

    function getConfigViaIndex(uint256 index) external view returns (Config memory);

    function randomDataByRarity(uint256 random, uint256 rarity) external view returns (Config memory);
    function randomDataByParent(uint256 random, uint256 parentConfigId, uint256 rarity)  external view returns (Config memory);
    
}

contract MetaBunny is AccessControlUpgradeable {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    struct Metadata{
        uint256 bunnyId;
        uint256 configId;
        uint256 level;
        uint256 rarity;  // 普通，价值为 100，稀有，价值为 200，超级稀有，价值为400，诗史，价值为800
        // uint256 hireDuration; // 当前等级为5，则升到6级后，可工作时长增加了（5 + 1 = 6）
    }

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant ROLE_SYNC = keccak256("ROLE_SYNC");
    bytes32 public constant ROLE_BUNNY_ARMY = keccak256("ROLE_BUNNY_ARMY");
    bytes32 public constant ROLE_ADMIN = keccak256("ROLE_ADMIN");

    // bunnyId -> info
    mapping(uint256 => Metadata)     public bunnyInfo;

    address public CAR_RECIPIENT;                                                                                                                                                                                                                    
    address public CAR;
    address public config;
    address public randomScience;
    address public bunnyArmy;

    event UpgradeLevel(uint256 indexed bunnyId, uint256 from, uint256 to);
    event UpgradeRarity(uint256 indexed bunnyId, uint256 from, uint256 to);
    event BreedEgg(address indexed recipient, uint256 indexed eggId);
    event EmptyEgg(uint256 indexed eggId);
    event OpenEgg(uint256 indexed eggId, uint256 indexed tokenId);

    function initialize(address _admin) public initializer {

        __AccessControl_init();
        _setupRole(ROLE_ADMIN, _admin);
    }


    /**
     * @notice upgrade bunny.level
     * @dev make sure `levelTo` not gt `maxLevel`
     */
    function upgradeLevel(uint256 bunnyId, uint256 levelTo) external {
        Metadata storage info = bunnyInfo[bunnyId];
        require(info.bunnyId >0 , "MetaBunny: no bunnyId found");
        require(info.level < levelTo , "MetaBunny: levelTo less then current level");

        IConfig.Config memory configData = IConfig(config).getConfigViaIndex(info.configId);
        require( levelTo <= configData.maxLevel, "MetaBunny: upgrade gt maxLevel");
        
        uint256 startLevel = info.level;
        uint256 levelUp = levelTo - startLevel;
        // pow 100
        uint256 car =  info.rarity * 10 * levelUp + levelUp*(startLevel + levelTo -1) * upgradeLevelFee(info.rarity) / 2;
        car = car * 1e16;// mul decimals = mul(1e18)/100

        IERC20(CAR).safeTransferFrom(msg.sender, CAR_RECIPIENT, car);

        info.level = levelTo;
        emit UpgradeLevel(bunnyId, startLevel, levelTo);
    }

    function upgradeLevelFee(uint256 rarity) private pure returns(uint256) {
        // 普通: 0.1 + level * 0.08
        // 稀有: 0.2 + level * 0.1
        // 超稀有:0.3 + level * 0.18
        // 史诗: 0.5 + level * 0.5
        if(rarity == 1) {
            return 8;
        } else if (rarity == 2){
            return 10;
        } else if (rarity == 3){
            return 18;
        } else if (rarity == 4){
            return 50;
        } else {
            revert("MateBunny: rarity not support");
        }
    }

    /**
     * @notice Once call only  one level upgraded
     * @dev    Make sure `bunny.level` equal with `evolveLevel` and `CAR` approved
     */
    function upgradeRarity(uint256 bunnyId) external {

        Metadata storage info = bunnyInfo[bunnyId];
        IConfig.Config memory configInfo = IConfig(config).getConfigViaIndex(info.configId);

        require(info.level == configInfo.evolveLevel, "upgrade: level not equal evolveLevel");
        require(configInfo.evolveTo != 0, "upgrade: not allow");

        uint256 evolveCost = configInfo.evolveCost * 10**18;
        IERC20(CAR).safeTransferFrom(msg.sender, CAR_RECIPIENT, evolveCost);

        uint256 evolveTo = configInfo.evolveTo;
        emit UpgradeLevel(bunnyId, info.configId, evolveTo);

        info.configId = evolveTo;
    }
    /**
     * @notice sync bunny data from centerDB
     * @dev ROLE_SYNC role access required
     */
    function syncBunny(
            uint256[] memory bunnyIdArray,
            uint256[] memory configIdArray,
            uint256[] memory levelArray,
            uint256[] memory rarityArray
        )
        external
        onlyRole(ROLE_SYNC)
    {
        require(bunnyIdArray.length > 0, "syncBunny: empty data");
        require(bunnyIdArray.length == configIdArray.length, "syncBunny: length miss");
        require(levelArray.length == configIdArray.length, "syncBunny: length miss");
        require(levelArray.length == rarityArray.length, "syncBunny: length miss");

        uint256 len = bunnyIdArray.length;

        for (uint256 index = 0; index < len; index++) {
            bunnyInfo[bunnyIdArray[index]] = Metadata(bunnyIdArray[index], configIdArray[index], levelArray[index], rarityArray[index]);
        }
    }

    function grantByRarity(uint256 tokenId, uint256 rarity) external onlyRole(ROLE_BUNNY_ARMY) {
        // 消耗20CAR，概率：普通(Normal)40%，稀有(Rare)35%, 超稀有(Superior)9%， 诗史(Epic)6%, 空蛋10%。
        // 开出的兔子，需满足isFirstForm == 1。雌：30%， 雄 70%
        if(rarity > 0 ){ // empty egg
            uint256 random = IRandomScience(randomScience).random(tokenId);
            IConfig.Config memory configData = IConfig(config).randomDataByRarity(random, rarity);
            //init Data
            // uint256 bunnyId = IBunnyArmy(bunnyArmy).mintBunnyFromMeta(msg.sender);
            bunnyInfo[tokenId] = Metadata(tokenId, configData.bunnyId, 0, configData.rarity);
        }
    }
    
    /**
     * @notice breed bunny via `BunnyArmy` ,then call `grantBreedMetadata` to grant metadata in specific rule
     */
    function grantBreedMetadata(uint256 tokenId) external onlyRole(ROLE_BUNNY_ARMY) {
        console.log("grantBreedMetadata:entrance");
        //
        uint256 fatherId = IBunnyArmy(bunnyArmy).bunnyFather(tokenId);
        uint256 motherId = IBunnyArmy(bunnyArmy).bunnyMother(tokenId);

        uint256 rarityMin = bunnyInfo[fatherId].rarity;
        uint256 rarityMax = bunnyInfo[motherId].rarity;

        console.log("grantBreedMetadata:randomScience", randomScience);

        uint256 random = IRandomScience(randomScience).random(rarityMin+rarityMax);
        console.log("grantBreedMetadata:random", random);
        console.log("grantBreedMetadata:min.max", rarityMin, rarityMax);

        uint256 groupBase = 0;
        uint256 rarity = 0;
        if(rarityMin.add(rarityMax) == 0) {
            // 初代兔子
            rarity = 1;
        }else if(rarityMin.add(rarityMax) > 0) {
            uint256 groupRandom = random % (rarityMin.add(rarityMax).mul(100));
            console.log("grantBreedMetadata:groupRandom", groupRandom);

            if(groupRandom < rarityMin.mul(90)) {
                groupBase = bunnyInfo[fatherId].configId;
            } else if (groupRandom < rarityMax.mul(90)) {
                groupBase = bunnyInfo[motherId].configId;
            }
            if(rarityMin > rarityMax) {
                (rarityMin, rarityMax) = (rarityMax, rarityMin);
            }
            rarity = random.mod(4)+1;
        } else {
            rarity = random.mod((rarityMax.sub(rarityMin))).add(rarityMin);
        }
        console.log("grantBreedMetadata:rarity", rarity);
        console.log("grantBreedMetadata:config", config);
        
        //random data
        IConfig.Config memory configData = IConfig(config).randomDataByParent(random, groupBase, rarity);
        bunnyInfo[tokenId] = Metadata(tokenId, configData.bunnyId, 0, configData.rarity);
    }
    // admin scope
    function setConfig(address _config) external onlyRole(ROLE_ADMIN) {
        config = _config;
    }

    function setRandomScience(address _randomScience) external onlyRole(ROLE_ADMIN) {
        randomScience = _randomScience;
    }

    function setBunnyArmy(address _bunnyArmy) external onlyRole(ROLE_ADMIN) {
        bunnyArmy = _bunnyArmy;
    }

    function setCarAddr(address _car, address _recipient) external onlyRole(ROLE_ADMIN) {
        CAR = _car;
        CAR_RECIPIENT = _recipient;
    }


    // Role
    function setRoleAdmin(bytes32 role, bytes32 adminRole) external onlyRole(ROLE_ADMIN) {
        _setRoleAdmin(role, adminRole);
    }
}