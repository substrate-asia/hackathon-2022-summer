import React, { useEffect, useState } from 'react'
import { useLocation } from "umi"

import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { Space, Table } from "antd";

import { useStorage } from "@/hooks/useStorage.ts"
import { get_role_list } from "@/request/fass.js"
import { get_ongoing_ref, get_public_proposal } from "@/request/democracy";

import Tag from '@/components/Tag'
import ContentWrapper from '@/components/ContentWrapper'
import NameCard from '@/components/NameCard'
import Resume from '@/components/Resume'

import logo from "@/assets/images/logo.png"
import homeActive from "@/assets/images/home-active.png"
import vote from "@/assets/images/home/vote.png"
import voteActive from "@/assets/images/home/vote-active.png"
import notice from "@/assets/images/notice.png"

import avatar from "@/assets/images/avatar.png"
import add from "@/assets/images/add.png"
import twitter from "@/assets/images/twitter-white-30px.png"
import instgram from "@/assets/images/instgram-white-30px.png"
import github from "@/assets/images/github-white-30px.png"
import thumb from "@/assets/images/thumb.png"
import banner from "@/assets/images/banner.png"
import codeScreen from "@/assets/images/code.png"
import arrowDown from "@/assets/images/arrowDown.png"

const tags = [
  '3D animation',
  'Metaverse',
  'Web 3.0',
  'Illustration',
  'Brand Marketing',
  'Video Edit',
  'Writing',
]

const contentTypes = [
  'MirrorArticle',
  'Design',
  'Code',
]

const article = {
  type: 'article',
  title: 'LinkedIn Is No Longer',
  time: '13 days ago',
  paras: [
    'Here’s what it is now — It’s Monday morning. I grab a cup of coffee and log in to LinkedIn. It’s not long before I am rolling my eyes. It’s not a professional networking site anymore. LinkedIn is now primarily a salesHere’s what it is now — It’s Monday morning. I not long before I am …',
  ],
  image: thumb,
  fields: [
    'Leadership',
  ],
}

const design = {
  type: 'design',
  title: 'Design for the transport',
  time: '13 days ago',
  image: banner,
  fields: [
    'Leadership',
  ],
}

const code = {
  type: 'code',
  title: 'LinkedIn Is No Longer',
  time: '13 days ago',
  paras: [
    'Probably one of the most common make money online questions that I get asked on Quora and Twitter is, “How can I make $100 a day online?”',
    'Well, depending on your skills and the demand for those skills, you may or may not be able to earn at least $100 a day from a single website as a freelancer — especially when you are new to freelancing. That’s because there is often intense competition for good-paying gigs…',
  ],
  image: codeScreen,
  fields: [
    'Leadership',
  ],
}

const recommendedFields = [
  'Extreme Sport',
  'Web Design',
  'Brand Marketing',
  'Web 3.0',
]

const nameCardInfo = {
  name: 'Jane Cooper',
  email: 'mic***@example.com',
  addr: 'New York·US',
  phone: '529***704',
}

const resumeInfo = {
  name: 'Jane Cooper',
  email: 'mic***@example.com',
  addr: 'New York·US',
  phone: '529***704',
}
//NFT合约
const contractAddress = '0xFD2eAE748407bFf503212599d0992b6d26Fb310a'
const tokenJson = [{ "inputs": [{ "internalType": "string", "name": "tokenName", "type": "string" }, { "internalType": "string", "name": "tokenSymbol", "type": "string" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "approved", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": false, "internalType": "bool", "name": "approved", "type": "bool" }], "name": "ApprovalForAll", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "inputs": [], "name": "_tokenIds", "outputs": [{ "internalType": "uint256", "name": "_value", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "_tokenURIs", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "approve", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "username", "type": "string" }, { "internalType": "string", "name": "arLink", "type": "string" }], "name": "claim", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "getApproved", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "operator", "type": "address" }], "name": "isApprovedForAll", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "ownerOf", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "internalType": "bytes", "name": "_data", "type": "bytes" }], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "operator", "type": "address" }, { "internalType": "bool", "name": "approved", "type": "bool" }], "name": "setApprovalForAll", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" }], "name": "supportsInterface", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "index", "type": "uint256" }], "name": "tokenByIndex", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "uint256", "name": "index", "type": "uint256" }], "name": "tokenOfOwnerByIndex", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "tokenURI", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "transferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "username", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }]

//投票合约
const democracyAddress = '0x0000000000000000000000000000000000000803'
const democracyJson = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "representative",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "conviction",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "delegate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "encoded_proposal",
        "type": "bytes"
      }
    ],
    "name": "note_imminent_preimage",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "encoded_proposal",
        "type": "bytes"
      }
    ],
    "name": "note_preimage",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "proposal_hash",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "propose",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "ref_index",
        "type": "uint256"
      }
    ],
    "name": "remove_vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "prop_index",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "seconds_upper_bound",
        "type": "uint256"
      }
    ],
    "name": "second",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "ref_index",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "aye",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "vote_amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "conviction",
        "type": "uint256"
      }
    ],
    "name": "standard_vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "un_delegate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "target",
        "type": "address"
      }
    ],
    "name": "unlock",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "prop_index",
        "type": "uint256"
      }
    ],
    "name": "deposit_of",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "ref_index",
        "type": "uint256"
      }
    ],
    "name": "finished_referendum_info",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "lowest_unbaked",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "ref_index",
        "type": "uint256"
      }
    ],
    "name": "ongoing_referendum_info",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "public_prop_count",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

const togglePersonalInfo = () => {
  document.querySelector('#user-address').classList.toggle('hidden')
}

const toggleDaoSelect = () => {
  document.querySelector('#dao-options').classList.toggle('hidden')
}

const ongoingRefcolumns = [
  {
    title: 'prop_index',
    dataIndex: 'prop_index',
    key: 'prop_index',
    width: 110
  },
  {
    title: 'prop_hash',
    dataIndex: 'prop_hash',
    key: 'prop_hash',
  },
  {
    title: 'provider',
    dataIndex: 'provider',
    key: 'provider',
    width: 450
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <a>Vote {record.name}</a>
      </Space>
    ),
    width: 100,
    fixed: 'right',
  },
];

const getDaoList = async () => {
  const data = {
    "params": [
      "dao",
    ]
  }
  const res = await get_role_list(JSON.stringify(data))
  return res.data.result
}

const getOngoingRef = async () => {
  const res = await get_ongoing_ref()
  return res.data.data
}

const getPublicProposal = async () => {
  const res = await get_public_proposal()
  return res.data.data
}

const exportContractInMoonbeam = async () => {
  const web3Modal = new Web3Modal();
  const instance = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(instance);
  const signer = provider.getSigner();
  const Contract = new ethers.Contract(
    contractAddress,
    tokenJson,
    signer
  );
  return Contract;
}

export default function index(props) {
  const [infoByAddr, setInfoByAddr] = useStorage(`${props.location.query.address}`)
  const [tokenID, setTokenID] = useStorage("tokenID")
  const onlineUrl = 'https://faasbyleeduckgo.gigalixirapp.com/dynamic/soulcard'
  //const onlineUrl = "http://localhost:4000/dynamic/noncegeek_dao"
  const location  = useLocation()
  const [address,setAddress] = useState('')
  const [role,setRole] = useState('')
  const [daoList,setDaoList] = useState([])
  const [selectedDaoList,setSelectedDaoList] = useState([])
  const [ongoingList,setOngoingList] = useState([])
  const [propList,setPropList] = useState([])
  const [isDemocracy,setisDemocracy] = useState(false)
  const [selectDao,setSelectDao] = useState('Select your DAO')
  const [iframeSrcBasic,setIframeSrcBasic] = useState('')
  const [iframeSrc,setIframeSrc] = useState('')
  const [nftUrl,setnftUrl] = useState('https://arweave.net/n4FX-vDQ3au0qnMU2W_AxUwlfdiyxkpJ5bbp9LVh9Ww')
  const [tokenIDList,setTokenIdList] =useState([])
  const nftUrlChange = (event) => {
    const value = event.target.value
    setnftUrl(value)
  }
  useEffect(async () => {
    const addr = location.query.address
    const rol = location.query.role
    if (addr && rol) {
      setAddress(addr)
      setRole(rol)
      setIframeSrcBasic(`${onlineUrl}?addr=${addr}`)
      setIframeSrc(`${onlineUrl}?addr=${addr}`)
    } else {
      props.history.push("/")
    }
    // const tempDaos = [{addr:"0xC994B5384C0d0611De2ecE7d6fF1aD16C34A812F",name:"fsdf"}]
    const daos = await getDaoList()
    setDaoList(daos)
  }, [])
  useEffect(() => {
    setTokenIdList([...tokenIDList, tokenID])
  }, [tokenID])
  const mintNFT = async () => {
    const NFTContract = await exportContractInMoonbeam()
    await NFTContract.claim(infoByAddr.name,nftUrl)
    const tokenID = Number(await NFTContract._tokenIds()) + 2
    setTokenID(tokenID)
  }
  const second = async (prop_index) => {
    const web3Modal = new Web3Modal();
    const instance = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(instance);
    const signer = provider.getSigner();
    const democracyContract = new ethers.Contract(
      democracyAddress,
      democracyJson,
      signer
    );
    await democracyContract.second(prop_index, "4")
  }
  const propColumns = [
    {
      title: 'prop_index',
      dataIndex: 'prop_index',
      key: 'prop_index',
      width: 110
    },
    {
      title: 'preimage',
      dataIndex: 'preimage',
      key: 'preimage',
    },
    {
      title: 'provider',
      dataIndex: 'provider',
      key: 'provider',
      width: 450
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => {
            second(record.prop_index)
          }}>Second</a>
        </Space>
      ),
      width: 100,
      fixed: 'right',
    },
  ];

  const queryDemocracy = async () => {
    setisDemocracy(!isDemocracy)
    const ongoingList = await getOngoingRef()
    const propList = await getPublicProposal()
    setOngoingList(ongoingList)
    setPropList(propList)
  }
  
  const toogleDaos = (theDAO) => {
    const daoIndex = selectedDaoList.findIndex(dao => dao.name === theDAO.name)

    if (daoIndex === -1) {
      setSelectedDaoList(selectedDaoList.concat([
        {
          name: theDAO.name,
          addr: theDAO.addr,
          role: '',
        }
      ]))
      return
    }

    setSelectedDaoList(selectedDaoList.filter(dao => dao.name !== theDAO.name))
  }

  const onDaoAddrChange = (daoName, e) => {
    const daoIndex = selectedDaoList.findIndex(dao => dao.name === daoName)

    if (daoIndex > -1) {
      const tempDaoList = [...selectedDaoList]
      tempDaoList[daoIndex].role = e.target.value
      setSelectedDaoList(tempDaoList)
    }
  }

  const showIframe = () => {
    let iframeSrcTemp = iframeSrc

    for (let i = 0; i < selectedDaoList.length; i++) {
      const item = selectedDaoList[i]
      if(item.role!='')
        iframeSrcTemp += `&dao_addr_${i + 1}=${item.addr}&role_${i + 1}=${encodeURI(item.role)}`
      else
        iframeSrcTemp += `&dao_addr_${i + 1}=${item.addr}`
    }
    setIframeSrc(iframeSrcTemp)
  }

  return (
    // 根元素，保证至少占满页面宽高
    <div
      className='min-w-screen min-h-screen relative flex justify-center font-Inter text-sm'
    >
      {/* 背景元素，用于页面左侧/右侧空白区域和左/右侧栏的背景色相一致 */}
      <div className='absolute top-0 bottom-0 left-0 right-0 flex'>
        <div className='w-1/2 bg-home-l'></div>
        <div className='w-1/2 bg-home-r'></div>
      </div>
      {/* 内容区域 */}
      <div className='flex z-10 relative'>
        {/* 左侧栏 */}
        {/* TODO: 为什么边框宽度只是设置 border-r-2 的话无效
          必须设置 border-solid border-t-0 border-b-0 border-l-0 border-r-2 才行？ */}
        <div className='fixed h-screen py-7 px-3 bg-home-l flex flex-col justify-between border-solid border-t-0 border-b-0 border-l-0 border-r-2 border-green-l'>
          {/* 上半部分的 logo 和页面切换按钮 */}
          <div className='flex flex-col'>
            {/* logo */}
            <div className='flex flex-col items-center'>
              <img className='w-logo' src={logo} alt="logo" />
              <span className='mt-4 font-Audiowide origin-left inline-block scale-xs'>SoulCard</span>
            </div>
            {/* 切换页面的按钮 */}
            <div className='mt-12 grow flex flex-col items-center'>
              {/* 首页的图标 */}
              <img className='w-icon mb-7 cursor-pointer' src={homeActive} alt="home" />
              {/* 消息页的图标 */}
              <img className='w-icon mb-7 cursor-pointer' src={notice} alt="notice" />
              <img onClick={queryDemocracy} className='w-icon mb-7 cursor-pointer' src={isDemocracy ? voteActive : vote} alt="vote" />
            </div>
          </div>
          {/* 下半部分的人物头像 */}
          <div className='w-logo flex flex-col space-y-1'>
            <div id='user-address' className='hidden w-logo relative flex justify-center items-center'>
              <span className='absolute bottom-1 rounded p-2 bg-gray-500'>{address}</span>
            </div>
            <div className='avatar-wrapper flex flex-col items-center cursor-pointer' onClick={togglePersonalInfo}>
              <img className='w-icon' src={avatar} alt="edit" />
              <span className='mt-2 origin-left inline-block scale-xs'>Wade</span>
            </div>
          </div>
        </div>
        {/* 中间区域 */}
        <div className='ml-home-l w-home-m flex flex-col py-7 bg-home-m'>
          <div className='mx-auto w-home-mi'>
            {/* 个人标签的展示及编辑 */}
            <div className='flex items-center'>
              <img className='w-icon' src={add} alt="add" />
              <div className='ml-4 text-xl'>Keep up with your profile</div>
            </div>
            <div className='mt-5 flex flex-wrap'>
              {
                tags.map((text) => <Tag key={text} text={text} />)
              }
              <span className='py-1 text-gray-500'>Add More</span>
            </div>
            {/* 个人介绍 */}
            {/* 选择 DAO */}
            <div className='my-6 relative'>
              {/* 下拉菜单 */}
              <div
                onClick={toggleDaoSelect}
                className='w-full p-px flex items-center rounded-lg bg-gradient-to-r from-lg-green2-start to-lg-green2-end cursor-pointer'
              >
                <div className='w-full h-full rounded-lg bg-input p-3 text-gray-300 flex justify-between items-center'>
                  <span>{selectDao}</span>
                  <img className='w-2' src={arrowDown} alt="select" />
                </div>
              </div>
              {/* 下拉菜单选项 */}
              <div id="dao-options" className='absolute top-12 hidden rounded overflow-hidden border-solid border-green w-full bg-input cursor-pointer'>
                {daoList.map(item=>{
                  return (
                    <div className='w-full p-3 flex justify-between items-center hover:bg-namecard' key={item.addr} onClick={()=>{
                      toogleDaos(item)
                    }}>
                      <span>{item.name}</span>
                      {
                        (selectedDaoList.find(dao => dao.name === item.name)) && <svg t="1656517375155" className="w-4 h-4" viewBox="0 0 1024 1024" width="32" height="32"><path d="M384.119471 821.116243c-11.918447 0-23.837918-4.527107-32.936133-13.573133L77.629032 535.332405c-18.196431-18.107403-18.196431-47.456848 0-65.557088 18.196431-18.107403 47.674812-18.10024 65.871243-0.007163l240.619196 239.436254 495.173776-492.739331c18.196431-18.107403 47.674812-18.107403 65.871243 0 18.196431 18.10024 18.196431 47.449685 0 65.557088L417.055604 807.535947C407.956366 816.589137 396.037918 821.116243 384.119471 821.116243z" p-id="2195" fill="#7AD6A8"></path></svg>
                      }
                    </div>
                  )
                })}
              </div>
              {/* 输入 DAO 地址 */}
              <div>
                {
                  selectedDaoList.map(dao => {
                    return (
                      <div
                        className='mt-4'
                        key={dao.name}
                      >
                        <div className=''>{dao.name}: {dao.addr}</div>
                        <input
                          value={dao.role}
                          onChange={(value) => onDaoAddrChange(dao.name, value)}
                          placeholder='Please input address of this DAO'
                          className='mt-2 rounded-lg p-2 w-full bg-input border-0 outline-0 text-white font-Inter text-sm'>
                        </input>
                      </div>
                    )
                  })
                }
              </div>
            </div>
            <div
              className='w-3/4 mx-auto rounded-lg p-4 bg-gradient-to-r from-lg-green2-start to-lg-green2-end cursor-pointer'
              onClick={showIframe}
            >Submit</div>
            <div className='mt-8'>
              <iframe style={{ height: "500px", width: "800px" }} className='w-full border-0' allow="clipboard-write;" src={iframeSrc}></iframe>
            </div>
            {
              !isDemocracy ?
                <div>
                  {/* 按钮组 */}
                  <div className='mt-8 flex flex-col justify-center items-center space-y-4 font-Audiowide text-gray-900 text-rg'>
                    <div className='rounded-lg p-4 w-3/4 bg-gradient-to-r from-lg-green2-start to-lg-green2-end cursor-pointer' onClick={
                      () => {
                        open('https://arweave-uploader.surge.sh/?type=text/html')
                      }
                    }>Upload to Arewave</div>
                    {/* <div className='rounded-lg p-4 w-3/4 bg-gradient-to-r from-lg-green2-start to-lg-green2-end cursor-pointer'>Download Namecard as HTML/PNG</div> */}
                    <div className="p-2 w-3/4 text-gray-300 font-Inter text-sm">tokenURI(arweave link to your unchangeable SoulCard):</div>
                    <textarea
                      name="" id=""
                      value={nftUrl}
                      onChange={nftUrlChange}
                      placeholder='Please enter url for casting nft'
                      className='rounded-lg p-2 w-3/4 h-20 bg-input resize-none border-0 outline-0 text-white font-Inter text-sm'>
                    </textarea>
                    <div
                      className='rounded-lg p-4 w-3/4 bg-gradient-to-r from-lg-green2-start to-lg-green2-end cursor-pointer'
                      onClick={mintNFT}
                    >
                      Mint Namecard as NFT
                    </div>
                    <div className='rounded-lg p-4 w-3/4 bg-input text-white font-Inter text-sm'>
                      SoulCard Ids that need to approve by DAOL: [{
                        tokenIDList
                      }]</div>
                    <div
                      className='rounded-lg p-4 w-3/4 bg-gradient-to-r from-lg-green2-start to-lg-green2-end cursor-pointer'
                      onClick={() => {
                        open(`https://moonbeam.nftscan.com/search/${address}`)
                      }}
                    >
                      See all your NFTs on Moonbeam
                    </div>
                  </div>
                  {/* 分隔线 */}
                  <div className='mt-8 w-full border-solid border-t border-b-0 border-l-0 border-r-0 border-white'></div>
                  {/* 内容类型选择标签 */}
                  {/* TODO: 当前所选内容类型和其他的颜色不同，且有下边框 */}
                  <div className='sticky top-0 mt-2.5 bg-home-m flex space-x-16 justify-center text-nm'>
                    {
                      contentTypes.map((content) => <span key={content} className=''>{content}</span>)
                    }
                  </div>
                  {/* 文章卡片 */}
                  <ContentWrapper {...article} />
                  {/* 设计卡片 */}
                  <ContentWrapper {...design} />
                  {/* 代码卡片 */}
                  <ContentWrapper {...code} />
                </div> :
                <div>
                  <div className='mt-8 flex flex-col justify-center items-center space-y-4 font-Audiowide text-gray-900 text-rg'>
                    <div
                      className='rounded-lg p-4 w-3/4 bg-gradient-to-r from-lg-green2-start to-lg-green2-end cursor-pointer'
                    >
                      Referenda
                    </div>
                  </div>
                  <br />
                  <Table dataSource={ongoingList} columns={ongoingRefcolumns} scroll={{ x: 1500 }} />
                  <div className='mt-8 flex flex-col justify-center items-center space-y-4 font-Audiowide text-gray-900 text-rg'>
                    <div
                      className='rounded-lg p-4 w-3/4 bg-gradient-to-r from-lg-green2-start to-lg-green2-end cursor-pointer'
                    >
                      Proposals
                    </div>
                  </div>
                  <br />
                  <Table dataSource={propList} columns={propColumns} scroll={{ x: 1500 }} />
                </div>
            }
          </div>
        </div>
        {/* 右侧栏 */}
        <div className='w-home-r flex flex-col py-7 ml-8'>
          {/* 搜索栏 */}
          {/* TODO: Chrome 中点击 input 后会有白色边框
            Devtool 可以看到是 :focus-visible 状态下增加了 outline 属性 */}
          <div className='w-full h-8 p-px rounded-full bg-gradient-to-r from-lg-green2-start to-lg-green2-end'>
            <input type="text" className="w-full h-full rounded-full border-0 pl-4 bg-home-r text-white text-tg rounded-lg focus:ring-0 focus:border-0 focus:outline-0 focus-visible:outline-0" placeholder="Search"></input>
          </div>
          {/* 推荐标签 */}
          <div className='pt-7'>
            <div className='text-sm'>Recommended fields</div>
            <div className='pt-3 flex flex-wrap'>
              {
                recommendedFields.map((text) => <Tag key={text} text={text} />)
              }
            </div>
          </div>
          {/* 社交账号 */}
          <div className="mt-12">
            <div className='text-sm text-center'>Add Twitter, Instagram or GitHub and let more people connect to you</div>
            <div className="mt-5 mx-auto flex justify-center space-x-4 items-center">
              <img className='w-7' src={twitter} alt="twitter" />
              <img className='w-7' src={instgram} alt="instgram" />
              <img className='w-7' src={github} alt="github" />
            </div>
          </div>
          {/* 个人名片 */}
          <div className="mt-12">
            <div className="text-sm">Preview</div>
            <NameCard {...nameCardInfo} />
            <Resume {...resumeInfo} />
          </div>
        </div>
      </div>
    </div>
  )
}
