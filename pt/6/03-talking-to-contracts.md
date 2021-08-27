---
title: Conversando com Contratos
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
            <!-- 1. Inclua o aquivo cryptozombies_abi.js aqui -->
          </head>
          <body>

            <script>
              // 2. Comece aqui

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
      "cryptozombies_abi.js": |
        var cryptoZombiesABI = [
          {
            "constant": false,
            "inputs": [
              {
                "name": "_to",
                "type": "address"
              },
              {
                "name": "_tokenId",
                "type": "uint256"
              }
            ],
            "name": "approve",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "constant": false,
            "inputs": [
              {
                "name": "_zombieId",
                "type": "uint256"
              }
            ],
            "name": "levelUp",
            "outputs": [],
            "payable": true,
            "stateMutability": "payable",
            "type": "function"
          },
          {
            "constant": false,
            "inputs": [
              {
                "name": "_zombieId",
                "type": "uint256"
              },
              {
                "name": "_kittyId",
                "type": "uint256"
              }
            ],
            "name": "feedOnKitty",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "constant": true,
            "inputs": [
              {
                "name": "",
                "type": "uint256"
              }
            ],
            "name": "zombies",
            "outputs": [
              {
                "name": "name",
                "type": "string"
              },
              {
                "name": "dna",
                "type": "uint256"
              },
              {
                "name": "level",
                "type": "uint32"
              },
              {
                "name": "readyTime",
                "type": "uint32"
              },
              {
                "name": "winCount",
                "type": "uint16"
              },
              {
                "name": "lossCount",
                "type": "uint16"
              }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
          },
          {
            "constant": false,
            "inputs": [],
            "name": "withdraw",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "constant": true,
            "inputs": [
              {
                "name": "_owner",
                "type": "address"
              }
            ],
            "name": "getZombiesByOwner",
            "outputs": [
              {
                "name": "",
                "type": "uint256[]"
              }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
          },
          {
            "constant": true,
            "inputs": [
              {
                "name": "",
                "type": "uint256"
              }
            ],
            "name": "zombieToOwner",
            "outputs": [
              {
                "name": "",
                "type": "address"
              }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
          },
          {
            "constant": false,
            "inputs": [
              {
                "name": "_address",
                "type": "address"
              }
            ],
            "name": "setKittyContractAddress",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "constant": false,
            "inputs": [
              {
                "name": "_zombieId",
                "type": "uint256"
              },
              {
                "name": "_newDna",
                "type": "uint256"
              }
            ],
            "name": "changeDna",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "constant": true,
            "inputs": [
              {
                "name": "_tokenId",
                "type": "uint256"
              }
            ],
            "name": "ownerOf",
            "outputs": [
              {
                "name": "_owner",
                "type": "address"
              }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
          },
          {
            "constant": true,
            "inputs": [
              {
                "name": "_owner",
                "type": "address"
              }
            ],
            "name": "balanceOf",
            "outputs": [
              {
                "name": "_balance",
                "type": "uint256"
              }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
          },
          {
            "constant": false,
            "inputs": [
              {
                "name": "_name",
                "type": "string"
              }
            ],
            "name": "createPseudoRandomZombie",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "constant": true,
            "inputs": [],
            "name": "owner",
            "outputs": [
              {
                "name": "",
                "type": "address"
              }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
          },
          {
            "constant": false,
            "inputs": [
              {
                "name": "_to",
                "type": "address"
              },
              {
                "name": "_tokenId",
                "type": "uint256"
              }
            ],
            "name": "transfer",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "constant": true,
            "inputs": [],
            "name": "getAllZombies",
            "outputs": [
              {
                "name": "",
                "type": "uint256[]"
              }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
          },
          {
            "constant": false,
            "inputs": [
              {
                "name": "_tokenId",
                "type": "uint256"
              }
            ],
            "name": "takeOwnership",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "constant": false,
            "inputs": [
              {
                "name": "_zombieId",
                "type": "uint256"
              },
              {
                "name": "_newName",
                "type": "string"
              }
            ],
            "name": "changeName",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "constant": false,
            "inputs": [
              {
                "name": "_fee",
                "type": "uint256"
              }
            ],
            "name": "setLevelUpFee",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "constant": false,
            "inputs": [
              {
                "name": "_zombieId",
                "type": "uint256"
              },
              {
                "name": "_targetId",
                "type": "uint256"
              }
            ],
            "name": "attack",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "constant": false,
            "inputs": [
              {
                "name": "newOwner",
                "type": "address"
              }
            ],
            "name": "transferOwnership",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "name": "_from",
                "type": "address"
              },
              {
                "indexed": true,
                "name": "_to",
                "type": "address"
              },
              {
                "indexed": false,
                "name": "_tokenId",
                "type": "uint256"
              }
            ],
            "name": "Transfer",
            "type": "event"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "name": "_owner",
                "type": "address"
              },
              {
                "indexed": true,
                "name": "_approved",
                "type": "address"
              },
              {
                "indexed": false,
                "name": "_tokenId",
                "type": "uint256"
              }
            ],
            "name": "Approval",
            "type": "event"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "name": "attackResult",
                "type": "bool"
              },
              {
                "indexed": false,
                "name": "winCount",
                "type": "uint16"
              },
              {
                "indexed": false,
                "name": "lossCount",
                "type": "uint16"
              }
            ],
            "name": "AttackResult",
            "type": "event"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "name": "zombieId",
                "type": "uint256"
              },
              {
                "indexed": false,
                "name": "name",
                "type": "string"
              },
              {
                "indexed": false,
                "name": "dna",
                "type": "uint256"
              }
            ],
            "name": "NewZombie",
            "type": "event"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "name": "previousOwner",
                "type": "address"
              },
              {
                "indexed": true,
                "name": "newOwner",
                "type": "address"
              }
            ],
            "name": "OwnershipTransferred",
            "type": "event"
          }
        ]
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
          <script language="javascript" type="text/javascript" src="cryptozombies_abi.js"></script>
        </head>
        <body>

          <script>
            var cryptoZombies;

            function startApp() {
              var cryptoZombiesAddress = "YOUR_CONTRACT_ADDRESS";
              cryptoZombies = new web3js.eth.Contract(cryptoZombiesABI, cryptoZombiesAddress);
            }

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

Agora que inicializamos o Web3.js com o provedor Web3 da MetaMask, vamos configurá-lo para conversar com nosso smart contract.

O Web3.js precisará de duas coisas para conversar com seu contrato: o **_endereço_** e o **_ABI_**.

## Endereço do contrato

Depois de terminar de escrever seu smart contract, você irá compilá-lo e implantá-lo no Ethereum. Vamos abordar **a implantação** na **próxima lição**, mas como esse é um processo bem diferente de escrever código, decidimos mudar a ordem e cobrir o Web3.js primeiro.

Depois de implantar o seu contrato, ele recebe um endereço fixo no Ethereum, onde viverá para sempre. Se você se lembra da lição 2, o endereço do contrato CryptoKitties na rede social Ethereum é `0x06012c8cf97BEaD5deAe237070F9587f8E7A266d`.

Você precisará copiar esse endereço após a implantação para conversar com seu smart contract.

## Contrato ABI

A outra coisa que o Web3.js precisará para falar com o seu contrato é o seu **_ABI_**.

ABI significa Application Binary Interface (Interface Binária da Aplicação). Basicamente, é uma representação dos métodos de seus contratos no formato JSON que informa ao Web3.js como formatar chamadas de função de uma maneira que seu contrato entenderá.

Quando você compilar seu contrato para implantar no Ethereum (que abordaremos na Lição 7), o compilador Solidity lhe dará a ABI, então você precisará copiar e salvar isso mais o endereço do contrato.

Como ainda não abordamos a implantação, para esta lição compilamos a ABI para você e a colocamos em um arquivo chamado `cryptozombies_abi.js`, armazenado em uma variável chamada`cryptoZombiesABI`.

Se incluirmos `cryptozombies_abi.js` em nosso projeto, poderemos acessar a ABI CryptoZombies usando essa variável.

## Instanciando um Contrato Web3.js

Depois de ter o endereço do contrato e a ABI, você pode instanciá-lo no Web3 da seguinte maneira:

```
// Instanciando myContract
var myContract = new web3js.eth.Contract (myABI, myContractAddress);
```

## Vamos testar

1. No `<head>` do nosso documento, inclua outra tag de script para o `cryptozombies_abi.js` para que possamos importar a definição da ABI para o nosso projeto.

2. No início de nossa tag `<script>` no `<body>`, declare um `var` chamado `cryptoZombies`, mas não o atribua nenhum valor. Mais tarde, usaremos essa variável para armazenar nosso contrato instanciado.

3. Em seguida, crie uma função `startApp()`. Nós vamos preencher o corpo nos próximos 2 passos.

4. A primeira coisa que `startApp()` deve fazer é declarar um `var` chamado `cryptoZombiesAddress` e defini-lo como a string `"YOUR_CONTRACT_ADDRESS"` (este é o endereço do contrato CryptoZombies na rede principal).

5. Por fim, vamos instanciar nosso contrato. Defina `cryptoZombies` com a instância de um novo `web3js.eth.Contract` como fizemos no código de exemplo acima. (Usando `cryptoZombiesABI`, que é importado com nossa tag de script, e `cryptoZombiesAddress` de cima).
