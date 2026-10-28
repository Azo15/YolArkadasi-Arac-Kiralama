using System.Net.Http.Json;
using VehicleRentalApp.Models;

namespace VehicleRentalApp.Services;

public sealed class CarService(HttpClient httpClient)
{
    public async Task<IReadOnlyList<Car>> GetCarsAsync(CancellationToken cancellationToken = default)
    {
        var cars = await httpClient.GetFromJsonAsync<List<Car>>("data/cars.json", cancellationToken);
        return cars ?? [];
    }
}
