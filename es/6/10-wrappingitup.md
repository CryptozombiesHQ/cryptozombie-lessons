---
title: Wrapping It Up
actions: [ 'checkAnswer', 'hints' ]
requireLogin: true
material:
  saveZombie: false
  zombieDeck:
    zombie:
      lesson: 6
    hideSliders: true
    answer: 1
---

¡Felicidades! Has escrito con éxito tu primer front-end Web3.js que interactúa con tu contrato inteligente.

¡Como recompensa, obtienes tu propio zombie `The Phantom of Web3`! Nivel 3.0 (para Web 3.0 😉), completo con máscara de zorro. Puedes verlo a la derecha.

## Siguientes pasos

Esta lección fue intencionalmente básica.Queríamos mostrarte la lógica central que necesitarías para interactuar con tu contrato inteligente, pero no queríamos tomar demasiado tiempo para realizar una implementación completa ya que la porción del código Web3.js es bastante repetitiva, y no estaríamos introduciendo ningún concepto nuevo haciendo que esta lección sea más larga.

Así que dejamos esta implementación en los huesos. Si quieres correr con esto y construirlo por tu cuenta:

1. Implementa funciones para `attack`, `changeName`, `changeDna`, y las funciones ERC721 `transfer`, `ownerOf`, `balanceOf`, etc. La implementación de estas funciones sería idéntica a todas las demás transacciones `send` que cubrimos.

2. Implementa una "página admin" donde puedas ejecutar `setKittyContractAddress`, `setLevelUpFee`, y `withdraw`. Otra vez, no hay una lógica especial en el front-end aquí — estas implementaciones serían idénticas a las funciones que ya hemos cubierto. Solamente deberías asegurarte de haberlas llamado desde la misma dirección de Ethereum que implementamos en el contrato, ya que tienen el modificador `onlyOwner`.

3. Hay algunas vistas diferentes en la aplicación que queremos implementar:

a. Una página zombie individual, donde puedes ver información sobre un zombie específico con un enlace permanente a él. Esta página mostraría la apariencia del zombi, mostraría su nombre, su dueño (con un enlace a la página de perfil del usuario), su recuento de victorias/derrotas, su historial de batalla, etc.

b. Una página de usuario, donde puedes ver el ejército zombie de un usuario con un enlace permanente. Podrías hacer clic en un zombie individual para ver su página, y también hacer clic en un zombie para atacarlo si estás conectado a MetaMask y tienes un ejército.

c. Una página de inicio, que es una variación de la página de usuario que muestra el ejército zombie del usuario actual. (Esta es la página que comenzamos a implementar en index.html).

4. Algún método en la interfaz de usuario que permite al usuario alimentarse de CryptoKitties. Podríamos tener un botón por cada zombie en la página de inicio que diga "Feed Me", a continuación, un cuadro de texto que solicite al usuario ingresar la identificación de un "kitty" (o una URL a ese "kitty", ejemplo; <a href="https://www.cryptokitties.co/kitty/578397" target=_blank>https://www.cryptokitties.co/kitty/578397</a>). Esto dispararía nuestra función `feedOnKitty`.

5. Algún método en la interfaz de usuario (UI) para que el usuario ataque al zombi de otro usuario.

Una forma de implementar esto sería cuando el usuario esté navegando en la página de otro usuario, podría haber un botón que dijera "Atacar a este zombi". Cuando el usuario hiciera clic en él, aparecería un modal que contiene el ejército zombie del usuario actual y le indicara: "¿Con qué zombi te gustaría atacar?"

La página de inicio del usuario también podría tener un botón por cada uno de sus zombies que dijera "Atacar a un zombi".. Cuando se hiciera clic, podría aparecer un modal con un campo de búsqueda donde podrían escribir el ID de un zombie para buscarlo. O una opción diciendo "Atacar a un zombi random", que buscaría un número aleatorio para él.
También quisiéramos oscurecer a los zombis del usuario cuyo período de enfriamiento aún no haya pasado, para que la IU pueda indicar al usuario que aún no puede atacar con ese zombi, y cuánto tiempo tendrá que esperar.

Aquí hay una lista de ideas sobre las cosas que queremos implementar para hacer que nuestra interfaz sea una implementación completa para nuestro juego de zombies.

6. La página de inicio del usuario también tendría opciones para cambiar el nombre, cambiar el ADN y subir de nivel de cada zombi (por una tarifa). Las opciones se atenuarán si el usuario aún no tiene el nivel suficiente.

7. Para los nuevos usuarios, debemos mostrar un mensaje de bienvenida con un mensaje para crear el primer zombie en su ejército, que llama a `createRandomZombie()`.

8. Probablemente querríamos agregar un evento `Attack` a nuestro contrato inteligente con la `dirección` del usuario como una propiedad `indexed`, como se discutió en el último capítulo. Esto nos permitiría crear notificaciones en tiempo real — podríamos mostrar al usuario una alerta emergente cuando uno de sus zombies fue atacado, para que pudieran ver al usuario/zombie que los atacó y tomar represalias.

9. Probablemente también querríamos implementar algún tipo de capa de caché frontal, por lo que no siempre estamos volviendo loco a Infura con solicitudes de la misma información. (Nuestra implementación actual de `displayZombies` llama a `getZombieDetails` para cada zombie cada vez que actualizamos la interfaz — pero, en realidad, solo tenemos que llamar a estas funciones al nuevo zombie que se ha agregado a nuestro ejército).

10. Una sala de chat en tiempo real para que puedas hablar mal de otros jugadores mientras aplastas a su ejército zombi :P
    Eso es solo un comienzo — Estoy seguro de que podríamos encontrar aún más características — y ya es una lista masiva. Yes plz.

That's just a start — I'm sure we could come up with even more features — and already it's a massive list.

Dado que hay un montón de código de front-end que entraría en la creación de una interfaz completa como esta (HTML, CSS, JavaScript y un framework tipo React o Vue.js), construir todo este front-end probablemente sea un curso completo con 10 lecciones en sí mismo. Así que te dejamos la impresionante implementación para ti.

> Nota: Aunque nuestro contrato inteligente está descentralizado, este front-end para interactuar con nuestro DApp estaría totalmente centralizado en nuestro servidor web en alguna parte.
>
> No obstante, con el SDK que estamos construyendo en <a href="https://medium.com/loom-network/loom-network-is-live-scalable-ethereum-dapps-coming-soon-to-a-dappchain-near-you-29d26da00880" target=_blank>Loom Network</a>, pronto podrás servir front-ends como este desde su DAppChain en lugar de un servidor web centralizado. De esa manera entre Ethereum y el Loom DAppChain, toda tu aplicación se ejecutará al 100% en la blockchain.

## Conclusión

Esto concluye la Lección 6. ¡Ahora tienes todas las habilidades que necesitas para codificar un contrato inteligente y un front-end que permite a los usuarios interactuar con él!

En la próxima lección, vamos a cubrir la última pieza que falta en este rompecabezas — desplegar tus contratos inteligentes a Ethereum.

¡Sigue adelante y haz clic en "Capítulo siguiente" para reclamar tus recompensas!
