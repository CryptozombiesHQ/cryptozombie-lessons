---
title: Comentários
actions: ['verificarResposta', 'dicas']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombieownership.sol": |
        pragma solidity >=0.5.0 <0.6.0;

        import "./zombieattack.sol";
        import "./erc721.sol";
        import "./safemath.sol";

        /// TODO: Substitua isto com um descrição natspec
        contract ZombieOwnership is ZombieAttack, ERC721 {

          using SafeMath for uint256;

          mapping (uint => address) zombieApprovals;

          function balanceOf(address _owner) external view returns (uint256) {
            return ownerZombieCount[_owner];
          }

          function ownerOf(uint256 _tokenId) external view returns (address) {
            return zombieToOwner[_tokenId];
          }

          function _transfer(address _from, address _to, uint256 _tokenId) private {
            ownerZombieCount[_to] = ownerZombieCount[_to].add(1);
            ownerZombieCount[msg.sender] = ownerZombieCount[msg.sender].sub(1);
            zombieToOwner[_tokenId] = _to;
            emit Transfer(_from, _to, _tokenId);
          }

          function transferFrom(address _from, address _to, uint256 _tokenId) external payable {
            require (zombieToOwner[_tokenId] == msg.sender || zombieApprovals[_tokenId] == msg.sender);
            _transfer(_from, _to, _tokenId);
          }

          function approve(address _approved, uint256 _tokenId) external payable onlyOwnerOf(_tokenId) {
            zombieApprovals[_tokenId] = _approved;
            emit Approval(msg.sender, _approved, _tokenId);
          }

        }
      "zombieattack.sol": |
        pragma solidity >=0.5.0 <0.6.0;

        import "./zombiehelper.sol";

        contract ZombieAttack is ZombieHelper {
          uint randNonce = 0;
          uint attackVictoryProbability = 70;

          function randMod(uint _modulus) internal returns(uint) {
            randNonce = randNonce.add(1);
            return uint(keccak256(abi.encodePacked(now, msg.sender, randNonce))) % _modulus;
          }

          function attack(uint _zombieId, uint _targetId) external onlyOwnerOf(_zombieId) {
            Zombie storage myZombie = zombies[_zombieId];
            Zombie storage enemyZombie = zombies[_targetId];
            uint rand = randMod(100);
            if (rand <= attackVictoryProbability) {
              myZombie.winCount = myZombie.winCount.add(1);
              myZombie.level = myZombie.level.add(1);
              enemyZombie.lossCount = enemyZombie.lossCount.add(1);
              feedAndMultiply(_zombieId, enemyZombie.dna, "zombie");
            } else {
              myZombie.lossCount = myZombie.lossCount.add(1);
              enemyZombie.winCount = enemyZombie.winCount.add(1);
              _triggerCooldown(myZombie);
            }
          }
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
            address _owner = owner();
            _owner.transfer(address(this).balance);
          }

          function setLevelUpFee(uint _fee) external onlyOwner {
            levelUpFee = _fee;
          }

          function levelUp(uint _zombieId) external payable {
            require(msg.value == levelUpFee);
            zombies[_zombieId].level = zombies[_zombieId].level.add(1);
          }

          function changeName(uint _zombieId, string calldata _newName) external aboveLevel(2, _zombieId) onlyOwnerOf(_zombieId) {
            zombies[_zombieId].name = _newName;
          }

          function changeDna(uint _zombieId, uint _newDna) external aboveLevel(20, _zombieId) onlyOwnerOf(_zombieId) {
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

          function feedAndMultiply(uint _zombieId, uint _targetDna, string memory _species) internal onlyOwnerOf(_zombieId) {
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
        import "./safemath.sol";

        contract ZombieFactory is Ownable {

          using SafeMath for uint256;
          using SafeMath32 for uint32;
          using SafeMath16 for uint16;

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

          function _createZombie(string memory _name, uint _dna) internal {
            uint id = zombies.push(Zombie(_name, _dna, 1, uint32(now + cooldownTime), 0, 0)) - 1;
            zombieToOwner[id] = msg.sender;
            ownerZombieCount[msg.sender] = ownerZombieCount[msg.sender].add(1);
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
        * @dev The Ownable contract has an owner address, and provides basic authorization control
        * functions, this simplifies the implementation of "user permissions".
        */
        contract Ownable {
          address private _owner;

          event OwnershipTransferred(
            address indexed previousOwner,
            address indexed newOwner
          );

          /**
          * @dev The Ownable constructor sets the original `owner` of the contract to the sender
          * account.
          */
          constructor() internal {
            _owner = msg.sender;
            emit OwnershipTransferred(address(0), _owner);
          }

          /**
          * @return the address of the owner.
          */
          function owner() public view returns(address) {
            return _owner;
          }

          /**
          * @dev Throws if called by any account other than the owner.
          */
          modifier onlyOwner() {
            require(isOwner());
            _;
          }

          /**
          * @return true if `msg.sender` is the owner of the contract.
          */
          function isOwner() public view returns(bool) {
            return msg.sender == _owner;
          }

          /**
          * @dev Allows the current owner to relinquish control of the contract.
          * @notice Renouncing to ownership will leave the contract without an owner.
          * It will not be possible to call the functions with the `onlyOwner`
          * modifier anymore.
          */
          function renounceOwnership() public onlyOwner {
            emit OwnershipTransferred(_owner, address(0));
            _owner = address(0);
          }

          /**
          * @dev Allows the current owner to transfer control of the contract to a newOwner.
          * @param newOwner The address to transfer ownership to.
          */
          function transferOwnership(address newOwner) public onlyOwner {
            _transferOwnership(newOwner);
          }

          /**
          * @dev Transfers control of the contract to a newOwner.
          * @param newOwner The address to transfer ownership to.
          */
          function _transferOwnership(address newOwner) internal {
            require(newOwner != address(0));
            emit OwnershipTransferred(_owner, newOwner);
            _owner = newOwner;
          }
        }
      "safemath.sol": |
        pragma solidity >=0.5.0 <0.6.0;

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

        /**
         * @title SafeMath32
         * @dev SafeMath library implemented for uint32
         */
        library SafeMath32 {

          function mul(uint32 a, uint32 b) internal pure returns (uint32) {
            if (a == 0) {
              return 0;
            }
            uint32 c = a * b;
            assert(c / a == b);
            return c;
          }

          function div(uint32 a, uint32 b) internal pure returns (uint32) {
            // assert(b > 0); // Solidity automatically throws when dividing by 0
            uint32 c = a / b;
            // assert(a == b * c + a % b); // There is no case in which this doesn't hold
            return c;
          }

          function sub(uint32 a, uint32 b) internal pure returns (uint32) {
            assert(b <= a);
            return a - b;
          }

          function add(uint32 a, uint32 b) internal pure returns (uint32) {
            uint32 c = a + b;
            assert(c >= a);
            return c;
          }
        }

        /**
         * @title SafeMath16
         * @dev SafeMath library implemented for uint16
         */
        library SafeMath16 {

          function mul(uint16 a, uint16 b) internal pure returns (uint16) {
            if (a == 0) {
              return 0;
            }
            uint16 c = a * b;
            assert(c / a == b);
            return c;
          }

          function div(uint16 a, uint16 b) internal pure returns (uint16) {
            // assert(b > 0); // Solidity automatically throws when dividing by 0
            uint16 c = a / b;
            // assert(a == b * c + a % b); // There is no case in which this doesn't hold
            return c;
          }

          function sub(uint16 a, uint16 b) internal pure returns (uint16) {
            assert(b <= a);
            return a - b;
          }

          function add(uint16 a, uint16 b) internal pure returns (uint16) {
            uint16 c = a + b;
            assert(c >= a);
            return c;
          }
        }
      "erc721.sol": |
        pragma solidity >=0.5.0 <0.6.0;

        contract ERC721 {
          event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);
          event Approval(address indexed _owner, address indexed _approved, uint256 indexed _tokenId);

          function balanceOf(address _owner) external view returns (uint256);
          function ownerOf(uint256 _tokenId) external view returns (address);
          function transferFrom(address _from, address _to, uint256 _tokenId) external payable;
          function approve(address _approved, uint256 _tokenId) external payable;
        }
    answer: |
      pragma solidity >=0.5.0 <0.6.0;

      import "./zombieattack.sol";
      import "./erc721.sol";
      import "./safemath.sol";

      contract ZombieOwnership is ZombieAttack, ERC721 {

        using SafeMath for uint256;

        mapping (uint => address) zombieApprovals;

        function balanceOf(address _owner) external view returns (uint256) {
          return ownerZombieCount[_owner];
        }

        function ownerOf(uint256 _tokenId) external view returns (address) {
          return zombieToOwner[_tokenId];
        }

        function _transfer(address _from, address _to, uint256 _tokenId) private {
          ownerZombieCount[_to] = ownerZombieCount[_to].add(1);
          ownerZombieCount[msg.sender] = ownerZombieCount[msg.sender].sub(1);
          zombieToOwner[_tokenId] = _to;
          emit Transfer(_from, _to, _tokenId);
        }

        function transferFrom(address _from, address _to, uint256 _tokenId) external payable {
            require (zombieToOwner[_tokenId] == msg.sender || zombieApprovals[_tokenId] == msg.sender);
            _transfer(_from, _to, _tokenId);
          }

        function approve(address _approved, uint256 _tokenId) external payable onlyOwnerOf(_tokenId) {
            zombieApprovals[_tokenId] = _approved;
            emit Approval(msg.sender, _approved, _tokenId);
          }

      }
---

O código Solidity para o nosso jogo zumbi finalmente terminou!

Nas próximas lições, iremos olhar em como implantar o código no Ethereum, e como interagir com ele usando a Web3.js.

Mas uma coisa final antes de deixá-lo ir na Lição 5: Vamos falar sobre **comentando o seu código**.

## Sintaxe para comentários

Comentando um código em Solidity e como em JavaScript. Você já viu alguns exemplos de uma simples linha de comentário nas lições do CryptoZombies.

```
// Este é um comentário de uma linha. É tipo uma nota própria (ou para outros)
```

Somente adicione duas `//` em qualquer lugar e você esta comentando. É tão fácil que você deveria fazer toda hora.

Mas eu entendo você – algumas vezes uma linha não é o suficiente. Você nasceu um escritor, afinal!

Assim, nós também temos comentários multi-linhas:

```
contract CryptoZombies {
  /* Este é um comentário multi-linha. Eu gostaria de agradecer à todos vocês
    que usaram o seu tempo para tentar este curso de programação.
    Eu sei que é grátis para todos vocês, e continuará grátis
    para sempre, mas ainda colocamos nossos corações e almas para fazer
    isto tão bom quanto o possível.

    Saiba que este ainda é o início do desenvolvimento do Blockchain.
    Chegamos muito longe, mas ainda existem várias maneiras de fazer esta
    comunidade melhor. Se cometemos um erro em algum lugar, você pode
    nos ajudar e abrir um pull request aqui:
    https://github.com/loomnetwork/cryptozombie-lessons

    Ou se você tiver algumas ideias, comentários, ou só dizer um Olá –
    envie pela nossa comunidade Telegram em https://t.me/loomnetwork
  */
}
```

Em particular, é uma boa prática comentar o seu código para explicar o comportamento esperado de cada função em seu contrato. Desta maneira outro desenvolvedor (ou você, após seis meses de hiato de um projeto!) pode rapidamente ler e entender em alto nível o que seu código faz sem ter que ler o próprio código.

O padrão na comunidade Solidity é usar o formato chamado **_natspec_**, que se parece com isso:

```
/// @title Um contrato para operações básicas de matemática
/// @author H4XF13LD MORRIS 💯💯😎💯💯
/// @notice No momento, este contrato somente adiciona uma função de multiplicação
contract Math {
  /// @notice Multiplica dois números juntos
  /// @param x o primeiro uint.
  /// @param y o segundo uint.
  /// @return z o produto de (x * y)
  /// @dev Esta função não atualmente não checa por overflows
  function multiply(uint x, uint y) returns (uint z) {
    // Este é somente um comentário normal, e não sera lido pelo natspec
    z = x * y;
  }
}
```

`@title` e `@author` são simples.

`@notice` explica para o **usuário** o que o contrato  / função faz. `@dev` é para explicar detalhes extras para os desenvolvedores.

`@param` e  `@return` são para descrever o que cada parâmetro e valor de retorno da função fazem.

Note que você não precisa ter que usar todas essas tags para cada função - todas as tags são opcionais. Mas pelo menos, deixa uma nota com `@dev` explicando o que cada função faz.

# Vamos testar

Se você ainda não notou, o verificador de respostas do CryptoZombies ignora comentários quando verifica suas respostas. Então não precisamos verificar seu código natspec para este capítulo ;)

No entanto, aqui você já é um bruxo do Solidity – vamos assumir que você entendeu isto!

De uma chance, e tente adicionar alguma tag natspec no `ZombieOwnership`:

1. `@title` — Ex: Um contrato que gerencia a transferência de propriedade do zumbi

2. `@author` — Seu nome!

3. `@dev` — Ex: Em conformidade com a implementação do rascunho de especificação ERC721 do OpenZeppelin
