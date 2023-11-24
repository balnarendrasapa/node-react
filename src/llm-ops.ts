const FaissStoreM = require("langchain/vectorstores/faiss");
const PDFLoaderM = require("langchain/document_loaders/fs/pdf");
const HuggingFaceTransformersEmbeddingsM = import("langchain/embeddings/hf_transformers");

export const run = async () => {
    const FaissStore = (await FaissStoreM).FaissStore;
    const PDFLoader = (await PDFLoaderM).PDFLoader;
    const HuggingFaceTransformersEmbeddings = (
        await HuggingFaceTransformersEmbeddingsM
        ).HuggingFaceTransformersEmbeddings;
    const model = new HuggingFaceTransformersEmbeddings({
            modelName: "Xenova/all-MiniLM-L6-v2",
          });
    const loader = new PDFLoader("./files/abc.pdf");

    const vectorStore = await FaissStore.fromDocuments(
      await loader.load(),
      model
    );
    const resultOne = await vectorStore.similaritySearch("geographical", 1);
    console.log(resultOne);
    return vectorStore;
};

const main = async () => {
    const vst = await run();
    console.log("--------------------");
    console.log(await vst.similaritySearch("geographical", 1));
}

main();