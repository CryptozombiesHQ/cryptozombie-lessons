---
title: Escutando eventos
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
            <div id="txStatus"></div>
            <div id="zombies"></div>

            <script>
              var cryptoZombies;
              var userAccount;

              function startApp() {
                var cryptoZombiesAddress = "YOUR_CONTRACT_ADDRESS";
                cryptoZombies = new web3js.eth.Contract(cryptoZombiesABI, cryptoZombiesAddress);

                var accountInterval = setInterval(function() {
                  // Check if account has changed
                  if (web3.eth.accounts[0] !== userAccount) {
                    userAccount = web3.eth.accounts[0];
                    // Call a function to update the UI with the new account
                    getZombiesByOwner(userAccount)
                    .then(displayZombies);
                  }
                }, 100);

                // Comece aqui
              }

              function displayZombies(ids) {
                $("#zombies").empty();
                for (id of ids) {
                  // Look up zombie details from our contract. Returns a `zombie` object
                  getZombieDetails(id)
                  .then(function(zombie) {
                    // Using ES6's "template literals" to inject variables into the HTML.
                    // Append each one to our #zombies div
                    $("#zombies").append(`<div class="zombie">
                      <ul>
                        <li>Name: ${zombie.name}</li>
                        <li>DNA: ${zombie.dna}</li>
                        <li>Level: ${zombie.level}</li>
                        <li>Wins: ${zombie.winCount}</li>
                        <li>Losses: ${zombie.lossCount}</li>
                        <li>Ready Time: ${zombie.readyTime}</li>
                      </ul>
                    </div>`);
                  });
                }
              }

              function createPseudoRandomZombie(name) {
                // This is going to take a while, so update the UI to let the user know
                // the transaction has been sent
                $("#txStatus").text("Creating new zombie on the blockchain. This may take a while...");
                // Send the tx to our contract:
                return cryptoZombies.methods.createPseudoRandomZombie(name)
                .send({ from: userAccount })
                .on("receipt", function(receipt) {
                  $("#txStatus").text("Successfully created " + name + "!");
                  // Transaction was accepted into the blockchain, let's redraw the UI
                  getZombiesByOwner(userAccount).then(displayZombies);
                })
                .on("error", function(error) {
                  // Do something to alert the user their transaction has failed
                  $("#txStatus").text(error);
                });
              }

              function feedOnKitty(zombieId, kittyId) {
                $("#txStatus").text("Eating a kitty. This may take a while...");
                return cryptoZombies.methods.feedOnKitty(zombieId, kittyId)
                .send({ from: userAccount })
                .on("receipt", function(receipt) {
                  $("#txStatus").text("Ate a kitty and spawned a new Zombie!");
                  getZombiesByOwner(userAccount).then(displayZombies);
                })
                .on("error", function(error) {
                  $("#txStatus").text(error);
                });
              }

              function levelUp(zombieId) {
                $("#txStatus").text("Leveling up your zombie...");
                return cryptoZombies.methods.levelUp(zombieId)
                .send({ from: userAccount, value: web3.utils.toWei("0.001", "ether") })
                .on("receipt", function(receipt) {
                  $("#txStatus").text("Power overwhelming! Zombie successfully leveled up");
                })
                .on("error", function(error) {
                  $("#txStatus").text(error);
                });
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

                // Checking if Web3 has been injected by the browser (Mist/MetaMask)
                if (typeof web3 !== 'undefined') {
                  // Use Mist/MetaMask's provider
                  web3js = new Web3(web3.currentProvider);
                } else {
                  // Handle the case where the user doesn't have Metamask installed
                  // Probably show them a message prompting them to install Metamask
                }

                // Now you can start your app & access web3 freely:
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
          <div id="txStatus"></div>
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

              cryptoZombies.events.Transfer({ filter: { _to: userAccount } })
              .on("data", function(event) {
                let data = event.returnValues;
                getZombiesByOwner(userAccount).then(displayZombies);
              }).on("error", console.error);
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

            function createPseudoRandomZombie(name) {
              // Isso vai demorar um pouco, então atualize a interface do usuário para que o usuário saiba
              // a transação foi enviada
              $("#txStatus").text("Criando novo zumbi no blockchain. Isso pode demorar um pouco ...");
              // Envie o tx para nosso contrato:
              return cryptoZombies.methods.createPseudoRandomZombie(name)
              .send({from: userAccount})
              .on("receipt", function (receipt) {
                $ ("#txStatus").text("Criado com sucesso" + name + "!");
                // A transação foi aceita no blockchain, vamos redesenhar a interface do usuário
                getZombiesByOwner(userAccount).then(displayZombies);
              })
              .on ("error", function (error) {
                // Faça algo para alertar o usuário sobre a falha da transação
                $("#txStatus").text(erro);
              });
            }

            function feedOnKitty(zombieId, kittyId) {
              // Isso vai demorar um pouco, então atualize a interface do usuário para que o usuário saiba
              // a transação foi enviada
              $("#txStatus").text("Comendo um gatinho. Isso pode demorar um pouco...");
              // Envie o tx para nosso contrato:
              return cryptoZombies.methods.feedOnKitty(zombieId, kittyId)
              .send({ from: userAccount })
              .on("receipt", function(receipt) {
                $("#txStatus").text("Comeu um gatinho e gerou um novo Zumbi!");
                // A transação foi aceita no blockchain, vamos redesenhar a interface do usuário
                getZombiesByOwner(userAccount).then(displayZombies);
              })
              .on("error", function(error) {
                // Faça algo para alertar o usuário sobre a falha da transação
                $("#txStatus").text(error);
              });
            }

            function levelUp(zombieId) {
              $("#txStatus").text(""Upando seu zumbi..."");
              return cryptoZombies.methods.levelUp(zombieId)
              .send({ from: userAccount, value: web3js.utils.toWei("0.001", "ether") })
              .on("receipt", function(receipt) {
                $("#txStatus").text("Poder esmagador! Zumbi upado com sucesso");
              })
              .on("error", function(error) {
                $("#txStatus").text(error);
              });
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

Como você pode ver, interagir com o seu contrato via Web3.js é bastante simples — depois de configurar seu ambiente, as funções `call` e `send` não são tão diferentes de uma API web normal.

Há mais um aspecto que queremos cobrir — lidar com eventos do seu contrato.

## Lidando com Novos Zumbis

Se você se lembra de `zombiefactory.sol`, nós tivemos um evento chamado `NewZombie` que nós emitimos toda vez que um novo zumbi foi criado:

```
event NewZombie(uint zombieId, string name, uint dna);
```

No Web3.js, você pode **escutar** em um evento para que seu provedor web3 dispare alguma lógica em seu código toda vez que for acionado:

```
cryptoZombies.events.NewZombie()
.on("data", function(event) {
  let zumbie = event.returnValues;
  // Podemos acessar os 3 valores de retorno deste evento no objeto `event.returnValues`:
  console.log("Um novo zumbi nasceu!", zombie.zombieId, zombie.name, zombie.dna);
}).on("error", console.error);
```

Note que isso acionaria um alerta toda vez que algum zumbi fosse criado em nosso DApp — não apenas para o usuário atual. E se quiséssemos apenas alertas para o usuário atual?

## Usando o `indexed`

Para filtrar eventos e apenas detectar mudanças relacionadas ao usuário atual, nosso contrato de Solidity teria que usar a palavra-chave `indexed`, como fizemos no evento`Transfer` de nossa implementação do ERC721:

```
event Transfer(address indexed _from, address indexed _to, uint256 _tokenId);
```

Neste caso, porque `_from` e `_to` são `indexed`, isso significa que podemos filtrar por eles em nosso listener de evento em nosso front-end:

```
// Use `filter` para disparar este código somente quando `_to` for igual a `userAccount`
cryptoZombies.events.Transfer({filter: {_to: userAccount}})
.on("data", function(event) {
  let data = event.returnValues;
  // O usuário atual acabou de receber um zumbi!
  // Faça algo aqui para atualizar a interface do usuário para mostrá-lo
}).on("error", console.error);
```

Como você pode ver, usar os campos `event`s e `indexed` pode ser uma prática bastante útil para ouvir alterações no contrato e refleti-las no front-end do seu aplicativo.

## Consultando eventos passados

Nós podemos até mesmo consultar eventos passados ​​usando `getPastEvents`, e usar os filtros `fromBlock` e `toBlock` para dar ao Solidity um intervalo de tempo para os logs de eventos ("block", neste caso, referindo-se ao número do bloco Ethereum):

```
cryptoZombies.getPastEvents("NewZombie", {fromBlock: 0, toBlock: "latest"})
.then (function(events) {
  // `events` é um array de objetos `event` que podemos iterar, como fizemos acima
  // Esse código nos dará uma lista de todos os zumbis que já foram criados
});
```

Como você pode usar esse método para consultar os logs de eventos desde o início do tempo, isso apresenta um caso de uso interessante: **Uso de eventos como uma forma de armazenamento mais barata**.

Se você se lembrar, salvar dados no blockchain é uma das operações mais caras do Solidity. Mas usar eventos é muito mais barato em termos de gas.

A desvantagem aqui é que os eventos não são legíveis de dentro do próprio smart contract. Mas é um importante caso de uso para se ter em mente se você tiver alguns dados que deseja registrar historicamente no blockchain para poder lê-los no front-end de seu aplicativo.

Por exemplo, poderíamos usar isso como um registro histórico de batalhas zumbis — poderíamos criar um evento para cada vez que um zumbi atacasse outro e vencesse. O smart contract não precisa desses dados para calcular os resultados futuros, mas é um dado útil para os usuários poderem navegar pelo front-end do aplicativo.

## Vamos testar

Vamos adicionar algum código para escutar o evento `Transfer` e atualizar a interface do usuário do aplicativo se o usuário atual receber um novo zumbi.

Nós precisaremos adicionar este código no final da função `startApp`, para garantir que o contrato `cryptoZombies` tenha sido inicializado antes de adicionar um listener de eventos.

1. No final de `startApp()`, copie e cole o bloco de código acima para escutar `cryptoZombies.events.Transfer`

2. Para a linha atualizar a UI, use `getZombiesByOwner(userAccount).then(displayZombies);`
