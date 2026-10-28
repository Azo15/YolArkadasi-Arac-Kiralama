using System.Text.Json;
using Microsoft.JSInterop;
using VehicleRentalApp.Models;

namespace VehicleRentalApp.Services;

public sealed class BookingState(IJSRuntime jsRuntime)
{
    private const string StorageKey = "yolarkadasi.bookings.v1";
    private bool _loaded;

    public List<CarBooking> Bookings { get; private set; } = [];
    public event Action? Changed;

    public async Task EnsureLoadedAsync()
    {
        if (_loaded) return;
        try
        {
            var json = await jsRuntime.InvokeAsync<string?>("yolArkadasiStorage.get", StorageKey);
            Bookings = string.IsNullOrWhiteSpace(json)
                ? []
                : JsonSerializer.Deserialize<List<CarBooking>>(json) ?? [];
        }
        catch (InvalidOperationException)
        {
            // Browser storage is unavailable during prerendering; load again from an interactive page.
            return;
        }
        _loaded = true;
    }

    public bool HasConflict(string carId, DateTime pickup, DateTime dropoff) => Bookings.Any(booking =>
        !booking.IsCancelled && booking.CarId == carId && pickup.Date < booking.ReturnDate.Date && dropoff.Date > booking.PickupDate.Date);

    public async Task AddAsync(CarBooking booking)
    {
        await EnsureLoadedAsync();
        if (HasConflict(booking.CarId, booking.PickupDate, booking.ReturnDate))
            throw new InvalidOperationException("Bu araç seçilen tarihlerde başka bir rezervasyona sahip.");

        Bookings.Insert(0, booking);
        await PersistAsync();
    }

    public async Task<bool> CancelAsync(string bookingId)
    {
        await EnsureLoadedAsync();
        var booking = Bookings.FirstOrDefault(item => item.Id == bookingId);
        if (booking is null || booking.IsCancelled || booking.PickupDate.Date <= DateTime.Today) return false;
        booking.IsCancelled = true;
        await PersistAsync();
        return true;
    }

    private async Task PersistAsync()
    {
        var json = JsonSerializer.Serialize(Bookings);
        await jsRuntime.InvokeVoidAsync("yolArkadasiStorage.set", StorageKey, json);
        Changed?.Invoke();
    }
}
