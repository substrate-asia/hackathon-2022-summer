## Basic Infomation

Project: Melody

Start Date：2022/06

## Overview
- Background
  
  Nowadays Nft Markets are based in jpg, but lack of sound or music Nfts.

  Music spend more time in leisure time, but lack of intellectual ownership.

  Nft can be much more multi-media.

- Introduction

  Step:
  1. A basic nft and market place (50%)
  2. Mint and breed music with jpg, enable crowdfund, encourage secondary creation
  3. dao token to govern and motivate sharing
  4. Develop a algorithm to check duplication, comfirmation copyright
  5. Develop a encrypted method, to play music with certification

- Architecture
  
  backend: 
  1. pallet-melody: a music market place
  2. pallet-music: a music nft base

  fronend:
  1. market place

## Done during hackathon

With 3 days coding, we only create a simple NFT and market place
Work:
- read uniques pallet and other nft project
- music nft pallet that can create collection and items, `mint`, `transfer` and add outer properties and resources
- melody marketplace pallet that can `list` nfts and `buy` nfts 
- test in polkadot.js and connect frontend with substrate pallets
- marketplace and personal page, a order matching backend are much to be done 
  


**Blockchain**

- `pallet-music`
  - [ ] collection creation (`fn create_collections()`)
  - [ ] music nft mint (`fn mint_nft()`)
  - [ ] music nft mint (`fn burn_nft()`)
  - [ ] music trasfer (`fn send()`)
  - [ ] add outer resource (`fn add_basic_resource()`)
  
  TODO：
  - [ ] mix music with jpeg (`fn bounded_jpeg()`)
  - [ ] secodary creation (`fn create_children()`)

- `pallet-melody`
  - [ ] list nfts (`fn list_nft()`)
  - [ ] buy nfts(`fn buy_nft()`)
  - [ ] make offer (`fn make_offer()`)
  - [ ] accept offer (`fn accept_offer()`)
  
  TODO：
  - [ ] crowdfund (`fn crowdfund()`)
  - [ ] share links (`fn share_links()`)

**Web Client**

- web
  - [ ] substrate-fronend-template
  - [ ] melody market place list
  - [ ] melody market buy nfts


## Other infomation

github: https://github.com/skyh24/Hackathon-DOT

docs: https://docs.google.com/presentation/d/1gk9jJAYNp0nq0zw7rwagsEPgSUzj3nsagvWhuVXFaP4/edit?usp=sharing

presentation: ./docs/presentation.mp4

demo: ./docs/domo.mp4

## Team

Skyhigh (github: skyh24)

Rui Li (github: gittruili)

Lora
