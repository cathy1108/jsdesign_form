exports.handler = async (event, context) => {
  const GAS_URL = process.env.MY_GAS_URL;

  if (!GAS_URL) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Missing GAS_URL environment variable" }),
    };
  }

  try {
    // 關鍵修正：將前端傳來的參數 (event.queryStringParameters) 重新組合成字串
    const qs = new URLSearchParams(event.queryStringParameters).toString();
    const finalUrl = qs ? `${GAS_URL}?${qs}` : GAS_URL;

    // 發送給 GAS，改用簡單的 GET 即可
    const response = await fetch(finalUrl, {
      method: "GET", 
      headers: { 
        "Accept": "application/json"
      }
    });

    // Google 通常會回傳 302 重導向或 HTML/JSON
    const data = await response.text();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: "Request forwarded", detail: data }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
