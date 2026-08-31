using Microsoft.EntityFrameworkCore;
using SwiftERP.Application.Common.Exceptions;
using SwiftERP.Application.Interfaces;
using SwiftERP.Domain.Entities;

namespace SwiftERP.Infrastructure.Storage;

public class LocalDocumentService : IDocumentService
{
    private readonly IApplicationDbContext _context;
    private readonly string _uploadDirectory;

    public LocalDocumentService(IApplicationDbContext context)
    {
        _context = context;
        _uploadDirectory = Path.Combine(AppContext.BaseDirectory, "uploads");
        if (!Directory.Exists(_uploadDirectory))
        {
            Directory.CreateDirectory(_uploadDirectory);
        }
    }

    public async Task<DocumentAttachmentDto> UploadAttachmentAsync(string entityType, int entityId, Stream fileStream, string fileName, string contentType, long size)
    {
        var ext = Path.GetExtension(fileName);
        var storedFileName = $"{Guid.NewGuid()}{ext}";
        var filePath = Path.Combine(_uploadDirectory, storedFileName);

        using (var destStream = new FileStream(filePath, FileMode.Create, FileAccess.Write))
        {
            await fileStream.CopyToAsync(destStream);
        }

        var attachment = new DocumentAttachment
        {
            EntityType = entityType,
            EntityId = entityId,
            FileName = fileName,
            StoredFileName = storedFileName,
            FilePath = filePath,
            ContentType = contentType,
            FileSizeBytes = size
        };

        _context.DocumentAttachments.Add(attachment);
        await _context.SaveChangesAsync();

        return new DocumentAttachmentDto
        {
            Id = attachment.Id,
            EntityType = attachment.EntityType,
            EntityId = attachment.EntityId,
            FileName = attachment.FileName,
            ContentType = attachment.ContentType,
            FileSizeBytes = attachment.FileSizeBytes,
            CreatedAtUtc = attachment.CreatedAtUtc
        };
    }

    public async Task<(Stream stream, string contentType, string fileName)> DownloadAttachmentAsync(int attachmentId)
    {
        var att = await _context.DocumentAttachments.FirstOrDefaultAsync(a => a.Id == attachmentId && !a.IsDeleted)
            ?? throw new NotFoundException("DocumentAttachment", attachmentId);

        if (!File.Exists(att.FilePath))
            throw new NotFoundException("DocumentAttachmentFile", att.FilePath);

        var stream = new FileStream(att.FilePath, FileMode.Open, FileAccess.Read, FileShare.Read);
        return (stream, att.ContentType, att.FileName);
    }

    public async Task<List<DocumentAttachmentDto>> GetAttachmentsAsync(string entityType, int entityId)
    {
        return await _context.DocumentAttachments
            .Where(a => a.EntityType == entityType && a.EntityId == entityId && !a.IsDeleted)
            .OrderByDescending(a => a.CreatedAtUtc)
            .Select(a => new DocumentAttachmentDto
            {
                Id = a.Id,
                EntityType = a.EntityType,
                EntityId = a.EntityId,
                FileName = a.FileName,
                ContentType = a.ContentType,
                FileSizeBytes = a.FileSizeBytes,
                CreatedAtUtc = a.CreatedAtUtc
            }).ToListAsync();
    }
}
