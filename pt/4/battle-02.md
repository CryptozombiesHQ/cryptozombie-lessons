---
title: Números Aleatórios
actions: ['verificarResposta', 'dicas']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombieattack.sol": |
        pragma solidity >=0.5.0 <0.6.0;

        import "./zombiehelper.sol";

        contract ZombieAttack is ZombieHelper {
          // Comece aqui
        }
      "zombiehelper.sol": |
        pragma solidity >=0.5.0 <0.6.0;

        import "./zombiefeeding.sol";

        contract ZombieHelper is ZombieFeeding {

          uint levelUpFee = 0.001 ether;

          modifier aboveLevel(uint _level, uint _zombieId) {
            require(zombies[_zombieId].level >= _level);
            _;
          }

          function withdraw() external onlyOwner {
            address payable _owner = address(uint160(owner()));
            _owner.transfer(address(this).balance);
          }

          function setLevelUpFee(uint _fee) external onlyOwner {
            levelUpFee = _fee;
          }

          function levelUp(uint _zombieId) external payable {
            require(msg.value == levelUpFee);
            zombies[_zombieId].level++;
          }

          function changeName(uint _zombieId, string calldata _newName) external aboveLevel(2, _zombieId) {
            require(msg.sender == zombieToOwner[_zombieId]);
            zombies[_zombieId].name = _newName;
          }

          function changeDna(uint _zombieId, uint _newDna) external aboveLevel(20, _zombieId) {
            require(msg.sender == zombieToOwner[_zombieId]);
            zombies[_zombieId].dna = _newDna;
          }

          function getZombiesByOwner(address _owner) external view returns(uint[] memory) {
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
        pragma solidity >=0.5.0 <0.6.0;

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

          function setKittyContractAddress(address _address) external onlyOwner {
            kittyContract = KittyInterface(_address);
          }

          function _triggerCooldown(Zombie storage _zombie) internal {
            _zombie.readyTime = uint32(now + cooldownTime);
          }

          function _isReady(Zombie storage _zombie) internal view returns (bool) {
              return (_zombie.readyTime <= now);
          }

          function feedAndMultiply(uint _zombieId, uint _targetDna, string memory _species) internal {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            require(_isReady(myZombie));
            _targetDna = _targetDna % dnaModulus;
            uint newDna = (myZombie.dna + _targetDna) / 2;
            if (keccak256(abi.encodePacked(_species)) == keccak256(abi.encodePacked("kitty"))) {
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
        pragma solidity >=0.5.0 <0.6.0;

        import "./ownable.sol";

        contract ZombieFactory is Ownable {

            event NewZombie(uint zombieId, string name, uint dna);

            uint dnaDigits = 16;
            uint dnaModulus = 10 ** dnaDigits;
            uint cooldownTime = 1 days;

            struct Zombie {
              string name;
              uint dna;
              uint32 level;
              uint32 readyTime;
            }

            Zombie[] public zombies;

            mapping (uint => address) public zombieToOwner;
            mapping (address => uint) ownerZombieCount;

            function _createZombie(string memory _name, uint _dna) internal {
                uint id = zombies.push(Zombie(_name, _dna, 1, uint32(now + cooldownTime))) - 1;
                zombieToOwner[id] = msg.sender;
                ownerZombieCount[msg.sender]++;
                emit NewZombie(id, _name, _dna);
            }

            function _generateRandomDna(string memory _str) private view returns (uint) {
                uint rand = uint(keccak256(abi.encodePacked(_str)));
                return rand % dnaModulus;
            }

            function createRandomZombie(string memory _name) public {
                require(ownerZombieCount[msg.sender] == 0);
                uint randDna = _generateRandomDna(_name);
                randDna = randDna - randDna % 100;
                _createZombie(_name, randDna);
            }

        }
      "ownable.sol": |
        pragma solidity >=0.5.0 <0.6.0;

        /**
        * @title Ownable
        * @dev O Ownable tem um endereço de proprietário e fornece funções básicas de controle de
        * autorização, isso simplifica a implementação de "permissões de usuário".
        */
        contract Ownable {
          address private _owner;

          event OwnershipTransferred(
            address indexed previousOwner,
            address indexed newOwner
          );

          /**
          * @dev O construtor Ownable define o `owner` original do contrato como o remetente
          * da conta.
          */
          constructor() internal {
            _owner = msg.sender;
            emit OwnershipTransferred(address(0), _owner);
          }

          /**
          * @return o endereço do proprietário.
          */
          function owner() public view returns(address) {
            return _owner;
          }

          /**
          * @dev Lança se chamado por qualquer conta que não seja o proprietário.
          */
          modifier onlyOwner() {
            require(isOwner());
            _;
          }

          /**
          * @return true se `msg.sender` é o proprietário do contrato.
          */
          function isOwner() public view returns(bool) {
            return msg.sender == _owner;
          }

          /**
          * @dev Permite que o proprietário atual abra mão do controle do contrato.
          * @notice Renunciar à propriedade deixará o contrato sem proprietário.
          * Não será mais possível chamar as funções com o modificador `onlyOwner`.
          */
          function renounceOwnership() public onlyOwner {
            emit OwnershipTransferred(_owner, address(0));
            _owner = address(0);
          }

          /**
          * @dev Permite que o proprietário atual transfira o controle do contrato para um newOwner.
          * @param newOwner O endereço para transferir a propriedade para.
          */
          function transferOwnership(address newOwner) public onlyOwner {
            _transferOwnership(newOwner);
          }

          /**
          * @dev Transfere o controle do contrato para um newOwner.
          * @param newOwner O endereço para transferir a propriedade para.
          */
          function _transferOwnership(address newOwner) internal {
            require(newOwner != address(0));
            emit OwnershipTransferred(_owner, newOwner);
            _owner = newOwner;
          }
        }
    answer: >
      pragma solidity >=0.5.0 <0.6.0;

      import "./zombiehelper.sol";

      contract ZombieAttack is ZombieHelper {
        uint randNonce = 0;

        function randMod(uint _modulus) internal returns(uint) {
          randNonce++;
          return uint(keccak256(abi.encodePacked(now, msg.sender, randNonce))) % _modulus;
        }
      }

---

Ótimo! Agora vamos entender a lógica da batalha.

Todo bom jogo requer algum nível de aleatoriedade. Então como geramos números aleatórios em Solidity?

A resposta certa é, você não consegue. Bem, ao menos não de forma segura.

Vejamos por quê.

## Gerando números aleatórios via `keccak256`

A melhor forma de aleatoriedade que temos em Solidity é a função de hash `keccak256`

Podemos fazer algo como a seguir para gerar um número aleatório:

```
// Gera um número aleatório entre 1 e 100:
uint randNonce = 0;
uint random = uint(keccak256(abi.encodePacked(now, msg.sender, randNonce))) % 100;
randNonce++;
uint random2 = uint(keccak256(abi.encodePacked(now, msg.sender, randNonce))) % 100;
```

Que seria obter o timestamp de `now`, e `msg.sender`, e incrementar um `nonce` (um número que é usado somente uma vez, então nós não iremos rodar a mesma função de hash com os mesmos parâmetros duas vezes).

O mesmo iria então usar `keccak` para converter os valores de entrada para o hash aleatório, converter este hash para um `uint`, e então usar `% 100` para obter somente os últimos 2 dígitos, nos dando uma função totalmente aleatória entre 0 à 99.

### Este método é vulnerável a um ataque por um nó desonesto

Em Ethereum, quando você chama uma função em um contrato, você transmite o mesmo para um nó ou muitos nós na rede como uma **_transação_**. Os nós na rede então coletam um monte de transações, tentam ser o primeiro a resolver um problema matemático e computacionalmente intensivo como uma "Proof of Work" (Prova de Trabalho), e então publicam este grupo de transações junto com a Proof Of Work (PoW) como um **_bloco_** para o resto da rede da rede.

Uma vez que o nó resolveu o PoW, os outros nós param de tentar resolver o PoW, verificam que a lista de transações do outro nó são válidas, e então aceitam o bloco e começam a tentar resolver o próximo bloco.

**Isto torna a nossa função de números aleatórios explorável.**

Digamos que temos um contrato de jogo de moeda - se o resultado for "cara" você dobra o seu dinheiro, "coroa" você perde tudo. Digamos que utilizamos a função geradora de aleatórios acima para determinar "cara" ou "coroa". (`random >= 50` é cara, `random < 50` é coroa).

Se estivéssemos rodando um nó da rede, eu poderia publicar uma transação **somente para o meu nó** e não compartilhá-la. Eu poderia então rodar a função do jogo da moeda para ver se eu ganho - e se eu perco. Eu poderia fazer isso indefinidamente até eu finalmente ganhar o jogo da moeda e resolver o próximo bloco, e lucrar.

## Então como podemos gerar número aleatórios de forma segura em Ethereum?

Por que todos os conteúdos da blockchain são visíveis para todos os participantes, este é um problema difícil, e sua solução esta além do escopo deste tutorial. Você pode ler <a href="https://ethereum.stackexchange.com/questions/191/how-can-i-securely-generate-a-random-number-in-my-smart-contract" target=_new>esta pergunta no StackOverflow</a> para ter algumas ideias. Uma ideia seria usar um **_oracle_** (oráculo) para acessar uma função de número aleatório de fora da blockchain do Ethereum.

Claro que uma vez que milhares de nós na rede Ethereum estão competindo para resolver o próximo bloco, minhas chances de resolver o próximo bloco são extremamente baixas. E iria me tomar um monte de tempo ou recursos computacionais para tornar esse exploit lucrativo - mas se as recompensas fossem altas o suficiente (algo do tipo ganhar uma aposta de $100,000,000 no jogo da moeda), então valeria a pena pra mim fazer este ataque.

Então enquanto esta geração de número aleatório NÃO é segura no Ethereum, em prática ao menos que a nossa função de número aleatório tenha um monte de dinheiro em jogo, os usuários do jogo não usaram recursos o suficiente para atacá-la.

E por que estamos construindo um jogo simples com o propósito de demonstração neste tutorial e por que não há real dinheiro envolvido, vamos aceitar esse _tradeoff_ de usar um gerador de números aleatórios que é simples de implementar, sabendo que não é totalmente seguro.

Em lições futuras, talvez podemos cobrir os **_oracles_** (uma forma segura de obter dados fora da rede do Ethereum) para gerar números aleatórios seguros fora da blockchain.

## Vamos testar

Vamos implementar uma função de números aleatórios que podemos determinar os resultados das nossas batalhas, mesmo que não seja totalmente seguro contra ataques.

1. Crie em nosso contrato um `uint` chamado `randNonce`, e atribua o valor igual `0`.

2. Crie uma função chamada `randMod` (random-modulus). Esta irá ser uma função `internal` que obtêm um `uint` chamado `_modulus`, e retorna (`returns`) um `uint`.

3. A função deverá primeiro incrementar o `randNonce` (usando a sintaxe `randNonce++`).

4. Finalmente, esta deverá (em uma linha de código) calcular o `uint` convertendo o resultado do hash `keccak256` de `abi.encodePacked(now,msg.sender,randNonce)` — e `retornar` o valor `% _modulus`. (Ufa! Essa foi difícil. Se você não entendeu, dê uma olhada no exemplo acima, onde geramos um número aleatório — a lógica é muito parecida).
