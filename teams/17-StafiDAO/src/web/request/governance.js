import request from "../request/index";
import $store from "@/store/index";

export function getGovernanceList() {
  let arr = [
    "query {",
    "    startGoverns (",
    // "      orderBy: START_DATE_DESC",
    // "      filter:{",
    // '        creator:{equalTo:"0x7A75f008c92d94761ff156eF54d99133F3054BE4"}',
    // '        number:{equalTo:"2"}        ',
    // "      }",
    // "      offset:1",
    "      first: 5) {",
    "        nodes {",
    "            id",
    "            creator",
    "            number",
    "            governType",
    "          startDate",
    "          endDate",
    "          uintValue",
    "           totalVoter",
    // "           approveVoter",
    // "           opposeVoter",
    // "           success",
    "        }",
    "    }",
    "    voteByNumbers (first: 5) {",
    "        nodes {",
    "            id",
    "            votor",
    "            number",
    "            governType",
    // "          startDate",
    // "          endDate",
    // "          uintValue",
    // "           totalVoter",
    "        }",
    "    }",
    "}",
  ];
  return request({
    url: "/thiscrg/stafidao",
    method: "post",
    data: { query: arr.join() },
  });
}

export function getAirdropList() {
  let arr = [
    "query {",
    "    transactions (",
    "      filter:{",
    '        to:{equalToInsensitive:"' + $store.state.accs + '"}',
    "      }",
    "      first: 5) {",
    "        nodes {",
    "            id",
    "            value",
    "            to",
    "            from",
    "            contractAddress",
    "        }",
    "    }",
    "}",
  ];

  return request({
    url: "/makefriendwithtime/stafidao-airdrop",
    method: "post",
    data: { query: arr.join() },
  });
}

export function getRewardList() {
  let arr = [
    "query {",
    "    sendValues (",
    "       filter:{",
    '       recipient :{equalToInsensitive:"' + $store.state.accs + '"}',
    "      }",
    "      first: 5) {",
    "        nodes {",
    "            id",
    "            recipient",
    "            amount",
    "            contractAddress",
    "        }",
    "    }",
    "}",
  ];
  return request({
    url: "/makefriendwithtime/stafidao-reward",
    method: "post",
    data: { query: arr.join() },
  });
}
