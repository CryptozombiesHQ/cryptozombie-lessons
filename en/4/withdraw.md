---
title: Withdraws
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: rust
    startingCode:
      "zombiefeeding.rs": |
        multiversx_sc::imports!();
        multiversx_sc::derive_imports!();

        use crate::{storage, zombiefactory};
        use crypto_kitties_proxy::Kitty;

        mod crypto_kitties_proxy {
            multiversx_sc::imports!();
            multiversx_sc::derive_imports!();

            #[derive(NestedEncode, NestedDecode, TopEncode, TopDecode, TypeAbi)]
            pub struct Kitty {
                pub is_gestating: bool,
                pub is_ready: bool,
                pub cooldown_index: u64,
                pub next_action_at: u64,
                pub siring_with_id: u64,
                pub birth_time: u64,
                pub matron_id: u64,
                pub sire_id: u64,
                pub generation: u64,
                pub genes: u64,
            }

            #[multiversx_sc::proxy]
            pub trait CryptoKitties {
                #[endpoint]
                fn get_kitty(&self, id: usize) -> Kitty;
            }
        }

        #[multiversx_sc::module]
        pub trait ZombieFeeding: storage::Storage + zombiefactory::ZombieFactory {
            #[endpoint]
            fn feed_and_multiply(&self, zombie_id: usize, target_dna: u64, species: ManagedBuffer) {
                let caller = self.blockchain().get_caller();
                require!(
                    self.owned_zombies(&caller).is_empty(),
                    "You can only feed your own zombie"
                );
                let my_zombie = self.zombies(&zombie_id).get();
                let dna_digits = self.dna_digits().get();
                let max_dna_value = u64::pow(10u64, dna_digits as u32);
                let verified_target_dna = target_dna % max_dna_value;
                let mut new_dna = (my_zombie.dna + verified_target_dna) / 2;
                if species == ManagedBuffer::from(b"kitty") {
                  new_dna = new_dna - new_dna % 100 + 99
                }
                self.create_zombie(caller, ManagedBuffer::from(b"NoName"), new_dna);
            }

            #[callback]
            fn get_kitty_callback(
              &self, 
              #[call_result] result: ManagedAsyncCallResult<Kitty>,
              zombie_id: usize
            ) {
                match result {
                    ManagedAsyncCallResult::Ok(kitty) => {
                      let kitty_dna = kitty.genes;
                      self.feed_and_multiply(zombie_id, kitty_dna, ManagedBuffer::from(b"kitty"));
                    },
                    ManagedAsyncCallResult::Err(_) => {},
                }
            }

            #[endpoint]
            fn feed_on_kitty(
              &self, 
              zombie_id: usize,
              kitty_id: usize,
            ) {
              let crypto_kitties_sc_address = self.crypto_kitties_sc_address().get();
                self.kitty_proxy(crypto_kitties_sc_address)
                    .get_kitty(kitty_id)
                    .async_call()
                    .with_callback(self.callbacks().get_kitty_callback(zombie_id))
                    .call_and_exit();
            }
            #[proxy]
            fn kitty_proxy(&self, to: ManagedAddress) -> crypto_kitties_proxy::Proxy<Self::Api>;
        }
      "zombie.rs": |
        multiversx_sc::imports!();
        multiversx_sc::derive_imports!();

        #[derive(NestedEncode, NestedDecode, TopEncode, TopDecode, TypeAbi)]
        pub struct Zombie<M: ManagedTypeApi> {
            pub name: ManagedBuffer<M>,
            pub dna: u64,
            pub level: u16,
            pub ready_time: u64,
        }
      "zombiefactory.rs": |
        multiversx_sc::imports!();
        multiversx_sc::derive_imports!();

        use crate::{storage, zombie::Zombie};

        #[multiversx_sc::module]
        pub trait ZombieFactory: storage::Storage {
            fn create_zombie(&self, owner: ManagedAddress, name: ManagedBuffer, dna: u64) {
                self.zombies_count().update(|id| {
                    self.new_zombie_event(*id, &name, dna);
                    let cooldown_time = self.cooldown_time().get();
                    self.zombies(id).set(Zombie {
                        name,
                        dna,
                        level: 1u16,
                        ready_time: self.blockchain().get_block_timestamp(),
                    });
                    self.owned_zombies(&owner).insert(*id);
                    self.zombie_owner(id).set(owner);
                    *id += 1;
                });
            }

            #[view]
            fn generate_random_dna(&self) -> u64 {
                let mut rand_source = RandomnessSource::new();
                let dna_digits = self.dna_digits().get();
                let max_dna_value = u64::pow(10u64, dna_digits as u32);
                rand_source.next_u64_in_range(0u64, max_dna_value)
            }

            #[endpoint]
            fn create_random_zombie(&self, name: ManagedBuffer) {
                let caller = self.blockchain().get_caller();
                require!(
                    self.owned_zombies(&caller).is_empty(),
                    "You already own a zombie"
                );
                let rand_dna = self.generate_random_dna();
                self.create_zombie(caller, name, rand_dna);
            }

            #[event("new_zombie_event")]
            fn new_zombie_event(
                &self,
                #[indexed] zombie_id: usize,
                name: &ManagedBuffer,
                #[indexed] dna: u64,
            );
        }
      "storage.rs": |
        multiversx_sc::imports!();
        multiversx_sc::derive_imports!();

        use crate::zombie::Zombie;

        #[multiversx_sc::module]
        pub trait Storages {
            #[storage_mapper("dna_digits")]
            fn dna_digits(&self) -> SingleValueMapper<u8>;

            #[storage_mapper("zombies_count")]
            fn zombies_count(&self) -> SingleValueMapper<usize>;

            #[view]
            #[storage_mapper("zombies")]
            fn zombies(&self, id: &usize) -> SingleValueMapper<Zombie<Self::Api>>;

            #[storage_mapper("zombie_owner")]
            fn zombie_owner(&self, id: &usize) -> SingleValueMapper<ManagedAddress>;

            #[storage_mapper("crypto_kitties_sc_address")]
            fn crypto_kitties_sc_address(&self) -> SingleValueMapper<ManagedAddress>;

            #[storage_mapper("owned_zombies")]
            fn owned_zombies(&self, owner: &ManagedAddress) -> UnorderedSetMapper<usize>;

            #[storage_mapper("cooldown_time")]
            fn cooldown_time(&self) -> SingleValueMapper<u64>;
        }
      "lib.rs": |
        #![no_std]

        multiversx_sc::imports!();
        multiversx_sc::derive_imports!();

        mod storage;
        mod zombie;
        mod zombiefactory;
        mod zombiefeeding;

        #[multiversx_sc::contract]
        pub trait ZombiesContract:
            zombiefactory::ZombieFactory + zombiefeeding::ZombieFeeding + storage::Storage
        {
            #[init]
            fn init(&self) {
                self.dna_digits().set(16u8);
                self.cooldown_time().set(86400u64);
            }

            #[only_owner]
            #[endpoint]
            fn set_crypto_kitties_sc_address(&self, address: ManagedAddress) {
                self.crypto_kitties_sc_address().set(address);
            }
        }
      "zombiehelper.rs": |
        multiversx_sc::imports!();

        use crate::storage;

        #[multiversx_sc::module]
        pub trait ZombieHelper: storage::Storage {
            fn check_above_level(&self, level: u16, zombie_id: usize) {
                let my_zombie = self.zombies(&zombie_id).get();
                require!(my_zombie.level >= level, "Zombie is too low level");
            }
        }

        #[endpoint]
        fn change_name(&self, zombie_id: usize, name: ManagedBuffer) {
            self.check_above_level(2u16, zombie_id);
            let caller = self.blockchain().get_caller();
            require!(
                caller == self.zombie_owner(&zombie_id).get(),
                "Only the owner of the zombie can perform this operation"
            );
            self.zombies(&zombie_id)
                .update(|my_zombie| my_zombie.name = name);
        }

        #[endpoint]
        fn change_dna(&self, zombie_id: usize, dna: u64) {
            self.check_above_level(20u16, zombie_id);
            let caller = self.blockchain().get_caller();
            require!(
                caller == self.zombie_owner(&zombie_id).get(),
                "Only the owner of the zombie can perform this operation"
            );
            self.zombies(&zombie_id)
                .update(|my_zombie| my_zombie.dna = dna);
        }
    answer: >
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
---

In the previous chapter, we learned how to send Ether to a contract. So what happens after you send it?

After you send Ether to a contract, it gets stored in the contract's Ethereum account, and it will be trapped there — unless you add a function to withdraw the Ether from the contract.

You can write a function to withdraw Ether from the contract as follows:

```
contract GetPaid is Ownable {
  function withdraw() external onlyOwner {
    address payable _owner = address(uint160(owner()));
    _owner.transfer(address(this).balance);
  }
}
```

Note that we're using `owner()` and `onlyOwner` from the `Ownable` contract, assuming that was imported.

And most important for `_owner` variable that it's have to be a `address payable` type for doing a sending and transferring ether instruction.

But our `owner()` isn't a type `address payable` so we have to explicitly cast to `address payable`. Casting any integer type like `uint160` to address produces an `address payable`.

You can transfer Ether to an address using the `transfer` function, and `address(this).balance` will return the total balance stored on the contract. So if 100 users had paid 1 Ether to our contract, `address(this).balance` would equal 100 Ether.

You can use `transfer` to send funds to any Ethereum address. For example, you could have a function that transfers Ether back to the `msg.sender` if they overpaid for an item:

```
uint itemFee = 0.001 ether;
msg.sender.transfer(msg.value - itemFee);
```

Or in a contract with a buyer and a seller, you could save the seller's address in storage, then when someone purchases his item, transfer him the fee paid by the buyer: `seller.transfer(msg.value)`.

These are some examples of what makes Ethereum programming really cool — you can have decentralized marketplaces like this that aren't controlled by anyone.

## Putting it to the Test

1. Create a `withdraw` function in our contract, which should be identical to the `GetPaid` example above.

2. The price of Ether has gone up over 10x in the past year. So while 0.001 ether is about $1 at the time of this writing, if it goes up 10x again, 0.001 ETH will be $10 and our game will be a lot more expensive.

  So it's a good idea to create a function that allows us as the owner of the contract to set the `levelUpFee`.

  a. Create a function called `setLevelUpFee` that takes one argument, `uint _fee`, is `external`, and uses the modifier `onlyOwner`.

  b. The function should set `levelUpFee` equal to `_fee`.
