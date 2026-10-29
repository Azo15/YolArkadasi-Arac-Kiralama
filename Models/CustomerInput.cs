using System.ComponentModel.DataAnnotations;

namespace VehicleRentalApp.Models;

public sealed class CustomerInput
{
    [Required(ErrorMessage = "Ad soyad alanı zorunludur.")]
    [StringLength(80, MinimumLength = 3, ErrorMessage = "Ad soyad 3–80 karakter arasında olmalıdır.")]
    public string CustomerName { get; set; } = string.Empty;

    [Required(ErrorMessage = "E-posta alanı zorunludur.")]
    [EmailAddress(ErrorMessage = "Geçerli bir e-posta adresi girin.")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Telefon alanı zorunludur.")]
    [Phone(ErrorMessage = "Geçerli bir telefon numarası girin.")]
    [StringLength(20, MinimumLength = 10, ErrorMessage = "Telefon numarası 10–20 karakter arasında olmalıdır.")]
    public string Phone { get; set; } = string.Empty;
}
