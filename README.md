# CryptoZombies - İçerik Yerelleştirme

Bu depo CryptoZombies'i diğer dillere çevirmek için kullanılır.

Tüm çeviriler için kullanılması gereken kaynak içeriği `en` klasörünün içindedir.

```
en/
  1/ - content of Lesson 1
  ...
  N/ - content of Lesson N
  index.json - strings used in the UI
  share-template-msgs.json - strings used on the share page
```
 
`index.json` ve `share-template-msgs.json` içindeki satırlar parametreler içerebilir,
bunlar satırlar kullanıcıya gösterilmeden önce enjekte edilecektir. Mantıklıysa
kaynak satırlarında sunulan parametreler çevrilen satırlarda herhangi bir pozisyonda
görünebilir veya tamamen çıkarılır.

>NOT: Söz dizimi iki `.json` dosyası arasında farklılık gösteren parametreleri
>      temsil etmek için kullanılır. `share-template-msgs.json` parametreleri
>      `{{ .ParameterName }}` kullanılarak belirtilirken, `index.json` parametreleri
>      `{parameterName}` kullanılarak belirtilir.

## Yeni bir dil için lokalize etme
1. Yeni bir branch oluşturun `master`.
2. Yerel koddan sonra isimlendirilen yeni bir klasör oluşturun, örn. `jp` (Japonca için), `zh` (Çince için).
3. İçeriği çevirin.
4. Yeni klasöre `index.ts` ekleyin.
5. Kök klasördeki `index.ts`yi güncelleyin .
6. `master`a bir pull request bildirin.

## Kaynak İçeriği veya Lokalize Edilmiş İçeriği Düzenleme
1. Yeni bir branch oluşturun `master`.
2. Düzenle düzenle düzenle.
3. `master`a bir pull request bildirin.



## Lisans

Katkı sağlayanlar yaptıkları her katkı için Loom Network arkasında telif atamalıdırlar.
Loom Network orijinal içerikten her türetilen çalışma mülkiyetini elinde tutar.
