using System.Net.Http;
using System.Net.Http.Headers;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class ImgurController : ControllerBase
{
    private readonly IHttpClientFactory _clientFactory;
    private const string IMGUR_CLIENT_ID = "7342a2deec81630";

    public ImgurController(IHttpClientFactory clientFactory)
    {
        _clientFactory = clientFactory;
    }

    [HttpPost("upload")]
    public async Task<IActionResult> UploadImage(IFormFile image)
    {
        try
        {
            var client = _clientFactory.CreateClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
                "Client-ID",
                IMGUR_CLIENT_ID
            );

            using var formData = new MultipartFormDataContent();
            using var stream = new MemoryStream();
            await image.CopyToAsync(stream);
            formData.Add(new ByteArrayContent(stream.ToArray()), "image", image.FileName);

            var response = await client.PostAsync("https://api.imgur.com/3/image", formData);
            var result = await response.Content.ReadAsStringAsync();

            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}
