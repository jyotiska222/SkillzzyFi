// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.0;
// import "@openzeppelin/contracts/utils/Strings.sol";

// contract DynamicSkillMarket {
//     struct Content {
//         uint256 id;
//         address creator;
//         string title;
//         string description;
//         string ipfsHash;
//         string thumbHash;
//         string duration;
//         string category;
//         uint256 basePrice;
//         uint256 currentPrice;
//         uint256 purchaseCount;
//         address[] buyers;
//         bool isCompleted;
//     } 
//     struct DContent { uint256 id; string title; string description; uint256 upvotes; }
//     struct Noti { address sender; address receiver; string message; string topic; }

//     Content[] public contents;
//     DContent[] public dcontents;
//     mapping(address => uint256) public balances;
//     uint256 public platformVolume;
//     mapping(address => Content[]) public ownerContents;
//     mapping(address => bool) public isSet;
//     mapping(address => string) public avatars;
//     mapping(address => Noti[]) public ownerNoties;
//     mapping(address => mapping(uint256 => bool)) public isUpvoted; 
//     mapping(address => mapping(uint256 => bool)) public accessMap;

//     uint256 public constant PRICE_ADJUSTMENT_RATE = 5; 
//     uint256 public constant VOLUME_SENSITIVITY = 1000; 
    
//     event ContentUploaded(uint256 contentId, address creator, uint256 price);
//     event ContentPurchased(uint256 contentId, address buyer, uint256 pricePaid);
//     event PriceAdjusted(uint256 contentId, uint256 newPrice); 
//     event CompletionConfirmed(uint256 contentId, address confirmedBy);
//     event GotCoins(address indexed user, uint256 amount, string _msg);
    
//     function deposit() external payable { balances[msg.sender] += msg.value; }

//     function uploadContent(
//         string memory _title,
//         string memory _ipfsHash,
//         string memory _thumbHash,
//         string memory _duration,
//         string memory _category,
//         uint256 _basePrice
//     ) external {
//         uint256 initialPrice = calculateDynamicPrice(_basePrice);
//         uint256 n = contents.length;
//         contents.push(Content({
//             id:n, creator:msg.sender, title:_title, description:"", ipfsHash:_ipfsHash,
//             thumbHash:_thumbHash, duration:_duration, category:_category,
//             basePrice:_basePrice, currentPrice:initialPrice, purchaseCount:0,
//             buyers: new address[](0) , isCompleted:false
//         }));
//         ownerContents[msg.sender].push(contents[n]);
//         accessMap[msg.sender][n] = true;
//         _reward(msg.sender, initialPrice/3, "coins received by uploading");
//         emit ContentUploaded(n, msg.sender, initialPrice);
//     }
    
//     function contentExchng(uint256 _c1,uint256 _c2) external {
//         require(contents[_c2].creator==msg.sender,"Not your content");
//         _createNoti(contents[_c1].creator,
//             string(abi.encodePacked(Strings.toHexString(uint160(msg.sender),20),
//             "wants to exchange: ",contents[_c1].title," with ",contents[_c2].title)),
//             "Exchange");
//     }
//     function confirmExcng(uint256 _c1,uint256 _c2,address _sender)external {
//         contents[_c1].buyers.push(msg.sender);
//         contents[_c2].buyers.push(_sender);
//         contents[_c1].purchaseCount++;
//         contents[_c2].purchaseCount++;
//         accessMap[msg.sender][_c1] = true;
//         accessMap[_sender][_c2] = true;
//         _reward(msg.sender,5,"5 points received by exchanging");
//         _reward(_sender,5,"5 points received by exchanging");
//         _createNoti(_sender,"Exchange successful","Exchange");
//     }
//     function calculateDynamicPrice(uint256 basePrice) internal view returns (uint256) {
//         return basePrice + platformVolume / VOLUME_SENSITIVITY;
//     }
    
//     function getPurchContent(address _buyer) external view returns (Content[] memory){
//         uint n=contents.length; uint count;
//         for(uint i=0;i<n;i++) if(isBuyer(_buyer,i)) count++;
//         Content[] memory purContents=new Content[](count); uint idx;
//         for(uint i=0;i<n;i++) if(isBuyer(_buyer,i)) purContents[idx++]=contents[i];
//         return purContents;
//     }
    
//     function purchaseContent(uint256 _id) external {
//         Content storage c=contents[_id];
//         require(balances[msg.sender]>=c.currentPrice,"Insufficient Points");
//         balances[msg.sender]-=c.currentPrice;
//         platformVolume+=c.currentPrice;
//         c.buyers.push(msg.sender); c.purchaseCount++;
//         uint old=c.currentPrice;
//         c.currentPrice=old+(old*PRICE_ADJUSTMENT_RATE)/100;
//         _createNoti(c.creator,string(abi.encodePacked(Strings.toHexString(uint160(msg.sender),20)," purchased: ",c.title)),"Purchase");
//         accessMap[msg.sender][_id]=true;
//         confirmCompletion(_id);
//         emit ContentPurchased(_id,msg.sender,old);
//         emit PriceAdjusted(_id,c.currentPrice);
//     }
//     function confirmCompletion(uint256 _id) internal {
//         Content storage c=contents[_id];
//         if(!c.isCompleted){ c.isCompleted=true; balances[c.creator]+=c.currentPrice*c.buyers.length; }
//         emit CompletionConfirmed(_id,msg.sender);
//     }
//     function isBuyer(address u,uint256 _id) internal view returns(bool){
//         address[] storage b=contents[_id].buyers;
//         for(uint i=0;i<b.length;i++) if(b[i]==u) return true;
//         return false;
//     }
//     function hasAccess(uint256 _id) external view returns (bool) {
//         return (msg.sender==contents[_id].creator || isBuyer(msg.sender,_id));
//     }
//     function getAllContents() external view returns (Content[] memory) { return contents; }
//     function getBalance() external view returns (uint) { return balances[msg.sender]; }
//     function getAvatar() external view returns(string memory){ return avatars[msg.sender]; }
//     function setAvatar(string memory _cid) external{ avatars[msg.sender]=_cid; }
//     function getNoties() external view returns(Noti[] memory){ return ownerNoties[msg.sender]; }
//     function getFstBal() external { require(!isSet[msg.sender],"Already claimed"); balances[msg.sender]+=50; isSet[msg.sender]=true; }
//     function uploadDContent(string memory _t,string memory _d)external{
//         uint n=dcontents.length;
//         dcontents.push(DContent({id:n,title:_t,description:_d,upvotes:0}));
//         _reward(msg.sender,1,"coins get by demanding");
//     }
//     function upvote(uint256 _id) external{
//         require(!isUpvoted[msg.sender][_id],"Already upvoted");
//         dcontents[_id].upvotes++; isUpvoted[msg.sender][_id]=true;
//         _reward(msg.sender,1,"coins get by upvoting");
//     }
//     function getDContents() external view returns(DContent[] memory){ return dcontents; }

//     function _createNoti(address _r,string memory _m,string memory _t) internal {
//         ownerNoties[_r].push(Noti({sender:msg.sender,receiver:_r,message:_m,topic:_t}));
//     }
//     function _reward(address u,uint amt,string memory m) internal {
//         balances[u]+=amt; emit GotCoins(u,amt,m);
//     }
// }
