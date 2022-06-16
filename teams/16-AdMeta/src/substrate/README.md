# AdMeta
This is the AdMeta blockchain implementation.


## Overview

AdMeta is a Metaverse advertisement platform that focuses on privacy-preserving. AdMeta uses a TEE-based DID service to identify target groups for advertisers, and with the usage of TEE, AdMeta guarantees not to collect any user data. AdMeta builds multiple forms of ad assets (e.g. billboards, wall paintings) in Metaverse platforms like Decentraland, Bit.Country, to allow land holders to integrate our products easily. Qualified conversions let both users and publishers get rewards from advertisers. 

Unlike traditional ad platforms, who collect users sensitive data(e.g. location, browsing history) for advertising, AdMeta does not collect or store any user data per se. Instead, users voluntarily decide and control what data can be stored in TEE, and the stored data in TEE cannot be accessed by anyone except users themselves.

## Project Details

![AdMeta Demo - the floating billboard](https://user-images.githubusercontent.com/4738254/144754078-1877d8a5-8ef9-49ec-8ef5-f79496a689f0.png)

In the above image, the floating billboard is our [prototype ad component](https://github.com/AdMetaNetwork/admeta-decentraland) built with decentraland SDK. Users who registered on our blockchain, and switched "Ad Display" option on (by default it's off) are able to see a customized ad content on this billboard while gaming in decentraland.

The content of this ad component is selected according to user's personal data and preference. Unlike centralized ad platforms, we don't store user's data on or database. Instead, it's stored on the TEE layer of blockchain, and the target group matching and selecting happen also in the TEE layer, which ensures that no private data are exposed during the whole process. Eventually, both user and publisher receive some amount of token as rewards from advertiser.

Our blockchain is built with Substrate, and the pallet-ad provides the functionality of advertisement proposal, storage and governance. The user pallet will connect to TEE-based external identity aggregation and DID service provided by Litentry (we have already the initial cooperation plan) to match ads with users data and preference.

## Architecture

![AdMeta Architecture](https://raw.githubusercontent.com/h4n0/gists/master/admeta/admeta_architecture.svg)

**Advertisers** can propose an ad with certain acceptance rule, e.g. link clicking, and also advertiser provides how many times the ads are displayed and converted, and how much they pay for each conversion. They need to pay the total price (the number of conversions * price per conversion) while proposing the ad. Each ad display has a unique ID, which is generated while creating the proposal. A Merkle tree are built with all these unique IDs, and the root of Merkle tree will be stored in on-chain storage. A qualified conversion gives the participated user this UID, with which the user can claim for rewards.

**Councils** shall approve or reject ad proposals according to the content of ads. Also, advertisers are evaluated on their behavior democratically.

**Users** can switch on the "Ad Display" option on AdMeta, so that users can get rewards by viewing and interacting with ads. By default, this option is off, which means users who haven't set up their AdMeta won't see any ads. Users can also provide their data for a better ad matching, by means of this they will get more rewards.

**Publishers** can simply utilize our Ad Assets on any Metaverse platform and place it on their lands. Users also get rewards by a qualified display conversion.

## License
GPLv3
