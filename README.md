<h1 align="center">
        🚅 LiteLLM
    </h1>
    <p align="center">
        <p align="center">LiteLLM AI 网关</p>
        <p align="center">开源 AI 网关，支持 100+ 大模型。可自托管，企业级就绪。以 OpenAI 格式调用任意大模型。</p>
        <p align="center">
        <a href="https://render.com/deploy?repo=https://github.com/BerriAI/litellm" target="_blank" rel="nofollow"><img src="https://render.com/images/deploy-to-render-button.svg" alt="Deploy to Render" height="40"></a>
        <a href="https://railway.com/deploy/RhvhdC?referralCode=7mRv9K&utm_medium=integration&utm_source=template&utm_campaign=generic"><img src="https://railway.com/button.svg" alt="Deploy on Railway" height="40"></a>
        <a href="https://console.aws.amazon.com/cloudshell/home" target="_blank" rel="nofollow"><img src="./.github/deploy-on-aws.png" alt="Deploy on AWS" height="40"></a>
        <a href="https://ssh.cloud.google.com/cloudshell/editor?cloudshell_git_repo=https%3A%2F%2Fgithub.com%2FBerriAI%2Flitellm&cloudshell_workspace=terraform%2Flitellm%2Fgcp%2Fexamples%2Fdefault&cloudshell_tutorial=TUTORIAL.md&cloudshell_image=gcr.io/ds-artifacts-cloudshell/deploystack_custom_image&shellonly=true" target="_blank" rel="nofollow"><img src="./.github/deploy-on-gcp.png" alt="Deploy on GCP" height="40"></a>
        </p>
    </p>
<p align="center">🌐 语言 / Language：<a href="README.md">简体中文</a> · <a href="README.en.md">English</a></p>
<p align="center"><b>说明：</b>本仓库是 LiteLLM 的<strong>简体中文汉化版</strong>，除本文档中文化外，其管理后台（Dashboard）界面也已全面本地化。</p>

<h4 align="center"><a href="https://docs.litellm.ai/docs/simple_proxy" target="_blank">LiteLLM 代理服务（AI 网关）</a> | <a href="https://docs.litellm.ai/docs/enterprise#hosted-litellm-proxy" target="_blank">托管代理</a> | <a href="https://litellm.ai/enterprise"target="_blank">企业版</a> | <a href="https://www.litellm.ai/ai-gateway" target="_blank">官网</a></h4>
<h4 align="center">
    <a href="https://pypi.org/project/litellm/" target="_blank">
        <img src="https://img.shields.io/pypi/v/litellm.svg" alt="PyPI Version">
    </a>
    <a href="https://github.com/BerriAI/litellm" target="_blank">
        <img src="https://img.shields.io/github/stars/BerriAI/litellm.svg?style=social" alt="GitHub Stars">
    </a>
    <a href="https://www.ycombinator.com/companies/berriai">
        <img src="https://img.shields.io/badge/Y%20Combinator-W23-orange?style=flat-square" alt="Y Combinator W23">
    </a>
    <a href="https://wa.link/huol9n">
        <img src="https://img.shields.io/static/v1?label=Chat%20on&message=WhatsApp&color=success&logo=WhatsApp&style=flat-square" alt="Whatsapp">
    </a>
    <a href="https://discord.gg/wuPM9dRgDw">
        <img src="https://img.shields.io/static/v1?label=Chat%20on&message=Discord&color=blue&logo=Discord&style=flat-square" alt="Discord">
    </a>
    <a href="https://www.litellm.ai/support">
        <img src="https://img.shields.io/static/v1?label=Chat%20on&message=Slack&color=black&logo=Slack&style=flat-square" alt="Slack">
    </a>
    <a href="https://codspeed.io/BerriAI/litellm?utm_source=badge">
        <img src="https://img.shields.io/endpoint?url=https://codspeed.io/badge.json" alt="CodSpeed"/>
    </a>
</h4>

<img alt="LiteLLM AI Gateway" src="https://github.com/user-attachments/assets/c5ee0412-6fb5-4fb6-ab5b-bafae4209ca6" />

---

## 什么是 LiteLLM

LiteLLM 是一个开源 AI 网关，它为你提供统一接口，以 OpenAI 格式调用 100+ 大模型提供商——包括 OpenAI、Anthropic、Gemini、Bedrock、Azure 等。

你可以把它当作 **Python SDK** 直接集成到代码里，也可以把 **AI 网关（代理服务）** 部署为团队或组织的中枢服务。

[**跳转到 LiteLLM 代理（LLM 网关）文档**](https://docs.litellm.ai/docs/simple_proxy) <br>
[**跳转到已支持的大模型提供商**](https://docs.litellm.ai/docs/providers)

---

## 为什么选择 LiteLLM

跨提供商管理大模型调用很快就会变得复杂——每个模型都有不同的 SDK、鉴权方式、请求格式和错误类型。LiteLLM 消除了这些摩擦：

- **统一 API** —— 一套接口调用 100+ 大模型，无需纠缠各提供商的专用 SDK
- **即插即用的 OpenAI 兼容性** —— 切换提供商无需改写你的代码
- **生产级网关** —— 开箱即用地提供虚拟密钥、消费追踪、护栏（guardrails）、负载均衡以及管理后台
- **1k RPS 下 8ms P95 延迟**（[性能基准](https://docs.litellm.ai/docs/benchmarks)）

### 开源采用方

<table>
  <tr>
    <td><img height="60" alt="Stripe" src="https://github.com/user-attachments/assets/f7296d4f-9fbd-460d-9d05-e4df31697c4b" /></td>
    <td><img height="60" alt="image" src="https://github.com/user-attachments/assets/436fca71-988b-40bb-b5fe-8450c80fdbd0" /></td>
    <td><img height="60" alt="Google ADK" src="https://github.com/user-attachments/assets/caf270a2-5aee-45c4-8222-41a2070c4f19" /></td>
    <td><img height="60" alt="Greptile" src="https://github.com/user-attachments/assets/3db0ae72-0843-4005-a56d-bba1dde2193d" /></td>
    <td><img height="60" alt="OpenHands" src="https://github.com/user-attachments/assets/a6150c4c-149e-4cae-888b-8b92be6e003f" /></td>
    <td><h2>Netflix</h2></td>
    <td><img height="60" alt="OpenAI Agents SDK" src="https://github.com/user-attachments/assets/c02f7be0-8c2e-4d27-aea7-7c024bfaebc0" /></td>
  </tr>
</table>

---

## 功能特性

<details open>
<summary><b>大语言模型</b> - 调用 100+ 大模型（Python SDK + AI 网关）</summary>

[**所有支持的端点**](https://docs.litellm.ai/docs/supported_endpoints) - `/chat/completions`、`/responses`、`/embeddings`、`/images`、`/audio`、`/batches`、`/rerank`、`/a2a`、`/messages` 等。

### Python SDK

```shell
uv add litellm
```

```python
from litellm import completion
import os

os.environ["OPENAI_API_KEY"] = "your-openai-key"
os.environ["ANTHROPIC_API_KEY"] = "your-anthropic-key"

# OpenAI
response = completion(model="openai/gpt-4o", messages=[{"role": "user", "content": "Hello!"}])

# Anthropic  
response = completion(model="anthropic/claude-sonnet-4-20250514", messages=[{"role": "user", "content": "Hello!"}])
```

### AI 网关（代理服务）

[**快速开始 - 端到端教程**](https://docs.litellm.ai/docs/proxy/docker_quick_start) - 配置虚拟密钥，发出你的第一个请求

```shell
uv tool install 'litellm[proxy]'
litellm --model gpt-4o
```

```python
import openai

client = openai.OpenAI(api_key="anything", base_url="http://0.0.0.0:4000")
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello!"}]
)
```

[**文档：大模型提供商**](https://docs.litellm.ai/docs/providers)

</details>

<details>
<summary><b>智能体（Agents）</b> - 调用 A2A 智能体（Python SDK + AI 网关）</summary>

[**支持的提供商**](https://docs.litellm.ai/docs/a2a#add-a2a-agents) - LangGraph、Vertex AI Agent Engine、Azure AI Foundry、Bedrock AgentCore、Pydantic AI

### Python SDK - A2A 协议

```python
from litellm.a2a_protocol import A2AClient
from a2a.types import SendMessageRequest, MessageSendParams
from uuid import uuid4

client = A2AClient(base_url="http://localhost:10001")

request = SendMessageRequest(
    id=str(uuid4()),
    params=MessageSendParams(
        message={
            "role": "user",
            "parts": [{"kind": "text", "text": "Hello!"}],
            "messageId": uuid4().hex,
        }
    )
)
response = await client.send_message(request)
```

### AI 网关（代理服务）

**第 1 步.** [将你的 Agent 添加到 AI 网关](https://docs.litellm.ai/docs/a2a#adding-your-agent) —— 为每个 Agent 设置 `protocolVersion` 为 `1.0` 或 `0.3`

**第 2 步.** 通过 A2A SDK 调用 Agent（需要 `a2a-sdk>=1.1.0`）

```python
import httpx
from a2a.client import A2ACardResolver, ClientConfig, ClientFactory
from a2a.types import Message, Part, Role, SendMessageRequest
from a2a.utils.constants import TransportProtocol
from uuid import uuid4

base_url = "http://localhost:4000/a2a/my-agent"  # LiteLLM 代理 + Agent 名称
headers = {"Authorization": "Bearer <your-master-key>"}    # LiteLLM 主密钥或虚拟密钥

async with httpx.AsyncClient(headers=headers, timeout=60.0) as http_client:
    resolver = A2ACardResolver(httpx_client=http_client, base_url=base_url)
    agent_card = await resolver.get_agent_card()
    config = ClientConfig(
        httpx_client=http_client,
        streaming=False,
        supported_protocol_bindings=[TransportProtocol.JSONRPC, TransportProtocol.HTTP_JSON],
    )
    client = ClientFactory(config).create(agent_card)

    request = SendMessageRequest(
        message=Message(
            message_id=uuid4().hex,
            role=Role.ROLE_USER,
            parts=[Part(text="Hello!")],
        )
    )
    async for event in client.send_message(request):
        populated = event.ListFields()
        if populated and populated[0][0].name in ("message", "msg"):
            print("".join(getattr(p, "text", "") or "" for p in populated[0][1].parts))
```

[**文档：A2A 智能体网关**](https://docs.litellm.ai/docs/a2a)

</details>

<details>
<summary><b>MCP 工具</b> - 将 MCP 服务器连接到任意大模型（Python SDK + AI 网关）</summary>

### Python SDK - MCP 桥接

```python
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
from litellm import experimental_mcp_client
import litellm

server_params = StdioServerParameters(command="python", args=["mcp_server.py"])

async with stdio_client(server_params) as (read, write):
    async with ClientSession(read, write) as session:
        await session.initialize()

        # 以 OpenAI 格式加载 MCP 工具
        tools = await experimental_mcp_client.load_mcp_tools(session=session, format="openai")

        # 与任意 LiteLLM 模型配合使用
        response = await litellm.acompletion(
            model="gpt-4o",
            messages=[{"role": "user", "content": "What's 3 + 5?"}],
            tools=tools
        )
```

### AI 网关 - MCP 网关

**第 1 步.** [将你的 MCP 服务器添加到 AI 网关](https://docs.litellm.ai/docs/mcp#adding-your-mcp)

**第 2 步.** 通过 `/chat/completions` 调用 MCP 工具

```bash
curl -X POST 'http://0.0.0.0:4000/v1/chat/completions' \
  -H 'Authorization: Bearer <your-master-key>' \
  -H 'Content-Type: application/json' \
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "Summarize the latest open PR"}],
    "tools": [{
      "type": "mcp",
      "server_url": "litellm_proxy/mcp/github",
      "server_label": "github_mcp",
      "require_approval": "never"
    }]
  }'
```

### 配合 Cursor IDE 使用

```json
{
  "mcpServers": {
    "LiteLLM": {
      "url": "http://localhost:4000/mcp/",
      "headers": {
        "x-litellm-api-key": "Bearer <your-master-key>"
      }
    }
  }
}
```

关于 MCP OAuth：上游服务商可能会声明支持动态客户端注册（dynamic client registration），却在请求时返回 HTTP 401 或 403 予以拒绝。如果该提供商要求预先注册的 OAuth 应用，请在 MCP 服务器上配置其 `credentials.client_id`，并在需要时配置 `credentials.client_secret`。这样可跳过网关登录流程中的动态注册环节。提供商必须批准该应用的 MCP 访问权限；即使能打开其授权页面，也不代表登录或工具调用一定会成功。

[**文档：MCP 网关**](https://docs.litellm.ai/docs/mcp)

</details>

<details>
<summary><b>智能体（Agents）</b> - 在任意模型上运行 Claude Code、Codex、OpenCode 或 Deep Agents（Python SDK）</summary>

### Python SDK - 智能体

```python
import litellm
from litellm import Harness, sandbox

result = litellm.agent(
    Harness.CLAUDE_CODE,  # 或 Harness.CODEX、Harness.OPENCODE、Harness.DEEPAGENTS
    "Find why tests/test_router.py is flaky and fix it.",
    sandbox=sandbox.local("./repo"),
    model="litellm_proxy/claude-sonnet-4-5",  # 你 AI 网关上的一个模型组
)

print(result.text, result.cost, [f.path for f in result.files])
```

设置 `LITELLM_PROXY_API_BASE` 和 `LITELLM_PROXY_API_KEY` 后，智能体发出的每一次模型调用都会经由你的 AI 网关，并打上 `harness,claude_code` 标签。去掉 `litellm_proxy/` 前缀即可直接调用某个提供商。需安装 `starlette uvicorn` 以及该智能体的 CLI（`claude`、`codex` 或 `opencode`），Deep Agents 则需安装 `deepagents langchain-litellm`。

[**文档：智能体 Harness**](https://docs.litellm.ai/docs/harness)

</details>

### 已支持的提供商（[官网支持的模型](https://models.litellm.ai/) | [文档](https://docs.litellm.ai/docs/providers)）

| 提供商 | `/chat/completions` | `/messages` | `/responses` | `/embeddings` | `/image/generations` | `/audio/transcriptions` | `/audio/speech` | `/moderations` | `/batches` | `/rerank` |
|-------------------------------------------------------------------------------------|---------------------|-------------|--------------|---------------|----------------------|-------------------------|-----------------|----------------|-----------|-----------|
| [Abliteration (`abliteration`)](https://docs.litellm.ai/docs/providers/abliteration) | ✅ |  |  |  |  |  |  |  |  |  |
| [AI/ML API (`aiml`)](https://docs.litellm.ai/docs/providers/aiml) | ✅ | ✅ | ✅ | ✅ | ✅ |  |  |  |  |  |
| [AI21 (`ai21`)](https://docs.litellm.ai/docs/providers/ai21) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [AI21 Chat (`ai21_chat`)](https://docs.litellm.ai/docs/providers/ai21) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [Aleph Alpha](https://docs.litellm.ai/docs/providers/aleph_alpha) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [Amazon Nova](https://docs.litellm.ai/docs/providers/amazon_nova) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [Anthropic (`anthropic`)](https://docs.litellm.ai/docs/providers/anthropic) | ✅ | ✅ | ✅ |  |  |  |  |  | ✅ |  |
| [Anthropic Text (`anthropic_text`)](https://docs.litellm.ai/docs/providers/anthropic) | ✅ | ✅ | ✅ |  |  |  |  |  | ✅ |  |
| [Anyscale](https://docs.litellm.ai/docs/providers/anyscale) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [AssemblyAI (`assemblyai`)](https://docs.litellm.ai/docs/pass_through/assembly_ai) | ✅ | ✅ | ✅ |  |  | ✅ |  |  |  |  |
| [Auto Router (`auto_router`)](https://docs.litellm.ai/docs/proxy/auto_routing) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [AWS - Bedrock (`bedrock`)](https://docs.litellm.ai/docs/providers/bedrock) | ✅ | ✅ | ✅ | ✅ |  |  |  |  |  | ✅ |
| [AWS - Sagemaker (`sagemaker`)](https://docs.litellm.ai/docs/providers/aws_sagemaker) | ✅ | ✅ | ✅ | ✅ |  |  |  |  |  |  |
| [Azure (`azure`)](https://docs.litellm.ai/docs/providers/azure) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |  |
| [Azure AI (`azure_ai`)](https://docs.litellm.ai/docs/providers/azure_ai) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |  |
| [Azure Text (`azure_text`)](https://docs.litellm.ai/docs/providers/azure) | ✅ | ✅ | ✅ |  |  | ✅ | ✅ | ✅ | ✅ |  |
| [Baseten (`baseten`)](https://docs.litellm.ai/docs/providers/baseten) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [Bytez (`bytez`)](https://docs.litellm.ai/docs/providers/bytez) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [Cerebras (`cerebras`)](https://docs.litellm.ai/docs/providers/cerebras) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [Clarifai (`clarifai`)](https://docs.litellm.ai/docs/providers/clarifai) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [Cloudflare AI Workers (`cloudflare`)](https://docs.litellm.ai/docs/providers/cloudflare_workers) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [Codestral (`codestral`)](https://docs.litellm.ai/docs/providers/codestral) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [Cognition (`cognition`)](https://docs.litellm.ai/docs/providers/cognition) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [Cohere (`cohere`)](https://docs.litellm.ai/docs/providers/cohere) | ✅ | ✅ | ✅ | ✅ |  |  |  |  |  | ✅ |
| [Cohere Chat (`cohere_chat`)](https://docs.litellm.ai/docs/providers/cohere) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [CometAPI (`cometapi`)](https://docs.litellm.ai/docs/providers/cometapi) | ✅ | ✅ | ✅ | ✅ |  |  |  |  |  |  |
| [CompactifAI (`compactifai`)](https://docs.litellm.ai/docs/providers/compactifai) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [Custom (`custom`)](https://docs.litellm.ai/docs/providers/custom_llm_server) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [Custom OpenAI (`custom_openai`)](https://docs.litellm.ai/docs/providers/openai_compatible) | ✅ | ✅ | ✅ |  |  | ✅ | ✅ | ✅ | ✅ |  |
| [Dashscope (`dashscope`)](https://docs.litellm.ai/docs/providers/dashscope) | ✅ | ✅ | ✅ | ✅ |  |  |  |  |  | ✅ |
| [Databricks (`databricks`)](https://docs.litellm.ai/docs/providers/databricks) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [DataRobot (`datarobot`)](https://docs.litellm.ai/docs/providers/datarobot) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [Deepgram (`deepgram`)](https://docs.litellm.ai/docs/providers/deepgram) | ✅ | ✅ | ✅ |  |  | ✅ |  |  |  |  |
| [DeepInfra (`deepinfra`)](https://docs.litellm.ai/docs/providers/deepinfra) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [Deepseek (`deepseek`)](https://docs.litellm.ai/docs/providers/deepseek) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [Eden AI (`edenai`)](https://docs.litellm.ai/docs/providers/edenai) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |  |  |  |
| [ElevenLabs (`elevenlabs`)](https://docs.litellm.ai/docs/providers/elevenlabs) | ✅ | ✅ | ✅ |  |  | ✅ | ✅ |  |  |  |
| [Empower (`empower`)](https://docs.litellm.ai/docs/providers/empower) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [Fal AI (`fal_ai`)](https://docs.litellm.ai/docs/providers/fal_ai) | ✅ | ✅ | ✅ |  | ✅ |  |  |  |  |  |
| [Featherless AI (`featherless_ai`)](https://docs.litellm.ai/docs/providers/featherless_ai) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [Fireworks AI (`fireworks_ai`)](https://docs.litellm.ai/docs/providers/fireworks_ai) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [FriendliAI (`friendliai`)](https://docs.litellm.ai/docs/providers/friendliai) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [Galadriel (`galadriel`)](https://docs.litellm.ai/docs/providers/galadriel) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [GitHub Copilot (`github_copilot`)](https://docs.litellm.ai/docs/providers/github_copilot) | ✅ | ✅ | ✅ | ✅ |  |  |  |  |  |  |
| [GitHub Models (`github`)](https://docs.litellm.ai/docs/providers/github) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [Google - PaLM](https://docs.litellm.ai/docs/providers/palm) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [Google - Vertex AI (`vertex_ai`)](https://docs.litellm.ai/docs/providers/vertex) | ✅ | ✅ | ✅ | ✅ | ✅ |  |  |  |  |  |
| [Google AI Studio - Gemini (`gemini`)](https://docs.litellm.ai/docs/providers/gemini) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [GradientAI (`gradient_ai`)](https://docs.litellm.ai/docs/providers/gradient_ai) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [Groq AI (`groq`)](https://docs.litellm.ai/docs/providers/groq) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [Heroku (`heroku`)](https://docs.litellm.ai/docs/providers/heroku) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [Hosted VLLM (`hosted_vllm`)](https://docs.litellm.ai/docs/providers/vllm) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [Huggingface (`huggingface`)](https://docs.litellm.ai/docs/providers/huggingface) | ✅ | ✅ | ✅ | ✅ |  |  |  |  |  | ✅ |
| [Hyperbolic (`hyperbolic`)](https://docs.litellm.ai/docs/providers/hyperbolic) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [IBM - Watsonx.ai (`watsonx`)](https://docs.litellm.ai/docs/providers/watsonx) | ✅ | ✅ | ✅ | ✅ |  |  |  |  |  |  |
| [Infinity (`infinity`)](https://docs.litellm.ai/docs/providers/infinity) |  |  |  | ✅ |  |  |  |  |  |  |
| [Jina AI (`jina_ai`)](https://docs.litellm.ai/docs/providers/jina_ai) |  |  |  | ✅ |  |  |  |  |  |  |
| [Lambda AI (`lambda_ai`)](https://docs.litellm.ai/docs/providers/lambda_ai) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [Lemonade (`lemonade`)](https://docs.litellm.ai/docs/providers/lemonade) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [LiteLLM Proxy (`litellm_proxy`)](https://docs.litellm.ai/docs/providers/litellm_proxy) | ✅ | ✅ | ✅ | ✅ | ✅ |  |  |  |  |  |
| [Llamafile (`llamafile`)](https://docs.litellm.ai/docs/providers/llamafile) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [LM Studio (`lm_studio`)](https://docs.litellm.ai/docs/providers/lm_studio) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [Maritalk (`maritalk`)](https://docs.litellm.ai/docs/providers/maritalk) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [Meta - Llama API (`meta_llama`)](https://docs.litellm.ai/docs/providers/meta_llama) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [Mistral AI API (`mistral`)](https://docs.litellm.ai/docs/providers/mistral) | ✅ | ✅ | ✅ | ✅ |  |  |  |  |  |  |
| [ModelScope (`modelscope`)](https://docs.litellm.ai/docs/providers/modelscope) | ✅ | ✅ | ✅ |  | ✅ |  |  |  |  |  |
| [Moonshot (`moonshot`)](https://docs.litellm.ai/docs/providers/moonshot) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [Morph (`morph`)](https://docs.litellm.ai/docs/providers/morph) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [Nebius AI Studio (`nebius`)](https://docs.litellm.ai/docs/providers/nebius) | ✅ | ✅ | ✅ | ✅ |  |  |  |  |  |  |
| [NLP Cloud (`nlp_cloud`)](https://docs.litellm.ai/docs/providers/nlp_cloud) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [Novita AI (`novita`)](https://novita.ai/models/llm?utm_source=github_litellm&utm_medium=github_readme&utm_campaign=github_link) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [Nscale (`nscale`)](https://docs.litellm.ai/docs/providers/nscale) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [Nvidia NIM (`nvidia_nim`)](https://docs.litellm.ai/docs/providers/nvidia_nim) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [OCI (`oci`)](https://docs.litellm.ai/docs/providers/oci) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [Ollama (`ollama`)](https://docs.litellm.ai/docs/providers/ollama) | ✅ | ✅ | ✅ | ✅ |  |  |  |  |  |  |
| [Ollama Chat (`ollama_chat`)](https://docs.litellm.ai/docs/providers/ollama) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [Oobabooga (`oobabooga`)](https://docs.litellm.ai/docs/providers/openai_compatible) | ✅ | ✅ | ✅ |  |  | ✅ | ✅ | ✅ | ✅ |  |
| [OpenAI (`openai`)](https://docs.litellm.ai/docs/providers/openai) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |  |
| [OpenAI-like (`openai_like`)](https://docs.litellm.ai/docs/providers/openai_compatible) |  |  |  | ✅ |  |  |  |  |  |  |
| [OpenRouter (`openrouter`)](https://docs.litellm.ai/docs/providers/openrouter) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [OVHCloud AI Endpoints (`ovhcloud`)](https://docs.litellm.ai/docs/providers/ovhcloud) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [Perplexity AI (`perplexity`)](https://docs.litellm.ai/docs/providers/perplexity) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [Petals (`petals`)](https://docs.litellm.ai/docs/providers/petals) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [Pinstripes (`pinstripes`)](https://docs.litellm.ai/docs/providers/pinstripes) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [Predibase (`predibase`)](https://docs.litellm.ai/docs/providers/predibase) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [Qianwen AI Platform (`qwen_ai_platform`)](https://docs.litellm.ai/docs/providers/qwencloud) | ✅ | ✅ | ✅ | ✅ | ✅ |  |  |  |  | ✅ |
| [QwenCloud (`qwencloud`)](https://docs.litellm.ai/docs/providers/qwencloud) | ✅ | ✅ | ✅ | ✅ | ✅ |  |  |  |  | ✅ |
| [Recraft (`recraft`)](https://docs.litellm.ai/docs/providers/recraft) |  |  |  |  | ✅ |  |  |  |  |  |
| [Replicate (`replicate`)](https://docs.litellm.ai/docs/providers/replicate) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [Sagemaker Chat (`sagemaker_chat`)](https://docs.litellm.ai/docs/providers/aws_sagemaker) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [Sail (`sail`)](https://docs.litellm.ai/docs/providers/sail) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [Sambanova (`sambanova`)](https://docs.litellm.ai/docs/providers/sambanova) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [Snowflake (`snowflake`)](https://docs.litellm.ai/docs/providers/snowflake) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [Strands Decider (`strands_decider`)](https://docs.litellm.ai/docs/providers) |  |  |  |  |  |  |  |  |  |  |
| [Text Completion Codestral (`text-completion-codestral`)](https://docs.litellm.ai/docs/providers/codestral) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [Text Completion OpenAI (`text-completion-openai`)](https://docs.litellm.ai/docs/providers/text_completion_openai) | ✅ | ✅ | ✅ |  |  | ✅ | ✅ | ✅ | ✅ |  |
| [Together AI (`together_ai`)](https://docs.litellm.ai/docs/providers/togetherai) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [Topaz (`topaz`)](https://docs.litellm.ai/docs/providers/topaz) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [Triton (`triton`)](https://docs.litellm.ai/docs/providers/triton-inference-server) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [Typesafe Decisions API (`typesafe`)](https://docs.litellm.ai/docs/providers) |  |  |  |  |  |  |  |  |  |  |
| [V0 (`v0`)](https://docs.litellm.ai/docs/providers/v0) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [Vercel AI Gateway (`vercel_ai_gateway`)](https://docs.litellm.ai/docs/providers/vercel_ai_gateway) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [VLLM (`vllm`)](https://docs.litellm.ai/docs/providers/vllm) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [Volcengine (`volcengine`)](https://docs.litellm.ai/docs/providers/volcano) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [Voyage AI (`voyage`)](https://docs.litellm.ai/docs/providers/voyage) |  |  |  | ✅ |  |  |  |  |  |  |
| [WandB Inference (`wandb`)](https://docs.litellm.ai/docs/providers/wandb_inference) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [Watsonx Text (`watsonx_text`)](https://docs.litellm.ai/docs/providers/watsonx) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [xAI (`xai`)](https://docs.litellm.ai/docs/providers/xai) | ✅ | ✅ | ✅ |  |  |  |  |  |  |  |
| [Xinference (`xinference`)](https://docs.litellm.ai/docs/providers/xinference) |  |  |  | ✅ |  |  |  |  |  |  |

[**阅读文档**](https://docs.litellm.ai/docs/)

---

## 快速开始

你可以通过代理服务或 Python SDK 使用 LiteLLM，两者都为你提供统一的接口来访问 100+ 大模型。请根据你的需求选择最合适的方式：

<table style={{width: '100%', tableLayout: 'fixed'}}>
<thead>
<tr>
<th style={{width: '14%'}}></th>
<th style={{width: '43%'}}><strong><a href="https://docs.litellm.ai/docs/simple_proxy">LiteLLM AI 网关</a></strong></th>
<th style={{width: '43%'}}><strong><a href="https://docs.litellm.ai/docs/">LiteLLM Python SDK</a></strong></th>
</tr>
</thead>
<tbody>
<tr>
<td style={{width: '14%'}}><strong>适用场景</strong></td>
<td style={{width: '43%'}}>作为中枢服务（LLM 网关）访问多个大模型</td>
<td style={{width: '43%'}}>在你的 Python 代码中直接使用 LiteLLM</td>
</tr>
<tr>
<td style={{width: '14%'}}><strong>使用者</strong></td>
<td style={{width: '43%'}}>Gen AI 赋能团队 / ML 平台团队</td>
<td style={{width: '43%'}}>开发 LLM 项目的开发者</td>
</tr>
<tr>
<td style={{width: '14%'}}><strong>核心特性</strong></td>
<td style={{width: '43%'}}>集中式 API 网关，带身份认证与鉴权；按项目/用户的多租户成本核算与消费管理；按项目定制（日志、护栏、缓存）；用于安全访问控制的虚拟密钥；用于监控与管理的管理后台 UI</td>
<td style={{width: '43%'}}>在代码库中进行直接的 Python 库集成；跨多个部署（如 Azure/OpenAI）具备重试/回退逻辑的 Router - <a href="https://docs.litellm.ai/docs/routing">Router</a>；应用层负载均衡与成本追踪；以 OpenAI 兼容错误进行异常处理；可观测性回调（Lunary、MLflow、Langfuse 等）</td>
</tr>
</tbody>
</table>

**稳定版：** 使用带有 `-stable` 标签的 Docker 镜像。这些镜像在发布前会经过 12 小时负载测试。[关于发布周期的更多信息](https://docs.litellm.ai/docs/proxy/release_cycle)

如需支持更多提供商。若缺少某个提供商或 LLM 平台，请提交[功能请求](https://github.com/BerriAI/litellm/issues/new?assignees=&labels=enhancement&projects=&template=feature_request.yml&title=%5BFeature%5D%3A+)。

### 使用 Terraform 在 AWS 或 GCP 上部署

使用已发布的 Terraform 模块，将 LiteLLM 代理作为一个生产级、组件化的技术栈来运行（网关、后端、UI 拆分为独立服务；托管的 Postgres + Redis + 对象存储）。两个模块都位于[公共 Terraform Registry](https://registry.terraform.io/namespaces/BerriAI)——无需鉴权。

#### AWS — ECS Fargate + Aurora + ElastiCache + ALB

[![Launch in AWS CloudShell](https://img.shields.io/badge/Launch-AWS_CloudShell-FF9900?logo=amazon-aws&logoColor=white)](https://console.aws.amazon.com/cloudshell/home) —— 打开一个已在浏览器内的 shell，并已通过你的 AWS 账号鉴权。进入后运行：

```bash
git clone https://github.com/BerriAI/litellm.git
cd litellm/terraform/litellm/aws/examples/default
cp terraform.tfvars.example terraform.tfvars   # 编辑 region/tenant/env
terraform init && terraform apply
```

[模块页面 →](https://registry.terraform.io/modules/BerriAI/litellm/aws/latest)

或者从你自己的根配置中调用该模块：

```hcl
# main.tf
terraform {
  required_version = ">= 1.6.0"
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.60" }
  }
}

provider "aws" {
  region = "us-west-2"
}

module "litellm" {
  source  = "BerriAI/litellm/aws"
  version = "~> 1.89"

  region = "us-west-2"
  azs    = ["us-west-2a", "us-west-2b"]
  tenant = "acme"
  env    = "prod"

  # 生产环境：请提供 ACM 证书。若没有，可设置 allow_plaintext_alb = true
  # （仅限开发/试用）。
  # acm_certificate_arn = "arn:aws:acm:us-west-2:111122223333:certificate/..."
  allow_plaintext_alb = true
}

output "litellm_url" {
  value = module.litellm.alb_dns_name
}
```

```bash
terraform init
terraform apply
```

提供商的 API 密钥存放在 AWS Secrets Manager 中；通过 `gateway_extra_secrets` 引用其 ARN。完整的输入参数列表与架构图见[注册表页面](https://registry.terraform.io/modules/BerriAI/litellm/aws/latest?tab=inputs)。

#### GCP — Cloud Run + Cloud SQL + Memorystore + HTTPS 负载均衡

[![Open in Cloud Shell](https://gstatic.com/cloudssh/images/open-btn.png)](https://ssh.cloud.google.com/cloudshell/editor?cloudshell_git_repo=https%3A%2F%2Fgithub.com%2FBerriAI%2Flitellm&cloudshell_workspace=terraform%2Flitellm%2Fgcp%2Fexamples%2Fdefault&cloudshell_tutorial=TUTORIAL.md&cloudshell_image=gcr.io/ds-artifacts-cloudshell/deploystack_custom_image&shellonly=true)

真正的"一键部署"。打开 Cloud Shell，克隆本仓库，并通过内置的 [DeployStack 教程](./terraform/litellm/gcp/examples/default/TUTORIAL.md) 引导你完成 `terraform apply` —— 选择项目后，教程会帮你建立 Artifact Registry 远程仓库，根据你的回答写入 `terraform.tfvars`，并运行 apply。

[模块页面 →](https://registry.terraform.io/modules/BerriAI/litellm/google/latest)

若要从你自己的配置调用该模块（而非一键部署），由于 Cloud Run 无法直接拉取 `ghcr.io` 的镜像，需先建立一个由 GHCR 支撑的一次性 Artifact Registry 远程仓库：

```bash
gcloud artifacts repositories create litellm \
  --location=us-central1 \
  --repository-format=docker \
  --mode=remote-repository \
  --remote-docker-repo=https://ghcr.io \
  --project=my-gcp-project
```

然后：

```hcl
# main.tf
terraform {
  required_version = ">= 1.6.0"
  required_providers {
    google      = { source = "hashicorp/google",      version = "~> 6.10" }
    google-beta = { source = "hashicorp/google-beta", version = "~> 6.10" }
  }
}

provider "google"      { project = "my-gcp-project"; region = "us-central1" }
provider "google-beta" { project = "my-gcp-project"; region = "us-central1" }

module "litellm" {
  source  = "BerriAI/litellm/google"
  version = "~> 1.89"

  project_id = "my-gcp-project"
  region     = "us-central1"
  tenant     = "acme"
  env        = "prod"

  # 将 my-gcp-project 替换为你的 GCP 项目 ID（与上面的 project_id 相同）。
  image_registry = "us-central1-docker.pkg.dev/my-gcp-project/litellm/berriai"

  # 生产环境：请提供已指向 LB IP 的 DNS，以使用 Google 托管的证书。
  # 若没有，可设置 allow_plaintext_lb = true（仅限开发/试用）。
  # lb_domains         = ["proxy.example.com"]
  allow_plaintext_lb = true
}

output "litellm_url" {
  value = module.litellm.load_balancer_url
}
```

```bash
terraform init
terraform apply
```

提供商的 API 密钥存放在 Secret Manager 中；通过 `gateway_extra_secrets` 引用资源 ID（例如 `projects/my-gcp-project/secrets/openai-api-key`）。完整的输入参数列表与架构图见[注册表页面](https://registry.terraform.io/modules/BerriAI/litellm/google/latest?tab=inputs)。

#### 两套方案均包含

- 完整的组件化拆分（网关 / 后端 / UI 作为独立服务）
- 托管的 Postgres（主库 + 只读库）与 Redis
- 用于代理状态与文件上传的版本化对象存储
- 在你云平台的 Secret Manager 中自动生成的 `LITELLM_MASTER_KEY`
- 在代理启动前运行 `prisma migrate deploy` 的一次性迁移任务
- 与 [Helm 图表](./helm/litellm/) 相同的 `proxy_config` 接口 —— 以类型化 map 形式传入 YAML

Terraform 模块位于本仓库的 [`terraform/litellm/aws/`](./terraform/litellm/aws/) 与 [`terraform/litellm/gcp/`](./terraform/litellm/gcp/)；注册表条目是每次发布时更新的只读镜像。

### 以开发者模式运行
#### 服务
1. 在仓库根目录创建 `.env` 文件
2. 运行依赖服务：`docker-compose up db prometheus`

#### 后端
1. 运行 `make bootstrap`
2. 启动代理后端：`uv run python litellm/proxy/proxy_cli.py`

#### 前端
1. 进入 `ui/litellm-dashboard`（依赖已通过 `make bootstrap` 安装）
2. 启动 Dashboard：`npm run dev`

### 校验 Docker 镜像签名

发布到 GHCR 的所有 LiteLLM Docker 镜像均使用 [cosign](https://docs.sigstore.dev/cosign/overview/) 进行签名。每个发布版本都使用 [commit `0112e53`](https://github.com/BerriAI/litellm/commit/0112e53046018d726492c814b3644b7d376029d0) 中引入的同一把密钥进行签名。

**使用固定的提交哈希校验（推荐）：**

提交哈希在密码学上不可变，因此这是确保你使用的是原始签名密钥的最强方式：

```bash
cosign verify \
  --key https://raw.githubusercontent.com/BerriAI/litellm/0112e53046018d726492c814b3644b7d376029d0/cosign.pub \
  ghcr.io/berriai/litellm:<release-tag>
```

**使用发布标签校验（便捷方式）：**

标签在本仓库中受保护，并解析为同一把密钥。这种方式更易读，但依赖于标签保护规则：

```bash
cosign verify \
  --key https://raw.githubusercontent.com/BerriAI/litellm/<release-tag>/cosign.pub \
  ghcr.io/berriai/litellm:<release-tag>
```

将 `<release-tag>` 替换为你所部署的版本（例如 `v1.83.0-stable`）。

---

# 企业版
面向需要更强安全性、用户管理与专业技术支持的公司

[获取企业版授权](https://litellm.ai/enterprise)
[与创始人交流](https://enterprise.litellm.ai/demo)

企业版涵盖：
- ✅ **[LiteLLM 商业许可证](https://docs.litellm.ai/docs/proxy/enterprise) 下的功能：**
- ✅ **功能优先级排序**
- ✅ **自定义集成**
- ✅ **专业支持 - 专属 Discord + Slack**
- ✅ **自定义 SLA**
- ✅ **通过单点登录（SSO）实现安全访问**

# 贡献指南

我们欢迎对 LiteLLM 的贡献！无论你是修复 bug、新增功能，还是改进文档，我们都感谢你的帮助。

## 贡献者快速开始

需先安装 uv。

```bash
git clone https://github.com/BerriAI/litellm.git
cd litellm
make install-dev    # 安装开发依赖
make format         # 格式化你的代码
make lint           # 运行所有 lint 检查
make test-unit      # 运行单元测试
make format-check   # 仅检查格式
```

详细的贡献指南见 [CONTRIBUTING.md](CONTRIBUTING.md)。

> **📖 想贡献文档？** LiteLLM 的文档已迁移到独立的仓库：[BerriAI/litellm-docs](https://github.com/BerriAI/litellm-docs)。请在那里提交文档 PR。文档托管于 [docs.litellm.ai](https://docs.litellm.ai)。

## 代码质量 / 静态检查

LiteLLM 遵循 [Google Python 风格指南](https://google.github.io/styleguide/pyguide.html)。

我们的自动化检查包括：
- **Ruff** - 用于格式化、lint 与代码质量
- **basedpyright** - 用于类型检查
- **循环依赖检测**
- **导入安全检测**

你的 PR 合并前，以上所有检查都必须通过。

# 贡献者

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

<a href="https://github.com/BerriAI/litellm/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=BerriAI/litellm" />
</a>
