//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";

import "./uniswapv2/interfaces/IUniswapV2Router02.sol";
import "./z_bunny_info/interfaces/IMetaBunny.sol";

import "hardhat/console.sol";

interface IBreedScience {
    //@dev random % based < hitRate ? 1 : 0
    //@return gender 0:female 1:male
    function breeedGender(uint256 based, uint256 hitRate) external view returns (uint256 hit);
}
/// create Bunny via egg
contract UrbanMaterial is  ERC721EnumerableUpgradeable, OwnableUpgradeable {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;
    using EnumerableSet for EnumerableSet.UintSet;

    address public constant DEAD = 0x000000000000000000000000000000000000dEaD;

    address public BAC;
    address public USDT;
    address public jfRouter;
    address public adoptFeeTo;
    address public breefFeeTo;

    IBreedScience public breedScience;
    

    uint256 public pricePerBunny;
    uint256 public adoptMaleCount;
    uint256 public adoptFemaleCount;

    uint256 public priceBaseBreedBunny;
    uint256 public breedStartAt; //timestamp
    uint256 public breedFemaleRate;  // 100 based

    uint256 public totalSaledBunny; 
    uint256 public totalSaledValue; 

    uint256 public constant MAX_MALE_COUNT = 7000;
    uint256 public constant MAX_FEMALE_COUNT = 3000;

    mapping(uint256 => uint256) public bunnyGender;
    mapping(uint256 => uint256) public bunnyBreedCount;

    mapping(uint256 => uint256) public bunnyFather;
    mapping(uint256 => uint256) public bunnyMother;


    mapping(uint256 => uint256) public bunnyPrice;
    EnumerableSet.UintSet private bunnyOnSale;

    string private baseURI;

    bool private transferAllow;

    // address public constant CAR = 0xA63D16d424e769087Dc9f6E464522EE446FF60EE;//test
    address public constant CAR = 0x1F39bDE4b3EefF7bcb85eADbEfe89CF2dc997034;

    address public breedGasTo;
    uint256 public breedGas;

    // add in V4
    mapping(uint256 => bool) tokenEgg;
    mapping(uint256 => bool) tokenEggNonce;
    uint256 public feeBreedEgg;
    uint256 public feeOpenEgg;
    address public metaBunny;
    address public gameAdmin;
    uint256 public feeSynthesisBunny;
    

    event BunnyAdopt(uint256 indexed _tokenId, address indexed _owner);
    event BunnyBreed(uint256 indexed _tokenId, address _owner);
    event BunnySale(uint256 indexed _tokenId, address indexed _owner, uint256 _price);
    event BunnySaleCancle(uint256 indexed _tokenId);
    event BunnySaleSuc(uint256 indexed _tokenId, address indexed _buyer);
    event SyncBunny(uint256 indexed tokenId, address indexed _owner);
    event BunnyOpenEgg(uint256 indexed _tokenId);
    event BunnySynthesis(uint256 indexed _tokenId0, uint256 indexed _tokenId1, uint256 indexed _tokenId2);
    event BunnyBreedEgg(uint256 indexed _tokenId, uint256 indexed _nonce);

    modifier openLock {
        transferAllow = true;
        _;
        transferAllow = false;
    }

    function initialize(address _carAddr, address _usdtAddr)  initializer public {

        __Ownable_init();
        __ERC721_init("Urban Material", "UM");

        BAC  = _carAddr;
        USDT = _usdtAddr;

        breedFemaleRate = 60;
    }

    /**
     * @notice adropt bunnry
     * @dev approve USDT before call `adoptBunny`
     */
    function adoptBunny() external openLock returns (uint256 tokenId) {
        
        require(pricePerBunny > 0,  "BurnnyLegion: price not set");
        require(adoptFeeTo != address(0),  "BurnnyLegion: adoptFeeTo not set");
        IERC20(USDT).safeTransferFrom(msg.sender, adoptFeeTo, pricePerBunny);

        tokenId = _mintBunny(msg.sender);
        emit BunnyAdopt(tokenId, msg.sender);
    }

   function breedEgg(address recipient, uint256 nonce, uint256 deadline,  uint8 v, bytes32 r, bytes32 s) external openLock {
        // 验证签名
        require(feeBreedEgg > 0, "breedEgg: fee not set");
        require(block.timestamp <= deadline, "breedEgg: expired");
        require(!tokenEggNonce[nonce], "breedEgg: nonce exist");
        
        // require(!eggNonce[nonce], "breedEgg: nonce exist");

        bytes32 digest = keccak256(
            abi.encodePacked(
                "\x19Ethereum Signed Message:\n32",
                keccak256(abi.encode(recipient,nonce, deadline))
            )
        );
        address signer = ecrecover(digest, v, r, s);
        require(signer == gameAdmin, "breedEgg: Signature verification failed");
        // 扣费
        IERC20(CAR).safeTransferFrom(msg.sender, DEAD, feeBreedEgg);
        // 生成蛋
        uint256 tokenId = _mintBunny(recipient);
        tokenEgg[tokenId] = true;
        tokenEggNonce[nonce] = true;

        emit BunnyBreedEgg(tokenId, nonce);
    }

    function openEgg(uint256 tokenId) external openLock { // transfer to DEAD require `openLock`
        require(msg.sender == tx.origin, "openEgg: OEA only");
        require(feeOpenEgg > 0, "openEgg: fee not set");
        require(ownerOf(tokenId) == msg.sender, "openEgg: not owner");
        require(tokenEgg[tokenId], "openEgg: have already opened");

        IERC20(CAR).safeTransferFrom(msg.sender, DEAD, feeOpenEgg);
        // 消耗20CAR，概率：普通(Normal)40%，稀有(Rare)35%, 超稀有(Superior)9%， 诗史(Epic)6%, 空蛋10%。
        // 开出的兔子，需满足isFirstForm == 1。雌：30%， 雄 70%
        uint256 rarity = pickEggRarity();
        console.log("rarity", rarity);
        if(rarity == 0) {
            _transfer(msg.sender, DEAD, tokenId);
        } else {
            IMetaBunny(metaBunny).grantByRarity(tokenId, rarity);
        }
        tokenEgg[tokenId] = false;

        emit BunnyOpenEgg(tokenId);
    }

    function synthesisBunny(uint256[] memory tokenIds) external openLock returns (uint256 tokenId) {
        require(feeSynthesisBunny > 0, "synthesisBunny: fee not set");
        IERC20(CAR).safeTransferFrom(msg.sender, DEAD, feeSynthesisBunny);

        uint256 len = tokenIds.length;
        require(len == 3, "synthesisBunny: 3 Bunny");
        for (uint256 index = 0; index < len; index++) {
            require(
                _isApprovedOrOwner(msg.sender, tokenIds[index]),
                "synthesisBunny: not Owner"
            );
            _transfer(msg.sender, DEAD, tokenIds[index]);
        }
        tokenId = _mintBunny(msg.sender);
        uint256 rarity = genRandom() % 100 >= 50?  3 : 4;
        IMetaBunny(metaBunny).grantByRarity(tokenId, rarity);

        emit BunnySynthesis(tokenIds[0], tokenIds[1], tokenIds[2]);
        emit SyncBunny(tokenId, msg.sender);
    }

    function mintBunnyFromMeta(address _recipient) external openLock returns (uint256 tokenId) {
        // require(msg.sender == config, "mint not allowed");
        tokenId = _mintBunny(_recipient);
    }

    function _mintBunny(address _recipient) private returns(uint256 tokenId) {
        uint256 _gender = geneAdoptGander();
        if(_gender == 1) {
            require(adoptMaleCount < MAX_MALE_COUNT, "BurnnyLegion: no left A");
            adoptMaleCount += 1;
        } else {
            require(adoptFemaleCount < MAX_FEMALE_COUNT, "BurnnyLegion: no left B");
            adoptFemaleCount += 1;
        }

        tokenId = totalSupply();
        bunnyGender[tokenId] = _gender;
        //mint bunny
        _mint(_recipient, tokenId);
    }

    /***
     * @notice breed Bunny with mothorBunny & FatherToken
     * @param _matronId Mother Bunny ID
     * @param _sireId   Father Bunny ID
     * @param _expectedFee   Expected Breed Fee
     */
    function breedBunnyExtra(uint256 _matronId, uint256 _sireId, uint256 _expectedFee) external openLock returns (uint256 tokenId) {
        return _breedBunny(_matronId, _sireId, _expectedFee);
    }
    /***
     * @notice breed Bunny with mothorBunny & FatherToken
     * @param _matronId Mother Bunny ID
     * @param _sireId   Father Bunny ID
     */
    function breedBunny(uint256 _matronId, uint256 _sireId) external openLock returns (uint256 tokenId) {
        return _breedBunny(_matronId, _sireId, 0);
    }

    function _breedBunny(uint256 _matronId, uint256 _sireId, uint256 _expectedFee) private returns (uint256 tokenId) {
        require(block.timestamp >= breedStartAt, "BunnyArmy: breed not start");
        require(bunnyGender[_matronId] == 0, "BunnyArmy: mather must be female");
        require(bunnyGender[_sireId] == 1, "BunnyArmy: father must be male");

        require(ownerOf(_matronId) == msg.sender, "BunnyArmy:  Matron not owner");
        require(ownerOf(_sireId) == msg.sender, "BunnyArmy:  Sire not owner");

        require(bunnyMother[_sireId] != _matronId || _matronId==0, "Bunny: can not breed with mother");
        require(bunnyFather[_matronId] != _sireId || _sireId==0, "Bunny: can not breed with father");

        require(breedGas > 0, "BunnyArmy: breed gas not set");
        require(breedGasTo != address(0), "BunnyArmy: breedGasTo not set");

        uint256 breedCountFemal =  bunnyBreedCount[_matronId];
        uint256 breedCountMale =  bunnyBreedCount[_sireId];
        uint256 breedFee = priceBaseBreedBunny.mul(breedCountFemal + breedCountMale + 2);

        if (_expectedFee != 0) {
          require(breedFee <= _expectedFee, "BunnyArmy: breed fee higher than expected");
        }

        tokenId = mintWithGender( geneBreedGander() , msg.sender);
        bunnyBreedCount[_matronId] = breedCountFemal + 1;
        bunnyBreedCount[_sireId] = breedCountMale + 1;

        bunnyMother[tokenId] = _matronId;
        bunnyFather[tokenId] = _sireId;

        console.log("metaBunny", metaBunny);

        uint256 rarity = genRandom() % 100 >= 50?  0 : 1;
        IMetaBunny(metaBunny).grantByRarity(tokenId, rarity);
        emit BunnyBreed(tokenId, msg.sender);
    }

    function geneBreedGander() private view returns(uint256 ) {
        require(breedFemaleRate > 0, "BunnyArmy: female rate cannot zero");
        require(breedFemaleRate < 100, "BunnyArmy: female rate cannot gt 100 based");

        return  breedScience.breeedGender(100, breedFemaleRate);
    }
    function pickEggRarity() private view returns (uint256) {
        uint256 random = genRandom();
        // 概率：普通(Normal)40%，稀有(Rare)35%, 超稀有(Superior)9%， 诗史(Epic)6%, 空蛋10%。
        if(random < 10) {
            return 0;
        } else if(random < 50) {
            return 1;
        } else if(random < 85) {
            return 2;
        } else if(random < 94) {
            return 3;
        } else {
            return 4;
        }
    }

    function genRandom() private view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(tx.origin, block.difficulty, block.timestamp, totalSupply()))) % 100;
    }

    function geneAdoptGander() private view returns(uint256 ) {

        uint256 femaleLeft = MAX_FEMALE_COUNT - adoptFemaleCount;
        if(femaleLeft == 0) {
            return 1;
        }
        uint256 maleLeft = MAX_MALE_COUNT - adoptMaleCount;
        if(maleLeft == 0) {
            return 0;
        }
        return  breedScience.breeedGender(femaleLeft+maleLeft, femaleLeft);
    }
    /**
     * @notice sale Bunny in expect price
     * @param _tokenId  BunnyID
     * @param _price in `BAC` token
     */
    function saleBunny(uint256 _tokenId, uint256 _price) external {
        require(ownerOf(_tokenId) == msg.sender, "BunnyArmy: not owner");
        require(!bunnyOnSale.contains(_tokenId), "BunnyArmy: bunny is on sale");

        bunnyOnSale.add(_tokenId);
        bunnyPrice[_tokenId] = _price;

        emit BunnySale(_tokenId, msg.sender, _price);
    }

    /**
     * @notice cancel sale Bunny 
     * @param _tokenId  BunnyID
     */ 
    function cancleSaleBunny(uint256 _tokenId) external {
        require(ownerOf(_tokenId) == msg.sender, "BunnyArmy: not owner");
        require(bunnyOnSale.contains(_tokenId), "BunnyArmy: bunny not on sale");

        bunnyOnSale.remove(_tokenId);
        delete bunnyPrice[_tokenId];

        emit BunnySaleCancle(_tokenId);
    }

    function buyBunnyExact(uint256 _tokenId, uint256 expectedPrice) external openLock {
        uint256 price = bunnyPrice[_tokenId];
        require(price <= expectedPrice, "BunnyArmy: price higher than expected");
        _buyBunny(_tokenId);
    }

    function buyBunny(uint256 _tokenId) external openLock {
        _buyBunny(_tokenId);
    }

    function _buyBunny(uint256 _tokenId) private {
        require(bunnyOnSale.contains(_tokenId), "BunnyArmy: bunny not on sale");
        require(breefFeeTo != address(0), "BunnyArmy: breefFeeTo not set");
        
        uint256 price = bunnyPrice[_tokenId];
        // 10% fee to breefFeeTo
        uint256 fee = price.div(10);
        IERC20(BAC).safeTransferFrom(msg.sender, breefFeeTo, fee);
        // 90% to saller
        IERC20(BAC).safeTransferFrom(msg.sender, ownerOf(_tokenId), price.sub(fee));

        _transfer(ownerOf(_tokenId), msg.sender, _tokenId);

        bunnyOnSale.remove(_tokenId);
        delete bunnyPrice[_tokenId];        

        totalSaledBunny += 1;
        totalSaledValue += price;

        emit BunnySaleSuc(_tokenId, msg.sender);
    }

    /// ******* Setting Part *****
    function setBaseURI(string memory _uri) external onlyOwner {
        baseURI = _uri;
    }

    function setAdoptPrice(uint256 _price) external onlyOwner {
        pricePerBunny = _price;
    }

    function setBreedStartAt(uint256 _startAt) external onlyOwner {
        breedStartAt = _startAt;
    }

    function setBreedPrice(uint256 _breedPrice) external onlyOwner {
        priceBaseBreedBunny = _breedPrice;
    }


    function setAdoptFeeTo(address _feeTo) external onlyOwner {
        adoptFeeTo = _feeTo;
    }

    function setBreedFeeTo(address _feeTo) external onlyOwner {
        breefFeeTo = _feeTo;
    }

    function setBreedScience(address _breedScience) external onlyOwner {
        breedScience = IBreedScience(_breedScience);
    }

    function setBreedFemaleRate(uint256 _femaleRate) external onlyOwner {
        breedFemaleRate = _femaleRate;
    }

    function setBreedGas(uint256 _breedGas) external onlyOwner {
        breedGas = _breedGas;
    }
    function setBreedGasTo(address _breedGasTo) external onlyOwner {
        breedGasTo = _breedGasTo;
    }

    function setFeeBreedEgg(uint256 _feeBreedEgg) external onlyOwner {
        feeBreedEgg = _feeBreedEgg;
    }

    function setFeeSynthesisBunny(uint256 _feeSynthesisBunny) external onlyOwner {
        feeSynthesisBunny = _feeSynthesisBunny;
    }

    function setFeeOpenEgg(uint256 _feeOpenEgg) external onlyOwner {
        feeOpenEgg = _feeOpenEgg;
    }    

    function setMetaBunny(address _metaBunny) external onlyOwner {
        metaBunny = _metaBunny;
    }
    function setGameAdmin(address _gameAdmin) external onlyOwner {
        gameAdmin = _gameAdmin;
    }
    /// ******* Setting Part END *****
    
    /// ******* View Part *****
    function mintWithGender(uint256 gender, address _owner) private returns (uint256 tokenId) {
        tokenId = totalSupply();
        bunnyGender[tokenId] = gender;
        _mint(_owner, tokenId);
    }

    function bunnyInfo(uint256 _tokenId) 
        public 
        view 
        returns (
            uint256 tokenId, 
            address owner,
            uint256 gander,
            uint256 breedCount,
            bool onSale,
            uint256 price,
            uint256 fatherId,
            uint256 motherId,
            bool fromBreed,
            bool bunnyEgg
        )
    {
        
        tokenId = _tokenId;
        owner = ownerOf(tokenId);
        gander = bunnyGender[tokenId];
        breedCount = bunnyBreedCount[tokenId];
        onSale = bunnyOnSale.contains(tokenId);
        price = bunnyPrice[tokenId];
        fatherId = bunnyFather[tokenId];
        motherId = bunnyMother[tokenId];
        fromBreed = fatherId > 0 && motherId> 0;
        bunnyEgg = tokenEgg[tokenId];
    }

    function adoptedCount() external view returns (uint256 adopted, uint256 total) {
        return (adoptMaleCount + adoptFemaleCount, MAX_MALE_COUNT + MAX_FEMALE_COUNT );
    }

    function onSaleLength() external view returns (uint256) {
        return bunnyOnSale.length();
    }

    function onSaleInfoByIndex(uint256 _index) 
        external 
        view 
        returns (
            uint256 tokenId, 
            address owner,
            uint256 gander,
            uint256 breedCount,
            bool onSale,
            uint256 price,
            uint256 fatherId,
            uint256 motherId,
            bool fromBreed,
            bool bunnyEgg
        )
    {
        require(_index < bunnyOnSale.length(), "BunnyArmy: index out of bound");

        uint256 _tokenId = bunnyOnSale.at(_index);
        return bunnyInfo(_tokenId);
    }

    /// Utils Part

    function min(uint256 a, uint256 b) private pure returns (uint256) {
        return a < b ? a : b;
    }

    /// Override Part
    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override {
        // require(!bunnyOnSale.contains(tokenId) , "BunnyArmy: cannot transfer bunny on sale");
        require(transferAllow , "BunnyArmy: transfer only in BunnyMarket");
        super._beforeTokenTransfer(from, to, tokenId);
    }

}