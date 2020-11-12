using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using TestApp.Models;
using TestApp.Services;


namespace TestApp.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FilesController : ControllerBase
    {
        private readonly IFilesService _service;
        private IHttpContextAccessor _accessor;

        public FilesController(IFilesService service, IHttpContextAccessor accessor)
        {
            _service = service;
            _accessor = accessor;
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult UploadDocuments([FromForm]List<IFormFile> documents)
        {
            var connectionId = _accessor.HttpContext.Connection.RemoteIpAddress.ToString();
            _service.SaveFilesToCache(documents, connectionId);
            return Ok();
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<List<UploadDocumentResponse>> Analyze()
        {
            var connectionId = _accessor.HttpContext.Connection.RemoteIpAddress.ToString();
            var documents = _service.GetFilesFromCache(connectionId);
            return Ok(documents);
        }
    }
}
