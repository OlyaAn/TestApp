using DocumentFormat.OpenXml.Packaging;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using TestApp.Models;

namespace TestApp.Services
{
    public class FilesService: IFilesService
    {
        private readonly IMemoryCache _cache;

        public FilesService(IMemoryCache cache)
        {
            _cache = cache;
        }

        public List<UploadDocumentResponse> GetFilesFromCache(string userIp)
        {
            _cache.TryGetValue($"UploadDocuments_{userIp}", out var documents);
            return JsonConvert.DeserializeObject<List<UploadDocumentResponse>>(documents.ToString());
        }

        public void SaveFilesToCache(List<IFormFile> files, string userIp)
        {
            var documents = new List<UploadDocumentResponse>();
            files.ForEach(file =>
            {
                using var reader = new StreamReader(file.OpenReadStream());
                var stream = reader.BaseStream;

                using var wordDocument = WordprocessingDocument.Open(stream, false);
                var body = wordDocument.MainDocumentPart.Document.Body;
                documents.Add(new UploadDocumentResponse
                {
                    Body = body.InnerText,
                    Size = stream.Length,
                    FileName = file.FileName,
                    Author = wordDocument.PackageProperties.Creator
                });
            });

            _cache.Remove($"UploadDocuments_{userIp}");
            _cache.Set($"UploadDocuments_{userIp}", JsonConvert.SerializeObject(documents),
                new MemoryCacheEntryOptions()
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1)
                });
        }
    }
}
