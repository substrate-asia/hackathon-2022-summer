<template>
  <div>
    <div v-if="$route.query.trigger_type == 'wallet_monitor'">
      <div class="address-wrap">
        <div class="form-item">
          <div class="label">When</div>
          <div class="value">
            <a-input v-model="form.address" placeholder="Wallet Address" />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="form-item">
          <div class="label">Mode</div>
          <div class="value">
            <a-select v-model="form.mode" :style="{ width: '142px' }">
              <a-option value="send">Send</a-option>
              <a-option value="receive">Receive</a-option>
            </a-select>
          </div>
        </div>
        <div class="form-item">
          <div class="label">Predicate</div>
          <div class="value">
            <div class="btn-wrap">
              <div
                class="btn"
                :class="{ active: this.form.Predicate == '<=' }"
                @click="changePredicate('<=')"
              >
                &lt;=
              </div>
              <div
                class="btn"
                :class="{ active: this.form.Predicate == '>=' }"
                @click="changePredicate('>=')"
              >
                &gt;=
              </div>
            </div>
          </div>
        </div>
        <div class="form-item">
          <div class="label">Numerical value</div>
          <div class="value">
            <a-input-number
              v-model="form.num"
              :style="{ width: '456px' }"
              mode="button"
            />
          </div>
        </div>
        <div class="form-item">
          <div class="label">Token</div>
          <div class="value">
            <a-select v-model="form.token" :style="{ width: '393px' }">
              <a-option
                v-for="v in tokenList"
                :key="v.symbol"
                :value="v.symbol"
                >{{ v.symbol }}</a-option
              >
            </a-select>
          </div>
        </div>
      </div>
    </div>
    <div v-if="$route.query.trigger_type == 'gas'">
      <div class="row">
        <div class="form-item">
          <div class="label">&nbsp;</div>
          <div class="value">
            <div class="text">When Gas Fee</div>
          </div>
        </div>
        <div class="form-item">
          <div class="label">Predicate</div>
          <div class="value">
            <div class="btn-wrap">
              <div
                class="btn"
                :class="{ active: this.form.Predicate == '<=' }"
                @click="changePredicate('<=')"
              >
                &lt;=
              </div>
              <div
                class="btn"
                :class="{ active: this.form.Predicate == '>=' }"
                @click="changePredicate('>=')"
              >
                &gt;=
              </div>
            </div>
          </div>
        </div>
        <div class="form-item">
          <div class="label">Numerical value</div>
          <div class="value">
            <a-input-number
              v-model="form.num"
              :style="{ width: '456px' }"
              mode="button"
            />
          </div>
        </div>
        <div class="form-item">
          <div class="label">Token</div>
          <div class="value">
            <a-select v-model="form.token" :style="{ width: '426px' }">
              <a-option
                v-for="v in tokenList"
                :key="v.symbol"
                :value="v.symbol"
                >{{ v.symbol }}</a-option
              >
            </a-select>
          </div>
        </div>
      </div>
    </div>
    <div v-if="$route.query.trigger_type == 'anyswap'">
      <div class="address-wrap">
        <div class="form-item">
          <div class="label">When</div>
          <div class="value">
            <a-input v-model="form.address" placeholder="Wallet Address" />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="form-item">
          <div class="label">Mode</div>
          <div class="value">
            <a-select v-model="form.mode" :style="{ width: '142px' }">
              <a-option value="swapin">Swap In</a-option>
              <a-option value="swapout">Swap Out</a-option>
            </a-select>
          </div>
        </div>
        <div class="form-item">
          <div class="label">Predicate</div>
          <div class="value">
            <div class="btn-wrap">
              <div
                class="btn"
                :class="{ active: this.form.Predicate == '<=' }"
                @click="changePredicate('<=')"
              >
                &lt;=
              </div>
              <div
                class="btn"
                :class="{ active: this.form.Predicate == '>=' }"
                @click="changePredicate('>=')"
              >
                &gt;=
              </div>
            </div>
          </div>
        </div>
        <div class="form-item">
          <div class="label">Numerical value</div>
          <div class="value">
            <a-input-number
              v-model="form.num"
              :style="{ width: '300px' }"
              mode="button"
            />
          </div>
        </div>
        <div class="form-item">
          <div class="label">Token</div>
          <div class="value">
            <a-select v-model="form.token" :style="{ width: '247px' }">
              <a-option
                v-for="v in tokenList"
                :key="v.symbol"
                :value="v.symbol"
                >{{ v.symbol }}</a-option
              >
            </a-select>
          </div>
        </div>
        <div class="form-item">
          <div class="label">&nbsp;</div>
          <div class="value">
            <div class="text">on</div>
          </div>
        </div>
        <div class="form-item">
          <div class="label">Chain</div>
          <div class="value">
            <a-select v-model="form.chain" :style="{ width: '247px' }">
              <a-option
                v-for="v in chainList"
                :key="v.chain"
                :value="v.chain"
                >{{ v.chain }}</a-option
              >
            </a-select>
          </div>
        </div>
      </div>
    </div>
    <div v-if="$route.query.trigger_type == 'dex'">
      <div class="row first-row">
        <div class="form-item">
          <div class="label">&nbsp;</div>
          <div class="value">
            <div class="text">From Dex</div>
          </div>
        </div>
        <div class="form-item">
          <div class="label">&nbsp;</div>

          <div class="value">
            <a-select
              @change="changeDex"
              v-model="form.dex"
              :style="{ width: '300px' }"
            >
              <a-option value="SolarBeam">SolarBeam</a-option>
              <a-option value="Zenlink">Zenlink</a-option>
            </a-select>
          </div>
        </div>
        <div class="form-item">
          <div class="label">&nbsp;</div>
          <div class="value">
            <div class="text">watch on pair</div>
          </div>
        </div>
        <div class="form-item">
          <div class="label">&nbsp;</div>
          <div class="value">
            <a-select
              @change="changePair"
              v-model="form.dex_pair_contract_address_name"
              :style="{ width: '300px' }"
            >
              <a-option
                v-for="v in pairList"
                :key="v.dex_pair_contract_address_name"
                :value="v.dex_pair_contract_address_name"
                >{{ v.dex_pair_contract_address_name }}</a-option
              >
            </a-select>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="form-item">
          <div class="label">&nbsp;</div>
          <div class="value">
            <div class="text">When</div>
          </div>
        </div>
        <div class="form-item">
          <div class="label">Action</div>
          <div class="value">
            <a-select v-model="form.watched_topic" :style="{ width: '230px' }">
              <a-option value="swap">swap</a-option>
              <a-option value="mint">mint</a-option>
              <a-option value="burn">burn</a-option>
            </a-select>
          </div>
        </div>
        <div class="form-item">
          <div class="label">Token</div>
          <div class="value">
            <a-select
              v-model="form.watched_token_index"
              :style="{ width: '350px' }"
            >
              <a-option value="0">{{ currentPair.token0_symbol }}</a-option>
              <a-option value="1">{{ currentPair.token1_symbol }}</a-option>
            </a-select>
          </div>
        </div>
        <div class="form-item">
          <div class="label">Predicate</div>
          <div class="value">
            <div class="btn-wrap">
              <div
                class="btn"
                :class="{ active: this.form.Predicate == '<=' }"
                @click="changePredicate('<=')"
              >
                &lt;=
              </div>
              <div
                class="btn"
                :class="{ active: this.form.Predicate == '>=' }"
                @click="changePredicate('>=')"
              >
                &gt;=
              </div>
            </div>
          </div>
        </div>
        <div class="form-item">
          <div class="label">Numerical value</div>
          <div class="value">
            <a-input-number
              v-model="form.num"
              :style="{ width: '350px' }"
              mode="button"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    form: {
      type: Object,
    },
    tokenList: {
      type: Array,
    },
    pairData: {
      type: Array,
    },
  },
  data() {
    return {};
  },
  computed: {
    pairList() {
      return this.pairData.filter((v) => v.dex == this.form.dex);
    },
    currentPair() {
      const find = this.pairList.find(
        (v) =>
          v.dex_pair_contract_address_name ==
          this.form.dex_pair_contract_address_name
      );
      if (!find) {
        return {};
      }
      return find;
    },
  },
  methods: {
    changeDex() {
      this.form.dex_pair_contract_address_name = "";
      this.form.watched_token_index = "";
    },
    changePair() {
      this.form.watched_token_index = "";
    },
    changePredicate(value) {
      this.form.Predicate = value;
    },
  },
};
</script>

<style lang="less" scoped>
.address-wrap {
  margin-bottom: 32px;
}
.first-row {
  margin-bottom: 32px;
}
.row {
  display: flex;
}
.form-item {
  & + .form-item {
    margin-left: 19px;
  }
  & > .label {
    font-weight: 500;
    font-size: 16px;
    color: #878d96;
  }
  & > .value {
    margin-top: 8px;
    .text {
      font-size: 16px;
      color: #f2f4f8;
      line-height: 46px;
    }
    .btn-wrap {
      display: flex;
      .btn {
        cursor: pointer;
        font-weight: 700;
        font-size: 16px;
        width: 110px;
        height: 46px;
        line-height: 46px;
        text-align: center;
        background: #21272a;
        border-radius: 10px;
        & + .btn {
          margin-left: 4px;
        }
        &.active {
          background: #3965FF;
        }
      }
    }
  }
}
</style>