// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0 <0.9.0;

interface IERC20 {
    function transfer(address to, uint256 value) external returns (bool);
}

contract Market {
    // Emitted a lot codes. Only shows functions that interact with moonbase precompile.
    // 省略了很多代码，仅展示与moonbase 预编译有交互的function。
    function addWithArr(uint256[] memory _ids, uint256 _colorNum)
        public
        payable
    {
        require(idOutRange(_ids), "at least one id out of range");
        require(_colorNum < 126 && _colorNum != 0, "colorNum out of range");

        bool shifou;
        for (uint256 i = 0; i < _ids.length; i++) {
            if (haveId(_ids[i])) {
                shifou = true;
                break;
            }
        }

        if (!shifou) {
            if (whetherUseReferrer()) {
                // payable(users2refs[msg.sender]).transfer(
                //     _ids.length * 10**14 * referrerRewardCreate
                // );
                // payable(owner).transfer(
                //     _ids.length *
                //         10**14 *
                //         (addRate - referrerRewardCreate - userBenefitCreate)
                // );
                IERC20(0x0000000000000000000000000000000000000802).transfer(
                    users2refs[msg.sender],
                    _ids.length * 10**11 * referrerRewardCreate
                );
                IERC20(0x0000000000000000000000000000000000000802).transfer(
                    owner,
                    _ids.length *
                        10**11 *
                        (addRate - referrerRewardCreate - userBenefitCreate)
                );

                for (uint256 i = 0; i < _ids.length; i++) {
                    if (!haveId(_ids[i])) {
                        arrayIndex[_ids[i]] = blocks.length;
                        Block memory blk = Block(
                            _ids[i],
                            _colorNum,
                            payable(msg.sender),
                            users2refs[msg.sender],
                            200,
                            100
                        );
                        blocks.push(blk);
                    }
                }
            } else {
                // payable(owner).transfer(_ids.length * 10**14 * addRate);
                IERC20(0x0000000000000000000000000000000000000802).transfer(
                    owner,
                    _ids.length * 10**11 * addRate
                );
                for (uint256 i = 0; i < _ids.length; i++) {
                    if (!haveId(_ids[i])) {
                        arrayIndex[_ids[i]] = blocks.length;
                        Block memory blk = Block(
                            _ids[i],
                            _colorNum,
                            payable(msg.sender),
                            users2refs[msg.sender],
                            200,
                            100
                        );
                        blocks.push(blk);
                    }
                }
            }
        }
    }

    function buyBlocks(uint256[] memory _ids, uint256 _colorNum)
        public
        payable
    {
        //可以尝试下有没有更省手续费的方法。
        address originOwner;
        originOwner = blocks[arrayIndex[_ids[0]]].blockOwner;
        require(
            msg.sender != originOwner,
            "you already owned at least one of the seletcted blocks"
        );
        for (uint256 i = 0; i < _ids.length; i++) {
            require(
                blocks[arrayIndex[_ids[i]]].blockOwner == originOwner,
                "you have to select blocks with the same owner"
            );
        }
        require(
            getOwnedQtt(originOwner) > lockLimit || !getLock(originOwner),
            "the originOwner locked it's blocks, you have to buy his/her blocks all at once"
        );
        uint256 totalPay;
        for (uint256 i = 0; i < _ids.length; i++) {
            totalPay +=
                blocks[arrayIndex[_ids[i]]].basicPrice *
                blocks[arrayIndex[_ids[i]]].priceRate;
        }
        if (whetherUseReferrer()) {
            // payable(originOwner).transfer(totalPay * 10**10 * (10000 - fee));
            IERC20(0x0000000000000000000000000000000000000802).transfer(
                originOwner,
                totalPay * 10**7 * (10000 - fee)
            );
            // payable(users2refs[msg.sender]).transfer(
            //     totalPay * 10**10 * referrerRewardBuy
            // );

            IERC20(0x0000000000000000000000000000000000000802).transfer(
                users2refs[msg.sender],
                totalPay * 10**7 * referrerRewardBuy
            );

            // payable(owner).transfer(
            //     totalPay * 10**10 * (fee - userBenefitBuy - referrerRewardBuy)
            // );

            IERC20(0x0000000000000000000000000000000000000802).transfer(
                owner,
                totalPay * 10**7 * (fee - userBenefitBuy - referrerRewardBuy)
            );
        } else {
            // payable(originOwner).transfer(totalPay * 10**10 * (10000 - fee));

            IERC20(0x0000000000000000000000000000000000000802).transfer(
                originOwner,
                totalPay * 10**7 * (10000 - fee)
            );
            // payable(owner).transfer(totalPay * 10**10 * fee);
            IERC20(0x0000000000000000000000000000000000000802).transfer(
                owner,
                totalPay * 10**7 * fee
            );
        }
        for (uint256 i = 0; i < _ids.length; i++) {
            blocks[arrayIndex[_ids[i]]].blockOwner = payable(msg.sender);
            blocks[arrayIndex[_ids[i]]].referrer = users2refs[msg.sender];
            blocks[arrayIndex[_ids[i]]].colorNum = _colorNum;
            blocks[arrayIndex[_ids[i]]].basicPrice =
                (blocks[arrayIndex[_ids[i]]].basicPrice *
                    blocks[arrayIndex[_ids[i]]].priceRate) /
                100;
        }
    }
}
