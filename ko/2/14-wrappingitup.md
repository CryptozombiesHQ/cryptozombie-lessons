---
title: 마무리하기 Wrapping It Up
actions: ['정답 확인하기', '힌트 보기']
material:
  saveZombie: true
  zombieBattle:
    zombie:
      lesson: 1
    humanBattle: false
    hideSliders: true
    answer: 1
---

그게 전부네. 레슨 2를 완료했네! 

코드가 작동하는지 오른편에서 데모를 확인해 볼 수 있네. 자네가 얼른 이 페이지 하단으로 가고 싶어한다는 걸 아네 😉. 고양이를 클릭해서 공격하고 나서 새로운 고양이 좀비가 어떤지 보게! 

## 자바스크립트를 활용한 구현

우리 컨트랙트를 이더리움에 구축할 준비가 되면 `ZombieFeeding` 컨트랙트만 컴파일해서 구축하면 될 것일세. 왜냐면 이 컨트랙트가 `ZombieFactory`를 상속하는 우리의 마지막 컨트랙트이고 두 컨트랙트에 있는 public 메소드를 모두 접근할 수 있기 때문이지.

자바스크립트와 web3.js를 활용하여 우리의 컨트랙트와 상호작용하는 예시를 살펴 보도록 하지: 

```
var abi = /* abi generated by the compiler */
var ZombieFeedingContract = web3.eth.contract(abi)
var contractAddress = /* our contract address on Ethereum after deploying */
var ZombieFeeding = ZombieFeedingContract.at(contractAddress)

// 우리 좀비의 ID와 타겟 고양이 ID를 가지고 있다고 가정하면 
let zombieId = 1;
let kittyId = 1;

// 크립토키티의 이미지를 얻기 위해 웹 API에 쿼리를 할 필요가 있다. 
// 이 정보는 블록체인이 아닌 크립토키티 웹 서버에 저장되어 있다.
// 모든 것이 블록체인에 저장되어 있으면 서버가 다운되거나 크립토키티 API가 바뀌는 것이나 
// 크립토키티 회사가 크립토좀비를 싫어해서 고양이 이미지를 로딩하는 걸 막는 등을 걱정할 필요가 없다 ;) 
let apiUrl = "https://api.cryptokitties.co/kitties/" + kittyId
$.get(apiUrl, function(data) {
  let imgUrl = data.image_url
  // 이미지를 제시하기 위해 무언가를 한다 
})

// 유저가 고양이를 클릭할 때:
$(".kittyImage").click(function(e) {
  // 우리 컨트랙트의 `feedOnKitty` 메소드를 호출한다 
  ZombieFeeding.feedOnKitty(zombieId, kittyId)
})

// 우리의 컨트랙트에서 발생 가능한 NewZombie 이벤트에 귀를 기울여서 이벤트 발생 시 이벤트를 제시할 수 있도록 한다: 
ZombieFactory.NewZombie(function(error, result) {
  if (error) return
  // 이 함수는 좀비를 당신에게 보여줍니다 (마치 레슨 1의 마지막처럼!): 
  generateZombie(result.zombieId, result.name, result.dna)
})
```

# 직접 해보기!

좀비에게 먹일 고양이를 선택해 보게. 자네 좀비의 DNA와 고양이의 DNA가 조합되어 새로운 좀비를 얻을 수 있을 거네! 

자네의 새로운 좀비가 귀여운 고양이 다리를 가진 게 보이나? 저게 바로 DNA의 마지막 2자리 `99`가 작동하고 있다는 증거지. 😉

원하면 다시 시작해서 좀비에게 고양이를 먹여 보게. 자네 마음에 드는 고양이좀비를 얻으면 (한 마리만 가질 수 있네) 다음 챕터로 이동해서 레슨 2를 완료하게! 