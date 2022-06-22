# A D V A I T A
The Matrix Reloaded

## Project commencement date: 2022-01



## Project Description

Users collect pulse wave data by wearing pulse diagnosis watches to quantify the physiological, psychological and emotional indicators of each cardiac cycle, and use gamified digital therapy to build a Web3.0 metaverse of health insurance, services and finance. Here, users discover unhealthy lifestyles by observing the relationship between each data and behavior, reshaping the future by optimizing their lifestyles, recording every moment of change in the metaverse, and reloading life Matrix in Advaita Metaverse. A D V A I T A is a project that combines wearables, gamified digital therapy and earning concepts into practice.

The WHO defines health broadly as: "Health is not merely the elimination of disease or infirmity, but a state of complete physical, mental and social health." In yogic philosophy there are four goals in life: moksha (enlightenment, liberation), Dharma (virtuous, righteous, moral life), Artha (material prosperity, income security, means of living) and Kama (pleasure, sensory and emotional satisfaction).The definition of health and the four goals of life make up the whole meaning of our life.  

However, due to the island effect of medical data, the lack of lifestyle medical systems and assessment tools, and the lack of methods to quantify psychology, we have almost zero physical and mental health data, and the only heart rate and blood pressure data can not directly reflect our health and mental state. As a result, our pursuit of health and life can only be qualitative, not quantitative.  

TCM(Traditional Chinese Medicine) pulse diagnosis can diagnose our physical, psychological and social adaptability, but TCM practitioners can only understand them but not quantify it. PPG sensor  can obtain heart rate, blood pressure and pulse wave data through luminous flux, but it cannot directly represent the health status.  

A D V A I T A integrates TCM  pulse diagnosis and PPG, and found a  physical and mental health scale - GCYY (golden centre of yinyang). Through GCYY, we quantitatively characterize our physical, psychological and social adaptation health status.  

Users can obtain continuous and dynamic heart rate, blood pressure, heart rate variability, pulse wave and body motion data by wearing a pulse diagnosis watch, and quantitatively integrate them with Weber-Fechner and Noether theorem. Each cardiac cycle gives a quantitative assessment of the comprehensive cardiovascular accommodation capacity (GCYY). The higher the GCYY, the better the cardiovascular regulation ability. Compared with blood pressure and heart rate, GCYY is more comprehensive and intuitive.  

GCYY represents the interaction between parameters and the integration of the studied parameters, and it also represents the psychology or emotion related to the studied parameters, which is equivalent to the consciousness level proposed by David R.Hawkins, but more precise. The higher the GCYY, the higher the level of consciousness, the lower the energy consumption of the target tissue, and the healthier the mind.  

60% of diseases are caused by an unbalanced lifestyle. GCYY can make a health evaluation at every heartbeat. By improving the unhealthy lifestyle, the GCYY index can be improved, along with the physical and mental health.  

A D V A I T A  is a Game-Fi digital therapy that focuses on changing lifestyles to improve GCYY. By participating in games, users can remove the causes that affect their health, improving GCYY, gaining physical and mental health, earning game rewards and accumulating health data.  

There are two ways to remove the cause of disease. The first is to directly remove the cause and recover to primary health, such as a cold; you can also improve the skill level to remove the energy consumption to maintain the cause, and upgrade to advanced health to become a superman defined by Nietzsche, such as Hawking.  

The game that removes the cause is to practice: the practice of [mindfull , knowing, sincerity, self-cultivation, family, and peace], the success of users in the A D V A I T A Metaverse also means the success of the physical world. It is a practice that users love but do not indulge, which answers the question of why customer want to come and stay in the metaverse.  

Health data can not only be used as one's own health files, but also can be shared through private computing, contributing to human health data, realizing subjective self-interest and objective altruism, and obtaining the honorary reward of the soul bounding certificate of the Metaverse.  

The parameters that are not linked during the linkage process in the pulse wave are called parameter holes. Through the correlation between parameter holes and diseases, a new artificial intelligence diagnosis system is realized.  

A D V A I T A provides data analysis services for parameter holes through private computing, and collects and labels data through community crowdsourcing according to the needs of data demanders, reducing the difficulty and cost of developing an artificial intelligence diagnostic system.  

With the token incentive system, community participants can enjoy the rewards after medical breakthroughs, and the token incentive system also solves the problem of starting funds for scientists to collect credible data. With more artificial intelligence diagnostic systems, it can also reduce the cost of research and development of new drugs and shorten the time to market.  

As AI diagnostic systems and digital therapeutics thrive in ADVAITA, a health metaverse of health insurance, services and finance has naturally formed.  

May all be happy and enjoy a life without suffering  
May all be happy and see the bright side of affairs  
May no one in the metaverse suffer from physical and mental suffering  
Everything is sweet as honey everything is sweet as honey  

Let the metaverse to have emotion and let web3.0 to have soul.  


## Planned to complete during the hackathon

**Blockchain side**

- `pallet-token`
  - [ ] Query balance function (`fn totalSupply()`)
  - [ ] Authorization function (`fn approve()`)
  - [ ] Transfer function (`fn transfer()`)
  - [ ] Transfer function (`fn transferFrom()`)


- `transfer contract`

  1. Data structure: used to ensure that a report can only receive a reward once

    `mapping(string => bool) public user_is_reward;`
    

  2. Transfer function:

    ERC20Token transfer function：`fn transferERC20()`
    Balance query function：`fn getBalance()`

**Client**

- hybrid (react-native)
  - [ ] User registration page
  - [ ] wallet Smart Contract Interaction(balance+transfer+record)
  - [ ] game interactive page


**Backstage**

- PHP and JAVA
  - [ ] TCM report uploaded to ipfs
  - [ ] TCM report result smart contract interaction
  - [ ] User profile
  - [ ] GCYY algorithm

## Things Done During the Hackathon (Submitted before the first trial on June 22)
  
Product demo video : https://i.2fei2.com/ADVAITA%20demo%206%E6%9C%8820%E6%97%A5.mp4  
Detailed PPT introduction(EN) : https://i.2fei2.com/ADVAITA-EN.pdf  
Detailed PPT introduction(CN) : https://i.2fei2.com/ADVAITA-CN.pdf  

## Team information

CEO : Savita Chen (Email:chenhongjun@advaita.world/Phone:+86 18928923035)  
Founder of Advaita, bachelor of International Trade of Xiamen University, master of Architectural Design of Tongji University. Architectural Designer, Fashion Designer and Product Manager.
Founder of Yoga clothing Samyama and Hari Om Tatsat. Tmall Double Eleven yoga clothing 2015-2018 sales champion three consecutive times.
Lecturer of Kashwa Holistic yoga philosophy. 2017 Innovation and Entrepreneurship Talents in Haizhu District, Guangzhou.

Chief Algorithm Scientist: Dr. Timon Chengyi Liu  
Inventor of I flow algorithm. He is a professor of South China Normal University, a doctoral supervisor of sports human science and a subject leader of the Pearl River Scholar position, a labor education instructor of Nanjing University, the vice chairman of the Guangdong Provincial Society of Physiology, and the vice chairman of the Blood Therapy and Engineering Branch of the Chinese Society of Biomedical Engineering. He has obtained a bachelor's degree in chemistry from Nanjing University, a master's degree in chemistry from Jilin University, a doctorate in laser technology from Huazhong University of Science and Technology, a postdoctoral fellow in biophotonics from South China Normal University, and a fellow of the American Society of Laser Medicine and Surgery. In 2002, Professor Liu joined the first-level provincial key discipline of Sports Science from the national key discipline of Optics, and established the only professional laboratory of laser sports medicine in my country. He has successively won five projects of the National Natural Science Foundation of China (including the Youth Fund Project), a team project of the Natural Science Foundation of Guangdong Province and a preliminary research project in the field of manned spaceflight.

Backend engineer : Casper (github:549539845@qq.com)  
System architect for 8 years, worked in blockchain Ethereum smart contract development, responsible for wallet, exchange, Dapp development, has 1 year development experience in Defi project.

Front-end engineer : Rui (github:woshilirui@hotmail.com)  
Work as a front-end engineer on a project,full stack developer. Rich experience in developing various projects. Starting transition to web3.

Smart contract : Icryfe (github:shiyivei@outlook.com)  
a blockchain development engineer with rich experience, is good at smart contract construction in various scenarios, full stack business logic implementation.

Game Designer & Visual Designer : Luck Wake  
Graduated from Guangzhou Academy of Fine Arts. 

Product manager : Zendo  
software product manager, graduated from Zhongkai University of Agriculture and Engineering, engaged in SaaS software product design.

Algorithm researcher : Fengwei HAO
South China Normal University,Undergraduate major in software engineering

Overseas operations : SADHU CHEN  
Madison USA Community Operations
