namespace VehicleRentalApp.Services;

public sealed class RentalState
{
    public string? SelectedCarId { get; private set; }
    public DateTime PickupDate { get; private set; } = DateTime.Today.AddDays(1);
    public DateTime ReturnDate { get; private set; } = DateTime.Today.AddDays(2);
    public HashSet<string> SelectedExtraIds { get; private set; } = [];

    public event Action? OnChange;

    public void StartNewRental(string carId, DateTime pickupDate, DateTime returnDate)
    {
        SelectedCarId = carId;
        PickupDate = pickupDate.Date;
        ReturnDate = returnDate.Date;
        SelectedExtraIds.Clear();
        NotifyChanged();
    }

    public void SetCar(string? carId)
    {
        if (SelectedCarId == carId) return;
        SelectedCarId = carId;
        NotifyChanged();
    }

    public void SetDates(DateTime pickupDate, DateTime returnDate)
    {
        if (PickupDate == pickupDate && ReturnDate == returnDate) return;
        PickupDate = pickupDate;
        ReturnDate = returnDate;
        NotifyChanged();
    }

    public void ToggleExtra(string extraId, bool isSelected)
    {
        var changed = isSelected
            ? SelectedExtraIds.Add(extraId)
            : SelectedExtraIds.Remove(extraId);

        if (changed) NotifyChanged();
    }

    private void NotifyChanged() => OnChange?.Invoke();
}
