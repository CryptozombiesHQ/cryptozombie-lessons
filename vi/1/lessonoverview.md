---
title: Sơ lược Bài học
actions: ['checkAnswer', 'hints']
skipCheckAnswer: true
material:
  saveZombie: false
  zombieResult:
    hideNameField: true
    ignoreZombieCache: true
    answer: 1
---

<!-- In Lesson 1, you're going to build a "Zombie Factory" to build an army of zombies. -->
Trong Bài 1, ngươi sẽ xây một "Nhà máy Zombie" để từ đó dựng một đội quân Zombie.

<!-- * Our factory will maintain a database of all zombies in our army
* Our factory will have a function for creating new zombies
* Each zombie will have a random and unique appearance -->

* Nhà máy sẽ duy trì một cơ sở dữ liệu (database) về tất cả Zombie trong đội quân
* Nhà máy sẽ đi kèm một hàm (function) để tạo ra Zombie mới
* Mỗi Zombie sẽ có một hình dáng ngẫu nhiên và duy nhất

<!-- In later lessons, we'll add more functionality, like giving zombies the ability to attack humans or other zombies! But before we get there, we have to add the basic functionality of creating new zombies. -->
Ở những bài sau, ngươi sẽ thêm nhiều tính năng hơn, như cho phép Zombie tấn công con người hoặc các Zombie khác! Nhưng trước đó, nhà máy phải có tính năng cơ bản để tạo ra Zombie mới đã.

<!-- ## How Zombie DNA Works -->
## Cách Hoạt động của DNA Zombie

<!-- The zombie's appearance will be based on its "Zombie DNA". Zombie DNA is simple — it's a 16-digit integer, like: -->
Hình dán của Zombie sẽ dựa trên "DNA Zombie". DNA Zombie là một số nguyên 16 chữ số, chẳng hạn:

```
8356281049284737
```

<!-- Just like real DNA, different parts of this number will map to different traits. The first 2 digits map to the zombie's head type, the second 2 digits to the zombie's eyes, etc. -->
Cũng giống như DNA thật, mỗi phần của số này sẽ quy định một đặc tính. 2 chữ số đầu sẽ quy định loại đầu cho Zombie, 2 chữ số tiếp theo sẽ quy định loại mắt, v.v.

<!-- > Note: For this tutorial, we've kept things simple, and our zombies can have only 7 different types of heads (even though 2 digits allow 100 possible options). Later on we could add more head types if we wanted to increase the number of zombie variations. -->
> Ghi chú: Để đơn giản, trong bài hướng dẫn này, Zombie sẽ chỉ có 7 loại đầu khác nhau (mặc dù 2 chữ số cho phép tận 100 lựa chọn khác nhau). Sau này, ngươi có thể thêm nhiều loại đầu hơn nếu muốn tăng số biến thể Zombie.

<!-- For example, the first 2 digits of our example DNA above are `83`. To map that to the zombie's head type, we do `83 % 7 + 1` = 7. So this Zombie would have the 7th zombie head type.  -->
Ví dụ, 2 chữ số đầu của DNA trên là `83`. Để quy định loại đầu cho Zombie, ngươi chỉ cần thực hiện `83 % 7 + 1` = 7. Theo đó, Zombie này sẽ có loại đầu thứ 7.

<!-- In the panel to the right, go ahead and move the `head gene` slider to the 7th head (the Santa hat) to see what trait the `83` would correspond to. -->
Trong cửa sổ bên phải, ngươi hãy thử di chuyển thanh trượt `head gene` (gien đầu) đến loại đầu thứ 7 (mũ Giáng Sinh) để xem đặc tính tương ứng với `83`.

<!-- # Put it to the test -->
# Thực hành xem!

<!-- 1. Play with the sliders on the right side of the page. Experiment to see how the different numerical values correspond to different aspects of the zombie's appearance. -->
1. Hãy thử chơi với các thanh trượt bên phải đây. Thí nghiệm xem các giá trị số khác nhau sẽ ảnh hưởng hình dáng Zombie khác nhau như thế nào.

<!-- Ok, enough playing around. When you're ready to continue, hit "Next Chapter" below, and let's dive into learning Solidity! -->
Chơi chút thế thôi. Khi ngươi đã sẵn sàng tiếp tục, hãy nhấn "Next Chapter" (Chương tiếp theo) bên dưới, và cùng lao đầu vào học Solidity!