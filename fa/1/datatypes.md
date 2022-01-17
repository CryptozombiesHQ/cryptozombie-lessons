---
title: State Variables & Integers
actions: ['بررسی پاسخ', 'راهنمایی']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.25;

      contract ZombieFactory {

          //start here

      }
    answer: >
      pragma solidity ^0.4.25;


      contract ZombieFactory {

          uint dnaDigits = 16;

      }
---
<div dir="rtl">

کارتون عالی بود! حالا که با ساختار کلی قرارداد آشنا شدیم بریم ببینیم متغیرها در سالیدیتی چطور تعریف می‌شن.

**_متغیرهای حالت(State variables)_**  به صورت دائم در حافظه قرارداد ذخیره می‌شن. یعنی روی بلاکچین اتریوم نوشته می‌شن. مثل نوشتن تو دیتابیس.  

##### مثال:
</div>

```
contract Example {
  // This will be stored permanently in the blockchain
  uint myUnsignedInteger = 100;
}
```
<div dir="rtl">
  
در این قرارداد نمونه، یک `uint`  به اسم  `myUnsignedInteger`  ایجاد کردیم و مقدارش رو ۱۰۰ گذاشتیم.

## اعداد صحیح بدون علامت: `uint`

نوع داده `uint` برای نمایش و ذخیره اعداد بدون علامته ینی **مقدارش حتما باید نامنفی باشه**. برای ذخیره اعداد علامت‌دار از `int` استفاده می‌کنیم.
</div>
<div dir="rtl">
  
> نکته: در سالیدیتی `uint`، نام مستعار nt256` است، یک عدد صحیح بدون علامت ۲۵۶ بیتی. می‌تونین uintها رو با تعداد بیت کمتری هم ذخیره کنین- `uint8`، `uint16`، `uint32` و الی آخر. اما در کل معمولا از `uint` استفاده میشه جز در موارد خاصی که بعدا درباره‌ش صحبت می‌کنیم.
</div>

<div dir="rtl">

# دست به کد شو

قراره DNA زامبی ما یک عدد ۱۶ بیتی باشه.

یک `uint` به اسم `dnaDigits` با مقدار ۱۶ بسازین.

</div>
