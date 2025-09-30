# app.py
import os
import requests  # 导入requests库
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from flask_cors import CORS

# 加载 .env 文件中的环境变量 (例如 ECNU_API_KEY)
load_dotenv()

# --- 封装大模型调用 (使用 requests) ---
def call_llm_api(repo_data):
    """
    使用从前端接收到的仓库数据来构造一个 prompt，并直接通过 HTTP 请求调用大模型 API。

    参数:
    repo_data (dict): 包含仓库信息的字典。

    返回:
    str: 大模型生成的分析文本。
    """
    # 1. 获取 API Key 和 API Endpoint
    api_key = os.getenv("ECNU_API_KEY")
    api_url = "https://chat.ecnu.edu.cn/open/api/v1/chat/completions"
    # api_url = "https://api.deepseek.com/chat/completions"
    if not api_key:
        return "错误：ECNU_API_KEY 未设置。请在 .env 文件中配置您的 API 密钥。"

    # 2. 根据前端数据构造 Prompt
    prompt = f"""
    你是一名专业的开源项目分析师。请根据以下数据对 GitHub 仓库进行分析：
    - 仓库名称: {repo_data.get('repoName', '未知')}
    - OpenRank趋势: {repo_data.get('openrank', '未知')}
    - 贡献活跃度趋势: {repo_data.get('activity', '未知')}
    - 社区服务与支撑: {repo_data.get('participant', '未知')}
    - 用户欢迎度: {repo_data.get('attention', '未知')}

    请从以下几个方面给出你的分析报告：
    1. 项目健康度评估。
    2. 潜在的风险点。
    3. 给项目维护者的运营建议。

    请用中文回答，不要使用markdown的格式，直接纯文本输出。
    """

    # 3. 设置HTTP请求的 Headers
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + api_key
    }

    # 4. 构造发送给API的JSON数据体 (Payload)
    payload = {
        "model": "ecnu-max",  # ECNU平台支持的模型名，按需调整
        "messages": [
            {"role": "system", "content": "你是一名顶级的开源项目分析师。"},
            {"role": "user", "content": prompt}
        ],
        "stream": False
        # "temperature": 0.7,
        # "max_tokens": 500
    }

    try:
        # 5. 使用 requests 发送 POST 请求
        response = requests.post(api_url, headers=headers, json=payload, timeout=30) # 设置30秒超时

        # 检查响应状态码，如果不是2xx，则会抛出HTTPError异常
        response.raise_for_status()

        # 6. 解析返回的JSON数据并提取结果
        response_json = response.json()
        # ECNU返回格式可能不同，需根据实际返回结构调整
        if "choices" in response_json:
            analysis_result = response_json["choices"][0]["message"]["content"]
        elif "data" in response_json and "choices" in response_json["data"]:
            analysis_result = response_json["data"]["choices"][0]["message"]["content"]
        else:
            analysis_result = str(response_json)
        return analysis_result.strip()

    except requests.exceptions.RequestException as e:
        # 处理网络请求相关的异常
        print(f"请求大模型API时发生网络错误: {e}")
        return f"调用大模型API时发生网络错误: {e}"
    except Exception as e:
        # 处理其他所有异常（如JSON解析失败、Key不存在等）
        print(f"调用大模型API时发生未知错误: {e}")
        return f"调用大模型API时发生未知错误: {e}"


# --- Flask 应用部分 (与之前版本相同) ---
app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])  # 只允许前端开发端口跨域

@app.route('/hello' , methods=['GET'])
def hello():
    return jsonify({"message": "Hello, World!"})


@app.route('/api/analyze', methods=['POST'])
def analyze_repository():
    if not request.is_json:
        return jsonify({"error": "请求格式错误，需要为 application/json"}), 400

    data = request.get_json()

    if 'repoName' not in data:
        return jsonify({"error": "请求数据缺失，必须包含 'repoName'"}), 400

    analysis_report = call_llm_api(data)

    return jsonify({
        "repoName": data.get('repoName'),
        "analysisReport": analysis_report
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)