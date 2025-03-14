---
# title: "Contracts"
title: "Hợp đồng"
actions: ['checkAnswer', 'hints']
material: 
  editor:
    language: sol
    startingCode: |
      pragma solidity // 1. Điền phiên bản Solidity vào đây

      // 2. Viết hợp đồng ở đây
    answer: > 
      pragma solidity >=0.5.0 <0.6.0;


      contract ZombieFactory {

      }
---

<!-- Starting with the absolute basics: -->
Ta bắt đầu từ những bước cơ bản nhất:

<!-- Solidity's code is encapsulated in **contracts**. A `contract` is the fundamental building block of Ethereum applications — all variables and functions belong to a contract, and this will be the starting point of all your projects. -->
Mã Solidity được đóng gói trong các **hợp đồng**. `Hợp đồng` là viên gạch cơ bản nhất để xây ứng dụng Ethereum - tất cả các biến và hàm đều thuộc về một hợp đồng, và cũng chính hợp đồng sẽ là điểm khởi đầu cho tất cả các dự án của ngươi.

<!-- An empty contract named `HelloWorld` would look like this: -->
Một hợp đồng rỗng mang tên `HelloWorld` (`ChàoThếGiới` ) sẽ trông như thế này:

```
contract HelloWorld {

}
```

<!-- ## Version Pragma -->
## Chỉ thị Phiên bản (Version Pragma)

<!-- All solidity source code should start with a "version pragma" — a declaration of the version of the Solidity compiler this code should use. This is to prevent issues with future compiler versions potentially introducing changes that would break your code. -->
Tất cả mã nguồn Solidity nên bắt đầu với một "chỉ thị phiên bản" - một khai báo về phiên bản compiler Solidity tương thích với mã nguồn này. Đây là để ngăn chặn các lỗi có thể xảy ra với mã nguồn của ngươi do không tương thích với các phiên bản compiler mới hơn.

<!-- For the scope of this tutorial, we'll want to be able to compile our smart contracts with any compiler version in the range of 0.5.0 (inclusive) to 0.6.0 (exclusive).
It looks like this: `pragma solidity >=0.5.0 <0.6.0;`. -->
Trong khuôn khổ của khóa học này, ngươi sẽ muốn biên dịch (compile) các hợp đồng thông minh (smart contract) của ngươi với compiler trong khoảng phiên bản từ ít nhất 0.5.0 đến thấp hơn 0.6.0.

<!-- Putting it together, here is a bare-bones starting contract — the first thing you'll write every time you start a new project: -->
Sau khi tổng hợp lại, dưới đây là khung xương một hợp đồng đơn giản nhất - cũng là những dòng đầu tiên ngươi sẽ viết mỗi khi bắt đầu một dự án mới:

```
pragma solidity >=0.5.0 <0.6.0; // trình báo phiên bản compiler

// hợp đồng HelloWorld
contract HelloWorld {

}
```

<!-- # Put it to the test -->
# Thực hành xem!

<!-- To start creating our Zombie army, let's create a base contract called `ZombieFactory`. -->
Để bắt đầu xây dựng đội quân Zombie của ngươi, hãy tạo một hợp đồng gốc có tên `ZombieFactory`.

<!-- 1. In the box to the right, make it so our contract uses solidity version `>=0.5.0 <0.6.0`. -->
1. Trong hộp bên phải, hãy đảm bảo hợp đồng của ngươi sử dụng phiên bản solidity `>=0.5.0 <0.6.0`.

<!-- 2. Create an empty contract called `ZombieFactory`. -->
2. Tạo một hợp đồng rỗng có tên `ZombieFactory`.

<!-- When you're finished, click "check answer" below. If you get stuck, you can click "hint". -->
Khi ngươi hoàn tất, hãy nhấn "Kiểm tra đáp án" (check answer) bên dưới. Nếu ngươi bí, có thể nhấn "Gợi ý" (hint).
