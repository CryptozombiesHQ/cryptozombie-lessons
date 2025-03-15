---
title: Funções Públicas & Segurança
actions: ['verificarResposta', 'dicas']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
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

          // 1. Torne esta função internal
          function feedAndMultiply(uint _zombieId, uint _targetDna, string memory _species) public {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            // 2. Adicione a checagem para `_isReady` aqui
            _targetDna = _targetDna % dnaModulus;
            uint newDna = (myZombie.dna + _targetDna) / 2;
            if (keccak256(abi.encodePacked(_species)) == keccak256(abi.encodePacked("kitty"))) {
              newDna = newDna - newDna % 100 + 99;
            }
            _createZombie("NoName", newDna);
            // 3. chame o `_triggerCooldown` aqui
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
---

Agora vamos modificar `feedAndMultiply` para considerar o tempo de resfriamento.

Olhando novamente nesta função, você pode perceber que nós as criamos como `public` na lição anterior. Uma prática importante de segurança é auditar todas as funções `public` e `external`, e tentar imaginar as maneiras de como os usuários poderiam abusar delas. Lembre-se - ao menos que estas funções tenham um modificador `onlyOwner`, qualquer usuário pode executá-las e passar o dado que quiserem.

Re-examinando esta função em particular, o usuário poderia chamar esta função diretamente e tentar passar um `_targetDna` ou `_species` que quiserem. Isto não faria parecer um jogo - nós queremos que todos sigam as regras!

Olhando de perto, esta função só precisa ser chamada por `feedOnKitty()`, então a maneira mais fácil de prevenir tais explorações é torná-la um `internal`.

## Vamos testar

1. Atualmente `feedAndMultiply` é uma função `public`. Vamos torná-la `internal` então o contrato será mais seguro. Não queremos que os usuários possam chamar esta função com o DNA que quiserem.

2. Vamos fazer o `feedAndMultiply` considerar o nosso `cooldownTime`. Primeiro, após obter o `myZombie`, vamos adicionar uma declaração de `require` que verifica `_isReady()` e passa o `myZombie` como parâmetro. Desta maneira o usuário só pode executar a função se o tempo de esfriamento do zumbi terminar.

3. No final da função execute o `_triggerCooldown(myZombie)` então ao se alimentar dispara o tempo de resfriamento do zumbi.
