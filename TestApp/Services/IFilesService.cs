using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Microsoft.Office.Interop.Word;
using TestApp.Models;

namespace TestApp.Services
{
    public interface IFilesService
    {
        List<UploadDocumentResponse> GetFilesFromCache(string userIp);
        void SaveFilesToCache(List<IFormFile> files, string userIp);
    }
}
