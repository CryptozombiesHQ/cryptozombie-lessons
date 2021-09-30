---
title: Provedores Web3
actions: ['verificarResposta', 'dicas']
requireLogin: true
material:
  editor:
    language: html
    startingCode:
      "index.html": |
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <title>CryptoZombies front-end</title>
            <script language="javascript" type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
            <script language="javascript" type="text/javascript" src="web3.min.js"></script>
          </head>
          <body>

            <script>
              // Comece aqui
            </script>
          </body>
        </html>
      "zombieownership.sol": |
        pragma solidity ^0.4.19;

        import "./zombieattack.sol";
        import "./erc721.sol";
        import "./safemath.sol";

        contract ZombieOwnership is ZombieAttack, ERC721 {

          using SafeMath for uint256;

          mapping (uint => address) zombieApprovals;

          function balanceOf(address _owner) public view returns (uint256 _balance) {
            return ownerZombieCount[_owner];
          }

          function ownerOf(uint256 _tokenId) public view returns (address _owner) {
            return zombieToOwner[_tokenId];
          }

          function _transfer(address _from, address _to, uint256 _tokenId) private {
            ownerZombieCount[_to] = ownerZombieCount[_to].add(1);
            ownerZombieCount[msg.sender] = ownerZombieCount[msg.sender].sub(1);
            zombieToOwner[_tokenId] = _to;
            Transfer(_from, _to, _tokenId);
          }

          function transfer(address _to, uint256 _tokenId) public onlyOwnerOf(_tokenId) {
            _transfer(msg.sender, _to, _tokenId);
          }

          function approve(address _to, uint256 _tokenId) public onlyOwnerOf(_tokenId) {
            zombieApprovals[_tokenId] = _to;
            Approval(msg.sender, _to, _tokenId);
          }

          function takeOwnership(uint256 _tokenId) public {
            require(zombieApprovals[_tokenId] == msg.sender);
            address owner = ownerOf(_tokenId);
            _transfer(owner, msg.sender, _tokenId);
          }
        }
      "zombieattack.sol": |
        pragma solidity ^0.4.19;

        import "./zombiehelper.sol";

        contract ZombieAttack is ZombieHelper {
          uint randNonce = 0;
          uint attackVictoryProbability = 70;

          function randMod(uint _modulus) internal returns(uint) {
            randNonce++;
            return uint(keccak256(now, msg.sender, randNonce)) % _modulus;
          }

          function attack(uint _zombieId, uint _targetId) external onlyOwnerOf(_zombieId) {
            Zombie storage myZombie = zombies[_zombieId];
            Zombie storage enemyZombie = zombies[_targetId];
            uint rand = randMod(100);
            if (rand <= attackVictoryProbability) {
              myZombie.winCount++;
              myZombie.level++;
              enemyZombie.lossCount++;
              feedAndMultiply(_zombieId, enemyZombie.dna, "zombie");
            } else {
              myZombie.lossCount++;
              enemyZombie.winCount++;
              _triggerCooldown(myZombie);
            }
          }
        }
      "zombiehelper.sol": |
        pragma solidity ^0.4.19;

        import "./zombiefeeding.sol";

        contract ZombieHelper is ZombieFeeding {

          uint levelUpFee = 0.001 ether;

          modifier aboveLevel(uint _level, uint _zombieId) {
            require(zombies[_zombieId].level >= _level);
            _;
          }

          function withdraw() external onlyOwner {
            owner.transfer(this.balance);
          }

          function setLevelUpFee(uint _fee) external onlyOwner {
            levelUpFee = _fee;
          }

          function levelUp(uint _zombieId) external payable {
            require(msg.value == levelUpFee);
            zombies[_zombieId].level++;
          }

          function changeName(uint _zombieId, string _newName) external aboveLevel(2, _zombieId) onlyOwnerOf(_zombieId) {
            zombies[_zombieId].name = _newName;
          }

          function changeDna(uint _zombieId, uint _newDna) external aboveLevel(20, _zombieId) onlyOwnerOf(_zombieId) {
            zombies[_zombieId].dna = _newDna;
          }

          function getZombiesByOwner(address _owner) external view returns(uint[]) {
            uint[] memory result = new uint[](ownerZombieCount[_owner]);
            uint counter = 0;
            for (uint i = 0; i < zombies.length; i++) {
              if (zombieToOwner[i] == _owner) {
                result[counter] = i;
                counter++;
              }
            }
            return result;
          }

        }
      "zombiefeeding.sol": |
        pragma solidity ^0.4.19;

        import "./zombiefactory.sol";

        contract KittyInterface {
          function getKitty(uint256 _id) external view returns (
            bool isGestating,
            bool isReady,
            uint256 cooldownIndex,
            uint256 nextActionAt,
            uint256 siringWithId,
            uint256 birthTime,
            uint256 matronId,
            uint256 sireId,
            uint256 generation,
            uint256 genes
          );
        }

        contract ZombieFeeding is ZombieFactory {

          KittyInterface kittyContract;

          modifier onlyOwnerOf(uint _zombieId) {
            require(msg.sender == zombieToOwner[_zombieId]);
            _;
          }

          function setKittyContractAddress(address _address) external onlyOwner {
            kittyContract = KittyInterface(_address);
          }

          function _triggerCooldown(Zombie storage _zombie) internal {
            _zombie.readyTime = uint32(now + cooldownTime);
          }

          function _isReady(Zombie storage _zombie) internal view returns (bool) {
              return (_zombie.readyTime <= now);
          }

          function feedAndMultiply(uint _zombieId, uint _targetDna, string _species) internal onlyOwnerOf(_zombieId) {
            Zombie storage myZombie = zombies[_zombieId];
            require(_isReady(myZombie));
            _targetDna = _targetDna % dnaModulus;
            uint newDna = (myZombie.dna + _targetDna) / 2;
            if (keccak256(_species) == keccak256("kitty")) {
              newDna = newDna - newDna % 100 + 99;
            }
            _createZombie("NoName", newDna);
            _triggerCooldown(myZombie);
          }

          function feedOnKitty(uint _zombieId, uint _kittyId) public {
            uint kittyDna;
            (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId);
            feedAndMultiply(_zombieId, kittyDna, "kitty");
          }
        }
      "zombiefactory.sol": |
        pragma solidity ^0.4.19;

        import "./ownable.sol";
        import "./safemath.sol";

        contract ZombieFactory is Ownable {

          using SafeMath for uint256;

          event NewZombie(uint zombieId, string name, uint dna);

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;
          uint cooldownTime = 1 days;

          struct Zombie {
            string name;
            uint dna;
            uint32 level;
            uint32 readyTime;
            uint16 winCount;
            uint16 lossCount;
          }

          Zombie[] public zombies;

          mapping (uint => address) public zombieToOwner;
          mapping (address => uint) ownerZombieCount;

          function _createZombie(string _name, uint _dna) internal {
            uint id = zombies.push(Zombie(_name, _dna, 1, uint32(now + cooldownTime), 0, 0)) - 1;
            zombieToOwner[id] = msg.sender;
            ownerZombieCount[msg.sender]++;
            NewZombie(id, _name, _dna);
          }

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
            uint rand = uint(keccak256(_str));
            return rand % dnaModulus;
          }

          function createPseudoRandomZombie(string _name) public {
            require(ownerZombieCount[msg.sender] == 0);
            uint randDna = _generatePseudoRandomDna(_name);
            randDna = randDna - randDna % 100;
            _createZombie(_name, randDna);
          }

        }
      "ownable.sol": |
        /**
         * @title Ownable
         * @dev The Ownable contract has an owner address, and provides basic authorization control
         * functions, this simplifies the implementation of "user permissions".
         */
        contract Ownable {
          address public owner;

          event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

          /**
           * @dev The Ownable constructor sets the original `owner` of the contract to the sender
           * account.
           */
          function Ownable() public {
            owner = msg.sender;
          }


          /**
           * @dev Throws if called by any account other than the owner.
           */
          modifier onlyOwner() {
            require(msg.sender == owner);
            _;
          }


          /**
           * @dev Allows the current owner to transfer control of the contract to a newOwner.
           * @param newOwner The address to transfer ownership to.
           */
          function transferOwnership(address newOwner) public onlyOwner {
            require(newOwner != address(0));
            OwnershipTransferred(owner, newOwner);
            owner = newOwner;
          }

        }
      "safemath.sol": |
        pragma solidity ^0.4.18;

        /**
         * @title SafeMath
         * @dev Math operations with safety checks that throw on error
         */
        library SafeMath {

          /**
          * @dev Multiplies two numbers, throws on overflow.
          */
          function mul(uint256 a, uint256 b) internal pure returns (uint256) {
            if (a == 0) {
              return 0;
            }
            uint256 c = a * b;
            assert(c / a == b);
            return c;
          }

          /**
          * @dev Integer division of two numbers, truncating the quotient.
          */
          function div(uint256 a, uint256 b) internal pure returns (uint256) {
            // assert(b > 0); // Solidity automatically throws when dividing by 0
            uint256 c = a / b;
            // assert(a == b * c + a % b); // There is no case in which this doesn't hold
            return c;
          }

          /**
          * @dev Subtracts two numbers, throws on overflow (i.e. if subtrahend is greater than minuend).
          */
          function sub(uint256 a, uint256 b) internal pure returns (uint256) {
            assert(b <= a);
            return a - b;
          }

          /**
          * @dev Adds two numbers, throws on overflow.
          */
          function add(uint256 a, uint256 b) internal pure returns (uint256) {
            uint256 c = a + b;
            assert(c >= a);
            return c;
          }
        }
      "erc721.sol": |
        contract ERC721 {
          event Transfer(address indexed _from, address indexed _to, uint256 _tokenId);
          event Approval(address indexed _owner, address indexed _approved, uint256 _tokenId);

          function balanceOf(address _owner) public view returns (uint256 _balance);
          function ownerOf(uint256 _tokenId) public view returns (address _owner);
          function transfer(address _to, uint256 _tokenId) public;
          function approve(address _to, uint256 _tokenId) public;
          function takeOwnership(uint256 _tokenId) public;
        }
    answer: |
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>CryptoZombies front-end</title>
          <script language="javascript" type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
          <script language="javascript" type="text/javascript" src="web3.min.js"></script>
        </head>
        <body>

          <script>
            window.addEventListener('load', function() {

            // Verificando se o Web3 foi injetado pelo navegador (Mist/MetaMask)
            if (typeof web3 !== 'undefined') {
              // Use o provedor de Mist/MetaMask
              web3js = new Web3(web3.currentProvider);
            } else {
              // Caso o usuário não tem web3. Provavelmente
              // mostre a ele uma mensagem dizendo-lhe para instalar o Metamask
              // afim de usar nosso aplicativo.
            }

            // Agora você pode iniciar seu aplicativo e acessar o web3js livremente:
            startApp()

          })
          </script>
        </body>
      </html>
---

Ótimo! Agora que temos o Web3.js em nosso projeto, vamos inicializá-lo e conversar com o blockchain.

A primeira coisa que precisamos é de um **_Web3 Provider_**.

Lembre-se, o Ethereum é composto de **_nodes_** (nós) que compartilham uma cópia dos mesmos dados. Definir um provedor Web3 em Web3.js informa ao nosso código **em que nó** devemos falar para lidar com nossas leituras e escritas. É como definir a URL do servidor da Web remoto para suas chamadas de API em um aplicativo da web tradicional.

Você poderia hospedar seu próprio nó Ethereum como um provedor. No entanto, há um serviço de terceiros que facilita a sua vida, para que você não precise manter seu próprio nó Ethereum para fornecer um DApp para seus usuários — **_Infura_**.

## Infura

<a href="https://infura.io/" target=_blank>Infura</a> é um serviço que mantém um conjunto de nós do Ethereum com uma camada de cache para leituras rápidas, que você pode acessar gratuitamente por meio de sua API. Usando o Infura como um provedor, você pode enviar e receber mensagens de forma confiável de/para o blockchain Ethereum sem precisar configurar e manter seu próprio nó.

Você pode configurar o Web3 para usar o Infura como seu provedor web3 da seguinte forma:

```
var web3 = new Web3(new Web3.providers.WebsocketProvider("wss://mainnet.infura.io/ws"));
```

No entanto, como o DApp será usado por muitos usuários — e esses usuários vão GRAVAR no blockchain e não apenas para ler — precisaremos de uma maneira para que esses usuários possam assinar as transações com sua chave privada.

> Nota: Ethereum (e blockchains em geral) usam um par de chaves pública / privada para assinar transações digitalmente. Pense nisso como uma senha extremamente segura para uma assinatura digital. Dessa forma, se eu alterar alguns dados no blockchain, posso **provar** através da minha chave pública que fui eu quem o assinou — mas, como ninguém conhece minha chave privada, ninguém pode forjar uma transação para mim.

A criptografia é complicada, portanto, a menos que você seja um especialista em segurança e realmente saiba o que está fazendo, provavelmente não é uma boa ideia tentar gerenciar as chaves privadas dos usuários no front-end de nosso aplicativo.

Mas, felizmente, você não precisa — já existem serviços que lidam com isso para você. O mais popular deles é **_Metamask_**.

## Metamask

<a href="https://metamask.io/" target=_blank>Metamask</a> é uma extensão de navegador para o Chrome e Firefox que permite aos usuários gerenciar com segurança suas contas e chaves privadas Ethereum e usar essas contas para interagir com sites que usam o Web3.js. (Se você não usou antes, você definitivamente vai querer instalá-lo — então seu navegador está habilitado para Web3 e agora você pode interagir com qualquer site que se comunique com o blockchain Ethereum!).

E como desenvolvedor, se você quer que os usuários interajam com o seu DApp através de um site em seu navegador (como estamos fazendo com o nosso jogo CryptoZombies), você definitivamente vai querer torná-lo compatível com o Metamask.

> **Note**: O Metamask usa os servidores da Infura por baixo dos panos como um provedor web3, assim como fizemos acima — mas também dá ao usuário a opção de escolher seu próprio provedor web3. Então, usando o provedor web3 do Metamask, você está dando ao usuário uma opção, e é uma coisa a menos com a qual você precisa se preocupar em seu aplicativo.

## Usando o web3 do Metamask's

O Metamask injeta seu provedor web3 no navegador no objeto global JavaScript `web3`. Portanto, seu aplicativo pode verificar se o `web3` existe e se ele usa `web3.currentProvider` como seu provedor.

Aqui está um código de modelo fornecido pelo Metamask para saber como podemos detectar para ver se o usuário tem o Metamask instalado e, caso contrário, para informá-lo de que precisará instalá-lo para usar nosso aplicativo:

```
window.addEventListener('load', function() {

  // Verificando se o Web3 foi injetado pelo navegador (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    // Use o provedor de Mist/MetaMask
    web3js = new Web3(web3.currentProvider);
  } else {
    // Caso o usuário não tem web3. Provavelmente
    // mostre a ele uma mensagem dizendo-lhe para instalar o Metamask
    // afim de usar nosso aplicativo.
  }

  // Agora você pode iniciar seu aplicativo e acessar o web3js livremente:
  startApp()

})
```

Você pode usar esse código pronto em todos os aplicativos criados para exigir que os usuários tenham o Metamask para usar seu DApp.

> Note: Existem outros programas de gerenciamento de chaves privadas que seus usuários podem usar além da MetaMask, como o navegador da Web **Mist**. No entanto, todos eles implementam um padrão comum de injeção da variável `web3`, então o método que descrevemos aqui para detectar o provedor web3 do usuário também funcionará para eles.

## Vamos testar

Criamos algumas tags de script vazias antes da tag de fechamento `</body>` em nosso arquivo HTML. Podemos escrever o nosso código JavaScript para esta lição aqui.

1. Vá em frente e copie/cole o código do modelo acima para detectar o Metamask. É o bloco que começa com o `window.addEventListener`.
