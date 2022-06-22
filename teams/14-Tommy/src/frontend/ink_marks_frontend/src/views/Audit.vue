<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> Contracts
                </el-breadcrumb-item>
                <el-breadcrumb-item>Audit contract</el-breadcrumb-item>
                <el-breadcrumb-item>contract id: {{ this.$route.query.id }}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-form ref="form" :model="form" label-width="80px">
              <div>
                <h1> Audit Contract </h1>
              </div>
              <el-form-item label="Name">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
              <div>
                <h1> Check List </h1>
              </div>
              <div>
                <el-card shadow="always">
                    <div>
                        <h3> Testing and Software Engineering </h3>
                    </div>
                    <div><el-checkbox checked> Test Coverage Have 100% branch test coverage</el-checkbox></div>
                    <div><el-checkbox checked>Unit Tests Cover all critical edge cases with unit tests</el-checkbox></div>
                    <div><el-checkbox>Integration Tests Have extensive integration tests</el-checkbox></div>
                    <div><el-checkbox>Code Freeze Don't deploy recently written code, especially when written under a tight deadline</el-checkbox></div>

                    <div>
                        <h3> Resilience </h3>
                    </div>
                    <div><el-checkbox checked>We always check for code that will mitigate risk when (not if) a contract fails. When a contract doesn’t have this, it’s often a warning sign.</el-checkbox></div>
                    <div><el-checkbox checked>What failure states would be most disastrous?</el-checkbox></div>
                    <div><el-checkbox>Are there assert checks for critical values? (e.g., individual balances total to sum)</el-checkbox></div>
                    <div><el-checkbox>Speed Bumps Does the contract have a speed bump? (e.g., delay in withdrawing funds, like the DAO)</el-checkbox></div>
                    <div><el-checkbox checked>Circuit Breakers Does the contract have a circuit breaker? (preventing critical functions in an emergency mode)</el-checkbox></div>
                    <div><el-checkbox>Audits Have code audited by (preferably) multiple external parties (in series)</el-checkbox></div>
                    <div><el-checkbox>Time Management Allocate comfortable time after the audit to address issues</el-checkbox></div>
                    <div>
                        <h3> Check 1 List </h3>
                    </div>
                    <div><el-checkbox>All functions are `internal` except where explictly required to be `public`/`external`. [[?](https://blog.zeppelin.solutions/on-the-parity-wallet-multisig-hack-405a8c12e8f7)]</el-checkbox></div>
                    <div><el-checkbox checked>There are no arithmetic overflows/underflows in math operations.</el-checkbox></div>
                    <div><el-checkbox checked>Using the OpenZeppelin safe math library [[?](https://github.com/OpenZeppelin/openzeppelin-solidity/tree/master/contracts/math)].</el-checkbox></div>
                    <div><el-checkbox>Tokens cannot be accidentally sent to the address `0x0`.</el-checkbox></div>
                    <div><el-checkbox>Conditions are checked using `require` before operations and state changes.</el-checkbox></div>
                    <div><el-checkbox>State is being set before and performing actions.</el-checkbox></div>
                    <div><el-checkbox>Protected from reentry attacks (A calling B calling A).</el-checkbox></div>
                    <div><el-checkbox checked>Properly implements the ERC20 interface [[?](https://github.com/ethereum/eips/issues/20)].</el-checkbox></div>
                    <div><el-checkbox>Only using modifier if necessary in more than one place.</el-checkbox></div>
                    <div><el-checkbox>All types are being explicitly set (e.g. using `uint256` instead of `uint`).</el-checkbox></div>
                    <div><el-checkbox>All methods and loops are within the maximum allowed gas limt.</el-checkbox></div>
                    <div><el-checkbox>There are no unnecessary initalizations in the constructor (remember, default values are set).</el-checkbox></div>
                    <div><el-checkbox>There is complete test coverage; every smart contract method and every possible type of input is being tested.</el-checkbox></div>
                    <div><el-checkbox>Performed fuzz testing by using random inputs.</el-checkbox></div>
                    <div><el-checkbox>Tested all the possible different states that the contract can be in.</el-checkbox></div>
                    <div><el-checkbox>Ether and token amounts are dealt in wei units.</el-checkbox></div>
                    <div><el-checkbox>The crowdsale end block/timestamp comes after start block/timestamp.</el-checkbox></div>
                    <div><el-checkbox>The crowdsale token exchange/conversion rate is properly set.</el-checkbox></div>
                    <div><el-checkbox>The crowdsale soft/hard cap is set.</el-checkbox></div>
                    <div><el-checkbox>The crowdsale min/max contribution allowed is set and tested.</el-checkbox></div>
                    <div><el-checkbox checked>The crowdsale whitelisting functionality is tested.</el-checkbox></div>
                    <div><el-checkbox checked>The crowdsale refund logic is tested.</el-checkbox></div>
                    <div><el-checkbox checked>Crowdsale participants are given their proportional token amounts or are allowed to claim their contribution.</el-checkbox></div>
                    <div><el-checkbox>The length of each stage of the crowdsale is properly configured (e.g. presale, public sale).</el-checkbox></div>
                    <div><el-checkbox>Specified which functions are intented to be controlled by the owner only (e.g. pausing crowdsale, progressing crowdsale stage, enabling distribution of tokens, etc..).</el-checkbox></div>
                    <div><el-checkbox>The crowdsale vesting logic is tested.</el-checkbox></div>
                    <div><el-checkbox>The crowdsale has a fail-safe mode that when enabled by owner, restricts calls to function and enables refund functionality.</el-checkbox></div>
                    <div><el-checkbox>The crowdsale has a fallback function in place if it makes reasonable sense.</el-checkbox></div>
                    <div><el-checkbox>The fallback function does not accept call data or only accepts prefixed data to avoid function signature collisions.</el-checkbox></div>
                    <div><el-checkbox>Imported libraries have been previously audited and don't contain dyanmic parts that can be swapped out in future versions which can be be used maliciously. </el-checkbox></div>
                    <div><el-checkbox>Token transfer statements are wrapped in a `require`.</el-checkbox></div>
                    <div><el-checkbox>Using `require` and `assert` properly. Only use `assert` for things that should never happen, typically used to validate state after making changes.</el-checkbox></div>
                    <div><el-checkbox>Using `keccak256` instead of the alias `sha3`.</el-checkbox></div>
                    <div><el-checkbox>Protected from ERC20 short address attack. [[?](https://vessenes.com/the-erc20-short-address-attack-explained/)].</el-checkbox></div>
                    <div><el-checkbox>Protected from recursive call attacks.</el-checkbox></div>
                    <div><el-checkbox>Arbitrary string inputs have length limits.</el-checkbox></div>
                    <div><el-checkbox>No secret data is exposed (all data on the blockchain is public).</el-checkbox></div>
                    <div><el-checkbox>Avoided using array where possible and using mappings instead.</el-checkbox></div>
                    <div><el-checkbox>Does not rely on block hashes for randomness (miners have influence on this).</el-checkbox></div>
                    <div><el-checkbox>Does not use `tx.origin` anywhere. [[?](https://vessenes.com/tx-origin-and-ethereum-oh-my/)]</el-checkbox></div>
                    <div><el-checkbox>Array items are shifted down when an item is deleted to avoid leaving a gap.</el-checkbox></div>
                    <div><el-checkbox checked>Use `revert` instead of `throw`.</el-checkbox></div>
                    <div><el-checkbox checked>Functions exit immediately when conditions aren't meant.</el-checkbox></div>
                    <div><el-checkbox checked>Using the latest stable version of Solidity.</el-checkbox></div>
                    <div><el-checkbox checked>Prefer pattern where receipient withdrawals funds instead of contract sending funds, however not always applicable.</el-checkbox></div>
                    <div><el-checkbox>Resolved warnings from compiler.</el-checkbox></div>
                    <div><el-checkbox>Prevent overflow and underflow</el-checkbox></div>
                    <div><el-checkbox>Use [SafeMath](https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/math/SafeMath.sol)</el-checkbox></div>
                    <div><el-checkbox>Function Visibility</el-checkbox></div>
                    <div><el-checkbox>Ensure that all relevant functions are marked with the correct visibility</el-checkbox></div>
                    <div><el-checkbox>Fix compiler warnings</el-checkbox></div>
                    <div><el-checkbox>Avoid using problematic features - If you must, be aware of their many nuances</el-checkbox></div>
                    <div><el-checkbox>Low level functions (`call`, `delegatecall`, `callcode`, inline assembly)</el-checkbox></div>
                    <div><el-checkbox>External Calls - Every external contract call is a risk</el-checkbox></div>
                    <div><el-checkbox>Check for [reentrancy](https://dasp.co/#item-1) - and ensure state committed before external call</el-checkbox></div>
                    <div><el-checkbox>Check for "short circuits" (external contract calls that can fail or be manipulated to fail, causing a denial of service of a function)</el-checkbox></div>
                    <div><el-checkbox>This is often overlooked for ERC20, which can [fail unexpectedly due to freezing](https://blog.cryptofin.io/what-we-learned-from-auditing-the-top-20-erc20-token-contracts-7526ef3b6fb1)</el-checkbox></div>
                    <div><el-checkbox>[Callstack depth](https://solidity.readthedocs.io/en/v0.4.24/security-considerations.html?highlight=callstack#callstack-depth) can cause this as well</el-checkbox></div>
                    <div><el-checkbox>Dependencies Use audited and trustworthy dependencies</el-checkbox></div>
                    <div><el-checkbox>Ensure newly written code is minimized by using libraries</el-checkbox></div>
                    <div><el-checkbox>Time Manipulation - Timestamps can theoretically be manipulated by malicious miners by up to a few minutes</el-checkbox></div>
                    <div><el-checkbox>Ensure important mechanisms aren't overly sensitive to timestamps</el-checkbox></div>
                    <div><el-checkbox>Rounding Errors</el-checkbox></div>
                    <div><el-checkbox>Check that truncation doesn't produce unexpected behavior (eg. incorrect results, locked funds)</el-checkbox></div>
                    <div><el-checkbox>Don't rely on pseudo-randomness for important mechanisms (eg. keccak with a deterministic seed like blockhash, blocknumber, etc.)</el-checkbox></div>
                    <div><el-checkbox>Validate inputs of external/public functions</el-checkbox></div>
                    <div><el-checkbox>Ensure requires to bound and check presence of arguments</el-checkbox></div>
                    <div><el-checkbox>Prevent unbounded loops</el-checkbox></div>
                    <div><el-checkbox>Appropriate use of push payments</el-checkbox></div>
                    <div><el-checkbox>Change old Solidity constructs</el-checkbox></div>
                    <div><el-checkbox>selfdestruct vs suicide</el-checkbox></div>
                    <div><el-checkbox>Don't use tx.origin as an authentication mechanism</el-checkbox></div>
                    <div><el-checkbox>Verify changes in the most recent Solidity version (if upgrading from an older version)</el-checkbox></div>

              </el-card>
              </div>
            </el-form>
            <div>
                <el-row>
                  <el-button type="success" plain >Save</el-button>
                  <el-button type="info" plain @click="Done">Done</el-button>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
  import axios from 'axios';

  export default {
    data() {
      return {
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        }
      }
    },
    methods: {
        onSubmit() {
            console.log('submit!');
        },
        Done() {
            let url = "http://127.0.0.1:8888/inkcontracts/"+this.$route.query.id;
            axios.patch(url, { state: 'done' })
            .then((res) => {
                    this.$router.push({
                        name: 'basetable',
                        query: { redirect: '/table' },
                    });
            });
        },
        getData() {
            axios.get("http://127.0.0.1:8888/inkcontracts/"+this.$route.query.id).then((res) => {
                    this.form = res.data;
            });
        },
    },
    mounted() {
        this.getData();
    }
  }
</script>
