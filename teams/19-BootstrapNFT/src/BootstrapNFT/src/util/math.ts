import BigNumber from "@/util/bignumber";

const BONE = new BigNumber(10).pow(18);
const EXIT_FEE = new BigNumber(0);
const BPOW_PRECISION = BONE.idiv(new BigNumber(10).pow(10));

function btoi(a: BigNumber): BigNumber {
    return a.idiv(BONE);
}

function bfloor(a: BigNumber): BigNumber {
    return btoi(a).times(BONE);
}

export const calcSingleInGivenWeightIncrease = (
    tokenBalance: BigNumber,
    tokenWeight: BigNumber,
    tokenWeightNew: BigNumber
) => {
    console.log(
        "WeightIncrease",
        tokenBalance.toString(),
        tokenWeight.toString(),
        tokenWeightNew.toString()
    );
    const deltaWeight = tokenWeightNew.minus(tokenWeight);
    const tokenBalanceIn = bmul(tokenBalance, bdiv(deltaWeight, tokenWeight));
    return tokenBalanceIn;
};

export function calcPoolInGivenWeightDecrease(
    totalWeight: BigNumber,
    tokenWeight: BigNumber,
    tokenWeightNew: BigNumber,
    poolSupply: BigNumber
): BigNumber {
    const deltaWeight = tokenWeight.minus(tokenWeightNew);
    const poolAmountIn = bmul(poolSupply, bdiv(deltaWeight, totalWeight));
    return poolAmountIn;
}

export const calcPoolInGivenTokenRemove = (
    totalWeight: BigNumber,
    tokenWeight: BigNumber,
    poolSupply: BigNumber
) => {
    return bdiv(bmul(poolSupply, tokenWeight), totalWeight);
};

export function bmul(a: BigNumber, b: BigNumber): BigNumber {
    const c0 = a.times(b);
    const c1 = c0.plus(BONE.div(new BigNumber(2)));
    const c2 = c1.idiv(BONE);
    return c2;
}

export function bdiv(a: BigNumber, b: BigNumber): BigNumber {
    const c0 = a.times(BONE);
    const c1 = c0.plus(b.div(new BigNumber(2)));
    const c2 = c1.idiv(b);
    console.log(
        "c2",
        a.toString(),
        b.toString(),
        c0.toString(),
        c1.toString(),
        c2.toString()
    );
    return c2;
}
