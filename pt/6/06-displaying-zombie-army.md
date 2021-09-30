---
title: Exibindo nosso exército zumbi
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
            <script language="javascript" type="text/javascript" src="cryptozombies_abi.js"></script>
          </head>
          <body>
            <div id="zombies"></div>

            <script>
              var cryptoZombies;
              var userAccount;

              function startApp() {
                var cryptoZombiesAddress = "YOUR_CONTRACT_ADDRESS";
                cryptoZombies = new web3js.eth.Contract(cryptoZombiesABI, cryptoZombiesAddress);

                var accountInterval = setInterval(function() {
                  // Verifique se a conta foi alterada
                  if (web3.eth.accounts[0] !== userAccount) {
                    userAccount = web3.eth.accounts[0];
                    // Chamar a função para atualizar a interface do usuário com a nova conta
                    getZombiesByOwner(userAccount)
                    .then(displayZombies);
                  }
                }, 100);
              }

              function displayZombies(ids) {
                // Comece aqui
              }

              function getZombieDetails(id) {
                return cryptoZombies.methods.zombies(id).call()
              }

              function zombieToOwner(id) {
                return cryptoZombies.methods.zombieToOwner(id).call()
              }

              function getZombiesByOwner(owner) {
                return cryptoZombies.methods.getZombiesByOwner(owner).call()
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
          <div id="zombies"></div>

          <script>
            var cryptoZombies;
            var userAccount;

            function startApp() {
              var cryptoZombiesAddress = "YOUR_CONTRACT_ADDRESS";
              cryptoZombies = new web3js.eth.Contract(cryptoZombiesABI, cryptoZombiesAddress);

              var accountInterval = setInterval(function() {
                // Verifique se a conta foi alterada
                if (web3.eth.accounts[0] !== userAccount) {
                  userAccount = web3.eth.accounts[0];
                  // Chamar a função para atualizar a interface do usuário com a nova conta
                  getZombiesByOwner(userAccount)
                  .then(displayZombies);
                }
              }, 100);
            }

            function displayZombies(ids) {
              $("#zombies").empty();
              for (id of ids) {
                // Busca os detalhes de zumbis do nosso contrato. Retorna um objeto `zumbi`
                getZombieDetails (id)
                .then(function(zumbi) {
                  // Usando os "template literals" do ES6 para injetar variáveis ​​no HTML.
                  // Anexa cada um ao nosso div #zombies
                  $("#zombies").append(`<div class="zombie">
                    <ul>
                      <li>Nome: ${zombie.name}</li>
                      <li>DNA: ${zombie.dna}</li>
                      <li>Nível: ${zombie.level}</li>
                      <li>Vitórias: ${zombie.winCount}</li>
                      <li>Perdas: ${zombie.lossCount}</li>
                      <li>Ready Time: ${zombie.readyTime}</li>
                    </ul>
                  </div>`);
                });
              }
            }

            function getZombieDetails(id) {
              return cryptoZombies.methods.zombies(id).call()
            }

            function zombieToOwner(id) {
              return cryptoZombies.methods.zombieToOwner(id).call()
            }

            function getZombiesByOwner(owner) {
              return cryptoZombies.methods.getZombiesByOwner(owner).call()
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

Este tutorial não estaria completo se não mostrássemos como realmente exibir os dados que você recebe do contrato.

No entanto, de forma realista, você desejará usar uma estrutura de front-end como React ou Vue.js no seu aplicativo, já que elas tornam sua vida muito mais fácil como um desenvolvedor de front-end. Mas cobrir o React ou o Vue.js está muito fora do escopo deste tutorial — isso seria um tutorial completo de várias lições por si só.

Então, para manter o CryptoZombies.io focado no Ethereum e nos contratos inteligentes, vamos mostrar um exemplo rápido no JQuery para demonstrar como você pode analisar e exibir os dados que recebe de seu smart contract.

## Exibindo dados de zumbis — um exemplo grosseiro

Nós adicionamos um `<div id="zombies"></div>` vazio ao corpo do nosso documento, assim como uma função `displayZombies` vazia.

Lembre-se que no capítulo anterior chamamos `displayZombies` de dentro de `startApp()` com o resultado de uma chamada para `getZombiesByOwner`. Será passado um array de IDs zumbis que se parecem com:

```
[0, 13, 47]
```

Assim, queremos que nossa função `displayZombies`:

1. Primeiro limpe o conteúdo do div do `#zombies`, se já houver alguma coisa dentro dele. (Desta forma, se o usuário mudar sua conta MetaMask ativa, ela limpará o antigo exército de zumbis antes de carregar o novo).

2. Faça um loop através de cada `id` e para cada chamada `getZombieDetails(id)` para procurar todas as informações para aquele zumbi do nosso smart contract, então

3. Coloque as informações sobre esse zumbi em um modelo HTML para formatá-lo para exibição e anexe esse modelo ao div `#zombies`.

Novamente, estamos apenas usando o JQuery aqui, que não tem um mecanismo de templates por padrão, então isso vai ser feio. Mas aqui está um exemplo simples de como podemos produzir esses dados para cada zumbi:

```
// Busca os detalhes de zumbis do nosso contrato. Retorna um objeto `zumbi`
getZombieDetails (id)
.then(function(zumbi) {
  // Usando os "template literals" do ES6 para injetar variáveis ​​no HTML.
  // Anexa cada um ao nosso div #zombies
  $("#zombies").append(`<div class="zombie">
    <ul>
      <li>Nome: ${zombie.name}</li>
      <li>DNA: ${zombie.dna}</li>
      <li>Nível: ${zombie.level}</li>
      <li>Vitórias: ${zombie.winCount}</li>
      <li>Perdas: ${zombie.lossCount}</li>
      <li>Ready Time: ${zombie.readyTime}</li>
    </ul>
  </div>`);
});
```

## Que tal exibir os sprites zumbis?

No exemplo acima, estamos simplesmente exibindo o DNA como uma string. Mas no seu DApp, você iria querer converter isso em imagens para exibir seu zumbi.

Fizemos isso dividindo a string de DNA em substrings, e tendo cada 2 dígitos correspondem a uma imagem. Algo como:

```
// Obtém um inteiro 1-7 que representa nossa cabeça zumbi:
var head = parseInt(zombie.dna.substring(0, 2))% 7 + 1

// Temos 7 imagens principais com nomes de arquivos sequenciais:
var headSrc = "../assets/zombieparts/head-" + i + ".png"
```

Cada componente é posicionado com CSS usando posicionamento absoluto, para sobrepor sobre as outras imagens.

Se você quiser ver nossa implementação exata, nós abrimos o código do componente Vue.js que usamos para a aparência do zumbi, que você pode ver <a href="https://github.com/loomnetwork/zombie-char-component " target=_blank>aqui</a>.

No entanto, como há muito código nesse arquivo, ele está fora do escopo deste tutorial. Para esta lição, vamos ficar com a implementação extremamente simples do JQuery acima, e deixar para você mergulhar em uma implementação mais bonita como lição de casa 😉

## Vamos testar

Criamos uma função vazia `displayZombies` para você. Vamos preenchê-lo.

1. A primeira coisa que queremos fazer é esvaziar o div `#zombies`. No JQuery, você pode fazer isso com `$("#zombies").empty();`.

2. Em seguida, vamos querer percorrer todos os ids, usando um loop for: `for (id of ids) {`

3. Dentro do loop for, copie e cole o bloco de código acima do chamado `getZombieDetails(id)` para cada id e então use `$("#zombies").append(...)` para adicioná-lo ao nosso HTML.
