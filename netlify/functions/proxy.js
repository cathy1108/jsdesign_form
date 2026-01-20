exports.handler = async (event, context) => {
  // 從 Netlify 後台的 Environment variables 讀取
  const GAS_URL = process.env.MY_GAS_URL;

  // 檢查是否有設定變數
  if (!GAS_URL) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Missing GAS_URL environment variable" }),
    };
  }

  try {
    const response = await fetch(GAS_URL, {
      method: event.httpMethod,
      body: event.body,
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    });

    const data = await response.text();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // 允許前端呼叫
        "Content-Type": "application/json"
      },
      body: data,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
