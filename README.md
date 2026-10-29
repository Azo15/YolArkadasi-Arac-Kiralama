# YolArkadaşı — Araç Kiralama ve Rezervasyon

.NET 9 ve Blazor Interactive Server ile hazırlanmış eğitim amaçlı araç kiralama uygulaması. Araç kataloğu, filtreleme, tarih ve ek hizmet seçimi, canlı fiyat özeti, rezervasyon oluşturma ve rezervasyon takibi içerir.

## Özellikler

- `wwwroot/data/cars.json` içinden `CarService` ve `HttpClient` ile asenkron yüklenen 15 araç, 4 kategori
- Marka/model araması; kategori, yakıt, vites ve maksimum günlük fiyat filtreleri
- Öne çıkan araç slaytı ve responsive araç kartları
- Teslim/iade tarihi seçimi, ek hizmetler ve anlık toplam ücret hesabı
- Data Annotations ile ad, e-posta ve telefon doğrulaması
- Aynı araç için tarih çakışma kontrolü; rezervasyon oluşturma, durum gösterimi ve uygun rezervasyonu iptal etme
- `BookingState` üzerinden tarayıcı `localStorage` alanında kalıcılık
- Bileşen bazlı Scoped CSS ve ortak `wwwroot/app.css` stilleri

## Teknolojiler ve yapı

- .NET 9, C#, Razor Components, Blazor Interactive Server
- `Components/Pages/Home.razor`: `/` ve `/cars` — ana sayfa, araç vitrini ve katalog
- `Components/Shared/CarList.razor`: katalog arama ve filtreleme
- `Components/Pages/Rent.razor`: `/cars/{id}/rent` — kiralama akışı
- `RentalOptions.razor`, `RentalSummary.razor`, `CustomerForm.razor`: tarih/ek hizmet, fiyat özeti ve doğrulamalı form
- `Components/Pages/MyBookings.razor`: `/my-bookings` — rezervasyon listesi ve iptal
- `CarService`: JSON araç kataloğunu yükler
- `RentalState`: seçili araç, tarihler ve ek hizmetleri tutar
- `BookingState`: rezervasyonları ve çakışma/iptal durumlarını yönetir

Rezervasyon verisi aynı tarayıcı profiline ait `localStorage` alanında saklanır. Bu eğitim prototipinde merkezi veritabanı, gerçek ödeme ve farklı kullanıcı/tarayıcılar arasında ortak rezervasyon altyapısı bulunmaz.

## Çalıştırma

.NET 9 SDK gerekir. Proje klasöründe:

```powershell
dotnet run
```

Varsayılan HTTP profili `http://localhost:5216` adresinde çalışır.

## Sunum için kısa kontrol listesi

1. `/cars` sayfasında katalog ve araç bilgilerini gösterin.
2. Arama, kategori, yakıt, vites ve maksimum fiyat filtrelerini deneyin.
3. Araç seçip tarihleri ve ek hizmetleri değiştirin; fiyat özetinin güncellendiğini gösterin.
4. Form doğrulamasını hatalı ve geçerli bilgilerle gösterin; rezervasyon kodunu belirtin.
5. Çakışan tarih uyarısını ve çakışmayan tarih seçimini gösterin.
6. `/my-bookings` sayfasında yenileme sonrası kalıcılığı ve iptal bildirimini gösterin.
7. Geniş/mobil görünümü ve ana bileşenlerin görevlerini kısaca tanıtın.

Teslimden önce uygulama akışlarını elle deneyin, anlatım videosunu kaydedin ve video ile proje kaynaklarını ZIP/RAR paketine ekleyin. Videoda denemediğiniz özellikleri çalışıyor gibi sunmayın.
