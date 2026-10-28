# YolArkadaşı | Araç Kiralama ve Rezervasyon

Blazor ile geliştirilen, araçları inceleme ve filtreleme; kiralama tarihleri ile ek hizmetleri seçme; fiyatı anlık hesaplama ve rezervasyonları takip etme özelliklerine sahip eğitim amaçlı bir web uygulaması.

## Teknoloji

- .NET 9 ve Blazor Web App (Interactive Server)
- C# ve Razor bileşenleri
- JSON tabanlı örnek araç verisi
- Tarayıcı `localStorage` kalıcılığı

## Geliştirme durumu

Proje başlangıç aşamasındadır. Özellikler, ödev yönergesindeki değerlendirme ölçütlerini karşılayacak şekilde aşamalı olarak eklenecektir. Gerçek ödeme, sunucu veritabanı ve çok kullanıcılı eşzamanlı rezervasyon bu eğitim prototipinin kapsamında değildir.

## Çalıştırma

Güncel .NET 9 SDK kurulduktan sonra proje klasöründe:

```powershell
dotnet run
```

## Ödevin hedef ölçütleri

- `cars.json` içinden asenkron yüklenen en az 12 araç ve en az 3 kategori
- Marka, kategori, yakıt, vites ve günlük ücret filtreleri
- Bileşen tabanlı Razor arayüzü; `[Parameter]` ve `EventCallback` veri akışı
- Tarih doğrulama, gün hesabı, ek hizmet seçimi ve anlık toplam ücret
- `EditForm`, Data Annotations doğrulaması ve müşteri bilgileri
- Çakışan tarihleri engelleme; rezervasyon oluşturma ve uygun rezervasyonu iptal etme
- Scoped durum servisi ve yenileme sonrasında korunan `localStorage` verileri
- Responsive tasarım, bileşen bazlı scoped CSS, `proje.txt`, ZIP teslimi ve anlatım videosu

## Teslim hazırlığı

Grup üyelerinin öğrenci numarası, adı-soyadı ve katkıları `proje.txt` dosyasında teslimden önce tamamlanmalıdır. Proje tek kişiyle yürütülüyorsa yalnızca gerçek katkı bilgileri yazılmalıdır.
