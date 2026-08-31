namespace SwiftERP.Application.Common.Exceptions;

public class NotFoundException : Exception
{
    public NotFoundException(string name, object key)
        : base($"Entity '{name}' ({key}) was not found.") { }
}

public class ValidationException : Exception
{
    public IDictionary<string, string[]> Errors { get; }

    public ValidationException(IDictionary<string, string[]> errors)
        : base("One or more validation failures have occurred.")
    {
        Errors = errors;
    }
}

public class InsufficientStockException : Exception
{
    public string SKU { get; }
    public int Requested { get; }
    public int Available { get; }

    public InsufficientStockException(string sku, int requested, int available)
        : base($"Insufficient stock for product '{sku}'. Requested: {requested}, Available: {available}.")
    {
        SKU = sku;
        Requested = requested;
        Available = available;
    }
}

public class ConcurrencyConflictException : Exception
{
    public ConcurrencyConflictException(string message) : base(message) { }
}
