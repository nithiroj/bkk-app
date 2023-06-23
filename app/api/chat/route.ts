import { StreamingTextResponse, LangChainStream, Message } from "ai";
import { CallbackManager } from "langchain/callbacks";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { AIChatMessage, HumanChatMessage } from "langchain/schema";

// import { CohereEmbeddings } from "langchain/embeddings/cohere";

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const { stream, handlers } = LangChainStream();

  const llm = new ChatOpenAI({
    streaming: true,
    callbackManager: CallbackManager.fromHandlers(handlers),
  });

  llm
    .call(
      (messages as Message[]).map((m) =>
        m.role == "user"
          ? new HumanChatMessage(m.content)
          : new AIChatMessage(m.content)
      )
    )
    .catch(console.error);

  // console.log(process.env.PINECONE_ENVIRONMENT);

  // console.log(process.env.COHERE_API_KEY);

  // const embeddings = new CohereEmbeddings({
  //   apiKey: process.env.COHERE_API_KEY, // In Node.js defaults to process.env.COHERE_API_KEY
  // });

  // const res = await embeddings.embedQuery("What a wonderful world?");
  // console.log({ res });

  return new StreamingTextResponse(stream);
}
